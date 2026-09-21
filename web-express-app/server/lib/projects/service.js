const path = require('path');
const db = require('./db');
const C = require('./constants');
const L = require('./logic');

const digits = s => String(s || '').replace(/\D/g, '');
const jstr = v => (v === undefined || v === null ? null : JSON.stringify(v));

// ── Auditoría ────────────────────────────────────────────────────────────────
async function audit({ projectId = null, clientId = null, action, from = null, to = null, detail = null, actor = 'sistema' }) {
  try {
    await db.run(
      `INSERT INTO PjAudit (projectId, clientId, action, fromValue, toValue, detail, actor) VALUES (?,?,?,?,?,?,?)`,
      [projectId, clientId, action, from, to, jstr(detail), actor]
    );
  } catch (e) { console.error('[projects-audit]', e.message); }
}

// ── Clientes ─────────────────────────────────────────────────────────────────
const CLIENT_FIELDS = ['firstName', 'lastName', 'business', 'rut', 'email', 'phone', 'whatsapp', 'city', 'region', 'origin', 'waRef', 'notes', 'assignedTo', 'lastContactAt'];

function cleanStr(v, max = 500) { return v === undefined || v === null ? null : String(v).trim().slice(0, max) || null; }

function pickClient(data) {
  const out = {};
  for (const f of CLIENT_FIELDS) {
    if (data[f] === undefined) continue;
    if (f === 'lastContactAt') { out[f] = data[f] ? new Date(data[f]) : null; continue; }
    out[f] = f === 'notes' ? (data[f] === null ? null : String(data[f]).slice(0, 20000)) : cleanStr(data[f]);
  }
  if (out.email) out.email = out.email.toLowerCase();
  if (out.whatsapp) out.whatsapp = digits(out.whatsapp) || null;
  if (out.phone) out.phone = digits(out.phone) || null;
  return out;
}

async function findClient({ email, whatsapp, phone }) {
  if (email) {
    const r = await db.query('SELECT * FROM PjClient WHERE email = ? LIMIT 1', [String(email).toLowerCase()]);
    if (r[0]) return r[0];
  }
  const d = digits(whatsapp || phone);
  if (d) {
    const r = await db.query('SELECT * FROM PjClient WHERE whatsapp = ? OR phone = ? LIMIT 1', [d, d]);
    if (r[0]) return r[0];
  }
  return null;
}

async function createClient(data, actor) {
  const c = pickClient(data);
  if (!c.firstName && !c.business && !c.email && !c.whatsapp) throw httpError(400, 'Ingresa al menos un nombre, negocio, email o WhatsApp');
  const cols = Object.keys(c);
  const res = await db.run(`INSERT INTO PjClient (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')})`, cols.map(k => c[k]));
  await audit({ clientId: res.insertId, action: 'cliente_creado', detail: { business: c.business, email: c.email }, actor });
  return getClient(res.insertId);
}

async function updateClient(id, data, actor) {
  const before = await getClient(id);
  if (!before) throw httpError(404, 'Cliente no encontrado');
  const c = pickClient(data);
  const cols = Object.keys(c);
  if (cols.length) {
    await db.run(`UPDATE PjClient SET ${cols.map(k => `${k}=?`).join(',')} WHERE id=?`, [...cols.map(k => c[k]), id]);
    await audit({ clientId: id, action: 'cliente_editado', detail: { fields: cols }, actor });
    if (c.assignedTo !== undefined && c.assignedTo !== before.assignedTo) {
      await audit({ clientId: id, action: 'responsable_cambiado', from: before.assignedTo, to: c.assignedTo, actor });
    }
  }
  return getClient(id);
}

async function getClient(id) {
  const r = await db.query('SELECT * FROM PjClient WHERE id = ?', [id]);
  return r[0] || null;
}

async function listClients({ q, origin, limit = 200, offset = 0 } = {}) {
  const where = [], params = [];
  if (q) { const like = `%${q}%`; where.push(`(firstName LIKE ? OR lastName LIKE ? OR business LIKE ? OR email LIKE ? OR whatsapp LIKE ? OR phone LIKE ?)`); params.push(like, like, like, like, like, like); }
  if (origin) { where.push('origin = ?'); params.push(origin); }
  const w = where.length ? `WHERE ${where.join(' AND ')}` : '';
  return db.query(
    `SELECT c.*, (SELECT COUNT(*) FROM PjProject p WHERE p.clientId = c.id) AS projectCount FROM PjClient c ${w} ORDER BY c.createdAt DESC LIMIT ? OFFSET ?`,
    [...params, Math.min(Number(limit) || 200, 500), Number(offset) || 0]
  );
}

// ── Proyectos ────────────────────────────────────────────────────────────────
const PROJECT_EDITABLE = ['name', 'tradeName', 'serviceType', 'payMethod', 'assignedTo', 'serverName', 'stagingUrl', 'productionUrl', 'repoUrl', 'deployStatus'];

async function createProject({ clientId, name, tradeName, serviceType, netAmount, depositPct, orderId = null, status = 'lead_nuevo', payMethod = null, info = null, assignedTo = null }, actor) {
  const client = await getClient(clientId);
  if (!client) throw httpError(404, 'Cliente no encontrado');
  const amounts = L.computeAmounts(netAmount ?? C.DEFAULT_NET, depositPct ?? C.DEFAULT_DEPOSIT_PCT);
  if (!C.STATUS_KEYS.includes(status)) throw httpError(400, 'Estado inválido');
  const res = await db.run(
    `INSERT INTO PjProject (clientId,name,tradeName,serviceType,status,paymentStatus,payMethod,netAmount,ivaRate,totalAmount,depositPct,depositAmount,balanceAmount,orderId,info,assignedTo)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [clientId, cleanStr(name, 191) || client.business || 'Proyecto', cleanStr(tradeName, 191), cleanStr(serviceType, 100) || 'Landing Page', status,
      'abono_pendiente', payMethod, amounts.netAmount, amounts.ivaRate, amounts.totalAmount, amounts.depositPct, amounts.depositAmount, amounts.balanceAmount,
      orderId, info ? JSON.stringify(info) : null, assignedTo]
  );
  await audit({ projectId: res.insertId, clientId, action: 'proyecto_creado', to: status, detail: { orderId, total: amounts.totalAmount }, actor });
  return res.insertId;
}

async function getProjectRow(id) {
  const r = await db.query('SELECT * FROM PjProject WHERE id = ?', [id]);
  return r[0] || null;
}

async function getProjectFull(id) {
  const p = await getProjectRow(id);
  if (!p) return null;
  const [client, payments, versions, feedback, files, history] = await Promise.all([
    getClient(p.clientId),
    db.query('SELECT * FROM PjPayment WHERE projectId = ? ORDER BY paidAt DESC, id DESC', [id]),
    db.query('SELECT * FROM PjVersion WHERE projectId = ? ORDER BY number DESC', [id]),
    db.query('SELECT * FROM PjFeedback WHERE projectId = ? ORDER BY id DESC', [id]),
    db.query('SELECT * FROM PjFile WHERE projectId = ? ORDER BY createdAt DESC', [id]),
    db.query('SELECT * FROM PjAudit WHERE projectId = ? ORDER BY id DESC LIMIT 300', [id]),
  ]);
  const info = L.parseInfo(p.info);
  const completeness = L.computeCompleteness(info, files, client || {});
  return {
    project: { ...p, info },
    client, payments, versions, feedback, files, history: history.map(h => ({ ...h, detail: safeParse(h.detail) })),
    completeness,
    nextAction: L.nextAction(p, { info, completeness, versions }),
    aiBrief: require('./ai/AIProjectService').buildBrief(p, client || {}, info, files, versions),
  };
}
function safeParse(s) { try { return s ? JSON.parse(s) : null; } catch { return null; } }

async function updateProject(id, data, actor) {
  const p = await getProjectRow(id);
  if (!p) throw httpError(404, 'Proyecto no encontrado');
  const set = {};
  for (const f of PROJECT_EDITABLE) if (data[f] !== undefined) set[f] = cleanStr(data[f], f.endsWith('Url') ? 500 : 191);
  if (data.netAmount !== undefined || data.depositPct !== undefined) {
    if (['abono_pagado', 'pago_completo'].includes(p.paymentStatus) && data.netAmount !== undefined && Number(data.netAmount) !== p.netAmount) {
      throw httpError(400, 'No se puede cambiar el valor de un proyecto con pagos registrados');
    }
    Object.assign(set, L.computeAmounts(data.netAmount ?? p.netAmount, data.depositPct ?? p.depositPct));
  }
  if (data.infoSufficient !== undefined) set.infoSufficient = data.infoSufficient ? 1 : 0;
  if (data.info) {
    const cur = L.parseInfo(p.info);
    const merged = {
      site: { ...cur.site, ...(data.info.site || {}) },
      visual: { ...cur.visual, ...(data.info.visual || {}) },
      content: { ...cur.content, ...(data.info.content || {}) },
      free: data.info.free !== undefined ? String(data.info.free).slice(0, 100000) : cur.free,
    };
    set.info = JSON.stringify(merged);
  }
  const cols = Object.keys(set);
  if (!cols.length) return getProjectFull(id);
  await db.run(`UPDATE PjProject SET ${cols.map(k => `${k}=?`).join(',')} WHERE id=?`, [...cols.map(k => set[k]), id]);
  const audited = cols.filter(k => k !== 'info');
  if (data.info) await audit({ projectId: id, clientId: p.clientId, action: 'info_editada', detail: { sections: Object.keys(data.info) }, actor });
  if (audited.length) await audit({ projectId: id, clientId: p.clientId, action: 'proyecto_editado', detail: { fields: audited }, actor });
  if (set.assignedTo !== undefined && set.assignedTo !== p.assignedTo) {
    await audit({ projectId: id, clientId: p.clientId, action: 'responsable_cambiado', from: p.assignedTo, to: set.assignedTo, actor });
  }
  if (data.infoSufficient !== undefined && !!data.infoSufficient !== !!p.infoSufficient) {
    await audit({ projectId: id, clientId: p.clientId, action: 'info_suficiente', to: data.infoSufficient ? 'sí' : 'no', actor });
  }
  return getProjectFull(id);
}

async function changeStatus(id, newStatus, actor, note = null) {
  if (!C.STATUS_KEYS.includes(newStatus)) throw httpError(400, 'Estado inválido');
  const p = await getProjectRow(id);
  if (!p) throw httpError(404, 'Proyecto no encontrado');
  if (p.status === newStatus) return p;
  const extra = [];
  if (['info_completa', 'listo_produccion'].includes(newStatus) && !p.infoReceivedAt) extra.push('infoReceivedAt = NOW(3)');
  await db.run(`UPDATE PjProject SET status = ?${extra.length ? ', ' + extra.join(',') : ''} WHERE id = ?`, [newStatus, id]);
  await audit({ projectId: id, clientId: p.clientId, action: 'estado_cambiado', from: p.status, to: newStatus, detail: note ? { note } : null, actor });
  return { ...p, status: newStatus };
}

async function listProjects(f = {}) {
  const where = [], params = [];
  if (f.q) {
    const like = `%${f.q}%`;
    where.push(`(c.firstName LIKE ? OR c.lastName LIKE ? OR c.business LIKE ? OR c.email LIKE ? OR c.whatsapp LIKE ? OR c.phone LIKE ? OR p.name LIKE ? OR p.tradeName LIKE ? OR p.info LIKE ? OR CAST(p.id AS CHAR) = ?)`);
    params.push(like, like, like, like, like, like, like, like, like, String(f.q).replace(/^#/, ''));
  }
  if (f.status) { const arr = String(f.status).split(',').filter(s => C.STATUS_KEYS.includes(s)); if (arr.length) { where.push(`p.status IN (${arr.map(() => '?').join(',')})`); params.push(...arr); } }
  if (f.group) {
    const groups = {
      pendientes_info: ['abono_recibido', 'esperando_info', 'info_incompleta'],
      desarrollo: ['listo_produccion', 'info_completa', 'en_desarrollo', 'cambios_solicitados'],
      revision: ['v1_lista', 'esperando_revision', 'v2_lista'],
      finalizados: ['publicado', 'finalizado'],
      activos: C.STATUS_KEYS.filter(k => !['finalizado', 'cancelado'].includes(k)),
    };
    const arr = groups[f.group];
    if (arr) { where.push(`p.status IN (${arr.map(() => '?').join(',')})`); params.push(...arr); }
  }
  if (f.assignedTo) { where.push('p.assignedTo = ?'); params.push(f.assignedTo); }
  if (f.origin) { where.push('c.origin = ?'); params.push(f.origin); }
  if (f.paymentStatus) { where.push('p.paymentStatus = ?'); params.push(f.paymentStatus); }
  if (f.serviceType) { where.push('p.serviceType = ?'); params.push(f.serviceType); }
  if (f.from) { where.push('p.createdAt >= ?'); params.push(new Date(f.from)); }
  if (f.to) { where.push('p.createdAt <= ?'); params.push(new Date(f.to)); }
  if (f.clientId) { where.push('p.clientId = ?'); params.push(Number(f.clientId)); }
  const w = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const rows = await db.query(
    `SELECT p.id, p.clientId, p.name, p.tradeName, p.serviceType, p.status, p.paymentStatus, p.payMethod, p.totalAmount, p.depositAmount, p.balanceAmount,
            p.assignedTo, p.stagingUrl, p.productionUrl, p.createdAt, p.updatedAt, p.orderId, p.info,
            c.firstName, c.lastName, c.business, c.email, c.whatsapp, c.phone, c.origin
     FROM PjProject p JOIN PjClient c ON c.id = p.clientId ${w} ORDER BY p.updatedAt DESC LIMIT ? OFFSET ?`,
    [...params, Math.min(Number(f.limit) || 300, 1000), Number(f.offset) || 0]
  );
  return rows.map(r => {
    const info = L.parseInfo(r.info); delete r.info;
    return { ...r, domain: info.site.domainFinal || info.site.domainCurrent || '', nextAction: L.nextAction(r).title };
  });
}

// ── Pagos ────────────────────────────────────────────────────────────────────
async function registerPayment(projectId, { kind = 'deposit', amount, method, txId, paidAt, mpPaymentId, mpStatus, externalRef, paymentType, merchantOrderId }, actor) {
  const p = await getProjectRow(projectId);
  if (!p) throw httpError(404, 'Proyecto no encontrado');
  if (!['deposit', 'balance'].includes(kind)) throw httpError(400, 'Tipo de pago inválido');
  const amt = Math.round(Number(amount ?? (kind === 'deposit' ? p.depositAmount : p.balanceAmount)));
  if (!(amt > 0)) throw httpError(400, 'Monto inválido');
  if (kind === 'balance' && !['abono_pagado', 'pago_completo'].includes(p.paymentStatus)) throw httpError(400, 'Primero debe registrarse el abono');
  const when = paidAt ? new Date(paidAt) : new Date();
  let res;
  try {
    res = await db.run(
      `INSERT INTO PjPayment (projectId,kind,amount,method,txId,mpPaymentId,mpStatus,externalRef,paymentType,merchantOrderId,paidAt,createdBy) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [projectId, kind, amt, method || null, txId || null, mpPaymentId || null, mpStatus || null, externalRef || null, paymentType || null, merchantOrderId || null, when, actor]
    );
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return { duplicate: true };
    throw e;
  }
  if (kind === 'deposit') {
    await db.run(`UPDATE PjProject SET paymentStatus='abono_pagado', depositPaidAt=?, depositTxId=?, payMethod=COALESCE(?, payMethod) WHERE id=?`, [when, txId || mpPaymentId || null, method || null, projectId]);
  } else {
    await db.run(`UPDATE PjProject SET paymentStatus='pago_completo', balancePaidAt=?, payMethod=COALESCE(?, payMethod) WHERE id=?`, [when, method || null, projectId]);
  }
  await audit({ projectId, clientId: p.clientId, action: 'pago_registrado', from: p.paymentStatus, to: kind === 'deposit' ? 'abono_pagado' : 'pago_completo', detail: { amount: amt, method, txId: txId || mpPaymentId }, actor });

  // Avance de estado coherente con el pago
  const fresh = await getProjectRow(projectId);
  if (kind === 'deposit') {
    if (['lead_nuevo', 'contactado', 'interesado', 'esperando_abono'].includes(fresh.status)) {
      await changeStatus(projectId, fresh.infoReceivedAt ? 'info_completa' : 'abono_recibido', actor, 'Abono registrado');
    }
  } else if (['aprobado', 'esperando_saldo'].includes(fresh.status)) {
    await changeStatus(projectId, 'saldo_pagado', actor, 'Saldo registrado');
  }
  return { id: res.insertId };
}

// ── Versiones y feedback ─────────────────────────────────────────────────────
async function createVersion(projectId, data, actor) {
  const p = await getProjectRow(projectId);
  if (!p) throw httpError(404, 'Proyecto no encontrado');
  const last = await db.query('SELECT MAX(number) AS n FROM PjVersion WHERE projectId = ?', [projectId]);
  const number = (Number(last[0].n) || 0) + 1;
  const status = C.VERSION_STATUSES.some(s => s.key === data.status) ? data.status : 'generando';
  const res = await db.run(
    `INSERT INTO PjVersion (projectId, number, previewUrl, status, notes, changes, createdBy) VALUES (?,?,?,?,?,?,?)`,
    [projectId, number, cleanStr(data.previewUrl), status, data.notes || null, data.changes || null, actor]
  );
  await audit({ projectId, clientId: p.clientId, action: 'version_creada', to: `V${number}`, actor });
  await syncStatusFromVersion(projectId, number, status, actor);
  return res.insertId;
}

async function updateVersion(versionId, data, actor) {
  const rows = await db.query('SELECT * FROM PjVersion WHERE id = ?', [versionId]);
  const v = rows[0];
  if (!v) throw httpError(404, 'Versión no encontrada');
  const set = {};
  if (data.previewUrl !== undefined) set.previewUrl = cleanStr(data.previewUrl);
  if (data.notes !== undefined) set.notes = data.notes;
  if (data.changes !== undefined) set.changes = data.changes;
  if (data.status !== undefined) {
    if (!C.VERSION_STATUSES.some(s => s.key === data.status)) throw httpError(400, 'Estado de versión inválido');
    set.status = data.status;
  }
  const cols = Object.keys(set);
  if (cols.length) await db.run(`UPDATE PjVersion SET ${cols.map(k => `${k}=?`).join(',')} WHERE id=?`, [...cols.map(k => set[k]), versionId]);
  if (set.status && set.status !== v.status) {
    await audit({ projectId: v.projectId, action: 'version_estado', from: v.status, to: set.status, detail: { version: v.number }, actor });
    await syncStatusFromVersion(v.projectId, v.number, set.status, actor);
  }
  return true;
}

// El estado del proyecto acompaña a la versión más reciente cuando corresponde.
async function syncStatusFromVersion(projectId, number, vStatus, actor) {
  const p = await getProjectRow(projectId);
  const map = {
    generando: 'en_desarrollo',
    lista: number >= 2 ? 'v2_lista' : 'v1_lista',
    enviada: 'esperando_revision',
    cambios: 'cambios_solicitados',
    aprobada: 'aprobado',
  };
  const target = map[vStatus];
  if (target && p.status !== target && !['cancelado', 'finalizado', 'publicado', 'saldo_pagado', 'esperando_saldo'].includes(p.status)) {
    await changeStatus(projectId, target, actor, `Versión ${number}: ${vStatus}`);
  }
}

async function createFeedback(projectId, { text, versionId }, actor) {
  const p = await getProjectRow(projectId);
  if (!p) throw httpError(404, 'Proyecto no encontrado');
  if (!text || !String(text).trim()) throw httpError(400, 'El feedback no puede estar vacío');
  const r = await db.query('SELECT COUNT(*) AS n FROM PjFeedback WHERE projectId = ?', [projectId]);
  const round = Number(r[0].n) + 1;
  const res = await db.run(`INSERT INTO PjFeedback (projectId, versionId, round, originalText, createdBy) VALUES (?,?,?,?,?)`,
    [projectId, versionId || null, round, String(text).slice(0, 50000), actor]);
  await audit({ projectId, clientId: p.clientId, action: 'feedback_registrado', to: `Revisión #${round}`, actor });
  if (versionId) await db.run(`UPDATE PjVersion SET status='cambios' WHERE id=? AND projectId=?`, [versionId, projectId]);
  if (!['cancelado', 'finalizado', 'publicado'].includes(p.status)) await changeStatus(projectId, 'cambios_solicitados', actor, `Revisión #${round}`);
  return res.insertId;
}

async function updateFeedback(id, data, actor) {
  const rows = await db.query('SELECT * FROM PjFeedback WHERE id = ?', [id]);
  const f = rows[0];
  if (!f) throw httpError(404, 'Feedback no encontrado');
  const set = {};
  if (data.status !== undefined) {
    if (!C.FEEDBACK_STATUSES.some(s => s.key === data.status)) throw httpError(400, 'Estado inválido');
    set.status = data.status;
  }
  if (data.aiPrompt !== undefined) set.aiPrompt = data.aiPrompt;
  if (data.originalText !== undefined) set.originalText = data.originalText;
  const cols = Object.keys(set);
  if (cols.length) await db.run(`UPDATE PjFeedback SET ${cols.map(k => `${k}=?`).join(',')} WHERE id=?`, [...cols.map(k => set[k]), id]);
  if (set.status && set.status !== f.status) await audit({ projectId: f.projectId, action: 'feedback_estado', from: f.status, to: set.status, detail: { round: f.round }, actor });
  return true;
}

// ── Archivos ─────────────────────────────────────────────────────────────────
async function addFile(projectId, { category, name, relPath, size, mime, source = 'admin' }, actor) {
  const p = await getProjectRow(projectId);
  if (!p) throw httpError(404, 'Proyecto no encontrado');
  const cat = C.FILE_CATEGORIES.some(c => c.key === category) ? category : 'otro';
  try {
    const res = await db.run(`INSERT INTO PjFile (projectId, category, name, path, size, mime, source) VALUES (?,?,?,?,?,?,?)`, [projectId, cat, name, relPath, size || 0, mime || null, source]);
    if (source === 'admin') await audit({ projectId, clientId: p.clientId, action: 'archivo_subido', detail: { name, category: cat }, actor });
    return res.insertId;
  } catch (e) { if (e.code === 'ER_DUP_ENTRY') return null; throw e; }
}

async function deleteFile(fileId, actor) {
  const rows = await db.query('SELECT * FROM PjFile WHERE id = ?', [fileId]);
  const f = rows[0];
  if (!f) throw httpError(404, 'Archivo no encontrado');
  await db.run('DELETE FROM PjFile WHERE id = ?', [fileId]);
  await audit({ projectId: f.projectId, action: 'archivo_eliminado', detail: { name: f.name }, actor });
  return f;
}

// ── Plantillas ───────────────────────────────────────────────────────────────
const listTemplates = () => db.query('SELECT code, name, body FROM PjTemplate ORDER BY id');
async function saveTemplate(code, { name, body }, actor) {
  if (!body || !String(body).trim()) throw httpError(400, 'El mensaje no puede estar vacío');
  await db.run(`INSERT INTO PjTemplate (code, name, body) VALUES (?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name), body=VALUES(body)`,
    [String(code).toUpperCase().replace(/[^A-Z0-9_]/g, '').slice(0, 50), cleanStr(name, 191) || code, String(body).slice(0, 5000)]);
  await audit({ action: 'plantilla_editada', to: code, actor });
}
async function deleteTemplate(code, actor) {
  await db.run('DELETE FROM PjTemplate WHERE code = ?', [code]);
  await audit({ action: 'plantilla_eliminada', to: code, actor });
}

// ── Dashboard ────────────────────────────────────────────────────────────────
function rangeFromParams({ range = '30d', from, to } = {}) {
  const now = new Date();
  const startOfDay = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
  let start, end = now;
  if (range === 'today') start = startOfDay(now);
  else if (range === '7d') start = new Date(now.getTime() - 7 * 864e5);
  else if (range === 'month') start = new Date(now.getFullYear(), now.getMonth(), 1);
  else if (range === 'custom' && from) { start = startOfDay(from); end = to ? new Date(new Date(to).setHours(23, 59, 59, 999)) : now; }
  else start = new Date(now.getTime() - 30 * 864e5);
  return { start, end };
}

async function dashboard(params) {
  const { start, end } = rangeFromParams(params);
  const [statusRows, newClients, sold, deposits, pendingBalance, byOrigin] = await Promise.all([
    db.query(`SELECT status, paymentStatus, COUNT(*) AS n FROM PjProject GROUP BY status, paymentStatus`),
    db.query(`SELECT COUNT(*) AS n FROM PjClient WHERE createdAt BETWEEN ? AND ?`, [start, end]),
    db.query(`SELECT COUNT(*) AS n, COALESCE(SUM(totalAmount),0) AS total FROM PjProject WHERE depositPaidAt BETWEEN ? AND ? AND status <> 'cancelado'`, [start, end]),
    db.query(`SELECT COALESCE(SUM(amount),0) AS total FROM PjPayment WHERE kind='deposit' AND paidAt BETWEEN ? AND ?`, [start, end]),
    db.query(`SELECT COALESCE(SUM(balanceAmount),0) AS total FROM PjProject WHERE paymentStatus='abono_pagado' AND status NOT IN ('cancelado','finalizado')`),
    db.query(`SELECT COALESCE(c.origin,'Sin origen') AS origin, COUNT(*) AS n FROM PjProject p JOIN PjClient c ON c.id=p.clientId WHERE p.createdAt BETWEEN ? AND ? GROUP BY c.origin`, [start, end]),
  ]);
  const sum = keys => statusRows.filter(r => keys.includes(r.status)).reduce((a, r) => a + Number(r.n), 0);
  const stageCounts = {};
  for (const s of C.STATUSES) if (s.stage) stageCounts[s.stage] = (stageCounts[s.stage] || 0) + sum([s.key]);
  const pendingDeposit = statusRows.filter(r => ['no_pagado', 'abono_pendiente'].includes(r.paymentStatus) && r.status !== 'cancelado').reduce((a, r) => a + Number(r.n), 0);
  const soldN = Number(sold[0].n), soldTotal = Number(sold[0].total);
  return {
    range: { start, end },
    counters: {
      newClients: Number(newClients[0].n),
      activeProjects: sum(C.STATUS_KEYS.filter(k => !['finalizado', 'cancelado'].includes(k))),
      pendingInfo: sum(['abono_recibido', 'esperando_info', 'info_incompleta']),
      pendingDeposit,
      inDevelopment: sum(['listo_produccion', 'en_desarrollo']),
      awaitingReview: sum(['v1_lista', 'esperando_revision', 'v2_lista']),
      changesRequested: sum(['cambios_solicitados']),
      pendingBalance: sum(['aprobado', 'esperando_saldo']),
      finished: sum(['publicado', 'finalizado']),
    },
    financial: {
      totalSales: soldTotal, depositsReceived: Number(deposits[0].total), pendingBalance: Number(pendingBalance[0].total),
      projectsSold: soldN, averageTicket: soldN ? Math.round(soldTotal / soldN) : 0,
    },
    pipeline: C.PIPELINE.map(st => ({ ...st, count: stageCounts[st.key] || 0 })),
    byOrigin,
  };
}

// ── Integración con el formulario /sitio-web y Mercado Pago ─────────────────
function orderToInfo(order) {
  let secciones = [], socials = {};
  try { secciones = JSON.parse(order.secciones || '[]'); } catch { /* */ }
  try { socials = JSON.parse(order.socials || '{}'); } catch { /* */ }
  return {
    site: {
      businessName: order.businessName, descriptionLong: order.about || '', services: secciones,
      phone: order.phone || '', whatsapp: order.whatsapp || '', email: order.publicEmail || order.email,
      address: order.address || '', city: order.city || '', region: order.region || '',
      instagram: socials.instagram || '', facebook: socials.facebook || '', tiktok: socials.tiktok || '', linkedin: '',
      otherSocial: [socials.youtube, socials.otherSocial].filter(Boolean).join(' · '),
      hasDomain: order.hasDomain === 'tengo' ? 'si' : order.hasDomain === 'no' ? 'no' : '',
      domainCurrent: order.domainExisting || '', domainFinal: order.domainWanted || '', hosting: 'pendiente',
      wantsMaps: !!order.wantsMaps, wantsStore: !!order.wantsStore, productCount: order.productCount || '', rubro: order.rubro || '',
    },
    visual: {}, content: {}, free: '',
  };
}

async function syncFromOrder(order) {
  if (!order || !order.orderId) return null;
  const existing = await db.query('SELECT * FROM PjProject WHERE orderId = ?', [order.orderId]);
  const nameParts = String(order.contactName || '').trim().split(/\s+/);
  const clientData = {
    firstName: nameParts[0] || '', lastName: nameParts.slice(1).join(' '), business: order.businessName,
    rut: order.rut, email: order.email, phone: order.phone, whatsapp: order.phone || order.whatsapp, city: order.city, region: order.region,
  };
  let client = existing[0] ? await getClient(existing[0].clientId) : await findClient({ email: order.email, whatsapp: order.phone || order.whatsapp });
  if (!client) client = await createClient({ ...clientData, origin: 'Formulario web' }, 'formulario');
  const info = orderToInfo(order);
  let projectId;
  if (existing[0]) {
    projectId = existing[0].id;
    const cur = L.parseInfo(existing[0].info);
    // No pisa lo que el equipo ya editó a mano: solo completa vacíos.
    const merged = { ...info, site: { ...info.site, ...Object.fromEntries(Object.entries(cur.site).filter(([, v]) => L.filled(v))) }, visual: cur.visual, content: cur.content, free: cur.free };
    await db.run('UPDATE PjProject SET info = ? WHERE id = ?', [JSON.stringify(merged), projectId]);
  } else {
    projectId = await createProject({
      clientId: client.id, name: order.businessName, tradeName: order.businessName, serviceType: 'Landing Page',
      netAmount: order.montoNeto || C.DEFAULT_NET, orderId: order.orderId, status: 'info_completa',
      payMethod: order.modalidad === 'whatsapp' ? 'whatsapp' : 'mercado_pago', info,
    }, 'formulario');
    await db.run('UPDATE PjProject SET infoReceivedAt = NOW(3) WHERE id = ?', [projectId]);
    await audit({ projectId, clientId: client.id, action: 'formulario_recibido', detail: { orderId: order.orderId, modalidad: order.modalidad }, actor: 'formulario' });
  }
  await db.run('UPDATE PjClient SET lastContactAt = NOW(3) WHERE id = ?', [client.id]);

  // Archivos: se registran las rutas que el formulario ya guardó en uploads/orders (sin copiar).
  try {
    if (order.logoName) await addFile(projectId, { category: 'logo', name: order.logoName, relPath: path.posix.join('orders', order.orderId, 'logo', order.logoName), source: 'formulario' }, 'formulario');
    const photos = order.photosNames ? JSON.parse(order.photosNames) : [];
    for (const n of photos) await addFile(projectId, { category: 'foto', name: n, relPath: path.posix.join('orders', order.orderId, 'fotos', n), source: 'formulario' }, 'formulario');
  } catch (e) { console.error('[projects-sync-files]', e.message); }
  return projectId;
}

async function logWebhook(payload, result) {
  try { await db.run('INSERT INTO PjWebhookLog (source, payload, result) VALUES (?,?,?)', ['mercadopago', jstr(payload)?.slice(0, 20000), result || null]); } catch { /* nunca debe romper el webhook */ }
}

async function onMpPayment(order, payment) {
  let rows = await db.query('SELECT id FROM PjProject WHERE orderId = ?', [order.orderId]);
  let projectId = rows[0]?.id;
  if (!projectId) projectId = await syncFromOrder(order);
  if (!projectId) { await logWebhook({ id: payment.id }, 'sin proyecto'); return; }
  const result = await registerPayment(projectId, {
    kind: 'deposit', amount: payment.transaction_amount, method: 'mercado_pago', txId: String(payment.id),
    mpPaymentId: String(payment.id), mpStatus: payment.status, externalRef: payment.external_reference,
    paymentType: payment.payment_type_id, merchantOrderId: payment.order?.id ? String(payment.order.id) : null,
    paidAt: payment.date_approved || new Date(),
  }, 'mercadopago');
  await logWebhook({ payment_id: payment.id, status: payment.status, external_reference: payment.external_reference, payment_type: payment.payment_type_id, merchant_order_id: payment.order?.id }, result.duplicate ? 'duplicado' : 'registrado');
}

function httpError(status, message) { const e = new Error(message); e.status = status; return e; }

module.exports = {
  audit, listClients, getClient, createClient, updateClient, findClient,
  createProject, getProjectFull, getProjectRow, updateProject, changeStatus, listProjects,
  registerPayment, createVersion, updateVersion, createFeedback, updateFeedback,
  addFile, deleteFile, listTemplates, saveTemplate, deleteTemplate, dashboard,
  syncFromOrder, onMpPayment, logWebhook, httpError,
};

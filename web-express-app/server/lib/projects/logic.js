// Lógica pura (sin DB): montos, próxima acción y calidad de información. Testeable de forma aislada.
const C = require('./constants');

function computeAmounts(net, depositPct = C.DEFAULT_DEPOSIT_PCT, ivaRate = C.IVA_RATE) {
  const n = Math.round(Number(net) || 0);
  const total = n + Math.round(n * ivaRate);
  const deposit = Math.round(total * (Number(depositPct) || 0) / 100);
  return { netAmount: n, totalAmount: total, depositAmount: deposit, balanceAmount: total - deposit, ivaRate, depositPct: Number(depositPct) || 0 };
}

const EMPTY_INFO = { site: {}, visual: {}, content: {}, free: '' };
function parseInfo(raw) {
  if (!raw) return { ...EMPTY_INFO, site: {}, visual: {}, content: {} };
  try {
    const o = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return { site: o.site || {}, visual: o.visual || {}, content: o.content || {}, free: o.free || '' };
  } catch { return { ...EMPTY_INFO, site: {}, visual: {}, content: {} }; }
}

const filled = v => Array.isArray(v) ? v.length > 0 : v !== null && v !== undefined && String(v).trim() !== '';

// files: [{category}], client: fila PjClient. Devuelve {percent, items:[{key,label,ok}]}
function computeCompleteness(info, files = [], client = {}) {
  const s = info.site || {}, v = info.visual || {}, c = info.content || {};
  const has = cat => files.some(f => f.category === cat);
  const items = [
    { key: 'contacto',  label: 'Datos de contacto',   ok: filled(s.phone || s.whatsapp || client.whatsapp || client.phone) && filled(s.email || client.email) },
    { key: 'logo',      label: 'Logo',                ok: has('logo') },
    { key: 'servicios', label: 'Servicios',           ok: filled(s.services) || filled(c.services) },
    { key: 'descripcion', label: 'Descripción del negocio', ok: filled(s.descriptionShort) || filled(s.descriptionLong) || filled(info.free) },
    { key: 'fotos',     label: 'Fotografías',         ok: has('foto') || has('producto') },
    { key: 'redes',     label: 'Redes sociales',      ok: ['instagram', 'facebook', 'tiktok', 'linkedin', 'otherSocial'].some(k => filled(s[k])) },
    { key: 'colores',   label: 'Colores / estilo',    ok: filled(v.colorPrimary) || filled(v.style) },
    { key: 'dominio',   label: 'Dominio',             ok: filled(s.domainFinal) || filled(s.domainCurrent) || s.hasDomain === 'no' },
  ];
  const done = items.filter(i => i.ok).length;
  return { percent: Math.round((done / items.length) * 100), items };
}

// ctx: { info, completeness, versions: [{number,status}] }
function nextAction(p, ctx = {}) {
  const paid = ['abono_pagado', 'pago_completo'].includes(p.paymentStatus);
  const versions = ctx.versions || [];
  const hasVersion = versions.some(v => v.status !== 'descartada');
  const map = {
    lead_nuevo:  ['Contactar al cliente', 'Responder por WhatsApp y calificar el interés.'],
    contactado:  ['Presentar la propuesta', 'Enviar la promoción y resolver dudas.'],
    interesado:  ['Cobrar abono', 'Enviar datos de pago del 50%.'],
    esperando_abono: ['Cobrar abono', 'Confirmar el pago del 50% para comenzar.'],
    abono_recibido:  ['Esperar información', 'El cliente debe completar el formulario.'],
    esperando_info:  ['Esperar información', 'Recordar al cliente completar el formulario.'],
    info_incompleta: ['Pedir información faltante', 'Revisar qué falta y solicitarlo al cliente.'],
    info_completa:   paid ? ['Revisar información', 'Revisar los datos y marcar listo para producción.'] : ['Cobrar abono', 'Información recibida — falta confirmar el abono.'],
    listo_produccion: ['Crear V1', 'Comenzar el desarrollo de la primera versión.'],
    en_desarrollo:   hasVersion ? ['Terminar y enviar versión', 'Marcar la versión lista y enviarla al cliente.'] : ['Crear V1', 'Registrar la primera versión en desarrollo.'],
    v1_lista:        ['Enviar V1 al cliente', 'Compartir el enlace de preview por WhatsApp.'],
    esperando_revision: ['Esperar revisión del cliente', 'Hacer seguimiento si no responde.'],
    cambios_solicitados: ['Procesar cambios', 'Aplicar el feedback y crear la nueva versión.'],
    v2_lista:        ['Enviar nueva versión al cliente', 'Compartir el enlace de la versión actualizada.'],
    aprobado:        ['Cobrar saldo', 'El cliente aprobó — solicitar el 50% restante.'],
    esperando_saldo: ['Cobrar saldo', 'Confirmar el pago del saldo.'],
    saldo_pagado:    ['Publicar web', 'Publicar el sitio en producción.'],
    publicado:       ['Marcar como finalizado', 'Confirmar entrega y cerrar el proyecto.'],
    finalizado:      ['Sin acciones pendientes', 'Proyecto cerrado.'],
    cancelado:       ['Proyecto cancelado', ''],
  };
  const [title, hint] = map[p.status] || ['Revisar proyecto', ''];
  return { title, hint };
}

function buildProjectJson(project, client, info, files, versions) {
  const s = info.site || {}, v = info.visual || {};
  return {
    project_id: project.id,
    business_name: s.businessName || project.tradeName || client.business || '',
    description: s.descriptionLong || s.descriptionShort || info.free || '',
    services: s.services || [],
    products: s.products || [],
    colors: { primary: v.colorPrimary || '', secondary: v.colorSecondary || '', extra: v.colorExtra || '' },
    style: v.style || '', typography: v.typography || '',
    contact: { phone: s.phone || client.phone || '', whatsapp: s.whatsapp || client.whatsapp || '', email: s.email || client.email || '', address: s.address || '', city: s.city || client.city || '', schedule: s.schedule || '' },
    social: { instagram: s.instagram || '', facebook: s.facebook || '', tiktok: s.tiktok || '', linkedin: s.linkedin || '', other: s.otherSocial || '' },
    content: info.content || {},
    assets: files.map(f => ({ id: f.id, category: f.category, name: f.name, mime: f.mime })),
    references: [v.ref1, v.ref2, v.ref3].filter(Boolean),
    domain: s.domainFinal || s.domainCurrent || '',
    hosting: s.hosting || '',
    versions: versions.map(x => ({ number: x.number, status: x.status, preview_url: x.previewUrl })),
  };
}

module.exports = { computeAmounts, parseInfo, computeCompleteness, nextAction, buildProjectJson, filled };

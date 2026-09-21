// API del módulo "Proyectos Web". Todo privado: solo admin (JWT). Ninguna ruta es pública.
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const { authenticateAdmin } = require('../middleware/auth');
const db = require('../lib/projects/db');
const S = require('../lib/projects/service');
const C = require('../lib/projects/constants');

const router = express.Router();
const UPLOADS_ROOT = path.join(__dirname, '..', 'uploads');
const PROJECT_UPLOADS = path.join(UPLOADS_ROOT, 'projects');

const ALLOWED = {
  '.jpg': ['image/jpeg'], '.jpeg': ['image/jpeg'], '.png': ['image/png'], '.webp': ['image/webp'], '.gif': ['image/gif'], '.svg': ['image/svg+xml'],
  '.pdf': ['application/pdf'],
  '.doc': ['application/msword'], '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  '.xls': ['application/vnd.ms-excel'], '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  '.txt': ['text/plain'],
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, _f, cb) => {
      const dir = path.join(PROJECT_UPLOADS, String(Number(req.params.id)));
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`);
    },
  }),
  limits: { fileSize: 15 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED[ext] && ALLOWED[ext].includes(file.mimetype)) return cb(null, true);
    cb(new Error('Tipo de archivo no permitido'));
  },
});

// Hoy solo existe el admin único; cuando haya cuentas de staff, resolver el actor desde req.admin.
const actorOf = () => 'admin';

const wrap = fn => async (req, res) => {
  try {
    if (!db.isReady()) return res.status(503).json({ success: false, message: 'El módulo de proyectos no está disponible' });
    await fn(req, res);
  } catch (e) {
    if (e.status) return res.status(e.status).json({ success: false, message: e.message });
    console.error('[projects]', e);
    res.status(500).json({ success: false, message: 'Error interno' });
  }
};
const num = v => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : null; };
const need = (v, what = 'id') => { if (!v) { const e = new Error(`${what} inválido`); e.status = 400; throw e; } return v; };

router.use(authenticateAdmin);

router.get('/meta', (_req, res) => res.json({
  success: true, statuses: C.STATUSES, kanbanColumns: C.KANBAN_COLUMNS, paymentStatuses: C.PAYMENT_STATUSES, paymentMethods: C.PAYMENT_METHODS,
  origins: C.ORIGINS, serviceTypes: C.SERVICE_TYPES, visualStyles: C.VISUAL_STYLES, fileCategories: C.FILE_CATEGORIES,
  versionStatuses: C.VERSION_STATUSES, feedbackStatuses: C.FEEDBACK_STATUSES, roles: C.ROLES,
}));

router.get('/dashboard', wrap(async (req, res) => res.json({ success: true, ...(await S.dashboard(req.query)) })));

// Clientes
router.get('/clients', wrap(async (req, res) => res.json({ success: true, clients: await S.listClients(req.query) })));
router.get('/clients/:id', wrap(async (req, res) => {
  const id = need(num(req.params.id));
  const client = await S.getClient(id);
  if (!client) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
  res.json({ success: true, client, projects: await S.listProjects({ clientId: id }) });
}));
router.post('/clients', wrap(async (req, res) => res.json({ success: true, client: await S.createClient(req.body || {}, actorOf(req)) })));
router.put('/clients/:id', wrap(async (req, res) => res.json({ success: true, client: await S.updateClient(need(num(req.params.id)), req.body || {}, actorOf(req)) })));

// Plantillas WhatsApp
router.get('/templates/all', wrap(async (_req, res) => res.json({ success: true, templates: await S.listTemplates() })));
router.put('/templates/:code', wrap(async (req, res) => { await S.saveTemplate(req.params.code, req.body || {}, actorOf(req)); res.json({ success: true, templates: await S.listTemplates() }); }));
router.delete('/templates/:code', wrap(async (req, res) => { await S.deleteTemplate(req.params.code, actorOf(req)); res.json({ success: true, templates: await S.listTemplates() }); }));

// Importa pedidos del formulario que existían antes del módulo
router.post('/sync/orders', wrap(async (_req, res) => {
  const prisma = require('../lib/prisma');
  const orders = await prisma.webExpressOrder.findMany({ where: { modalidad: { not: null } }, orderBy: { createdAt: 'asc' } });
  let n = 0;
  for (const o of orders) { if (await S.syncFromOrder(o)) n++; }
  res.json({ success: true, synced: n });
}));

// Archivos (privados: se descargan solo con token de admin)
router.get('/files/:fileId/download', wrap(async (req, res) => {
  const rows = await db.query('SELECT * FROM PjFile WHERE id = ?', [need(num(req.params.fileId))]);
  const f = rows[0];
  if (!f) return res.status(404).json({ success: false, message: 'Archivo no encontrado' });
  const abs = path.resolve(UPLOADS_ROOT, f.path);
  if (!abs.startsWith(UPLOADS_ROOT + path.sep) || !fs.existsSync(abs)) return res.status(404).json({ success: false, message: 'Archivo no disponible' });
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (f.mime === 'image/svg+xml') res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'");
  res.type(f.mime || 'application/octet-stream');
  res.sendFile(abs);
}));
router.delete('/files/:fileId', wrap(async (req, res) => {
  const f = await S.deleteFile(need(num(req.params.fileId)), actorOf(req));
  const abs = path.resolve(UPLOADS_ROOT, f.path);
  if (f.source === 'admin' && abs.startsWith(PROJECT_UPLOADS + path.sep)) fs.promises.unlink(abs).catch(() => {});
  res.json({ success: true });
}));

// Versiones y feedback (por id propio)
router.put('/versions/:versionId', wrap(async (req, res) => {
  await S.updateVersion(need(num(req.params.versionId)), req.body || {}, actorOf(req));
  res.json({ success: true });
}));
router.put('/feedback/:feedbackId', wrap(async (req, res) => {
  await S.updateFeedback(need(num(req.params.feedbackId)), req.body || {}, actorOf(req));
  res.json({ success: true });
}));

// Proyectos
router.get('/', wrap(async (req, res) => res.json({ success: true, projects: await S.listProjects(req.query) })));
router.post('/', wrap(async (req, res) => {
  const id = await S.createProject({ ...(req.body || {}), clientId: need(num(req.body?.clientId), 'clientId') }, actorOf(req));
  res.json({ success: true, id });
}));
router.get('/:id', wrap(async (req, res) => {
  const full = await S.getProjectFull(need(num(req.params.id)));
  if (!full) return res.status(404).json({ success: false, message: 'Proyecto no encontrado' });
  res.json({ success: true, ...full });
}));
router.put('/:id', wrap(async (req, res) => res.json({ success: true, ...(await S.updateProject(need(num(req.params.id)), req.body || {}, actorOf(req))) })));
router.post('/:id/status', wrap(async (req, res) => {
  const id = need(num(req.params.id));
  await S.changeStatus(id, req.body?.status, actorOf(req), req.body?.note);
  res.json({ success: true, ...(await S.getProjectFull(id)) });
}));
router.post('/:id/payments', wrap(async (req, res) => {
  const id = need(num(req.params.id));
  const b = req.body || {};
  const r = await S.registerPayment(id, { kind: b.kind, amount: b.amount, method: b.method, txId: b.txId, paidAt: b.paidAt }, actorOf(req));
  res.json({ success: true, duplicate: !!r.duplicate, ...(await S.getProjectFull(id)) });
}));
router.post('/:id/versions', wrap(async (req, res) => {
  const id = need(num(req.params.id));
  await S.createVersion(id, req.body || {}, actorOf(req));
  res.json({ success: true, ...(await S.getProjectFull(id)) });
}));
router.post('/:id/feedback', wrap(async (req, res) => {
  const id = need(num(req.params.id));
  await S.createFeedback(id, req.body || {}, actorOf(req));
  res.json({ success: true, ...(await S.getProjectFull(id)) });
}));
router.post('/:id/files', (req, res, next) => {
  upload.array('files', 10)(req, res, err => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
}, wrap(async (req, res) => {
  const id = need(num(req.params.id));
  for (const f of req.files || []) {
    await S.addFile(id, { category: req.body?.category, name: f.originalname.slice(0, 255), relPath: path.posix.join('projects', String(id), f.filename), size: f.size, mime: f.mimetype }, actorOf(req));
  }
  res.json({ success: true, ...(await S.getProjectFull(id)) });
}));

// IA (arquitectura lista, sin proveedor)
router.get('/:id/ai/brief', wrap(async (req, res) => {
  const full = await S.getProjectFull(need(num(req.params.id)));
  if (!full) return res.status(404).json({ success: false, message: 'Proyecto no encontrado' });
  res.json({ success: true, brief: full.aiBrief });
}));
router.post('/:id/ai/generate', (_req, res) => res.status(501).json({ success: false, message: 'Funcionalidad próximamente disponible' }));

module.exports = router;

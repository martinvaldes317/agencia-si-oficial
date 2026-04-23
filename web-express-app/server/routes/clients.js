const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateAdmin, JWT_SECRET } = require('../middleware/auth');
const prisma = require('../lib/prisma');
const mailer = require('../lib/mailer');

const err = (res, e, msg) => {
  console.error(`[clients] ${msg}:`, e.message);
  if (e.code === 'P2002') return res.status(400).json({ success: false, message: 'Email ya existe' });
  res.status(500).json({ success: false, message: e.message });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/files', String(req.params.clientId));
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// ── Stats ─────────────────────────────────────────────────────────────────────
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const now          = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const in30days     = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const mesNombre    = now.toLocaleString('es-CL', { month: 'long' });

    const [allServices, payments, clientesActivos, clientesTotal, renovaciones] = await Promise.all([
      prisma.clientService.findMany({ where: { active: true }, select: { type: true, amount: true, createdAt: true } }),
      prisma.payment.findMany({ select: { amount: true, status: true, paidAt: true, createdAt: true } }),
      prisma.client.count({ where: { active: true } }),
      prisma.client.count(),
      prisma.clientService.count({
        where: { type: 'anual', active: true, renewalDate: { gte: now, lte: in30days } }
      }),
    ]);

    const pagosEsteMes = payments
      .filter(p => {
        if (p.status !== 'pagado') return false;
        const fecha = p.paidAt || p.createdAt;
        return fecha >= startOfMonth && fecha <= endOfMonth;
      })
      .reduce((s, p) => s + p.amount, 0);

    const unicosEsteMes = allServices
      .filter(s => s.type === 'unico' && s.createdAt >= startOfMonth && s.createdAt <= endOfMonth)
      .reduce((s, x) => s + x.amount, 0);

    const cobradoEsteMes = pagosEsteMes + unicosEsteMes;
    const costosAnuales  = allServices.filter(s => s.type === 'anual').reduce((s, x) => s + x.amount, 0);
    const pendiente      = payments.filter(p => p.status === 'pendiente').reduce((s, p) => s + p.amount, 0);

    res.json({ success: true, stats: { cobradoEsteMes, mesNombre, costosAnuales, pendiente, clientesActivos, clientesTotal, renovaciones } });
  } catch (e) { err(res, e, 'stats'); }
});

// ── List clients ──────────────────────────────────────────────────────────────
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, email: true, company: true, phone: true, plan: true, active: true, createdAt: true,
        services: { where: { type: 'anual', active: true }, select: { name: true, renewalDate: true } }
      }
    });
    res.json({ success: true, clients });
  } catch (e) { err(res, e, 'list'); }
});

// ── Create client ─────────────────────────────────────────────────────────────
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { name, email, company, phone, plan } = req.body;
    if (!name || !email) return res.status(400).json({ success: false, message: 'Nombre y email son requeridos' });
    const tempPassword = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
    const client = await prisma.client.create({
      data: { name, email, password: tempPassword, company: company || null, phone: phone || null, plan: plan || 'ads', active: false }
    });
    const siteUrl = process.env.SITE_URL || 'https://agenciasi.cl';
    const setupToken = jwt.sign({ role: 'client_setup', clientId: client.id }, JWT_SECRET, { expiresIn: '7d' });
    mailer.send({
      to: email,
      subject: `Bienvenido/a a AgenciaSi, ${name} — Crea tu contraseña`,
      html: mailer.clientWelcome({ clientName: name, setupLink: `${siteUrl}/portal/setup?token=${setupToken}` })
    }).catch(e => console.error('[welcome-email]', e.message));
    res.json({ success: true, client: { id: client.id, name: client.name, email: client.email } });
  } catch (e) { err(res, e, 'create'); }
});

// ── Resend welcome email ──────────────────────────────────────────────────────
router.post('/:id/resend-welcome', authenticateAdmin, async (req, res) => {
  try {
    const client = await prisma.client.findUnique({ where: { id: Number(req.params.id) }, select: { id: true, name: true, email: true } });
    if (!client) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    const siteUrl = process.env.SITE_URL || 'https://agenciasi.cl';
    const setupToken = jwt.sign({ role: 'client_setup', clientId: client.id }, JWT_SECRET, { expiresIn: '7d' });
    await mailer.send({
      to: client.email,
      subject: 'Acceso a tu portal AgenciaSi — Crea tu contraseña',
      html: mailer.clientWelcome({ clientName: client.name, setupLink: `${siteUrl}/portal/setup?token=${setupToken}` })
    });
    res.json({ success: true });
  } catch (e) { err(res, e, 'resend-welcome'); }
});

// ── Get single client ─────────────────────────────────────────────────────────
router.get('/:id', authenticateAdmin, async (req, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        metrics:  { orderBy: { date: 'desc' } },
        payments: { orderBy: { createdAt: 'desc' } },
        meetings: { orderBy: { date: 'asc' } },
        files:    { orderBy: { createdAt: 'desc' } },
        tickets:  { include: { messages: { orderBy: { createdAt: 'asc' } } }, orderBy: { createdAt: 'desc' } },
        tasks:    { orderBy: { createdAt: 'desc' } },
        services: { orderBy: { createdAt: 'asc' } }
      }
    });
    if (!client) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    const { password: _, ...clientData } = client;
    res.json({ success: true, client: clientData });
  } catch (e) { err(res, e, 'get'); }
});

// ── Update client ─────────────────────────────────────────────────────────────
router.patch('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name, email, company, phone, plan, active, password, domainName, hostingProvider, hostingRenewal, domainRenewal, serviceNotes, monthlyFee, hostingCost, domainCost, domainPaidByClient, activeServices } = req.body;
    const data = {};
    if (name !== undefined)           data.name = name;
    if (email !== undefined)          data.email = email;
    if (company !== undefined)        data.company = company;
    if (phone !== undefined)          data.phone = phone;
    if (plan !== undefined)           data.plan = plan;
    if (active !== undefined)         data.active = active;
    if (domainName !== undefined)     data.domainName = domainName;
    if (hostingProvider !== undefined) data.hostingProvider = hostingProvider;
    if (serviceNotes !== undefined)   data.serviceNotes = serviceNotes;
    if (hostingRenewal)               data.hostingRenewal = new Date(hostingRenewal);
    if (domainRenewal)                data.domainRenewal = new Date(domainRenewal);
    if (password)                     data.password = await bcrypt.hash(password, 10);
    if (monthlyFee !== undefined)         data.monthlyFee = monthlyFee;
    if (hostingCost !== undefined)        data.hostingCost = hostingCost;
    if (domainCost !== undefined)         data.domainCost = domainCost;
    if (domainPaidByClient !== undefined) data.domainPaidByClient = domainPaidByClient;
    if (activeServices !== undefined)     data.activeServices = activeServices;
    const client = await prisma.client.update({ where: { id: Number(req.params.id) }, data });
    const { password: _, ...clientData } = client;
    res.json({ success: true, client: clientData });
  } catch (e) { err(res, e, 'update'); }
});

// ── Delete client ─────────────────────────────────────────────────────────────
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    await prisma.client.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (e) { err(res, e, 'delete'); }
});

// ── Send notification ─────────────────────────────────────────────────────────
router.post('/:id/notify', authenticateAdmin, async (req, res) => {
  try {
    const { type, subject, message } = req.body;
    const client = await prisma.client.findUnique({ where: { id: Number(req.params.id) }, select: { name: true, email: true } });
    if (!client) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    await mailer.send({
      to: client.email,
      subject: subject || `Notificación de AgenciaSi: ${type}`,
      html: mailer.clientNotification({ clientName: client.name, type, subject, message })
    });
    res.json({ success: true });
  } catch (e) { err(res, e, 'notify'); }
});

// ── Metrics ───────────────────────────────────────────────────────────────────
router.post('/:id/metrics', authenticateAdmin, async (req, res) => {
  try {
    const { date, platform, impressions, clicks, spend, conversions, revenue } = req.body;
    const ctr  = clicks && impressions ? (clicks / impressions) * 100 : 0;
    const cpc  = clicks && spend ? spend / clicks : 0;
    const roas = spend && revenue ? revenue / spend : 0;
    const metric = await prisma.metric.create({
      data: {
        clientId: Number(req.params.id), date: new Date(date), platform,
        impressions: Number(impressions), clicks: Number(clicks),
        spend: Number(spend), conversions: Number(conversions),
        revenue: Number(revenue), ctr, cpc, roas
      }
    });
    res.json({ success: true, metric });
  } catch (e) { err(res, e, 'metrics.create'); }
});

router.delete('/:id/metrics/:metricId', authenticateAdmin, async (req, res) => {
  try {
    await prisma.metric.delete({ where: { id: Number(req.params.metricId) } });
    res.json({ success: true });
  } catch (e) { err(res, e, 'metrics.delete'); }
});

// ── Payments ──────────────────────────────────────────────────────────────────
router.post('/:id/payments', authenticateAdmin, async (req, res) => {
  try {
    const { amount, description, status, dueDate, invoiceUrl } = req.body;
    const payment = await prisma.payment.create({
      data: {
        clientId: Number(req.params.id), amount: Number(amount), description, status,
        dueDate: dueDate ? new Date(dueDate) : null, invoiceUrl,
        paidAt: status === 'pagado' ? new Date() : null
      }
    });
    const client = await prisma.client.findUnique({ where: { id: Number(req.params.id) }, select: { name: true, email: true } });
    if (client) mailer.send({ to: client.email, subject: `Nuevo cobro — $${Number(amount).toLocaleString('es-CL')} CLP`, html: mailer.paymentCreated({ clientName: client.name, amount, description, dueDate, status }) }).catch(() => {});
    res.json({ success: true, payment });
  } catch (e) { err(res, e, 'payments.create'); }
});

router.patch('/:id/payments/:paymentId', authenticateAdmin, async (req, res) => {
  try {
    const payment = await prisma.payment.update({
      where: { id: Number(req.params.paymentId) },
      data: { status: req.body.status, paidAt: req.body.status === 'pagado' ? new Date() : null }
    });
    res.json({ success: true, payment });
  } catch (e) { err(res, e, 'payments.update'); }
});

// ── Meetings ──────────────────────────────────────────────────────────────────
router.post('/:id/meetings', authenticateAdmin, async (req, res) => {
  try {
    const { title, description, date, duration, meetLink } = req.body;
    const meeting = await prisma.meeting.create({
      data: { clientId: Number(req.params.id), title, description, date: new Date(date), duration: Number(duration || 60), meetLink }
    });
    const client = await prisma.client.findUnique({ where: { id: Number(req.params.id) }, select: { name: true, email: true } });
    if (client) mailer.send({ to: client.email, subject: `Nueva reunión: ${title}`, html: mailer.meetingScheduled({ clientName: client.name, title, date, duration, meetLink, description }) }).catch(() => {});
    res.json({ success: true, meeting });
  } catch (e) { err(res, e, 'meetings.create'); }
});

router.patch('/:id/meetings/:meetingId', authenticateAdmin, async (req, res) => {
  try {
    const meeting = await prisma.meeting.update({ where: { id: Number(req.params.meetingId) }, data: req.body });
    res.json({ success: true, meeting });
  } catch (e) { err(res, e, 'meetings.update'); }
});

router.delete('/:id/meetings/:meetingId', authenticateAdmin, async (req, res) => {
  try {
    await prisma.meeting.delete({ where: { id: Number(req.params.meetingId) } });
    res.json({ success: true });
  } catch (e) { err(res, e, 'meetings.delete'); }
});

// ── Files ─────────────────────────────────────────────────────────────────────
router.post('/:clientId/files', authenticateAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const file = await prisma.clientFile.create({
      data: { clientId: Number(req.params.clientId), filename: req.file.filename, originalName: req.file.originalname, category: req.body.category || 'general', size: req.file.size, mimeType: req.file.mimetype }
    });
    const client = await prisma.client.findUnique({ where: { id: Number(req.params.clientId) }, select: { name: true, email: true } });
    if (client) mailer.send({ to: client.email, subject: `Nuevo archivo: ${req.file.originalname}`, html: mailer.fileUploaded({ clientName: client.name, fileName: req.file.originalname, category: req.body.category || 'general' }) }).catch(() => {});
    res.json({ success: true, file });
  } catch (e) { err(res, e, 'files.upload'); }
});

router.delete('/:clientId/files/:fileId', authenticateAdmin, async (req, res) => {
  try {
    const file = await prisma.clientFile.findUnique({ where: { id: Number(req.params.fileId) } });
    if (!file) return res.status(404).json({ success: false, message: 'Archivo no encontrado' });
    const filePath = path.join(__dirname, '../uploads/files', String(req.params.clientId), file.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await prisma.clientFile.delete({ where: { id: Number(req.params.fileId) } });
    res.json({ success: true });
  } catch (e) { err(res, e, 'files.delete'); }
});

// ── Tickets ───────────────────────────────────────────────────────────────────
router.post('/tickets/:ticketId/messages', authenticateAdmin, async (req, res) => {
  try {
    const message = await prisma.ticketMessage.create({
      data: { ticketId: Number(req.params.ticketId), content: req.body.content, isAdmin: true }
    });
    const ticket = await prisma.ticket.update({
      where: { id: Number(req.params.ticketId) },
      data: { status: 'en_progreso', updatedAt: new Date() },
      include: { client: { select: { name: true, email: true } } }
    });
    if (ticket.client) mailer.send({ to: ticket.client.email, subject: `Respuesta a tu ticket: ${ticket.subject}`, html: mailer.ticketReply({ clientName: ticket.client.name, subject: ticket.subject, adminMessage: req.body.content }) }).catch(() => {});
    res.json({ success: true, message });
  } catch (e) { err(res, e, 'tickets.reply'); }
});

router.patch('/tickets/:ticketId/status', authenticateAdmin, async (req, res) => {
  try {
    const ticket = await prisma.ticket.update({ where: { id: Number(req.params.ticketId) }, data: { status: req.body.status } });
    res.json({ success: true, ticket });
  } catch (e) { err(res, e, 'tickets.status'); }
});

// ── Tasks ─────────────────────────────────────────────────────────────────────
router.get('/:clientId/tasks', authenticateAdmin, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({ where: { clientId: Number(req.params.clientId) }, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, tasks });
  } catch (e) { err(res, e, 'tasks.list'); }
});

router.post('/:clientId/tasks', authenticateAdmin, async (req, res) => {
  try {
    const { title, detail, priority, dueDate } = req.body;
    const task = await prisma.task.create({
      data: { clientId: Number(req.params.clientId), title, detail, priority: priority || 'normal', dueDate: dueDate ? new Date(dueDate) : null }
    });
    res.json({ success: true, task });
  } catch (e) { err(res, e, 'tasks.create'); }
});

router.patch('/:clientId/tasks/:taskId', authenticateAdmin, async (req, res) => {
  try {
    const { done, title, detail, priority, dueDate } = req.body;
    const data = { updatedAt: new Date() };
    if (done !== undefined) data.done = done;
    if (title) data.title = title;
    if (detail !== undefined) data.detail = detail;
    if (priority) data.priority = priority;
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
    const task = await prisma.task.update({ where: { id: Number(req.params.taskId) }, data });
    res.json({ success: true, task });
  } catch (e) { err(res, e, 'tasks.update'); }
});

router.delete('/:clientId/tasks/:taskId', authenticateAdmin, async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: Number(req.params.taskId) } });
    res.json({ success: true });
  } catch (e) { err(res, e, 'tasks.delete'); }
});

// ── Services ──────────────────────────────────────────────────────────────────
router.post('/:id/services', authenticateAdmin, async (req, res) => {
  try {
    const { name, type, amount, renewalDate, firstYearFree, paidBy, notes } = req.body;
    const service = await prisma.clientService.create({
      data: {
        clientId: Number(req.params.id),
        name, type: type || 'mensual',
        amount: Number(amount || 0),
        renewalDate: renewalDate ? new Date(renewalDate) : null,
        firstYearFree: Boolean(firstYearFree),
        paidBy: paidBy || null,
        notes: notes || null
      }
    });
    res.json({ success: true, service });
  } catch (e) { err(res, e, 'services.create'); }
});

router.patch('/:id/services/:serviceId', authenticateAdmin, async (req, res) => {
  try {
    const { name, type, amount, active, renewalDate, firstYearFree, paidBy, notes } = req.body;
    const data = {};
    if (name !== undefined)          data.name = name;
    if (type !== undefined)          data.type = type;
    if (amount !== undefined)        data.amount = Number(amount);
    if (active !== undefined)        data.active = active;
    if (renewalDate !== undefined)   data.renewalDate = renewalDate ? new Date(renewalDate) : null;
    if (firstYearFree !== undefined) data.firstYearFree = firstYearFree;
    if (paidBy !== undefined)        data.paidBy = paidBy || null;
    if (notes !== undefined)         data.notes = notes || null;
    const service = await prisma.clientService.update({ where: { id: Number(req.params.serviceId) }, data });
    res.json({ success: true, service });
  } catch (e) { err(res, e, 'services.update'); }
});

router.delete('/:id/services/:serviceId', authenticateAdmin, async (req, res) => {
  try {
    await prisma.clientService.delete({ where: { id: Number(req.params.serviceId) } });
    res.json({ success: true });
  } catch (e) { err(res, e, 'services.delete'); }
});

module.exports = router;

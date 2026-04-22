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

// Multer for client files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/files', String(req.params.clientId));
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// Dashboard stats
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const [metrics, payments, clients] = await Promise.all([
      prisma.metric.findMany({ select: { spend: true, revenue: true, conversions: true, roas: true } }),
      prisma.payment.findMany({ select: { amount: true, status: true } }),
      prisma.client.count()
    ]);

    const totalSpend    = metrics.reduce((s, m) => s + m.spend, 0);
    const totalRevenue  = metrics.reduce((s, m) => s + m.revenue, 0);
    const totalConversions = metrics.reduce((s, m) => s + m.conversions, 0);
    const avgRoas       = metrics.length ? metrics.reduce((s, m) => s + m.roas, 0) / metrics.length : 0;
    const cobrado       = payments.filter(p => p.status === 'pagado').reduce((s, p) => s + p.amount, 0);
    const pendiente     = payments.filter(p => p.status === 'pendiente').reduce((s, p) => s + p.amount, 0);

    res.json({ success: true, stats: { totalSpend, totalRevenue, totalConversions, avgRoas, cobrado, pendiente, clients } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// List all clients
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, company: true, phone: true, plan: true, active: true, createdAt: true, hostingRenewal: true, domainRenewal: true, domainName: true }
    });
    res.json({ success: true, clients });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Create client — no password required, sends welcome email with setup link
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { name, email, company, phone, plan } = req.body;
    const tempPassword = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
    const client = await prisma.client.create({
      data: { name, email, password: tempPassword, company, phone, plan, active: false }
    });
    const siteUrl = process.env.SITE_URL || 'https://agenciasi.cl';
    const setupToken = jwt.sign({ role: 'client_setup', clientId: client.id }, JWT_SECRET, { expiresIn: '7d' });
    mailer.send({
      to: email,
      subject: `Bienvenido/a a AgenciaSi, ${name} — Crea tu contraseña`,
      html: mailer.clientWelcome({ clientName: name, setupLink: `${siteUrl}/portal/setup?token=${setupToken}` })
    }).catch(e => console.error('[welcome-email]', e.message));
    res.json({ success: true, client: { id: client.id, name: client.name, email: client.email } });
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ success: false, message: 'Email ya existe' });
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Resend welcome/setup email
router.post('/:id/resend-welcome', authenticateAdmin, async (req, res) => {
  try {
    const client = await prisma.client.findUnique({ where: { id: Number(req.params.id) }, select: { id: true, name: true, email: true } });
    if (!client) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    const siteUrl = process.env.SITE_URL || 'https://agenciasi.cl';
    const setupToken = jwt.sign({ role: 'client_setup', clientId: client.id }, JWT_SECRET, { expiresIn: '7d' });
    await mailer.send({
      to: client.email,
      subject: `Acceso a tu portal AgenciaSi — Crea tu contraseña`,
      html: mailer.clientWelcome({ clientName: client.name, setupLink: `${siteUrl}/portal/setup?token=${setupToken}` })
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al enviar el correo' });
  }
});

// Get single client with all data
router.get('/:id', authenticateAdmin, async (req, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        metrics: { orderBy: { date: 'desc' } },
        payments: { orderBy: { createdAt: 'desc' } },
        meetings: { orderBy: { date: 'asc' } },
        files: { orderBy: { createdAt: 'desc' } },
        tickets: { include: { messages: { orderBy: { createdAt: 'asc' } } }, orderBy: { createdAt: 'desc' } },
        tasks: { orderBy: { createdAt: 'desc' } }
      }
    });
    if (!client) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    const { password: _, ...clientData } = client;
    res.json({ success: true, client: clientData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Update client
router.patch('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name, email, company, phone, plan, active, password, domainName, hostingProvider, hostingRenewal, domainRenewal, serviceNotes } = req.body;
    const data = { name, email, company, phone, plan, active, domainName, hostingProvider, serviceNotes };
    if (hostingRenewal) data.hostingRenewal = new Date(hostingRenewal);
    if (domainRenewal) data.domainRenewal = new Date(domainRenewal);
    if (password) data.password = await bcrypt.hash(password, 10);
    const client = await prisma.client.update({ where: { id: Number(req.params.id) }, data });
    res.json({ success: true, client });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Send custom notification to client
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
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error enviando notificación' });
  }
});

// Delete client
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    await prisma.client.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// --- METRICS ---
router.post('/:id/metrics', authenticateAdmin, async (req, res) => {
  try {
    const { date, platform, impressions, clicks, spend, conversions, revenue } = req.body;
    const ctr = clicks && impressions ? (clicks / impressions) * 100 : 0;
    const cpc = clicks && spend ? spend / clicks : 0;
    const roas = spend && revenue ? revenue / spend : 0;
    const metric = await prisma.metric.create({
      data: {
        clientId: Number(req.params.id),
        date: new Date(date), platform,
        impressions: Number(impressions), clicks: Number(clicks),
        spend: Number(spend), conversions: Number(conversions),
        revenue: Number(revenue), ctr, cpc, roas
      }
    });
    res.json({ success: true, metric });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

router.delete('/:id/metrics/:metricId', authenticateAdmin, async (req, res) => {
  try {
    await prisma.metric.delete({ where: { id: Number(req.params.metricId) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// --- PAYMENTS ---
router.post('/:id/payments', authenticateAdmin, async (req, res) => {
  try {
    const { amount, description, status, dueDate, invoiceUrl } = req.body;
    const payment = await prisma.payment.create({
      data: {
        clientId: Number(req.params.id),
        amount: Number(amount), description, status,
        dueDate: dueDate ? new Date(dueDate) : null,
        invoiceUrl,
        paidAt: status === 'pagado' ? new Date() : null
      }
    });
    const client = await prisma.client.findUnique({ where: { id: Number(req.params.id) }, select: { name: true, email: true } });
    if (client) {
      mailer.send({
        to: client.email,
        subject: `Nuevo cobro registrado — $${Number(amount).toLocaleString('es-CL')} CLP`,
        html: mailer.paymentCreated({ clientName: client.name, amount, description, dueDate, status })
      });
    }
    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

router.patch('/:id/payments/:paymentId', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await prisma.payment.update({
      where: { id: Number(req.params.paymentId) },
      data: { status, paidAt: status === 'pagado' ? new Date() : null }
    });
    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// --- MEETINGS ---
router.post('/:id/meetings', authenticateAdmin, async (req, res) => {
  try {
    const { title, description, date, duration, meetLink } = req.body;
    const meeting = await prisma.meeting.create({
      data: { clientId: Number(req.params.id), title, description, date: new Date(date), duration: Number(duration), meetLink }
    });
    const client = await prisma.client.findUnique({ where: { id: Number(req.params.id) }, select: { name: true, email: true } });
    if (client) {
      mailer.send({
        to: client.email,
        subject: `Nueva reunión agendada: ${title}`,
        html: mailer.meetingScheduled({ clientName: client.name, title, date, duration, meetLink, description })
      });
    }
    res.json({ success: true, meeting });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

router.patch('/:id/meetings/:meetingId', authenticateAdmin, async (req, res) => {
  try {
    const meeting = await prisma.meeting.update({
      where: { id: Number(req.params.meetingId) },
      data: req.body
    });
    res.json({ success: true, meeting });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

router.delete('/:id/meetings/:meetingId', authenticateAdmin, async (req, res) => {
  try {
    await prisma.meeting.delete({ where: { id: Number(req.params.meetingId) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// --- FILES ---
router.post('/:clientId/files', authenticateAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const file = await prisma.clientFile.create({
      data: {
        clientId: Number(req.params.clientId),
        filename: req.file.filename,
        originalName: req.file.originalname,
        category: req.body.category || 'general',
        size: req.file.size,
        mimeType: req.file.mimetype
      }
    });
    const client = await prisma.client.findUnique({ where: { id: Number(req.params.clientId) }, select: { name: true, email: true } });
    if (client) {
      mailer.send({
        to: client.email,
        subject: `Nuevo archivo disponible: ${req.file.originalname}`,
        html: mailer.fileUploaded({ clientName: client.name, fileName: req.file.originalname, category: req.body.category || 'general' })
      });
    }
    res.json({ success: true, file });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

router.delete('/:clientId/files/:fileId', authenticateAdmin, async (req, res) => {
  try {
    const file = await prisma.clientFile.findUnique({ where: { id: Number(req.params.fileId) } });
    if (!file) return res.status(404).json({ success: false, message: 'Archivo no encontrado' });
    const filePath = path.join(__dirname, '../uploads/files', String(req.params.clientId), file.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await prisma.clientFile.delete({ where: { id: Number(req.params.fileId) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// --- TICKETS (admin respond) ---
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
    if (ticket.client) {
      mailer.send({
        to: ticket.client.email,
        subject: `Respuesta a tu ticket: ${ticket.subject}`,
        html: mailer.ticketReply({ clientName: ticket.client.name, subject: ticket.subject, adminMessage: req.body.content })
      });
    }
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

router.patch('/tickets/:ticketId/status', authenticateAdmin, async (req, res) => {
  try {
    const ticket = await prisma.ticket.update({
      where: { id: Number(req.params.ticketId) },
      data: { status: req.body.status }
    });
    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// --- TASKS ---
router.get('/:clientId/tasks', authenticateAdmin, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { clientId: Number(req.params.clientId) },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

router.post('/:clientId/tasks', authenticateAdmin, async (req, res) => {
  try {
    const { title, detail, priority, dueDate } = req.body;
    const task = await prisma.task.create({
      data: { clientId: Number(req.params.clientId), title, detail, priority: priority || 'normal', dueDate: dueDate ? new Date(dueDate) : null }
    });
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

router.patch('/:clientId/tasks/:taskId', authenticateAdmin, async (req, res) => {
  try {
    const { done, title, detail, priority, dueDate } = req.body;
    const task = await prisma.task.update({
      where: { id: Number(req.params.taskId) },
      data: { ...(done !== undefined && { done }), ...(title && { title }), ...(detail !== undefined && { detail }), ...(priority && { priority }), ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }), updatedAt: new Date() }
    });
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

router.delete('/:clientId/tasks/:taskId', authenticateAdmin, async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: Number(req.params.taskId) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

module.exports = router;

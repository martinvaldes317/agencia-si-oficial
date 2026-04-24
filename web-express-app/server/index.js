require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');
const archiver = require('archiver');
const prisma = require('./lib/prisma');
const mailer = require('./lib/mailer');
const { authenticateAdmin, JWT_SECRET } = require('./middleware/auth');
const { MercadoPagoConfig, Preference, Payment: MPPayment } = require('mercadopago');

const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const mpPreference = new Preference(mpClient);
const mpPaymentClient = new MPPayment(mpClient);
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use('/uploads/files', express.static(path.join(__dirname, 'uploads/files')));
app.use('/uploads/orders', express.static(path.join(__dirname, 'uploads/orders')));

// Ensure uploads dirs exist
['uploads', 'uploads/files', 'uploads/orders'].forEach(dir => {
  const p = path.join(__dirname, dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// ── Startup migration: add missing columns without depending on prisma db push ──
async function runMigrations() {
  const addCol = async (table, col, def) => {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE \`${table}\` ADD COLUMN \`${col}\` ${def}`);
      console.log(`[Migration] Added ${table}.${col}`);
    } catch (e) {
      if (!e.message.toLowerCase().includes('duplicate column') && !e.message.toLowerCase().includes('already exists')) {
        console.warn(`[Migration] ${table}.${col}: ${e.message}`);
      }
    }
  };
  const createTable = async (sql) => {
    try { await prisma.$executeRawUnsafe(sql); } catch (e) { console.warn('[Migration] createTable:', e.message); }
  };

  // Client new columns
  await addCol('Client', 'domainName',      'VARCHAR(191) NULL');
  await addCol('Client', 'hostingProvider', 'VARCHAR(191) NULL');
  await addCol('Client', 'hostingRenewal',  'DATETIME(3) NULL');
  await addCol('Client', 'domainRenewal',   'DATETIME(3) NULL');
  await addCol('Client', 'serviceNotes',    'LONGTEXT NULL');
  await addCol('Client', 'monthlyFee',         'DOUBLE NULL');
  await addCol('Client', 'hostingCost',        'DOUBLE NULL');
  await addCol('Client', 'domainCost',         'DOUBLE NULL');
  await addCol('Client', 'domainPaidByClient', 'TINYINT(1) NOT NULL DEFAULT 0');
  await addCol('Client', 'activeServices',     'VARCHAR(500) NULL');

  // AdminConfig table
  await createTable(`CREATE TABLE IF NOT EXISTS AdminConfig (
    id INT AUTO_INCREMENT PRIMARY KEY,
    \`key\` VARCHAR(191) NOT NULL,
    value LONGTEXT NOT NULL,
    UNIQUE KEY AdminConfig_key_key (\`key\`)
  )`);

  await addCol('ClientService', 'saleDate', 'DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)');

  // ClientService table
  await createTable(`CREATE TABLE IF NOT EXISTS ClientService (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clientId INT NOT NULL,
    name VARCHAR(191) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'mensual',
    amount DOUBLE NOT NULL DEFAULT 0,
    active TINYINT(1) NOT NULL DEFAULT 1,
    renewalDate DATETIME(3) NULL,
    firstYearFree TINYINT(1) NOT NULL DEFAULT 0,
    paidBy VARCHAR(50) NULL,
    notes TEXT NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    FOREIGN KEY (clientId) REFERENCES Client(id) ON DELETE CASCADE
  )`);

  // Task table
  await createTable(`CREATE TABLE IF NOT EXISTS Task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clientId INT NOT NULL,
    title VARCHAR(191) NOT NULL,
    detail VARCHAR(191) NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'normal',
    dueDate DATETIME(3) NULL,
    done TINYINT(1) NOT NULL DEFAULT 0,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    FOREIGN KEY (clientId) REFERENCES Client(id) ON DELETE CASCADE
  )`);

  // Licitacion table
  await createTable(`CREATE TABLE IF NOT EXISTS Licitacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entidad VARCHAR(191) NOT NULL,
    numero VARCHAR(191) NULL,
    descripcion VARCHAR(191) NOT NULL,
    monto DOUBLE NOT NULL DEFAULT 0,
    fechaAdjudicacion DATETIME(3) NOT NULL,
    notas LONGTEXT NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
  )`);

  await addCol('WebExpressOrder', 'logoName',    'VARCHAR(191) NULL');
  await addCol('WebExpressOrder', 'photosNames', 'LONGTEXT NULL');

  // WebExpressOrder table
  await createTable(`CREATE TABLE IF NOT EXISTS WebExpressOrder (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId VARCHAR(191) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'nuevo',
    businessName VARCHAR(191) NOT NULL,
    email VARCHAR(191) NOT NULL,
    phone VARCHAR(191) NULL,
    city VARCHAR(191) NULL,
    address VARCHAR(191) NULL,
    whatsapp VARCHAR(191) NULL,
    socials VARCHAR(191) NULL,
    hasDomain VARCHAR(50) NULL,
    brandColors VARCHAR(500) NULL,
    products LONGTEXT NULL,
    about LONGTEXT NULL,
    mission LONGTEXT NULL,
    vision VARCHAR(500) NULL,
    visualStyle VARCHAR(50) NULL,
    logoName VARCHAR(191) NULL,
    photosNames LONGTEXT NULL,
    clientId INT NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE KEY WebExpressOrder_orderId_key (orderId)
  )`);

  console.log('[Migration] Done');
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/licitaciones', require('./routes/licitaciones'));
app.use('/api/portal', require('./routes/portal'));

// ── Helpers ───────────────────────────────────────────────────────────────────

function extFromDataUrl(dataUrl) {
  const m = (dataUrl || '').match(/^data:image\/([a-z+]+);base64,/i);
  if (!m) return '.jpg';
  const t = m[1].toLowerCase();
  return t === 'jpeg' ? '.jpg' : t === 'svg+xml' ? '.svg' : `.${t}`;
}

function saveBase64(dataUrl, filePath) {
  const raw = dataUrl.replace(/^data:image\/[^;]+;base64,/, '');
  fs.writeFileSync(filePath, Buffer.from(raw, 'base64'));
}

async function generateOrderPdf(order, ordersDir) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const styleLabels = { minimalista: 'Minimalista', corporativo: 'Corporativo', moderno: 'Moderno / Tech', creativo: 'Creativo' };

    const title = (t) => { doc.fontSize(14).font('Helvetica-Bold').fillColor('#000').text(t); doc.moveDown(0.4); };
    const field = (label, value) => {
      if (!value) return;
      doc.fontSize(8).font('Helvetica-Bold').fillColor('#888').text(label.toUpperCase());
      doc.fontSize(11).font('Helvetica').fillColor('#000').text(String(value), { lineGap: 2 });
      doc.moveDown(0.5);
    };

    // Header
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#000').text('Pedido Web Express', { align: 'center' });
    doc.fontSize(10).font('Helvetica').fillColor('#555').text(order.orderId, { align: 'center' });
    doc.fontSize(9).fillColor('#888').text(new Date(order.createdAt).toLocaleString('es-CL'), { align: 'center' });
    doc.moveDown(1.5);

    title('Datos del negocio');
    field('Empresa', order.businessName);
    field('Email', order.email);
    field('Teléfono', order.phone);
    field('Ciudad', order.city);
    field('Dirección', order.address);
    field('WhatsApp', order.whatsapp);
    field('Redes sociales', order.socials);

    doc.moveDown(0.5);
    title('Identidad de marca');
    field('Logo', order.logoName || '— No adjuntado');
    field('¿Tiene dominio?', order.hasDomain === 'yes' ? 'Sí, ya tiene' : order.hasDomain === 'no' ? 'No, necesita' : null);
    field('Colores de marca', order.brandColors);

    doc.moveDown(0.5);
    title('Productos / Servicios');
    field('Descripción', order.products);

    doc.moveDown(0.5);
    title('Información institucional');
    field('Quiénes somos', order.about);
    field('Misión', order.mission);
    field('Visión', order.vision);

    doc.moveDown(0.5);
    title('Estilo visual');
    field('Estilo elegido', styleLabels[order.visualStyle] || order.visualStyle);

    // Photo filenames
    const fotosDir = path.join(ordersDir, 'fotos');
    const fotoFiles = fs.existsSync(fotosDir) ? fs.readdirSync(fotosDir) : [];
    if (fotoFiles.length > 0) {
      doc.moveDown(0.5);
      title('Fotografías adjuntas');
      fotoFiles.forEach((f, i) => {
        doc.fontSize(10).font('Helvetica').fillColor('#333').text(`${i + 1}. ${f}`);
      });
    }

    // Logo page
    const logoDir = path.join(ordersDir, 'logo');
    const logoFiles = fs.existsSync(logoDir) ? fs.readdirSync(logoDir) : [];
    if (logoFiles.length > 0) {
      doc.addPage();
      title('Logo');
      try { doc.image(path.join(logoDir, logoFiles[0]), { fit: [400, 300], align: 'center' }); }
      catch { doc.text(`[${logoFiles[0]}]`); }
    }

    // Photos page
    if (fotoFiles.length > 0) {
      doc.addPage();
      title('Fotografías');
      let x = 50, y = doc.y + 10;
      const W = 150, GAP = 20;
      fotoFiles.forEach(f => {
        try {
          if (y + W + 20 > doc.page.height - 50) { doc.addPage(); y = 50; x = 50; }
          doc.image(path.join(fotosDir, f), x, y, { fit: [W, W] });
          doc.fontSize(7).font('Helvetica').fillColor('#666').text(f, x, y + W + 3, { width: W, align: 'center' });
          x += W + GAP;
          if (x + W > doc.page.width - 50) { x = 50; y += W + 30; }
        } catch { /* skip unreadable image */ }
      });
    }

    doc.end();
  });
}

// --- Existing routes ---

// Submit contact form (Leads)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, company, budget, message, recaptchaToken } = req.body;
    if (process.env.RECAPTCHA_SECRET) {
      const verify = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaToken}`, { method: 'POST' });
      const { success } = await verify.json();
      if (!success) return res.status(400).json({ success: false, message: 'Captcha inválido' });
    }
    const newLead = await prisma.contactLead.create({ data: { name, email, phone, company, budget, message, type: 'cotizacion' } });
    mailer.send({ to: 'contacto@agenciasi.cl', subject: `Nuevo contacto: ${name}`, html: mailer.newContact({ name, email, phone, company, budget, message }) });
    res.status(200).json({ success: true, message: 'Lead saved successfully', lead: newLead });
  } catch (error) {
    console.error('Error saving lead:', error.message, error.code);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Submit SEO diagnostic form
app.post('/api/seo-diagnostic', async (req, res) => {
  try {
    const { name, email, phone, company, website, industry, timeOnline, monthlyVisits, currentSeo, geoTarget, goal, budget, competitors } = req.body;
    const message = JSON.stringify({ industry, timeOnline, monthlyVisits, currentSeo, geoTarget, goal, competitors });
    const newLead = await prisma.contactLead.create({
      data: { name, email, phone, company, website, budget, message, type: 'diagnostico_seo' }
    });
    mailer.send({ to: 'contacto@agenciasi.cl', subject: `Nuevo diagnóstico SEO: ${name}`, html: mailer.newSeoDiagnostic({ name, email, phone, company, website, budget, industry, goal }) });
    res.status(200).json({ success: true, message: 'Diagnóstico recibido', lead: newLead });
  } catch (error) {
    console.error('Error saving SEO diagnostic:', error);
    res.status(500).json({ success: false, message: 'Error saving to database' });
  }
});

// Submit a new Web Express order
app.post('/api/submit-order', async (req, res) => {
  try {
    const { businessName, email, phone, city, address, whatsapp, socials, hasDomain, brandColorsText, products, about, mission, vision, visualStyle, logoName, logoBase64, photosPreviews } = req.body;
    if (!businessName || !email) return res.status(400).json({ success: false, message: 'Nombre y email son requeridos' });

    const orderId = `ORDER-${Date.now()}`;

    // Save images to disk
    const ordersDir = path.join(__dirname, 'uploads', 'orders', orderId);
    let savedLogoName = null;
    const savedPhotoNames = [];

    if (logoBase64) {
      const ext = extFromDataUrl(logoBase64);
      savedLogoName = logoName || `logo${ext}`;
      fs.mkdirSync(path.join(ordersDir, 'logo'), { recursive: true });
      saveBase64(logoBase64, path.join(ordersDir, 'logo', savedLogoName));
    }

    if (Array.isArray(photosPreviews) && photosPreviews.length > 0) {
      fs.mkdirSync(path.join(ordersDir, 'fotos'), { recursive: true });
      photosPreviews.forEach((photo, i) => {
        const dataUrl = photo.dataUrl || photo;
        const ext = extFromDataUrl(dataUrl);
        const name = photo.name || `foto_${i + 1}${ext}`;
        savedPhotoNames.push(name);
        saveBase64(dataUrl, path.join(ordersDir, 'fotos', name));
      });
    }

    const order = await prisma.webExpressOrder.create({
      data: { orderId, businessName, email, phone: phone || null, city: city || null, address: address || null, whatsapp: whatsapp || null, socials: socials || null, hasDomain: hasDomain || null, brandColors: brandColorsText || null, products: products || '', about: about || null, mission: mission || null, vision: vision || null, visualStyle: visualStyle || 'minimalista', logoName: savedLogoName, photosNames: savedPhotoNames.length > 0 ? JSON.stringify(savedPhotoNames) : null }
    });

    // Create client account if doesn't exist
    const siteUrl = process.env.SITE_URL || 'https://agenciasi.cl';
    let clientId = null;
    const existing = await prisma.client.findUnique({ where: { email } });
    if (!existing) {
      const tempHash = await bcrypt.hash(`temp-${Date.now()}`, 10);
      const newClient = await prisma.client.create({
        data: { email, password: tempHash, name: businessName, company: businessName, phone: phone || null, plan: 'web-express', active: false }
      });
      clientId = newClient.id;
      const setupToken = jwt.sign({ role: 'client_setup', clientId: newClient.id }, JWT_SECRET, { expiresIn: '7d' });
      mailer.send({ to: email, subject: 'Tu web está en producción — Accede a tu panel', html: mailer.clientWelcome({ clientName: businessName, setupLink: `${siteUrl}/portal/setup?token=${setupToken}` }) })
        .catch(e => console.error('[wizard-welcome]', e.message));
    } else {
      clientId = existing.id;
    }

    await prisma.webExpressOrder.update({ where: { orderId }, data: { clientId } });
    mailer.send({ to: 'contacto@agenciasi.cl', subject: `Nuevo pedido Web Express: ${businessName}`, html: mailer.newOrder({ orderId, name: businessName, email, phone, service: 'Web Profesional Express', plan: visualStyle }) })
      .catch(e => console.error('[wizard-notify]', e.message));

    res.json({ success: true, orderId });
  } catch (error) {
    console.error('[submit-order]', error.message);
    res.status(500).json({ success: false, message: 'Error al procesar el pedido' });
  }
});

// MercadoPago: Create payment preference (called by wizard before redirecting)
app.post('/api/mp/create-preference', async (req, res) => {
  try {
    const { businessName, email, phone, city, address, whatsapp, socials, hasDomain, brandColorsText, products, about, mission, vision, visualStyle, logoName, logoBase64, photosPreviews } = req.body;
    if (!businessName || !email) return res.status(400).json({ success: false, message: 'Nombre y email son requeridos' });

    const orderId = `ORDER-${Date.now()}`;
    const siteUrl = process.env.SITE_URL || 'https://agenciasi.cl';

    // Save images to disk
    const ordersDir = path.join(__dirname, 'uploads', 'orders', orderId);
    let savedLogoName = null;
    const savedPhotoNames = [];

    if (logoBase64) {
      const ext = extFromDataUrl(logoBase64);
      savedLogoName = logoName || `logo${ext}`;
      fs.mkdirSync(path.join(ordersDir, 'logo'), { recursive: true });
      saveBase64(logoBase64, path.join(ordersDir, 'logo', savedLogoName));
    }

    if (Array.isArray(photosPreviews) && photosPreviews.length > 0) {
      fs.mkdirSync(path.join(ordersDir, 'fotos'), { recursive: true });
      photosPreviews.forEach((photo, i) => {
        const dataUrl = photo.dataUrl || photo;
        const ext = extFromDataUrl(dataUrl);
        const name = photo.name || `foto_${i + 1}${ext}`;
        savedPhotoNames.push(name);
        saveBase64(dataUrl, path.join(ordersDir, 'fotos', name));
      });
    }

    await prisma.webExpressOrder.create({
      data: {
        orderId, businessName, email,
        phone: phone || null, city: city || null, address: address || null,
        whatsapp: whatsapp || null, socials: socials || null, hasDomain: hasDomain || null,
        brandColors: brandColorsText || null, products: products || '',
        about: about || null, mission: mission || null, vision: vision || null,
        visualStyle: visualStyle || 'minimalista',
        logoName: savedLogoName,
        photosNames: savedPhotoNames.length > 0 ? JSON.stringify(savedPhotoNames) : null,
        status: 'pendiente_pago'
      }
    });

    const preference = await mpPreference.create({
      body: {
        items: [{
          id: orderId,
          title: 'Web Profesional Express',
          description: `Sitio web para ${businessName}`,
          quantity: 1,
          unit_price: 129990,
          currency_id: 'CLP'
        }],
        payer: { name: businessName, email },
        external_reference: orderId,
        back_urls: {
          success: `${siteUrl}/digitalizacion-express/pago`,
          failure: `${siteUrl}/digitalizacion-express/pago`,
          pending: `${siteUrl}/digitalizacion-express/pago`
        },
        auto_return: 'approved',
        notification_url: `${siteUrl}/api/webhooks/mercadopago`
      }
    });

    res.json({ success: true, orderId, init_point: preference.init_point });
  } catch (error) {
    console.error('[mp-create-preference]', error.message);
    res.status(500).json({ success: false, message: 'Error al crear la preferencia de pago' });
  }
});

// MercadoPago: Webhook — confirms payment and activates the order
app.post('/api/webhooks/mercadopago', async (req, res) => {
  res.sendStatus(200); // respond immediately so MP doesn't retry
  const { type, data } = req.body;
  if (type !== 'payment' || !data?.id) return;

  try {
    const payment = await mpPaymentClient.get({ id: data.id });
    if (payment.status !== 'approved') return;

    const orderId = payment.external_reference;
    if (!orderId) return;

    const order = await prisma.webExpressOrder.findUnique({ where: { orderId } });
    if (!order || order.status !== 'pendiente_pago') return; // already processed or not found

    await prisma.webExpressOrder.update({ where: { orderId }, data: { status: 'nuevo' } });

    const siteUrl = process.env.SITE_URL || 'https://agenciasi.cl';
    let clientId = order.clientId;

    if (!clientId) {
      const existing = await prisma.client.findUnique({ where: { email: order.email } });
      if (!existing) {
        const tempHash = await bcrypt.hash(`temp-${Date.now()}`, 10);
        const newClient = await prisma.client.create({
          data: { email: order.email, password: tempHash, name: order.businessName, company: order.businessName, phone: order.phone || null, plan: 'web-express', active: false }
        });
        clientId = newClient.id;
        const setupToken = jwt.sign({ role: 'client_setup', clientId: newClient.id }, JWT_SECRET, { expiresIn: '7d' });
        mailer.send({ to: order.email, subject: 'Tu web está en producción — Accede a tu panel', html: mailer.clientWelcome({ clientName: order.businessName, setupLink: `${siteUrl}/portal/setup?token=${setupToken}` }) })
          .catch(e => console.error('[webhook-welcome]', e.message));
      } else {
        clientId = existing.id;
      }
      await prisma.webExpressOrder.update({ where: { orderId }, data: { clientId } });
    }

    mailer.send({ to: 'contacto@agenciasi.cl', subject: `Pago confirmado: ${order.businessName}`, html: mailer.newOrder({ orderId, name: order.businessName, email: order.email, phone: order.phone, service: 'Web Profesional Express', plan: order.visualStyle }) })
      .catch(e => console.error('[webhook-notify]', e.message));

    console.log(`[webhook-mp] Pedido ${orderId} confirmado`);
  } catch (e) {
    console.error('[webhook-mp]', e.message);
  }
});

// Admin: List all Web Express orders
app.get('/api/orders', authenticateAdmin, async (req, res) => {
  try {
    const orders = await prisma.webExpressOrder.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
});

// Admin: Update order status
app.patch('/api/orders/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.webExpressOrder.update({
      where: { orderId: req.params.id },
      data: { status }
    });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
});

// Admin: Delete order
app.delete('/api/orders/:orderId', authenticateAdmin, async (req, res) => {
  try {
    const order = await prisma.webExpressOrder.findUnique({ where: { orderId: req.params.orderId } });
    if (!order) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });

    // Delete auto-created client account only if it was never activated
    if (order.clientId) {
      const client = await prisma.client.findUnique({ where: { id: order.clientId } });
      if (client && client.plan === 'web-express' && !client.active) {
        await prisma.client.delete({ where: { id: order.clientId } });
      }
    }

    await prisma.webExpressOrder.delete({ where: { orderId: req.params.orderId } });
    const ordersDir = path.join(__dirname, 'uploads', 'orders', req.params.orderId);
    if (fs.existsSync(ordersDir)) fs.rmSync(ordersDir, { recursive: true, force: true });
    res.json({ success: true });
  } catch (error) {
    console.error('[delete-order]', error.message);
    res.status(500).json({ success: false, message: 'Error al eliminar' });
  }
});

// Admin: Download order as ZIP (PDF + images)
app.get('/api/orders/:orderId/download', authenticateAdmin, async (req, res) => {
  try {
    const order = await prisma.webExpressOrder.findUnique({ where: { orderId: req.params.orderId } });
    if (!order) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });

    const ordersDir = path.join(__dirname, 'uploads', 'orders', order.orderId);
    const pdfBuffer = await generateOrderPdf(order, ordersDir);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${order.orderId}.zip"`);

    const archive = archiver('zip', { zlib: { level: 6 } });
    archive.on('error', err => { throw err; });
    archive.pipe(res);

    archive.append(pdfBuffer, { name: 'pedido.pdf' });

    const logoDir = path.join(ordersDir, 'logo');
    if (fs.existsSync(logoDir)) {
      fs.readdirSync(logoDir).forEach(f => archive.file(path.join(logoDir, f), { name: `logo/${f}` }));
    }

    const fotosDir = path.join(ordersDir, 'fotos');
    if (fs.existsSync(fotosDir)) {
      fs.readdirSync(fotosDir).forEach(f => archive.file(path.join(fotosDir, f), { name: `fotos/${f}` }));
    }

    await archive.finalize();
  } catch (error) {
    console.error('[download-order]', error.message);
    if (!res.headersSent) res.status(500).json({ success: false, message: 'Error generando el ZIP' });
  }
});

// 404 & Error handlers
app.use((_req, res) => res.status(404).json({ success: false, message: 'Not found' }));
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

runMigrations()
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch(e => { console.error('[Startup] Migration failed:', e.message); process.exit(1); });

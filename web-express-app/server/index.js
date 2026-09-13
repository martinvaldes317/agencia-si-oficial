require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');
const archiver = require('archiver');
const prisma = require('./lib/prisma');
const mailer = require('./lib/mailer');
const { getSeoMeta } = require('./lib/seoLocalPages');
const { sendCapiEvent } = require('./lib/metaCapi');
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

  // WebOrderDraft table — /sitio-web "continuar en otro dispositivo" y
  // autoguardado de cada paso para verlo en el panel admin
  await createTable(`CREATE TABLE IF NOT EXISTS WebOrderDraft (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(64) NOT NULL,
    step INT NOT NULL DEFAULT 1,
    data LONGTEXT NOT NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    expiresAt DATETIME(3) NOT NULL,
    UNIQUE KEY WebOrderDraft_token_key (token)
  )`);
  await addCol('WebOrderDraft', 'updatedAt', 'DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)');

  // AnalyticsPageView / AnalyticsEvent tables — analítica propia del sitio
  await createTable(`CREATE TABLE IF NOT EXISTS AnalyticsPageView (
    id INT AUTO_INCREMENT PRIMARY KEY,
    path VARCHAR(191) NOT NULL,
    visitorId VARCHAR(64) NOT NULL,
    device VARCHAR(20) NOT NULL,
    referrer TEXT NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    KEY AnalyticsPageView_path_idx (path),
    KEY AnalyticsPageView_visitorId_idx (visitorId),
    KEY AnalyticsPageView_createdAt_idx (createdAt)
  )`);

  await createTable(`CREATE TABLE IF NOT EXISTS AnalyticsEvent (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventName VARCHAR(100) NOT NULL,
    path VARCHAR(191) NOT NULL,
    visitorId VARCHAR(64) NOT NULL,
    label VARCHAR(191) NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    KEY AnalyticsEvent_eventName_idx (eventName),
    KEY AnalyticsEvent_path_idx (path),
    KEY AnalyticsEvent_createdAt_idx (createdAt)
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
    modalidad VARCHAR(20) NULL,
    contactName VARCHAR(191) NULL,
    rut VARCHAR(50) NULL,
    razonSocial VARCHAR(191) NULL,
    rubro VARCHAR(191) NULL,
    secciones LONGTEXT NULL,
    region VARCHAR(191) NULL,
    publicEmail VARCHAR(191) NULL,
    wantsMaps TINYINT(1) NOT NULL DEFAULT 0,
    domainWanted VARCHAR(191) NULL,
    domainExisting VARCHAR(191) NULL,
    wantsStore TINYINT(1) NOT NULL DEFAULT 0,
    productCount VARCHAR(20) NULL,
    hasMercadoPago VARCHAR(10) NULL,
    montoNeto DOUBLE NULL,
    montoIva DOUBLE NULL,
    montoTotal DOUBLE NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE KEY WebExpressOrder_orderId_key (orderId)
  )`);

  // Sitio Web landing (compra online / WhatsApp) — nuevas columnas en tabla ya existente
  await addCol('WebExpressOrder', 'modalidad',      'VARCHAR(20) NULL');
  await addCol('WebExpressOrder', 'contactName',    'VARCHAR(191) NULL');
  await addCol('WebExpressOrder', 'rut',            'VARCHAR(50) NULL');
  await addCol('WebExpressOrder', 'razonSocial',    'VARCHAR(191) NULL');
  await addCol('WebExpressOrder', 'rubro',          'VARCHAR(191) NULL');
  await addCol('WebExpressOrder', 'secciones',      'LONGTEXT NULL');
  await addCol('WebExpressOrder', 'region',         'VARCHAR(191) NULL');
  await addCol('WebExpressOrder', 'publicEmail',    'VARCHAR(191) NULL');
  await addCol('WebExpressOrder', 'wantsMaps',      'TINYINT(1) NOT NULL DEFAULT 0');
  await addCol('WebExpressOrder', 'domainWanted',   'VARCHAR(191) NULL');
  await addCol('WebExpressOrder', 'domainExisting', 'VARCHAR(191) NULL');
  await addCol('WebExpressOrder', 'wantsStore',     'TINYINT(1) NOT NULL DEFAULT 0');
  await addCol('WebExpressOrder', 'productCount',   'VARCHAR(20) NULL');
  await addCol('WebExpressOrder', 'hasMercadoPago', 'VARCHAR(10) NULL');
  await addCol('WebExpressOrder', 'montoNeto',      'DOUBLE NULL');
  await addCol('WebExpressOrder', 'montoIva',       'DOUBLE NULL');
  await addCol('WebExpressOrder', 'montoTotal',     'DOUBLE NULL');

  console.log('[Migration] Done');
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/licitaciones', require('./routes/licitaciones'));
app.use('/api/portal', require('./routes/portal'));
app.use('/api/analytics', require('./routes/analytics'));

// ── Helpers ───────────────────────────────────────────────────────────────────

// SITE_URL (agenciasi.cl) is the static-hosted frontend — Mercado Pago webhooks
// must hit THIS running Express process instead, so they need the API's own
// public URL (Railway), never the frontend's.
function apiBaseUrl() {
  if (process.env.API_URL) return process.env.API_URL;
  if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  return 'http://localhost:3000';
}

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

// "Sitio Web Profesional" landing (compra online $49.990+IVA / contratación WhatsApp $74.990+IVA)
const WEB_ORDER_BASE_PRICE     = 49990;
const WEB_ORDER_STORE_PRICE    = 25990;
const WEB_ORDER_WA_PRICE       = 74990;
const WEB_ORDER_SECTION_INCLUDED = 5;
const WEB_ORDER_EXTRA_SECTION_PRICE = 9990;
const IVA_RATE = 0.19;
const WEB_DRAFT_TTL_DAYS = 7;

// Save the in-progress wizard state so it can be resumed on another device
// (link sent via WhatsApp/email). No files (logo/photos) are stored here —
// only the text fields and the step the customer was on.
app.post('/api/web-orders/draft', async (req, res) => {
  try {
    const { data, step, token: existingToken } = req.body;
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ success: false, message: 'Falta el borrador a guardar' });
    }
    const expiresAt = new Date(Date.now() + WEB_DRAFT_TTL_DAYS * 24 * 60 * 60 * 1000);

    // Si ya hay un token de esta misma sesión (autoguardado de un paso
    // anterior, o el mismo borrador que se comparte a otro dispositivo),
    // actualiza esa fila en vez de crear una nueva por cada paso.
    if (existingToken) {
      const updated = await prisma.webOrderDraft.updateMany({
        where: { token: existingToken },
        data: { step: Number(step) || 1, data: JSON.stringify(data), expiresAt },
      });
      if (updated.count > 0) {
        return res.json({ success: true, token: existingToken });
      }
    }

    const token = crypto.randomBytes(5).toString('hex');
    await prisma.webOrderDraft.create({
      data: { token, step: Number(step) || 1, data: JSON.stringify(data), expiresAt },
    });
    res.json({ success: true, token });
  } catch (error) {
    console.error('[web-orders-draft-save]', error.message);
    res.status(500).json({ success: false, message: 'Error al guardar el borrador' });
  }
});

app.get('/api/web-orders/draft/:token', async (req, res) => {
  try {
    const draft = await prisma.webOrderDraft.findUnique({ where: { token: req.params.token } });
    if (!draft || draft.expiresAt < new Date()) {
      return res.status(404).json({ success: false, message: 'Este enlace ya no está disponible' });
    }
    res.json({ success: true, step: draft.step, data: JSON.parse(draft.data) });
  } catch (error) {
    console.error('[web-orders-draft-get]', error.message);
    res.status(500).json({ success: false, message: 'Error al recuperar el borrador' });
  }
});

// Panel admin: ver quién está (o quedó) llenando el formulario y hasta dónde
// llegó, aunque nunca lo haya terminado ni compartido a otro dispositivo.
app.get('/api/web-orders/drafts', authenticateAdmin, async (req, res) => {
  try {
    const drafts = await prisma.webOrderDraft.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 200,
    });
    res.json({
      success: true,
      drafts: drafts.map(d => {
        let data = {};
        try { data = JSON.parse(d.data) || {}; } catch { /* borrador corrupto, se listan solo los metadatos */ }
        return {
          token: d.token,
          step: d.step,
          modalidad: data.modalidad || null,
          name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || null,
          companyName: data.companyName || null,
          email: data.email || null,
          whatsapp: data.personalWhatsapp || data.businessWhatsapp || null,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
          expired: d.expiresAt < new Date(),
        };
      }),
    });
  } catch (error) {
    console.error('[web-orders-drafts-list]', error.message);
    res.status(500).json({ success: false, message: 'Error al listar borradores' });
  }
});

app.get('/api/web-orders/drafts/:token', authenticateAdmin, async (req, res) => {
  try {
    const draft = await prisma.webOrderDraft.findUnique({ where: { token: req.params.token } });
    if (!draft) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.json({
      success: true,
      step: draft.step,
      data: JSON.parse(draft.data),
      createdAt: draft.createdAt,
      updatedAt: draft.updatedAt,
      expired: draft.expiresAt < new Date(),
    });
  } catch (error) {
    console.error('[web-orders-drafts-detail]', error.message);
    res.status(500).json({ success: false, message: 'Error al obtener el borrador' });
  }
});

app.post('/api/web-orders', async (req, res) => {
  try {
    const {
      modalidad, // 'online' | 'whatsapp'
      firstName, lastName, email, personalWhatsapp,
      companyName, rut, razonSocial,
      rubro, about, hasLogo, logoBase64, logoName, hasPhotos, photosPreviews,
      secciones,
      businessWhatsapp, publicEmail, address, comuna, region, wantsMaps,
      instagram, facebook, tiktok, youtube, otherSocial,
      hasDomain, domainWanted, domainExisting,
      wantsStore, productCount, hasMercadoPago,
    } = req.body;

    if (!firstName || !email || !companyName) {
      return res.status(400).json({ success: false, message: 'Nombre, email y nombre de negocio son requeridos' });
    }

    const contactName = `${firstName} ${lastName || ''}`.trim();
    const orderId = `WEB-${Date.now()}`;
    const siteUrl = process.env.SITE_URL || 'https://agenciasi.cl';

    const seccionesCount = Array.isArray(secciones) ? secciones.length : 0;
    const extraSecciones = Math.max(0, seccionesCount - WEB_ORDER_SECTION_INCLUDED);
    const montoNeto  = WEB_ORDER_BASE_PRICE
      + (wantsStore ? WEB_ORDER_STORE_PRICE : 0)
      + extraSecciones * WEB_ORDER_EXTRA_SECTION_PRICE;
    const montoIva   = Math.round(montoNeto * IVA_RATE);
    const montoTotal = montoNeto + montoIva;

    // Save logo / photos to disk (same convention as the rest of WebExpressOrder)
    const ordersDir = path.join(__dirname, 'uploads', 'orders', orderId);
    let savedLogoName = null;
    const savedPhotoNames = [];

    if (hasLogo && logoBase64) {
      const ext = extFromDataUrl(logoBase64);
      savedLogoName = logoName || `logo${ext}`;
      fs.mkdirSync(path.join(ordersDir, 'logo'), { recursive: true });
      saveBase64(logoBase64, path.join(ordersDir, 'logo', savedLogoName));
    }

    if (hasPhotos && Array.isArray(photosPreviews) && photosPreviews.length > 0) {
      fs.mkdirSync(path.join(ordersDir, 'fotos'), { recursive: true });
      photosPreviews.forEach((photo, i) => {
        const dataUrl = photo.dataUrl || photo;
        const ext = extFromDataUrl(dataUrl);
        const name = photo.name || `foto_${i + 1}${ext}`;
        savedPhotoNames.push(name);
        saveBase64(dataUrl, path.join(ordersDir, 'fotos', name));
      });
    }

    const socials = JSON.stringify({ instagram, facebook, tiktok, youtube, otherSocial });

    const order = await prisma.webExpressOrder.create({
      data: {
        orderId,
        status: modalidad === 'online' ? 'pendiente_pago' : 'contacto_whatsapp',
        businessName: companyName,
        email,
        phone: personalWhatsapp || null,
        city: comuna || null,
        address: address || null,
        whatsapp: businessWhatsapp || null,
        socials,
        hasDomain: hasDomain || null,
        products: '',
        about: about || null,
        logoName: savedLogoName,
        photosNames: savedPhotoNames.length > 0 ? JSON.stringify(savedPhotoNames) : null,
        modalidad: modalidad || 'online',
        contactName,
        rut: rut || null,
        razonSocial: razonSocial || null,
        rubro: rubro || null,
        secciones: Array.isArray(secciones) ? JSON.stringify(secciones) : null,
        region: region || null,
        publicEmail: publicEmail || null,
        wantsMaps: !!wantsMaps,
        domainWanted: domainWanted || null,
        domainExisting: domainExisting || null,
        wantsStore: !!wantsStore,
        productCount: wantsStore ? (productCount || null) : null,
        hasMercadoPago: wantsStore ? (hasMercadoPago || null) : null,
        montoNeto,
        montoIva,
        montoTotal,
      },
    });

    // Create client account (inactive until payment/contact is finalized) — mirrors /api/submit-order
    let clientId = null;
    const existing = await prisma.client.findUnique({ where: { email } });
    if (!existing) {
      const tempHash = await bcrypt.hash(`temp-${Date.now()}`, 10);
      const newClient = await prisma.client.create({
        data: { email, password: tempHash, name: contactName, company: companyName, phone: personalWhatsapp || null, plan: 'sitio-web', active: false },
      });
      clientId = newClient.id;
    } else {
      clientId = existing.id;
    }
    await prisma.webExpressOrder.update({ where: { orderId }, data: { clientId } });

    sendCapiEvent({
      eventName: 'Lead',
      eventId: orderId,
      eventSourceUrl: `${siteUrl}/sitio-web/formulario/`,
      email, phone: personalWhatsapp,
      customData: { value: montoTotal, currency: 'CLP', content_name: 'Sitio Web Profesional' },
    }).catch(e => console.error('[web-orders-capi]', e.message));

    if (modalidad === 'whatsapp') {
      // No payment collected here — the client finishes contracting directly over WhatsApp.
      mailer.send({ to: 'contacto@agenciasi.cl', subject: `Nuevo interesado (WhatsApp): ${companyName}`, html: mailer.newOrder({ orderId, name: contactName, email, phone: personalWhatsapp, service: 'Sitio Web Profesional', plan: `WhatsApp asistido — $${montoTotal.toLocaleString('es-CL')}${wantsStore ? ' (+ Tienda Online)' : ''}` }) })
        .catch(e => console.error('[web-orders-wa-notify]', e.message));

      return res.json({ success: true, orderId, montoTotal });
    }

    // modalidad === 'online' → create Mercado Pago preference and hand back the checkout URL
    const items = [{
      id: `${orderId}-web`,
      title: 'Sitio Web Profesional — AgenciaSI',
      description: `Sitio web para ${companyName}`,
      quantity: 1,
      unit_price: WEB_ORDER_BASE_PRICE + Math.round(WEB_ORDER_BASE_PRICE * IVA_RATE),
      currency_id: 'CLP',
    }];
    if (wantsStore) {
      items.push({
        id: `${orderId}-tienda`,
        title: 'Tienda Online (adicional) — AgenciaSI',
        description: 'Carro de compras, catálogo y Mercado Pago integrado',
        quantity: 1,
        unit_price: WEB_ORDER_STORE_PRICE + Math.round(WEB_ORDER_STORE_PRICE * IVA_RATE),
        currency_id: 'CLP',
      });
    }
    if (extraSecciones > 0) {
      items.push({
        id: `${orderId}-secciones-extra`,
        title: 'Secciones adicionales — AgenciaSI',
        description: `${extraSecciones} sección(es) adicional(es) a las 5 incluidas`,
        quantity: extraSecciones,
        unit_price: WEB_ORDER_EXTRA_SECTION_PRICE + Math.round(WEB_ORDER_EXTRA_SECTION_PRICE * IVA_RATE),
        currency_id: 'CLP',
      });
    }

    const preference = await mpPreference.create({
      body: {
        items,
        payer: { name: contactName, email },
        external_reference: orderId,
        back_urls: {
          success: `${siteUrl}/sitio-web/confirmacion/`,
          failure: `${siteUrl}/sitio-web/confirmacion/`,
          pending: `${siteUrl}/sitio-web/confirmacion/`,
        },
        auto_return: 'approved',
        notification_url: `${apiBaseUrl()}/api/webhooks/mercadopago`,
      },
    });

    res.json({ success: true, orderId, montoNeto, montoIva, montoTotal, init_point: preference.init_point });
  } catch (error) {
    console.error('[web-orders]', error.message);
    res.status(500).json({ success: false, message: 'Error al procesar tu pedido' });
  }
});

// Crea la contraseña del portal justo después del pago, en vez de esperar el
// correo de bienvenida (que hoy solo se envía para pedidos sin clientId previo
// — los de /sitio-web ya llegan con clientId asignado, así que ese correo nunca
// se dispara para ellos). Se identifica al dueño del pedido con orderId + email
// (mismo estándar que un "seguimiento de pedido" de e-commerce), y solo si el
// pago ya está confirmado.
app.post('/api/web-orders/:orderId/set-password', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { email, password } = req.body;
    if (!email || !password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Datos inválidos' });
    }

    const order = await prisma.webExpressOrder.findUnique({ where: { orderId } });
    if (!order || !order.email || order.email.toLowerCase() !== String(email).toLowerCase()) {
      return res.status(404).json({ success: false, message: 'No encontramos ese pedido con ese correo' });
    }
    if (order.status === 'pendiente_pago') {
      return res.status(400).json({ success: false, message: 'Tu pago todavía no se ha confirmado' });
    }
    if (!order.clientId) {
      return res.status(404).json({ success: false, message: 'No encontramos tu cuenta de cliente' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const client = await prisma.client.update({ where: { id: order.clientId }, data: { password: hashed, active: true } });

    const token = jwt.sign({ id: client.id, email: client.email, name: client.name, role: 'client' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, client: { id: client.id, name: client.name, email: client.email, company: client.company, plan: client.plan } });
  } catch (error) {
    console.error('[web-orders-set-password]', error.message);
    res.status(500).json({ success: false, message: 'Error al crear tu acceso' });
  }
});

// MercadoPago: Demo checkout — creates a one-off preference for demo sites
app.post('/api/demos/checkout', async (req, res) => {
  try {
    const { type, items, payer, entrega, direccion, notas } = req.body;
    if (!type || !Array.isArray(items) || items.length === 0)
      return res.status(400).json({ success: false, message: 'type e items son requeridos' });

    const siteUrl = process.env.SITE_URL || 'https://agenciasi.cl';

    const additionalInfo = [
      entrega ? `Entrega: ${entrega}` : null,
      direccion ? `Dirección: ${direccion}` : null,
      notas ? `Notas: ${notas}` : null,
    ].filter(Boolean).join(' | ');

    const preference = await mpPreference.create({
      body: {
        items: items.map(i => ({
          title:       i.title,
          quantity:    i.quantity,
          unit_price:  i.unit_price,
          currency_id: 'CLP',
        })),
        payer: payer ? {
          name:  payer.nombre || '',
          email: payer.email  || '',
          phone: { area_code: '56', number: (payer.telefono || '').replace(/\D/g, '') },
        } : undefined,
        additional_info: additionalInfo || undefined,
        back_urls: {
          success: `${siteUrl}/demos/${type}?status=approved`,
          failure: `${siteUrl}/demos/${type}?status=failure`,
          pending: `${siteUrl}/demos/${type}?status=pending`,
        },
        auto_return: 'approved',
      },
    });
    res.json({ success: true, init_point: preference.init_point });
  } catch (error) {
    console.error('[demos-checkout]', error.message);
    res.status(500).json({ success: false, message: 'Error al crear la preferencia' });
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

    // Only orders from the /sitio-web funnel (modalidad set) belong to that campaign's pixel.
    if (order.modalidad) {
      sendCapiEvent({
        eventName: 'Purchase',
        eventId: orderId,
        eventSourceUrl: `${siteUrl}/sitio-web/confirmacion/`,
        email: order.email, phone: order.phone,
        customData: { value: order.montoTotal, currency: 'CLP', content_name: 'Sitio Web Profesional' },
      }).catch(e => console.error('[webhook-capi]', e.message));
    }

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

// Serve React frontend (SPA catch-all — must be last, after all API routes)
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  const indexPath = path.join(distPath, 'index.html');
  const indexHtmlTemplate = fs.readFileSync(indexPath, 'utf-8');

  app.get('*', (req, res) => {
    const meta = getSeoMeta(req.path);
    if (!meta) return res.sendFile(indexPath);

    // Inject per-route title/description/canonical into the SPA shell so
    // Googlebot's raw HTML fetch (pre-JS) already carries the right signal —
    // otherwise every local SEO page shares the same generic head tags.
    const html = indexHtmlTemplate
      .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${meta.description}" />`)
      .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${meta.title}" />`)
      .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${meta.description}" />`)
      .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${meta.canonical}" />`)
      .replace('</head>', `  <link rel="canonical" href="${meta.canonical}" />\n</head>`);

    res.set('Content-Type', 'text/html');
    res.send(html);
  });
} else {
  app.use((_req, res) => res.status(404).json({ success: false, message: 'Not found' }));
}

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

runMigrations()
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch(e => { console.error('[Startup] Migration failed:', e.message); process.exit(1); });

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('./lib/prisma');
const mailer = require('./lib/mailer');
const { authenticateAdmin, JWT_SECRET } = require('./middleware/auth');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Static files for client downloads (served with auth in route)
app.use('/uploads/files', express.static(path.join(__dirname, 'uploads/files')));

// Ensure uploads dirs exist
['uploads', 'uploads/files'].forEach(dir => {
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
    const { businessName, email, phone, city, address, whatsapp, socials, hasDomain, brandColorsText, products, about, mission, vision, visualStyle } = req.body;
    if (!businessName || !email) return res.status(400).json({ success: false, message: 'Nombre y email son requeridos' });

    const orderId = `ORDER-${Date.now()}`;
    const order = await prisma.webExpressOrder.create({
      data: { orderId, businessName, email, phone: phone || null, city: city || null, address: address || null, whatsapp: whatsapp || null, socials: socials || null, hasDomain: hasDomain || null, brandColors: brandColorsText || null, products: products || '', about: about || null, mission: mission || null, vision: vision || null, visualStyle: visualStyle || 'minimalista' }
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

// 404 & Error handlers
app.use((_req, res) => res.status(404).json({ success: false, message: 'Not found' }));
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

runMigrations()
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch(e => { console.error('[Startup] Migration failed:', e.message); process.exit(1); });

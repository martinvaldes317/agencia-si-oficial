require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const prisma = require('./lib/prisma');
const mailer = require('./lib/mailer');
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

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/portal', require('./routes/portal'));

// --- Existing routes ---

// Submit contact form (Leads)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, company, budget } = req.body;
    const newLead = await prisma.contactLead.create({ data: { name, email, phone, company, budget, type: 'cotizacion' } });
    mailer.send({ to: 'contacto@agenciasi.cl', subject: `Nuevo contacto: ${name}`, html: mailer.newContact({ name, email, phone, company, budget }) });
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

// Submit a new order
app.post('/api/submit-order', (req, res) => {
  try {
    const orderData = req.body;
    const orderId = `ORDER-${Date.now()}`;
    orderData.id = orderId;
    orderData.status = 'recibido';
    orderData.createdAt = new Date().toISOString();
    const filePath = path.join(__dirname, 'uploads', `${orderId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(orderData, null, 2));
    mailer.send({ to: 'contacto@agenciasi.cl', subject: `Nuevo pedido: ${orderId}`, html: mailer.newOrder({ orderId, name: orderData.name, email: orderData.email, phone: orderData.phone, service: orderData.service, plan: orderData.plan }) });
    res.status(200).json({ success: true, message: 'Order received', orderId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Admin: List all orders
app.get('/api/orders', (req, res) => {
  try {
    const files = fs.readdirSync(path.join(__dirname, 'uploads'));
    const orders = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const content = fs.readFileSync(path.join(__dirname, 'uploads', file), 'utf-8');
        return JSON.parse(content);
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders' });
  }
});

// Admin/Client: Get single order
app.get('/api/orders/:id', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'uploads', `${req.params.id}.json`);
    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: 'Order not found' });
    const order = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching order' });
  }
});

// Admin: Update order status
app.patch('/api/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const filePath = path.join(__dirname, 'uploads', `${req.params.id}.json`);
    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: 'Order not found' });
    const order = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    order.status = status;
    order.updatedAt = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify(order, null, 2));
    res.json({ success: true, message: 'Status updated', order });
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

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

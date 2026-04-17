const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const prisma = require('../lib/prisma');

// Client login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = await prisma.client.findUnique({ where: { email } });
    if (!client || !client.active) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
    const valid = await bcrypt.compare(password, client.password);
    if (!valid) return res.status(401).json({ success: false, message: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: client.id, email: client.email, name: client.name, role: 'client' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ success: true, token, client: { id: client.id, name: client.name, email: client.email, company: client.company, plan: client.plan } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'agencia-si-admin-2024';
    if (password !== adminPassword) {
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

module.exports = router;

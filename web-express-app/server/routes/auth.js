const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const prisma = require('../lib/prisma');
const mailer = require('../lib/mailer');

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

// Admin login — checks DB override first, then env var
router.post('/admin/login', async (req, res) => {
  try {
    const { password } = req.body;
    const configRow = await prisma.adminConfig.findUnique({ where: { key: 'admin_password' } });

    let valid = false;
    if (configRow) {
      valid = await bcrypt.compare(password, configRow.value);
    } else {
      valid = password === (process.env.ADMIN_PASSWORD || 'agencia-si-admin-2024');
    }

    if (!valid) return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// Admin forgot password — sends signed JWT reset link (no DB needed)
router.post('/admin/forgot-password', async (req, res) => {
  try {
    const resetToken = jwt.sign({ role: 'admin_reset' }, JWT_SECRET, { expiresIn: '1h' });
    const siteUrl = process.env.SITE_URL || 'https://agenciasi.cl';
    const adminEmail = process.env.ADMIN_EMAIL || 'contacto@agenciasi.cl';
    const resetLink = `${siteUrl}/admin/reset-password?token=${resetToken}`;

    await mailer.send({
      to: adminEmail,
      subject: 'Restablece tu contraseña de administrador — AgenciaSi',
      html: mailer.adminPasswordReset({ resetLink }),
    });

    res.json({ success: true });
  } catch (error) {
    console.error('[forgot-password]', error.message);
    res.status(500).json({ success: false, message: 'Error al enviar el correo: ' + error.message });
  }
});

// Admin reset password — verifies JWT token and saves new password to DB
router.post('/admin/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Datos inválidos' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(400).json({ success: false, message: 'El enlace no es válido o ya expiró' });
    }
    if (decoded.role !== 'admin_reset') {
      return res.status(400).json({ success: false, message: 'Token inválido' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.adminConfig.upsert({
      where: { key: 'admin_password' },
      update: { value: hashed },
      create: { key: 'admin_password', value: hashed },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('[reset-password]', error.message);
    res.status(500).json({ success: false, message: 'Error al restablecer: ' + error.message });
  }
});

module.exports = router;

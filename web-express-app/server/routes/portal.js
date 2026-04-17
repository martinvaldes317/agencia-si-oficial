const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { authenticateClient } = require('../middleware/auth');
const prisma = require('../lib/prisma');

// Get client own data (dashboard summary)
router.get('/me', authenticateClient, async (req, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: req.client.id },
      select: {
        id: true, name: true, email: true, company: true, phone: true, plan: true,
        _count: { select: { tickets: true, files: true, payments: true, meetings: true } }
      }
    });
    res.json({ success: true, client });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Get metrics
router.get('/metrics', authenticateClient, async (req, res) => {
  try {
    const { platform, limit = 30 } = req.query;
    const where = { clientId: req.client.id };
    if (platform) where.platform = platform;
    const metrics = await prisma.metric.findMany({
      where, orderBy: { date: 'desc' }, take: Number(limit)
    });
    res.json({ success: true, metrics });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Get payments
router.get('/payments', authenticateClient, async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { clientId: req.client.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Get meetings
router.get('/meetings', authenticateClient, async (req, res) => {
  try {
    const meetings = await prisma.meeting.findMany({
      where: { clientId: req.client.id },
      orderBy: { date: 'asc' }
    });
    res.json({ success: true, meetings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Get files
router.get('/files', authenticateClient, async (req, res) => {
  try {
    const files = await prisma.clientFile.findMany({
      where: { clientId: req.client.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Download file
router.get('/files/:fileId/download', authenticateClient, async (req, res) => {
  try {
    const file = await prisma.clientFile.findFirst({
      where: { id: Number(req.params.fileId), clientId: req.client.id }
    });
    if (!file) return res.status(404).json({ success: false, message: 'Archivo no encontrado' });
    const filePath = path.join(__dirname, '../uploads/files', String(req.client.id), file.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: 'Archivo no disponible' });
    res.download(filePath, file.originalName);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Get tickets
router.get('/tickets', authenticateClient, async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { clientId: req.client.id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
      orderBy: { updatedAt: 'desc' }
    });
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Create ticket
router.post('/tickets', authenticateClient, async (req, res) => {
  try {
    const { subject, content, priority } = req.body;
    const ticket = await prisma.ticket.create({
      data: {
        clientId: req.client.id, subject, priority: priority || 'normal',
        messages: { create: { content, isAdmin: false } }
      },
      include: { messages: true }
    });
    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// Reply to ticket
router.post('/tickets/:ticketId/messages', authenticateClient, async (req, res) => {
  try {
    const ticket = await prisma.ticket.findFirst({
      where: { id: Number(req.params.ticketId), clientId: req.client.id }
    });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket no encontrado' });
    const message = await prisma.ticketMessage.create({
      data: { ticketId: Number(req.params.ticketId), content: req.body.content, isAdmin: false }
    });
    await prisma.ticket.update({
      where: { id: Number(req.params.ticketId) },
      data: { updatedAt: new Date() }
    });
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

module.exports = router;

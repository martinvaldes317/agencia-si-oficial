const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const prisma = require('../lib/prisma');

const err = (res, e, msg) => {
  console.error(`[licitaciones] ${msg}:`, e.message);
  res.status(500).json({ success: false, message: e.message });
};

router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const licitaciones = await prisma.licitacion.findMany({
      orderBy: { fechaAdjudicacion: 'desc' }
    });
    res.json({ success: true, licitaciones });
  } catch (e) { err(res, e, 'list'); }
});

router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { entidad, numero, descripcion, monto, fechaAdjudicacion, notas } = req.body;
    if (!entidad || !descripcion || !fechaAdjudicacion) {
      return res.status(400).json({ success: false, message: 'Entidad, descripción y fecha son requeridos' });
    }
    const licitacion = await prisma.licitacion.create({
      data: {
        entidad,
        numero: numero || null,
        descripcion,
        monto: Number(monto || 0),
        fechaAdjudicacion: new Date(fechaAdjudicacion),
        notas: notas || null,
      }
    });
    res.json({ success: true, licitacion });
  } catch (e) { err(res, e, 'create'); }
});

router.patch('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { entidad, numero, descripcion, monto, fechaAdjudicacion, notas } = req.body;
    const data = {};
    if (entidad !== undefined)           data.entidad = entidad;
    if (numero !== undefined)            data.numero = numero || null;
    if (descripcion !== undefined)       data.descripcion = descripcion;
    if (monto !== undefined)             data.monto = Number(monto);
    if (fechaAdjudicacion !== undefined) data.fechaAdjudicacion = new Date(fechaAdjudicacion);
    if (notas !== undefined)             data.notas = notas || null;
    const licitacion = await prisma.licitacion.update({
      where: { id: Number(req.params.id) },
      data
    });
    res.json({ success: true, licitacion });
  } catch (e) { err(res, e, 'update'); }
});

router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    await prisma.licitacion.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (e) { err(res, e, 'delete'); }
});

module.exports = router;

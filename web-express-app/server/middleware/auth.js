const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'agencia-si-secret-key-2024';

const authenticateClient = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No autorizado' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'client') return res.status(403).json({ success: false, message: 'Acceso denegado' });
    req.client = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token inválido' });
  }
};

const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No autorizado' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ success: false, message: 'Acceso denegado' });
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token inválido' });
  }
};

module.exports = { authenticateClient, authenticateAdmin, JWT_SECRET };

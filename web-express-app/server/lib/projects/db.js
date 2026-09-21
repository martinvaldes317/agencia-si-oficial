// Pool mysql2 propio del módulo (Prisma no soporta insertId/transacciones simples en $executeRaw).
// Las tablas Pj* se crean/versionan aquí; no toca ninguna tabla ni modelo existente.
const mysql = require('mysql2/promise');

let pool = null;
let ready = false;

function getPool() {
  if (pool) return pool;
  const raw = process.env.DATABASE_URL || '';
  if (!/^mysql:/i.test(raw)) return null;
  const u = new URL(raw);
  pool = mysql.createPool({
    host: u.hostname, port: Number(u.port) || 3306,
    user: decodeURIComponent(u.username), password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ''),
    connectionLimit: 5, timezone: 'Z', charset: 'utf8mb4', supportBigNumbers: true, bigNumberStrings: false,
  });
  return pool;
}

async function query(sql, params = []) {
  const p = getPool();
  if (!p) throw new Error('DB de proyectos no disponible');
  const [rows] = await p.query(sql, params);
  return rows;
}
async function run(sql, params = []) {
  const p = getPool();
  if (!p) throw new Error('DB de proyectos no disponible');
  const [res] = await p.query(sql, params);
  return res; // { insertId, affectedRows }
}

const TS = 'DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)';
const TSU = 'DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)';
const OPTS = 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci';

// Cada migración es aditiva. Para cambios futuros agregar { v: 2, sql: [...] } — nunca editar una ya aplicada.
const MIGRATIONS = [
  {
    v: 1,
    sql: [
      `CREATE TABLE IF NOT EXISTS PjClient (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(191) NOT NULL DEFAULT '',
        lastName VARCHAR(191) NOT NULL DEFAULT '',
        business VARCHAR(191) NOT NULL DEFAULT '',
        rut VARCHAR(50) NULL,
        email VARCHAR(191) NULL,
        phone VARCHAR(50) NULL,
        whatsapp VARCHAR(50) NULL,
        city VARCHAR(191) NULL,
        region VARCHAR(191) NULL,
        origin VARCHAR(50) NULL,
        waRef VARCHAR(500) NULL,
        notes LONGTEXT NULL,
        assignedTo VARCHAR(191) NULL,
        lastContactAt DATETIME(3) NULL,
        createdAt ${TS}, updatedAt ${TSU},
        KEY PjClient_email (email), KEY PjClient_whatsapp (whatsapp)
      ) ${OPTS}`,
      `CREATE TABLE IF NOT EXISTS PjProject (
        id INT AUTO_INCREMENT PRIMARY KEY,
        clientId INT NOT NULL,
        name VARCHAR(191) NOT NULL DEFAULT '',
        tradeName VARCHAR(191) NULL,
        serviceType VARCHAR(100) NOT NULL DEFAULT 'Landing Page',
        status VARCHAR(50) NOT NULL DEFAULT 'lead_nuevo',
        paymentStatus VARCHAR(50) NOT NULL DEFAULT 'no_pagado',
        payMethod VARCHAR(50) NULL,
        netAmount DOUBLE NOT NULL DEFAULT 0,
        ivaRate DOUBLE NOT NULL DEFAULT 0.19,
        totalAmount DOUBLE NOT NULL DEFAULT 0,
        depositPct DOUBLE NOT NULL DEFAULT 50,
        depositAmount DOUBLE NOT NULL DEFAULT 0,
        balanceAmount DOUBLE NOT NULL DEFAULT 0,
        depositPaidAt DATETIME(3) NULL,
        depositTxId VARCHAR(191) NULL,
        balancePaidAt DATETIME(3) NULL,
        orderId VARCHAR(191) NULL,
        info LONGTEXT NULL,
        infoSufficient TINYINT(1) NOT NULL DEFAULT 0,
        infoReceivedAt DATETIME(3) NULL,
        assignedTo VARCHAR(191) NULL,
        serverName VARCHAR(191) NULL,
        stagingUrl VARCHAR(500) NULL,
        productionUrl VARCHAR(500) NULL,
        repoUrl VARCHAR(500) NULL,
        lastDeployAt DATETIME(3) NULL,
        deployStatus VARCHAR(50) NULL,
        createdAt ${TS}, updatedAt ${TSU},
        UNIQUE KEY PjProject_orderId (orderId),
        KEY PjProject_client (clientId), KEY PjProject_status (status)
      ) ${OPTS}`,
      `CREATE TABLE IF NOT EXISTS PjPayment (
        id INT AUTO_INCREMENT PRIMARY KEY,
        projectId INT NOT NULL,
        kind VARCHAR(20) NOT NULL DEFAULT 'deposit',
        amount DOUBLE NOT NULL DEFAULT 0,
        method VARCHAR(50) NULL,
        txId VARCHAR(191) NULL,
        mpPaymentId VARCHAR(100) NULL,
        mpStatus VARCHAR(50) NULL,
        externalRef VARCHAR(191) NULL,
        paymentType VARCHAR(50) NULL,
        merchantOrderId VARCHAR(100) NULL,
        paidAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        createdBy VARCHAR(191) NULL,
        createdAt ${TS},
        UNIQUE KEY PjPayment_mp (mpPaymentId),
        KEY PjPayment_project (projectId)
      ) ${OPTS}`,
      `CREATE TABLE IF NOT EXISTS PjVersion (
        id INT AUTO_INCREMENT PRIMARY KEY,
        projectId INT NOT NULL,
        number INT NOT NULL,
        previewUrl VARCHAR(500) NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'generando',
        notes LONGTEXT NULL,
        changes LONGTEXT NULL,
        createdBy VARCHAR(191) NULL,
        createdAt ${TS}, updatedAt ${TSU},
        KEY PjVersion_project (projectId)
      ) ${OPTS}`,
      `CREATE TABLE IF NOT EXISTS PjFeedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        projectId INT NOT NULL,
        versionId INT NULL,
        round INT NOT NULL DEFAULT 1,
        originalText LONGTEXT NOT NULL,
        aiPrompt LONGTEXT NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'pendiente',
        createdBy VARCHAR(191) NULL,
        createdAt ${TS}, updatedAt ${TSU},
        KEY PjFeedback_project (projectId)
      ) ${OPTS}`,
      `CREATE TABLE IF NOT EXISTS PjFile (
        id INT AUTO_INCREMENT PRIMARY KEY,
        projectId INT NOT NULL,
        category VARCHAR(30) NOT NULL DEFAULT 'otro',
        name VARCHAR(255) NOT NULL,
        path VARCHAR(500) NOT NULL,
        size INT NOT NULL DEFAULT 0,
        mime VARCHAR(100) NULL,
        source VARCHAR(30) NOT NULL DEFAULT 'admin',
        createdAt ${TS},
        UNIQUE KEY PjFile_project_path (projectId, path(300)),
        KEY PjFile_project (projectId)
      ) ${OPTS}`,
      `CREATE TABLE IF NOT EXISTS PjAudit (
        id INT AUTO_INCREMENT PRIMARY KEY,
        projectId INT NULL,
        clientId INT NULL,
        action VARCHAR(50) NOT NULL,
        fromValue VARCHAR(191) NULL,
        toValue VARCHAR(191) NULL,
        detail LONGTEXT NULL,
        actor VARCHAR(191) NOT NULL DEFAULT 'sistema',
        createdAt ${TS},
        KEY PjAudit_project (projectId), KEY PjAudit_client (clientId)
      ) ${OPTS}`,
      `CREATE TABLE IF NOT EXISTS PjTemplate (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL,
        name VARCHAR(191) NOT NULL,
        body LONGTEXT NOT NULL,
        updatedAt ${TSU},
        UNIQUE KEY PjTemplate_code (code)
      ) ${OPTS}`,
      `CREATE TABLE IF NOT EXISTS PjWebhookLog (
        id INT AUTO_INCREMENT PRIMARY KEY,
        source VARCHAR(30) NOT NULL DEFAULT 'mercadopago',
        payload LONGTEXT NULL,
        result VARCHAR(191) NULL,
        createdAt ${TS}
      ) ${OPTS}`,
    ],
  },
];

async function migrate() {
  const p = getPool();
  if (!p) { console.warn('[projects] DATABASE_URL no es MySQL — módulo Proyectos deshabilitado'); return false; }
  try {
    await run(`CREATE TABLE IF NOT EXISTS PjMeta (k VARCHAR(50) PRIMARY KEY, v VARCHAR(191) NOT NULL) ${OPTS}`);
    const rows = await query(`SELECT v FROM PjMeta WHERE k = 'schema_version'`);
    let current = rows.length ? Number(rows[0].v) : 0;
    for (const m of MIGRATIONS) {
      if (m.v <= current) continue;
      for (const stmt of m.sql) await run(stmt);
      await run(`INSERT INTO PjMeta (k, v) VALUES ('schema_version', ?) ON DUPLICATE KEY UPDATE v = VALUES(v)`, [String(m.v)]);
      current = m.v;
      console.log(`[projects] esquema migrado a v${m.v}`);
    }
    const { DEFAULT_TEMPLATES } = require('./constants');
    for (const t of DEFAULT_TEMPLATES) {
      await run(`INSERT IGNORE INTO PjTemplate (code, name, body) VALUES (?, ?, ?)`, [t.code, t.name, t.body]);
    }
    ready = true;
    return true;
  } catch (e) {
    console.error('[projects] error de migración:', e.message);
    return false;
  }
}

module.exports = { query, run, migrate, getPool, isReady: () => ready };

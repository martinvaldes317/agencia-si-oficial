const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
  port:   Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function base(content) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { margin:0; padding:0; background:#0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  .wrap { max-width:560px; margin:40px auto; background:#111; border:1px solid #222; border-radius:16px; overflow:hidden; }
  .header { background:#000; padding:28px 32px; border-bottom:1px solid #222; }
  .logo-box { display:inline-flex; align-items:center; gap:10px; }
  .logo-badge { background:#fff; color:#000; font-weight:900; font-size:18px; padding:2px 8px; border-radius:4px; letter-spacing:-0.5px; }
  .logo-text { color:#fff; font-size:18px; font-weight:800; letter-spacing:-0.5px; }
  .body { padding:32px; }
  .title { color:#fff; font-size:20px; font-weight:700; margin:0 0 6px; }
  .subtitle { color:#666; font-size:14px; margin:0 0 28px; }
  .card { background:#1a1a1a; border:1px solid #2a2a2a; border-radius:10px; padding:20px; margin:0 0 20px; }
  .row { display:flex; gap:12px; margin-bottom:12px; }
  .row:last-child { margin-bottom:0; }
  .label { color:#555; font-size:12px; text-transform:uppercase; letter-spacing:.8px; min-width:110px; padding-top:1px; }
  .value { color:#ddd; font-size:14px; font-weight:500; }
  .badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
  .badge-urgente { background:#3f0f0f; color:#f87171; }
  .badge-alta    { background:#3a2500; color:#fbbf24; }
  .badge-normal  { background:#1f1f1f; color:#9ca3af; }
  .badge-baja    { background:#1f1f1f; color:#6b7280; }
  .btn { display:block; text-align:center; background:#fff; color:#000; text-decoration:none; font-weight:700; font-size:14px; padding:14px 28px; border-radius:10px; margin-top:24px; }
  .footer { padding:20px 32px; border-top:1px solid #1a1a1a; }
  .footer p { color:#444; font-size:12px; margin:0; }
</style></head>
<body>
<div class="wrap">
  <div class="header">
    <div class="logo-box">
      <span class="logo-badge">SI</span>
      <span class="logo-text">AgenciaSi</span>
    </div>
  </div>
  <div class="body">${content}</div>
  <div class="footer"><p>© AgenciaSi · contacto@agenciasi.cl · Este correo fue generado automáticamente.</p></div>
</div>
</body></html>`;
}

async function send({ to, subject, html }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[Mailer] Sin credenciales SMTP — email no enviado a ${to}: ${subject}`);
    return;
  }
  try {
    await transporter.sendMail({
      from: `"AgenciaSi" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`[Mailer] ✓ Email enviado a ${to}: ${subject}`);
  } catch (err) {
    console.error(`[Mailer] Error enviando a ${to}:`, err.message);
  }
}

// ── Templates ──────────────────────────────────────────────────────────────────

function meetingScheduled({ clientName, title, date, duration, meetLink, description }) {
  const dateStr = new Date(date).toLocaleString('es-CL', { weekday:'long', day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' });
  return base(`
    <p class="title">📅 Nueva reunión agendada</p>
    <p class="subtitle">Hola ${clientName}, tienes una reunión programada.</p>
    <div class="card">
      <div class="row"><span class="label">Título</span><span class="value">${title}</span></div>
      <div class="row"><span class="label">Fecha</span><span class="value">${dateStr}</span></div>
      <div class="row"><span class="label">Duración</span><span class="value">${duration} minutos</span></div>
      ${description ? `<div class="row"><span class="label">Descripción</span><span class="value">${description}</span></div>` : ''}
      ${meetLink ? `<div class="row"><span class="label">Link Meet</span><span class="value"><a href="${meetLink}" style="color:#6ee7b7">${meetLink}</a></span></div>` : ''}
    </div>
    ${meetLink ? `<a href="${meetLink}" class="btn">Unirse a la reunión</a>` : ''}
  `);
}

function paymentCreated({ clientName, amount, description, dueDate, status }) {
  const dueDateStr = dueDate ? new Date(dueDate).toLocaleDateString('es-CL', { day:'numeric', month:'long', year:'numeric' }) : null;
  const statusLabel = { pagado: '✅ Pagado', pendiente: '⏳ Pendiente', vencido: '❌ Vencido' }[status] || status;
  return base(`
    <p class="title">💳 Nuevo cobro registrado</p>
    <p class="subtitle">Hola ${clientName}, se ha generado un nuevo cobro en tu cuenta.</p>
    <div class="card">
      <div class="row"><span class="label">Concepto</span><span class="value">${description || 'Servicio AgenciaSi'}</span></div>
      <div class="row"><span class="label">Monto</span><span class="value" style="color:#fff;font-size:18px;font-weight:800">$${Number(amount).toLocaleString('es-CL')} CLP</span></div>
      <div class="row"><span class="label">Estado</span><span class="value">${statusLabel}</span></div>
      ${dueDateStr ? `<div class="row"><span class="label">Vencimiento</span><span class="value">${dueDateStr}</span></div>` : ''}
    </div>
    <p style="color:#555;font-size:13px;margin-top:16px;">Si tienes dudas sobre este cobro, responde este correo o contáctanos por WhatsApp.</p>
  `);
}

function ticketReply({ clientName, subject, adminMessage }) {
  return base(`
    <p class="title">💬 Nueva respuesta en tu ticket</p>
    <p class="subtitle">Hola ${clientName}, el equipo de AgenciaSi respondió tu solicitud.</p>
    <div class="card">
      <div class="row"><span class="label">Asunto</span><span class="value">${subject}</span></div>
      <div class="row"><span class="label">Respuesta</span><span class="value">${adminMessage}</span></div>
    </div>
    <p style="color:#555;font-size:13px;margin-top:16px;">Ingresa a tu portal para ver el hilo completo y responder.</p>
  `);
}

function fileUploaded({ clientName, fileName, category }) {
  const categoryLabel = { reporte: 'Reporte', contrato: 'Contrato', creativo: 'Creativo', general: 'General' }[category] || category;
  return base(`
    <p class="title">📁 Nuevo archivo disponible</p>
    <p class="subtitle">Hola ${clientName}, AgenciaSi te ha compartido un archivo.</p>
    <div class="card">
      <div class="row"><span class="label">Archivo</span><span class="value">${fileName}</span></div>
      <div class="row"><span class="label">Categoría</span><span class="value">${categoryLabel}</span></div>
    </div>
    <p style="color:#555;font-size:13px;margin-top:16px;">Ingresa a tu portal de clientes para descargarlo.</p>
  `);
}

module.exports = { send, meetingScheduled, paymentCreated, ticketReply, fileUploaded };

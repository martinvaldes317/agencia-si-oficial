const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

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
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Mailer] Sin RESEND_API_KEY — email no enviado a ${to}: ${subject}`);
    return;
  }
  try {
    await resend.emails.send({
      from: 'AgenciaSi <contacto@agenciasi.cl>',
      to,
      subject,
      html,
    });
    console.log(`[Mailer] ✓ Email enviado a ${to}: ${subject}`);
  } catch (err) {
    console.error(`[Mailer] Error enviando a ${to}:`, err.message);
    throw err;
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

function newContact({ name, email, phone, company, budget, message }) {
  return base(`
    <p class="title">📩 Nuevo contacto / cotización</p>
    <p class="subtitle">Alguien llenó el formulario de contacto en el sitio.</p>
    <div class="card">
      <div class="row"><span class="label">Nombre</span><span class="value">${name || '—'}</span></div>
      <div class="row"><span class="label">Email</span><span class="value">${email || '—'}</span></div>
      <div class="row"><span class="label">Teléfono</span><span class="value">${phone || '—'}</span></div>
      <div class="row"><span class="label">Empresa</span><span class="value">${company || '—'}</span></div>
      <div class="row"><span class="label">Presupuesto</span><span class="value">${budget || '—'}</span></div>
      ${message ? `<div class="row"><span class="label">Comentarios</span><span class="value">${message}</span></div>` : ''}
    </div>
  `);
}

function newSeoDiagnostic({ name, email, phone, company, website, budget, industry, goal }) {
  return base(`
    <p class="title">🔍 Nuevo diagnóstico SEO solicitado</p>
    <p class="subtitle">Alguien completó el formulario de diagnóstico SEO.</p>
    <div class="card">
      <div class="row"><span class="label">Nombre</span><span class="value">${name || '—'}</span></div>
      <div class="row"><span class="label">Email</span><span class="value">${email || '—'}</span></div>
      <div class="row"><span class="label">Teléfono</span><span class="value">${phone || '—'}</span></div>
      <div class="row"><span class="label">Empresa</span><span class="value">${company || '—'}</span></div>
      <div class="row"><span class="label">Sitio web</span><span class="value">${website || '—'}</span></div>
      <div class="row"><span class="label">Industria</span><span class="value">${industry || '—'}</span></div>
      <div class="row"><span class="label">Objetivo</span><span class="value">${goal || '—'}</span></div>
      <div class="row"><span class="label">Presupuesto</span><span class="value">${budget || '—'}</span></div>
    </div>
  `);
}

function newOrder({ orderId, name, email, phone, service, plan }) {
  return base(`
    <p class="title">🛒 Nuevo pedido recibido</p>
    <p class="subtitle">Se completó el wizard de pedido en el sitio.</p>
    <div class="card">
      <div class="row"><span class="label">ID Pedido</span><span class="value" style="color:#6ee7b7;font-weight:700">${orderId}</span></div>
      <div class="row"><span class="label">Nombre</span><span class="value">${name || '—'}</span></div>
      <div class="row"><span class="label">Email</span><span class="value">${email || '—'}</span></div>
      <div class="row"><span class="label">Teléfono</span><span class="value">${phone || '—'}</span></div>
      <div class="row"><span class="label">Servicio</span><span class="value">${service || '—'}</span></div>
      <div class="row"><span class="label">Plan</span><span class="value">${plan || '—'}</span></div>
    </div>
  `);
}

function clientNotification({ clientName, type, subject, message }) {
  const typeIcons = {
    pago: '💳', renovacion_hosting: '🖥️', renovacion_dominio: '🌐',
    mantencion: '🔧', personalizado: '📢'
  };
  const typeLabels = {
    pago: 'Aviso de pago', renovacion_hosting: 'Renovación de hosting',
    renovacion_dominio: 'Renovación de dominio', mantencion: 'Mantención programada', personalizado: 'Notificación'
  };
  const icon = typeIcons[type] || '📢';
  const label = typeLabels[type] || 'Notificación';
  return base(`
    <p class="title">${icon} ${subject || label}</p>
    <p class="subtitle">Hola ${clientName}, tienes un nuevo aviso de AgenciaSi.</p>
    <div class="card">
      <div style="color:#ddd;font-size:14px;line-height:1.7;white-space:pre-line">${message}</div>
    </div>
    <p style="color:#555;font-size:13px;margin-top:16px;">Si tienes dudas, responde este correo o contáctanos por WhatsApp.</p>
  `);
}

function clientWelcome({ clientName, setupLink }) {
  return base(`
    <p class="title">👋 Bienvenido/a a AgenciaSi</p>
    <p class="subtitle">Hola ${clientName}, tu cuenta ha sido creada. Solo falta que establezcas tu contraseña para acceder a tu portal.</p>
    <div class="card">
      <div style="color:#ddd;font-size:14px;line-height:1.7">
        En tu portal podrás ver métricas de tus campañas, cobros, reuniones, archivos y más.<br>
        <span style="color:#666;font-size:12px">Este enlace es válido por <strong style="color:#999">7 días</strong>.</span>
      </div>
    </div>
    <a href="${setupLink}" class="btn">Crear mi contraseña</a>
    <p style="color:#444;font-size:12px;margin-top:16px;text-align:center">Si tienes problemas, contáctanos a contacto@agenciasi.cl</p>
  `);
}

function adminPasswordReset({ resetLink }) {
  return base(`
    <p class="title">🔐 Restablecer contraseña de administrador</p>
    <p class="subtitle">Recibiste este correo porque solicitaste restablecer la contraseña del panel de AgenciaSi.</p>
    <div class="card">
      <div style="color:#ddd;font-size:14px;line-height:1.7">
        Haz clic en el botón de abajo para crear una nueva contraseña.<br>
        <span style="color:#666;font-size:12px">Este enlace es válido por <strong style="color:#999">1 hora</strong> y solo puede usarse una vez.</span>
      </div>
    </div>
    <a href="${resetLink}" class="btn">Restablecer contraseña</a>
    <p style="color:#444;font-size:12px;margin-top:16px;text-align:center">Si no solicitaste este cambio, puedes ignorar este correo.</p>
  `);
}

module.exports = { send, meetingScheduled, paymentCreated, ticketReply, fileUploaded, newContact, newSeoDiagnostic, newOrder, clientNotification, adminPasswordReset, clientWelcome };

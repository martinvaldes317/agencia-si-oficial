// Fuente única de verdad de estados, etiquetas y colores del módulo Proyectos Web.
// El frontend los recibe desde GET /api/projects/meta — no se duplican en React.

const STATUSES = [
  { key: 'lead_nuevo',            label: 'Lead nuevo',                color: 'slate',   column: 'nuevo',            stage: 'lead' },
  { key: 'contactado',            label: 'Contactado',                color: 'slate',   column: 'nuevo',            stage: 'lead' },
  { key: 'interesado',            label: 'Interesado',                color: 'sky',     column: 'nuevo',            stage: 'interesado' },
  { key: 'esperando_abono',       label: 'Esperando abono',           color: 'amber',   column: 'esperando_abono',  stage: 'interesado' },
  { key: 'abono_recibido',        label: 'Abono recibido',            color: 'emerald', column: 'esperando_info',   stage: 'abono' },
  { key: 'esperando_info',        label: 'Esperando información',     color: 'amber',   column: 'esperando_info',   stage: 'abono' },
  { key: 'info_incompleta',       label: 'Información incompleta',    color: 'orange',  column: 'esperando_info',   stage: 'abono' },
  { key: 'info_completa',         label: 'Información completa',      color: 'emerald', column: 'listo',            stage: 'info' },
  { key: 'listo_produccion',      label: 'Listo para producción',     color: 'teal',    column: 'listo',            stage: 'info' },
  { key: 'en_desarrollo',         label: 'En desarrollo',             color: 'violet',  column: 'desarrollo',       stage: 'desarrollo' },
  { key: 'v1_lista',              label: 'Versión 1 lista',           color: 'indigo',  column: 'revision',         stage: 'revision' },
  { key: 'esperando_revision',    label: 'Esperando revisión cliente',color: 'indigo',  column: 'revision',         stage: 'revision' },
  { key: 'cambios_solicitados',   label: 'Cambios solicitados',       color: 'orange',  column: 'cambios',          stage: 'modificaciones' },
  { key: 'v2_lista',              label: 'Versión 2 lista',           color: 'indigo',  column: 'revision',         stage: 'revision' },
  { key: 'aprobado',              label: 'Aprobado',                  color: 'emerald', column: 'esperando_saldo',  stage: 'aprobado' },
  { key: 'esperando_saldo',       label: 'Esperando saldo',           color: 'amber',   column: 'esperando_saldo',  stage: 'aprobado' },
  { key: 'saldo_pagado',          label: 'Saldo pagado',              color: 'emerald', column: 'esperando_saldo',  stage: 'saldo' },
  { key: 'publicado',             label: 'Publicado',                 color: 'teal',    column: 'finalizado',       stage: 'saldo' },
  { key: 'finalizado',            label: 'Finalizado',                color: 'green',   column: 'finalizado',       stage: 'finalizado' },
  { key: 'cancelado',             label: 'Cancelado',                 color: 'red',     column: null,               stage: null },
];
const STATUS_KEYS = STATUSES.map(s => s.key);

const KANBAN_COLUMNS = [
  { key: 'nuevo',           label: 'Nuevo',                   dropStatus: 'lead_nuevo' },
  { key: 'esperando_abono', label: 'Esperando abono',         dropStatus: 'esperando_abono' },
  { key: 'esperando_info',  label: 'Esperando información',   dropStatus: 'esperando_info' },
  { key: 'listo',           label: 'Listo para producir',     dropStatus: 'listo_produccion' },
  { key: 'desarrollo',      label: 'En desarrollo',           dropStatus: 'en_desarrollo' },
  { key: 'revision',        label: 'Revisión',                dropStatus: 'esperando_revision' },
  { key: 'cambios',         label: 'Cambios',                 dropStatus: 'cambios_solicitados' },
  { key: 'esperando_saldo', label: 'Esperando saldo',         dropStatus: 'esperando_saldo' },
  { key: 'finalizado',      label: 'Finalizado',              dropStatus: 'finalizado' },
];

const PIPELINE = [
  { key: 'lead',           label: 'Nuevo lead' },
  { key: 'interesado',     label: 'Interesado' },
  { key: 'abono',          label: 'Abono' },
  { key: 'info',           label: 'Información recibida' },
  { key: 'desarrollo',     label: 'Desarrollo' },
  { key: 'revision',       label: 'Revisión cliente' },
  { key: 'modificaciones', label: 'Modificaciones' },
  { key: 'aprobado',       label: 'Aprobado' },
  { key: 'saldo',          label: 'Saldo pagado' },
  { key: 'finalizado',     label: 'Finalizado' },
];

const PAYMENT_STATUSES = [
  { key: 'no_pagado',      label: 'No pagado' },
  { key: 'abono_pendiente',label: 'Abono pendiente' },
  { key: 'abono_pagado',   label: 'Abono pagado' },
  { key: 'pago_completo',  label: 'Pago completo' },
  { key: 'reembolsado',    label: 'Reembolsado' },
];
const PAYMENT_METHODS = [
  { key: 'mercado_pago',  label: 'Mercado Pago' },
  { key: 'transferencia', label: 'Transferencia' },
  { key: 'whatsapp',      label: 'WhatsApp' },
  { key: 'otro',          label: 'Otro' },
];
const ORIGINS = ['Meta Ads', 'Google Ads', 'Instagram', 'Facebook', 'Google', 'Referido', 'Cliente antiguo', 'Formulario web', 'Otro'];
const SERVICE_TYPES = ['Landing Page', 'Sitio corporativo', 'E-commerce', 'Agenda', 'E-learning', 'Desarrollo personalizado', 'Otro'];
const VISUAL_STYLES = ['Corporativo', 'Minimalista', 'Elegante', 'Moderno', 'Tecnológico', 'Natural', 'Industrial', 'Profesional', 'Otro'];
const FILE_CATEGORIES = [
  { key: 'logo', label: 'Logos' }, { key: 'foto', label: 'Fotografías' }, { key: 'producto', label: 'Imágenes de productos' },
  { key: 'pdf', label: 'PDF' }, { key: 'documento', label: 'Documentos' }, { key: 'referencia', label: 'Referencias' }, { key: 'otro', label: 'Otros' },
];

const VERSION_STATUSES = [
  { key: 'generando', label: 'Generando' }, { key: 'lista', label: 'Lista para revisión' }, { key: 'enviada', label: 'Enviada al cliente' },
  { key: 'cambios', label: 'Cambios solicitados' }, { key: 'aprobada', label: 'Aprobada' }, { key: 'descartada', label: 'Descartada' },
];
const FEEDBACK_STATUSES = [
  { key: 'pendiente', label: 'Pendiente' }, { key: 'procesando', label: 'Procesando' }, { key: 'realizados', label: 'Cambios realizados' },
  { key: 'enviado', label: 'Enviado cliente' }, { key: 'aprobado', label: 'Aprobado' },
];

const ROLES = ['admin', 'ventas', 'produccion'];

const DEFAULT_TEMPLATES = [
  { code: 'PROMO', name: 'Enviar landing promoción', body: 'Hola 👋 Te comparto nuestra promoción de Landing Page: https://agenciasi.cl/sitio-web/' },
  { code: 'BIENVENIDA', name: 'Bienvenida', body: 'Hola 👋 Gracias por contactar a AgenciaSi por nuestra promoción de Landing Page.' },
  { code: 'ABONO', name: 'Abono', body: 'Perfecto. Para comenzar trabajamos con un 50% de abono inicial. Una vez realizado te enviaremos el formulario para recopilar la información de tu negocio.' },
  { code: 'INFORMACION', name: 'Información recibida', body: 'Ya recibimos tu información. Vamos a revisarla para comenzar a trabajar en tu sitio.' },
  { code: 'VERSION_LISTA', name: 'Versión lista', body: 'Tenemos lista la primera propuesta de tu página web 😊 Puedes revisarla en el siguiente enlace: {URL_PREVIEW}' },
  { code: 'CAMBIOS_REALIZADOS', name: 'Cambios realizados', body: 'Ya realizamos los cambios solicitados. Puedes revisar la nueva versión aquí: {URL_PREVIEW}' },
];

const IVA_RATE = 0.19;
const DEFAULT_NET = 74990;
const DEFAULT_DEPOSIT_PCT = 50;

module.exports = {
  STATUSES, STATUS_KEYS, KANBAN_COLUMNS, PIPELINE, PAYMENT_STATUSES, PAYMENT_METHODS, ORIGINS, SERVICE_TYPES,
  VISUAL_STYLES, FILE_CATEGORIES, VERSION_STATUSES, FEEDBACK_STATUSES, ROLES, DEFAULT_TEMPLATES,
  IVA_RATE, DEFAULT_NET, DEFAULT_DEPOSIT_PCT,
};

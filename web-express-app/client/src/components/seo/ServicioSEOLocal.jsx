import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  CheckCircle2, Shield, Calendar, ExternalLink, ArrowRight,
} from 'lucide-react'
import { useTheme } from '../../theme/ThemeContext'
import ThemeToggle from '../../theme/ThemeToggle'
import ThemeLogo from '../../theme/ThemeLogo'

const DARK_T = {
  blue:  '#3d5afe',
  blueD: '#2a3cc4',
  blueL: 'rgba(61,90,254,0.14)',
  black: '#f5f5fa',
  gray:  '#9a9ab0',
  muted: '#75758c',
  light: '#07070c',
  panel: '#0c0c14',
  white: '#FFFFFF',
  border:'rgba(255,255,255,0.09)',
  green: '#22c55e',
}
const LIGHT_T = {
  blue:  '#2451c4',
  blueD: '#1a3a8f',
  blueL: 'rgba(36,81,196,0.08)',
  black: '#14141f',
  gray:  '#5c5c72',
  muted: '#6b6b80',
  light: '#ffffff',
  panel: '#f7f8fb',
  white: '#FFFFFF',
  border:'rgba(15,23,42,0.10)',
  green: '#16a34a',
}

const WA_BASE = 'https://wa.me/56932930812?text='
const px = (event, params) => { if (typeof fbq !== 'undefined') fbq('track', event, params) }
const ga = (event, params) => { if (typeof gtag !== 'undefined') gtag('event', event, params) }

const WaIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

// Config de las 4 páginas — export para que App.jsx arme las rutas /servicios/<slug>
export const SERVICIOS = {
  'sistemas-de-gestion': {
    slug: 'sistemas-de-gestion',
    kicker: 'Software a medida',
    name: 'Sistemas de Gestión a Medida',
    h1: 'Sistemas de gestión a medida para tu empresa',
    sub: 'Software de caja, inventario, historiales y reportes, diseñado para cómo trabaja tu negocio — no al revés.',
    metaTitle: 'Sistemas de Gestión a Medida Chile | AgenciaSI',
    metaDescription: 'Desarrollamos sistemas de gestión, caja e inventario a medida para empresas en Chile. Código propio, panel administrador y reportes en tiempo real.',
    problems: [
      { title: 'Todo en planillas Excel', desc: 'Inventario, ventas y clientes repartidos en archivos sueltos, sin respaldo ni control real.' },
      { title: 'Procesos manuales', desc: 'Cierres de caja, reportes y seguimiento que consumen horas cada semana.' },
      { title: 'Software genérico', desc: 'Sistemas armados para "cualquier rubro" que no calzan con cómo trabaja tu negocio.' },
    ],
    includes: [
      'Panel administrador a medida', 'Control de inventario', 'Cierre de caja', 'Reportes en tiempo real',
      'Accesos por usuario', 'Integraciones con sistemas externos',
    ],
    cases: [
      { name: 'NowPOS', url: 'https://nowpos.cl', tag: 'Sistema de caja (POS)', desc: 'Sistema POS para almacenes y minimarkets: lector de código de barras, control de inventario, cierre de caja y modo offline.' },
      { name: 'Consonancia', url: 'https://consonancia.cl', tag: 'Software para psicólogos', desc: 'Solución digital para psicólogos, pensada para el manejo de historiales clínicos.' },
    ],
  },
  'plataformas': {
    slug: 'plataformas',
    kicker: 'Plataformas y e-commerce',
    name: 'Plataformas y E-commerce',
    h1: 'Plataformas y tiendas online a medida',
    sub: 'Vende productos, entrega contenido o atiende usuarios online — con login, catálogo o membresía, según lo que tu negocio necesite.',
    metaTitle: 'Plataformas y E-commerce a Medida Chile | AgenciaSI',
    metaDescription: 'Desarrollamos plataformas web y tiendas online a medida: login de usuarios, cursos, catálogo, carrito y Mercado Pago integrado. Código propio.',
    problems: [
      { title: 'Dependes de plataformas de terceros', desc: 'Comisiones altas y sin control real sobre tu contenido, tus alumnos o tu catálogo.' },
      { title: 'Vendes o compartes contenido a mano', desc: 'Cada pedido o acceso se coordina uno por uno, por WhatsApp o Instagram, sin checkout ni login propio.' },
      { title: 'Las plantillas genéricas no calzan', desc: 'Constructores armados para "cualquier negocio" que no se adaptan a cómo vendes o cómo funciona tu programa.' },
    ],
    includes: [
      'Login y panel de usuarios', 'Catálogo de productos o cursos', 'Carro de compras y Mercado Pago integrado',
      'Contenido o clases restringidas por membresía', 'Panel de administración', 'Diseño a medida',
      'Gestión de stock', 'Preparado para pagos recurrentes',
    ],
    cases: [
      { name: 'Espacio CEA', url: 'https://espaciocea.com', tag: 'Plataforma web', desc: 'Plataforma de un centro de intervención virtual especializado en Análisis Aplicado de la Conducta, con capacitaciones y acceso para usuarios.' },
      { name: 'MOVERSER', url: 'https://moverserstudio.com', tag: 'Plataforma de membresía', desc: 'Biblioteca de clases online de Pilates, movilidad, flexibilidad y danza, con membresía de acceso ilimitado.' },
    ],
  },
  'automatizacion-de-procesos': {
    slug: 'automatizacion-de-procesos',
    kicker: 'Automatización de procesos',
    name: 'Automatización de Procesos',
    h1: 'Automatización de procesos para reducir el trabajo manual',
    sub: 'Conectamos tus herramientas y automatizamos tareas repetitivas — con IA cuando aporta valor, no porque sí.',
    metaTitle: 'Automatización de Procesos para Empresas Chile | AgenciaSI',
    metaDescription: 'Automatizamos procesos repetitivos y conectamos tus herramientas: seguimiento de consultas, confirmaciones, actualización de pedidos y reportes. IA cuando aporta valor.',
    problems: [
      { title: 'Todo se coordina a mano', desc: 'Consultas, pedidos y seguimientos que alguien de tu equipo pasa manualmente de una herramienta a otra.' },
      { title: 'Respondes lo mismo todo el día', desc: 'Preguntas y confirmaciones repetidas por WhatsApp o correo que podrías automatizar sin perder el trato cercano.' },
      { title: 'La información queda repartida', desc: 'Planillas, WhatsApp, correo y sistemas que no se hablan entre sí — armar un reporte toma horas.' },
    ],
    includes: [
      'Automatización de un proceso concreto', 'Conexión entre tus herramientas actuales', 'Notificaciones y recordatorios automáticos',
      'Reportes consolidados', 'Clasificación y preparación de datos', 'IA aplicada cuando suma valor real',
    ],
    scenarios: [
      'Una consulta entra desde tu web y queda registrada, asignada y lista para seguimiento.',
      'Una reserva activa confirmaciones y recordatorios automáticos.',
      'Un pedido actualiza su estado y avisa al equipo responsable.',
      'La información de distintas herramientas se reúne sola en un reporte.',
      'Un documento se clasifica y sus datos quedan listos para revisión.',
    ],
    approach: {
      title: 'Partimos por un proceso concreto, no por "automatizar todo"',
      desc: 'Diagnosticamos el proceso, definimos alcance y precio antes de partir. Desde ahí puede crecer hacia más integraciones o un sistema completo. No cotizamos sin conocer tus accesos, herramientas y excepciones reales.',
    },
    cases: [],
  },
}

export default function ServicioSEOLocal({ service }) {
  const { theme } = useTheme()
  const T = theme === 'light' ? LIGHT_T : DARK_T
  const WA = `${WA_BASE}${encodeURIComponent(`Hola, vi la página de ${service.name} y me interesa cotizar un proyecto para mi negocio.`)}`
  const WA_REU = `${WA_BASE}${encodeURIComponent(`Hola, me interesa agendar una reunión para hablar de un proyecto de ${service.name.toLowerCase()}.`)}`

  useEffect(() => {
    px('ViewContent', { content_name: `Servicio ${service.name}` })
    ga('view_item', { item_name: `Servicio ${service.name}`, item_category: 'servicio' })
  }, [service.name])

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    name: service.name,
    description: service.metaDescription,
    provider: { '@type': 'Organization', name: 'AgenciaSI', url: 'https://agenciasi.cl' },
    areaServed: { '@type': 'Country', name: 'Chile' },
    url: `https://agenciasi.cl/servicios/${service.slug}`,
  }

  return (
    <div style={{ fontFamily: "'Poppins', system-ui, sans-serif", background: T.light, color: T.black, overflowX: 'hidden' }}>
      <Helmet>
        <title>{service.metaTitle}</title>
        <meta name="description" content={service.metaDescription} />
        <link rel="canonical" href={`https://agenciasi.cl/servicios/${service.slug}`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={service.metaTitle} />
        <meta property="og:description" content={service.metaDescription} />
        <meta property="og:url" content={`https://agenciasi.cl/servicios/${service.slug}`} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: T.panel, borderBottom: `1px solid ${T.border}`, boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <ThemeLogo style={{ height: 28, width: 'auto' }} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThemeToggle style={{ color: T.gray }} />
            <Link to="/#services" style={{ fontSize: 13, fontWeight: 600, color: T.gray, textDecoration: 'none', padding: '6px 14px' }}>Ver servicios</Link>
            <a href={WA} target="_blank" rel="noopener noreferrer" onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              style={{ background: '#25D366', color: T.white, fontWeight: 700, fontSize: 13, padding: '9px 18px', borderRadius: 30, display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none', boxShadow: '0 4px 12px rgba(37,211,102,.35)' }}>
              <WaIcon size={15} /> Conversemos
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1212CC 0%, #2D2BB5 45%, #1A4FC4 100%)', padding: '72px 20px 88px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 420, height: 420, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 30, padding: '6px 16px', marginBottom: 24 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#A8FFEA', letterSpacing: .5 }}>{service.kicker} · Empresas en todo Chile</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4.4vw, 50px)', fontWeight: 900, color: T.white, lineHeight: 1.15, marginBottom: 20, letterSpacing: -1.2, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
            {service.h1}
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
            {service.sub}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 36 }}>
            <a href={WA} target="_blank" rel="noopener noreferrer" onClick={() => { px('Lead', { content_name: `Servicio ${service.name}` }); ga('generate_lead', { item_name: `Servicio ${service.name}` }) }}
              style={{ background: '#FFFFFF', color: T.blue, fontWeight: 800, fontSize: 15, padding: '14px 28px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.25)' }}>
              <WaIcon size={18} /> Cotizar por WhatsApp
            </a>
            <a href={WA_REU} target="_blank" rel="noopener noreferrer" onClick={() => { px('Schedule'); ga('schedule_appointment') }}
              style={{ background: 'transparent', color: T.white, fontWeight: 600, fontSize: 14, padding: '14px 22px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.35)' }}>
              <Calendar size={15} /> Agendar reunión
            </a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {[{ n: '+60', label: 'proyectos entregados' }, { n: 'ChileCompra', label: 'proveedor del Estado' }, { n: '100%', label: 'código propio' }].map(({ n, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: T.white, lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{ background: T.blueL, borderBottom: '1px solid rgba(139,122,255,0.25)', padding: '16px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/proveedor-del-estado.png" alt="ChileCompra MercadoPúblico" style={{ height: 36, objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: T.black }}>Proveedor del Estado</div>
              <div style={{ fontSize: 10, color: T.gray }}>Registrados en ChileCompra · MercadoPúblico</div>
            </div>
          </div>
          <div style={{ width: 1, height: 32, background: T.border }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Shield size={16} color={T.blue} />
            <span style={{ fontSize: 12, fontWeight: 600, color: T.black }}>Empresa formal · Emitimos facturas</span>
          </div>
        </div>
      </div>

      {/* PROBLEMAS */}
      <section style={{ background: T.light, padding: '72px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.blue, letterSpacing: 2, textTransform: 'uppercase' }}>¿Te identificas?</span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, color: T.black, marginTop: 10, letterSpacing: -.5 }}>
              Problemas que resolvemos
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {service.problems.map(({ title, desc }) => (
              <div key={title} style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 14, padding: '22px 24px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.black, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13, color: T.gray, lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUÉ INCLUYE */}
      <section style={{ background: T.panel, padding: '72px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: T.blue, letterSpacing: 2, textTransform: 'uppercase' }}>Qué incluye</span>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, color: T.black, marginTop: 10, marginBottom: 36, letterSpacing: -.5 }}>
            Lo que construimos para ti
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, textAlign: 'left' }}>
            {service.includes.map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: T.light, border: `1px solid ${T.border}`, borderRadius: 12, padding: '14px 16px' }}>
                <CheckCircle2 size={16} color={T.blue} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 13, color: T.black, fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESCENARIOS CONCRETOS (solo servicios que definen `scenarios`) */}
      {service.scenarios && (
        <section style={{ background: T.light, padding: '72px 20px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: T.blue, letterSpacing: 2, textTransform: 'uppercase' }}>Ejemplos concretos</span>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, color: T.black, marginTop: 10, letterSpacing: -.5 }}>
                Esto es lo que podemos automatizar
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {service.scenarios.map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, padding: '16px 20px' }}>
                  <CheckCircle2 size={17} color={T.green} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 14, color: T.black, lineHeight: 1.6 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CÓMO TRABAJAMOS (solo servicios que definen `approach`) */}
      {service.approach && (
        <section style={{ background: T.panel, padding: '56px 20px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(19px, 2.6vw, 26px)', fontWeight: 800, color: T.black, marginBottom: 12, letterSpacing: -.3 }}>
              {service.approach.title}
            </h2>
            <p style={{ fontSize: 14.5, color: T.gray, lineHeight: 1.75, margin: 0 }}>
              {service.approach.desc}
            </p>
          </div>
        </section>
      )}

      {/* CASOS RELACIONADOS */}
      {service.cases.length > 0 && (
        <section style={{ background: T.light, padding: '72px 20px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: T.blue, letterSpacing: 2, textTransform: 'uppercase' }}>Ya lo hicimos</span>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, color: T.black, marginTop: 10, letterSpacing: -.5 }}>
                Proyectos reales de este tipo
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {service.cases.map(c => (
                <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer"
                  style={{ textDecoration: 'none', background: T.panel, border: `1px solid ${T.border}`, borderRadius: 16, padding: '24px', display: 'block' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: T.black, marginBottom: 4 }}>{c.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.blue, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>{c.tag}</div>
                  <p style={{ fontSize: 13, color: T.gray, lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
                  <div style={{ marginTop: 14, fontSize: 12, fontWeight: 700, color: T.blue, display: 'flex', alignItems: 'center', gap: 6 }}>
                    Ver sitio <ExternalLink size={12} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section style={{ background: `linear-gradient(135deg, #0A0A14 0%, #0F0F30 100%)`, padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 900, color: T.white, letterSpacing: -1, marginBottom: 14, lineHeight: 1.2 }}>
            ¿Conversamos sobre tu proyecto?
          </h2>
          <p style={{ fontSize: 16, color: '#B0B0D0', marginBottom: 32, lineHeight: 1.7 }}>
            Analizamos tu caso y te decimos honestamente si podemos ayudarte y cómo. Sin compromiso.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
            <a href={WA} target="_blank" rel="noopener noreferrer" onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              style={{ background: '#25D366', color: T.white, fontWeight: 800, fontSize: 16, padding: '16px 32px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', boxShadow: '0 8px 32px rgba(37,211,102,.45)' }}>
              <WaIcon size={20} /> Cotizar por WhatsApp
            </a>
            <Link to={`/?servicio=${service.slug}#contact`}
              style={{ background: 'transparent', color: T.white, fontWeight: 700, fontSize: 15, padding: '16px 24px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.3)' }}>
              Solicitar un diagnóstico <ArrowRight size={16} />
            </Link>
          </div>
          <p style={{ fontSize: 12, color: '#6060A0' }}>
            +56 9 3293 0812 · contacto@agenciasi.cl
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: T.light, padding: '24px 20px', borderTop: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <ThemeLogo style={{ height: 24, width: 'auto' }} />
          </Link>
          <span style={{ fontSize: 12, color: T.muted }}>© 2026 AgenciaSI · {service.name} · Chile</span>
          <Link to="/" style={{ fontSize: 12, color: T.muted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
            Ver todos los servicios <ExternalLink size={11} />
          </Link>
        </div>
      </footer>

      {/* FLOATING WA */}
      <a href={WA} target="_blank" rel="noopener noreferrer" onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
        style={{ position: 'fixed', bottom: 24, left: 24, background: '#25D366', color: T.white, width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 24px rgba(37,211,102,.55)', zIndex: 100, textDecoration: 'none' }}>
        <WaIcon size={26} />
      </a>
    </div>
  )
}

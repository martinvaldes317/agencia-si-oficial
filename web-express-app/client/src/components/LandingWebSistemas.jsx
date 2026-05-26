import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  Star, Globe, Settings, ShoppingCart,
  LayoutDashboard, Users, Search, Clock, Shield, Smartphone,
  MessageCircle, MapPin, Zap, Package, HeartHandshake,
  Code2, AlertCircle, CheckCircle2,
  ExternalLink, Calendar, Wrench, BarChart3,
  Building2, Newspaper
} from 'lucide-react'

/* ── BRAND ─────────────────────────────────────────────── */
const T = {
  blue:   '#2D2BB5',
  blueD:  '#1E1C8A',
  blueL:  '#EEF0FF',
  black:  '#0A0A14',
  dark:   '#1A1A2E',
  gray:   '#4C4C68',
  muted:  '#8080A0',
  light:  '#F6F6FC',
  border: '#E0E0EF',
  white:  '#FFFFFF',
  green:  '#16A34A',
  greenL: '#F0FDF4',
  gold:   '#F59E0B',
}

const WA      = 'https://wa.me/56932930812?text=Hola%2C%20vi%20su%20p%C3%A1gina%20y%20me%20interesa%20cotizar%20una%20web%20para%20mi%20negocio.'
const WA_REU  = 'https://wa.me/56932930812?text=Hola%2C%20me%20interesa%20agendar%20una%20reuni%C3%B3n%20para%20hablar%20de%20mi%20proyecto.'
const fmt     = n => n.toLocaleString('es-CL')
const px = (event, params) => { if (typeof fbq !== 'undefined') fbq('track', event, params) }
const trackWA       = () => px('Contact')
const trackSchedule = () => px('Schedule')
const trackLead     = (planName) => px('Lead', { content_name: planName })

const WaIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

/* ── DATA ──────────────────────────────────────────────── */
const DEMOS = [
  { label: 'Farmacia', cat: 'E-commerce', url: '/demos/farmacia',    img: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=700&h=420&fit=crop&q=80' },
  { label: 'Clínica Dental', cat: 'Institucional', url: '/demos/clinica',     img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=700&h=420&fit=crop&q=80' },
  { label: 'Restaurante', cat: 'Gastronomía', url: '/demos/restaurante', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&h=420&fit=crop&q=80' },
  { label: 'Inmobiliaria', cat: 'Portal propiedades', url: '/demos/corredora',  img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&h=420&fit=crop&q=80' },
  { label: 'Tienda Online', cat: 'E-commerce moda', url: '/demos/tienda',     img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&h=420&fit=crop&q=80' },
  { label: 'Portal de Noticias', cat: 'Medios digitales', url: '/demos/noticias',   img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=700&h=420&fit=crop&q=80' },
]

const PROBLEMS = [
  { icon: Search,         title: 'No apareces en Google', desc: 'Tus clientes buscan en Google, pero encuentran a la competencia.' },
  { icon: AlertCircle,    title: 'Tu web se ve anticuada', desc: 'Una presencia poco profesional genera desconfianza y pierdes ventas.' },
  { icon: MessageCircle,  title: 'Respondes lo mismo todo el día', desc: 'WhatsApp lleno de preguntas repetidas que podrías automatizar.' },
  { icon: Clock,          title: 'Procesos manuales que roban tiempo', desc: 'Inventario, pedidos, clientes — todo a mano, con riesgo de errores.' },
  { icon: Users,          title: 'Tu competencia ya lleva ventaja', desc: 'Mientras tú esperas, otros ya están captando tus clientes online.' },
  { icon: Smartphone,     title: 'Tu sitio no funciona en el celular', desc: 'El 70% del tráfico web hoy es móvil. Si no es responsive, perdiste.' },
]

const WEBS = [
  { icon: Zap,            name: 'Landing Page',          desc: 'Para captar clientes rápido. Una página clara con foco total en conversión.' },
  { icon: Building2,      name: 'Web Corporativa',       desc: 'Imagen profesional de tu empresa, servicios, equipo y contacto.' },
  { icon: ShoppingCart,   name: 'E-commerce',            desc: 'Tienda online con catálogo, carrito, Webpay y Mercado Pago.' },
  { icon: Calendar,       name: 'Reservas y Agendas',    desc: 'Sistema de citas online para clínicas, servicios y profesionales.' },
  { icon: Newspaper,      name: 'Blog y Contenido',      desc: 'Posicionamiento SEO a través de artículos y contenido de valor.' },
  { icon: Globe,          name: 'Catálogo Digital',      desc: 'Muestra tus productos o servicios sin necesidad de carrito de compras.' },
]

const SISTEMAS = [
  { icon: LayoutDashboard, name: 'Panel Administrativo',  desc: 'Controla tu negocio desde un dashboard con datos en tiempo real.' },
  { icon: Package,         name: 'Gestión de Inventario', desc: 'Stock, alertas, entradas y salidas con reporte automático.' },
  { icon: BarChart3,       name: 'CRM de Clientes',       desc: 'Historial, seguimiento y gestión de tu cartera de clientes.' },
  { icon: Settings,        name: 'Automatizaciones',      desc: 'Flujos que trabajan solos: cobros, notificaciones, reportes.' },
  { icon: Wrench,          name: 'Sistema de Órdenes',    desc: 'Para servicios técnicos, talleres o producción a pedido.' },
  { icon: Users,           name: 'Portal de Clientes',    desc: 'Tus clientes acceden a su info, documentos y métricas en línea.' },
]

const PLANS = [
  {
    name: 'Web Corporativa',
    price: 149990,
    popular: true,
    desc: 'Imagen profesional completa. Ideal para empresas, comercios y servicios.',
    features: ['Diseño único a medida', 'Hasta 10 páginas/secciones', 'Dominio .cl 1 año gratis', 'Hosting 1 año gratis', 'Google Maps integrado', '3 correos corporativos', 'Botón WhatsApp', 'Indexado en Google', 'Facturable', 'Soporte 2 meses'],
  },
  {
    name: 'E-commerce',
    price: 99990,
    oldPrice: 349990,
    cupos: 5,
    popular: false,
    desc: 'Tienda online con carga inicial de 25 productos, pagos en línea y despacho integrado.',
    features: ['Diseño único a medida', 'Carga inicial 25 productos', 'Carrito de compras', 'MercadoPago integrado', 'BlueExpress como método de envío', 'Panel de productos', 'Gestión de pedidos', 'Dominio + Hosting 1 año gratis'],
  },
  {
    name: 'Sistema a Medida',
    price: null,
    popular: false,
    desc: 'Automatizaciones, sistemas internos, portales o cualquier lógica de negocio específica.',
    features: ['Diagnóstico sin costo', 'Cotización personalizada', 'CRM / gestión de clientes', 'Panel administrador', 'Base de datos incluida', 'Integraciones a medida', 'Capacitación del equipo', 'Soporte extendido'],
  },
]

const STEPS = [
  { n: '01', title: 'Reunión inicial',      desc: 'Hablamos de tu negocio, objetivos y qué necesitas. Sin costo ni compromiso.' },
  { n: '02', title: 'Diseño y propuesta',   desc: 'Preparamos un prototipo visual para que veas cómo quedaría tu sitio.' },
  { n: '03', title: 'Desarrollo',           desc: 'Construimos tu sitio o sistema con código propio y a tu medida.' },
  { n: '04', title: 'Revisión contigo',     desc: 'Revisas, propones cambios y apruebas antes de publicar.' },
  { n: '05', title: 'Publicación',          desc: 'Lanzamos y dejamos todo funcionando. Más soporte post-entrega incluido.' },
]

const INCLUDES = [
  { icon: Globe,          text: 'Dominio .cl incluido' },
  { icon: Shield,         text: 'Hosting seguro (SSL)' },
  { icon: Smartphone,     text: '100% responsive' },
  { icon: Search,         text: 'Indexación en Google' },
  { icon: MessageCircle,  text: 'WhatsApp integrado' },
  { icon: HeartHandshake, text: 'Soporte post-entrega' },
  { icon: LayoutDashboard,text: 'Panel de administración' },
  { icon: Calendar,       text: 'Capacitación incluida' },
]

const TESTIMONIALS = [
  {
    name: 'Rodrigo Muñoz',
    biz:  'Ferretería El Clavo — Talca',
    text: 'Antes nadie me encontraba en Google. Ahora llaman cada semana por el sitio. Vale cada peso.',
    stars: 5,
    initial: 'R',
    color: '#EEF0FF',
  },
  {
    name: 'Camila Soto',
    biz:  'Centro Kinesiología Soto — Curicó',
    text: 'El sistema de reservas me cambió la vida. Mis pacientes agendan solos y yo solo confirmo.',
    stars: 5,
    initial: 'C',
    color: '#F0FDF4',
  },
  {
    name: 'Felipe Arenas',
    biz:  'Distribuidora Arenas — Santiago',
    text: 'Profesionales, rápidos y honestos. Me explicaron todo sin tecnicismos. Muy recomendados.',
    stars: 5,
    initial: 'F',
    color: '#FFF7ED',
  },
]

/* ── COMPONENT ─────────────────────────────────────────── */
export default function LandingWebSistemas() {
  useEffect(() => { px('ViewContent', { content_name: 'Landing Web y Sistemas' }) }, [])

  return (
    <div style={{ fontFamily: "'Poppins', system-ui, sans-serif", background: T.white, color: T.dark, overflowX: 'hidden' }}>
      <Helmet>
        <title>Páginas Web y Sistemas a Medida desde $79.990 | AgenciaSI Chile</title>
        <meta name="description" content="Creamos páginas web y sistemas a medida para tu negocio en Chile desde $79.990. Entrega en 5 días, dominio incluido, soporte post-entrega. Cotiza por WhatsApp." />
        <link rel="canonical" href="https://agenciasi.cl/web" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* ── STICKY HEADER ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: T.white, borderBottom: `1px solid ${T.border}`, boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: T.blue, borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 16, color: T.black, letterSpacing: -.3 }}>AgenciaSI</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a href="#precios" style={{ fontSize: 13, fontWeight: 600, color: T.gray, textDecoration: 'none', padding: '6px 14px' }} className="lws-link">Ver precios</a>
            <a href={WA} target="_blank" rel="noopener noreferrer" onClick={trackWA}
              style={{ background: '#25D366', color: T.white, fontWeight: 700, fontSize: 13, padding: '9px 18px', borderRadius: 30, display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none', boxShadow: '0 4px 12px rgba(37,211,102,.35)' }} className="wa-btn">
              <WaIcon size={15} /> Cotizar ahora
            </a>
          </div>
        </div>
      </header>

      {/* ── PROMO STRIP ── */}
      <div style={{ background: '#A8FFEA', padding: '10px 20px', textAlign: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: T.blueD, letterSpacing: .3 }}>
          ⚡ OFERTA EXCLUSIVA · Tu sitio web desde <strong>$59.990</strong> · Solo 10 cupos disponibles ·{' '}
        </span>
        <a href="#precios" style={{ fontSize: 13, fontWeight: 800, color: T.blueD, textDecoration: 'underline' }}>Ver oferta →</a>
      </div>

      {/* ── HERO ── */}
      <section style={{ background: `linear-gradient(135deg, #1212CC 0%, #2D2BB5 45%, #1A4FC4 100%)`, padding: '68px 20px 80px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 420, height: 420, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -40, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }} className="lws-hero-grid">
          {/* Left */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 30, padding: '6px 14px', marginBottom: 20 }}>
              <MapPin size={13} color="#A8FFEA" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#A8FFEA', letterSpacing: .5 }}>Para Pymes y Profesionales · Chile</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 58px)', fontWeight: 900, color: T.white, lineHeight: 1.08, marginBottom: 16, letterSpacing: -1.5, fontStyle: 'italic' }}>
              Tu Sitio Web<br />
              <span style={{ fontStyle: 'normal', fontSize: '0.72em', fontWeight: 900, letterSpacing: -.5 }}>Profesional</span>
            </h1>
            {/* Promo price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>por solo</span>
              <span style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 900, color: T.white, letterSpacing: -2, lineHeight: 1 }}>$59.990</span>
              <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.45)', textDecoration: 'line-through', fontWeight: 500 }}>$99.990</span>
            </div>
            <div style={{ display: 'inline-block', borderBottom: '2px solid #A8FFEA', paddingBottom: 2, marginBottom: 24 }}>
              <span style={{ fontSize: 15, fontStyle: 'italic', fontWeight: 700, color: '#A8FFEA' }}>Solo 10 Cupos Disponibles</span>
            </div>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, marginBottom: 28, maxWidth: 460 }}>
              Diseño único a medida, dominio + hosting gratis, WhatsApp integrado e indexación en Google. <strong style={{ color: T.white }}>Entrega en 5 días hábiles.</strong>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
              <a href={`${WA}&text=${encodeURIComponent('Hola, me interesa la oferta de Landing Page a $59.990')}`} target="_blank" rel="noopener noreferrer" onClick={() => trackLead('Landing Page Promo')}
                style={{ background: T.white, color: T.blue, fontWeight: 800, fontSize: 15, padding: '14px 28px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.25)' }} className="wa-btn">
                <WaIcon size={18} /> Quiero esta oferta
              </a>
              <a href="#trabajos"
                style={{ background: 'transparent', color: T.white, fontWeight: 600, fontSize: 14, padding: '14px 22px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.35)' }}>
                Ver trabajos <ExternalLink size={15} />
              </a>
            </div>
            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              {[
                { n: '+50', label: 'proyectos entregados' },
                { n: '5 días', label: 'entrega Web Express' },
                { n: '100%', label: 'código propio' },
              ].map(({ n, label }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 20, fontWeight: 900, color: T.white, lineHeight: 1 }}>{n}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: demo mockups grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="lws-demos-grid">
            {DEMOS.slice(0, 4).map((d, i) => (
              <Link key={d.url} to={d.url}
                style={{ textDecoration: 'none', borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,.4)', border: '1px solid rgba(255,255,255,.15)', background: '#111', transform: i % 2 === 1 ? 'translateY(20px)' : 'none', transition: 'transform .3s, box-shadow .3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = i % 2 === 1 ? 'translateY(14px) scale(1.02)' : 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(168,255,234,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = i % 2 === 1 ? 'translateY(20px)' : 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,.4)' }}>
                <div style={{ background: '#1E1E2C', padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF5F57', display: 'block' }} />
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#FEBC2E', display: 'block' }} />
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#28C840', display: 'block' }} />
                  <div style={{ flex: 1, background: '#2A2A3C', borderRadius: 3, height: 14, marginLeft: 6 }} />
                </div>
                <img src={d.img} alt={d.label} style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '8px 10px', background: '#0F0F18' }}>
                  <div style={{ fontSize: 9, color: '#6060A0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{d.cat}</div>
                  <div style={{ fontSize: 11, color: '#D0D0E8', fontWeight: 700 }}>{d.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEMAS ── */}
      <section style={{ background: T.light, padding: '72px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.blue, letterSpacing: 2, textTransform: 'uppercase' }}>¿Te identificas?</span>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: T.black, marginTop: 10, letterSpacing: -.5 }}>
              Problemas que resolvemos
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {PROBLEMS.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, padding: '22px 24px', display: 'flex', gap: 16, alignItems: 'flex-start', transition: 'box-shadow .25s, border-color .25s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 24px ${T.blue}18`; e.currentTarget.style.borderColor = `${T.blue}50` }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = T.border }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: T.blueL, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={T.blue} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.black, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 13, color: T.gray, lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section style={{ background: T.white, padding: '80px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.blue, letterSpacing: 2, textTransform: 'uppercase' }}>Lo que hacemos</span>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: T.black, marginTop: 10, letterSpacing: -.5 }}>
              Dos grandes áreas, un solo equipo
            </h2>
            <p style={{ fontSize: 16, color: T.gray, marginTop: 12, maxWidth: 560, margin: '12px auto 0' }}>
              No somos "el cabro que hace páginas". Somos un equipo que construye soluciones digitales completas.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }} className="lws-services-grid">
            {/* Webs */}
            <div style={{ background: T.blueL, borderRadius: 20, padding: '36px 32px', border: `1px solid ${T.blue}25` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: T.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={22} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: T.black }}>Páginas Web</div>
                  <div style={{ fontSize: 12, color: T.blue, fontWeight: 600 }}>Desde $79.990</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {WEBS.map(({ icon: Icon, name, desc }) => (
                  <div key={name} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${T.blue}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Icon size={15} color={T.blue} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.black }}>{name}</div>
                      <div style={{ fontSize: 12, color: T.gray, lineHeight: 1.5 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Sistemas */}
            <div style={{ background: '#0A0A14', borderRadius: 20, padding: '36px 32px', border: `1px solid ${T.blue}30` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: `${T.blue}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Settings size={22} color="#A0A0FF" />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: T.white }}>Sistemas y Automatización</div>
                  <div style={{ fontSize: 12, color: '#A0A0FF', fontWeight: 600 }}>Cotización personalizada</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {SISTEMAS.map(({ icon: Icon, name, desc }) => (
                  <div key={name} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${T.blue}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Icon size={15} color="#A0A0FF" />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.white }}>{name}</div>
                      <div style={{ fontSize: 12, color: '#7070A0', lineHeight: 1.5 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRABAJOS / PORTFOLIO ── */}
      <section id="trabajos" style={{ background: T.light, padding: '80px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.blue, letterSpacing: 2, textTransform: 'uppercase' }}>Demos interactivas</span>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: T.black, marginTop: 10, letterSpacing: -.5 }}>
              Así se verá tu sitio web
            </h2>
            <p style={{ fontSize: 15, color: T.gray, marginTop: 10, maxWidth: 520, margin: '10px auto 0' }}>
              Proyectos de ejemplo que construimos para mostrar nuestras capacidades — entra y navega como si fuera real.
            </p>
            <p style={{ fontSize: 13, color: T.muted, marginTop: 8 }}>
              👇 Más abajo encontrarás los logos de nuestros <strong style={{ color: T.gray }}>clientes reales</strong>.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {DEMOS.map(d => (
              <Link key={d.url} to={d.url} style={{ textDecoration: 'none', borderRadius: 14, overflow: 'hidden', background: T.white, border: `1px solid ${T.border}`, boxShadow: '0 2px 12px rgba(0,0,0,.06)', transition: 'transform .3s, box-shadow .3s', display: 'block' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 16px 40px ${T.blue}20` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.06)' }}>
                {/* Browser bar */}
                <div style={{ background: '#F3F4F6', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5F57', display: 'block' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FEBC2E', display: 'block' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28C840', display: 'block' }} />
                  <div style={{ flex: 1, background: '#E5E7EB', borderRadius: 4, height: 16, marginLeft: 8, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
                    <span style={{ fontSize: 9, color: '#9CA3AF', fontFamily: 'monospace' }}>agenciasi.cl{d.url}</span>
                  </div>
                </div>
                <img src={d.img} alt={d.label} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 11, color: T.blue, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{d.cat}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.black }}>{d.label}</div>
                  </div>
                  <div style={{ background: T.blueL, borderRadius: 8, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: T.blue }}>
                    Ver demo <ExternalLink size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRECIOS ── */}
      <section id="precios" style={{ background: T.light, padding: '80px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.blue, letterSpacing: 2, textTransform: 'uppercase' }}>Precios transparentes</span>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: T.black, marginTop: 10, letterSpacing: -.5 }}>
              Sin sorpresas. Sin letras chicas.
            </h2>
            <p style={{ fontSize: 15, color: T.gray, marginTop: 10 }}>Precios en pesos chilenos (CLP) · IVA incluido</p>
          </div>

          {/* ── PROMO HERO CARD ── */}
          <div style={{ background: `linear-gradient(135deg, #1A1AD4 0%, #2D2BB5 50%, #1565C0 100%)`, borderRadius: 24, padding: '48px 40px', marginBottom: 28, position: 'relative', overflow: 'hidden', boxShadow: '0 20px 60px rgba(45,43,181,.45)' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }} className="lws-promo-grid">
              <div>
                <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 30, padding: '5px 16px', marginBottom: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#A8FFEA', letterSpacing: 2, textTransform: 'uppercase' }}>⚡ Oferta exclusiva para pymes y profesionales</span>
                </div>
                <div style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontStyle: 'italic', fontWeight: 900, color: T.white, marginBottom: 8, letterSpacing: -.5 }}>Tu Sitio Web Profesional</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>por solo</span>
                  <span style={{ fontSize: 'clamp(42px, 6vw, 64px)', fontWeight: 900, color: T.white, letterSpacing: -2, lineHeight: 1 }}>$59.990</span>
                  <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through', fontWeight: 500 }}>$99.990</span>
                </div>
                <div style={{ display: 'inline-block', borderBottom: '2px solid #A8FFEA', paddingBottom: 2, marginBottom: 20 }}>
                  <span style={{ fontSize: 16, fontStyle: 'italic', fontWeight: 700, color: '#A8FFEA' }}>Solo 10 Cupos Disponibles</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '8px 16px' }}>
                  {['Dominio .cl 1 año gratis','Hosting 1 año gratis','Hasta 5 secciones','Formulario de contacto','Botón WhatsApp','Google Maps','3 correos corporativos','Facturable','Desarrollado por profesionales','Sitio web indexado en Google'].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <CheckCircle2 size={13} color="#A8FFEA" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 200 }} className="lws-promo-cta">
                <a href={`${WA}&text=${encodeURIComponent('Hola, me interesa la oferta de Landing Page a $59.990')}`} target="_blank" rel="noopener noreferrer" onClick={() => trackLead('Landing Page Promo')}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px 28px', borderRadius: 14, background: T.white, color: T.blue, fontWeight: 800, fontSize: 15, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.2)', whiteSpace: 'nowrap' }} className="wa-btn">
                  <WaIcon size={17} /> Quiero esta oferta
                </a>
                <a href={WA_REU} target="_blank" rel="noopener noreferrer" onClick={trackSchedule}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 24px', borderRadius: 14, background: 'transparent', color: T.white, fontWeight: 700, fontSize: 13, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.4)', whiteSpace: 'nowrap' }}>
                  <Calendar size={15} /> Agendar reunión
                </a>
              </div>
            </div>
          </div>

          {/* ── OTROS PLANES ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {PLANS.map(plan => (
              <div key={plan.name}
                style={{ borderRadius: 20, padding: '28px 24px', border: plan.popular ? `2px solid ${T.blue}` : `1px solid ${T.border}`, background: T.white, position: 'relative', boxShadow: plan.popular ? `0 12px 40px ${T.blue}20` : '0 2px 12px rgba(0,0,0,.04)' }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: T.blue, color: T.white, fontSize: 11, fontWeight: 800, padding: '4px 16px', borderRadius: 20, letterSpacing: 1, whiteSpace: 'nowrap' }}>
                    ⭐ MÁS ELEGIDO
                  </div>
                )}
                {plan.cupos && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#DC2626', color: T.white, fontSize: 11, fontWeight: 800, padding: '4px 16px', borderRadius: 20, letterSpacing: .5, whiteSpace: 'nowrap' }}>
                    🔥 SOLO {plan.cupos} CUPOS
                  </div>
                )}
                <div style={{ fontSize: 17, fontWeight: 800, color: T.black, marginBottom: 6 }}>{plan.name}</div>
                <div style={{ marginBottom: 12 }}>
                  {plan.price ? (
                    <div>
                      {plan.oldPrice && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                          <span style={{ fontSize: 13, color: T.muted, textDecoration: 'line-through', fontWeight: 500 }}>${fmt(plan.oldPrice)}</span>
                          <span style={{ fontSize: 10, fontWeight: 700, background: '#FEF2F2', color: '#DC2626', padding: '2px 7px', borderRadius: 20 }}>SÚPER OFERTA</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{ fontSize: 12, color: T.gray, fontWeight: 600 }}>desde</span>
                        <span style={{ fontSize: 30, fontWeight: 900, color: T.blue, letterSpacing: -1 }}>${fmt(plan.price)}</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 26, fontWeight: 900, color: T.blue }}>A cotizar</span>
                      <span style={{ fontSize: 11, background: T.blueL, color: T.blue, fontWeight: 700, padding: '3px 8px', borderRadius: 10 }}>Gratis</span>
                    </div>
                  )}
                </div>
                <p style={{ fontSize: 12, color: T.gray, lineHeight: 1.6, marginBottom: 20 }}>{plan.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <CheckCircle2 size={13} color={T.green} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 12, color: T.gray }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href={`${WA}&text=${encodeURIComponent(plan.cupos ? `Hola, me interesa la súper oferta de E-commerce a $99.990` : `Hola, me interesa cotizar: ${plan.name}`)}`} target="_blank" rel="noopener noreferrer" onClick={() => trackLead(plan.name)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '12px', borderRadius: 12, background: plan.cupos ? '#DC2626' : plan.popular ? T.blue : T.black, color: T.white, fontWeight: 700, fontSize: 13, textDecoration: 'none', boxSizing: 'border-box' }} className="wa-btn">
                  <WaIcon size={14} /> {plan.cupos ? '🔥 Quiero esta oferta' : plan.price ? 'Cotizar este plan' : 'Solicitar diagnóstico gratis'}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESO ── */}
      <section style={{ background: T.light, padding: '80px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.blue, letterSpacing: 2, textTransform: 'uppercase' }}>Cómo trabajamos</span>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: T.black, marginTop: 10, letterSpacing: -.5 }}>
              Un proceso claro y sin sorpresas
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STEPS.map((step, i) => (
              <div key={step.n} style={{ display: 'flex', gap: 24, position: 'relative', paddingBottom: i < STEPS.length - 1 ? 32 : 0 }}>
                {/* Line connector */}
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', left: 23, top: 56, width: 2, height: 'calc(100% - 24px)', background: `linear-gradient(to bottom, ${T.blue}60, ${T.border})` }} />
                )}
                {/* Number */}
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: T.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, boxShadow: `0 4px 16px ${T.blue}40` }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: T.white }}>{step.n}</span>
                </div>
                {/* Content */}
                <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, padding: '18px 22px', flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: T.black, marginBottom: 4 }}>{step.title}</div>
                  <div style={{ fontSize: 13, color: T.gray, lineHeight: 1.65 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUÉ INCLUYE ── */}
      <section style={{ background: T.white, padding: '80px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: T.blue, letterSpacing: 2, textTransform: 'uppercase' }}>Todo incluido</span>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, color: T.black, marginTop: 10, marginBottom: 8, letterSpacing: -.5 }}>
            ¿Qué incluye tu proyecto?
          </h2>
          <p style={{ fontSize: 15, color: T.gray, marginBottom: 44 }}>
            Nada queda suelto. Entregamos todo listo para funcionar.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {INCLUDES.map(({ icon: Icon, text }) => (
              <div key={text} style={{ background: T.light, border: `1px solid ${T.border}`, borderRadius: 14, padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: T.blueL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={T.blue} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.dark, textAlign: 'center', lineHeight: 1.4 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ── */}
      <section style={{ background: T.light, padding: '80px 20px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.blue, letterSpacing: 2, textTransform: 'uppercase' }}>Lo que dicen</span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, color: T.black, marginTop: 10, letterSpacing: -.5 }}>
              Clientes que confiaron en nosotros
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, padding: '28px 24px' }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {Array(t.stars).fill(0).map((_, i) => <Star key={i} size={14} fill={T.gold} color={T.gold} />)}
                </div>
                <p style={{ fontSize: 14, color: T.gray, lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20 }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${T.border}` }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: T.blue }}>{t.initial}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.black }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>{t.biz}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENTES ── */}
      <section style={{ background: T.white, padding: '80px 20px', overflow: 'hidden' }}>
        <style>{`
          @keyframes marquee {
            0%   { transform: translateX(0) }
            100% { transform: translateX(-50%) }
          }
          .lws-marquee-track {
            display: flex;
            width: max-content;
            animation: marquee 32s linear infinite;
          }
          .lws-marquee-track:hover { animation-play-state: paused; }
          .lws-logo-item {
            flex-shrink: 0;
            width: 148px;
            height: 80px;
            margin: 0 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #F4F4F8;
            border: 1px solid #E0E0EA;
            border-radius: 12px;
            padding: 12px 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            filter: grayscale(100%) opacity(0.6);
            transition: filter 0.3s, box-shadow 0.3s;
          }
          .lws-logo-item:hover { filter: grayscale(0%) opacity(1); box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
          .lws-logo-item img { max-width: 110px; max-height: 52px; object-fit: contain; }
        `}</style>

        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', marginBottom: 52 }}>
          <div style={{ display: 'inline-block', background: T.blueL, color: T.blue, fontWeight: 700, fontSize: 12, letterSpacing: 1.5, padding: '5px 14px', borderRadius: 20, marginBottom: 16 }}>NUESTROS CLIENTES</div>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 900, color: T.black, letterSpacing: -0.5, marginBottom: 16, lineHeight: 1.2 }}>
            Nuestra reputación<br />nos importa.
          </h2>
          <p style={{ fontSize: 16, color: T.gray, maxWidth: 560, margin: '0 auto 0' }}>
            Nos preocupamos de hacer diseños a medida, escuchando cada detalle de tu negocio. Cada cliente es un proyecto único — no usamos plantillas.
          </p>
        </div>

        {/* Logo marquee */}
        <div style={{ overflow: 'hidden', margin: '0 -20px' }}>
          <div className="lws-marquee-track">
            {[
              'astro-entretenimientos.svg','capitol-group.svg','espacio-cea.svg','guardias-cl.svg',
              'premiumlav.svg','calces.svg','vision-eventos.svg','solar-espectaculo.svg',
              'cft-araucania.svg','zona-plaga.svg','naturalpetworld.webp','hiiaka-dental.webp',
              'valoramos.webp','pili-orfebre.webp','centro-kinesico.webp','pacifico-salud.webp',
              'daza-maquinarias.webp','espacio-blue.webp','entrelluvias-sabores.webp','schopchile.webp',
              'ambulancias-pacifico.webp','asysam.webp','consultora-lawen.webp','d-tolentino.webp',
              'capitol-training.webp','limari-travel.webp','barras-pole-dance.webp','now-pos.png','lbepv.png',
              // duplicate for seamless loop
              'astro-entretenimientos.svg','capitol-group.svg','espacio-cea.svg','guardias-cl.svg',
              'premiumlav.svg','calces.svg','vision-eventos.svg','solar-espectaculo.svg',
              'cft-araucania.svg','zona-plaga.svg','naturalpetworld.webp','hiiaka-dental.webp',
              'valoramos.webp','pili-orfebre.webp','centro-kinesico.webp','pacifico-salud.webp',
              'daza-maquinarias.webp','espacio-blue.webp','entrelluvias-sabores.webp','schopchile.webp',
              'ambulancias-pacifico.webp','asysam.webp','consultora-lawen.webp','d-tolentino.webp',
              'capitol-training.webp','limari-travel.webp','barras-pole-dance.webp','now-pos.png','lbepv.png',
            ].map((logo, i) => (
              <div key={i} className="lws-logo-item">
                <img src={`/clientes/${logo}`} alt="cliente agenciasi" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <p style={{ fontSize: 17, color: T.gray, marginBottom: 8 }}>
            ¿Quieres ser parte de nuestros clientes?
          </p>
          <p style={{ fontSize: 14, color: T.muted, marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
            Conversemos sin compromiso. Te mostramos cómo podemos llevar tu negocio al mundo digital.
          </p>
          <a href={WA_REU} target="_blank" rel="noopener noreferrer" onClick={trackSchedule}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: T.blue, color: T.white, fontWeight: 700, fontSize: 16, padding: '14px 32px', borderRadius: 12, textDecoration: 'none', boxShadow: `0 8px 24px ${T.blue}40` }}>
            <Calendar size={18} /> Agendar una reunión gratis
          </a>
          <p style={{ fontSize: 12, color: T.muted, marginTop: 12 }}>Sin costo · Sin compromiso · Respondemos en menos de 2 horas</p>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ background: `linear-gradient(135deg, ${T.black} 0%, #0F0F30 100%)`, padding: '88px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: `${T.blue}10`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 42, marginBottom: 16 }}>🚀</div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 900, color: T.white, letterSpacing: -1, marginBottom: 16, lineHeight: 1.2 }}>
            ¿Listo para tener la<br />web que tu negocio merece?
          </h2>
          <p style={{ fontSize: 17, color: '#B0B0D0', marginBottom: 36, lineHeight: 1.7 }}>
            Escríbenos ahora. Te respondemos en menos de 2 horas en horario laboral. Sin compromiso.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 24 }}>
            <a href={WA} target="_blank" rel="noopener noreferrer" onClick={trackWA}
              style={{ background: '#25D366', color: T.white, fontWeight: 800, fontSize: 17, padding: '16px 36px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', boxShadow: '0 8px 32px rgba(37,211,102,.45)' }} className="wa-btn">
              <WaIcon size={20} /> Cotizar por WhatsApp
            </a>
            <a href={WA_REU} target="_blank" rel="noopener noreferrer" onClick={trackSchedule}
              style={{ background: 'transparent', color: T.white, fontWeight: 700, fontSize: 16, padding: '16px 28px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.3)' }}>
              <Calendar size={17} /> Agendar reunión
            </a>
          </div>
          <p style={{ fontSize: 13, color: '#6060A0' }}>
            También puedes escribirnos al <strong style={{ color: '#A0A0FF' }}>+56 9 3293 0812</strong> · contacto@agenciasi.cl
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#050508', padding: '28px 20px', borderTop: '1px solid #1A1A2E' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ background: T.blue, borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={13} color="#fff" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: T.white }}>AgenciaSI</span>
          </Link>
          <span style={{ fontSize: 12, color: '#404060' }}>© 2026 AgenciaSI · Desarrollo web y sistemas · Chile</span>
          <Link to="/demos" style={{ fontSize: 12, color: '#404060', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
            Ver todas las demos <ExternalLink size={11} />
          </Link>
        </div>
      </footer>

      {/* ── FLOATING WA BUTTON ── */}
      <a href={WA} target="_blank" rel="noopener noreferrer" onClick={trackWA}
        style={{ position: 'fixed', bottom: 24, right: 24, background: '#25D366', color: T.white, width: 58, height: 58, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 24px rgba(37,211,102,.55)', zIndex: 100, textDecoration: 'none' }} className="wa-btn">
        <WaIcon size={28} />
      </a>

      {/* ── MOBILE CSS ── */}
      <style>{`
        @keyframes wa-bounce {
          0%, 100% { transform: scale(1); }
          40% { transform: scale(1.10); }
          60% { transform: scale(0.96); }
        }
        .wa-btn { animation: wa-bounce 2.4s ease-in-out infinite; }
        .wa-btn:hover { animation-play-state: paused; transform: scale(1.05); }
        .lws-link:hover { color: #2D2BB5 !important; }
        @media (max-width: 768px) {
          .lws-hero-grid    { grid-template-columns: 1fr !important; gap: 40px !important; }
          .lws-demos-grid   { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .lws-services-grid { grid-template-columns: 1fr !important; }
          .lws-promo-grid   { grid-template-columns: 1fr !important; }
          .lws-promo-cta    { flex-direction: row !important; flex-wrap: wrap; min-width: unset !important; }
        }
        @media (max-width: 480px) {
          .lws-demos-grid  { display: none !important; }
          .lws-promo-cta   { flex-direction: column !important; }
        }
      `}</style>
    </div>
  )
}

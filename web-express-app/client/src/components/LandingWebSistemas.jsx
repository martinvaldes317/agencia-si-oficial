import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  Globe, Settings, ShoppingCart,
  LayoutDashboard, Users, Search, Clock, Shield, Smartphone,
  MessageCircle, MapPin, Zap, Package, HeartHandshake,
  AlertCircle, CheckCircle2,
  ExternalLink, Calendar, Wrench, BarChart3,
  Building2, Newspaper, Code2, BookOpenCheck, ArrowRight
} from 'lucide-react'
import { useTheme } from '../theme/ThemeContext'
import ThemeToggle from '../theme/ThemeToggle'
import ThemeLogo from '../theme/ThemeLogo'

/* ── BRAND ─────────────────────────────────────────────── */
// T.white/T.green/T.gold se mantienen iguales en ambos temas: siempre están
// sobre una superficie de color fijo (botones, franjas con gradiente azul
// permanente) que no cambia con el tema — nunca sobre el fondo de la página.
const DARK_T = {
  blue:   '#3d5afe',
  blueD:  '#2a3cc4',
  blueL:  'rgba(61,90,254,0.14)',
  black:  '#f5f5fa',
  dark:   '#d8d8e6',
  gray:   '#9a9ab0',
  muted:  '#75758c',
  light:  '#07070c',
  panel:  '#0c0c14',
  border: 'rgba(255,255,255,0.09)',
  white:  '#FFFFFF',
  green:  '#22c55e',
  greenL: 'rgba(34,197,94,0.12)',
  gold:   '#F59E0B',
}
const LIGHT_T = {
  blue:   '#2451c4',
  blueD:  '#1a3a8f',
  blueL:  'rgba(36,81,196,0.08)',
  black:  '#14141f',
  dark:   '#3a3a4a',
  gray:   '#5c5c72',
  muted:  '#6b6b80',
  light:  '#ffffff',
  panel:  '#f7f8fb',
  border: 'rgba(15,23,42,0.10)',
  white:  '#FFFFFF',
  green:  '#16a34a',
  greenL: 'rgba(22,163,74,0.10)',
  gold:   '#B45309',
}

const WA      = 'https://wa.me/56932930812?text=Hola%2C%20vi%20su%20p%C3%A1gina%20y%20me%20interesa%20cotizar%20una%20web%20para%20mi%20negocio.'
const WA_REU  = 'https://wa.me/56932930812?text=Hola%2C%20me%20interesa%20agendar%20una%20reuni%C3%B3n%20para%20hablar%20de%20mi%20proyecto.'
const fmt     = n => n.toLocaleString('es-CL')
const px = (event, params) => { if (typeof fbq !== 'undefined') fbq('track', event, params) }
const ga = (event, params) => { if (typeof gtag !== 'undefined') gtag('event', event, params) }
const trackWA       = () => { px('Contact');                     ga('contact', { method: 'whatsapp' }) }
const trackSchedule = () => { px('Schedule');                    ga('schedule_appointment') }
const trackLead     = (planName) => { px('Lead', { content_name: planName }); ga('generate_lead', { item_name: planName }) }

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

// Tres formas de resolver un proyecto — no es "web barata vs. sistema caro",
// es qué necesita tu negocio: presencia, un espacio con usuarios, o vender.
const INSTITUCIONAL = [
  { icon: Zap,            name: 'Landing Page',          desc: 'Para captar clientes rápido. Una página clara con foco total en conversión.' },
  { icon: Building2,      name: 'Web Corporativa',       desc: 'Imagen profesional de tu empresa, servicios, equipo y contacto.' },
  { icon: Newspaper,      name: 'Blog y Contenido',      desc: 'Posicionamiento SEO a través de artículos y contenido de valor.' },
  { icon: Globe,          name: 'Catálogo Digital',      desc: 'Muestra tus productos o servicios sin necesidad de carrito de compras.' },
]

const PLATAFORMA = [
  { icon: LayoutDashboard, name: 'Panel Administrativo',  desc: 'Controla tu negocio desde un dashboard con datos en tiempo real.' },
  { icon: Users,           name: 'Portal de Clientes',    desc: 'Tus clientes acceden a su info, documentos y métricas en línea, con login propio.' },
  { icon: Calendar,        name: 'Reservas y Agendas',    desc: 'Sistema de citas online para clínicas, servicios y profesionales.' },
  { icon: BarChart3,       name: 'CRM de Clientes',       desc: 'Historial, seguimiento y gestión de tu cartera de clientes.' },
]

const ECOMMERCE = [
  { icon: ShoppingCart,   name: 'Tienda Online',          desc: 'Catálogo, carrito, Webpay y Mercado Pago integrados.' },
  { icon: Package,        name: 'Gestión de Inventario',  desc: 'Stock, alertas, entradas y salidas con reporte automático.' },
  { icon: Settings,       name: 'Automatizaciones',       desc: 'Flujos que trabajan solos: cobros, notificaciones, reportes.' },
  { icon: Wrench,         name: 'Sistema de Órdenes',     desc: 'Para servicios técnicos, talleres o producción a pedido, conectado con tus otras herramientas.' },
]

const STEPS = [
  { n: '01', title: 'Diagnóstico',          desc: 'Hablamos de tu negocio, objetivos y qué necesitas. Sin costo ni compromiso.' },
  { n: '02', title: 'Diseño y propuesta',   desc: 'Preparamos un prototipo visual y el alcance del proyecto para que lo apruebes antes de construir nada.' },
  { n: '03', title: 'Desarrollo',           desc: 'Construimos tu sitio, plataforma o sistema con código propio y a tu medida.' },
  { n: '04', title: 'Pruebas y correcciones', desc: 'Probamos cada flujo principal, corregimos lo que no funciona y revisas el resultado antes de aprobar el lanzamiento.' },
  { n: '05', title: 'Publicación',          desc: 'Lanzamos y dejamos todo funcionando. Soporte post-entrega incluido.' },
]

const INCLUDES = [
  { icon: Code2,          text: 'Código propio, sin plantillas' },
  { icon: LayoutDashboard,text: 'Panel de administración' },
  { icon: Settings,       text: 'Integraciones con tus herramientas actuales' },
  { icon: Smartphone,     text: 'Diseño responsive' },
  { icon: Search,         text: 'Indexación en Google' },
  { icon: BookOpenCheck,  text: 'Documentación y capacitación de uso' },
  { icon: HeartHandshake, text: 'Soporte post-entrega' },
  { icon: Globe,          text: 'Dominio y hosting cuando corresponde' },
]


/* ── COMPONENT ─────────────────────────────────────────── */
export default function LandingWebSistemas() {
  const { theme } = useTheme()
  const T = theme === 'light' ? LIGHT_T : DARK_T

  useEffect(() => {
    px('ViewContent', { content_name: 'Landing Web y Sistemas' })
    ga('view_item', { item_name: 'Landing Web y Sistemas', item_category: 'web' })
  }, [])

  return (
    <div style={{ fontFamily: "'Poppins', system-ui, sans-serif", background: T.light, color: T.dark, overflowX: 'hidden' }}>
      <Helmet>
        <title>Sitios, Plataformas y E-commerce a Medida | AgenciaSI Chile</title>
        <meta name="description" content="Desarrollamos sitios institucionales, plataformas con usuarios y tiendas online a medida para empresas en Chile. Código propio, plazos acordados por escrito, soporte post-entrega." />
        <link rel="canonical" href="https://agenciasi.cl/web" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* ── STICKY HEADER ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: T.panel, borderBottom: `1px solid ${T.border}`, boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <ThemeLogo style={{ height: 30, width: 'auto' }} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThemeToggle style={{ color: T.gray }} />
            <a href="#soluciones" style={{ fontSize: 13, fontWeight: 600, color: T.gray, textDecoration: 'none', padding: '6px 14px' }} className="lws-link">Qué hacemos</a>
            <Link to="/#contact"
              style={{ background: '#25D366', color: T.white, fontWeight: 700, fontSize: 13, padding: '9px 18px', borderRadius: 30, display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none', boxShadow: '0 4px 12px rgba(37,211,102,.35)' }} className="wa-btn">
              <WaIcon size={15} /> Conversemos
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg, #1a2680 0%, #3d5afe 55%, #6a4bf5 100%)', padding: '68px 20px 80px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 420, height: 420, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -40, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }} className="lws-hero-grid">
          {/* Left */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 30, padding: '6px 14px', marginBottom: 20 }}>
              <MapPin size={13} color="#A8FFEA" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#A8FFEA', letterSpacing: .5 }}>Para Pymes y Profesionales · Chile</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 54px)', fontWeight: 900, color: T.white, lineHeight: 1.12, marginBottom: 16, letterSpacing: -1.2 }}>
              Sitios, plataformas y e-commerce a medida
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.65, marginBottom: 28, maxWidth: 460 }}>
              Construimos la presencia digital que tu negocio necesita: desde un sitio institucional hasta una plataforma con usuarios o una tienda online conectada a tus otras herramientas. <strong style={{ color: T.white }}>Código propio, plazos claros, acordados por escrito y cumplidos.</strong>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
              <Link to="/#contact"
                style={{ background: '#FFFFFF', color: T.blue, fontWeight: 800, fontSize: 15, padding: '14px 28px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.25)' }}>
                Conversemos sobre tu proyecto <ArrowRight size={18} />
              </Link>
              <a href="#trabajos"
                style={{ background: 'transparent', color: T.white, fontWeight: 600, fontSize: 14, padding: '14px 22px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.35)' }}>
                Ver trabajos <ExternalLink size={15} />
              </a>
            </div>
            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              {[
                { n: '+60', label: 'proyectos web entregados' },
                { n: '100%', label: 'código propio' },
              ].map(({ n, label }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 20, fontWeight: 900, color: T.white, lineHeight: 1 }}>{n}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Sello MercadoPúblico */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 12, padding: '10px 16px', marginTop: 24 }}>
              <img src="/proveedor-del-estado.png" alt="Proveedor del Estado ChileCompra" style={{ height: 32, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: T.white, letterSpacing: .3 }}>Proveedor del Estado</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>Registrados en ChileCompra · MercadoPúblico</div>
              </div>
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
              <div key={title} style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 14, padding: '22px 24px', display: 'flex', gap: 16, alignItems: 'flex-start', transition: 'box-shadow .25s, border-color .25s' }}
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

      {/* ── DIGITALIZANDO CHILE ── */}
      <section style={{ background: 'linear-gradient(135deg, #1a2680 0%, #3d5afe 55%, #6a4bf5 100%)', padding: '64px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, right: '8%', width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          <div style={{ fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 900, color: '#FFFFFF', letterSpacing: -2, lineHeight: 1, marginBottom: 12 }}>
            #DigitalizandoChile 🇨🇱
          </div>
          <p style={{ fontSize: 'clamp(15px, 2vw, 20px)', color: 'rgba(255,255,255,0.80)', fontWeight: 500, maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Llevamos negocios chilenos al mundo digital. Con tecnología real, diseño a medida y resultados concretos.
          </p>
          <a href={WA} target="_blank" rel="noopener noreferrer" onClick={trackWA}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#A8FFEA', color: '#2a3cc4', fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 40, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.25)' }} className="wa-btn">
            <WaIcon size={18} /> Digitaliza tu negocio ahora
          </a>
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section id="soluciones" style={{ background: T.panel, padding: '80px 20px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.blue, letterSpacing: 2, textTransform: 'uppercase' }}>Lo que hacemos</span>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: T.black, marginTop: 10, letterSpacing: -.5 }}>
              Tres formas de resolver tu proyecto
            </h2>
            <p style={{ fontSize: 16, color: T.gray, marginTop: 12, maxWidth: 640, margin: '12px auto 0' }}>
              No todos los proyectos necesitan lo mismo. Por eso partimos por entender qué necesita tu negocio, no por venderte un paquete cerrado.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="lws-services-grid">
            {[
              { icon: Building2, title: 'Sitio institucional', sub: 'Para mostrar quién eres y que te encuentren', items: INSTITUCIONAL },
              { icon: Users,     title: 'Plataforma con usuarios', sub: 'Para que tus clientes o equipo accedan con su cuenta', items: PLATAFORMA },
              { icon: ShoppingCart, title: 'E-commerce con integraciones', sub: 'Para vender online conectado a tus otras herramientas', items: ECOMMERCE },
            ].map(cat => (
              <div key={cat.title} style={{ background: T.light, borderRadius: 20, padding: '32px 26px', border: `1px solid ${T.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: T.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <cat.icon size={20} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: T.black }}>{cat.title}</div>
                    <div style={{ fontSize: 11.5, color: T.gray, fontWeight: 500 }}>{cat.sub}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {cat.items.map(({ icon: Icon, name, desc }) => (
                    <div key={name} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: T.blueL, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <Icon size={14} color={T.blue} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: T.black }}>{name}</div>
                        <div style={{ fontSize: 12, color: T.gray, lineHeight: 1.5 }}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
              <Link key={d.url} to={d.url} style={{ textDecoration: 'none', borderRadius: 14, overflow: 'hidden', background: T.panel, border: `1px solid ${T.border}`, boxShadow: '0 2px 12px rgba(0,0,0,.06)', transition: 'transform .3s, box-shadow .3s', display: 'block' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 16px 40px ${T.blue}20` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.06)' }}>
                {/* Browser bar */}
                <div style={{ background: '#15151f', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5F57', display: 'block' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FEBC2E', display: 'block' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28C840', display: 'block' }} />
                  <div style={{ flex: 1, background: '#22222e', borderRadius: 4, height: 16, marginLeft: 8, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
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

      {/* ── TRUST BAR ── */}
      <div style={{ background: T.blueL, borderTop: '1px solid rgba(139,122,255,0.25)', borderBottom: '1px solid rgba(139,122,255,0.25)', padding: '18px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/proveedor-del-estado.png" alt="ChileCompra MercadoPúblico" style={{ height: 40, objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: T.black }}>Proveedor del Estado</div>
              <div style={{ fontSize: 11, color: T.gray, fontWeight: 500 }}>Empresa registrada en ChileCompra · MercadoPúblico</div>
            </div>
          </div>
          <div style={{ width: 1, height: 36, background: T.border }} className="lws-trust-divider" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={18} color={T.blue} />
            <span style={{ fontSize: 13, fontWeight: 600, color: T.black }}>Empresa formal · Emitimos facturas</span>
          </div>
          <div style={{ width: 1, height: 36, background: T.border }} className="lws-trust-divider" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={18} color={T.green} />
            <span style={{ fontSize: 13, fontWeight: 600, color: T.black }}>+60 proyectos entregados en Chile</span>
          </div>
        </div>
      </div>

      {/* ── CÓMO COTIZAMOS ── */}
      <section style={{ background: T.light, padding: '80px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: T.blue, letterSpacing: 2, textTransform: 'uppercase' }}>Cómo cotizamos</span>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, color: T.black, marginTop: 10, marginBottom: 20, letterSpacing: -.5 }}>
            Cada proyecto es distinto, por eso no hay un precio único
          </h2>
          <p style={{ fontSize: 16, color: T.gray, lineHeight: 1.75, maxWidth: 640, margin: '0 auto 40px' }}>
            Un sitio institucional, una plataforma con usuarios y un e-commerce con integraciones tienen alcances muy diferentes. Por eso partimos con un diagnóstico sin costo: entendemos qué necesitas y te enviamos una propuesta clara, con alcance, plazos y valor definidos antes de empezar a construir nada.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 36, textAlign: 'left' }}>
            {[
              { icon: MessageCircle, title: 'Cuéntanos qué necesitas', desc: 'Por WhatsApp o el formulario.' },
              { icon: Search, title: 'Diagnóstico sin costo', desc: 'Revisamos tu caso y qué tiene sentido construir.' },
              { icon: CheckCircle2, title: 'Propuesta clara', desc: 'Alcance, plazos y valor, por escrito, antes de partir.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 14, padding: '20px 18px' }}>
                <Icon size={18} color={T.blue} style={{ marginBottom: 10 }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: T.black, marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 12.5, color: T.gray, lineHeight: 1.55 }}>{desc}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <Link to="/#contact"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '15px 30px', borderRadius: 12, background: T.blue, color: T.white, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              Solicitar un diagnóstico <ArrowRight size={16} />
            </Link>
            <a href={WA} target="_blank" rel="noopener noreferrer" onClick={trackWA}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 12, background: T.blueL, color: T.blue, fontWeight: 700, fontSize: 14, textDecoration: 'none' }} className="wa-btn">
              <WaIcon size={15} /> Prefiero WhatsApp
            </a>
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
                <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 14, padding: '18px 22px', flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: T.black, marginBottom: 4 }}>{step.title}</div>
                  <div style={{ fontSize: 13, color: T.gray, lineHeight: 1.65 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUÉ INCLUYE ── */}
      <section style={{ background: T.panel, padding: '80px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: T.blue, letterSpacing: 2, textTransform: 'uppercase' }}>Entregables</span>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, color: T.black, marginTop: 10, marginBottom: 8, letterSpacing: -.5 }}>
            Qué recibes en tu proyecto
          </h2>
          <p style={{ fontSize: 15, color: T.gray, marginBottom: 44 }}>
            Más allá del código: documentación, capacitación y soporte para que tu equipo pueda operarlo.
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

      {/* ── CLIENTES ── */}
      <section style={{ background: T.panel, padding: '80px 20px', overflow: 'hidden' }}>
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
            background: #fdfdff;
            border: 1px solid rgba(15,23,42,0.12);
            border-radius: 12px;
            padding: 12px 16px;
            box-shadow: 0 4px 18px rgba(0,0,0,0.2);
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
          <p style={{ fontSize: 12, color: T.muted, marginTop: 12 }}>Sin costo · Sin compromiso · Respondemos en menos de 24 horas hábiles</p>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ background: 'linear-gradient(135deg, #07070c 0%, #14142a 100%)', padding: '88px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: `${T.blue}10`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 42, marginBottom: 16 }}>🚀</div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 900, color: T.white, letterSpacing: -1, marginBottom: 16, lineHeight: 1.2 }}>
            ¿Conversamos sobre tu proyecto?
          </h2>
          <p style={{ fontSize: 17, color: '#B0B0D0', marginBottom: 36, lineHeight: 1.7 }}>
            Escríbenos ahora. Te respondemos en menos de 24 horas hábiles. Sin compromiso.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 24 }}>
            <Link to="/#contact"
              style={{ background: T.blue, color: T.white, fontWeight: 800, fontSize: 17, padding: '16px 36px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', boxShadow: `0 8px 32px ${T.blue}45` }}>
              Solicitar un diagnóstico <ArrowRight size={18} />
            </Link>
            <a href={WA} target="_blank" rel="noopener noreferrer" onClick={trackWA}
              style={{ background: 'transparent', color: T.white, fontWeight: 700, fontSize: 16, padding: '16px 28px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.3)' }} className="wa-btn">
              <Calendar size={17} /> Agendar reunión
            </a>
          </div>
          <p style={{ fontSize: 13, color: '#6060A0' }}>
            También puedes escribirnos al <strong style={{ color: '#A0A0FF' }}>+56 9 3293 0812</strong> · contacto@agenciasi.cl
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: T.light, padding: '28px 20px', borderTop: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <ThemeLogo style={{ height: 24, width: 'auto' }} />
          </Link>
          <span style={{ fontSize: 12, color: T.muted }}>© 2026 AgenciaSI · Desarrollo web y sistemas · Chile</span>
          <Link to="/demos" style={{ fontSize: 12, color: T.muted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
            Ver todas las demos <ExternalLink size={11} />
          </Link>
        </div>
      </footer>

      {/* ── FLOATING WA BUTTON ── */}
      <a href={WA} target="_blank" rel="noopener noreferrer" onClick={trackWA}
        style={{ position: 'fixed', bottom: 24, left: 24, background: '#25D366', color: T.white, width: 58, height: 58, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 24px rgba(37,211,102,.55)', zIndex: 100, textDecoration: 'none' }} className="wa-btn">
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
        .lws-link:hover { color: #8f9dff !important; }
        @media (max-width: 640px) { .lws-trust-divider { display: none !important; } }
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

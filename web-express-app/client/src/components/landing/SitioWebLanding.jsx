import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ArrowRight, Check, CheckCircle2, ChevronDown, Globe, Server, LayoutGrid, Mail,
  MessageSquareText, MapPin, Smartphone, Search, Palette, FileText, Code2,
  ShoppingCart, Store, Sparkles, ExternalLink,
} from 'lucide-react'

export const T = {
  navy:   '#0A0B2E',
  navy2:  '#141650',
  violet: '#6C2BD9',
  violetD:'#4B1D9E',
  cyan:   '#22F2D8',
  white:  '#FFFFFF',
  black:  '#0A0A12',
  gray:   '#6B7280',
  grayLt: '#9CA3AF',
  light:  '#F6F5FC',
  border: '#E7E5F5',
}

export const WA_BASE = 'https://wa.me/56932930812?text='
export const PRICE_ONLINE   = 49990
export const PRICE_WHATSAPP = 74990
export const PRICE_STORE    = 25990

// Pixel de Meta dedicado a la campaña "Tu Sitio Web Profesional" — el pixel
// general del sitio ya carga en index.html (init + PageView en la carga
// inicial). Este segundo pixel se inicializa al entrar a /sitio-web, tal
// como indica el instalador de Meta, para quedar reconocido como instalado
// de forma estándar y recibir los mismos eventos (PageView, Lead, Purchase).
export const META_PIXEL_SITIO_WEB = '1383902153896953'
let metaPixelSitioWebInited = false

export const pxPageView = () => {
  if (typeof fbq === 'undefined') return
  if (!metaPixelSitioWebInited) {
    fbq('init', META_PIXEL_SITIO_WEB)
    metaPixelSitioWebInited = true
  }
  fbq('track', 'PageView')
}
// eventId (orderId) lets Meta dedupe this browser event against the matching
// server-side Conversions API call for the same event_name + event_id.
export const px = (event, params, eventId) => {
  if (typeof fbq === 'undefined') return
  if (eventId) fbq('track', event, params, { eventID: eventId })
  else fbq('track', event, params)
}
export const ga = (event, params) => { if (typeof gtag !== 'undefined') gtag('event', event, params) }
export const fmt = n => n.toLocaleString('es-CL')

export const WaIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

const CHECKS_HERO = [
  'Dominio .CL por 1 año', 'Hosting por 1 año', 'Hasta 5 secciones',
  'WhatsApp integrado', '3 correos corporativos', 'Indexación en Google',
]

const INCLUYE = [
  { icon: Globe,            title: 'Dominio .CL',            sub: '1 año incluido' },
  { icon: Server,           title: 'Hosting',                 sub: '1 año incluido' },
  { icon: LayoutGrid,       title: 'Hasta 5 secciones',        sub: '' },
  { icon: Mail,             title: '3 correos corporativos',   sub: '' },
  { icon: MessageSquareText,title: 'Formulario de contacto',   sub: '' },
  { icon: WaIcon,           title: 'Botón WhatsApp',           sub: '' },
  { icon: MapPin,           title: 'Google Maps',              sub: '' },
  { icon: Smartphone,       title: 'Diseño responsive',        sub: '' },
  { icon: Search,           title: 'Indexación en Google',     sub: '' },
  { icon: Palette,          title: 'Diseño personalizado',      sub: '' },
  { icon: FileText,         title: 'Sitio facturable',          sub: '' },
]

const PROBLEMA_BENEFICIOS = [
  'Mayor presencia profesional.',
  'Información disponible las 24 horas.',
  'Un espacio propio para mostrar productos o servicios.',
  'Mayor confianza.',
  'Posibilidad de aparecer en Google.',
  'Contacto directo mediante WhatsApp.',
  'Ubicación mediante Google Maps.',
]

const PASOS = [
  { n: '1', t: 'Completa el formulario', d: 'Cuéntanos sobre tu negocio, qué servicios ofreces, tus datos de contacto y qué quieres mostrar.' },
  { n: '2', t: 'Nosotros diseñamos',     d: 'Nuestro equipo organiza tu información y desarrolla una página web adaptada a tu negocio.' },
  { n: '3', t: 'Revisamos y publicamos', d: 'Revisamos el proyecto contigo y dejamos tu sitio publicado en internet.' },
]

const FAQS = [
  { q: '¿El precio es realmente $49.990 + IVA?', a: 'Sí. Ese valor corresponde a la contratación realizada directamente mediante nuestra página web completando el formulario del proyecto.' },
  { q: '¿Por qué por WhatsApp cuesta $74.990 + IVA?', a: 'Porque esa modalidad incluye atención personalizada durante el proceso de contratación. El sitio web final incluye las mismas características.' },
  { q: '¿La página de $49.990 es diferente a la de $74.990?', a: 'No. El sitio web incluye las mismas características. La diferencia corresponde únicamente a la modalidad de contratación.' },
  { q: '¿El dominio está incluido?', a: 'Sí. Incluye un dominio .CL durante el primer año.' },
  { q: '¿El hosting está incluido?', a: 'Sí. El hosting está incluido durante el primer año.' },
  { q: '¿Cuántas secciones puede tener mi sitio?', a: 'El servicio incluye hasta 5 secciones.' },
  { q: '¿Funcionará correctamente en celulares?', a: 'Sí. El sitio será diseñado para visualizarse correctamente en celulares, tablets y computadores.' },
  { q: '¿Puedo conectar mi WhatsApp?', a: 'Sí. Incluye un botón directo a WhatsApp.' },
  { q: '¿Mi página aparecerá en Google?', a: 'El sitio será configurado e indexado para que Google pueda reconocerlo. El posicionamiento en resultados dependerá posteriormente de múltiples factores y del trabajo SEO realizado.' },
  { q: '¿Puedo utilizar mi propio dominio?', a: 'Sí. Si ya tienes dominio puedes indicarlo durante la contratación.' },
  { q: '¿Necesito saber programación?', a: 'No. Nuestro equipo realiza la implementación.' },
  { q: '¿Puedo vender productos?', a: 'Sí. Puedes agregar el módulo de tienda online por $25.990 + IVA adicionales.' },
  { q: '¿Qué incluye la tienda online?', a: 'Incluye carro de compras, catálogo, carga inicial de hasta 25 productos e integración con Mercado Pago.' },
  { q: '¿Qué pasa si tengo más de 25 productos?', a: 'El adicional incluye la carga inicial de hasta 25 productos. Si necesitas cargar una cantidad mayor, podemos cotizar la carga adicional.' },
  { q: '¿Mercado Pago está incluido?', a: 'Sí. La integración y configuración inicial de Mercado Pago está incluida en el adicional de tienda online. El comercio debe disponer de su propia cuenta de Mercado Pago.' },
]

function Section({ children, style }) {
  return <section style={{ padding: '80px 20px', ...style }}>{children}</section>
}

export default function SitioWebLanding() {
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => { pxPageView() }, [])

  const WA_ONLINE   = `${WA_BASE}${encodeURIComponent('Hola, quiero crear mi sitio web. Vi la oferta de $49.990 + IVA.')}`
  const WA_ASISTIDA = `${WA_BASE}${encodeURIComponent('Hola, quiero contratar mi sitio web por WhatsApp ($74.990 + IVA).')}`
  const WA_TIENDA   = `${WA_BASE}${encodeURIComponent('Hola, me interesa mi sitio web con tienda online (+$25.990 + IVA).')}`

  const trackLead = (name, wa = false) => {
    px('Lead', { content_name: name }); ga('generate_lead', { item_name: name })
    if (wa) { px('Contact'); ga('contact', { method: 'whatsapp' }) }
  }

  return (
    <div style={{ fontFamily: "'Poppins', system-ui, sans-serif", background: T.white, color: T.black, overflowX: 'hidden' }}>
      <Helmet>
        <title>Tu Sitio Web Profesional por $49.990 + IVA | AgenciaSI</title>
        <meta name="description" content="Página web profesional, diseñada para tu negocio: dominio .CL y hosting por 1 año, hasta 5 secciones, WhatsApp, Google Maps e indexación en Google. Contrata online desde $49.990 + IVA." />
        <link rel="canonical" href="https://agenciasi.cl/sitio-web" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Tu Sitio Web Profesional por $49.990 + IVA | AgenciaSI" />
        <meta property="og:description" content="Dominio + hosting por 1 año, hasta 5 secciones, WhatsApp y Google Maps incluidos. Contrata tu página web online o por WhatsApp." />
        <meta property="og:url" content="https://agenciasi.cl/sitio-web" />
      </Helmet>

      <style>{`
        @keyframes swl-pulse { 0%,100%{opacity:1} 50%{opacity:.55} }
        .swl-card { transition: transform .25s ease, box-shadow .25s ease; }
        .swl-card:hover { transform: translateY(-4px); }
        .swl-faq-btn { cursor:pointer; }
        @media(max-width:900px) { .swl-hero-grid{grid-template-columns:1fr!important;text-align:center;} .swl-two-cards{grid-template-columns:1fr!important;} }
        @media(max-width:640px) { .swl-incluye-grid{grid-template-columns:repeat(2,1fr)!important;} .swl-checks{grid-template-columns:1fr 1fr!important;} }
        .swl-sticky { display:none; }
        @media(max-width:760px) {
          .swl-sticky { display:flex!important; }
          body { padding-bottom: 68px; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,11,46,.92)', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ background: T.cyan, borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={15} color={T.navy} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 15, color: T.white }}>AgenciaSI</span>
          </Link>
          <a href={WA_ONLINE} target="_blank" rel="noopener noreferrer" onClick={() => trackLead('Nav CTA', true)}
            style={{ background: T.cyan, color: T.navy, fontWeight: 800, fontSize: 13, padding: '9px 18px', borderRadius: 30, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            $49.990 + IVA <ArrowRight size={13} />
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: `linear-gradient(150deg, ${T.navy} 0%, ${T.navy2} 45%, ${T.violetD} 100%)`, padding: '64px 20px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -160, right: -140, width: 480, height: 480, borderRadius: '50%', background: `${T.violet}35`, filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -120, left: -100, width: 360, height: 360, borderRadius: '50%', background: `${T.cyan}18`, filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 22 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: T.white, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', padding: '6px 14px', borderRadius: 30 }}>Para Pymes y Profesionales</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: T.navy, background: T.cyan, padding: '6px 14px', borderRadius: 30 }}>+60 proyectos web entregados</span>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5.5vw, 3.4rem)', fontWeight: 800, color: T.white, lineHeight: 1.12, marginBottom: 18, letterSpacing: -.5 }}>
            Tu Sitio Web Profesional por{' '}
            <span style={{ color: T.cyan }}>$49.990 + IVA</span>
          </h1>

          <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: 'rgba(255,255,255,.78)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 28px' }}>
            Obtén una página web profesional, diseñada para tu negocio y lista para comenzar a recibir clientes.
          </p>

          <div className="swl-checks" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,auto)', gap: '10px 20px', justifyContent: 'center', marginBottom: 34 }}>
            {CHECKS_HERO.map(c => (
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'rgba(255,255,255,.85)', fontWeight: 500 }}>
                <Check size={15} color={T.cyan} style={{ flexShrink: 0 }} /> {c}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 22 }}>
            <Link to="/sitio-web/formulario" onClick={() => trackLead('Hero CTA Online')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: T.cyan, color: T.navy, fontWeight: 800, fontSize: 17, padding: '18px 38px', borderRadius: 14, textDecoration: 'none', boxShadow: `0 12px 40px ${T.cyan}50` }}>
              Crear mi sitio por $49.990 + IVA <ArrowRight size={18} />
            </Link>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,.55)' }}>Precio especial contratando directamente desde nuestra web.</span>
          </div>

          <a href={WA_ASISTIDA} target="_blank" rel="noopener noreferrer" onClick={() => trackLead('Hero CTA WhatsApp', true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,.75)', fontSize: 13, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,.25)', padding: '11px 20px', borderRadius: 30 }}>
            <WaIcon size={15} /> Prefiero atención por WhatsApp — $74.990 + IVA
          </a>
        </div>
      </section>

      {/* ELIGE CÓMO CONTRATAR */}
      <Section style={{ background: T.light }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.7rem,3vw,2.4rem)', fontWeight: 800, color: T.navy, marginBottom: 12 }}>
              El mismo sitio web. Tú eliges cómo contratar.
            </h2>
            <p style={{ fontSize: 15, color: T.gray, maxWidth: 560, margin: '0 auto' }}>
              Obtén el mejor precio realizando el proceso directamente online o contrata con atención personalizada por WhatsApp.
            </p>
          </div>

          <div className="swl-two-cards" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 20, alignItems: 'stretch' }}>
            {/* Tarjeta destacada */}
            <div className="swl-card" style={{ background: T.navy, borderRadius: 24, padding: '36px 32px', position: 'relative', border: `2px solid ${T.cyan}` }}>
              <span style={{ position: 'absolute', top: -13, left: 28, background: T.cyan, color: T.navy, fontSize: 11, fontWeight: 800, padding: '5px 14px', borderRadius: 20 }}>MEJOR PRECIO</span>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.6)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Compra online</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 800, color: T.cyan, marginBottom: 16 }}>$49.990 <span style={{ fontSize: 18, color: 'rgba(255,255,255,.55)', fontWeight: 500 }}>+ IVA</span></div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.75)', lineHeight: 1.7, marginBottom: 22 }}>
                Completa nuestro formulario guiado con la información de tu negocio y nosotros nos encargamos del resto.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {['Precio especial online', 'Proceso simple y guiado', 'Puedes adjuntar logo y fotografías', 'No necesitas conocimientos técnicos', 'Revisas toda la información antes de contratar'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'rgba(255,255,255,.85)' }}>
                    <Check size={15} color={T.cyan} style={{ flexShrink: 0, marginTop: 2 }} /> {t}
                  </div>
                ))}
              </div>
              <Link to="/sitio-web/formulario" onClick={() => trackLead('Card CTA Online')}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, background: T.cyan, color: T.navy, fontWeight: 800, fontSize: 15, padding: '15px', borderRadius: 12, textDecoration: 'none' }}>
                Comenzar mi página web <ArrowRight size={16} />
              </Link>
            </div>

            {/* Segunda tarjeta */}
            <div className="swl-card" style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 24, padding: '36px 32px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.gray, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Atención por WhatsApp</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 800, color: T.navy, marginBottom: 16 }}>$74.990 <span style={{ fontSize: 16, color: T.gray, fontWeight: 500 }}>+ IVA</span></div>
              <p style={{ fontSize: 14, color: T.gray, lineHeight: 1.7, marginBottom: 24, flex: 1 }}>
                ¿Prefieres conversar primero? Nuestro equipo puede ayudarte a resolver tus dudas y recopilar la información necesaria.
              </p>
              <a href={WA_ASISTIDA} target="_blank" rel="noopener noreferrer" onClick={() => trackLead('Card CTA WhatsApp', true)}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, background: T.navy, color: T.white, fontWeight: 700, fontSize: 15, padding: '15px', borderRadius: 12, textDecoration: 'none' }}>
                <WaIcon size={16} /> Hablar por WhatsApp
              </a>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 13, color: T.gray, marginTop: 26, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Ambas modalidades incluyen exactamente las mismas características. El valor cambia únicamente según la forma de contratación.
          </p>
        </div>
      </Section>

      {/* TODO LO QUE INCLUYE */}
      <Section style={{ background: T.white }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.7rem,3vw,2.4rem)', fontWeight: 800, color: T.navy }}>
              Todo lo que incluye tu sitio web
            </h2>
          </div>
          <div className="swl-incluye-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {INCLUYE.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="swl-card" style={{ border: `1px solid ${T.border}`, borderRadius: 16, padding: '22px 18px', textAlign: 'center' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${T.violet}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Icon size={20} color={T.violet} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, color: T.navy }}>{title}</div>
                {sub && <div style={{ fontSize: 11, color: '#0FA895', fontWeight: 600, marginTop: 3 }}>{sub}</div>}
              </div>
            ))}
            <div className="swl-card" style={{ background: T.navy, borderRadius: 16, padding: '22px 18px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: T.white }}>Compatible con</div>
              <div style={{ fontSize: 12, color: T.cyan, fontWeight: 700, marginTop: 3 }}>Móviles · Tablets · PC</div>
            </div>
          </div>
        </div>
      </Section>

      {/* PROBLEMA / SOLUCIÓN */}
      <Section style={{ background: T.light }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem,3vw,2.3rem)', fontWeight: 800, color: T.navy, marginBottom: 20, lineHeight: 1.2 }}>
            Tu negocio merece algo mejor que depender solamente de Instagram
          </h2>
          <p style={{ fontSize: 15, color: T.gray, lineHeight: 1.8, maxWidth: 640, margin: '0 auto 36px' }}>
            Las redes sociales son importantes, pero tu negocio también necesita un espacio propio donde los clientes puedan conocer tus servicios, encontrarte en Google y contactarte directamente.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14, textAlign: 'left', maxWidth: 780, margin: '0 auto' }}>
            {PROBLEMA_BENEFICIOS.map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: '14px 16px' }}>
                <CheckCircle2 size={16} color={T.violet} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 13, color: T.navy, fontWeight: 500 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CÓMO FUNCIONA */}
      <Section style={{ background: T.white }}>
        <div style={{ maxWidth: 940, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.7rem,3vw,2.4rem)', fontWeight: 800, color: T.navy, marginBottom: 48 }}>
            Tener tu página web es muy fácil
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 28, marginBottom: 44 }}>
            {PASOS.map(p => (
              <div key={p.n} style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: T.navy, color: T.cyan, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, margin: '0 auto 16px' }}>{p.n}</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: T.navy, marginBottom: 8 }}>{p.t}</div>
                <div style={{ fontSize: 13, color: T.gray, lineHeight: 1.7 }}>{p.d}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/sitio-web/formulario" onClick={() => trackLead('Como Funciona CTA')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.cyan, color: T.navy, fontWeight: 800, fontSize: 15, padding: '15px 30px', borderRadius: 12, textDecoration: 'none' }}>
              Quiero comenzar por $49.990 + IVA <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </Section>

      {/* UPSELL TIENDA ONLINE */}
      <Section style={{ background: `linear-gradient(135deg, ${T.violetD} 0%, ${T.violet} 100%)` }}>
        <div style={{ maxWidth: 880, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }} className="swl-two-cards">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,.15)', padding: '6px 14px', borderRadius: 30, marginBottom: 18 }}>
              <ShoppingCart size={13} color={T.cyan} />
              <span style={{ fontSize: 11, fontWeight: 700, color: T.white, letterSpacing: 1 }}>OPCIONAL</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem,3vw,2.3rem)', fontWeight: 800, color: T.white, lineHeight: 1.2, marginBottom: 14 }}>
              ¿También quieres vender por internet?
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.82)', lineHeight: 1.7, marginBottom: 22 }}>
              Convierte tu página web en una tienda online por solo <strong style={{ color: T.cyan }}>$25.990 + IVA</strong> adicionales. Perfecto para negocios que quieren comenzar a vender productos directamente desde su página.
            </p>
            <a href={WA_TIENDA} target="_blank" rel="noopener noreferrer" onClick={() => trackLead('Upsell Tienda CTA', true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.cyan, color: T.navy, fontWeight: 800, fontSize: 14, padding: '13px 24px', borderRadius: 12, textDecoration: 'none' }}>
              Agregar tienda online <ArrowRight size={15} />
            </a>
          </div>
          <div style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 20, padding: '30px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Store size={20} color={T.cyan} />
              <span style={{ fontWeight: 800, fontSize: 15, color: T.white }}>Tienda Online</span>
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 800, color: T.cyan, marginBottom: 16 }}>+$25.990 <span style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', fontWeight: 500 }}>+ IVA</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {['Carro de compras', 'Carga inicial de hasta 25 productos', 'Catálogo online', 'Mercado Pago integrado', 'Proceso de compra', 'Adaptado a celulares'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,.85)' }}>
                  <Check size={14} color={T.cyan} style={{ flexShrink: 0 }} /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* CONFIANZA */}
      <Section style={{ background: T.white, textAlign: 'center' }}>
        <Sparkles size={30} color={T.violet} style={{ marginBottom: 14 }} />
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, color: T.navy, marginBottom: 10 }}>
          +60 proyectos web entregados
        </div>
        <p style={{ fontSize: 15, color: T.gray, maxWidth: 480, margin: '0 auto' }}>
          Trabajamos con Pymes, emprendedores y profesionales de diferentes rubros.
        </p>
      </Section>

      {/* FAQ */}
      <Section style={{ background: T.light }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, color: T.navy, marginBottom: 36 }}>
            Preguntas frecuentes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQS.map((f, i) => (
              <div key={f.q} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden' }}>
                <div className="swl-faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', fontWeight: 700, fontSize: 14, color: T.navy }}>
                  {f.q}
                  <ChevronDown size={16} color={T.gray} style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0, marginLeft: 12 }} />
                </div>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 18px', fontSize: 13, color: T.gray, lineHeight: 1.7 }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA FINAL */}
      <Section style={{ background: `linear-gradient(150deg, ${T.navy} 0%, ${T.violetD} 100%)`, textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: T.white, lineHeight: 1.2, marginBottom: 14 }}>
            Tu negocio puede tener su propia página web
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.75)', marginBottom: 26 }}>
            Comienza hoy completando nuestro formulario y obtén el precio especial de contratación online.
          </p>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 800, color: T.cyan, marginBottom: 6 }}>$49.990 <span style={{ fontSize: 18, color: 'rgba(255,255,255,.55)', fontWeight: 500 }}>+ IVA</span></div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', marginBottom: 30 }}>Dominio + Hosting por 1 año incluidos</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 18 }}>
            <Link to="/sitio-web/formulario" onClick={() => trackLead('CTA Final Online')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.cyan, color: T.navy, fontWeight: 800, fontSize: 15, padding: '16px 30px', borderRadius: 12, textDecoration: 'none' }}>
              Crear mi sitio web <ArrowRight size={16} />
            </Link>
            <a href={WA_ASISTIDA} target="_blank" rel="noopener noreferrer" onClick={() => trackLead('CTA Final WhatsApp', true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: T.white, fontWeight: 700, fontSize: 14, padding: '16px 24px', borderRadius: 12, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.3)' }}>
              Prefiero contratar por WhatsApp — $74.990 + IVA
            </a>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>¿Quieres vender online? Agrega carro de compras + Mercado Pago por $25.990 + IVA.</p>
        </div>
      </Section>

      {/* FOOTER */}
      <footer style={{ background: T.black, padding: '22px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>© 2026 AgenciaSI · Diseño y desarrollo integral</span>
          <Link to="/" style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
            Inicio <ExternalLink size={11} />
          </Link>
        </div>
      </footer>

      {/* STICKY MOBILE BAR */}
      <div className="swl-sticky" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 90, background: T.navy, borderTop: `1px solid ${T.violet}50`, padding: '10px 14px', alignItems: 'center', justifyContent: 'space-between', gap: 10, boxShadow: '0 -4px 20px rgba(0,0,0,.3)' }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: T.cyan, flexShrink: 0 }}>$49.990 + IVA</span>
        <Link to="/sitio-web/formulario" onClick={() => trackLead('Sticky Bar CTA')}
          style={{ flex: 1, textAlign: 'center', background: T.cyan, color: T.navy, fontWeight: 800, fontSize: 13, padding: '10px', borderRadius: 10, textDecoration: 'none' }}>
          Crear mi web
        </Link>
        <a href={WA_ASISTIDA} target="_blank" rel="noopener noreferrer" onClick={() => trackLead('Sticky Bar WhatsApp', true)}
          style={{ width: 38, height: 38, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <WaIcon size={17} />
        </a>
      </div>
    </div>
  )
}

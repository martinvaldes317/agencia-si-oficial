import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ArrowRight, Code2, Globe, ShoppingCart, BrainCircuit,
  Zap, Shield, Search, CheckCircle2, BarChart3, TrendingUp,
  MapPin, Settings, Calendar, Building2, Star, ExternalLink
} from 'lucide-react'

const T = {
  blue:  '#2D2BB5',
  black: '#0A0A0A',
  gray:  '#5C5C6E',
  light: '#F7F7FB',
  white: '#FFFFFF',
  border:'#E8E8F0',
}

const WA_BASE = 'https://wa.me/56932930812?text='

const px = (event, params) => { if (typeof fbq !== 'undefined') fbq('track', event, params) }
const ga = (event, params) => { if (typeof gtag !== 'undefined') gtag('event', event, params) }

const WaIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

const LOGOS = [
  'astro-entretenimientos.svg','capitol-group.svg','espacio-cea.svg','guardias-cl.svg',
  'premiumlav.svg','calces.svg','vision-eventos.svg','solar-espectaculo.svg',
  'cft-araucania.svg','zona-plaga.svg','naturalpetworld.webp','hiiaka-dental.webp',
  'valoramos.webp','pili-orfebre.webp','centro-kinesico.webp','pacifico-salud.webp',
  'daza-maquinarias.webp','espacio-blue.webp','entrelluvias-sabores.webp','schopchile.webp',
  'ambulancias-pacifico.webp','asysam.webp','consultora-lawen.webp','d-tolentino.webp',
  'capitol-training.webp','limari-travel.webp','barras-pole-dance.webp','now-pos.png','lbepv.png',
]

const SERVICES = [
  { icon: Globe,        title: 'Sitios Web Profesionales',  desc: `Diseño único a medida para negocios de ${'{city}'}. Sin templates, código propio.` },
  { icon: ShoppingCart, title: 'Tiendas Online',            desc: 'E-commerce con MercadoPago, catálogo, carrito y despacho integrado.' },
  { icon: Settings,     title: 'Sistemas a Medida',         desc: 'CRM, paneles administrativos, portales de clientes y automatizaciones.' },
  { icon: BrainCircuit, title: 'Integración con IA',        desc: 'Chatbots, flujos automáticos y procesos inteligentes para tu negocio.' },
  { icon: Search,       title: 'SEO y Posicionamiento',     desc: `Aparecer primero en Google cuando buscan tu rubro en ${'{city}'}.` },
  { icon: Zap,          title: 'Web Express 5 Días',        desc: 'Sitio web profesional listo en 5 días hábiles. Dominio y hosting incluidos.' },
]

const WHY = [
  { icon: Code2,       title: 'Desarrollo a medida',   desc: 'Cada proyecto es único. Sin plantillas compradas ni soluciones genéricas.' },
  { icon: Zap,         title: 'Entrega rápida y real',  desc: 'Web Express en 5 días hábiles. Plazos claros y cumplidos siempre.' },
  { icon: TrendingUp,  title: 'Foco en conversión',    desc: 'Cada sitio está diseñado para generar clientes y ventas, no solo verse bien.' },
  { icon: Shield,      title: 'Empresa formal',         desc: 'Emitimos facturas. Registrados en ChileCompra · Proveedor del Estado.' },
]

export default function HomeSEOLocal({ city }) {
  const WA = `${WA_BASE}${encodeURIComponent(`Hola, vi su página de agencia digital en ${city.name} y me interesa cotizar un proyecto para mi negocio.`)}`
  const WA_FAST = `${WA_BASE}${encodeURIComponent(`Hola, me interesa cotizar un sitio web para mi negocio en ${city.name}.`)}`

  useEffect(() => {
    px('ViewContent', { content_name: `Home SEO ${city.name}` })
    ga('view_item', { item_name: `Home SEO ${city.name}`, item_category: 'agencia_local' })
  }, [city.name])

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'AgenciaSI',
    url: `https://agenciasi.cl/agencia/${city.slug}`,
    logo: 'https://agenciasi.cl/favicon.png',
    description: `Agencia digital en ${city.name}. Desarrollo web, sistemas a medida, e-commerce e integración con IA para empresas de ${city.name} y ${city.region}.`,
    telephone: '+56932930812',
    email: 'contacto@agenciasi.cl',
    areaServed: [
      { '@type': 'City', name: city.name },
      { '@type': 'AdministrativeArea', name: city.region },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: city.region,
      addressCountry: 'CL',
    },
  }

  return (
    <div style={{ fontFamily: "'Poppins', system-ui, sans-serif", background: T.white, color: T.black, overflowX: 'hidden' }}>
      <Helmet>
        <title>Agencia Digital en {city.name} | AgenciaSI Chile</title>
        <meta name="description" content={`AgenciaSI — agencia digital en ${city.name}. Desarrollo web, e-commerce, sistemas a medida e integración con IA para pymes y empresas de ${city.name}. Cotiza gratis.`} />
        <link rel="canonical" href={`https://agenciasi.cl/agencia/${city.slug}`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`Agencia Digital en ${city.name} | AgenciaSI`} />
        <meta property="og:description" content={`Desarrollo web, e-commerce y sistemas a medida para negocios de ${city.name}. Código propio, sin templates.`} />
        <meta property="og:url" content={`https://agenciasi.cl/agencia/${city.slug}`} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: T.white, borderBottom: `1px solid ${T.border}`, boxShadow: '0 1px 8px rgba(0,0,0,.05)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: T.blue, borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: T.black, letterSpacing: -.3, fontFamily: 'Poppins, sans-serif' }}>AgenciaSI</div>
              <div style={{ fontSize: 9, color: T.gray, fontFamily: 'Poppins, sans-serif', marginTop: -2 }}>Diseño y desarrollo integral.</div>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to="/" style={{ fontSize: 13, fontWeight: 600, color: T.gray, textDecoration: 'none', padding: '6px 14px' }}>Inicio</Link>
            <Link to="/web" style={{ fontSize: 13, fontWeight: 600, color: T.gray, textDecoration: 'none', padding: '6px 14px' }}>Precios</Link>
            <a href={WA_FAST} target="_blank" rel="noopener noreferrer" onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              style={{ background: T.blue, color: T.white, fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 30, display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
              Cotización gratuita <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: T.white, padding: '100px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -160, right: -160, width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${T.blue}12, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="hsl-hero-grid">
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
              {['Desarrollo Web', 'Sistemas a Medida', 'E-commerce', 'IA'].map(tag => (
                <span key={tag} style={{ background: T.blue + '18', color: T.blue, fontSize: 11, fontWeight: 600, letterSpacing: .4, padding: '5px 14px', borderRadius: 30 }}>{tag}</span>
              ))}
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', lineHeight: 1.05, color: T.black, marginBottom: 20, letterSpacing: -.5 }}>
              Agencia Digital en{' '}
              <em style={{ fontWeight: 400, color: T.blue }}>{city.name}.</em>
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: T.gray, marginBottom: 36, maxWidth: 520 }}>
              Construimos sitios web, plataformas y sistemas a medida para {city.context}. Sin templates, sin humo — código propio y resultados medibles.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 40 }}>
              <a href={WA_FAST} target="_blank" rel="noopener noreferrer" onClick={() => { px('Lead', { content_name: `Home SEO CTA ${city.name}` }); ga('generate_lead', { item_name: `Home SEO CTA ${city.name}` }) }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.blue, color: T.white, fontWeight: 700, fontSize: 14, padding: '14px 28px', borderRadius: 30, textDecoration: 'none' }}>
                Cotización gratuita <ArrowRight size={16} />
              </a>
              <Link to="/demos"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `2px solid ${T.blue}`, color: T.blue, fontWeight: 700, fontSize: 14, padding: '14px 24px', borderRadius: 30, textDecoration: 'none' }}>
                Ver demos <ExternalLink size={14} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              {[
                { icon: CheckCircle2, text: 'Código propio' },
                { icon: Shield,       text: 'Sin templates' },
                { icon: BarChart3,    text: 'Resultados medibles' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: T.gray }}>
                  <Icon size={14} color={T.blue} /> {text}
                </div>
              ))}
            </div>
          </div>

          {/* Stats card */}
          <div className="hsl-card-hide" style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,.10)', border: `1px solid ${T.border}` }}>
            <div style={{ background: T.blue, padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: T.white, fontWeight: 700, fontSize: 14 }}>AgenciaSI · {city.name}</span>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: T.white, fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20 }}>En vivo</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: T.border }}>
              {[
                { label: 'Proyectos entregados', value: '50+',    sub: 'sitios, sistemas y apps', hi: true },
                { label: 'Tiempo de entrega',    value: '5 días', sub: 'Web Express promedio',    hi: true },
                { label: 'Clientes activos',     value: '24+',    sub: 'en Chile y LATAM',        hi: false },
                { label: 'Tecnologías',          value: '12+',    sub: 'React, Node, IA y más',   hi: false },
              ].map(s => (
                <div key={s.label} style={{ background: T.white, padding: '24px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.gray, textTransform: 'uppercase', letterSpacing: .8, marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: s.hi ? T.blue : T.black, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ background: T.white, padding: '16px 28px', display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 12, color: T.gray }}>contacto@agenciasi.cl</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: T.blue }}>+56 9 3293 0812</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, background: T.light, padding: '28px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, textAlign: 'center' }} className="hsl-stats-grid">
          {[
            { value: '50+',    label: 'Proyectos entregados' },
            { value: '5 días', label: 'Entrega Web Express' },
            { value: '24+',    label: 'Clientes activos' },
            { value: '100%',   label: 'Código propio' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: T.blue, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: T.gray }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* #DigitalizandoChile + Proveedor Estado */}
      <section style={{ background: 'linear-gradient(135deg, #1212CC 0%, #2D2BB5 50%, #1A4FC4 100%)', padding: '60px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
          <div style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900, color: T.white, letterSpacing: -2, lineHeight: 1, marginBottom: 12 }}>
            #DigitalizandoChile 🇨🇱
          </div>
          <p style={{ fontSize: 'clamp(14px, 1.8vw, 17px)', color: 'rgba(255,255,255,0.80)', maxWidth: 500, margin: '0 auto 24px', lineHeight: 1.65 }}>
            Llevamos negocios de {city.name} al mundo digital. Con tecnología real, diseño a medida y resultados concretos.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 12, padding: '10px 18px', marginBottom: 24 }}>
            <img src="/proveedor-del-estado.png" alt="ChileCompra MercadoPúblico" style={{ height: 28, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: T.white }}>Proveedor del Estado</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)' }}>Registrados en ChileCompra · MercadoPúblico</div>
            </div>
          </div>
          <br />
          <a href={WA_FAST} target="_blank" rel="noopener noreferrer" onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#A8FFEA', color: '#1212CC', fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 40, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.25)' }}>
            <WaIcon size={17} /> Digitaliza tu negocio en {city.name}
          </a>
        </div>
      </section>

      {/* POR QUÉ AgenciaSI */}
      <section style={{ padding: '88px 24px', background: T.white }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="hsl-hero-grid">
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: T.blue, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 20, height: 2, background: T.blue, display: 'inline-block', borderRadius: 2 }} />
              Por qué AgenciaSI en {city.name}
            </p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 700, color: T.black, lineHeight: 1.1, marginBottom: 20 }}>
              Tu negocio merece más que un template.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: T.gray, marginBottom: 32 }}>
              La mayoría de agencias en {city.name} te vende un WordPress con un theme comprado. Nosotros construimos <strong style={{ color: T.black }}>desde cero</strong> — código limpio, arquitectura pensada para tu negocio y resultados medibles.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {WHY.map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{ display: 'flex', gap: 16, padding: '14px 16px', borderRadius: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: T.blue + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color={T.blue} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: T.black, marginBottom: 3 }}>{title}</div>
                    <div style={{ fontSize: 13, color: T.gray, lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: T.blue, borderRadius: 24, padding: '40px 36px' }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 16 }}>Metodología SI</p>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, color: T.white, lineHeight: 1.15, marginBottom: 28 }}>
              Código propio. <em style={{ fontWeight: 400 }}>Resultados reales.</em>
            </h3>
            {[
              { n: '01', t: 'Diagnóstico gratuito',   d: 'Entendemos tu negocio y qué necesita para crecer online.' },
              { n: '02', t: 'Diseño a medida',         d: 'Wireframes y diseño UI orientado a conversión. Tú apruebas.' },
              { n: '03', t: 'Desarrollo propio',       d: 'React, Node.js e integraciones con IA. Sin plantillas.' },
              { n: '04', t: 'Lanzamiento + soporte',   d: 'Deploy, pruebas y soporte post-lanzamiento incluido.' },
            ].map(step => (
              <div key={step.n} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.2)', lineHeight: 1, flexShrink: 0 }}>{step.n}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: T.white, marginBottom: 3 }}>{step.t}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.55 }}>{step.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section style={{ background: T.light, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: T.blue, marginBottom: 12 }}>Qué hacemos</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, color: T.black, lineHeight: 1.1 }}>
              Servicios digitales para {city.name}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {SERVICES.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, padding: '28px 24px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: T.blue + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={20} color={T.blue} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: T.black, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: T.gray, lineHeight: 1.65 }}>{desc.replace('{city}', city.name)}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/web#precios"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.blue, color: T.white, fontWeight: 700, fontSize: 14, padding: '12px 28px', borderRadius: 30, textDecoration: 'none' }}>
              Ver precios <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CLIENTES */}
      <section style={{ background: T.white, padding: '72px 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', padding: '0 24px', marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: T.blue, marginBottom: 12 }}>Nuestros clientes</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 700, color: T.black, marginBottom: 10 }}>
            Empresas que ya confían en nosotros.
          </h2>
          <p style={{ fontSize: 14, color: T.gray, maxWidth: 440, margin: '0 auto' }}>
            Desde {city.name} hasta todo Chile — diseños a medida para cada negocio, sin usar plantillas.
          </p>
        </div>
        <style>{`
          @keyframes hsl-marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
          .hsl-marquee-track { display:flex; width:max-content; animation:hsl-marquee 32s linear infinite; }
          .hsl-marquee-track:hover { animation-play-state:paused; }
          .hsl-logo { flex-shrink:0; width:148px; height:80px; margin:0 10px; display:flex; align-items:center; justify-content:center; background:#F4F4F8; border:1px solid #E0E0EA; border-radius:12px; padding:12px 16px; filter:grayscale(100%) opacity(0.6); transition:filter .3s; }
          .hsl-logo:hover { filter:grayscale(0%) opacity(1); }
          .hsl-logo img { max-width:108px; max-height:50px; object-fit:contain; }
          @media(max-width:900px) { .hsl-hero-grid{grid-template-columns:1fr!important;} .hsl-card-hide{display:none!important;} }
          @media(max-width:640px) { .hsl-stats-grid{grid-template-columns:1fr 1fr!important;} }
        `}</style>
        <div style={{ overflow: 'hidden' }}>
          <div className="hsl-marquee-track">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <div key={i} className="hsl-logo">
                <img src={`/clientes/${logo}`} alt="cliente agenciasi" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ background: T.black, padding: '88px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: `${T.blue}12`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 580, margin: '0 auto' }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>🚀</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, color: T.white, lineHeight: 1.15, marginBottom: 16 }}>
            ¿Listo para llevar tu negocio en {city.name} al siguiente nivel?
          </h2>
          <p style={{ fontSize: 16, color: '#B0B0D0', marginBottom: 36, lineHeight: 1.7 }}>
            Escríbenos ahora. Te respondemos en menos de 2 horas en horario laboral.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
            <a href={WA} target="_blank" rel="noopener noreferrer" onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              style={{ background: '#25D366', color: T.white, fontWeight: 800, fontSize: 16, padding: '16px 32px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', boxShadow: '0 8px 32px rgba(37,211,102,.4)' }}>
              <WaIcon size={20} /> Cotizar en {city.name}
            </a>
            <Link to="/web"
              style={{ background: 'transparent', color: T.white, fontWeight: 700, fontSize: 15, padding: '16px 24px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.3)' }}>
              Ver precios →
            </Link>
          </div>
          <p style={{ fontSize: 12, color: '#6060A0' }}>+56 9 3293 0812 · contacto@agenciasi.cl</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#050508', padding: '24px', borderTop: '1px solid #1A1A2E' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ background: T.blue, borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={13} color="#fff" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: T.white }}>AgenciaSI</span>
          </Link>
          <span style={{ fontSize: 12, color: '#404060' }}>© 2026 AgenciaSI · Agencia digital en {city.name} · Chile</span>
          <Link to="/web" style={{ fontSize: 12, color: '#404060', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
            Ver precios <ExternalLink size={11} />
          </Link>
        </div>
      </footer>

      {/* FLOATING WA */}
      <a href={WA} target="_blank" rel="noopener noreferrer" onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
        style={{ position: 'fixed', bottom: 24, right: 24, background: '#25D366', color: T.white, width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 24px rgba(37,211,102,.55)', zIndex: 100, textDecoration: 'none' }}>
        <WaIcon size={26} />
      </a>
    </div>
  )
}

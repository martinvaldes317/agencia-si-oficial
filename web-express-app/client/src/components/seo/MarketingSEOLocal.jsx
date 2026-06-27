import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ArrowRight, Code2, TrendingUp, BarChart3, Search,
  Megaphone, Target, Globe, Zap, Shield, CheckCircle2,
  ExternalLink, Calendar, Star, Users, BrainCircuit
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
  {
    icon: Target,
    title: 'Publicidad en Meta Ads',
    desc: 'Campañas en Facebook e Instagram dirigidas exactamente a tu público objetivo en {city}. Máximo alcance, mínimo gasto.',
  },
  {
    icon: Search,
    title: 'SEO y Posicionamiento Google',
    desc: 'Aparecer primero cuando buscan tu rubro en {city}. Tráfico orgánico que no depende de pauta.',
  },
  {
    icon: Globe,
    title: 'Sitio Web Profesional',
    desc: 'Tu plataforma de conversión: diseño único, dominio gratis, WhatsApp y Google Maps integrados.',
  },
  {
    icon: BarChart3,
    title: 'Google Ads y SEM',
    desc: 'Anuncios en Google para captar clientes activos que ya están buscando lo que ofreces en {city}.',
  },
  {
    icon: BrainCircuit,
    title: 'Automatizaciones con IA',
    desc: 'Chatbots, respuestas automáticas y flujos que trabajan 24/7 para captar y fidelizar clientes.',
  },
  {
    icon: TrendingUp,
    title: 'Estrategia Digital Integral',
    desc: 'Plan de marketing digital completo: contenido, pauta, web y métricas. Todo coordinado para crecer.',
  },
]

const RESULTS = [
  { value: '+50',   label: 'Proyectos entregados',      sub: 'sitios, sistemas y campañas' },
  { value: '24+',   label: 'Clientes activos',           sub: 'en Chile y LATAM' },
  { value: 'IA',     label: 'Integración con IA',         sub: 'automatizaciones y flujos inteligentes' },
  { value: '100%',  label: 'Resultados medibles',        sub: 'métricas reales, sin humo' },
]

export default function MarketingSEOLocal({ city }) {
  const WA      = `${WA_BASE}${encodeURIComponent(`Hola, vi su página de marketing digital en ${city.name} y me interesa cotizar una estrategia para mi negocio.`)}`
  const WA_FAST = `${WA_BASE}${encodeURIComponent(`Hola, me interesa el servicio de publicidad y marketing digital en ${city.name}.`)}`

  useEffect(() => {
    px('ViewContent', { content_name: `Marketing SEO ${city.name}` })
    ga('view_item', { item_name: `Marketing SEO ${city.name}`, item_category: 'marketing_local' })
  }, [city.name])

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'AgenciaSI',
    url: `https://agenciasi.cl/marketing/${city.slug}`,
    logo: 'https://agenciasi.cl/favicon.png',
    description: `Agencia de publicidad y marketing digital en ${city.name}. Meta Ads, SEO, Google Ads, sitios web y estrategia digital para pymes y empresas de ${city.region}.`,
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
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Marketing Digital en ${city.name}`,
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Publicidad en ${city.name}`, description: `Campañas Meta Ads y Google Ads para negocios de ${city.name}.` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `SEO en ${city.name}`, description: `Posicionamiento en Google para empresas de ${city.name}.` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Marketing Digital ${city.name}`, description: `Estrategia digital integral para pymes de ${city.name}.` } },
      ],
    },
  }

  return (
    <div style={{ fontFamily: "'Poppins', system-ui, sans-serif", background: T.white, color: T.black, overflowX: 'hidden' }}>
      <Helmet>
        <title>Agencia de Marketing Digital en {city.name} | AgenciaSI Chile</title>
        <meta name="description" content={`Agencia de publicidad y marketing digital en ${city.name}. Meta Ads, SEO, Google Ads y sitios web para pymes de ${city.name}. Cotiza gratis — resultados reales.`} />
        <link rel="canonical" href={`https://agenciasi.cl/marketing/${city.slug}`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`Agencia de Marketing Digital en ${city.name} | AgenciaSI`} />
        <meta property="og:description" content={`Publicidad en Facebook, Instagram y Google para negocios de ${city.name}. Resultados medibles y estrategia digital integral.`} />
        <meta property="og:url" content={`https://agenciasi.cl/marketing/${city.slug}`} />
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
              <div style={{ fontWeight: 800, fontSize: 15, color: T.black, letterSpacing: -.3 }}>AgenciaSI</div>
              <div style={{ fontSize: 9, color: T.gray, marginTop: -2 }}>Diseño y desarrollo integral.</div>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to="/" style={{ fontSize: 13, fontWeight: 600, color: T.gray, textDecoration: 'none', padding: '6px 14px' }}>Inicio</Link>
            <a href={WA_FAST} target="_blank" rel="noopener noreferrer" onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              style={{ background: T.blue, color: T.white, fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 30, display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
              Cotización gratuita <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1212CC 0%, #2D2BB5 50%, #1A4FC4 100%)', padding: '96px 24px 88px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -40, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 30, padding: '6px 16px', marginBottom: 24 }}>
            <Megaphone size={13} color="#A8FFEA" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#A8FFEA', letterSpacing: .5 }}>Agencia de Publicidad · {city.name} · {city.region}</span>
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 700, color: T.white, lineHeight: 1.1, marginBottom: 20, letterSpacing: -.5 }}>
            Marketing Digital en{' '}
            <em style={{ fontWeight: 400, color: '#A8FFEA' }}>{city.name}</em>{' '}
            que genera clientes reales.
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, marginBottom: 36, maxWidth: 580, margin: '0 auto 36px' }}>
            Publicidad en Meta Ads, SEO en Google y estrategia digital integral para {city.context}. Sin promesas vacías — métricas reales y resultados medibles.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 40 }}>
            <a href={WA_FAST} target="_blank" rel="noopener noreferrer" onClick={() => { px('Lead', { content_name: `Marketing CTA ${city.name}` }); ga('generate_lead', { item_name: `Marketing CTA ${city.name}` }) }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#A8FFEA', color: '#1212CC', fontWeight: 800, fontSize: 15, padding: '14px 30px', borderRadius: 40, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.25)' }}>
              <WaIcon size={17} /> Cotización gratuita
            </a>
            <a href={WA} target="_blank" rel="noopener noreferrer" onClick={() => { px('Schedule'); ga('schedule_appointment') }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: T.white, fontWeight: 600, fontSize: 14, padding: '14px 24px', borderRadius: 40, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.35)' }}>
              <Calendar size={15} /> Agendar reunión
            </a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 36, flexWrap: 'wrap' }}>
            {[
              { icon: CheckCircle2, text: 'Resultados medibles' },
              { icon: Shield,       text: 'Empresa formal · Facturamos' },
              { icon: Star,         text: 'Proveedor del Estado' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>
                <Icon size={14} color="#A8FFEA" /> {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ borderBottom: `1px solid ${T.border}`, background: T.light, padding: '28px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, textAlign: 'center' }} className="msl-stats">
          {RESULTS.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, fontWeight: 700, color: T.blue, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.black, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: T.gray }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICIOS */}
      <section style={{ background: T.white, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: T.blue, marginBottom: 12 }}>Qué hacemos en {city.name}</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, color: T.black, lineHeight: 1.1 }}>
              Publicidad y marketing que convierte.
            </h2>
            <p style={{ fontSize: 15, color: T.gray, maxWidth: 480, margin: '12px auto 0', lineHeight: 1.7 }}>
              No vendemos likes. Vendemos clientes, ventas y crecimiento real para negocios de {city.name}.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {SERVICES.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ border: `1px solid ${T.border}`, borderRadius: 16, padding: '28px 24px', transition: 'box-shadow .25s, border-color .25s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 28px ${T.blue}18`; e.currentTarget.style.borderColor = `${T.blue}40` }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = T.border }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: T.blue + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={22} color={T.blue} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: T.black, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: T.gray, lineHeight: 1.7 }}>{desc.replace('{city}', city.name)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section style={{ background: T.light, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="msl-grid">
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: T.blue, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 20, height: 2, background: T.blue, display: 'inline-block', borderRadius: 2 }} />
              Por qué AgenciaSI en {city.name}
            </p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: T.black, lineHeight: 1.1, marginBottom: 20 }}>
              Marketing sin humo.<br />Resultados sin excusas.
            </h2>
            <p style={{ fontSize: 15, color: T.gray, lineHeight: 1.75, marginBottom: 28 }}>
              La mayoría de agencias en {city.name} te cobra por "gestionar redes" sin mostrarte métricas reales. Nosotros trabajamos con KPIs claros — clientes generados, ventas producidas, retorno real de tu inversión.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: BarChart3,   text: 'Reportes claros con métricas reales cada mes' },
                { icon: Target,      text: 'Segmentación precisa de audiencias en {city}' },
                { icon: Globe,       text: 'Web + publicidad integrados en una sola estrategia' },
                { icon: Shield,      text: 'Empresa formal registrada en ChileCompra' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: T.blue + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color={T.blue} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: T.black }}>{text.replace('{city}', city.name)}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: T.blue, borderRadius: 24, padding: '40px 36px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 12, padding: '10px 16px', marginBottom: 28 }}>
              <img src="/proveedor-del-estado.png" alt="Proveedor del Estado" style={{ height: 28, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: T.white }}>Proveedor del Estado</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)' }}>Registrados en ChileCompra · MercadoPúblico</div>
              </div>
            </div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 700, color: T.white, lineHeight: 1.15, marginBottom: 24 }}>
              #DigitalizandoChile 🇨🇱
            </h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, marginBottom: 28 }}>
              Llevamos negocios de {city.name} al mundo digital. Con tecnología real, publicidad que convierte y estrategia medible.
            </p>
            {[
              '✔ Sin contratos de permanencia',
              '✔ Reportes mensuales detallados',
              '✔ Estrategia 100% personalizada',
              '✔ Facturamos — somos empresa formal',
            ].map(item => (
              <div key={item} style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 8 }}>{item}</div>
            ))}
            <a href={WA_FAST} target="_blank" rel="noopener noreferrer" onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 8, background: '#A8FFEA', color: '#1212CC', fontWeight: 800, fontSize: 14, padding: '12px 24px', borderRadius: 30, textDecoration: 'none' }}>
              <WaIcon size={16} /> Cotizar ahora
            </a>
          </div>
        </div>
      </section>

      {/* CLIENTES */}
      <section style={{ background: T.white, padding: '72px 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', padding: '0 24px', marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: T.blue, marginBottom: 12 }}>Clientes reales</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 700, color: T.black, marginBottom: 10 }}>
            Empresas que ya trabajan con nosotros.
          </h2>
          <p style={{ fontSize: 14, color: T.gray, maxWidth: 420, margin: '0 auto' }}>
            Desde {city.name} hasta todo Chile — estrategias digitales a medida para cada negocio.
          </p>
        </div>
        <style>{`
          @keyframes msl-marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
          .msl-track { display:flex; width:max-content; animation:msl-marquee 32s linear infinite; }
          .msl-track:hover { animation-play-state:paused; }
          .msl-logo { flex-shrink:0; width:148px; height:80px; margin:0 10px; display:flex; align-items:center; justify-content:center; background:#F4F4F8; border:1px solid #E0E0EA; border-radius:12px; padding:12px 16px; filter:grayscale(100%) opacity(0.6); transition:filter .3s; }
          .msl-logo:hover { filter:grayscale(0%) opacity(1); }
          .msl-logo img { max-width:108px; max-height:50px; object-fit:contain; }
          @media(max-width:860px) { .msl-grid{grid-template-columns:1fr!important;} }
          @media(max-width:580px) { .msl-stats{grid-template-columns:1fr 1fr!important;} }
        `}</style>
        <div style={{ overflow: 'hidden' }}>
          <div className="msl-track">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <div key={i} className="msl-logo">
                <img src={`/clientes/${logo}`} alt="cliente agenciasi" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ background: T.black, padding: '88px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: `${T.blue}12`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>📣</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, color: T.white, lineHeight: 1.15, marginBottom: 16 }}>
            ¿Listo para que tu negocio en {city.name} domine el mundo digital?
          </h2>
          <p style={{ fontSize: 16, color: '#B0B0D0', marginBottom: 36, lineHeight: 1.7 }}>
            Cotiza gratis. Te respondemos en menos de 2 horas con una propuesta personalizada.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
            <a href={WA} target="_blank" rel="noopener noreferrer" onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              style={{ background: '#25D366', color: T.white, fontWeight: 800, fontSize: 16, padding: '16px 32px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', boxShadow: '0 8px 32px rgba(37,211,102,.4)' }}>
              <WaIcon size={20} /> Cotizar en {city.name}
            </a>
            <Link to="/"
              style={{ background: 'transparent', color: T.white, fontWeight: 700, fontSize: 15, padding: '16px 24px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.3)' }}>
              Ver todos los servicios →
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
          <span style={{ fontSize: 12, color: '#404060' }}>© 2026 AgenciaSI · Marketing digital en {city.name} · Chile</span>
          <Link to="/" style={{ fontSize: 12, color: '#404060', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
            Inicio <ExternalLink size={11} />
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

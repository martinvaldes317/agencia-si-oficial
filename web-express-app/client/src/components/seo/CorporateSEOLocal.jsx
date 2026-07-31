import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ArrowRight, Code2, Building2, ShieldCheck, LineChart, Users2,
  FileCheck2, Handshake, BarChart4, Target, Globe2, Layers,
  MapPin, Calendar, CheckCircle2, ExternalLink, Network, Award,
} from 'lucide-react'

const T = {
  navy:   '#0B1220',
  blue:   '#2D2BB5',
  steel:  '#3E4C6E',
  gray:   '#5C5C6E',
  light:  '#F5F6FA',
  white:  '#FFFFFF',
  border: '#E4E6EF',
  gold:   '#B89654',
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

const SERVICIOS = [
  {
    icon: Network,
    title: 'Pauta Multi-Sucursal',
    desc: 'Un solo panel para coordinar campañas de Meta Ads y Google Ads en todas tus sucursales o puntos de venta en {city}, sin duplicar esfuerzo interno.',
  },
  {
    icon: Users2,
    title: 'Ejecutivo de Cuenta Dedicado',
    desc: 'Un solo interlocutor técnico y comercial para tu empresa. Sin tickets, sin rotación de encargados, sin explicar tu negocio dos veces.',
  },
  {
    icon: BarChart4,
    title: 'Reporting Ejecutivo',
    desc: 'Dashboards mensuales con KPIs de negocio (no vanity metrics): costo por adquisición, retorno de inversión y comparativo entre sucursales.',
  },
  {
    icon: FileCheck2,
    title: 'Licitaciones y ChileCompra',
    desc: 'Empresa formal, registrada en MercadoPúblico. Facturación electrónica, contratos y documentación lista para procesos de compra corporativos.',
  },
  {
    icon: Layers,
    title: 'Producción de Contenido a Escala',
    desc: 'Piezas gráficas, video y sitios web bajo un mismo manual de marca, replicables para cada sucursal o unidad de negocio sin perder consistencia.',
  },
  {
    icon: ShieldCheck,
    title: 'Gobernanza de Marca',
    desc: 'Lineamientos claros de uso de marca, aprobación centralizada de piezas y control de calidad antes de que cualquier campaña salga al aire.',
  },
]

const PROCESO = [
  { n: '01', t: 'Diagnóstico corporativo', d: 'Levantamos objetivos por área o sucursal y el volumen real que necesitas mover en {city} y la región.' },
  { n: '02', t: 'Propuesta y SLA', d: 'Plan de trabajo con alcance, tiempos de respuesta comprometidos y KPIs claros — sin letra chica.' },
  { n: '03', t: 'Implementación coordinada', d: 'Desplegamos campañas y contenido en todas tus unidades bajo un mismo estándar de marca.' },
  { n: '04', t: 'Reporting mensual', d: 'Reunión de resultados con tu equipo, ajustes de estrategia y proyección del siguiente ciclo.' },
]

const RESULTADOS = [
  { value: '+50',  label: 'Proyectos entregados',  sub: 'para empresas y pymes en Chile' },
  { value: 'SLA',  label: 'Tiempos de respuesta',  sub: 'comprometidos por contrato' },
  { value: '30+',  label: 'Comunas con cobertura',  sub: 'Región del Maule y otras regiones' },
  { value: '100%', label: 'Facturación electrónica', sub: 'empresa formal, sin informalidad' },
]

export default function CorporateSEOLocal({ city }) {
  const WA      = `${WA_BASE}${encodeURIComponent(`Hola, represento a una empresa en ${city.name} y me interesa evaluar una propuesta de publicidad y marketing a nivel corporativo.`)}`
  const WA_FAST = `${WA_BASE}${encodeURIComponent(`Hola, quiero agendar una reunión comercial para publicidad corporativa en ${city.name}.`)}`

  useEffect(() => {
    px('ViewContent', { content_name: `Corporate SEO ${city.name}` })
    ga('view_item', { item_name: `Corporate SEO ${city.name}`, item_category: 'publicidad_corporativa' })
  }, [city.name])

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'AgenciaSI',
    url: `https://agenciasi.cl/publicidad-corporativa/${city.slug}`,
    logo: 'https://agenciasi.cl/favicon.png',
    description: `Publicidad y marketing corporativo en ${city.name} para empresas grandes: gestión de pauta multi-sucursal, cuenta ejecutiva dedicada, reporting y licitaciones. Trabajamos a volumen.`,
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
      name: `Publicidad Corporativa en ${city.name}`,
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Pauta multi-sucursal en ${city.name}`, description: `Gestión de campañas a volumen para empresas de ${city.name}.` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Cuenta ejecutiva dedicada`, description: `Ejecutivo de cuenta único para empresas de ${city.name}.` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Licitaciones y ChileCompra`, description: `Proveedor formal para procesos de compra corporativos en ${city.region}.` } },
      ],
    },
  }

  return (
    <div style={{ fontFamily: "'Poppins', system-ui, sans-serif", background: T.white, color: T.navy, overflowX: 'hidden' }}>
      <Helmet>
        <title>Publicidad Corporativa en {city.name} | AgenciaSI Empresas</title>
        <meta name="description" content={`Agencia de publicidad corporativa en ${city.name}: pauta multi-sucursal, cuenta ejecutiva dedicada, reporting y licitaciones. Trabajamos a volumen con empresas grandes.`} />
        <link rel="canonical" href={`https://agenciasi.cl/publicidad-corporativa/${city.slug}`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`Publicidad Corporativa en ${city.name} | AgenciaSI Empresas`} />
        <meta property="og:description" content={`Gestión de publicidad y marketing a volumen para empresas grandes de ${city.name}. SLA, reporting ejecutivo y facturación formal.`} />
        <meta property="og:url" content={`https://agenciasi.cl/publicidad-corporativa/${city.slug}`} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <style>{`
        @keyframes csl-marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .csl-track { display:flex; width:max-content; animation:csl-marquee 34s linear infinite; }
        .csl-track:hover { animation-play-state:paused; }
        .csl-logo { flex-shrink:0; width:148px; height:80px; margin:0 10px; display:flex; align-items:center; justify-content:center; background:#F4F4F8; border:1px solid #E0E0EA; border-radius:12px; padding:12px 16px; filter:grayscale(100%) opacity(0.6); transition:filter .3s; }
        .csl-logo:hover { filter:grayscale(0%) opacity(1); }
        .csl-logo img { max-width:108px; max-height:50px; object-fit:contain; }
        .csl-svc-card { border:1px solid ${T.border}; border-radius:16px; padding:28px 24px; transition:box-shadow .25s, border-color .25s, transform .2s; }
        .csl-svc-card:hover { box-shadow:0 10px 30px rgba(11,18,32,.10); border-color:${T.navy}30; transform:translateY(-3px); }
        @media(max-width:900px) { .csl-hero-grid{grid-template-columns:1fr!important;} .csl-grid{grid-template-columns:1fr!important;} }
        @media(max-width:640px) { .csl-stats{grid-template-columns:1fr 1fr!important;} }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: T.white, borderBottom: `1px solid ${T.border}`, boxShadow: '0 1px 8px rgba(0,0,0,.05)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: T.navy, borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: T.navy, letterSpacing: -.3 }}>AgenciaSI</div>
              <div style={{ fontSize: 9, color: T.gray, marginTop: -2 }}>Publicidad corporativa · Empresas</div>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: T.gray, display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={11} color={T.gold} /> {city.name}
            </span>
            <a href={WA_FAST} target="_blank" rel="noopener noreferrer" onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              style={{ background: T.navy, color: T.white, fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
              Agendar reunión <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: `linear-gradient(160deg, ${T.navy} 0%, #14203A 60%, #1B2A4A 100%)`, padding: '96px 24px 88px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -120, right: -120, width: 480, height: 480, borderRadius: '50%', background: `${T.gold}10`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', border: `1px solid ${T.gold}50`, borderRadius: 30, padding: '6px 16px', marginBottom: 26 }}>
            <Building2 size={13} color={T.gold} />
            <span style={{ fontSize: 11, fontWeight: 700, color: T.gold, letterSpacing: 1.2 }}>PUBLICIDAD CORPORATIVA · {city.name.toUpperCase()} · {city.region.toUpperCase()}</span>
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.2rem, 4.6vw, 3.8rem)', fontWeight: 700, color: T.white, lineHeight: 1.15, marginBottom: 22, letterSpacing: -.5 }}>
            Publicidad para empresas que operan<br /><em style={{ fontWeight: 400, color: T.gold }}>a volumen en {city.name}.</em>
          </h1>
          <p style={{ fontSize: 'clamp(14px, 1.8vw, 17px)', color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, maxWidth: 620, margin: '0 auto 36px' }}>
            Gestionamos campañas, contenido y reporting para empresas con múltiples sucursales, equipos internos y procesos de compra formales en {city.context}. Un solo proveedor para toda la operación.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 40 }}>
            <a href={WA_FAST} target="_blank" rel="noopener noreferrer" onClick={() => { px('Lead', { content_name: `Corporate CTA ${city.name}` }); ga('generate_lead', { item_name: `Corporate CTA ${city.name}` }) }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: T.gold, color: T.navy, fontWeight: 800, fontSize: 14, padding: '14px 30px', borderRadius: 8, textDecoration: 'none' }}>
              <Calendar size={16} /> Agendar reunión comercial
            </a>
            <a href={WA} target="_blank" rel="noopener noreferrer" onClick={() => { px('Schedule'); ga('schedule_appointment') }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: T.white, fontWeight: 600, fontSize: 14, padding: '14px 24px', borderRadius: 8, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.3)' }}>
              <WaIcon size={15} /> Escribir por WhatsApp
            </a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {[
              { icon: FileCheck2,   text: 'Facturación electrónica' },
              { icon: ShieldCheck,  text: 'Proveedor del Estado · ChileCompra' },
              { icon: Handshake,    text: 'SLA de respuesta por contrato' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.68)' }}>
                <Icon size={14} color={T.gold} /> {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ borderBottom: `1px solid ${T.border}`, background: T.light, padding: '28px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, textAlign: 'center' }} className="csl-stats">
          {RESULTADOS.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, fontWeight: 700, color: T.navy, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.navy, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: T.gray }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICIOS */}
      <section style={{ background: T.white, padding: '84px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: T.gold, marginBottom: 12 }}>Cómo trabajamos con empresas en {city.name}</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: T.navy, lineHeight: 1.15 }}>
              Infraestructura de marketing<br />pensada para operar a escala.
            </h2>
            <p style={{ fontSize: 15, color: T.gray, maxWidth: 520, margin: '14px auto 0', lineHeight: 1.75 }}>
              No competimos por precio con freelancers. Competimos en capacidad de ejecución, consistencia de marca y reporting que tu directorio pueda revisar.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }} className="csl-grid">
            {SERVICIOS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="csl-svc-card">
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${T.navy}0D`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={22} color={T.navy} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: T.navy, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: T.gray, lineHeight: 1.7 }}>{desc.replace('{city}', city.name)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUÉ / OFERTA CORPORATIVA */}
      <section style={{ background: T.light, padding: '84px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="csl-hero-grid">
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: T.gold, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 20, height: 2, background: T.gold, display: 'inline-block', borderRadius: 2 }} />
              Por qué empresas grandes trabajan con nosotros
            </p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, color: T.navy, lineHeight: 1.15, marginBottom: 20 }}>
              Un solo proveedor para toda tu operación en {city.name}.
            </h2>
            <p style={{ fontSize: 15, color: T.gray, lineHeight: 1.8, marginBottom: 28 }}>
              Coordinar múltiples freelancers o agencias distintas por sucursal genera inconsistencia de marca y cero visibilidad para gerencia. Nosotros centralizamos ejecución, aprobación y reporting bajo un mismo estándar.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: LineChart,  text: 'KPIs de negocio, no vanity metrics' },
                { icon: Users2,     text: 'Ejecutivo de cuenta único, sin rotación' },
                { icon: Target,     text: 'Segmentación por sucursal o zona en {city}' },
                { icon: Globe2,     text: 'Cobertura en toda la Región del Maule y más' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${T.navy}0D`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color={T.navy} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: T.navy }}>{text.replace('{city}', city.name)}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: T.navy, borderRadius: 20, padding: '40px 36px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.08)', border: `1px solid ${T.gold}40`, borderRadius: 12, padding: '10px 16px', marginBottom: 28 }}>
              <img src="/proveedor-del-estado.png" alt="Proveedor del Estado" style={{ height: 26, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: T.white }}>Proveedor del Estado</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Registrados en ChileCompra · MercadoPúblico</div>
              </div>
            </div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.3rem, 2.2vw, 1.9rem)', fontWeight: 700, color: T.white, lineHeight: 1.2, marginBottom: 22 }}>
              Listos para procesos de compra formales.
            </h3>
            {[
              'Facturación electrónica y contratos formales',
              'Documentación lista para licitaciones públicas',
              'Acuerdos de confidencialidad cuando se requieran',
              'Reporting mensual con tu equipo de marketing o gerencia',
              'Escalable a nuevas sucursales sin renegociar todo el contrato',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11 }}>
                <CheckCircle2 size={13} color={T.gold} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)' }}>{item}</span>
              </div>
            ))}
            <a href={WA_FAST} target="_blank" rel="noopener noreferrer" onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              style={{ marginTop: 26, display: 'inline-flex', alignItems: 'center', gap: 8, background: T.gold, color: T.navy, fontWeight: 800, fontSize: 13, padding: '12px 22px', borderRadius: 8, textDecoration: 'none' }}>
              <Calendar size={15} /> Agendar reunión
            </a>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section style={{ background: T.white, padding: '84px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: T.gold, marginBottom: 12 }}>Onboarding empresarial</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.7rem, 2.8vw, 2.3rem)', fontWeight: 700, color: T.navy, lineHeight: 1.15 }}>
              Así se estructura el trabajo con tu empresa.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 28 }}>
            {PROCESO.map(({ n, t, d }) => (
              <div key={n} style={{ padding: '6px 0', borderTop: `2px solid ${T.navy}15` }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, fontWeight: 700, color: T.gold, lineHeight: 1, marginBottom: 10 }}>{n}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: T.navy, marginBottom: 8 }}>{t}</div>
                <div style={{ fontSize: 12, color: T.gray, lineHeight: 1.75 }}>{d.replace('{city}', city.name)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COBERTURA */}
      <section style={{ background: T.navy, padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: T.gold, marginBottom: 14 }}>Cobertura</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)', fontWeight: 700, color: T.white, lineHeight: 1.2, marginBottom: 16 }}>
            No importa cuántas sucursales tengas en {city.region}.
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.68)', lineHeight: 1.8 }}>
            Operamos en las 30 comunas de la Región del Maule y coordinamos también con empresas que tienen presencia en otras regiones de Chile. Un mismo equipo, un mismo estándar, sin importar cuántos puntos tengas que cubrir.
          </p>
        </div>
      </section>

      {/* CLIENTES */}
      <section style={{ background: T.white, padding: '72px 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', padding: '0 24px', marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: T.gold, marginBottom: 12 }}>Empresas que confían en nosotros</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)', fontWeight: 700, color: T.navy, marginBottom: 10 }}>
            Desde pymes hasta operaciones multi-sucursal.
          </h2>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div className="csl-track">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <div key={i} className="csl-logo">
                <img src={`/clientes/${logo}`} alt="cliente agenciasi" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ background: T.light, padding: '88px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: T.navy, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={26} color={T.gold} />
            </div>
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)', fontWeight: 700, color: T.navy, lineHeight: 1.2, marginBottom: 16 }}>
            Hablemos de tu operación en {city.name}.
          </h2>
          <p style={{ fontSize: 15, color: T.gray, marginBottom: 34, lineHeight: 1.75 }}>
            Cuéntanos cuántas sucursales, marcas o campañas necesitas coordinar. Te respondemos con una propuesta y un SLA claro — sin presión de venta.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
            <a href={WA_FAST} target="_blank" rel="noopener noreferrer" onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              style={{ background: T.navy, color: T.white, fontWeight: 800, fontSize: 15, padding: '15px 30px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <Calendar size={17} /> Agendar reunión comercial
            </a>
            <Link to="/"
              style={{ background: 'transparent', color: T.navy, fontWeight: 700, fontSize: 14, padding: '15px 24px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', border: `1.5px solid ${T.navy}30` }}>
              Ver todos los servicios →
            </Link>
          </div>
          <p style={{ fontSize: 12, color: T.gray }}>+56 9 3293 0812 · contacto@agenciasi.cl</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: T.navy, padding: '24px', borderTop: `1px solid rgba(255,255,255,0.08)` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ background: T.gold, borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={13} color={T.navy} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: T.white }}>AgenciaSI</span>
          </Link>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>© 2026 AgenciaSI · Publicidad corporativa en {city.name} · Chile</span>
          <Link to="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
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

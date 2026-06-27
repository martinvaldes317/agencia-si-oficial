import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ArrowRight, MapPin, CheckCircle2, Star, Shield,
  Zap, Package, Lightbulb, Layers, SquareStack,
  Monitor, Tag, ExternalLink, Calendar, Code2
} from 'lucide-react'

const T = {
  dark:   '#0D0D0D',
  gray:   '#1A1A1A',
  mid:    '#2E2E2E',
  border: '#3A3A3A',
  orange: '#F97316',
  orangeL:'#FFF7ED',
  blue:   '#2D2BB5',
  white:  '#FFFFFF',
  muted:  '#A0A0A0',
  light:  '#F5F5F5',
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

const PRODUCTOS = [
  {
    icon: SquareStack,
    nombre: 'Letras Volumétricas en Acrílico',
    desc: 'Letras y logos en acrílico cristal, lechoso o de color. Alta precisión en corte láser. Montaje directo en fachada.',
    tag: 'Más vendido',
  },
  {
    icon: Layers,
    nombre: 'Letras de Alto Impacto (PVC)',
    desc: 'PVC expandido de alta rigidez. Ideal para interiores y locales comerciales. Duradero, liviano y económico.',
    tag: null,
  },
  {
    icon: Lightbulb,
    nombre: 'Letreros Luminosos LED',
    desc: 'Caja de luz, backlit y frontlit con tecnología LED. Visibles 24/7 y bajo consumo energético.',
    tag: 'Popular',
  },
  {
    icon: Package,
    nombre: 'Letras en MDF y Madera',
    desc: 'Perfecto para ambientes premium, restaurantes, hoteles y oficinas. Acabados pintados, dorados o barnizados.',
    tag: null,
  },
  {
    icon: Zap,
    nombre: 'Tótem Publicitario',
    desc: 'Estructura vertical independiente en PVC o foam. Ideal para locales en galería, ferias y eventos.',
    tag: null,
  },
  {
    icon: Monitor,
    nombre: 'Fachada Corporativa Completa',
    desc: 'Diseño e instalación de identidad visual en fachada: letreros, vinilos, señalética y rotulación integrados.',
    tag: 'Completo',
  },
  {
    icon: Tag,
    nombre: 'Vinilos Decorativos y Ploteo',
    desc: 'Corte o impresión digital. Para vidrieras, paredes, autos y eventos. Interior o exterior con laminado UV.',
    tag: null,
  },
  {
    icon: Star,
    nombre: 'Señalética y Rotulación',
    desc: 'Señales de emergencia, directorio de oficinas, numeración y señalética corporativa a medida.',
    tag: null,
  },
  {
    icon: ArrowRight,
    nombre: 'Banners, Roll-Ups y Lonas',
    desc: 'Impresión en lona con bastidor. Banners de alta resolución para eventos, ferias, y puntos de venta.',
    tag: null,
  },
]

const PASOS = [
  { n: '01', titulo: 'Cotización gratis',   desc: 'Envíanos por WhatsApp el nombre, logo y medidas aproximadas.' },
  { n: '02', titulo: 'Diseño digital',       desc: 'Te enviamos una propuesta visual antes de producir.' },
  { n: '03', titulo: 'Producción',           desc: 'Fabricamos en taller con materiales de calidad comprobada.' },
  { n: '04', titulo: 'Entrega e instalación',desc: 'Instalamos en tu local o coordinas retiro en Talca.' },
]

const STATS = [
  { value: '+300', label: 'Letreros fabricados', sub: 'en la Región del Maule' },
  { value: '5 días', label: 'Tiempo promedio',   sub: 'desde aprobación a entrega' },
  { value: '100%',  label: 'Sin metálicos',       sub: 'acrílico, PVC, madera, foam' },
  { value: '30',    label: 'Comunas',             sub: 'atendemos toda la región' },
]

export default function LetrerosSEOLocal({ city }) {
  const WA = `${WA_BASE}${encodeURIComponent(`Hola, me interesa cotizar un letrero volumétrico para mi negocio en ${city.name}. ¿Pueden ayudarme?`)}`
  const WA_FAST = `${WA_BASE}${encodeURIComponent(`Hola, quiero información sobre letreros y gráficas en ${city.name}.`)}`

  useEffect(() => {
    px('ViewContent', { content_name: `Letreros SEO ${city.name}` })
    ga('view_item', { item_name: `Letreros SEO ${city.name}`, item_category: 'letreros_graficas' })
  }, [city.name])

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://agenciasi.cl/letreros/${city.slug}`,
    name: 'AgenciaSI Gráficas y Letreros',
    url: `https://agenciasi.cl/letreros/${city.slug}`,
    logo: 'https://agenciasi.cl/favicon.png',
    image: 'https://agenciasi.cl/favicon.png',
    description: `Letreros volumétricos en ${city.name}: acrílico, PVC, madera, LED y foam. Fabricación e instalación en toda la Región del Maule. Cotiza gratis por WhatsApp.`,
    telephone: '+56932930812',
    email: 'contacto@agenciasi.cl',
    priceRange: '$$',
    areaServed: [
      { '@type': 'City', name: city.name },
      { '@type': 'AdministrativeArea', name: 'Región del Maule' },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: 'Región del Maule',
      addressCountry: 'CL',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Letreros y Gráficas en ${city.name}`,
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Letras Volumétricas en Acrílico' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Letreros Luminosos LED' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Fachada Corporativa Completa' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Vinilos y Ploteos' } },
      ],
    },
    sameAs: ['https://agenciasi.cl'],
  }

  return (
    <div style={{ fontFamily: "'Poppins', system-ui, sans-serif", background: T.white, color: T.dark, overflowX: 'hidden' }}>
      <Helmet>
        <title>Letreros Volumétricos en {city.name} | AgenciaSI Gráficas · Región del Maule</title>
        <meta name="description" content={`Letreros volumétricos en ${city.name}: acrílico, PVC, LED, madera y foam. Fabricamos e instalamos en ${city.name} y toda la Región del Maule. Cotización gratis por WhatsApp.`} />
        <link rel="canonical" href={`https://agenciasi.cl/letreros/${city.slug}`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`Letreros Volumétricos en ${city.name} | AgenciaSI Gráficas`} />
        <meta property="og:description" content={`Fabricamos letreros de acrílico, PVC, LED y madera en ${city.name}. Fachadas corporativas, señalética y ploteos para negocios del Maule.`} />
        <meta property="og:url" content={`https://agenciasi.cl/letreros/${city.slug}`} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: T.dark, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: T.orange, borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: T.white, letterSpacing: -.3 }}>AgenciaSI</div>
              <div style={{ fontSize: 9, color: T.muted, marginTop: -2 }}>Gráficas y Letreros · Maule</div>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 12, color: T.muted, display: 'flex', alignItems: 'center', gap: 5 }}>
              <MapPin size={12} color={T.orange} /> {city.name}
            </div>
            <a href={WA_FAST} target="_blank" rel="noopener noreferrer"
              onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              style={{ background: T.orange, color: T.white, fontWeight: 700, fontSize: 12, padding: '9px 18px', borderRadius: 30, display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
              Cotizar gratis <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: T.dark, padding: '80px 24px 72px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(249,115,22,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.06) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -120, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.4)', borderRadius: 30, padding: '6px 16px', marginBottom: 24 }}>
            <MapPin size={12} color={T.orange} />
            <span style={{ fontSize: 11, fontWeight: 700, color: T.orange, letterSpacing: 1 }}>Letreros · {city.name} · Región del Maule</span>
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.2rem, 5.5vw, 4.2rem)', fontWeight: 700, color: T.white, lineHeight: 1.05, marginBottom: 18, letterSpacing: -.5 }}>
            Letreros Volumétricos<br />
            <em style={{ fontWeight: 400, color: T.orange }}>en {city.name}</em>
          </h1>
          <p style={{ fontSize: 'clamp(14px, 2vw, 17px)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 12, maxWidth: 560, margin: '0 auto 12px' }}>
            Fabricamos letreros de <strong style={{ color: T.white }}>acrílico, PVC, LED, madera y foam</strong> para {city.context}. Diseño, fabricación e instalación — todo en uno.
          </p>
          <p style={{ fontSize: 13, color: T.orange, fontWeight: 700, marginBottom: 36 }}>Sin letreros metálicos · 100% plástico, madera y luz LED</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 48 }}>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              onClick={() => { px('Lead', { content_name: `Letreros Hero ${city.name}` }); ga('generate_lead', { item_name: `Letreros Hero ${city.name}` }) }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: T.orange, color: T.white, fontWeight: 800, fontSize: 15, padding: '14px 30px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 8px 28px rgba(249,115,22,0.45)' }}>
              <WaIcon size={18} /> Cotizar mi letrero
            </a>
            <a href={WA_FAST} target="_blank" rel="noopener noreferrer"
              onClick={() => { px('Schedule'); ga('schedule_appointment') }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: T.white, fontWeight: 600, fontSize: 14, padding: '14px 24px', borderRadius: 12, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.25)' }}>
              <Calendar size={15} /> Ver ejemplos
            </a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {[
              { icon: CheckCircle2, text: 'Cotización gratis en 24h' },
              { icon: Shield,       text: 'Empresa formal · Facturamos' },
              { icon: Star,         text: 'Proveedor del Estado' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>
                <Icon size={13} color={T.orange} /> {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ background: T.orange, padding: '24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, textAlign: 'center' }} className="lst-stats">
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: T.white, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTOS */}
      <section style={{ background: T.light, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: T.orange, marginBottom: 12 }}>Catálogo de productos</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, color: T.dark, lineHeight: 1.1, marginBottom: 12 }}>
              Todo lo que tu negocio en {city.name} necesita para destacar.
            </h2>
            <p style={{ fontSize: 14, color: '#555', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              No fabricamos piezas metálicas. Nos especializamos en materiales plásticos, madera, foam y tecnología LED.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {PRODUCTOS.map(({ icon: Icon, nombre, desc, tag }) => (
              <div key={nombre} style={{ background: T.white, border: `1px solid #E8E8E8`, borderRadius: 16, padding: '26px 22px', position: 'relative', transition: 'box-shadow .25s, border-color .25s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(249,115,22,.14)'; e.currentTarget.style.borderColor = 'rgba(249,115,22,.4)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E8E8E8' }}>
                {tag && (
                  <span style={{ position: 'absolute', top: 18, right: 18, background: T.orange, color: T.white, fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 20, letterSpacing: .5 }}>{tag}</span>
                )}
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={21} color={T.orange} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: T.dark, marginBottom: 8 }}>{nombre}</div>
                <div style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section style={{ background: T.white, padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: T.orange, marginBottom: 12 }}>Cómo trabajamos</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: T.dark, lineHeight: 1.1 }}>
              Tu letrero en {city.name} en 4 pasos.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 24 }}>
            {PASOS.map(({ n, titulo, desc }) => (
              <div key={n} style={{ textAlign: 'center', padding: '28px 16px' }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 52, fontWeight: 700, color: 'rgba(249,115,22,0.15)', lineHeight: 1, marginBottom: 8 }}>{n}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: T.dark, marginBottom: 8, marginTop: -16 }}>{titulo}</div>
                <div style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BANNER PROVEEDOR ESTADO + COBERTURA */}
      <section style={{ background: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 100%)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }} className="lst-grid">
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: T.orange, marginBottom: 16 }}>Cobertura total</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: T.white, lineHeight: 1.1, marginBottom: 20 }}>
              Atendemos las 30 comunas de la Región del Maule.
            </h2>
            <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.75, marginBottom: 24 }}>
              Desde Talca hasta Vichuquén, desde Curicó hasta Cauquenes. Fabricamos en taller y coordinamos entrega e instalación en toda la región.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Provincia de Talca (10 comunas)',
                'Provincia de Curicó (9 comunas)',
                'Provincia de Linares (8 comunas)',
                'Provincia de Cauquenes (3 comunas)',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CheckCircle2 size={15} color={T.orange} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 20, padding: '36px 32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 16px', marginBottom: 24 }}>
              <img src="/proveedor-del-estado.png" alt="Proveedor del Estado" style={{ height: 26, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: T.white }}>Proveedor del Estado</div>
                <div style={{ fontSize: 9, color: T.muted }}>Registrados en ChileCompra · MercadoPúblico</div>
              </div>
            </div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, color: T.white, marginBottom: 20 }}>¿Por qué elegirnos?</h3>
            {[
              '✔ Materiales certificados y duraderos',
              '✔ Diseño profesional incluido',
              '✔ Presupuesto sin compromiso en 24h',
              '✔ Instalación coordinada en tu comuna',
              '✔ Facturamos — empresa formal',
              '✔ Sin letreros metálicos (especialidad plástico, madera y LED)',
            ].map(item => (
              <div key={item} style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 9 }}>{item}</div>
            ))}
            <a href={WA} target="_blank" rel="noopener noreferrer"
              onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 8, background: T.orange, color: T.white, fontWeight: 800, fontSize: 14, padding: '12px 24px', borderRadius: 30, textDecoration: 'none' }}>
              <WaIcon size={16} /> Cotizar ahora
            </a>
          </div>
        </div>
      </section>

      {/* CLIENTES */}
      <section style={{ background: T.light, padding: '72px 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', padding: '0 24px', marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: T.orange, marginBottom: 12 }}>Empresas que confían en nosotros</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 700, color: T.dark, marginBottom: 10 }}>
            Negocios de la Región del Maule y todo Chile.
          </h2>
        </div>
        <style>{`
          @keyframes lst-marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
          .lst-track { display:flex; width:max-content; animation:lst-marquee 34s linear infinite; }
          .lst-track:hover { animation-play-state:paused; }
          .lst-logo { flex-shrink:0; width:148px; height:80px; margin:0 10px; display:flex; align-items:center; justify-content:center; background:#fff; border:1px solid #E8E8E8; border-radius:12px; padding:12px 16px; filter:grayscale(100%) opacity(0.55); transition:filter .3s; }
          .lst-logo:hover { filter:grayscale(0%) opacity(1); }
          .lst-logo img { max-width:108px; max-height:50px; object-fit:contain; }
          @media(max-width:860px) { .lst-grid{grid-template-columns:1fr!important;} }
          @media(max-width:580px) { .lst-stats{grid-template-columns:1fr 1fr!important;} }
        `}</style>
        <div style={{ overflow: 'hidden' }}>
          <div className="lst-track">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <div key={i} className="lst-logo">
                <img src={`/clientes/${logo}`} alt="cliente agenciasi" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ background: T.orange, padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🪧</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, color: T.white, lineHeight: 1.15, marginBottom: 14 }}>
            Dale identidad a tu negocio en {city.name}.
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', marginBottom: 32, lineHeight: 1.7 }}>
            Cotiza tu letrero gratis. Te respondemos con presupuesto y diseño en menos de 24 horas.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              onClick={() => { px('Lead', { content_name: `Letreros CTA Final ${city.name}` }); ga('generate_lead', { item_name: `Letreros Final ${city.name}` }) }}
              style={{ background: T.white, color: T.orange, fontWeight: 800, fontSize: 15, padding: '15px 30px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.2)' }}>
              <WaIcon size={18} /> Quiero mi letrero
            </a>
            <Link to="/"
              style={{ background: 'transparent', color: T.white, fontWeight: 600, fontSize: 14, padding: '15px 24px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', border: '2px solid rgba(255,255,255,.5)' }}>
              Ver más servicios →
            </Link>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 20 }}>+56 9 3293 0812 · contacto@agenciasi.cl</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: T.dark, padding: '20px 24px', borderTop: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ background: T.orange, borderRadius: 6, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={12} color="#fff" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.white }}>AgenciaSI Gráficas</span>
          </Link>
          <span style={{ fontSize: 12, color: T.muted }}>© 2026 AgenciaSI · Letreros en {city.name} · Región del Maule · Chile</span>
          <Link to="/" style={{ fontSize: 12, color: T.muted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
            Inicio <ExternalLink size={11} />
          </Link>
        </div>
      </footer>

      {/* FLOATING WA */}
      <a href={WA} target="_blank" rel="noopener noreferrer"
        onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
        style={{ position: 'fixed', bottom: 24, right: 24, background: '#25D366', color: T.white, width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 24px rgba(37,211,102,.55)', zIndex: 100, textDecoration: 'none' }}>
        <WaIcon size={26} />
      </a>
    </div>
  )
}

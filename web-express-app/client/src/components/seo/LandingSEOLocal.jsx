import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  MapPin, CheckCircle2, Star, Code2, Globe, ShoppingCart,
  Zap, Shield, Search, Smartphone, ExternalLink, Calendar,
  Building2, BarChart3
} from 'lucide-react'

const T = {
  blue:  '#2D2BB5',
  blueD: '#1E1C8A',
  blueL: '#EEF0FF',
  black: '#0A0A14',
  gray:  '#4C4C68',
  muted: '#8080A0',
  light: '#F6F6FC',
  white: '#FFFFFF',
  border:'#E0E0EF',
  green: '#16A34A',
}

const WA_BASE = 'https://wa.me/56932930812?text='
const fmt = n => n.toLocaleString('es-CL')

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
  { icon: Zap,          name: 'Landing Page',       desc: 'Página de conversión rápida, ideal para captar clientes locales.' },
  { icon: Building2,    name: 'Web Corporativa',     desc: 'Imagen profesional completa: servicios, equipo y contacto.' },
  { icon: ShoppingCart, name: 'Tienda Online',       desc: 'E-commerce con MercadoPago y despacho a domicilio.' },
  { icon: Calendar,     name: 'Agenda Online',       desc: 'Sistema de citas para clínicas, centros y profesionales.' },
  { icon: Globe,        name: 'Catálogo Digital',    desc: 'Muestra tus productos o servicios sin carrito de compras.' },
  { icon: BarChart3,    name: 'Sistema a Medida',    desc: 'CRM, gestión de inventario, portales y automatizaciones.' },
]

export default function LandingSEOLocal({ city }) {
  const WA = `${WA_BASE}${encodeURIComponent(`Hola, vi su página de desarrollo web en ${city.name} y me interesa cotizar un sitio web para mi negocio.`)}`
  const WA_REU = `${WA_BASE}${encodeURIComponent(`Hola, me interesa agendar una reunión para hablar de mi proyecto web en ${city.name}.`)}`

  useEffect(() => {
    px('ViewContent', { content_name: `Landing SEO ${city.name}` })
    ga('view_item', { item_name: `Landing SEO ${city.name}`, item_category: 'web_local' })
  }, [city.name])

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'AgenciaSI',
    url: `https://agenciasi.cl/web/${city.slug}`,
    logo: 'https://agenciasi.cl/favicon.png',
    description: `Agencia de desarrollo web en ${city.name}. Creamos sitios web, tiendas online y sistemas a medida para negocios de ${city.name} y la ${city.region}.`,
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
      name: `Desarrollo Web en ${city.name}`,
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Página Web en ${city.name}`, description: `Sitios web profesionales para negocios de ${city.name}.` } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: `Tienda Online en ${city.name}`, description: `E-commerce con MercadoPago para negocios de ${city.name}.` } },
      ],
    },
  }

  return (
    <div style={{ fontFamily: "'Poppins', system-ui, sans-serif", background: T.white, color: T.black, overflowX: 'hidden' }}>
      <Helmet>
        <title>Desarrollo Web en {city.name} | AgenciaSI Chile</title>
        <meta name="description" content={`Agencia de desarrollo web en ${city.name}. Creamos sitios web, tiendas online y sistemas a medida para pymes y profesionales de ${city.name}. Cotiza gratis.`} />
        <link rel="canonical" href={`https://agenciasi.cl/web/${city.slug}`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`Desarrollo Web en ${city.name} | AgenciaSI`} />
        <meta property="og:description" content={`Sitios web profesionales para negocios de ${city.name}. Diseño único, dominio gratis, entrega en 5 días.`} />
        <meta property="og:url" content={`https://agenciasi.cl/web/${city.slug}`} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: T.white, borderBottom: `1px solid ${T.border}`, boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: T.blue, borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 16, color: T.black, letterSpacing: -.3 }}>AgenciaSI</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/web" style={{ fontSize: 13, fontWeight: 600, color: T.gray, textDecoration: 'none', padding: '6px 14px' }}>Ver precios</Link>
            <a href={WA} target="_blank" rel="noopener noreferrer" onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              style={{ background: '#25D366', color: T.white, fontWeight: 700, fontSize: 13, padding: '9px 18px', borderRadius: 30, display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none', boxShadow: '0 4px 12px rgba(37,211,102,.35)' }}>
              <WaIcon size={15} /> Cotizar en {city.name}
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1212CC 0%, #2D2BB5 45%, #1A4FC4 100%)', padding: '72px 20px 88px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 420, height: 420, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 30, padding: '6px 16px', marginBottom: 24 }}>
            <MapPin size={13} color="#A8FFEA" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#A8FFEA', letterSpacing: .5 }}>Desarrollo Web en {city.name} · {city.region}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 62px)', fontWeight: 900, color: T.white, lineHeight: 1.06, marginBottom: 20, letterSpacing: -2, fontStyle: 'italic' }}>
            Agencia Web en<br />
            <span style={{ fontStyle: 'normal' }}>{city.name}</span>
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, marginBottom: 32, maxWidth: 580, margin: '0 auto 32px' }}>
            Creamos sitios web profesionales para {city.context}. Diseño único, dominio .cl gratis y entrega en <strong style={{ color: T.white }}>5 días hábiles.</strong>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 36 }}>
            <a href={WA} target="_blank" rel="noopener noreferrer" onClick={() => { px('Lead', { content_name: `SEO Local ${city.name}` }); ga('generate_lead', { item_name: `SEO Local ${city.name}` }) }}
              style={{ background: T.white, color: T.blue, fontWeight: 800, fontSize: 15, padding: '14px 28px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.25)' }}>
              <WaIcon size={18} /> Cotizar ahora — es gratis
            </a>
            <a href={WA_REU} target="_blank" rel="noopener noreferrer" onClick={() => { px('Schedule'); ga('schedule_appointment') }}
              style={{ background: 'transparent', color: T.white, fontWeight: 600, fontSize: 14, padding: '14px 22px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.35)' }}>
              <Calendar size={15} /> Agendar reunión
            </a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {[{ n: '+50', label: 'proyectos entregados' }, { n: '5 días', label: 'entrega Web Express' }, { n: '100%', label: 'código propio' }].map(({ n, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: T.white, lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{ background: '#EEF4FF', borderBottom: '1px solid #D0D8F0', padding: '16px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/proveedor-del-estado.png" alt="ChileCompra MercadoPúblico" style={{ height: 36, objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#1A2A6C' }}>Proveedor del Estado</div>
              <div style={{ fontSize: 10, color: '#4A5A8C' }}>Registrados en ChileCompra · MercadoPúblico</div>
            </div>
          </div>
          <div style={{ width: 1, height: 32, background: '#C0C8E0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Shield size={16} color={T.blue} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1A2A6C' }}>Empresa formal · Emitimos facturas</span>
          </div>
          <div style={{ width: 1, height: 32, background: '#C0C8E0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <MapPin size={16} color={T.blue} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1A2A6C' }}>Atendemos en {city.name} y todo Chile</span>
          </div>
        </div>
      </div>

      {/* POR QUÉ TENER WEB */}
      <section style={{ background: T.light, padding: '72px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.blue, letterSpacing: 2, textTransform: 'uppercase' }}>¿Por qué ahora?</span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, color: T.black, marginTop: 10, letterSpacing: -.5 }}>
              Tu competencia en {city.name} ya está online.
            </h2>
            <p style={{ fontSize: 15, color: T.gray, marginTop: 10, maxWidth: 500, margin: '10px auto 0' }}>
              Cada día sin sitio web es una oportunidad que pierde tu negocio en {city.name}.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {[
              { icon: Search,     title: `No aparecer en Google ${city.name}`, desc: 'Tus clientes buscan servicios locales en Google. Sin web, no existes.' },
              { icon: Smartphone, title: 'Sin presencia móvil',                desc: 'El 70% del tráfico es móvil. Un sitio profesional convierte visitas en clientes.' },
              { icon: Star,       title: 'Credibilidad y confianza',           desc: `En ${city.name}, los negocios con web profesional generan más confianza y ventas.` },
              { icon: Zap,        title: 'Entrega en 5 días hábiles',          desc: 'No esperes meses. En 5 días tu negocio en ' + city.name + ' ya está online.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, padding: '22px 24px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: T.blueL, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={17} color={T.blue} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.black, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 12, color: T.gray, lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section style={{ background: T.white, padding: '72px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.blue, letterSpacing: 2, textTransform: 'uppercase' }}>Qué hacemos</span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, color: T.black, marginTop: 10, letterSpacing: -.5 }}>
              Servicios web para {city.name}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            {SERVICES.map(({ icon: Icon, name, desc }) => (
              <div key={name} style={{ border: `1px solid ${T.border}`, borderRadius: 14, padding: '22px 24px', display: 'flex', gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: T.blueL, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={17} color={T.blue} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.black, marginBottom: 4 }}>{name}</div>
                  <div style={{ fontSize: 12, color: T.gray, lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <Link to="/web#precios" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.blue, color: T.white, fontWeight: 700, fontSize: 14, padding: '12px 28px', borderRadius: 30, textDecoration: 'none' }}>
              Ver todos los precios <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* PRECIO DESTACADO */}
      <section style={{ background: 'linear-gradient(135deg, #1A1AD4 0%, #2D2BB5 50%, #1565C0 100%)', padding: '60px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 30, padding: '5px 16px', marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#A8FFEA', letterSpacing: 2, textTransform: 'uppercase' }}>🛒 Cyber Day · Oferta para {city.name}</span>
          </div>
          <div style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontStyle: 'italic', fontWeight: 900, color: T.white, marginBottom: 8 }}>Tu Sitio Web Profesional</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>por solo</span>
            <span style={{ fontSize: 'clamp(48px, 7vw, 68px)', fontWeight: 900, color: T.white, letterSpacing: -2, lineHeight: 1 }}>$74.990</span>
            <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through', fontWeight: 500 }}>$99.990</span>
          </div>
          <div style={{ display: 'inline-block', borderBottom: '2px solid #A8FFEA', paddingBottom: 2, marginBottom: 24 }}>
            <span style={{ fontSize: 15, fontStyle: 'italic', fontWeight: 700, color: '#A8FFEA' }}>🛒 Precio Cyber Day por pocos días</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px 16px', marginBottom: 28, maxWidth: 560, margin: '0 auto 28px' }}>
            {['Dominio .cl 1 año gratis','Hosting 1 año gratis','Hasta 5 secciones','Formulario de contacto','Botón WhatsApp','Google Maps','3 correos corporativos','Indexado en Google'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <CheckCircle2 size={13} color="#A8FFEA" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>{f}</span>
              </div>
            ))}
          </div>
          <a href={WA} target="_blank" rel="noopener noreferrer" onClick={() => { px('Lead', { content_name: `Precio Cyber Day ${city.name}` }); ga('generate_lead', { item_name: `Precio Cyber Day ${city.name}` }) }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: T.white, color: T.blue, fontWeight: 800, fontSize: 16, padding: '16px 32px', borderRadius: 14, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.25)' }}>
            <WaIcon size={18} /> Quiero esta oferta en {city.name}
          </a>
        </div>
      </section>

      {/* #DigitalizandoChile */}
      <section style={{ background: T.light, padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: T.blue, letterSpacing: -1, marginBottom: 12 }}>
            #DigitalizandoChile 🇨🇱
          </div>
          <p style={{ fontSize: 15, color: T.gray, lineHeight: 1.7, maxWidth: 500, margin: '0 auto 24px' }}>
            Llevamos negocios de {city.name} y toda Chile al mundo digital. Con tecnología real, diseño a medida y resultados concretos.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: T.blueL, border: `1px solid ${T.border}`, borderRadius: 12, padding: '10px 18px' }}>
            <img src="/proveedor-del-estado.png" alt="Proveedor del Estado" style={{ height: 28, objectFit: 'contain' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: T.blue }}>Empresa registrada en ChileCompra · MercadoPúblico</span>
          </div>
        </div>
      </section>

      {/* CLIENTES LOGOS */}
      <section style={{ background: T.white, padding: '60px 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', marginBottom: 32, padding: '0 20px' }}>
          <div style={{ display: 'inline-block', background: T.blueL, color: T.blue, fontWeight: 700, fontSize: 11, letterSpacing: 1.5, padding: '4px 14px', borderRadius: 20, marginBottom: 12 }}>NUESTROS CLIENTES</div>
          <h3 style={{ fontSize: 22, fontWeight: 900, color: T.black, letterSpacing: -.5 }}>Empresas que ya confiaron en nosotros</h3>
        </div>
        <style>{`
          @keyframes seo-marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
          .seo-marquee-track { display: flex; width: max-content; animation: seo-marquee 30s linear infinite; }
          .seo-marquee-track:hover { animation-play-state: paused; }
          .seo-logo-item { flex-shrink: 0; width: 140px; height: 72px; margin: 0 10px; display: flex; align-items: center; justify-content: center; background: #F4F4F8; border: 1px solid #E0E0EA; border-radius: 12px; padding: 10px 14px; filter: grayscale(100%) opacity(0.6); transition: filter .3s; }
          .seo-logo-item:hover { filter: grayscale(0%) opacity(1); }
          .seo-logo-item img { max-width: 100px; max-height: 48px; object-fit: contain; }
        `}</style>
        <div style={{ overflow: 'hidden' }}>
          <div className="seo-marquee-track">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <div key={i} className="seo-logo-item">
                <img src={`/clientes/${logo}`} alt="cliente agenciasi" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ background: `linear-gradient(135deg, #0A0A14 0%, #0F0F30 100%)`, padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ fontSize: 38, marginBottom: 14 }}>🚀</div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 900, color: T.white, letterSpacing: -1, marginBottom: 14, lineHeight: 1.2 }}>
            ¿Listo para tener tu web<br />en {city.name}?
          </h2>
          <p style={{ fontSize: 16, color: '#B0B0D0', marginBottom: 32, lineHeight: 1.7 }}>
            Escríbenos ahora. Te respondemos en menos de 2 horas.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
            <a href={WA} target="_blank" rel="noopener noreferrer" onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              style={{ background: '#25D366', color: T.white, fontWeight: 800, fontSize: 16, padding: '16px 32px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', boxShadow: '0 8px 32px rgba(37,211,102,.45)' }}>
              <WaIcon size={20} /> Cotizar en {city.name}
            </a>
            <a href={WA_REU} target="_blank" rel="noopener noreferrer" onClick={() => { px('Schedule'); ga('schedule_appointment') }}
              style={{ background: 'transparent', color: T.white, fontWeight: 700, fontSize: 15, padding: '16px 24px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.3)' }}>
              <Calendar size={16} /> Agendar reunión
            </a>
          </div>
          <p style={{ fontSize: 12, color: '#6060A0' }}>
            +56 9 3293 0812 · contacto@agenciasi.cl
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#050508', padding: '24px 20px', borderTop: '1px solid #1A1A2E' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ background: T.blue, borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={13} color="#fff" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: T.white }}>AgenciaSI</span>
          </Link>
          <span style={{ fontSize: 12, color: '#404060' }}>© 2026 AgenciaSI · Desarrollo web en {city.name} · Chile</span>
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

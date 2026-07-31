import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ArrowRight, Code2, Building2, Handshake, Mail,
  MapPin, CheckCircle2, ExternalLink, Award,
  Clock, BadgeCheck, DollarSign,
  Image, Navigation, Type, Receipt, Shirt, PanelTop, IdCard, Ticket, ShoppingBag, Trophy,
} from 'lucide-react'

const T = {
  bg:      '#000000',
  panel:   '#0A0A0A',
  panel2:  '#0D0D0D',
  border:  '#1E1E1E',
  border2: '#2A2A2A',
  white:   '#F2F2F2',
  gray:    '#8C8C8C',
  grayLt:  '#B5B5B5',
  grayDk:  '#4A4A4A',
  silver:  '#C9C9C9',
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
  { icon: Image,       title: 'Tela PVC y Lonas',            desc: 'Gigantografías, banners y fachadas en lona PVC de alta resolución, listas para exterior en {city}.' },
  { icon: Navigation,  title: 'Señaléticas',                  desc: 'Directorios, numeración y señalética normativa para oficinas, locales y edificios corporativos.' },
  { icon: Type,        title: 'Letreros Volumétricos',        desc: 'Acrílico, PVC y LED para fachadas que se ven desde la calle. Fabricación e instalación incluida.' },
  { icon: Receipt,     title: 'Talonarios y Facturación',     desc: 'Boletas, guías de despacho y recibos numerados, impresos y foliados según lo que necesite tu empresa.' },
  { icon: Shirt,       title: 'Ropa Corporativa',              desc: 'Poleras, chalecos y uniformes bordados o estampados con tu logo, en la cantidad que tu equipo requiera.' },
  { icon: PanelTop,    title: 'Pendones y Roller Screens',     desc: 'Ideal para ferias, eventos y puntos de venta en {city}. Estructura y gráfica lista para armar en minutos.' },
  { icon: IdCard,      title: 'Tarjetas de Presentación',      desc: 'Impresión offset o digital, con o sin barniz UV, para todo tu equipo comercial.' },
  { icon: Ticket,      title: 'Lanyards Personalizados',       desc: 'Para congresos, capacitaciones y acreditaciones de eventos corporativos.' },
  { icon: ShoppingBag, title: 'Bolsas TNT',                    desc: 'Bolsas ecológicas personalizadas para regalos corporativos, ferias o retail.' },
  { icon: Trophy,      title: 'Trofeos y Galvanos',            desc: 'Reconocimientos y premiaciones para aniversarios, metas de venta y eventos internos.' },
]

const PROCESO = [
  { n: '01', t: 'Nos cuentas qué necesitas',          d: 'Cantidad, plazo y presupuesto. Cotizamos por WhatsApp en menos de 24 horas.' },
  { n: '02', t: 'Ves la muestra antes de producir',    d: 'Apruebas diseño y muestra antes de fabricar el volumen completo — sin sorpresas.' },
  { n: '03', t: 'Producción con control de calidad',   d: 'Cada pieza sale revisada de nuestro taller, bajo el mismo estándar en todo el pedido.' },
  { n: '04', t: 'Entrega en la fecha comprometida',    d: 'Despacho a tus oficinas, sucursales o directo al evento — cuando dijimos que llegaría.' },
]

const RESULTADOS = [
  { value: '100%', label: 'Cumplimiento de plazos', sub: 'entregamos cuando decimos que entregamos' },
  { value: '10+',  label: 'Líneas de productos',     sub: 'imprenta, señalética, textil y merchandising' },
  { value: '30+',  label: 'Comunas con cobertura',   sub: 'Región del Maule y otras regiones' },
  { value: '100%', label: 'Facturación electrónica', sub: 'empresa formal, sin informalidad' },
]

export default function CorporateSEOLocal({ city }) {
  const WA      = `${WA_BASE}${encodeURIComponent(`Hola, represento a una empresa en ${city.name} y me interesa cotizar productos de publicidad corporativa (señalética, ropa, tarjetas, lanyards, etc.) a volumen.`)}`
  const WA_FAST = `${WA_BASE}${encodeURIComponent(`Hola, quiero cotizar productos de publicidad e imprenta corporativa para mi empresa en ${city.name}.`)}`
  const EMAIL   = `mailto:contacto@agenciasi.cl?subject=${encodeURIComponent(`Cotización publicidad corporativa — ${city.name}`)}&body=${encodeURIComponent(`Hola, represento a una empresa en ${city.name} y quiero cotizar productos de publicidad corporativa (señalética, ropa, tarjetas, lanyards, etc.) a volumen.`)}`

  useEffect(() => {
    px('ViewContent', { content_name: `Corporate SEO ${city.name}` })
    ga('view_item', { item_name: `Corporate SEO ${city.name}`, item_category: 'imprenta_corporativa' })
  }, [city.name])

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'AgenciaSI',
    url: `https://agenciasi.cl/publicidad-corporativa/${city.slug}`,
    logo: 'https://agenciasi.cl/favicon.png',
    description: `Publicidad e imprenta corporativa en ${city.name}: tela PVC, señalética, letreros, talonarios, ropa corporativa, pendones, tarjetas, lanyards, bolsas TNT, trofeos y galvanos. Producción a volumen para empresas.`,
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
      name: `Publicidad e Imprenta Corporativa en ${city.name}`,
      itemListElement: PRODUCTOS.map(p => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Product', name: p.title, description: p.desc.replace('{city}', city.name) },
      })),
    },
  }

  return (
    <div style={{ fontFamily: "'Poppins', system-ui, sans-serif", background: T.bg, color: T.white, overflowX: 'hidden' }}>
      <Helmet>
        <title>Publicidad Corporativa en {city.name} | Imprenta y Merchandising — AgenciaSI</title>
        <meta name="description" content={`Señalética, letreros, ropa corporativa, tarjetas, pendones, lanyards, bolsas TNT y trofeos en ${city.name}. Producción a volumen con cumplimiento de plazos y precios justos.`} />
        <link rel="canonical" href={`https://agenciasi.cl/publicidad-corporativa/${city.slug}`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`Publicidad Corporativa en ${city.name} | AgenciaSI`} />
        <meta property="og:description" content={`Imprenta y merchandising corporativo para empresas de ${city.name}: señalética, ropa, tarjetas, lanyards, trofeos y más — a volumen y con precios justos.`} />
        <meta property="og:url" content={`https://agenciasi.cl/publicidad-corporativa/${city.slug}`} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <style>{`
        @keyframes csl-marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .csl-track { display:flex; width:max-content; animation:csl-marquee 34s linear infinite; }
        .csl-track:hover { animation-play-state:paused; }
        .csl-logo { flex-shrink:0; width:148px; height:80px; margin:0 10px; display:flex; align-items:center; justify-content:center; background:#0E0E0E; border:1px solid ${T.border}; border-radius:12px; padding:12px 16px; filter:grayscale(100%) opacity(.5); transition:filter .3s, border-color .3s; }
        .csl-logo:hover { filter:grayscale(0%) opacity(1); border-color:${T.border2}; }
        .csl-logo img { max-width:108px; max-height:50px; object-fit:contain; }
        .csl-svc-card { background:${T.panel}; border:1px solid ${T.border}; border-radius:16px; padding:28px 24px; transition:border-color .3s, transform .2s, background .3s; }
        .csl-svc-card:hover { border-color:${T.border2}; background:${T.panel2}; transform:translateY(-3px); }
        .csl-cta-primary { background:${T.white}; color:#000; }
        .csl-cta-primary:hover { background:${T.silver}; }
        @media(max-width:900px) { .csl-hero-grid{grid-template-columns:1fr!important;} .csl-grid{grid-template-columns:1fr!important;} }
        @media(max-width:640px) { .csl-stats{grid-template-columns:1fr 1fr!important;} }
        @media(max-width:480px) { .csl-nav-city{display:none!important;} }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(0,0,0,.9)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: T.white, borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={16} color="#000" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: T.white, letterSpacing: -.3 }}>AgenciaSI</div>
              <div style={{ fontSize: 9, color: T.gray, marginTop: -2 }}>Imprenta y publicidad corporativa</div>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: T.gray, display: 'flex', alignItems: 'center', gap: 4 }} className="csl-nav-city">
              <MapPin size={11} color={T.silver} /> {city.name}
            </span>
            <a href={EMAIL} onClick={() => { px('Contact'); ga('contact', { method: 'email' }) }}
              style={{ width: 38, height: 38, borderRadius: 8, border: `1px solid ${T.border2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.white, textDecoration: 'none', flexShrink: 0 }}
              aria-label="Escribir al correo" title="Escribir al correo">
              <Mail size={15} />
            </a>
            <a href={WA_FAST} target="_blank" rel="noopener noreferrer" onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              className="csl-cta-primary"
              style={{ fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
              Cotizar por WhatsApp <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: T.bg, padding: '96px 24px 88px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -140, left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,.045) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: T.panel, border: `1px solid ${T.border2}`, borderRadius: 30, padding: '6px 16px', marginBottom: 26 }}>
            <Building2 size={13} color={T.silver} />
            <span style={{ fontSize: 11, fontWeight: 700, color: T.silver, letterSpacing: 1.2 }}>IMPRENTA Y PUBLICIDAD CORPORATIVA · {city.name.toUpperCase()} · {city.region.toUpperCase()}</span>
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.2rem, 4.6vw, 3.8rem)', fontWeight: 700, color: T.white, lineHeight: 1.15, marginBottom: 22, letterSpacing: -.5 }}>
            Lo que toda empresa busca en un proveedor:<br /><em style={{ fontWeight: 400, color: T.grayLt }}>cumplir, con calidad y a buen precio.</em>
          </h1>
          <p style={{ fontSize: 'clamp(14px, 1.8vw, 17px)', color: T.gray, lineHeight: 1.75, maxWidth: 620, margin: '0 auto 36px' }}>
            Fabricamos e imprimimos a volumen para empresas de {city.name}: señalética, letreros, ropa corporativa, tarjetas, pendones, lanyards, bolsas TNT, trofeos y más — con el mismo estándar de calidad en cada pedido, entregado en la fecha que prometemos.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 40 }}>
            <a href={WA_FAST} target="_blank" rel="noopener noreferrer" onClick={() => { px('Lead', { content_name: `Corporate CTA ${city.name}` }); ga('generate_lead', { item_name: `Corporate CTA ${city.name}` }) }}
              className="csl-cta-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 14, padding: '14px 30px', borderRadius: 8, textDecoration: 'none' }}>
              <WaIcon size={16} /> Cotizar por WhatsApp
            </a>
            <a href={EMAIL} onClick={() => { px('Contact'); ga('contact', { method: 'email' }) }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: T.white, fontWeight: 600, fontSize: 14, padding: '14px 24px', borderRadius: 8, textDecoration: 'none', border: `1.5px solid ${T.border2}` }}>
              <Mail size={15} /> Escribir al correo
            </a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {[
              { icon: Clock,        text: 'Entregas a tiempo, siempre' },
              { icon: BadgeCheck,   text: 'Calidad consistente, sin variaciones' },
              { icon: DollarSign,   text: 'Precios justos y transparentes' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: T.grayLt }}>
                <Icon size={14} color={T.silver} /> {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, background: T.panel, padding: '28px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, textAlign: 'center' }} className="csl-stats">
          {RESULTADOS.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 30, fontWeight: 700, color: T.white, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.grayLt, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: T.gray }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTOS */}
      <section style={{ background: T.bg, padding: '84px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: T.silver, marginBottom: 12 }}>Qué producimos para tu empresa en {city.name}</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: T.white, lineHeight: 1.15 }}>
              Imprenta y merchandising corporativo,<br />todo bajo un mismo proveedor.
            </h2>
            <p style={{ fontSize: 15, color: T.gray, maxWidth: 520, margin: '14px auto 0', lineHeight: 1.75 }}>
              Sabemos lo que se busca al elegir proveedor en {city.name}: cumplimiento, calidad, profesionalismo y precios justos. Trabajamos con procesos que lo garantizan, pedido tras pedido.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }} className="csl-grid">
            {PRODUCTOS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="csl-svc-card">
                <div style={{ width: 48, height: 48, borderRadius: 12, background: T.panel2, border: `1px solid ${T.border2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={22} color={T.silver} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: T.white, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: T.gray, lineHeight: 1.7 }}>{desc.replace('{city}', city.name)}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <p style={{ fontSize: 13, color: T.gray, marginBottom: 16 }}>¿No ves lo que necesitas en la lista? Igual podemos ayudarte.</p>
            <a href={WA_FAST} target="_blank" rel="noopener noreferrer" onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'transparent', color: T.white, fontWeight: 700, fontSize: 13, padding: '11px 22px', borderRadius: 30, textDecoration: 'none', border: `1px solid ${T.border2}` }}>
              <WaIcon size={14} /> Cuéntanos qué necesitas
            </a>
          </div>
        </div>
      </section>

      {/* POR QUÉ / OFERTA CORPORATIVA */}
      <section style={{ background: T.panel, padding: '84px 24px', borderTop: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="csl-hero-grid">
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: T.silver, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 20, height: 2, background: T.silver, display: 'inline-block', borderRadius: 2 }} />
              Lo que se busca al elegir proveedor en la zona
            </p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, color: T.white, lineHeight: 1.15, marginBottom: 20 }}>
              Cumplimiento, calidad y trato profesional — sin excusas.
            </h2>
            <p style={{ fontSize: 15, color: T.gray, lineHeight: 1.8, marginBottom: 28 }}>
              Comprar señalética, ropa, tarjetas y merchandising a proveedores distintos termina en plazos que no calzan, calidad dispareja entre productos y precios que cambian pedido a pedido. Nosotros centralizamos la producción bajo un mismo estándar — y a un precio que se sostiene en el tiempo.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: Clock,      text: 'Cumplimos los plazos que prometemos' },
                { icon: BadgeCheck, text: 'Calidad consistente en cada entrega' },
                { icon: Handshake,  text: 'Profesionalismo de principio a fin' },
                { icon: DollarSign, text: 'Precios justos, sin letra chica' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: T.panel2, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color={T.silver} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: T.white }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: T.bg, border: `1px solid ${T.border2}`, borderRadius: 20, padding: '40px 36px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: T.panel2, border: `1px solid ${T.border2}`, borderRadius: 12, padding: '10px 16px', marginBottom: 28 }}>
              <img src="/proveedor-del-estado.png" alt="Proveedor del Estado" style={{ height: 26, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: T.white }}>Proveedor del Estado</div>
                <div style={{ fontSize: 10, color: T.gray }}>Registrados en ChileCompra · MercadoPúblico</div>
              </div>
            </div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.3rem, 2.2vw, 1.9rem)', fontWeight: 700, color: T.white, lineHeight: 1.2, marginBottom: 22 }}>
              Listos para pedidos corporativos y licitaciones.
            </h3>
            {[
              'Plazos comprometidos por escrito, no de palabra',
              'Facturación electrónica y contratos formales',
              'Documentación lista para licitaciones públicas',
              'Muestra de diseño antes de producir el volumen completo',
              'Despacho coordinado a tus oficinas o sucursales',
              'Precios claros desde la primera cotización, sin sorpresas',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11 }}>
                <CheckCircle2 size={13} color={T.silver} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: T.grayLt }}>{item}</span>
              </div>
            ))}
            <a href={WA_FAST} target="_blank" rel="noopener noreferrer" onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              className="csl-cta-primary"
              style={{ marginTop: 26, display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 13, padding: '12px 22px', borderRadius: 8, textDecoration: 'none' }}>
              <WaIcon size={15} /> Cotizar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section style={{ background: T.bg, padding: '84px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: T.silver, marginBottom: 12 }}>Cómo funciona tu pedido</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.7rem, 2.8vw, 2.3rem)', fontWeight: 700, color: T.white, lineHeight: 1.15 }}>
              Así se produce tu pedido, paso a paso.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 28 }}>
            {PROCESO.map(({ n, t, d }) => (
              <div key={n} style={{ padding: '6px 0', borderTop: `2px solid ${T.border}` }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, fontWeight: 700, color: T.silver, lineHeight: 1, marginBottom: 10 }}>{n}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: T.white, marginBottom: 8 }}>{t}</div>
                <div style={{ fontSize: 12, color: T.gray, lineHeight: 1.75 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COBERTURA */}
      <section style={{ background: T.panel, padding: '80px 24px', borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: T.silver, marginBottom: 14 }}>Cobertura</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)', fontWeight: 700, color: T.white, lineHeight: 1.2, marginBottom: 16 }}>
            No importa cuántas sucursales tengas en {city.region}.
          </h2>
          <p style={{ fontSize: 14, color: T.gray, lineHeight: 1.8 }}>
            Operamos en las 30 comunas de la Región del Maule y despachamos también a empresas con presencia en otras regiones de Chile. Mismo estándar de calidad, sin importar cuántas oficinas, locales o sucursales tengas que abastecer.
          </p>
        </div>
      </section>

      {/* CLIENTES */}
      <section style={{ background: T.bg, padding: '72px 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', padding: '0 24px', marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: T.silver, marginBottom: 12 }}>Empresas que confían en nosotros</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)', fontWeight: 700, color: T.white, marginBottom: 10 }}>
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
      <section style={{ background: T.panel, padding: '88px 24px', textAlign: 'center', borderTop: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: T.bg, border: `1px solid ${T.border2}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={26} color={T.silver} />
            </div>
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)', fontWeight: 700, color: T.white, lineHeight: 1.2, marginBottom: 16 }}>
            Hablemos de tu próximo pedido en {city.name}.
          </h2>
          <p style={{ fontSize: 15, color: T.gray, marginBottom: 34, lineHeight: 1.75 }}>
            Cuéntanos qué necesitas producir — señalética, ropa, tarjetas, trofeos o cualquier otra pieza corporativa. Respondemos por WhatsApp o correo con plazos y precio claros desde el primer mensaje.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
            <a href={WA_FAST} target="_blank" rel="noopener noreferrer" onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              className="csl-cta-primary"
              style={{ fontWeight: 800, fontSize: 15, padding: '15px 30px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <WaIcon size={17} /> Cotizar por WhatsApp
            </a>
            <a href={EMAIL} onClick={() => { px('Contact'); ga('contact', { method: 'email' }) }}
              style={{ background: 'transparent', color: T.white, fontWeight: 700, fontSize: 14, padding: '15px 24px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', border: `1.5px solid ${T.border2}` }}>
              <Mail size={16} /> Escribir al correo
            </a>
          </div>
          <p style={{ fontSize: 12, color: T.gray }}>+56 9 3293 0812 · <a href={EMAIL} style={{ color: T.gray, textDecoration: 'underline' }}>contacto@agenciasi.cl</a></p>
          <Link to="/" style={{ fontSize: 12, color: T.grayDk, textDecoration: 'none', display: 'inline-block', marginTop: 10 }}>
            Ver todos los servicios →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: T.bg, padding: '24px', borderTop: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ background: T.white, borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={13} color="#000" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: T.white }}>AgenciaSI</span>
          </Link>
          <span style={{ fontSize: 12, color: T.grayDk }}>© 2026 AgenciaSI · Publicidad corporativa en {city.name} · Chile</span>
          <Link to="/" style={{ fontSize: 12, color: T.grayDk, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
            Inicio <ExternalLink size={11} />
          </Link>
        </div>
      </footer>

      {/* FLOATING WA */}
      <a href={WA} target="_blank" rel="noopener noreferrer" onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
        style={{ position: 'fixed', bottom: 24, right: 24, background: '#25D366', color: '#fff', width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 24px rgba(37,211,102,.55)', zIndex: 100, textDecoration: 'none' }}>
        <WaIcon size={26} />
      </a>
    </div>
  )
}

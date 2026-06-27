import { useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ArrowRight, MapPin, CheckCircle2, Shield,
  Zap, Lightbulb, Layers, SquareStack,
  Monitor, Tag, ExternalLink, Code2
} from 'lucide-react'

/* ─── CONSTANTS ─────────────────────────────────────────── */
const WA_BASE = 'https://wa.me/56932930812?text='
const px = (ev, p) => { if (typeof fbq !== 'undefined') fbq('track', ev, p) }
const ga = (ev, p) => { if (typeof gtag !== 'undefined') gtag('event', ev, p) }

const LOGOS = [
  'astro-entretenimientos.svg','capitol-group.svg','espacio-cea.svg','guardias-cl.svg',
  'premiumlav.svg','calces.svg','vision-eventos.svg','solar-espectaculo.svg',
  'cft-araucania.svg','zona-plaga.svg','naturalpetworld.webp','hiiaka-dental.webp',
  'valoramos.webp','pili-orfebre.webp','centro-kinesico.webp','pacifico-salud.webp',
  'daza-maquinarias.webp','espacio-blue.webp','entrelluvias-sabores.webp','schopchile.webp',
  'ambulancias-pacifico.webp','asysam.webp','consultora-lawen.webp','d-tolentino.webp',
  'capitol-training.webp','limari-travel.webp','barras-pole-dance.webp','now-pos.png','lbepv.png',
]

const GALERIA = [
  { slug: 'letras-acrilico-fachada', label: 'El letrero que para a la gente',  sub: 'Letras volumétricas · Acrílico · Tu logo en 3D', glow: '#FF6B00', emoji: '🔤', span: 'big' },
  { slug: 'letrero-led-tienda',       label: 'Vende también de noche',           sub: 'Letreros LED · Backlit · Visible las 24h',       glow: '#FFD700', emoji: '💡', span: '' },
  { slug: 'vinilo-vitrina',           label: 'Transforma cualquier superficie',  sub: 'Vinilos · Ploteo · Corte láser',                  glow: '#FF00FF', emoji: '🎨', span: '' },
  { slug: 'totem-publicitario',       label: 'Te ubican desde la calle',         sub: 'Tótem · PVC · Foam · Señalización exterior',      glow: '#00FFAA', emoji: '🏢', span: 'wide' },
  { slug: 'letras-mdf-restaurante',  label: 'Transmite calidad en cada detalle', sub: 'MDF · Madera · Doradas · Barnizadas',            glow: '#FF8C00', emoji: '🪵', span: '' },
  { slug: 'senaletica-oficina',       label: 'Guía a tus clientes adentro',      sub: 'Señalética · Directorio · Rotulación interna',    glow: '#00CFFF', emoji: '🔖', span: '' },
]

const PRODUCTOS = [
  {
    icon: SquareStack,
    nombre: 'Letras Volumétricas en Acrílico',
    desc: 'Tu logo o nombre en 3D, visible desde 50 metros. El material preferido por los negocios que quieren transmitir calidad desde la calle. Dura más de 10 años sin decolorarse.',
    glow: '#FF6B00', tag: 'El más pedido',
  },
  {
    icon: Lightbulb,
    nombre: 'Letreros Luminosos LED',
    desc: 'Tu negocio trabaja mientras tú duermes. Caja de luz backlit o frontlit — visible a cualquier hora, con un consumo eléctrico mínimo. Ideal si abres de noche o en locales cerrados.',
    glow: '#FFD700', tag: 'Efecto inmediato',
  },
  {
    icon: Monitor,
    nombre: 'Fachada Corporativa Completa',
    desc: 'La primera impresión lo es todo. Diseñamos e instalamos toda tu identidad en fachada: letras, vinilos, señalética y más. Un solo proveedor, un solo precio, cero dolores de cabeza.',
    glow: '#FF6B00', tag: 'Todo incluido',
  },
  {
    icon: Layers,
    nombre: 'Letras de Alto Impacto (PVC)',
    desc: 'La opción inteligente para quienes necesitan calidad sin pagar de más. PVC rígido de alta densidad — se ve profesional, aguanta la intemperie y no pesa nada en tu fachada.',
    glow: '#FF4500', tag: null,
  },
  {
    icon: Zap,
    nombre: 'Tótem Publicitario',
    desc: '¿Tu local está en galería o no tiene fachada propia? El tótem te pone en el mapa. Estructura vertical independiente que se ubica donde más te convenga.',
    glow: '#00FFAA', tag: null,
  },
  {
    icon: Tag,
    nombre: 'Vinilos y Ploteo',
    desc: 'La forma más económica de transformar una vitrina, pared o vehículo en publicidad. Corte láser o impresión digital de alta resolución con laminado UV que no se despega.',
    glow: '#FF00FF', tag: null,
  },
  {
    icon: SquareStack,
    nombre: 'Letras en MDF y Madera',
    desc: 'Para los negocios que quieren transmitir calidez y exclusividad: restaurantes, hoteles, spas, clínicas. Pintadas, doradas o barnizadas según tu identidad de marca.',
    glow: '#FF8C00', tag: null,
  },
  {
    icon: ExternalLink,
    nombre: 'Señalética y Rotulación',
    desc: 'Un cliente que no sabe dónde ir dentro de tu local, se va. Señalética clara de directorio, numeración, emergencia y corporativa. Guía, no confundas.',
    glow: '#00CFFF', tag: null,
  },
  {
    icon: ArrowRight,
    nombre: 'Banners, Roll-Ups y Lonas',
    desc: 'Para ferias, eventos, aperturas y promociones. Impresión de alta resolución con bastidor o sin él. Se monta en minutos y genera impacto visual inmediato.',
    glow: '#A855F7', tag: null,
  },
]

const SECTORES = [
  {
    emoji: '🏥',
    titulo: 'Salud & Bienestar',
    rubros: 'Clínicas · Dentistas · Psicólogos · Pilates · Yoga · Centros de estética',
    desc: 'Tu letrero comunica profesionalismo antes de que el paciente cruce la puerta. Acrílico blanco, señalética limpia, tipografía seria. La primera impresión decide si confían en ti.',
    producto: 'Letras acrílico blanco · Señalética interna · Ploteo de vitrina',
    color: '#64B5F6',
    bg: '#040C18',
    cls: '',
  },
  {
    emoji: '🍸',
    titulo: 'Nightlife & Entretenimiento',
    rubros: 'Discotecas · Pubs · Bares · Karaoke · Salones de eventos · Casinos',
    desc: 'Aquí sí puedes gritar en colores. Letreros que se roban la noche: LED de colores, cajas de luz llamativas y fachadas que se ven desde el otro lado de la calle.',
    producto: 'LED RGB · Caja de luz · Letreros iluminados · Vinilos de impacto',
    color: '#CE93D8',
    bg: '#0E0A1A',
    cls: 'nightlife',
  },
  {
    emoji: '💆',
    titulo: 'Spa & Estética Premium',
    rubros: 'Spas · Centros de belleza · Peluquerías · Salones · Dermatología estética',
    desc: 'La clienta que entra a un spa ya está juzgando por la puerta. Letras en MDF doradas o en acrílico espejo, señalética elegante que dice "aquí se viene a mimar".',
    producto: 'Letras MDF doradas · Acrílico espejo · Señalética premium',
    color: '#F4C2A1',
    bg: '#1A0D08',
    cls: '',
  },
  {
    emoji: '💪',
    titulo: 'Gym & Fitness',
    rubros: 'Gimnasios · CrossFit · Artes marciales · Natación · Spinning · Padel',
    desc: 'Grande, bold y que se vea desde el estacionamiento. Tu letrero tiene que motivar antes de que el cliente entre. Sin timidez — este letrero tiene que competir con la calle.',
    producto: 'Letras alto impacto oversized · Tótem exterior · Vinilos de pared',
    color: '#EF5350',
    bg: '#1A0606',
    cls: '',
  },
  {
    emoji: '🍽️',
    titulo: 'Gastronomía',
    rubros: 'Restaurantes · Cafés · Panaderías · Sushi · Pizzerías · Cocina de autor',
    desc: 'El letrero que hace parar al transeúnte hambriento. Cálido, apetitoso y visible de día y de noche. Tu nombre en la fachada es tu cartel de bienvenida permanente.',
    producto: 'LED cálido · Letras MDF barnizadas · Tótem exterior · Carta luminosa',
    color: '#FFB74D',
    bg: '#1A0E00',
    cls: '',
  },
  {
    emoji: '🏢',
    titulo: 'Corporativo & Servicios',
    rubros: 'Oficinas · Notarías · Contadores · Seguros · Inmobiliarias · Colegios',
    desc: 'La seriedad de tu empresa empieza por la puerta. Señalética corporativa, directorio de oficinas y fachada institucional que proyectan trayectoria y confianza desde el exterior.',
    producto: 'Letras PVC negro o blanco · Señalética directorio · Fachada corporativa',
    color: '#90CAF9',
    bg: '#06101A',
    cls: '',
  },
]

const PASOS = [
  { n: '01', titulo: 'Nos mandas una foto de tu fachada',    desc: 'Por WhatsApp, gratis y sin compromiso. Con eso nos basta para darte un presupuesto real en menos de 24 horas.' },
  { n: '02', titulo: 'Ves el diseño antes de pagar un peso', desc: 'Te enviamos cómo quedaría el letrero en TU local real. Apruebas cada detalle — solo entonces producimos.' },
  { n: '03', titulo: 'Producción con garantía de calidad',   desc: 'Cada pieza sale revisada de nuestro taller. Sabes exactamente cuándo llega antes de que salga.' },
  { n: '04', titulo: 'Lo instalamos donde necesitas',         desc: 'Coordinamos la instalación directamente contigo. Sin sorpresas, sin retrasos. En todo el Maule.' },
]

/* ─── PARTICLE CANVAS ───────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    const mouse = { x: -9999, y: -9999 }

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = e => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    canvas.addEventListener('mousemove', onMove)

    const N = window.innerWidth < 600 ? 40 : 80
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - .5) * .45,
      vy: (Math.random() - .5) * .45,
      r: Math.random() * 1.8 + .4,
    }))

    const frame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of pts) {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const d  = Math.hypot(dx, dy)
        if (d < 110) {
          p.vx += (dx / d) * .28
          p.vy += (dy / d) * .28
        }
        const spd = Math.hypot(p.vx, p.vy)
        if (spd > 1.6) { p.vx *= .94; p.vy *= .94 }
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(249,115,22,.85)'
        ctx.fill()
      }

      // particle-to-particle lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)
          if (d < 130) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(249,115,22,${.18 * (1 - d / 130)})`
            ctx.lineWidth = .6
            ctx.stroke()
          }
        }
      }

      // particle-to-cursor lines
      for (const p of pts) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y)
        if (d < 160) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(249,115,22,${.45 * (1 - d / 160)})`
          ctx.lineWidth = .9
          ctx.stroke()
        }
      }

      animId = requestAnimationFrame(frame)
    }

    frame()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  )
}

/* ─── 3D TILT CARD ──────────────────────────────────────── */
function TiltCard({ children, glow, style = {} }) {
  const ref = useRef(null)

  const onMove = useCallback(e => {
    const el  = ref.current
    const r   = el.getBoundingClientRect()
    const rx  = ((e.clientY - r.top)  / r.height - .5) * -22
    const ry  = ((e.clientX - r.left) / r.width  - .5) *  22
    el.style.transform  = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`
    el.style.boxShadow  = `0 24px 64px ${glow}55, 0 0 0 1px ${glow}40, inset 0 0 40px ${glow}08`
  }, [glow])

  const onLeave = useCallback(() => {
    const el = ref.current
    el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)'
    el.style.boxShadow = `0 6px 24px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.06)`
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        borderRadius: 18,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform .18s ease, box-shadow .3s ease',
        boxShadow: '0 6px 24px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.06)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ─── WAICON ────────────────────────────────────────────── */
const WaIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

/* ─── GLOBAL CSS ─────────────────────────────────────────── */
const CSS = `
  @keyframes lst-marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes nightlife-pulse {
    0%,100% { box-shadow:0 0 0 1px #CE93D830, 0 8px 32px #CE93D815; }
    50%      { box-shadow:0 0 0 1px #CE93D870, 0 8px 48px #CE93D840; }
  }

  .accent-word {
    color:#FF6B00;
    font-style:italic;
    font-weight:400;
  }
  .lst-track { display:flex; width:max-content; animation:lst-marquee 34s linear infinite; }
  .lst-track:hover { animation-play-state:paused; }
  .lst-logo { flex-shrink:0;width:148px;height:80px;margin:0 10px;display:flex;align-items:center;justify-content:center;
    background:#111;border:1px solid #222;border-radius:12px;padding:12px 16px;
    filter:grayscale(100%) opacity(.45);transition:filter .3s,border-color .3s; }
  .lst-logo:hover { filter:grayscale(0%) opacity(1); border-color:#F97316; }
  .lst-logo img { max-width:108px;max-height:50px;object-fit:contain; }

  /* Gallery grid */
  .gal-grid {
    display:grid;
    grid-template-columns:repeat(4,1fr);
    grid-template-rows:240px 240px;
    gap:14px;
  }
  .gal-big  { grid-column:span 2; grid-row:span 2; }
  .gal-wide { grid-column:span 2; }

  /* Product neon cards */
  .prod-card {
    background:#0A0A0A;
    border:1px solid #1C1C1C;
    border-radius:16px;
    padding:28px 22px;
    transition:border-color .3s, box-shadow .3s, transform .25s;
    position:relative;
    overflow:hidden;
  }
  .prod-card::before {
    content:'';
    position:absolute;
    inset:0;
    border-radius:16px;
    background:var(--glow);
    opacity:0;
    transition:opacity .35s;
    pointer-events:none;
  }
  .prod-card:hover::before { opacity:.05; }
  .prod-card:hover {
    border-color:var(--accent);
    box-shadow:0 0 0 1px var(--accent), 0 8px 32px var(--glow);
    transform:translateY(-4px);
  }

  /* Process steps */
  .step-n {
    font-family:'Playfair Display',serif;
    font-size:72px;
    font-weight:700;
    line-height:1;
    color:transparent;
    -webkit-text-stroke:1px #2A2A2A;
    margin-bottom:4px;
    transition:color .3s,-webkit-text-stroke-color .3s;
  }
  .step-wrap:hover .step-n {
    color:#FF6B00;
    -webkit-text-stroke-color:#FF6B00;
  }

  /* Sector cards */
  .sector-card {
    border-radius:16px;
    padding:28px 24px;
    border:1px solid #1A1A1A;
    transition:border-color .3s, transform .25s;
    position:relative;
    overflow:hidden;
  }
  .sector-card:hover { transform:translateY(-4px); }
  .sector-card.nightlife { animation:nightlife-pulse 3s ease-in-out infinite; }
  .sector-card.nightlife:hover { animation:none; box-shadow:0 0 0 1px #CE93D880, 0 16px 48px #CE93D830; }

  @media(max-width:900px) {
    .gal-grid { grid-template-columns:repeat(2,1fr); grid-template-rows:auto; }
    .gal-big  { grid-column:span 2; min-height:260px; grid-row:span 1; }
    .gal-wide { grid-column:span 2; min-height:200px; }
  }
  @media(max-width:540px) {
    .gal-grid { grid-template-columns:1fr; }
    .gal-big,.gal-wide { grid-column:span 1; min-height:200px; }
    .lst-stats { grid-template-columns:1fr 1fr !important; }
    .lst-grid  { grid-template-columns:1fr !important; }
  }
`

/* ─── MAIN COMPONENT ─────────────────────────────────────── */
export default function LetrerosSEOLocal({ city }) {
  const WA      = `${WA_BASE}${encodeURIComponent(`Hola, me interesa cotizar un letrero volumétrico para mi negocio en ${city.name}. ¿Pueden ayudarme?`)}`
  const WA_FAST = `${WA_BASE}${encodeURIComponent(`Hola, quiero información sobre letreros y gráficas en ${city.name}.`)}`

  useEffect(() => {
    px('ViewContent', { content_name: `Letreros SEO ${city.name}` })
    ga('view_item', { item_name: `Letreros SEO ${city.name}`, item_category: 'letreros_graficas' })
  }, [city.name])

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'AgenciaSI Gráficas y Letreros',
    url: `https://agenciasi.cl/letreros/${city.slug}`,
    logo: 'https://agenciasi.cl/favicon.png',
    description: `Letreros volumétricos en ${city.name}: acrílico, PVC, LED, madera y foam. Fabricación e instalación en toda la Región del Maule. Cotización gratis.`,
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
  }

  return (
    <div style={{ fontFamily: "'Poppins', system-ui, sans-serif", background: '#000', color: '#fff', overflowX: 'hidden' }}>
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
      <style>{CSS}</style>

      {/* ── NAV ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(0,0,0,.88)', backdropFilter: 'blur(14px)', borderBottom: '1px solid #1A1A1A' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: '#FF6B00', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 14px #FF6B0080' }}>
              <Code2 size={15} color="#000" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: '#fff', letterSpacing: -.2 }}>AgenciaSI</div>
              <div style={{ fontSize: 9, color: '#555', marginTop: -2 }}>Gráficas y Letreros · Maule</div>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: '#555', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={11} color="#FF6B00" /> {city.name}
            </span>
            <a href={WA_FAST} target="_blank" rel="noopener noreferrer"
              onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              style={{ background: '#FF6B00', color: '#000', fontWeight: 800, fontSize: 12, padding: '9px 18px', borderRadius: 30, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', boxShadow: '0 0 18px #FF6B0060' }}>
              Cotizar gratis <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO + PARTÍCULAS ── */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', overflow: 'hidden' }}>
        <ParticleCanvas />
        {/* Radial glow behind text */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,.09) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid #FF6B0050', borderRadius: 30, padding: '6px 16px', marginBottom: 28, background: 'rgba(255,107,0,.07)' }}>
            <MapPin size={11} color="#FF6B00" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#FF6B00', letterSpacing: 1.5 }}>LETREROS · {city.name.toUpperCase()} · REGIÓN DEL MAULE</span>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.6rem, 7vw, 5.2rem)', fontWeight: 700, lineHeight: 1.05, marginBottom: 24, letterSpacing: -1 }}>
            <span style={{ color: '#fff' }}>Lo que proyectas desde afuera</span><br />
            <span className="accent-word">define lo que vendes adentro.</span>
          </h1>

          <p style={{ fontSize: 'clamp(14px, 2vw, 17px)', color: '#666', lineHeight: 1.8, maxWidth: 540, margin: '0 auto 14px', fontWeight: 300 }}>
            Cada día que {city.context} pasan frente a tu local sin entrar, es dinero que se va a la competencia. Un letrero volumétrico que llame la atención lo cambia todo — y nosotros lo fabricamos e instalamos en {city.name}.
          </p>
          <p style={{ fontSize: 12, color: '#FF6B00', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 44 }}>
            Diseño incluido · Instalación en {city.name} · Listo en 5 días
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 60 }}>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              onClick={() => { px('Lead', { content_name: `Letreros Hero ${city.name}` }); ga('generate_lead', { item_name: `Letreros Hero ${city.name}` }) }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#FF6B00', color: '#000', fontWeight: 800, fontSize: 14, padding: '14px 30px', borderRadius: 40, textDecoration: 'none', boxShadow: '0 0 32px #FF6B0070, 0 8px 24px rgba(0,0,0,.5)' }}>
              <WaIcon size={17} /> Cotizar mi letrero
            </a>
            <a href={WA_FAST} target="_blank" rel="noopener noreferrer"
              onClick={() => { px('Schedule'); ga('schedule_appointment') }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#999', fontWeight: 600, fontSize: 14, padding: '14px 24px', borderRadius: 40, textDecoration: 'none', border: '1px solid #2A2A2A' }}>
              Ver catálogo
            </a>
          </div>

          {/* Trust row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {[
              { icon: CheckCircle2, text: 'Cotización en 24h' },
              { icon: Shield,       text: 'Empresa formal · Facturamos' },
              { icon: CheckCircle2, text: 'Proveedor del Estado' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#444' }}>
                <Icon size={12} color="#FF6B00" /> {text}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom, transparent, #000)', pointerEvents: 'none' }} />
      </section>

      {/* ── STATS BAR ── */}
      <div style={{ background: '#000', borderTop: '1px solid #1A1A1A', borderBottom: '1px solid #1A1A1A', padding: '32px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, textAlign: 'center' }} className="lst-stats">
          {[
            { v: '+300',   l: 'Negocios con más visibilidad', s: 'letreros fabricados en el Maule' },
            { v: '5 días', l: 'Y tu letrero está listo',   s: 'desde que apruebas el diseño' },
            { v: '+10',    l: 'Años de vida útil',            s: 'acrílico y PVC de calidad garantizada' },
            { v: '30',     l: 'Comunas que atendemos',      s: 'llegamos a todo el Maule' },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, color: '#FF6B00', textShadow: '0 0 18px #FF6B0060', marginBottom: 4 }}>{s.v}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ccc', marginBottom: 2 }}>{s.l}</div>
              <div style={{ fontSize: 10, color: '#444' }}>{s.s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── GALERÍA 3D TILT ── */}
      <section style={{ background: '#030303', padding: '88px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#FF6B00', marginBottom: 14 }}>Trabajos realizados</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,3vw,3rem)', fontWeight: 700, color: '#fff', lineHeight: 1.0, marginBottom: 12 }}>
              Así se ve un negocio<br /><span className="accent-word" style={{ fontSize: '0.85em' }}>que no pasa desapercibido.</span>
            </h2>
            <p style={{ fontSize: 13, color: '#444', maxWidth: 420, margin: '0 auto' }}>Pasa el cursor sobre cada pieza. Así se verá el tuyo.</p>
          </div>

          <div className="gal-grid">
            {GALERIA.map(item => (
              <TiltCard key={item.slug} glow={item.glow} style={item.span === 'big' ? { gridColumn: 'span 2', gridRow: 'span 2' } : item.span === 'wide' ? { gridColumn: 'span 2' } : {}}>
                <div style={{ width: '100%', height: '100%', minHeight: 240, position: 'relative', background: '#0A0A0A' }}>
                  {/* Real image (shows when available) */}
                  <img
                    src={`/galeria/letreros/${item.slug}.jpg`}
                    alt={item.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0, transition: 'opacity .4s' }}
                    onError={e => { e.target.style.opacity = 0 }}
                  />
                  {/* Placeholder / overlay */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <div style={{ fontSize: item.span === 'big' ? 72 : 44, lineHeight: 1, filter: `drop-shadow(0 0 20px ${item.glow})` }}>{item.emoji}</div>
                  </div>
                  {/* Bottom label with neon line */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 20px 18px', background: 'linear-gradient(to top, rgba(0,0,0,.92) 0%, transparent 100%)' }}>
                    <div style={{ width: 32, height: 2, background: item.glow, boxShadow: `0 0 10px ${item.glow}`, borderRadius: 2, marginBottom: 8 }} />
                    <div style={{ fontSize: item.span === 'big' ? 17 : 13, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: item.glow, fontWeight: 600 }}>{item.sub}</div>
                  </div>
                  {/* Glow border on hover (via parent TiltCard's boxShadow) */}
                </div>
              </TiltCard>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <p style={{ fontSize: 13, color: '#444', marginBottom: 16 }}>¿Tienes una foto de referencia o una idea en mente? Mándanosla — te respondemos con precio en menos de 24 horas.</p>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              onClick={() => { px('Lead', { content_name: `Galeria ${city.name}` }); ga('generate_lead', { item_name: `Galeria ${city.name}` }) }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'transparent', color: '#FF6B00', fontWeight: 800, fontSize: 14, padding: '12px 24px', borderRadius: 30, textDecoration: 'none', border: '1px solid #FF6B0060', boxShadow: '0 0 20px #FF6B0030' }}>
              <WaIcon size={15} /> Enviar referencia por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── SECTORES ── */}
      <section style={{ background: '#060606', padding: '96px 24px', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#FF6B00', marginBottom: 14 }}>Nos adaptamos a tu rubro</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 12 }}>
              Cada industria pide<br /><span className="accent-word">un lenguaje visual distinto.</span>
            </h2>
            <p style={{ fontSize: 14, color: '#444', maxWidth: 480, margin: '0 auto', lineHeight: 1.75 }}>
              No hacemos el mismo letrero para una clínica y para un bar. Conocemos lo que cada rubro necesita proyectar.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="sec-grid">
            {SECTORES.map(s => (
              <div
                key={s.titulo}
                className={`sector-card${s.cls ? ` ${s.cls}` : ''}`}
                style={{ background: s.bg, borderColor: `${s.color}20` }}
              >
                {/* Top accent line */}
                <div style={{ position: 'absolute', top: 0, left: 24, right: 24, height: 2, background: `linear-gradient(90deg, transparent, ${s.color}80, transparent)`, borderRadius: 2 }} />

                <div style={{ fontSize: 36, marginBottom: 16, filter: `drop-shadow(0 0 12px ${s.color}60)` }}>{s.emoji}</div>

                <div style={{ fontSize: 15, fontWeight: 700, color: '#e8e8e8', marginBottom: 6 }}>{s.titulo}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: s.color, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>{s.rubros}</div>
                <div style={{ fontSize: 12, color: '#4A4A4A', lineHeight: 1.8, marginBottom: 20 }}>{s.desc}</div>

                <div style={{ borderTop: '1px solid #1A1A1A', paddingTop: 14 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#333', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 5 }}>Recomendamos</div>
                  <div style={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.producto}</div>
                </div>
              </div>
            ))}
          </div>

          <style>{`
            .sec-grid { }
            @media(max-width:900px) { .sec-grid { grid-template-columns:repeat(2,1fr) !important; } }
            @media(max-width:540px) { .sec-grid { grid-template-columns:1fr !important; } }
          `}</style>

          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <p style={{ fontSize: 13, color: '#333', marginBottom: 16 }}>¿No ves tu rubro? Igual podemos ayudarte.</p>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#FF6B00', fontWeight: 700, fontSize: 13, padding: '11px 22px', borderRadius: 30, textDecoration: 'none', border: '1px solid #FF6B0050' }}>
              <WaIcon size={14} /> Cuéntanos tu caso
            </a>
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS NEON ── */}
      <section style={{ background: '#000', padding: '88px 24px', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#FF6B00', marginBottom: 14 }}>Qué fabricamos</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 10 }}>
              Elige el letrero que necesita<br />tu negocio en {city.name}.
            </h2>
            <p style={{ fontSize: 13, color: '#444', maxWidth: 460, margin: '0 auto' }}>No trabajamos con piezas metálicas — solo materiales que se ven premium, no pesan en la fachada y duran más de 10 años.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
            {PRODUCTOS.map(({ icon: Icon, nombre, desc, glow, tag }) => (
              <div key={nombre} className="prod-card" style={{ '--accent': glow, '--glow': `${glow}30` }}>
                {tag && <span style={{ position: 'absolute', top: 18, right: 18, background: glow, color: '#000', fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 20, letterSpacing: .5 }}>{tag}</span>}
                <div style={{ width: 44, height: 44, borderRadius: 12, border: `1px solid ${glow}40`, background: `${glow}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: `0 0 14px ${glow}30` }}>
                  <Icon size={20} color={glow} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#e8e8e8', marginBottom: 8 }}>{nombre}</div>
                <div style={{ fontSize: 12, color: '#555', lineHeight: 1.75 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESO ── */}
      <section style={{ background: '#030303', padding: '88px 24px', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#FF6B00', marginBottom: 14 }}>Sin riesgos, sin sorpresas</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 10 }}>
              Ves el diseño antes de pagar un peso.
            </h2>
            <p style={{ fontSize: 13, color: '#444', maxWidth: 440, margin: '0 auto' }}>Así funciona con nosotros: transparente, rápido y sin letra chica.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 32 }}>
            {PASOS.map(({ n, titulo, desc }) => (
              <div key={n} className="step-wrap" style={{ padding: '8px 0', borderTop: '1px solid #1A1A1A', cursor: 'default' }}>
                <div className="step-n">{n}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#ddd', marginBottom: 10 }}>{titulo}</div>
                <div style={{ fontSize: 12, color: '#444', lineHeight: 1.8 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COBERTURA + PROVEEDOR ESTADO ── */}
      <section style={{ background: '#000', padding: '88px 24px', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="lst-grid">
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#FF6B00', marginBottom: 16 }}>Llegamos donde estés</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 18 }}>
              No importa en qué rincón del Maule esté tu negocio.
            </h2>
            <p style={{ fontSize: 13, color: '#444', lineHeight: 1.8, marginBottom: 28 }}>
              Fabricamos en taller propio y coordinamos la instalación en las 30 comunas de la región — sin que tengas que preocuparte de nada. Tú apruebas el diseño, nosotros hacemos el resto.
            </p>
            {['Provincia de Talca (10 comunas)','Provincia de Curicó (9 comunas)','Provincia de Linares (8 comunas)','Provincia de Cauquenes (3 comunas)'].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF6B00', boxShadow: '0 0 8px #FF6B00', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#555' }}>{i}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: 20, padding: '36px 32px', boxShadow: '0 0 60px rgba(255,107,0,.06)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#111', border: '1px solid #222', borderRadius: 12, padding: '10px 16px', marginBottom: 24 }}>
              <img src="/proveedor-del-estado.png" alt="Proveedor del Estado" style={{ height: 26, objectFit: 'contain', filter: 'brightness(0) invert(.55)' }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#ccc' }}>Proveedor del Estado</div>
                <div style={{ fontSize: 9, color: '#444' }}>Registrados en ChileCompra · MercadoPúblico</div>
              </div>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: 20 }}>Lo que otros no te dicen.</h3>
            {[
              '¿No tienes logo? Lo diseñamos nosotros',
              'Ves el diseño antes de pagar un peso',
              'Precio claro desde el primer mensaje',
              'Instalación coordinada, sin que muevas un dedo',
              'Facturamos — empresa registrada en ChileCompra',
              'Sin letreros metálicos: más livianos, más duraderos',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <CheckCircle2 size={13} color="#FF6B00" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#555' }}>{item}</span>
              </div>
            ))}
            <a href={WA} target="_blank" rel="noopener noreferrer"
              onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
              style={{ marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FF6B00', color: '#000', fontWeight: 800, fontSize: 13, padding: '12px 22px', borderRadius: 30, textDecoration: 'none', boxShadow: '0 0 22px #FF6B0060' }}>
              <WaIcon size={15} /> Cotizar ahora
            </a>
          </div>
        </div>
      </section>

      {/* ── MARQUEE CLIENTES ── */}
      <section style={{ background: '#030303', padding: '72px 0', overflow: 'hidden', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '0 24px', marginBottom: 40 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#FF6B00', marginBottom: 12 }}>Nos eligen en todo Chile</p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 700, color: '#fff', marginBottom: 8 }}>
            Más de 300 negocios ya decidieron ser vistos.
          </h2>
          <p style={{ fontSize: 13, color: '#333', maxWidth: 400, margin: '0 auto' }}>¿Cuándo es tu turno?</p>
        </div>
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

      {/* ── CTA FINAL ── */}
      <section style={{ background: '#000', padding: '100px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden', borderTop: '1px solid #111' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(255,107,0,.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
          <div style={{ fontSize: 52, marginBottom: 20, filter: 'drop-shadow(0 0 24px #FF6B00)' }}>🪧</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,4.5vw,3.2rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 14 }}>
            ¿Cuántos clientes estás perdiendo hoy<br /><span className="accent-word">porque no te ven?</span>
          </h2>
          <p style={{ fontSize: 14, color: '#444', marginBottom: 36, lineHeight: 1.8 }}>
            Mándanos una foto de tu fachada ahora. En menos de 24 horas tienes el diseño de tu letrero y el precio exacto — sin compromisos, sin letra chica.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              onClick={() => { px('Lead', { content_name: `Letreros Final ${city.name}` }); ga('generate_lead', { item_name: `Letreros Final ${city.name}` }) }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#FF6B00', color: '#000', fontWeight: 800, fontSize: 15, padding: '16px 32px', borderRadius: 40, textDecoration: 'none', boxShadow: '0 0 40px #FF6B0070, 0 8px 24px rgba(0,0,0,.5)' }}>
              <WaIcon size={19} /> Cotizar gratis ahora
            </a>
            <Link to="/"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#555', fontWeight: 600, fontSize: 14, padding: '16px 24px', borderRadius: 40, textDecoration: 'none', border: '1px solid #222' }}>
              Ver más servicios →
            </Link>
          </div>
          <p style={{ fontSize: 11, color: '#333' }}>+56 9 3293 0812 · contacto@agenciasi.cl</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#000', padding: '20px 24px', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ background: '#FF6B00', borderRadius: 6, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={12} color="#000" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#666' }}>AgenciaSI Gráficas</span>
          </Link>
          <span style={{ fontSize: 11, color: '#2A2A2A' }}>© 2026 AgenciaSI · Letreros en {city.name} · Región del Maule</span>
          <Link to="/" style={{ fontSize: 11, color: '#2A2A2A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            Inicio <ExternalLink size={10} />
          </Link>
        </div>
      </footer>

      {/* ── FLOATING WA ── */}
      <a href={WA} target="_blank" rel="noopener noreferrer"
        onClick={() => { px('Contact'); ga('contact', { method: 'whatsapp' }) }}
        style={{ position: 'fixed', bottom: 24, right: 24, background: '#25D366', color: '#fff', width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 24px rgba(37,211,102,.55)', zIndex: 100, textDecoration: 'none' }}>
        <WaIcon size={26} />
      </a>
    </div>
  )
}

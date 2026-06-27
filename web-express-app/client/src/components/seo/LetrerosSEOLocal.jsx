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
  { slug: 'letras-acrilico-fachada',  label: 'Letras Volumétricas',  sub: 'Acrílico · Corte láser',     glow: '#FF6B00', emoji: '🔤', span: 'big' },
  { slug: 'letrero-led-tienda',        label: 'Letreros LED',          sub: 'Backlit · Frontlit · 24/7',  glow: '#FFD700', emoji: '💡', span: '' },
  { slug: 'vinilo-vitrina',            label: 'Vinilos y Ploteo',      sub: 'Corte · Impresión UV',       glow: '#FF00FF', emoji: '🎨', span: '' },
  { slug: 'totem-publicitario',        label: 'Tótem Publicitario',    sub: 'PVC · Foam · Estructural',   glow: '#00FFAA', emoji: '🏢', span: 'wide' },
  { slug: 'letras-mdf-restaurante',   label: 'Letras MDF / Madera',   sub: 'Doradas · Pintadas',         glow: '#FF8C00', emoji: '🪵', span: '' },
  { slug: 'senaletica-oficina',        label: 'Señalética Corp.',      sub: 'Interior · Exterior',        glow: '#00CFFF', emoji: '🔖', span: '' },
]

const PRODUCTOS = [
  { icon: SquareStack, nombre: 'Letras Volumétricas en Acrílico', desc: 'Corte láser de precisión. Acrílico cristal, lechoso o de color. Montaje directo en fachada.', glow: '#FF6B00', tag: 'Más vendido' },
  { icon: Layers,      nombre: 'Letras de Alto Impacto (PVC)',     desc: 'PVC expandido rígido. Liviano, económico y duradero. Ideal para interiores y fachadas.', glow: '#FF4500', tag: null },
  { icon: Lightbulb,   nombre: 'Letreros Luminosos LED',           desc: 'Caja de luz, backlit y frontlit. Tecnología LED de bajo consumo. Visibles las 24 horas.', glow: '#FFD700', tag: 'Popular' },
  { icon: Monitor,     nombre: 'Fachada Corporativa Completa',     desc: 'Diseño e instalación integral: letras, vinilos, señalética. Tu identidad en fachada.', glow: '#FF6B00', tag: 'Completo' },
  { icon: Zap,         nombre: 'Tótem Publicitario',               desc: 'Estructura vertical independiente. PVC o foam de alta densidad. Para galerías y eventos.', glow: '#00FFAA', tag: null },
  { icon: Tag,         nombre: 'Vinilos Decorativos y Ploteo',     desc: 'Corte o impresión digital. Interior/exterior. Vidrieras, paredes, vehículos y eventos.', glow: '#FF00FF', tag: null },
  { icon: SquareStack, nombre: 'Letras en MDF y Madera',           desc: 'Para ambientes premium: restaurantes, hoteles, oficinas. Pintadas, doradas o barnizadas.', glow: '#FF8C00', tag: null },
  { icon: ExternalLink,nombre: 'Señalética y Rotulación',          desc: 'Directorio de oficinas, señales de emergencia, numeración. Corporativa a medida.', glow: '#00CFFF', tag: null },
  { icon: ArrowRight,  nombre: 'Banners, Roll-Ups y Lonas',        desc: 'Impresión digital de alta resolución. Para eventos, ferias y puntos de venta.', glow: '#A855F7', tag: null },
]

const PASOS = [
  { n: '01', titulo: 'Cotización gratis',    desc: 'Envía por WhatsApp el nombre, logo y medidas aproximadas. Respuesta en menos de 24h.' },
  { n: '02', titulo: 'Diseño digital',        desc: 'Antes de producir te enviamos visualización 3D del letrero en tu fachada.' },
  { n: '03', titulo: 'Producción en taller', desc: 'Fabricamos con materiales certificados. Control de calidad pieza a pieza.' },
  { n: '04', titulo: 'Entrega e instalación',desc: 'Instalamos en tu local o coordinas retiro. Cubrimos toda la Región del Maule.' },
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
  @keyframes neon-flicker {
    0%,92%,100% { opacity:1; text-shadow:0 0 12px #FF6B00,0 0 28px #FF6B00,0 0 60px #FF6B0060; }
    93%          { opacity:.6; text-shadow:none; }
    94%          { opacity:1; text-shadow:0 0 12px #FF6B00,0 0 28px #FF6B00; }
    96%          { opacity:.5; text-shadow:none; }
  }
  @keyframes lst-marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes fade-up { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }

  .neon-word {
    color:#FF6B00;
    text-shadow:0 0 12px #FF6B00,0 0 28px #FF6B00,0 0 60px #FF6B0060;
    animation:neon-flicker 6s infinite;
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
    -webkit-text-stroke:1px #333;
    margin-bottom:4px;
    transition:color .3s,-webkit-text-stroke-color .3s;
  }
  .step-wrap:hover .step-n {
    color:#FF6B00;
    -webkit-text-stroke-color:#FF6B00;
    text-shadow:0 0 20px #FF6B0080;
  }

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

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.6rem, 7vw, 5.5rem)', fontWeight: 700, lineHeight: 1.0, marginBottom: 24, letterSpacing: -1 }}>
            <span style={{ color: '#fff' }}>Letreros que</span><br />
            <span className="neon-word">brillan solos.</span>
          </h1>

          <p style={{ fontSize: 'clamp(14px, 2vw, 17px)', color: '#666', lineHeight: 1.8, maxWidth: 520, margin: '0 auto 16px', fontWeight: 300 }}>
            Fabricamos letreros volumétricos en <strong style={{ color: '#999', fontWeight: 600 }}>acrílico, PVC, LED, madera y foam</strong> para {city.context}.<br />Sin piezas metálicas.
          </p>
          <p style={{ fontSize: 12, color: '#FF6B00', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 44 }}>
            Diseño · Fabricación · Instalación en {city.name}
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
            { v: '+300',   l: 'Letreros fabricados',   s: 'en la Región del Maule' },
            { v: '5 días', l: 'Entrega promedio',       s: 'desde aprobación del diseño' },
            { v: '0%',     l: 'Metálicos',              s: 'solo plástico, madera y LED' },
            { v: '30',     l: 'Comunas del Maule',      s: 'cobertura total en la región' },
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
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#FF6B00', marginBottom: 14 }}>Galería de trabajos</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,3vw,3rem)', fontWeight: 700, color: '#fff', lineHeight: 1.0, marginBottom: 12 }}>
              Cada letrero,<br /><span className="neon-word" style={{ fontSize: '0.85em' }}>único.</span>
            </h2>
            <p style={{ fontSize: 13, color: '#444', maxWidth: 380, margin: '0 auto' }}>Mueve el cursor sobre cada pieza — arrastra la luz.</p>
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
            <p style={{ fontSize: 13, color: '#444', marginBottom: 16 }}>¿Tienes una referencia o idea? La hacemos realidad.</p>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              onClick={() => { px('Lead', { content_name: `Galeria ${city.name}` }); ga('generate_lead', { item_name: `Galeria ${city.name}` }) }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'transparent', color: '#FF6B00', fontWeight: 800, fontSize: 14, padding: '12px 24px', borderRadius: 30, textDecoration: 'none', border: '1px solid #FF6B0060', boxShadow: '0 0 20px #FF6B0030' }}>
              <WaIcon size={15} /> Enviar referencia por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS NEON ── */}
      <section style={{ background: '#000', padding: '88px 24px', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#FF6B00', marginBottom: 14 }}>Sin piezas metálicas</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
              Lo que fabricamos en {city.name}.
            </h2>
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
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#FF6B00', marginBottom: 14 }}>Proceso simple</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>
              Tu letrero en {city.name} en 4 pasos.
            </h2>
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
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#FF6B00', marginBottom: 16 }}>Cobertura total</p>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 18 }}>
              Atendemos las 30 comunas de la Región del Maule.
            </h2>
            <p style={{ fontSize: 13, color: '#444', lineHeight: 1.8, marginBottom: 28 }}>
              Desde Talca hasta Vichuquén, desde Curicó hasta Cauquenes. Fabricamos en taller y coordinamos entrega e instalación donde lo necesites.
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
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: 20 }}>¿Por qué elegirnos?</h3>
            {[
              'Materiales certificados y duraderos',
              'Diseño profesional incluido',
              'Presupuesto en menos de 24h',
              'Instalación coordinada en tu comuna',
              'Facturamos — empresa formal',
              'Sin letreros metálicos',
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
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#FF6B00', marginBottom: 12 }}>Empresas que confían en nosotros</p>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 700, color: '#fff' }}>
            Negocios de la Región del Maule y Chile.
          </h2>
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
            Dale identidad a tu negocio<br /><span className="neon-word">en {city.name}.</span>
          </h2>
          <p style={{ fontSize: 14, color: '#444', marginBottom: 36, lineHeight: 1.8 }}>
            Presupuesto gratis con propuesta de diseño incluida. Respondemos en menos de 24 horas.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              onClick={() => { px('Lead', { content_name: `Letreros Final ${city.name}` }); ga('generate_lead', { item_name: `Letreros Final ${city.name}` }) }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#FF6B00', color: '#000', fontWeight: 800, fontSize: 15, padding: '16px 32px', borderRadius: 40, textDecoration: 'none', boxShadow: '0 0 40px #FF6B0070, 0 8px 24px rgba(0,0,0,.5)' }}>
              <WaIcon size={19} /> Quiero mi letrero
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

import { useState } from 'react'
import {
  Home, Building2, Layers, Briefcase, Search, X, MapPin, Phone,
  Bed, Bath, Car, Maximize2, Heart, MessageCircle, ArrowRight,
  CheckCircle2, Tag, Building,
} from 'lucide-react'

/* ── Brand tokens ─────────────────────────────────────────────── */
const B = {
  bg:      '#F5F3EE',
  cream:   '#FEFCF8',
  card:    '#FFFFFF',
  dark:    '#1C1A15',
  green:   '#1B4D3E',
  mint:    '#2D6A57',
  sage:    '#C2D9D1',
  sageLt:  '#EBF4F0',
  gold:    '#A87528',
  goldLt:  '#FAF5E8',
  muted:   '#8A8579',
  border:  '#E4E1D8',
}

const WA        = 'https://wa.me/56932930812'
const UF_CLP    = 38850
const fmtUF     = (n, mes) => n.toLocaleString('es-CL') + ' UF' + (mes ? '/mes' : '')
const fmtCLP    = (n) => '$' + Math.round(n * UF_CLP).toLocaleString('es-CL')

const TYPE_META = {
  'Casa':         { icon: Home,      color: B.green,  bg: B.sageLt  },
  'Departamento': { icon: Building2, color: B.mint,   bg: B.sageLt  },
  'Oficina':      { icon: Briefcase, color: '#5C4A8A', bg: '#F3EFFF' },
  'Terreno':      { icon: Layers,    color: B.gold,   bg: B.goldLt  },
}

const BADGE_STYLE = {
  'Destacada':   { bg: B.goldLt,   fg: B.gold    },
  'Nuevo':       { bg: B.sageLt,   fg: B.green   },
  'Premium':     { bg: '#F3EFFF',  fg: '#5C4A8A' },
  'Amoblado':    { bg: '#EBF4F0',  fg: B.mint    },
  'Corporativa': { bg: '#F3EFFF',  fg: '#6B21A8' },
  'Oportunidad': { bg: '#FEF0F0',  fg: '#9B1C1C' },
  'Exclusiva':   { bg: B.dark,     fg: '#FEFCF8' },
  'Remodelada':  { bg: '#EBF4F0',  fg: B.green   },
  'Penthouse':   { bg: B.green,    fg: '#FEFCF8' },
}

const PROPS = [
  {
    id: 1, type: 'Casa', trans: 'Venta',
    title: 'Casa moderna con jardín privado',
    desc: 'Espléndida casa de dos pisos en sector residencial. Amplio jardín, cocina americana equipada, living-comedor integrado con salida a terraza. Excelentes terminaciones y luminosidad natural en todos los ambientes.',
    address: 'El Encuentro 1234', commune: 'Las Condes', region: 'RM',
    price: 14500, mes: false,
    m2: 185, m2Terreno: 340, beds: 4, baths: 3, parking: 2,
    img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=500&fit=crop&q=80',
    badge: 'Destacada',
    amenities: ['Jardín privado', 'Piscina', 'Alarma', 'Cocina equipada', 'Terraza', 'Bodega'],
    year: 2018, gastos: null,
  },
  {
    id: 2, type: 'Departamento', trans: 'Arriendo',
    title: 'Departamento luminoso con balcón',
    desc: 'Hermoso departamento con amplio balcón y vista despejada. Edificio con portería 24/7, gimnasio y sala de eventos. Excelente ubicación a pasos del metro Tobalaba.',
    address: 'Av. Providencia 2800', commune: 'Providencia', region: 'RM',
    price: 38, mes: true,
    m2: 72, m2Terreno: null, beds: 2, baths: 2, parking: 1,
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop&q=80',
    badge: 'Nuevo',
    amenities: ['Balcón', 'Gimnasio', 'Portería 24/7', 'Sala eventos', 'Metro cercano', 'Bicicletero'],
    year: 2021, gastos: 3,
  },
  {
    id: 3, type: 'Casa', trans: 'Venta',
    title: 'Casa familiar en barrio consolidado',
    desc: 'Casa de un piso en barrio tranquilo y residencial. Amplio living con chimenea, dormitorios con clósets, patio trasero. Ideal para familias. Próxima a colegios y servicios.',
    address: 'Irarrázaval 3456', commune: 'Ñuñoa', region: 'RM',
    price: 8200, mes: false,
    m2: 145, m2Terreno: 210, beds: 3, baths: 2, parking: 1,
    img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=500&fit=crop&q=80',
    badge: null,
    amenities: ['Patio trasero', 'Chimenea', 'Clósets empotrados', 'Sala de estar'],
    year: 2005, gastos: null,
  },
  {
    id: 4, type: 'Departamento', trans: 'Venta',
    title: 'Departamento premium con vista cordillera',
    desc: 'Exclusivo departamento de lujo en piso 18. Terminaciones de primer nivel, cocina de diseño, suite principal con walk-in closet y baño en mármol. Vistas espectaculares a la cordillera.',
    address: 'Av. Vitacura 5800', commune: 'Vitacura', region: 'RM',
    price: 18900, mes: false,
    m2: 148, m2Terreno: null, beds: 3, baths: 3, parking: 2,
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=500&fit=crop&q=80',
    badge: 'Premium',
    amenities: ['Vista cordillera', 'Walk-in closet', 'Concierge', 'Spa', 'Rooftop', 'Bodega'],
    year: 2022, gastos: 8,
  },
  {
    id: 5, type: 'Departamento', trans: 'Arriendo',
    title: 'Estudio amoblado en el centro',
    desc: 'Estudio completamente amoblado e implementado. Edificio nuevo con seguridad y lavandería común. Ideal para profesional o estudiante. A pasos del metro y todo el comercio.',
    address: 'Morandé 450', commune: 'Santiago', region: 'RM',
    price: 21, mes: true,
    m2: 32, m2Terreno: null, beds: 1, baths: 1, parking: 0,
    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop&q=80',
    badge: 'Amoblado',
    amenities: ['Amoblado', 'Lavandería', 'Metro a pasos', 'Seguridad 24/7'],
    year: 2023, gastos: 2,
  },
  {
    id: 6, type: 'Oficina', trans: 'Arriendo',
    title: 'Oficina ejecutiva en edificio clase A',
    desc: 'Oficina de alto estándar en edificio corporativo clase A. Espacio abierto para 20 puestos, sala de reuniones, kitchenette y terraza privada. Excelente conectividad y estacionamientos.',
    address: 'El Bosque Norte 500', commune: 'Providencia', region: 'RM',
    price: 48, mes: true,
    m2: 220, m2Terreno: null, beds: 0, baths: 2, parking: 4,
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop&q=80',
    badge: 'Corporativa',
    amenities: ['Sala reuniones', 'Kitchenette', 'Terraza', 'Generador', 'Fibra óptica', 'AC central'],
    year: 2019, gastos: 12,
  },
  {
    id: 7, type: 'Casa', trans: 'Venta',
    title: 'Casa con quincho y patio amplio',
    desc: 'Acogedora casa con excelente distribución. Gran patio con quincho techado ideal para reuniones familiares. Barrio tranquilo con todas las comodidades a disposición.',
    address: 'Los Copihues 345', commune: 'La Florida', region: 'RM',
    price: 6800, mes: false,
    m2: 120, m2Terreno: 280, beds: 3, baths: 2, parking: 2,
    img: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=500&fit=crop&q=80',
    badge: null,
    amenities: ['Quincho techado', 'Patio amplio', 'Calefacción central', 'Estacionamiento cubierto'],
    year: 2010, gastos: null,
  },
  {
    id: 8, type: 'Terreno', trans: 'Venta',
    title: 'Terreno plano con todos los servicios',
    desc: 'Excelente terreno plano en sector de alto desarrollo. Todos los servicios disponibles: agua potable, luz, gas, alcantarillado. Apto para construcción residencial o mixto.',
    address: 'San Martín 2100', commune: 'Maipú', region: 'RM',
    price: 3200, mes: false,
    m2: 620, m2Terreno: 620, beds: 0, baths: 0, parking: 0,
    img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&h=500&fit=crop&q=80',
    badge: 'Oportunidad',
    amenities: ['Terreno plano', 'Todos los servicios', 'Título saneado', 'Esquina'],
    year: null, gastos: null,
  },
  {
    id: 9, type: 'Casa', trans: 'Venta',
    title: 'Residencia de lujo en condominio',
    desc: 'Imponente residencia en exclusivo condominio cerrado con seguridad. Diseño arquitectónico de primer nivel, materiales importados, domótica integrada, piscina temperada y jardín de autor.',
    address: 'La Dehesa 8900', commune: 'Lo Barnechea', region: 'RM',
    price: 26500, mes: false,
    m2: 480, m2Terreno: 1200, beds: 5, baths: 5, parking: 4,
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop&q=80',
    badge: 'Exclusiva',
    amenities: ['Piscina temperada', 'Domótica', 'Bodega de vinos', 'Sala cine', 'Jardín de autor', 'Generador'],
    year: 2020, gastos: null,
  },
  {
    id: 10, type: 'Departamento', trans: 'Arriendo',
    title: 'Depto con terraza en barrio bohemio',
    desc: 'Moderno departamento con amplia terraza en barrio con gran oferta gastronómica y cultural. Terminaciones de calidad, cocina abierta y muy buena luminosidad natural.',
    address: 'Condell 1200', commune: 'Ñuñoa', region: 'RM',
    price: 30, mes: true,
    m2: 85, m2Terreno: null, beds: 2, baths: 2, parking: 1,
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&q=80',
    badge: null,
    amenities: ['Terraza amplia', 'Cocina abierta', 'Bodega', 'Bicicletero'],
    year: 2020, gastos: 3,
  },
  {
    id: 11, type: 'Casa', trans: 'Venta',
    title: 'Casa remodelada lista para habitar',
    desc: 'Casa completamente remodelada con terminaciones nuevas. Cocina moderna con isla, baños renovados, piso flotante y ventanas termopanel. Sin detalles, lista para entrar a vivir.',
    address: 'Gran Avenida 4560', commune: 'San Miguel', region: 'RM',
    price: 5600, mes: false,
    m2: 110, m2Terreno: 160, beds: 3, baths: 2, parking: 1,
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop&q=80',
    badge: 'Remodelada',
    amenities: ['Cocina con isla', 'Piso flotante', 'Ventanas termopanel', 'Alarma'],
    year: 2000, gastos: null,
  },
  {
    id: 12, type: 'Departamento', trans: 'Arriendo',
    title: 'Penthouse con terraza panorámica 360°',
    desc: 'Único penthouse con espectacular terraza de 80m² y vistas 360° a la ciudad y cordillera. Terminaciones de máximo nivel, cocina Bosch, suite con jacuzzi. Conserjería premium.',
    address: 'Las Condes 10500', commune: 'Las Condes', region: 'RM',
    price: 55, mes: true,
    m2: 180, m2Terreno: null, beds: 3, baths: 3, parking: 2,
    img: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&h=500&fit=crop&q=80',
    badge: 'Penthouse',
    amenities: ['Terraza 80m²', 'Vistas 360°', 'Jacuzzi', 'Conserjería premium', 'Bodega', 'Generador'],
    year: 2021, gastos: 15,
  },
]

const TYPES = ['Todos', 'Casa', 'Departamento', 'Oficina', 'Terreno']
const TRANS  = ['Todos', 'Venta', 'Arriendo']

/* ── Sub-components ───────────────────────────────────────────── */
function PropFeature({ icon, label }) {
  const Ico = icon
  return (
    <span className="flex items-center gap-1 text-xs" style={{ color: B.muted }}>
      <Ico size={11} style={{ color: B.mint }} />
      {label}
    </span>
  )
}

function PropBadge({ text }) {
  const s = BADGE_STYLE[text] || { bg: B.sageLt, fg: B.green }
  return (
    <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: s.bg, color: s.fg, fontFamily: 'Inter, sans-serif' }}>
      {text}
    </span>
  )
}

/* ── Main Component ───────────────────────────────────────────── */
export default function DemoCorredora() {
  const [typeFilter, setTypeFilter]   = useState('Todos')
  const [transFilter, setTransFilter] = useState('Todos')
  const [search, setSearch]           = useState('')
  const [searchOpen, setSearchOpen]   = useState(false)
  const [selectedProp, setSelectedProp] = useState(null)
  const [detailTab, setDetailTab]     = useState('general')
  const [favs, setFavs]               = useState(new Set())

  const filtered = PROPS.filter(p =>
    (typeFilter === 'Todos' || p.type === typeFilter) &&
    (transFilter === 'Todos' || p.trans === transFilter) &&
    (search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.commune.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase()))
  )

  const toggleFav = (id, e) => {
    e.stopPropagation()
    setFavs(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const waContact = (p) => {
    const msg = `Hola, me interesa la propiedad: *${p.title}* en ${p.commune}.\n\nPrecio: ${fmtUF(p.price, p.mes)}\nDirección: ${p.address}, ${p.commune}\n\n¿Podría darme más información?`
    window.open(`${WA}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const openDetail = (p) => { setSelectedProp(p); setDetailTab('general') }

  return (
    <>
      {/* ── Google Fonts ── */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* ── Animations & global styles ── */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes revealImg {
          from { clip-path: inset(0 0 100% 0); }
          to   { clip-path: inset(0 0 0% 0); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerGold {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes glowGreen {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,211,102,0.35); }
          50%       { box-shadow: 0 0 0 10px rgba(37,211,102,0); }
        }
        @keyframes lineGrow {
          from { transform: scaleY(0); transform-origin: top; }
          to   { transform: scaleY(1); transform-origin: top; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleModal {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUpModal {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .atlas-slide-up   { animation: slideUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .atlas-reveal-img { animation: revealImg 0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .atlas-card-in    { animation: cardIn 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .atlas-fade-in    { animation: fadeIn 0.5s ease both; }
        .atlas-line-grow  { animation: lineGrow 1s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
        .atlas-scale-modal { animation: scaleModal 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .atlas-slide-modal { animation: slideUpModal 0.4s cubic-bezier(0.22,1,0.36,1) both; }

        .d-0  { animation-delay: 0ms; }
        .d-1  { animation-delay: 100ms; }
        .d-2  { animation-delay: 200ms; }
        .d-3  { animation-delay: 320ms; }
        .d-4  { animation-delay: 460ms; }
        .d-5  { animation-delay: 600ms; }

        .card-lift {
          transition: transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease;
        }
        .card-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 48px rgba(27,77,62,0.12), 0 6px 16px rgba(0,0,0,0.06);
        }
        .img-pan { overflow: hidden; }
        .img-pan img {
          transition: transform 0.55s cubic-bezier(0.22,1,0.36,1);
        }
        .img-pan:hover img {
          transform: scale(1.07) translateY(-4px);
        }
        .shimmer-gold {
          background: linear-gradient(90deg, #A87528 0%, #D4A843 40%, #FAF5E8 50%, #D4A843 60%, #A87528 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerGold 3s linear infinite;
        }
        .float-badge {
          animation: floatBadge 3.5s ease-in-out infinite;
        }
        .glow-green {
          animation: glowGreen 2.5s ease-in-out infinite;
        }
        .pill-btn { transition: all 0.18s cubic-bezier(0.22,1,0.36,1); }
        .pill-btn:hover { transform: translateY(-1px); }
        .fav-btn { transition: transform 0.2s ease; }
        .fav-btn:active { transform: scale(1.35); }
        .btn-green {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          box-shadow: 0 4px 14px rgba(27,77,62,0.25);
        }
        .btn-green:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(27,77,62,0.35);
        }
        .atlas-font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
        .atlas-font-body    { font-family: 'Inter', system-ui, sans-serif; }
      `}</style>

      <div className="min-h-screen atlas-font-body" style={{ background: B.bg }}>

        {/* ── 1. Demo Banner ─────────────────────────────────────── */}
        <div className="text-center py-3 px-4 text-xs font-medium flex items-center justify-center gap-3 flex-wrap"
          style={{ background: B.green, color: '#FEFCF8', letterSpacing: '0.01em' }}>
          <span style={{ opacity: 0.85 }}>Demo creado por AgenciaSI — ¿Quieres este sitio para tu corredora?</span>
          <a href="https://wa.me/56932930812" target="_blank" rel="noreferrer"
            className="font-bold underline underline-offset-2 flex items-center gap-1 hover:opacity-70 transition-opacity"
            style={{ color: '#C2D9D1' }}>
            Cotizar ahora <ArrowRight size={11} />
          </a>
        </div>

        {/* ── 2. Navbar ──────────────────────────────────────────── */}
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm"
          style={{ borderBottom: `1px solid ${B.border}` }}>
          <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center gap-5">

            {/* Logo */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-sm flex items-center justify-center" style={{ background: B.green }}>
                <Building size={17} color="#FEFCF8" strokeWidth={1.5} />
              </div>
              <div className="leading-none">
                <span className="atlas-font-display font-bold text-xl tracking-wide" style={{ color: B.dark }}>ATLAS</span>
                <span className="atlas-font-body text-[10px] font-semibold tracking-[0.15em] uppercase block"
                  style={{ color: B.muted, marginTop: '-1px' }}>Propiedades</span>
              </div>
            </div>

            {/* Nav links */}
            <div className="hidden lg:flex items-center gap-7 text-[13px] font-medium shrink-0" style={{ color: B.muted }}>
              {['Inicio', 'Propiedades', 'Venta', 'Arriendo', 'Contacto'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`}
                  className="hover:opacity-60 transition-opacity tracking-wide">{l}</a>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1 relative max-w-lg">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: search ? B.green : B.muted }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 180)}
                onKeyDown={e => { if (e.key === 'Escape') { setSearch(''); setSearchOpen(false) } }}
                placeholder="Busca por tipo, comuna o propiedad…"
                className="w-full pl-9 pr-10 py-2.5 text-sm outline-none transition-all rounded-sm"
                style={{
                  background: search ? B.cream : '#F0EDE6',
                  border: `1.5px solid ${search ? B.green : 'transparent'}`,
                  color: B.dark,
                  fontFamily: 'Inter, sans-serif',
                }}
              />
              {search && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: B.green, color: '#fff' }}>{filtered.length}</span>
                  <button onClick={() => { setSearch(''); setSearchOpen(false) }}
                    className="p-0.5 rounded-full hover:bg-gray-100 transition-colors">
                    <X size={12} style={{ color: B.muted }} />
                  </button>
                </div>
              )}

              {/* Search dropdown */}
              {searchOpen && search && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-sm shadow-2xl overflow-hidden"
                  style={{ border: `1px solid ${B.border}`, zIndex: 60 }}>
                  {filtered.length === 0 ? (
                    <div className="px-5 py-6 text-center">
                      <p className="text-sm font-semibold mb-1" style={{ color: B.dark }}>
                        Sin resultados para &ldquo;{search}&rdquo;
                      </p>
                      <p className="text-xs" style={{ color: B.muted }}>Prueba con otra comuna o tipo de propiedad</p>
                    </div>
                  ) : (
                    <>
                      {filtered.slice(0, 5).map(p => {
                        return (
                          <button key={p.id}
                            onMouseDown={() => { openDetail(p); setSearchOpen(false) }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-amber-50/40 transition-colors text-left"
                            style={{ borderBottom: `1px solid ${B.border}` }}>
                            <div className="w-11 h-11 rounded-sm overflow-hidden shrink-0 img-pan">
                              <img src={p.img} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate atlas-font-body"
                                style={{ color: B.dark }}>{p.title}</p>
                              <p className="text-[11px] mt-0.5" style={{ color: B.muted }}>
                                {p.commune} · {p.type}
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full mb-1 inline-block"
                                style={{ background: p.trans === 'Venta' ? B.goldLt : B.sageLt,
                                         color:      p.trans === 'Venta' ? B.gold   : B.green }}>
                                {p.trans}
                              </span>
                              <p className="text-sm font-bold block shimmer-gold">{fmtUF(p.price, p.mes)}</p>
                            </div>
                          </button>
                        )
                      })}
                      {filtered.length > 5 ? (
                        <button
                          onMouseDown={() => { setSearchOpen(false); document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth' }) }}
                          className="w-full py-3 text-sm font-semibold text-center hover:bg-amber-50/30 transition-colors"
                          style={{ color: B.green, fontFamily: 'Inter, sans-serif' }}>
                          Ver los {filtered.length} resultados →
                        </button>
                      ) : (
                        <div className="px-4 py-2 text-center text-[11px]"
                          style={{ color: B.muted, background: B.cream }}>
                          {filtered.length} propiedad{filtered.length !== 1 ? 'es' : ''} · Haz clic para ver detalle
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* CTA */}
            <a href={WA} target="_blank" rel="noreferrer"
              className="btn-green shrink-0 hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-semibold text-white tracking-wide"
              style={{ background: B.green }}>
              <Phone size={13} /> Contactar
            </a>
          </div>
        </nav>

        {/* ── 3. Hero ────────────────────────────────────────────── */}
        <section id="inicio" className="max-w-6xl mx-auto px-5 pt-16 pb-12 flex flex-col lg:flex-row gap-12 items-center">

          {/* Left: editorial copy */}
          <div className="flex-1 relative">
            {/* Decorative vertical line */}
            <div className="hidden lg:block absolute -left-10 top-0 bottom-0 w-px atlas-line-grow"
              style={{ background: `linear-gradient(to bottom, ${B.green}, ${B.sage}, transparent)` }} />

            <span className="atlas-slide-up d-0 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase mb-5 px-3 py-1.5 rounded-full"
              style={{ background: B.sageLt, color: B.mint, border: `1px solid ${B.sage}`, fontFamily: 'Inter, sans-serif' }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: B.mint }} />
              Santiago de Chile · 2025
            </span>

            <h1 className="atlas-font-display atlas-slide-up d-1 font-semibold leading-[1.1] mb-6"
              style={{ fontSize: 'clamp(2.6rem, 5vw, 4rem)', color: B.dark }}>
              Las mejores<br />
              <em style={{ color: B.green, fontStyle: 'italic' }}>propiedades</em>{' '}
              en las<br />
              mejores comunas.
            </h1>

            <p className="atlas-slide-up d-2 text-sm leading-relaxed max-w-md mb-8"
              style={{ color: B.muted, fontFamily: 'Inter, sans-serif' }}>
              ATLAS Propiedades es tu asesor inmobiliario de confianza en Santiago. Más de 200 propiedades en venta y arriendo, con acompañamiento personalizado en cada etapa.
            </p>

            <div className="atlas-slide-up d-3 flex flex-wrap gap-3 mb-10">
              <button
                onClick={() => { setTransFilter('Venta'); document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="btn-green px-6 py-3 rounded-sm text-sm font-semibold text-white tracking-wide"
                style={{ background: B.green }}>
                Ver propiedades en venta
              </button>
              <button
                onClick={() => { setTransFilter('Arriendo'); document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="px-6 py-3 rounded-sm text-sm font-semibold tracking-wide transition-all hover:bg-white"
                style={{ border: `1.5px solid ${B.border}`, color: B.dark, background: 'transparent' }}>
                Ver arriendos
              </button>
            </div>

            {/* Trust indicators */}
            <div className="atlas-slide-up d-4 flex flex-wrap gap-5">
              {[
                { n: '15+', label: 'Años de experiencia' },
                { n: '200+', label: 'Propiedades activas' },
                { n: '98%', label: 'Satisfacción' },
              ].map(s => (
                <div key={s.label} className="flex items-baseline gap-1.5">
                  <span className="atlas-font-display font-semibold text-2xl" style={{ color: B.gold }}>{s.n}</span>
                  <span className="text-xs" style={{ color: B.muted, fontFamily: 'Inter, sans-serif' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: stacked image frames */}
          <div className="relative shrink-0 w-full lg:w-[45%]" style={{ minHeight: 380 }}>
            {/* Back image */}
            <div className="atlas-reveal-img d-1 absolute rounded-sm overflow-hidden shadow-2xl"
              style={{
                width: '70%', height: 320, right: 0, top: 0,
                border: `4px solid ${B.cream}`,
              }}>
              <img
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80"
                alt="Residencia de lujo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(28,26,21,0.35) 100%)' }} />
            </div>
            {/* Front image */}
            <div className="atlas-reveal-img d-3 absolute rounded-sm overflow-hidden shadow-xl"
              style={{
                width: '58%', height: 220, left: 0, bottom: 0,
                border: `4px solid ${B.cream}`,
                zIndex: 2,
              }}>
              <img
                src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=450&fit=crop&q=80"
                alt="Departamento moderno"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative frame accent */}
            <div className="hidden sm:block absolute rounded-sm"
              style={{ width: '70%', height: 320, right: -12, top: 12, border: `1.5px solid ${B.sage}`, zIndex: 0 }} />
            {/* Floating stat badge */}
            <div className="float-badge absolute z-10 rounded-sm px-4 py-3 shadow-xl"
              style={{ background: B.goldLt, border: `1px solid #D4A843`, bottom: 40, right: '30%', transform: 'rotate(2deg)' }}>
              <p className="atlas-font-display font-semibold text-2xl" style={{ color: B.gold }}>50+</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: B.gold, opacity: 0.75, fontFamily: 'Inter, sans-serif' }}>Comunas</p>
            </div>
          </div>
        </section>

        {/* ── 4. Stats bar ───────────────────────────────────────── */}
        <div style={{ background: B.cream, borderTop: `1px solid ${B.border}`, borderBottom: `1px solid ${B.border}` }}>
          <div className="max-w-6xl mx-auto px-5 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { n: '200+',  label: 'Propiedades disponibles' },
              { n: '15',    label: 'Años en el mercado' },
              { n: '98%',   label: 'Clientes satisfechos' },
              { n: '50+',   label: 'Comunas activas' },
            ].map((s, i) => (
              <div key={s.label} className={`text-center atlas-slide-up d-${i}`}>
                <p className="atlas-font-display font-semibold text-4xl md:text-5xl shimmer-gold mb-1">{s.n}</p>
                <p className="text-xs tracking-wide uppercase" style={{ color: B.muted, fontFamily: 'Inter, sans-serif' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. Properties section ──────────────────────────────── */}
        <section id="propiedades" className="max-w-6xl mx-auto px-5 py-12">

          {/* Section heading + filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-8">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-1"
                style={{ color: B.mint, fontFamily: 'Inter, sans-serif' }}>Catálogo · {new Date().getFullYear()}</p>
              <h2 className="atlas-font-display font-semibold" style={{ fontSize: '2rem', color: B.dark }}>
                Propiedades Disponibles{' '}
                <span className="text-2xl" style={{ color: B.muted }}>({filtered.length})</span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Type filters */}
              {TYPES.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className="pill-btn px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide"
                  style={typeFilter === t
                    ? { background: B.green, color: '#fff' }
                    : { background: B.cream, color: B.muted, border: `1px solid ${B.border}` }}>
                  {t}
                </button>
              ))}
              <div className="w-px mx-1 self-stretch" style={{ background: B.border }} />
              {/* Trans filters */}
              {TRANS.map(t => (
                <button key={t} onClick={() => setTransFilter(t)}
                  className="pill-btn px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide"
                  style={transFilter === t
                    ? { background: t === 'Venta' ? B.gold : t === 'Arriendo' ? B.mint : B.green, color: '#fff' }
                    : { background: B.cream, color: B.muted, border: `1px solid ${B.border}` }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-28" style={{ color: B.muted }}>
              <div className="w-16 h-16 rounded-sm flex items-center justify-center mx-auto mb-4"
                style={{ background: B.sageLt }}>
                <Search size={26} color={B.mint} strokeWidth={1.5} />
              </div>
              <p className="atlas-font-display font-semibold text-xl mb-1" style={{ color: B.dark }}>
                No hay propiedades con esos filtros
              </p>
              <p className="text-sm">Prueba cambiando el tipo o la transacción</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p, i) => {
                const meta = TYPE_META[p.type] || { icon: Home, color: B.green, bg: B.sageLt }
                const TypeIcon = meta.icon
                const isFav = favs.has(p.id)
                return (
                  <div key={p.id}
                    className="card-lift atlas-card-in bg-white flex flex-col cursor-pointer rounded-sm overflow-hidden"
                    style={{ border: `1px solid ${B.border}`, animationDelay: `${i * 55}ms` }}
                    onClick={() => openDetail(p)}>

                    {/* Image */}
                    <div className="relative img-pan" style={{ height: 220 }}>
                      <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0"
                        style={{ background: 'linear-gradient(to top, rgba(28,26,21,0.5) 0%, transparent 55%)' }} />
                      {/* Badges top-left */}
                      <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide"
                          style={{
                            background: p.trans === 'Venta' ? B.goldLt : B.sageLt,
                            color:      p.trans === 'Venta' ? B.gold   : B.green,
                            fontFamily: 'Inter, sans-serif',
                          }}>
                          {p.trans}
                        </span>
                        {p.badge && <PropBadge text={p.badge} />}
                      </div>
                      {/* Type icon top-right area */}
                      <div className="absolute top-3 right-11 w-7 h-7 rounded-sm flex items-center justify-center"
                        style={{ background: meta.bg }}>
                        <TypeIcon size={13} color={meta.color} />
                      </div>
                      {/* Fav button */}
                      <button
                        className="fav-btn absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-sm"
                        onClick={e => toggleFav(p.id, e)}>
                        <Heart size={14} fill={isFav ? '#9B1C1C' : 'none'} color={isFav ? '#9B1C1C' : B.muted} />
                      </button>
                      {/* Commune bottom-left */}
                      <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5">
                        <p className="text-white text-[11px] font-medium flex items-center gap-1"
                          style={{ fontFamily: 'Inter, sans-serif' }}>
                          <MapPin size={10} /> {p.commune}, {p.region}
                        </p>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4 flex flex-col flex-1">
                      <p className="atlas-font-display font-semibold text-base leading-snug mb-3"
                        style={{ color: B.dark }}>{p.title}</p>

                      {/* Features row */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-4">
                        {p.m2 > 0     && <PropFeature icon={Maximize2} label={`${p.m2} m²`} />}
                        {p.beds > 0   && <PropFeature icon={Bed}       label={`${p.beds} dorm.`} />}
                        {p.baths > 0  && <PropFeature icon={Bath}      label={`${p.baths} baño${p.baths > 1 ? 's' : ''}`} />}
                        {p.parking > 0 && <PropFeature icon={Car}      label={`${p.parking} est.`} />}
                      </div>

                      {/* Price */}
                      <div className="mt-auto mb-3">
                        <p className="atlas-font-display font-semibold text-2xl shimmer-gold">
                          {fmtUF(p.price, p.mes)}
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: B.muted, fontFamily: 'Inter, sans-serif' }}>
                          ≈ {fmtCLP(p.price)}
                        </p>
                      </div>

                      <button
                        onClick={e => { e.stopPropagation(); openDetail(p) }}
                        className="w-full py-2.5 rounded-sm text-xs font-semibold tracking-wide transition-all hover:text-white"
                        style={{
                          border: `1.5px solid ${B.green}`,
                          color: B.green,
                          background: 'transparent',
                          fontFamily: 'Inter, sans-serif',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = B.green; e.currentTarget.style.color = '#fff' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = B.green }}>
                        Ver propiedad
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ── 6. CTA Section ─────────────────────────────────────── */}
        <section id="contacto" className="max-w-6xl mx-auto px-5 py-6 mb-12">
          <div className="rounded-sm overflow-hidden relative"
            style={{ background: B.green }}>
            {/* Decorative large quotation mark */}
            <div className="absolute right-8 top-4 atlas-font-display font-bold select-none pointer-events-none"
              style={{ fontSize: '14rem', lineHeight: 1, color: 'rgba(255,255,255,0.04)', zIndex: 0 }}>
              &#8220;
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-10 p-8 md:p-12">
              {/* Left copy */}
              <div className="flex-1 text-white">
                <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4 opacity-60"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  Tasación gratuita
                </p>
                <h3 className="atlas-font-display font-semibold leading-tight mb-5"
                  style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>
                  ¿Tienes una propiedad<br />
                  <em>para vender?</em>
                </h3>
                <p className="text-sm opacity-70 mb-8 leading-relaxed max-w-sm"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  Te hacemos una tasación gratuita y sin compromiso. Evaluamos tu propiedad y te asesoramos para obtener el mejor precio del mercado.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href={`${WA}?text=${encodeURIComponent('Hola, quiero tasar mi propiedad de forma gratuita')}`}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-sm font-semibold text-sm tracking-wide transition-all hover:opacity-90"
                    style={{ background: '#25D366', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
                    <MessageCircle size={15} /> Solicitar tasación
                  </a>
                  <a href="tel:+56932930812"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-sm font-semibold text-sm tracking-wide transition-all hover:opacity-80"
                    style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontFamily: 'Inter, sans-serif' }}>
                    <Phone size={15} /> Llamar ahora
                  </a>
                </div>
              </div>

              {/* Right checklist */}
              <div className="hidden md:flex flex-col justify-center gap-4 shrink-0">
                {[
                  'Tasación sin costo',
                  'Visita a domicilio',
                  'Asesoría legal incluida',
                  'Difusión en portales top',
                  'Contrato transparente',
                ].map((text, idx) => (
                  <div key={text} className="atlas-slide-up flex items-center gap-3 text-sm font-medium text-white"
                    style={{ animationDelay: `${idx * 80}ms`, fontFamily: 'Inter, sans-serif' }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
                      <CheckCircle2 size={12} style={{ color: B.sage }} />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. Footer ──────────────────────────────────────────── */}
        <footer style={{ background: B.dark, color: '#FEFCF8' }}>
          <div className="max-w-6xl mx-auto px-5 py-14 grid md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: B.green }}>
                  <Building size={15} color="#FEFCF8" strokeWidth={1.5} />
                </div>
                <div className="leading-none">
                  <span className="atlas-font-display font-bold text-lg tracking-wide">ATLAS</span>
                  <span className="block text-[10px] font-semibold tracking-[0.15em] uppercase opacity-50"
                    style={{ fontFamily: 'Inter, sans-serif' }}>Propiedades</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed opacity-50" style={{ fontFamily: 'Inter, sans-serif' }}>
                Corredora de propiedades con más de 15 años en el mercado inmobiliario de Santiago. Confianza, transparencia y resultados.
              </p>
            </div>

            {/* Contact */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-5 opacity-40"
                style={{ fontFamily: 'Inter, sans-serif' }}>Contacto</p>
              <div className="space-y-3 text-sm opacity-60" style={{ fontFamily: 'Inter, sans-serif' }}>
                <p className="flex items-start gap-2">
                  <MapPin size={13} className="shrink-0 mt-0.5" style={{ color: B.sage }} />
                  Av. Providencia 1234, Of. 502, Santiago
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={13} style={{ color: B.sage }} />
                  +56 9 3293 0812
                </p>
                <a href="mailto:contacto@atlas.cl"
                  className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                  <span className="text-xs" style={{ color: B.sage }}>@</span> contacto@atlaspropiedades.cl
                </a>
              </div>
            </div>

            {/* Hours */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-5 opacity-40"
                style={{ fontFamily: 'Inter, sans-serif' }}>Horario</p>
              <div className="space-y-2 text-sm opacity-60" style={{ fontFamily: 'Inter, sans-serif' }}>
                <p>Lunes a Viernes: 9:00 – 19:00</p>
                <p>Sábado: 10:00 – 14:00</p>
                <p className="text-xs opacity-50 mt-3">Visitas con coordinación previa</p>
              </div>
              <div className="flex gap-4 mt-6">
                <a href="#" className="text-sm opacity-40 hover:opacity-100 transition-opacity"
                  style={{ fontFamily: 'Inter, sans-serif' }}>Instagram</a>
                <span className="opacity-20">·</span>
                <a href="#" className="text-sm opacity-40 hover:opacity-100 transition-opacity"
                  style={{ fontFamily: 'Inter, sans-serif' }}>LinkedIn</a>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-5 py-5 flex items-center justify-between flex-wrap gap-3 text-xs opacity-25"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Inter, sans-serif' }}>
            <span>© 2025 ATLAS Propiedades · Corredora inscrita en MINVU</span>
            <a href="https://agenciasi.cl" target="_blank" rel="noreferrer" className="hover:opacity-70 transition-opacity">
              Sitio desarrollado por AgenciaSI
            </a>
          </div>
        </footer>

        {/* ── 8. Property Detail Modal ───────────────────────────── */}
        {selectedProp && (() => {
          const p = selectedProp
          const meta = TYPE_META[p.type] || { icon: Home, color: B.green, bg: B.sageLt }
          const TypeIcon = meta.icon
          const tabs = [
            { id: 'general',   label: 'Descripción' },
            { id: 'detalles',  label: 'Características' },
            { id: 'ubicacion', label: 'Ubicación' },
          ]
          return (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 atlas-fade-in"
              style={{ background: 'rgba(28,26,21,0.65)', backdropFilter: 'blur(6px)' }}
              onClick={e => { if (e.target === e.currentTarget) setSelectedProp(null) }}>
              <div
                className="w-full sm:max-w-2xl bg-white flex flex-col shadow-2xl rounded-t-2xl sm:rounded-sm atlas-slide-modal sm:atlas-scale-modal"
                style={{ maxHeight: '92vh' }}>

                {/* Modal header */}
                <div className="flex items-center justify-between px-5 py-4 shrink-0"
                  style={{ borderBottom: `1px solid ${B.border}` }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-sm flex items-center justify-center" style={{ background: meta.bg }}>
                      <TypeIcon size={13} color={meta.color} />
                    </div>
                    <p className="text-sm font-semibold atlas-font-body" style={{ color: B.dark }}>
                      {p.type} en {p.trans}
                    </p>
                  </div>
                  <button onClick={() => setSelectedProp(null)}
                    className="p-1.5 rounded-sm hover:bg-gray-100 transition-colors">
                    <X size={17} style={{ color: B.muted }} />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1">
                  {/* Hero image */}
                  <div className="relative" style={{ height: 290 }}>
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(28,26,21,0.6) 0%, transparent 55%)' }} />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide"
                        style={{
                          background: p.trans === 'Venta' ? B.goldLt : B.sageLt,
                          color:      p.trans === 'Venta' ? B.gold   : B.green,
                          fontFamily: 'Inter, sans-serif',
                        }}>
                        {p.trans}
                      </span>
                      {p.badge && <PropBadge text={p.badge} />}
                    </div>
                    {/* Fav */}
                    <button className="fav-btn absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center bg-white/90 shadow-md"
                      onClick={e => toggleFav(p.id, e)}>
                      <Heart size={15} fill={favs.has(p.id) ? '#9B1C1C' : 'none'} color={favs.has(p.id) ? '#9B1C1C' : B.muted} />
                    </button>
                    {/* Address overlay */}
                    <div className="absolute bottom-3 left-4">
                      <p className="text-white text-xs font-medium flex items-center gap-1 drop-shadow"
                        style={{ fontFamily: 'Inter, sans-serif' }}>
                        <MapPin size={11} /> {p.address}, {p.commune}
                      </p>
                    </div>
                  </div>

                  {/* Price row */}
                  <div className="px-5 py-4 flex items-center justify-between gap-4"
                    style={{ borderBottom: `1px solid ${B.border}` }}>
                    <div>
                      <p className="atlas-font-display font-semibold text-3xl shimmer-gold">
                        {fmtUF(p.price, p.mes)}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: B.muted, fontFamily: 'Inter, sans-serif' }}>
                        ≈ {fmtCLP(p.price)} {p.mes ? 'por mes' : ''}
                      </p>
                      {p.gastos && (
                        <p className="text-xs mt-0.5" style={{ color: B.muted, fontFamily: 'Inter, sans-serif' }}>
                          + {p.gastos} UF/mes gastos comunes
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => waContact(p)}
                        className="btn-green flex items-center gap-1.5 px-4 py-2.5 rounded-sm text-sm font-semibold text-white"
                        style={{ background: '#25D366', fontFamily: 'Inter, sans-serif' }}>
                        <MessageCircle size={14} /> WhatsApp
                      </button>
                      <a href="tel:+56932930812"
                        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-sm text-sm font-semibold transition-opacity hover:opacity-70"
                        style={{ border: `1.5px solid ${B.border}`, color: B.muted }}>
                        <Phone size={14} />
                      </a>
                    </div>
                  </div>

                  {/* Features bar */}
                  <div className="px-5 py-3 flex flex-wrap gap-4"
                    style={{ borderBottom: `1px solid ${B.border}`, background: B.cream }}>
                    {p.m2 > 0      && <PropFeature icon={Maximize2} label={`${p.m2} m² útiles`} />}
                    {p.m2Terreno   && <PropFeature icon={Layers}    label={`${p.m2Terreno} m² terreno`} />}
                    {p.beds > 0    && <PropFeature icon={Bed}       label={`${p.beds} dormitorio${p.beds > 1 ? 's' : ''}`} />}
                    {p.baths > 0   && <PropFeature icon={Bath}      label={`${p.baths} baño${p.baths > 1 ? 's' : ''}`} />}
                    {p.parking > 0 && <PropFeature icon={Car}       label={`${p.parking} estacionamiento${p.parking > 1 ? 's' : ''}`} />}
                    {p.year        && <PropFeature icon={Tag}        label={`Año ${p.year}`} />}
                  </div>

                  {/* Tabs */}
                  <div className="flex" style={{ borderBottom: `1px solid ${B.border}` }}>
                    {tabs.map(t => (
                      <button key={t.id} onClick={() => setDetailTab(t.id)}
                        className="flex-1 py-3 text-xs font-semibold tracking-wide transition-all relative"
                        style={{
                          color:         detailTab === t.id ? B.green : B.muted,
                          fontFamily:    'Inter, sans-serif',
                          borderBottom:  detailTab === t.id ? `2px solid ${B.gold}` : '2px solid transparent',
                        }}>
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <div className="p-5 space-y-4" style={{ color: B.dark, fontFamily: 'Inter, sans-serif' }}>

                    {detailTab === 'general' && (
                      <div className="space-y-5">
                        <p className="text-sm leading-relaxed" style={{ color: '#4A4740' }}>{p.desc}</p>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-3"
                            style={{ color: B.muted }}>Equipamiento incluido</p>
                          <div className="flex flex-wrap gap-2">
                            {p.amenities.map(a => (
                              <span key={a} className="text-xs font-medium px-3 py-1.5 rounded-full"
                                style={{ background: B.sageLt, color: B.green, border: `1px solid ${B.sage}` }}>
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {detailTab === 'detalles' && (
                      <div className="space-y-0">
                        {[
                          ['Tipo de propiedad', p.type],
                          ['Transacción', p.trans],
                          ['Superficie útil', p.m2 ? `${p.m2} m²` : '—'],
                          p.m2Terreno ? ['Superficie terreno', `${p.m2Terreno} m²`] : null,
                          p.beds  > 0 ? ['Dormitorios', p.beds]   : null,
                          p.baths > 0 ? ['Baños', p.baths]        : null,
                          p.parking > 0 ? ['Estacionamientos', p.parking] : null,
                          p.year  ? ['Año de construcción', p.year]  : null,
                          p.gastos ? ['Gastos comunes', `${p.gastos} UF/mes`] : null,
                          ['Región', 'Metropolitana'],
                          ['Comuna', p.commune],
                        ].filter(Boolean).map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between py-2.5"
                            style={{ borderBottom: `1px solid ${B.border}` }}>
                            <span className="text-xs font-medium" style={{ color: B.muted }}>{k}</span>
                            <span className="text-xs font-semibold" style={{ color: B.dark }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {detailTab === 'ubicacion' && (
                      <div className="space-y-4">
                        <div className="flex items-start gap-2.5">
                          <MapPin size={14} style={{ color: B.green, flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <p className="text-sm font-semibold" style={{ color: B.dark }}>{p.address}</p>
                            <p className="text-xs mt-0.5" style={{ color: B.muted }}>{p.commune}, Región Metropolitana</p>
                          </div>
                        </div>
                        <div className="rounded-sm overflow-hidden flex items-center justify-center"
                          style={{ height: 180, background: B.sageLt, border: `1px solid ${B.sage}` }}>
                          <a href={`https://maps.google.com/?q=${encodeURIComponent(p.address + ', ' + p.commune + ', Chile')}`}
                            target="_blank" rel="noreferrer"
                            className="flex flex-col items-center gap-2.5 text-sm font-semibold transition-opacity hover:opacity-60"
                            style={{ color: B.green }}>
                            <MapPin size={30} strokeWidth={1.5} />
                            Ver en Google Maps →
                          </a>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Transporte', desc: 'Red de metro y buses' },
                            { label: 'Comercio',   desc: 'Supermercados y farmacias' },
                            { label: 'Educación',  desc: 'Colegios y universidades' },
                            { label: 'Salud',      desc: 'Clínicas y consultorios' },
                          ].map(item => (
                            <div key={item.label} className="rounded-sm p-3"
                              style={{ background: B.goldLt, border: `1px solid #E8D5A0` }}>
                              <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5"
                                style={{ color: B.gold }}>{item.label}</p>
                              <p className="text-xs" style={{ color: B.dark }}>{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal footer */}
                <div className="px-5 py-4 shrink-0 flex gap-3" style={{ borderTop: `1px solid ${B.border}` }}>
                  <button onClick={() => waContact(p)}
                    className="flex-1 py-3 rounded-sm font-semibold text-sm text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                    style={{ background: B.green, fontFamily: 'Inter, sans-serif' }}>
                    <MessageCircle size={15} /> Consultar por WhatsApp
                  </button>
                  <button onClick={() => setSelectedProp(null)}
                    className="px-5 py-3 rounded-sm font-semibold text-sm transition-opacity hover:opacity-70"
                    style={{ background: B.cream, color: B.muted, border: `1px solid ${B.border}`, fontFamily: 'Inter, sans-serif' }}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )
        })()}

        {/* ── 9. WhatsApp FAB ────────────────────────────────────── */}
        <a href={WA} target="_blank" rel="noreferrer"
          className="glow-green fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-40 transition-transform hover:scale-110"
          style={{ background: '#25D366' }}>
          <MessageCircle size={26} color="#fff" strokeWidth={2} />
        </a>

      </div>
    </>
  )
}

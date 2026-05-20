import { useState } from 'react'
import {
  Home, Building2, Layers, Briefcase, Search, X, MapPin, Phone,
  Bed, Bath, Car, Maximize2, Heart, MessageCircle, ArrowRight,
  Shield, CheckCircle2, ChevronRight, Tag, Star, Building,
} from 'lucide-react'

const B = {
  navy:   '#0B1F3A',
  blue:   '#1756C5',
  sky:    '#EEF4FF',
  mid:    '#DBEAFE',
  gold:   '#D97706',
  amber:  '#FEF3C7',
  gray:   '#6B7280',
  dark:   '#111827',
  border: '#E5E7EB',
  bg:     '#F8FAFC',
}

const WA = 'https://wa.me/56932930812'

const UF_CLP = 38850

const fmtUF   = (n, mes) => n.toLocaleString('es-CL') + ' UF' + (mes ? '/mes' : '')
const fmtCLP  = (n) => '$' + Math.round(n * UF_CLP).toLocaleString('es-CL')

const TYPE_META = {
  'Casa':         { icon: Home,      color: '#16A34A', bg: '#F0FDF4' },
  'Departamento': { icon: Building2, color: '#2563EB', bg: '#EFF6FF' },
  'Oficina':      { icon: Briefcase, color: '#7C3AED', bg: '#F5F3FF' },
  'Terreno':      { icon: Layers,    color: '#D97706', bg: '#FFFBEB' },
}

const BADGE_STYLE = {
  'Destacada':   { bg: '#FEF3C7', fg: '#92400E' },
  'Nuevo':       { bg: '#DBEAFE', fg: '#1E40AF' },
  'Premium':     { bg: '#EDE9FE', fg: '#5B21B6' },
  'Amoblado':    { bg: '#D1FAE5', fg: '#065F46' },
  'Corporativa': { bg: '#F3E8FF', fg: '#6B21A8' },
  'Oportunidad': { bg: '#FEE2E2', fg: '#991B1B' },
  'Exclusiva':   { bg: '#0B1F3A', fg: '#FFFFFF'  },
  'Remodelada':  { bg: '#ECFDF5', fg: '#065F46' },
  'Penthouse':   { bg: '#1756C5', fg: '#FFFFFF'  },
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

function Feature({ icon, label }) {
  const FeatureIcon = icon
  return (
    <span className="flex items-center gap-1 text-xs" style={{ color: B.gray }}>
      <FeatureIcon size={12} style={{ color: B.blue }} />
      {label}
    </span>
  )
}

function Badge({ text }) {
  const s = BADGE_STYLE[text] || { bg: B.sky, fg: B.blue }
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: s.bg, color: s.fg }}>
      {text}
    </span>
  )
}

export default function DemoCorredora() {
  const [typeFilter, setTypeFilter] = useState('Todos')
  const [transFilter, setTransFilter] = useState('Todos')
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedProp, setSelectedProp] = useState(null)
  const [detailTab, setDetailTab] = useState('general')
  const [favs, setFavs] = useState(new Set())

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

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        .anim-fade-up  { animation: fadeUp  0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .anim-fade-in  { animation: fadeIn  0.5s ease both; }
        .anim-scale-in { animation: scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .d-1 { animation-delay: 80ms; }
        .d-2 { animation-delay: 180ms; }
        .d-3 { animation-delay: 280ms; }
        .d-4 { animation-delay: 380ms; }
        .d-5 { animation-delay: 480ms; }
        .d-6 { animation-delay: 580ms; }
        .card-lift { transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease; }
        .card-lift:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.10); }
        .img-zoom { overflow: hidden; }
        .img-zoom img { transition: transform 0.5s cubic-bezier(0.22,1,0.36,1); }
        .img-zoom:hover img { transform: scale(1.06); }
        .pill-btn { transition: all 0.18s cubic-bezier(0.22,1,0.36,1); }
        .pill-btn:hover { transform: translateY(-1px); }
        .fav-btn { transition: transform 0.2s ease; }
        .fav-btn:active { transform: scale(1.3); }
        .btn-cta { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(23,86,197,0.35); }
      `}</style>

    <div className="min-h-screen" style={{ background: B.bg, fontFamily: 'Inter, sans-serif' }}>

      {/* Demo Banner */}
      <div className="text-center py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-3 flex-wrap"
        style={{ background: B.navy, color: '#fff' }}>
        <span>Demo creado por AgenciaSi — ¿Quieres este sitio para tu corredora?</span>
        <a href="https://agenciasi.cl/#contact" target="_blank" rel="noreferrer"
          className="underline font-bold hover:opacity-80 transition-opacity flex items-center gap-1">
          Cotizar ahora <ArrowRight size={11} />
        </a>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: B.navy }}>
              <Building size={18} color="#fff" strokeWidth={1.8} />
            </div>
            <div>
              <p className="font-black text-sm leading-tight" style={{ color: B.navy }}>Urbana</p>
              <p className="font-black text-sm leading-tight" style={{ color: B.blue }}>Propiedades</p>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-semibold shrink-0" style={{ color: B.gray }}>
            <a href="#inicio"      className="hover:opacity-70 transition-opacity">Inicio</a>
            <a href="#propiedades" className="hover:opacity-70 transition-opacity">Propiedades</a>
            <a href="#venta"       className="hover:opacity-70 transition-opacity" style={{ color: B.blue }}>Venta</a>
            <a href="#arriendo"    className="hover:opacity-70 transition-opacity">Arriendo</a>
            <a href="#contacto"    className="hover:opacity-70 transition-opacity">Contacto</a>
          </div>

          {/* Search */}
          <div className="flex-1 relative max-w-xl">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: search ? B.blue : B.gray }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 180)}
              onKeyDown={e => { if (e.key === 'Escape') { setSearch(''); setSearchOpen(false) } }}
              placeholder="Busca por tipo, comuna o características…"
              className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: search ? B.sky : '#F3F4F6',
                border: `1.5px solid ${search ? B.blue : 'transparent'}`,
              }}
            />
            {search && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: B.blue, color: '#fff' }}>{filtered.length}</span>
                <button onClick={() => { setSearch(''); setSearchOpen(false) }} className="p-0.5 rounded-full hover:bg-gray-200 transition-colors">
                  <X size={13} style={{ color: B.gray }} />
                </button>
              </div>
            )}

            {/* Search dropdown */}
            {searchOpen && search && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl overflow-hidden"
                style={{ border: `1px solid ${B.border}`, zIndex: 60 }}>
                {filtered.length === 0 ? (
                  <div className="px-4 py-5 text-center">
                    <p className="text-sm font-semibold mb-0.5" style={{ color: B.dark }}>Sin resultados para &ldquo;{search}&rdquo;</p>
                    <p className="text-xs" style={{ color: B.gray }}>Prueba con otra comuna o tipo de propiedad</p>
                  </div>
                ) : (
                  <>
                    {filtered.slice(0, 5).map(p => {
                      const meta = TYPE_META[p.type] || {}
                      return (
                        <button key={p.id}
                          onMouseDown={() => { setSelectedProp(p); setDetailTab('general'); setSearchOpen(false) }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                          style={{ borderBottom: `1px solid ${B.border}` }}>
                          <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 img-zoom">
                            <img src={p.img} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate" style={{ color: B.dark }}>{p.title}</p>
                            <p className="text-[11px]" style={{ color: B.gray }}>{p.commune} · {p.type}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full mb-1 inline-block"
                              style={{ background: p.trans === 'Venta' ? '#FEE2E2' : '#D1FAE5', color: p.trans === 'Venta' ? '#991B1B' : '#065F46' }}>
                              {p.trans}
                            </span>
                            <p className="text-sm font-black block" style={{ color: meta.color }}>{fmtUF(p.price, p.mes)}</p>
                          </div>
                        </button>
                      )
                    })}
                    {filtered.length > 5 ? (
                      <button onMouseDown={() => { setSearchOpen(false); document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth' }) }}
                        className="w-full py-3 text-sm font-bold text-center hover:bg-gray-50 transition-colors"
                        style={{ color: B.blue }}>
                        Ver todos los {filtered.length} resultados →
                      </button>
                    ) : (
                      <div className="px-4 py-2 text-center text-[11px]" style={{ color: B.gray, background: '#FAFAFA' }}>
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
            className="btn-cta shrink-0 hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white"
            style={{ background: B.blue }}>
            <Phone size={13} /> Contactar
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div id="inicio" className="relative overflow-hidden" style={{ minHeight: 480 }}>
        <img
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&h=700&fit=crop&q=80"
          alt="Urbana Propiedades"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 40%' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(11,31,58,0.95) 0%, rgba(11,31,58,0.80) 50%, rgba(23,86,197,0.40) 100%)' }} />

        <div className="relative max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-12">
          {/* Copy */}
          <div className="text-white flex-1">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-4 anim-fade-in" style={{ color: '#93C5FD' }}>
              Corredora de Propiedades · Santiago, Chile
            </span>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5 anim-fade-up d-1">
              Encuentra tu<br /><span style={{ color: '#60A5FA' }}>propiedad ideal</span><br />en Santiago
            </h1>
            <p className="text-sm opacity-80 mb-8 leading-relaxed max-w-md anim-fade-up d-2">
              Más de 200 propiedades en las mejores comunas de la Región Metropolitana. Venta y arriendo con asesoría personalizada.
            </p>
            <div className="flex flex-wrap gap-4 anim-fade-up d-3">
              <button onClick={() => { setTransFilter('Venta'); document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="btn-cta px-6 py-3 rounded-xl font-bold text-sm"
                style={{ background: B.blue, color: '#fff' }}>
                Ver propiedades en venta
              </button>
              <button onClick={() => { setTransFilter('Arriendo'); document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="px-6 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
                Ver arriendos
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 shrink-0 anim-scale-in d-4">
            {[
              { n: '200+', label: 'Propiedades' },
              { n: '15',   label: 'Años de experiencia' },
              { n: '98%',  label: 'Clientes satisfechos' },
              { n: '50+',  label: 'Comunas activas' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-5 text-center text-white"
                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.14)' }}>
                <p className="text-2xl font-black mb-0.5" style={{ color: '#60A5FA' }}>{s.n}</p>
                <p className="text-[11px] opacity-70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div style={{ background: B.navy, borderBottom: `1px solid rgba(255,255,255,0.08)` }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap gap-x-8 gap-y-2 items-center justify-between text-xs text-white opacity-70">
          <span className="flex items-center gap-1.5"><Shield size={12} style={{ color: '#60A5FA' }} /> Corredora inscrita en MINVU</span>
          <span className="flex items-center gap-1.5"><MapPin size={12} style={{ color: '#60A5FA' }} /> Av. Providencia 1234, Of. 502</span>
          <span className="flex items-center gap-1.5"><Phone size={12} style={{ color: '#60A5FA' }} /> +56 9 3293 0812</span>
          <span className="flex items-center gap-1.5"><Star size={12} fill="#60A5FA" color="#60A5FA" /> 4.9 · Google Reviews</span>
        </div>
      </div>

      {/* ── Propiedades ── */}
      <section id="propiedades" className="max-w-6xl mx-auto px-4 py-10">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: B.blue }}>Catálogo</p>
            <h2 className="text-xl font-black" style={{ color: B.dark }}>
              {filtered.length} propiedad{filtered.length !== 1 ? 'es' : ''} disponible{filtered.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Type filter */}
            <div className="flex gap-1.5 flex-wrap">
              {TYPES.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className="pill-btn px-3 py-1.5 rounded-full text-xs font-bold"
                  style={typeFilter === t
                    ? { background: B.navy, color: '#fff' }
                    : { background: '#F3F4F6', color: B.gray }}>
                  {t}
                </button>
              ))}
            </div>
            <div className="w-px self-stretch" style={{ background: B.border }} />
            {/* Trans filter */}
            <div className="flex gap-1.5">
              {TRANS.map(t => (
                <button key={t} onClick={() => setTransFilter(t)}
                  className="pill-btn px-3 py-1.5 rounded-full text-xs font-bold"
                  style={transFilter === t
                    ? { background: t === 'Venta' ? '#DC2626' : t === 'Arriendo' ? '#16A34A' : B.blue, color: '#fff' }
                    : { background: '#F3F4F6', color: B.gray }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24" style={{ color: B.gray }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#F3F4F6' }}>
              <Search size={28} color={B.gray} strokeWidth={1.5} />
            </div>
            <p className="font-semibold text-base mb-1" style={{ color: B.dark }}>No hay propiedades con esos filtros</p>
            <p className="text-sm">Prueba cambiando el tipo o la transacción</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p, i) => {
              const meta = TYPE_META[p.type] || { color: B.blue, bg: B.sky }
              const TypeIcon = meta.icon || Home
              const isFav = favs.has(p.id)
              return (
                <div key={p.id}
                  className={`card-lift bg-white rounded-2xl overflow-hidden flex flex-col cursor-pointer anim-scale-in`}
                  style={{ border: `1px solid ${B.border}`, animationDelay: `${i * 60}ms` }}
                  onClick={() => { setSelectedProp(p); setDetailTab('general') }}>

                  {/* Image */}
                  <div className="relative img-zoom" style={{ height: 200 }}>
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: p.trans === 'Venta' ? '#FEE2E2' : '#D1FAE5', color: p.trans === 'Venta' ? '#991B1B' : '#065F46' }}>
                        {p.trans}
                      </span>
                      {p.badge && <Badge text={p.badge} />}
                    </div>
                    {/* Type icon */}
                    <div className="absolute top-3 right-12 w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: meta.bg }}>
                      <TypeIcon size={14} color={meta.color} />
                    </div>
                    {/* Fav */}
                    <button className="fav-btn absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm shadow"
                      onClick={e => toggleFav(p.id, e)}>
                      <Heart size={14} fill={isFav ? '#DC2626' : 'none'} color={isFav ? '#DC2626' : B.gray} />
                    </button>
                    {/* Commune overlay */}
                    <div className="absolute bottom-0 left-0 right-0 px-3 py-2"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)' }}>
                      <p className="text-white text-xs font-semibold flex items-center gap-1">
                        <MapPin size={10} /> {p.commune}, {p.region}
                      </p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-sm font-bold mb-2 leading-snug" style={{ color: B.dark }}>{p.title}</p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-3 mb-3">
                      {p.m2 > 0 && <Feature icon={Maximize2} label={`${p.m2} m²`} />}
                      {p.beds > 0  && <Feature icon={Bed}      label={`${p.beds} dorm.`} />}
                      {p.baths > 0 && <Feature icon={Bath}     label={`${p.baths} baño${p.baths > 1 ? 's' : ''}`} />}
                      {p.parking > 0 && <Feature icon={Car}    label={`${p.parking} est.`} />}
                    </div>

                    <div className="mt-auto">
                      <p className="text-xl font-black" style={{ color: meta.color }}>{fmtUF(p.price, p.mes)}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: B.gray }}>≈ {fmtCLP(p.price)}</p>
                    </div>

                    <button
                      onClick={e => { e.stopPropagation(); setSelectedProp(p); setDetailTab('general') }}
                      className="mt-3 w-full py-2.5 rounded-xl text-xs font-bold transition-opacity hover:opacity-90"
                      style={{ background: B.sky, color: B.blue }}>
                      Ver propiedad
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section id="contacto" className="max-w-6xl mx-auto px-4 py-8 mb-10">
        <div className="rounded-3xl overflow-hidden flex flex-col md:flex-row"
          style={{ background: B.navy }}>
          <div className="flex-1 p-8 md:p-12 text-white">
            <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Tasación gratuita</p>
            <h3 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
              ¿Tienes una propiedad<br />para vender o arrendar?
            </h3>
            <p className="text-sm opacity-70 mb-8 leading-relaxed max-w-sm">
              Te hacemos una tasación gratuita y sin compromiso. Llegamos a tu propiedad, evaluamos y te asesoramos para obtener el mejor precio del mercado.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={`${WA}?text=${encodeURIComponent('Hola, quiero tasar mi propiedad de forma gratuita')}`}
                target="_blank" rel="noreferrer"
                className="btn-cta inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
                style={{ background: B.blue, color: '#fff' }}>
                <MessageCircle size={15} /> Solicitar tasación
              </a>
              <a href={`tel:+56932930812`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Phone size={15} /> Llamar ahora
              </a>
            </div>
          </div>
          <div className="hidden md:flex flex-col justify-center px-10 gap-4">
            {[
              { icon: CheckCircle2, text: 'Tasación sin costo' },
              { icon: CheckCircle2, text: 'Visita a domicilio' },
              { icon: CheckCircle2, text: 'Asesoría legal incluida' },
              { icon: CheckCircle2, text: 'Difusión en portales' },
            ].map(item => (
              <p key={item.text} className="flex items-center gap-2.5 text-sm font-semibold text-white">
                <item.icon size={16} style={{ color: '#60A5FA', flexShrink: 0 }} />
                {item.text}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: B.navy, color: '#fff' }}>
        <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: B.blue }}>
                <Building size={15} color="#fff" strokeWidth={1.8} />
              </div>
              <div>
                <p className="font-black text-sm leading-tight">Urbana</p>
                <p className="font-black text-sm leading-tight" style={{ color: '#60A5FA' }}>Propiedades</p>
              </div>
            </div>
            <p className="text-sm opacity-60 leading-relaxed">
              Corredora de propiedades con más de 15 años en el mercado inmobiliario de Santiago. Confianza, transparencia y resultados.
            </p>
          </div>
          <div>
            <p className="font-bold mb-4 text-xs uppercase tracking-widest opacity-40">Contacto</p>
            <div className="space-y-2.5 text-sm opacity-70">
              <p className="flex items-start gap-2"><MapPin size={13} className="shrink-0 mt-0.5" /> Av. Providencia 1234, Of. 502, Santiago</p>
              <p className="flex items-center gap-2"><Phone size={13} /> +56 9 3293 0812</p>
              <a href="mailto:contacto@urbana.cl" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                <span className="text-xs opacity-60">@</span> contacto@urbana.cl
              </a>
            </div>
          </div>
          <div>
            <p className="font-bold mb-4 text-xs uppercase tracking-widest opacity-40">Horario de atención</p>
            <div className="space-y-2 text-sm opacity-70">
              <p>Lunes a Viernes: 9:00 – 19:00</p>
              <p>Sábado: 10:00 – 14:00</p>
              <p className="text-xs opacity-50 mt-2">Visitas con coordinación previa</p>
            </div>
            <div className="flex gap-3 mt-5">
              <a href="#" className="text-sm opacity-60 hover:opacity-100">Instagram</a>
              <span className="opacity-20">·</span>
              <a href="#" className="text-sm opacity-60 hover:opacity-100">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between flex-wrap gap-3 text-xs opacity-30"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <span>© 2025 Urbana Propiedades · Corredora inscrita en MINVU</span>
          <a href="https://agenciasi.cl" target="_blank" rel="noreferrer" className="hover:opacity-70 transition-opacity">
            Sitio desarrollado por AgenciaSi
          </a>
        </div>
      </footer>

      {/* ── Property Detail Modal ── */}
      {selectedProp && (() => {
        const p = selectedProp
        const meta = TYPE_META[p.type] || { icon: Home, color: B.blue, bg: B.sky }
        const TypeIcon = meta.icon
        const tabs = [
          { id: 'general',     label: 'Descripción' },
          { id: 'detalles',    label: 'Características' },
          { id: 'ubicacion',   label: 'Ubicación' },
        ]
        return (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <div className="w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl"
              style={{ maxHeight: '92vh' }}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: `1px solid ${B.border}` }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: meta.bg }}>
                    <TypeIcon size={14} color={meta.color} />
                  </div>
                  <p className="text-sm font-bold" style={{ color: B.dark }}>{p.type} en {p.trans}</p>
                </div>
                <button onClick={() => setSelectedProp(null)} className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                  <X size={18} style={{ color: B.gray }} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1">
                {/* Image */}
                <div className="relative" style={{ height: 260 }}>
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: p.trans === 'Venta' ? '#FEE2E2' : '#D1FAE5', color: p.trans === 'Venta' ? '#991B1B' : '#065F46' }}>
                      {p.trans}
                    </span>
                    {p.badge && <Badge text={p.badge} />}
                  </div>
                  <button className="absolute top-3 right-3 fav-btn w-9 h-9 rounded-full flex items-center justify-center bg-white/90 shadow"
                    onClick={e => toggleFav(p.id, e)}>
                    <Heart size={16} fill={favs.has(p.id) ? '#DC2626' : 'none'} color={favs.has(p.id) ? '#DC2626' : B.gray} />
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white text-xs font-semibold flex items-center gap-1 drop-shadow">
                      <MapPin size={11} /> {p.address}, {p.commune}
                    </p>
                  </div>
                </div>

                {/* Price + actions */}
                <div className="px-5 py-4 flex items-center justify-between gap-4" style={{ borderBottom: `1px solid ${B.border}` }}>
                  <div>
                    <p className="text-3xl font-black" style={{ color: meta.color }}>{fmtUF(p.price, p.mes)}</p>
                    <p className="text-xs mt-0.5" style={{ color: B.gray }}>≈ {fmtCLP(p.price)} {p.mes ? 'por mes' : ''}</p>
                    {p.gastos && <p className="text-xs mt-0.5" style={{ color: B.gray }}>+ {p.gastos} UF/mes gastos comunes</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => waContact(p)}
                      className="btn-cta flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
                      style={{ background: '#25D366' }}>
                      <MessageCircle size={15} /> WhatsApp
                    </button>
                    <a href={`tel:+56932930812`}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-80"
                      style={{ border: `1.5px solid ${B.border}`, color: B.gray }}>
                      <Phone size={15} />
                    </a>
                  </div>
                </div>

                {/* Features bar */}
                <div className="px-5 py-3 flex flex-wrap gap-4" style={{ borderBottom: `1px solid ${B.border}`, background: '#FAFAFA' }}>
                  {p.m2 > 0     && <Feature icon={Maximize2} label={`${p.m2} m² útiles`} />}
                  {p.m2Terreno  && <Feature icon={Layers}    label={`${p.m2Terreno} m² terreno`} />}
                  {p.beds > 0   && <Feature icon={Bed}       label={`${p.beds} dormitorio${p.beds > 1 ? 's' : ''}`} />}
                  {p.baths > 0  && <Feature icon={Bath}      label={`${p.baths} baño${p.baths > 1 ? 's' : ''}`} />}
                  {p.parking > 0 && <Feature icon={Car}      label={`${p.parking} estacionamiento${p.parking > 1 ? 's' : ''}`} />}
                  {p.year       && <Feature icon={Tag}        label={`Año ${p.year}`} />}
                </div>

                {/* Tabs */}
                <div className="flex" style={{ borderBottom: `1px solid ${B.border}` }}>
                  {tabs.map(t => (
                    <button key={t.id} onClick={() => setDetailTab(t.id)}
                      className="flex-1 py-3 text-xs font-bold transition-all"
                      style={detailTab === t.id
                        ? { color: B.blue, borderBottom: `2px solid ${B.blue}` }
                        : { color: B.gray }}>
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="p-5 space-y-4 text-sm" style={{ color: B.dark }}>
                  {detailTab === 'general' && (
                    <div className="space-y-4">
                      <p className="leading-relaxed" style={{ color: '#374151' }}>{p.desc}</p>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: B.gray }}>Características incluidas</p>
                        <div className="grid grid-cols-2 gap-2">
                          {p.amenities.map(a => (
                            <div key={a} className="flex items-center gap-2 text-xs" style={{ color: '#374151' }}>
                              <CheckCircle2 size={13} style={{ color: B.blue, flexShrink: 0 }} />
                              {a}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {detailTab === 'detalles' && (
                    <div className="space-y-3">
                      {[
                        ['Tipo de propiedad', p.type],
                        ['Transacción', p.trans],
                        ['Superficie útil', p.m2 ? `${p.m2} m²` : '—'],
                        p.m2Terreno ? ['Superficie terreno', `${p.m2Terreno} m²`] : null,
                        p.beds  > 0 ? ['Dormitorios', p.beds]  : null,
                        p.baths > 0 ? ['Baños', p.baths]       : null,
                        p.parking > 0 ? ['Estacionamientos', p.parking] : null,
                        p.year ? ['Año de construcción', p.year] : null,
                        p.gastos ? ['Gastos comunes', `${p.gastos} UF/mes`] : null,
                        ['Región', 'Metropolitana'],
                        ['Comuna', p.commune],
                      ].filter(Boolean).map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${B.border}` }}>
                          <span className="text-xs font-semibold" style={{ color: B.gray }}>{k}</span>
                          <span className="text-xs font-bold" style={{ color: B.dark }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {detailTab === 'ubicacion' && (
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <MapPin size={15} style={{ color: B.blue, flexShrink: 0, marginTop: 2 }} />
                        <div>
                          <p className="font-semibold">{p.address}</p>
                          <p style={{ color: B.gray }}>{p.commune}, Región Metropolitana</p>
                        </div>
                      </div>
                      <div className="rounded-2xl overflow-hidden flex items-center justify-center"
                        style={{ height: 180, background: '#E5E7EB' }}>
                        <a href={`https://maps.google.com/?q=${encodeURIComponent(p.address + ', ' + p.commune + ', Chile')}`}
                          target="_blank" rel="noreferrer"
                          className="flex flex-col items-center gap-2 text-sm font-bold transition-opacity hover:opacity-70"
                          style={{ color: B.blue }}>
                          <MapPin size={32} />
                          Ver en Google Maps →
                        </a>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Transporte', desc: 'Red de metro y buses' },
                          { label: 'Comercio', desc: 'Supermercados y farmacias' },
                          { label: 'Educación', desc: 'Colegios y universidades' },
                          { label: 'Salud', desc: 'Clínicas y consultorios' },
                        ].map(item => (
                          <div key={item.label} className="rounded-xl p-3" style={{ background: B.sky }}>
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: B.blue }}>{item.label}</p>
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
                  className="flex-1 btn-cta py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
                  style={{ background: B.blue }}>
                  <MessageCircle size={16} /> Consultar por WhatsApp
                </button>
                <button onClick={() => setSelectedProp(null)}
                  className="px-5 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-70"
                  style={{ background: '#F3F4F6', color: B.gray }}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* WhatsApp FAB */}
      <a href={WA} target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-40 transition-transform hover:scale-110"
        style={{ background: '#25D366' }}>
        <MessageCircle size={26} color="#fff" strokeWidth={2} />
      </a>

    </div>
    </>
  )
}

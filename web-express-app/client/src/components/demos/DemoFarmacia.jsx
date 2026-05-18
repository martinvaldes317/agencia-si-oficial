import { useState, useMemo } from 'react'
import {
  ShoppingCart, Search, Phone, MapPin, Clock, X, Plus, Minus,
  MessageCircle, Truck, Shield, Tag, ArrowRight, Star,
  Pill, Leaf, Sun, Sparkles, Wind, Droplets, Fish, Activity,
  Heart, ShieldCheck, Thermometer, Package, CreditCard
} from 'lucide-react'

const BRAND = {
  green: '#16A34A',
  dark: '#14532D',
  light: '#F0FDF4',
  mid: '#DCFCE7',
  gray: '#6B7280',
  border: '#E5E7EB',
  black: '#111827',
}

const WA = 'https://wa.me/56932930812'

// Icon config: { icon, color, bg }
const ICON_MAP = {
  pill_indigo:   { icon: Pill,         color: '#4F46E5', bg: '#EEF2FF' },
  leaf_green:    { icon: Leaf,         color: '#16A34A', bg: '#F0FDF4' },
  sun_amber:     { icon: Sun,          color: '#D97706', bg: '#FFFBEB' },
  sparkles_pink: { icon: Sparkles,     color: '#EC4899', bg: '#FDF2F8' },
  wind_blue:     { icon: Wind,         color: '#0EA5E9', bg: '#F0F9FF' },
  drops_purple:  { icon: Droplets,     color: '#7C3AED', bg: '#F5F3FF' },
  fish_teal:     { icon: Fish,         color: '#0D9488', bg: '#F0FDFA' },
  activity_org:  { icon: Activity,     color: '#EA580C', bg: '#FFF7ED' },
  heart_rose:    { icon: Heart,        color: '#E11D48', bg: '#FFF1F2' },
  drops_cyan:    { icon: Droplets,     color: '#0891B2', bg: '#ECFEFF' },
  shield_slate:  { icon: ShieldCheck,  color: '#475569', bg: '#F8FAFC' },
  thermo_red:    { icon: Thermometer,  color: '#DC2626', bg: '#FEF2F2' },
}

const PRODUCTS = [
  // OTC
  { id: 1,  cat: 'OTC',            name: 'Paracetamol 500mg',        sub: 'Caja 20 comprimidos',      price: 3490,  badge: 'Más vendido', iconKey: 'pill_indigo',   stars: 4.8 },
  { id: 2,  cat: 'OTC',            name: 'Ibuprofeno 400mg',          sub: 'Caja 20 comprimidos',      price: 4290,  badge: null,          iconKey: 'pill_indigo',   stars: 4.6 },
  { id: 3,  cat: 'OTC',            name: 'Vitamina C 1000mg',         sub: 'Frasco 30 cápsulas',       price: 6990,  badge: 'Oferta',      iconKey: 'leaf_green',    stars: 4.9 },
  { id: 4,  cat: 'OTC',            name: 'Antigripal Noche',          sub: 'Caja 10 sobres',           price: 5490,  badge: null,          iconKey: 'pill_indigo',   stars: 4.5 },
  // Dermocosmética
  { id: 5,  cat: 'Dermocosmética', name: 'Protector Solar SPF 50+',   sub: 'Loción 200ml · Eucerin',   price: 18990, badge: 'Premium',     iconKey: 'sun_amber',     stars: 4.9 },
  { id: 6,  cat: 'Dermocosmética', name: 'Hidratante Facial',         sub: 'Crema 50ml · Cetaphil',    price: 14990, badge: null,          iconKey: 'sparkles_pink', stars: 4.7 },
  { id: 7,  cat: 'Dermocosmética', name: 'Shampoo Anticaída',         sub: 'Frasco 400ml',             price: 9990,  badge: 'Oferta',      iconKey: 'wind_blue',     stars: 4.4 },
  { id: 8,  cat: 'Dermocosmética', name: 'Vitamina E Facial',         sub: 'Sérum 30ml',               price: 11990, badge: null,          iconKey: 'drops_purple',  stars: 4.6 },
  // Vitaminas
  { id: 9,  cat: 'Vitaminas',      name: 'Omega 3 · 1000mg',          sub: 'Frasco 60 cápsulas',       price: 12990, badge: 'Más vendido', iconKey: 'fish_teal',     stars: 4.8 },
  { id: 10, cat: 'Vitaminas',      name: 'Magnesio B6',               sub: 'Frasco 60 comprimidos',    price: 8490,  badge: null,          iconKey: 'activity_org',  stars: 4.5 },
  { id: 11, cat: 'Vitaminas',      name: 'Complejo B',                sub: 'Frasco 30 cápsulas',       price: 7290,  badge: null,          iconKey: 'activity_org',  stars: 4.6 },
  { id: 12, cat: 'Vitaminas',      name: 'Zinc + Vitamina C',         sub: 'Frasco 30 gummies',        price: 9990,  badge: 'Nuevo',       iconKey: 'activity_org',  stars: 4.7 },
  // Bebé
  { id: 13, cat: 'Bebé',           name: 'Paracetamol Pediátrico',    sub: 'Suspensión 100ml',         price: 4990,  badge: null,          iconKey: 'heart_rose',    stars: 4.9 },
  { id: 14, cat: 'Bebé',           name: 'Crema Pañal Bepanthen',     sub: 'Tubo 100g',                price: 8990,  badge: 'Recomendado', iconKey: 'heart_rose',    stars: 4.9 },
  { id: 15, cat: 'Bebé',           name: 'Suero Fisiológico',         sub: 'Unidosis 5ml · 20 unid.',  price: 5490,  badge: null,          iconKey: 'heart_rose',    stars: 4.7 },
  // Higiene
  { id: 16, cat: 'Higiene',        name: 'Alcohol Gel 500ml',         sub: 'Con hidratante',           price: 3290,  badge: null,          iconKey: 'drops_cyan',    stars: 4.4 },
  { id: 17, cat: 'Higiene',        name: 'Mascarillas KN95',          sub: 'Caja 10 unidades',         price: 4990,  badge: null,          iconKey: 'shield_slate',  stars: 4.5 },
  { id: 18, cat: 'Higiene',        name: 'Termómetro Digital',        sub: 'Lectura en 10 segundos',   price: 14990, badge: 'Oferta',      iconKey: 'thermo_red',    stars: 4.8 },
]

const CATS = ['Todos', 'OTC', 'Dermocosmética', 'Vitaminas', 'Bebé', 'Higiene']

const fmt = (n) => '$' + n.toLocaleString('es-CL')

const BADGE_COLORS = {
  'Más vendido': { bg: '#FEF9C3', fg: '#854D0E' },
  'Oferta':      { bg: '#FEE2E2', fg: '#991B1B' },
  'Premium':     { bg: '#EDE9FE', fg: '#5B21B6' },
  'Nuevo':       { bg: '#DBEAFE', fg: '#1E40AF' },
  'Recomendado': { bg: '#DCFCE7', fg: '#14532D' },
}

function BadgeChip({ text }) {
  const { bg, fg } = BADGE_COLORS[text] || { bg: BRAND.mid, fg: BRAND.dark }
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: bg, color: fg }}
    >
      {text}
    </span>
  )
}

function Stars({ n }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={11} fill="#FBBF24" color="#FBBF24" />
      <span className="text-[11px] font-semibold" style={{ color: BRAND.gray }}>{n}</span>
    </div>
  )
}

function ProductIcon({ iconKey }) {
  const cfg = ICON_MAP[iconKey] || { icon: Package, color: BRAND.green, bg: BRAND.light }
  const IconComp = cfg.icon
  return (
    <div
      className="h-36 flex items-center justify-center"
      style={{ background: cfg.bg }}
    >
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center"
        style={{ background: cfg.color + '18' }}
      >
        <IconComp size={40} color={cfg.color} strokeWidth={1.5} />
      </div>
    </div>
  )
}

function CartProductIcon({ iconKey }) {
  const cfg = ICON_MAP[iconKey] || { icon: Package, color: BRAND.green, bg: BRAND.light }
  const IconComp = cfg.icon
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: cfg.bg }}
    >
      <IconComp size={22} color={cfg.color} strokeWidth={1.5} />
    </div>
  )
}

export default function DemoFarmacia() {
  const [cat, setCat] = useState('Todos')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState({})
  const [cartOpen, setCartOpen] = useState(false)
  const [paying, setPaying] = useState(false)
  const [payStatus] = useState(() => new URLSearchParams(window.location.search).get('status'))
  const [step, setStep] = useState('cart')
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', entrega: 'delivery', direccion: '', notas: '' })

  const filtered = useMemo(() =>
    PRODUCTS.filter(p =>
      (cat === 'Todos' || p.cat === cat) &&
      (search === '' || p.name.toLowerCase().includes(search.toLowerCase()))
    ), [cat, search])

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0)
  const totalPrice = PRODUCTS.reduce((acc, p) => acc + (cart[p.id] || 0) * p.price, 0)

  const add = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }))
  const remove = (id) => setCart(c => {
    const n = { ...c }
    if (n[id] > 1) n[id]--
    else delete n[id]
    return n
  })

  const goCheckout = async () => {
    setPaying(true)
    try {
      const items = PRODUCTS.filter(p => cart[p.id]).map(p => ({
        title: p.name,
        quantity: cart[p.id],
        unit_price: p.price,
      }))
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/demos/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'farmacia',
          items,
          payer: { nombre: form.nombre, email: form.email, telefono: form.telefono },
          entrega: form.entrega,
          direccion: form.entrega === 'delivery' ? form.direccion : undefined,
          notas: form.notas || undefined,
        }),
      })
      const data = await res.json()
      if (data.init_point) window.location.assign(data.init_point)
    } catch {
      setPaying(false)
    }
  }

  const waOrder = () => {
    const items = PRODUCTS
      .filter(p => cart[p.id])
      .map(p => `• ${p.name} x${cart[p.id]} — ${fmt(p.price * cart[p.id])}`)
      .join('\n')
    const msg = `Hola Farmacia Santa Clara\n\nQuisiera hacer el siguiente pedido:\n\n${items}\n\n*Total: ${fmt(totalPrice)}*\n\n¿Hacen despacho a domicilio?`
    window.open(`https://wa.me/56932930812?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" />
    <div className="min-h-screen" style={{ background: '#F9FAFB', fontFamily: "'Outfit', sans-serif" }}>

      {/* Demo Banner */}
      <div
        className="text-center py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-3 flex-wrap"
        style={{ background: BRAND.dark, color: '#fff' }}
      >
        <span>Demo creado por AgenciaSi — ¿Quieres este sitio para tu farmacia?</span>
        <a
          href="https://agenciasi.cl/#contact"
          target="_blank"
          rel="noreferrer"
          className="underline font-bold hover:opacity-80 transition-opacity flex items-center gap-1"
        >
          Cotizar ahora <ArrowRight size={11} />
        </a>
      </div>

      {payStatus && (
        <div style={{
          background: payStatus === 'approved' ? '#16A34A' : payStatus === 'pending' ? '#D97706' : '#DC2626',
          color: '#fff', padding: '14px 20px', textAlign: 'center', fontWeight: 700, fontSize: 15,
        }}>
          {payStatus === 'approved' && '¡Pago aprobado! Tu pedido está confirmado. Te contactaremos pronto.'}
          {payStatus === 'pending' && 'Pago en proceso. Te avisaremos cuando se confirme.'}
          {payStatus === 'failure' && 'El pago no pudo procesarse. Intenta nuevamente.'}
        </div>
      )}

      {/* Top bar */}
      <div
        className="text-xs py-2 px-5 flex items-center justify-between flex-wrap gap-2"
        style={{ background: BRAND.light, borderBottom: `1px solid ${BRAND.mid}`, color: BRAND.dark }}
      >
        <div className="flex items-center gap-5 flex-wrap">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} />
            Av. Huamachuco 842, San Clemente
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            Lun–Sáb 8:30–21:00 · Dom 9:00–19:00
          </span>
        </div>
        <a
          href={WA}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 font-bold hover:opacity-75 transition-opacity"
        >
          <Phone size={12} /> +56 9 3293 0812
        </a>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: BRAND.green }}
            >
              <Pill size={18} color="#fff" strokeWidth={2} />
            </div>
            <div>
              <p className="font-black text-sm leading-tight" style={{ color: BRAND.dark }}>Farmacia</p>
              <p className="font-black text-sm leading-tight" style={{ color: BRAND.green }}>Santa Clara</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 relative max-w-xl">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: BRAND.gray }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Busca medicamentos, vitaminas, dermocosméticos…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: '#F3F4F6',
                border: `1.5px solid ${search ? BRAND.green : 'transparent'}`,
              }}
            />
          </div>

          {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2.5 rounded-xl transition-opacity hover:opacity-80"
            style={{ background: BRAND.green }}
          >
            <ShoppingCart size={18} color="#fff" />
            {totalItems > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center text-white"
                style={{ background: '#DC2626' }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero section with background image */}
      <div className="relative overflow-hidden" style={{ minHeight: 340 }}>
        <img
          src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1400&h=600&fit=crop&q=80"
          alt="Farmacia Santa Clara"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center' }}
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(20,83,45,0.90) 0%, rgba(22,163,74,0.70) 60%, rgba(22,163,74,0.30) 100%)' }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-14 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Copy */}
          <div className="text-white max-w-lg">
            <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-3">Farmacia Santa Clara</p>
            <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
              Tu salud,<br />a un clic de distancia
            </h1>
            <p className="text-sm opacity-80 mb-6 leading-relaxed max-w-sm">
              Medicamentos, vitaminas y dermocosméticos con despacho a domicilio el mismo día en San Clemente y alrededores.
            </p>
            <a
              href={WA}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
              style={{ background: '#fff', color: BRAND.dark }}
            >
              <MessageCircle size={16} style={{ color: '#25D366' }} />
              Pedir por WhatsApp
            </a>
          </div>

          {/* Feature badges */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            {[
              { icon: <Truck size={22} color={BRAND.green} />,   title: 'Despacho',   sub: 'mismo día' },
              { icon: <Shield size={22} color={BRAND.green} />,  title: 'Productos',  sub: '100% originales' },
              { icon: <Tag size={22} color={BRAND.green} />,     title: 'Precios',    sub: 'convenientes' },
            ].map(b => (
              <div
                key={b.title}
                className="rounded-2xl p-4 text-center text-white"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)' }}
              >
                <div className="flex justify-center mb-2">{b.icon}</div>
                <p className="text-xs font-bold">{b.title}</p>
                <p className="text-[10px] opacity-70 mt-0.5">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div style={{ background: '#F0FDF4', borderBottom: `1px solid ${BRAND.border}` }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap gap-x-8 gap-y-2 items-center justify-between text-xs" style={{ color: BRAND.gray }}>
          <span className="font-semibold" style={{ color: BRAND.dark }}>Farmacia Santa Clara Ltda. · RUT 76.543.210-K</span>
          <span className="flex items-center gap-1.5"><Shield size={12} style={{ color: BRAND.green }} /> Autorizada ISP · Reg. N° 24.567</span>
          <span className="flex items-center gap-1.5"><MapPin size={12} style={{ color: BRAND.green }} /> Av. Huamachuco 842, San Clemente</span>
          <span className="flex items-center gap-1.5"><Phone size={12} style={{ color: BRAND.green }} /> +56 9 3293 0812</span>
        </div>
      </div>

      {/* Layout: sidebar + products */}
      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6 items-start">

        {/* ── Vertical category sidebar ── */}
        <aside className="hidden md:flex flex-col w-52 shrink-0 sticky top-[73px]">
          <p className="text-[11px] font-bold uppercase tracking-widest mb-3 px-3" style={{ color: BRAND.gray }}>
            Categorías
          </p>
          {CATS.map(name => {
            const iconMap = { 'Todos': Package, 'OTC': Pill, 'Dermocosmética': Sparkles, 'Vitaminas': Leaf, 'Bebé': Heart, 'Higiene': Droplets }
            const SideIcon = iconMap[name] || Package
            const count = name === 'Todos' ? PRODUCTS.length : PRODUCTS.filter(p => p.cat === name).length
            const active = cat === name
            return (
              <button
                key={name}
                onClick={() => setCat(name)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all hover:opacity-90 mb-0.5"
                style={active
                  ? { background: BRAND.green, color: '#fff' }
                  : { color: BRAND.gray, background: 'transparent' }}
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: active ? 'rgba(255,255,255,0.2)' : '#F3F4F6' }}
                >
                  <SideIcon size={14} color={active ? '#fff' : BRAND.gray} />
                </span>
                <span className="flex-1">{name}</span>
                <span
                  className="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: active ? 'rgba(255,255,255,0.25)' : '#F3F4F6',
                    color: active ? '#fff' : BRAND.gray,
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </aside>

        {/* ── Mobile horizontal pills (small screens only) ── */}
        <div className="md:hidden w-full flex gap-2 overflow-x-auto pb-1 mb-4">
          {CATS.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={cat === c
                ? { background: BRAND.green, color: '#fff' }
                : { background: '#F3F4F6', color: BRAND.gray }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* ── Product grid ── */}
        <main className="flex-1 min-w-0">
        {filtered.length === 0 ? (
          <div className="text-center py-24" style={{ color: BRAND.gray }}>
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: '#F3F4F6' }}
            >
              <Search size={28} color={BRAND.gray} strokeWidth={1.5} />
            </div>
            <p className="font-semibold text-base mb-1" style={{ color: BRAND.black }}>
              No encontramos "{search}"
            </p>
            <p className="text-sm">Intenta con otro término o contáctanos por WhatsApp</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(p => (
              <div
                key={p.id}
                className="bg-white rounded-2xl overflow-hidden flex flex-col transition-shadow hover:shadow-md"
                style={{ border: `1px solid ${BRAND.border}` }}
              >
                {/* Icon area */}
                <ProductIcon iconKey={p.iconKey} />

                {/* Info */}
                <div className="p-4 flex flex-col flex-1">
                  {/* Badge row */}
                  {p.badge && (
                    <div className="mb-2">
                      <BadgeChip text={p.badge} />
                    </div>
                  )}

                  <p className="text-sm font-bold leading-snug mb-1" style={{ color: BRAND.black }}>
                    {p.name}
                  </p>
                  <p className="text-[11px] mb-2 leading-relaxed" style={{ color: BRAND.gray }}>
                    {p.sub}
                  </p>

                  <Stars n={p.stars} />

                  <p className="text-xl font-black mt-3 mb-4" style={{ color: BRAND.green }}>
                    {fmt(p.price)}
                  </p>

                  {cart[p.id] ? (
                    <div
                      className="flex items-center justify-between rounded-xl overflow-hidden mt-auto"
                      style={{ border: `1.5px solid ${BRAND.green}` }}
                    >
                      <button
                        onClick={() => remove(p.id)}
                        className="px-3 py-2.5 transition-colors hover:opacity-70 flex items-center justify-center"
                        style={{ color: BRAND.green }}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-black text-sm" style={{ color: BRAND.dark }}>
                        {cart[p.id]}
                      </span>
                      <button
                        onClick={() => add(p.id)}
                        className="px-3 py-2.5 transition-colors hover:opacity-70 flex items-center justify-center"
                        style={{ color: BRAND.green }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 mt-auto">
                      <button
                        onClick={() => { add(p.id); setCartOpen(true) }}
                        className="w-full py-2.5 rounded-xl text-xs font-bold transition-opacity hover:opacity-90"
                        style={{ background: BRAND.green, color: '#fff' }}
                      >
                        Comprar ahora
                      </button>
                      <button
                        onClick={() => add(p.id)}
                        className="w-full py-2.5 rounded-xl text-xs font-bold transition-opacity hover:opacity-80"
                        style={{ border: `1.5px solid ${BRAND.green}`, color: BRAND.green, background: 'transparent' }}
                      >
                        Agregar al carro
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-12 px-4" style={{ background: BRAND.dark, color: '#fff' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: BRAND.green }}>
                <Pill size={15} color="#fff" strokeWidth={2} />
              </div>
              <div>
                <p className="font-black text-sm leading-tight">Farmacia</p>
                <p className="font-black text-sm leading-tight" style={{ color: BRAND.green }}>Santa Clara</p>
              </div>
            </div>
            <p className="text-sm opacity-70 mb-3 leading-relaxed">
              Tu farmacia de confianza en San Clemente. Más de 15 años cuidando la salud de las familias de la región.
            </p>
            <p className="text-xs opacity-40">RUT: 76.543.210-K</p>
            <p className="text-xs opacity-40 mt-0.5">Farmacia Santa Clara Ltda.</p>
          </div>

          {/* Col 2: Contacto */}
          <div>
            <p className="font-bold mb-4 text-xs uppercase tracking-widest opacity-50">Contacto</p>
            <div className="space-y-2.5 text-sm opacity-75">
              <p className="flex items-start gap-2">
                <MapPin size={13} className="shrink-0 mt-0.5 opacity-60" />
                Av. Huamachuco 842, San Clemente, Región del Maule
              </p>
              <p className="flex items-center gap-2">
                <Phone size={13} className="shrink-0 opacity-60" />
                +56 9 3293 0812
              </p>
              <p className="flex items-center gap-2">
                <Phone size={13} className="shrink-0 opacity-60" />
                (71) 2 345 678 (fijo)
              </p>
              <a href="mailto:contacto@farmaciasantaclara.cl" className="flex items-center gap-2 hover:opacity-90">
                <span className="opacity-60 text-xs">@</span>
                contacto@farmaciasantaclara.cl
              </a>
            </div>
          </div>

          {/* Col 3: Horarios */}
          <div>
            <p className="font-bold mb-4 text-xs uppercase tracking-widest opacity-50">Horarios</p>
            <div className="space-y-2 text-sm opacity-75">
              <div className="flex items-center gap-2"><Clock size={13} className="shrink-0 opacity-60" /><span>Lun – Vie: 8:30 – 21:00</span></div>
              <div className="flex items-center gap-2"><Clock size={13} className="shrink-0 opacity-60" /><span>Sábado: 9:00 – 20:00</span></div>
              <div className="flex items-center gap-2"><Clock size={13} className="shrink-0 opacity-60" /><span>Domingo: 10:00 – 18:00</span></div>
              <div className="flex items-center gap-2"><Clock size={13} className="shrink-0 opacity-60" /><span>Festivos: 10:00 – 16:00</span></div>
              <p className="text-[11px] opacity-50 mt-2">* Urgencias y recetas retenidas: horario reducido según turno.</p>
            </div>
          </div>

          {/* Col 4: Legal & redes */}
          <div>
            <p className="font-bold mb-4 text-xs uppercase tracking-widest opacity-50">Información</p>
            <div className="space-y-2 text-sm opacity-75">
              <p>Farmacia autorizada por el ISP</p>
              <p>Registro sanitario N° 24.567</p>
              <p>Química Farmacéutica responsable:<br /><span className="opacity-60">Q.F. Patricia Rojas M.</span></p>
            </div>
            <p className="font-bold mt-5 mb-3 text-xs uppercase tracking-widest opacity-50">Síguenos</p>
            <div className="flex gap-3">
              <a href="#" className="text-sm opacity-70 hover:opacity-100">Instagram</a>
              <span className="opacity-30">·</span>
              <a href="#" className="text-sm opacity-70 hover:opacity-100">Facebook</a>
            </div>
            <p className="text-xs opacity-40 mt-2">@farmaciasantaclara</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-6 flex items-center justify-between flex-wrap gap-3 text-xs opacity-35"
          style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <span>© 2025 Farmacia Santa Clara Ltda. · Todos los derechos reservados</span>
          <a href="https://agenciasi.cl" target="_blank" rel="noreferrer" className="hover:opacity-70 transition-opacity">
            Sitio desarrollado por AgenciaSi
          </a>
        </div>
      </footer>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => { setCartOpen(false); setStep('cart') }}
          />
          <div className="w-full max-w-sm bg-white flex flex-col shadow-2xl">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${BRAND.border}` }}>
              <div className="flex items-center gap-2">
                {step === 'form' && (
                  <button onClick={() => setStep('cart')} className="p-1 rounded-lg hover:bg-gray-100 mr-1">
                    <ArrowRight size={18} style={{ color: BRAND.gray, transform: 'rotate(180deg)' }} />
                  </button>
                )}
                <ShoppingCart size={18} style={{ color: BRAND.dark }} />
                <p className="font-black text-lg" style={{ color: BRAND.dark }}>
                  {step === 'cart' ? 'Tu carro' : 'Datos de entrega'}
                  {step === 'cart' && totalItems > 0 && (
                    <span className="ml-2 text-sm font-bold" style={{ color: BRAND.gray }}>
                      ({totalItems} {totalItems === 1 ? 'ítem' : 'ítems'})
                    </span>
                  )}
                </p>
              </div>
              <button onClick={() => { setCartOpen(false); setStep('cart') }} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={18} style={{ color: BRAND.gray }} />
              </button>
            </div>

            {step === 'cart' ? (
              <>
                {/* Drawer body — step cart */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  {totalItems === 0 ? (
                    <div className="text-center py-20" style={{ color: BRAND.gray }}>
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: '#F3F4F6' }}
                      >
                        <ShoppingCart size={28} color={BRAND.gray} strokeWidth={1.5} />
                      </div>
                      <p className="font-semibold text-sm" style={{ color: BRAND.black }}>
                        Tu carro está vacío
                      </p>
                      <p className="text-xs mt-1">Agrega productos para continuar</p>
                    </div>
                  ) : (
                    PRODUCTS.filter(p => cart[p.id]).map(p => (
                      <div key={p.id} className="flex items-center gap-3">
                        <CartProductIcon iconKey={p.iconKey} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate" style={{ color: BRAND.black }}>
                            {p.name}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: BRAND.gray }}>
                            {fmt(p.price)} c/u
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => remove(p.id)}
                            className="w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
                            style={{ background: BRAND.mid, color: BRAND.dark }}
                          >
                            <Minus size={11} />
                          </button>
                          <span
                            className="text-sm font-black w-5 text-center"
                            style={{ color: BRAND.dark }}
                          >
                            {cart[p.id]}
                          </span>
                          <button
                            onClick={() => add(p.id)}
                            className="w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
                            style={{ background: BRAND.green, color: '#fff' }}
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Drawer footer — step cart */}
                {totalItems > 0 && (
                  <div
                    className="px-5 py-5"
                    style={{ borderTop: `1px solid ${BRAND.border}` }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold" style={{ color: BRAND.gray }}>Total estimado</span>
                      <span className="text-2xl font-black" style={{ color: BRAND.dark }}>{fmt(totalPrice)}</span>
                    </div>
                    <p className="text-[11px] mb-4" style={{ color: BRAND.gray }}>
                      Precios sujetos a disponibilidad de stock
                    </p>
                    <button
                      onClick={() => setStep('form')}
                      disabled={totalItems === 0}
                      className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
                      style={{ background: '#2D2BB5' }}
                    >
                      <CreditCard size={18} />
                      Continuar con el pago
                    </button>
                    <button
                      onClick={waOrder}
                      className="w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-80 mt-2"
                      style={{ border: '1.5px solid #25D366', color: '#25D366', background: 'transparent', fontSize: 13 }}
                    >
                      <MessageCircle size={15} />
                      O pedir por WhatsApp
                    </button>
                    <p className="text-center text-[11px] mt-2.5" style={{ color: BRAND.gray }}>
                      Te confirmaremos disponibilidad y hora de entrega
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Drawer body — step form */}
                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                  {/* Order summary mini */}
                  <div className="rounded-xl p-3 text-sm" style={{ background: BRAND.light }}>
                    <div className="flex justify-between font-bold" style={{ color: BRAND.dark }}>
                      <span>{totalItems} producto{totalItems !== 1 ? 's' : ''}</span>
                      <span>{fmt(totalPrice)}</span>
                    </div>
                  </div>

                  {/* Personal data */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: BRAND.gray }}>Tus datos</p>
                    <div className="space-y-3">
                      <input required value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                        placeholder="Nombre completo *"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ border: `1.5px solid ${BRAND.border}`, background: '#FAFAFA' }} />
                      <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="Email *"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ border: `1.5px solid ${BRAND.border}`, background: '#FAFAFA' }} />
                      <input required type="tel" value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))}
                        placeholder="Teléfono *"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ border: `1.5px solid ${BRAND.border}`, background: '#FAFAFA' }} />
                    </div>
                  </div>

                  {/* Entrega */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: BRAND.gray }}>Tipo de entrega</p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {[['delivery', 'Delivery'], ['retiro', 'Retiro en tienda']].map(([val, label]) => (
                        <button key={val} onClick={() => setForm(f => ({ ...f, entrega: val }))}
                          className="py-2.5 rounded-xl text-xs font-bold transition-all"
                          style={form.entrega === val
                            ? { background: BRAND.green, color: '#fff' }
                            : { border: `1.5px solid ${BRAND.border}`, color: BRAND.gray, background: '#fff' }}>
                          {label}
                        </button>
                      ))}
                    </div>
                    {form.entrega === 'delivery' && (
                      <input value={form.direccion} onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))}
                        placeholder="Dirección de entrega *"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ border: `1.5px solid ${BRAND.border}`, background: '#FAFAFA' }} />
                    )}
                  </div>

                  {/* Notas */}
                  <div>
                    <textarea value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
                      placeholder="Notas opcionales (instrucciones especiales, etc.)"
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                      style={{ border: `1.5px solid ${BRAND.border}`, background: '#FAFAFA' }} />
                  </div>
                </div>

                {/* Form footer */}
                <div className="px-5 py-5" style={{ borderTop: `1px solid ${BRAND.border}` }}>
                  <button
                    onClick={goCheckout}
                    disabled={paying || !form.nombre || !form.email || !form.telefono || (form.entrega === 'delivery' && !form.direccion)}
                    className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ background: '#2D2BB5' }}>
                    <CreditCard size={18} />
                    {paying ? 'Procesando…' : `Pagar ${fmt(totalPrice)} con MercadoPago`}
                  </button>
                  <p className="text-center text-[11px] mt-2" style={{ color: BRAND.gray }}>
                    Serás redirigido a MercadoPago para completar el pago
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* WhatsApp FAB */}
      <a
        href={WA}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-40 transition-transform hover:scale-110"
        style={{ background: '#25D366' }}
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={26} color="#fff" strokeWidth={2} />
      </a>
    </div>
    </>
  )
}

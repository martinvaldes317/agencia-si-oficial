import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ShoppingBag, X, Plus, Minus, ArrowRight, ArrowUpRight,
  Zap, Truck, RefreshCw, Shield, MessageCircle, Search,
  Heart, Tag, Star, CreditCard, CheckCircle, Clock, AlertCircle,
} from 'lucide-react'

/* ─── Brand ─────────────────────────────────────────────── */
const B = {
  bg:      '#080808',
  surface: '#111111',
  card:    '#141414',
  border:  '#222222',
  lime:    '#CCFF00',
  white:   '#EFEFEF',
  muted:   '#777777',
  red:     '#FF4040',
}

const WA   = 'https://wa.me/56932930812'
const fmt  = n => '$' + n.toLocaleString('es-CL')

/* ─── Productos ──────────────────────────────────────────── */
const HERO_WORD = 'DROP'

const PRODUCTS = [
  {
    id: 1, name: 'VERTEX AIR 001', cat: 'SNEAKERS', featured: true,
    price: 129990, priceOrig: null, color: 'Blanco / Negro',
    sizes: ['38','39','40','41','42','43','44'],
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop&q=80',
    badge: 'DROP',
    desc: 'Silhouette icónica reinventada. Suela React con retorno de energía, upper en mesh técnico y overlays de cuero sintético premium.',
    material: 'Mesh técnico + cuero sintético', stars: 4.9,
  },
  {
    id: 2, name: 'PHANTOM LOW X', cat: 'SNEAKERS', featured: false,
    price: 149990, priceOrig: null, color: 'Negro total',
    sizes: ['38','39','40','41','42','43','44'],
    img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop&q=80',
    badge: 'EXCLUSIVE',
    desc: 'Colorway all-black para quienes dominan sin hacer ruido. Construcción monolítica con suela de goma vulcanizada.',
    material: 'Cuero sintético premium', stars: 4.8,
  },
  {
    id: 3, name: 'VOID RUNNER', cat: 'SNEAKERS', featured: false,
    price: 89990, priceOrig: 119990, color: 'Gris / Lima',
    sizes: ['38','39','40','41','42','43'],
    img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop&q=80',
    badge: 'SALE',
    desc: 'Performance running con estética urbana. Amortiguación de gel en talón, respiración máxima y grip multisuperficie.',
    material: 'Mesh + TPU', stars: 4.6,
  },
  {
    id: 4, name: 'CLOUD BOOST PRO', cat: 'SNEAKERS', featured: false,
    price: 109990, priceOrig: null, color: 'Blanco / Gris',
    sizes: ['39','40','41','42','43','44'],
    img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=800&fit=crop&q=80',
    badge: null,
    desc: 'La definición del comfort diario. Foam de alta densidad, upper knit sin costuras y suela translúcida.',
    material: 'Knit + foam HD', stars: 4.7,
  },
  {
    id: 5, name: 'KULT HEAVY HOODIE', cat: 'HOODIES', featured: true,
    price: 54990, priceOrig: null, color: 'Negro / Bordado lima',
    sizes: ['XS','S','M','L','XL','XXL'],
    img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&h=800&fit=crop&q=80',
    badge: 'DROP',
    desc: 'Hoodie 400gsm de peso pesado con bolsillo canguro reforzado. Bordado tonal en pecho y capucha con cordón plano.',
    material: 'Algodón pesado 400gsm', stars: 4.9,
  },
  {
    id: 6, name: 'NEON FORCE 02', cat: 'SNEAKERS', featured: false,
    price: 139990, priceOrig: null, color: 'Negro / Lima',
    sizes: ['38','39','40','41','42','43','44'],
    img: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=800&fit=crop&q=80',
    badge: 'EXCLUSIVE',
    desc: 'Colorway firmado con detalles lima que encienden cualquier look. Edición limitada, sin reposición.',
    material: 'Cuero + mesh técnico', stars: 5.0,
  },
  {
    id: 7, name: 'ESSENTIAL TEE OS', cat: 'TEES', featured: false,
    price: 29990, priceOrig: null, color: 'Blanco roto',
    sizes: ['XS','S','M','L','XL'],
    img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=800&fit=crop&q=80',
    badge: null,
    desc: 'Oversize fit con largo extendido, cuello ribeteado y serigrafía frontal en tinta de agua. Base de toda colección.',
    material: 'Jersey 200gsm peinado', stars: 4.5,
  },
  {
    id: 8, name: 'CARGO TECH PANT', cat: 'PANTS', featured: false,
    price: 69990, priceOrig: null, color: 'Negro',
    sizes: ['XS','S','M','L','XL'],
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop&q=80',
    badge: 'LAST UNITS',
    desc: 'Pantalón cargo técnico con 6 bolsillos funcionales, cintura elástica y fit tapered. Tejido ripstop ligero.',
    material: 'Ripstop técnico', stars: 4.7,
  },
  {
    id: 9, name: 'BOMBER VINTAGE', cat: 'JACKETS', featured: false,
    price: 89990, priceOrig: 119990, color: 'Oliva / Negro',
    sizes: ['S','M','L','XL'],
    img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop&q=80',
    badge: 'SALE',
    desc: 'Bomber de nylon con parches bordados de edición limitada. Forro satinado, puños y cintura acanalados.',
    material: 'Nylon + forro satinado', stars: 4.8,
  },
  {
    id: 10, name: 'TRACK SUIT SET', cat: 'HOODIES', featured: false,
    price: 119990, priceOrig: null, color: 'Gris marengo',
    sizes: ['XS','S','M','L','XL'],
    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop&q=80',
    badge: null,
    desc: 'Set completo hoodie zip + jogger con banda lateral. Fleece interior cepillado, corte relaxed.',
    material: 'Fleece 300gsm', stars: 4.6,
  },
  {
    id: 11, name: 'LOGO CAP SNAPBACK', cat: 'ACCESORIOS', featured: false,
    price: 24990, priceOrig: null, color: 'Negro / Lima',
    sizes: ['ONE SIZE'],
    img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop&q=80',
    badge: null,
    desc: 'Cap snapback con visera plana y logo bordado 3D al frente. Cierre snapback ajustable, talla única.',
    material: 'Twill de algodón', stars: 4.4,
  },
  {
    id: 12, name: 'TRACK ELITE LOW', cat: 'SNEAKERS', featured: false,
    price: 94990, priceOrig: null, color: 'Beige / Crema',
    sizes: ['38','39','40','41','42','43','44'],
    img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop&q=80',
    badge: null,
    desc: 'Silueta retro de perfil bajo. Colorway neutro para versatilidad máxima. Gum sole con perfil ondulado icónico.',
    material: 'Cuero sintético + goma', stars: 4.5,
  },
]

const CATS = ['TODOS', 'SNEAKERS', 'HOODIES', 'TEES', 'PANTS', 'JACKETS', 'ACCESORIOS']

const BADGE_META = {
  DROP:       { bg: B.lime,   fg: '#000' },
  EXCLUSIVE:  { bg: '#fff',   fg: '#000' },
  SALE:       { bg: B.red,    fg: '#fff' },
  'LAST UNITS':{ bg: '#FF6B00', fg: '#fff' },
}

/* ─── Helpers ────────────────────────────────────────────── */
function BadgePill({ text }) {
  const s = BADGE_META[text] || { bg: B.surface, fg: B.white }
  return (
    <span className="text-[10px] font-black px-2 py-0.5 tracking-wider" style={{ background: s.bg, color: s.fg }}>
      {text}
    </span>
  )
}

function Stars({ n }) {
  return (
    <span className="flex items-center gap-1 text-xs" style={{ color: B.muted }}>
      <Star size={11} fill={B.lime} color={B.lime} /> {n}
    </span>
  )
}

/* ─── Main Component ─────────────────────────────────────── */
export default function DemoTienda() {
  const [cat,  setCat]  = useState('TODOS')
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [selSize,  setSelSize]  = useState(null)
  const [cart,  setCart]  = useState({})
  const [cartOpen, setCartOpen] = useState(false)
  const [favs,  setFavs]  = useState(new Set())
  const [sizeErr, setSizeErr] = useState(false)

  const filtered = PRODUCTS.filter(p =>
    (cat === 'TODOS' || p.cat === cat) &&
    (search === '' || p.name.toLowerCase().includes(search.toLowerCase()) || p.cat.toLowerCase().includes(search.toLowerCase()))
  )

  const cartItems   = Object.entries(cart).map(([key, v]) => ({ key, ...v }))
  const totalItems  = cartItems.reduce((a, v) => a + v.qty, 0)
  const totalPrice  = cartItems.reduce((a, v) => a + v.qty * v.product.price, 0)

  const addToCart = (p, size) => {
    if (!size) { setSizeErr(true); return }
    setSizeErr(false)
    const key = `${p.id}-${size}`
    setCart(c => ({ ...c, [key]: { product: p, size, qty: (c[key]?.qty || 0) + 1 } }))
  }
  const removeFromCart = (key) => setCart(c => {
    const n = { ...c }
    if (n[key].qty > 1) n[key] = { ...n[key], qty: n[key].qty - 1 }
    else delete n[key]
    return n
  })
  const toggleFav = (id, e) => {
    e?.stopPropagation()
    setFavs(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  const waOrder = () => {
    const lines = cartItems.map(v => `• ${v.product.name} Talla ${v.size} x${v.qty} — ${fmt(v.product.price * v.qty)}`).join('\n')
    const msg = `Hola KULT STORE!\n\nQuiero hacer el siguiente pedido:\n\n${lines}\n\n*Total: ${fmt(totalPrice)}*`
    window.open(`${WA}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  /* ── Mercado Pago ── */
  const [checkout, setCheckout] = useState(false)
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', entrega: 'despacho', direccion: '' })
  const [mpLoading, setMpLoading] = useState(false)
  const [mpError, setMpError] = useState('')
  const [searchParams] = useSearchParams()
  const payStatus = searchParams.get('status')

  const handleCheckout = async (e) => {
    e.preventDefault()
    setMpLoading(true)
    setMpError('')
    try {
      const items = cartItems.map(({ product: p, size, qty }) => ({
        title: `${p.name} — Talla ${size}`,
        quantity: qty,
        unit_price: p.price,
      }))
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/demos/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'tienda',
          items,
          payer: { nombre: form.nombre, email: form.email, telefono: form.telefono },
          entrega: form.entrega === 'despacho' ? 'Despacho' : 'Retiro en tienda',
          direccion: form.entrega === 'despacho' ? form.direccion : undefined,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      window.location.href = data.init_point
    } catch (err) {
      setMpError(err.message || 'Error al procesar el pago')
      setMpLoading(false)
    }
  }

  const MARQUEE_TEXT = Array(8).fill('KULT STORE · NUEVA COLECCIÓN SS25 · FREE SHIPPING +$50.000 · DROPS EXCLUSIVOS · ENTREGA 24H ·').join(' ')

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&display=swap" />
      <style>{`
        :root { --lime: #CCFF00; }

        @keyframes letterIn {
          from { opacity:0; transform: translateY(60px) skewY(6deg); }
          to   { opacity:1; transform: translateY(0) skewY(0deg); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform: translateY(24px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes clipDown {
          from { clip-path: inset(0 0 100% 0); }
          to   { clip-path: inset(0 0 0% 0); }
        }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 12px rgba(204,255,0,0.25); }
          50%      { box-shadow: 0 0 28px rgba(204,255,0,0.55); }
        }
        @keyframes scaleIn {
          from { opacity:0; transform:scale(0.93) translateY(16px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }

        .letter-in { animation: letterIn 0.65s cubic-bezier(0.16,1,0.3,1) both; display:inline-block; }
        .fade-up   { animation: fadeUp   0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .clip-down { animation: clipDown 0.9s cubic-bezier(0.77,0,0.175,1) both; }
        .scale-in  { animation: scaleIn  0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .d-1{animation-delay:60ms} .d-2{animation-delay:130ms} .d-3{animation-delay:200ms}
        .d-4{animation-delay:280ms} .d-5{animation-delay:360ms} .d-6{animation-delay:440ms}
        .d-7{animation-delay:520ms} .d-8{animation-delay:600ms} .d-9{animation-delay:680ms}

        .marquee-track { animation: marqueeScroll 28s linear infinite; white-space:nowrap; }

        .card-3d {
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease;
          transform-style: preserve-3d;
        }
        .card-3d:hover {
          transform: perspective(900px) rotateY(-5deg) rotateX(3deg) translateY(-10px);
          box-shadow: 12px 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(204,255,0,0.15);
        }
        .img-zoom { overflow:hidden; }
        .img-zoom img { transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
        .card-3d:hover .img-zoom img { transform: scale(1.1); }

        .lime-btn {
          transition: all 0.2s ease;
          animation: glowPulse 3s ease-in-out infinite;
        }
        .lime-btn:hover { transform: translateY(-3px) scale(1.03); }

        .ghost-btn {
          transition: all 0.2s ease;
        }
        .ghost-btn:hover { background: rgba(255,255,255,0.08) !important; transform: translateY(-2px); }

        .cat-pill {
          transition: all 0.2s cubic-bezier(0.22,1,0.36,1);
        }
        .cat-pill:hover { transform: translateY(-2px); }

        .size-btn {
          transition: all 0.15s ease;
        }
        .size-btn:hover { border-color: var(--lime) !important; color: var(--lime) !important; }

        .search-inp:focus { outline: none; border-color: var(--lime) !important; background: #1a1a1a !important; }
      `}</style>

    <div className="min-h-screen" style={{ background: B.bg, fontFamily: "'DM Sans', sans-serif", color: B.white }}>

      {/* Demo Banner */}
      <div className="text-center py-2 px-4 text-xs font-semibold flex items-center justify-center gap-3 flex-wrap"
        style={{ background: B.lime, color: '#000' }}>
        <span>Demo creado por AgenciaSi — ¿Quieres este sitio para tu tienda?</span>
        <a href="https://agenciasi.cl/#contact" target="_blank" rel="noreferrer"
          className="font-black underline flex items-center gap-1">
          Cotizar ahora <ArrowRight size={11} />
        </a>
      </div>

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-40" style={{ background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${B.border}` }}>
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center gap-5">
          {/* Logo */}
          <span className="font-black tracking-[0.15em] text-xl shrink-0" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.2em', color: B.white }}>
            KULT<span style={{ color: B.lime }}>.</span>
          </span>

          {/* Nav */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-widest uppercase" style={{ color: B.muted }}>
            {['Sneakers', 'Hoodies', 'Tees', 'Drops', 'Outlet'].map(l => (
              <a key={l} href="#catalogo" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 relative max-w-sm ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: B.muted }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 180)}
              onKeyDown={e => { if (e.key === 'Escape') { setSearch(''); setSearchOpen(false) } }}
              placeholder="Buscar producto…"
              className="search-inp w-full pl-9 pr-4 py-2 rounded-lg text-sm transition-all"
              style={{ background: B.surface, border: `1px solid ${B.border}`, color: B.white }}
            />
            {/* Search dropdown */}
            {searchOpen && search && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden shadow-2xl"
                style={{ background: B.card, border: `1px solid ${B.border}`, zIndex: 60 }}>
                {filtered.length === 0 ? (
                  <p className="px-4 py-4 text-sm" style={{ color: B.muted }}>Sin resultados para &ldquo;{search}&rdquo;</p>
                ) : filtered.slice(0, 5).map(p => (
                  <button key={p.id}
                    onMouseDown={() => { setSelected(p); setSelSize(null); setSizeErr(false); setSearchOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
                    style={{ borderBottom: `1px solid ${B.border}` }}>
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      <img src={p.img} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14 }}>{p.name}</p>
                      <p className="text-[11px]" style={{ color: B.muted }}>{p.cat}</p>
                    </div>
                    <p className="text-sm font-bold shrink-0" style={{ color: B.lime }}>{fmt(p.price)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-lg transition-colors hover:bg-white/10">
            <ShoppingBag size={20} style={{ color: B.white }} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center"
                style={{ background: B.lime, color: '#000' }}>
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="inicio" className="max-w-7xl mx-auto px-5 pt-12 pb-0 flex flex-col md:flex-row items-stretch gap-0 relative overflow-hidden">
        {/* Left — text */}
        <div className="flex-1 flex flex-col justify-center pb-12 md:pb-16 pr-0 md:pr-10 z-10">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-6 fade-up" style={{ color: B.lime }}>
            Nueva Colección SS25
          </p>

          <div className="overflow-hidden mb-2" style={{ lineHeight: 0.9, fontFamily: "'Bebas Neue', sans-serif" }}>
            <div className="flex flex-wrap gap-x-4">
              {['STEP', 'INTO'].map((word, wi) => (
                <span key={word} className="flex" style={{ fontSize: 'clamp(64px, 10vw, 120px)' }}>
                  {word.split('').map((ch, ci) => (
                    <span key={ci} className="letter-in" style={{ animationDelay: `${(wi * 5 + ci) * 55}ms`, color: B.white }}>
                      {ch}
                    </span>
                  ))}
                </span>
              ))}
            </div>
            <div className="flex" style={{ fontSize: 'clamp(64px, 10vw, 120px)' }}>
              {HERO_WORD.split('').map((ch, ci) => (
                <span key={ci} className="letter-in" style={{ animationDelay: `${(10 + ci) * 55}ms`, fontFamily: "'Bebas Neue', sans-serif", color: B.lime }}>
                  {ch}
                </span>
              ))}
            </div>
          </div>

          <p className="text-sm mb-8 max-w-sm leading-relaxed fade-up d-7" style={{ color: B.muted }}>
            Sneakers y streetwear de edición limitada. Drops exclusivos, envío en 24h a todo Chile.
          </p>

          <div className="flex flex-wrap gap-3 fade-up d-8">
            <button
              onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
              className="lime-btn px-7 py-3 font-bold text-sm tracking-wider uppercase"
              style={{ background: B.lime, color: '#000' }}>
              Ver colección
            </button>
            <button
              onClick={() => { setCat('SNEAKERS'); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="ghost-btn px-7 py-3 font-bold text-sm tracking-wider uppercase"
              style={{ border: `1px solid ${B.border}`, color: B.white, background: 'transparent' }}>
              Drops exclusivos ↗
            </button>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap gap-2 mt-10 fade-up d-9">
            {[
              { icon: Truck,    text: 'Envío 24h' },
              { icon: RefreshCw,text: '30 días devolución' },
              { icon: Shield,   text: 'Pago seguro' },
            ].map(({ icon, text }) => {
              const Ico = icon
              return (
                <span key={text} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                  style={{ border: `1px solid ${B.border}`, color: B.muted }}>
                  <Ico size={11} style={{ color: B.lime }} /> {text}
                </span>
              )
            })}
          </div>
        </div>

        {/* Right — hero image */}
        <div className="hidden md:block relative" style={{ width: '42%', minHeight: 560 }}>
          <div className="clip-down absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&h=1100&fit=crop&q=85"
              alt="Kult Store"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 30%' }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #080808 0%, transparent 20%, transparent 80%, #080808 100%)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #080808 0%, transparent 30%)' }} />
          </div>
          {/* Floating badge */}
          <div className="absolute bottom-10 left-6 scale-in d-5">
            <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(16px)', border: `1px solid ${B.border}` }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: B.lime }}>Drop activo</p>
              <p className="text-sm font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20 }}>VERTEX AIR 001</p>
              <p className="text-xs" style={{ color: B.muted }}>Quedan pocas tallas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee strip */}
      <div className="overflow-hidden py-3 mt-2" style={{ background: B.lime, color: '#000' }}>
        <div className="marquee-track flex">
          <span className="text-xs font-black tracking-widest uppercase px-2">{MARQUEE_TEXT}</span>
          <span className="text-xs font-black tracking-widest uppercase px-2">{MARQUEE_TEXT}</span>
        </div>
      </div>

      {/* ── CATÁLOGO ── */}
      <section id="catalogo" className="max-w-7xl mx-auto px-5 py-14">

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className="cat-pill shrink-0 px-5 py-2 text-xs font-bold tracking-widest uppercase"
              style={cat === c
                ? { background: B.lime, color: '#000' }
                : { border: `1px solid ${B.border}`, color: B.muted, background: 'transparent' }}>
              {c}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs uppercase tracking-widest" style={{ color: B.muted }}>
            {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid — asymmetric */}
        {filtered.length === 0 ? (
          <div className="text-center py-24" style={{ color: B.muted }}>
            <Search size={32} className="mx-auto mb-4 opacity-30" />
            <p className="font-semibold">Sin productos en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filtered.map((p, i) => {
              const isFav    = favs.has(p.id)
              const isFeat   = p.featured && i < 4
              return (
                <div key={p.id}
                  className={`card-3d bg-black rounded-2xl overflow-hidden flex flex-col cursor-pointer scale-in ${isFeat ? 'md:col-span-2 md:row-span-1' : ''}`}
                  style={{ border: `1px solid ${B.border}`, animationDelay: `${i * 70}ms` }}
                  onClick={() => { setSelected(p); setSelSize(null); setSizeErr(false) }}>

                  {/* Image */}
                  <div className="img-zoom relative" style={{ height: isFeat ? 340 : 220 }}>
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />

                    {/* Badges */}
                    {p.badge && (
                      <div className="absolute top-3 left-3">
                        <BadgePill text={p.badge} />
                      </div>
                    )}

                    {/* Fav */}
                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
                      onClick={e => toggleFav(p.id, e)}>
                      <Heart size={14} fill={isFav ? '#FF4040' : 'none'} color={isFav ? '#FF4040' : '#aaa'} />
                    </button>

                    {p.priceOrig && (
                      <div className="absolute bottom-3 right-3">
                        <span className="text-[10px] font-black px-2 py-1" style={{ background: B.red, color: '#fff' }}>
                          -{Math.round((1 - p.price / p.priceOrig) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-black tracking-wider leading-tight" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isFeat ? 22 : 18, color: B.white }}>
                        {p.name}
                      </p>
                    </div>
                    <p className="text-[11px] mb-3" style={{ color: B.muted }}>{p.color}</p>

                    <Stars n={p.stars} />

                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        {p.priceOrig && <p className="text-xs line-through mb-0.5" style={{ color: B.muted }}>{fmt(p.priceOrig)}</p>}
                        <p className="font-black text-lg" style={{ color: B.lime }}>{fmt(p.price)}</p>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); setSelected(p); setSelSize(null); setSizeErr(false) }}
                        className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg transition-all hover:bg-white/10"
                        style={{ border: `1px solid ${B.border}`, color: B.white }}>
                        Ver <ArrowUpRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ── CTA Strip ── */}
      <section className="max-w-7xl mx-auto px-5 pb-16">
        <div className="rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-10"
          style={{ background: B.surface, border: `1px solid ${B.border}` }}>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: B.lime }}>Comunidad</p>
            <h3 className="text-2xl md:text-3xl font-black tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif", lineHeight: 1.1 }}>
              ÚNETE AL KULT.<br /><span style={{ color: B.lime }}>10% OFF</span> EN TU PRIMER DROP.
            </h3>
          </div>
          <a href={WA} target="_blank" rel="noreferrer"
            className="lime-btn shrink-0 flex items-center gap-2 px-8 py-4 font-bold uppercase tracking-widest text-sm"
            style={{ background: B.lime, color: '#000' }}>
            <MessageCircle size={16} /> Unirse por WhatsApp
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#040404', borderTop: `1px solid ${B.border}` }}>
        <div className="max-w-7xl mx-auto px-5 py-12 grid md:grid-cols-3 gap-10">
          <div>
            <p className="font-black text-3xl tracking-[0.15em] mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              KULT<span style={{ color: B.lime }}>.</span>
            </p>
            <p className="text-sm leading-relaxed" style={{ color: B.muted }}>
              Streetwear y sneakers de edición limitada. Sólo para quienes saben lo que buscan.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: B.muted }}>Navegar</p>
            {['Sneakers', 'Hoodies', 'Tees', 'Jackets', 'Drops', 'Sale'].map(l => (
              <a key={l} href="#catalogo" className="block text-sm mb-2 transition-colors hover:text-white" style={{ color: B.muted }}>{l}</a>
            ))}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: B.muted }}>Contacto</p>
            <div className="space-y-2 text-sm" style={{ color: B.muted }}>
              <p>Lun–Sáb 10:00–20:00</p>
              <a href={WA} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                <MessageCircle size={13} style={{ color: B.lime }} /> WhatsApp
              </a>
              <a href="mailto:hola@kultstore.cl" className="hover:text-white transition-colors">hola@kultstore.cl</a>
              <p className="flex items-center gap-1.5"><Tag size={11} style={{ color: B.lime }} /> Santiago, Chile · Envíos a todo el país</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-5 py-5 flex items-center justify-between text-xs flex-wrap gap-3"
          style={{ borderTop: `1px solid ${B.border}`, color: B.muted }}>
          <span>© 2025 KULT STORE · Todos los derechos reservados</span>
          <a href="https://agenciasi.cl" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            Sitio desarrollado por AgenciaSi
          </a>
        </div>
      </footer>

      {/* ── PRODUCT MODAL ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full md:max-w-3xl rounded-t-3xl md:rounded-2xl overflow-hidden flex flex-col md:flex-row"
            style={{ background: B.card, border: `1px solid ${B.border}`, maxHeight: '92vh' }}>

            {/* Image */}
            <div className="md:w-[45%] relative" style={{ minHeight: 280 }}>
              <img src={selected.img} alt={selected.name} className="w-full h-full object-cover" style={{ minHeight: 280 }} />
              {selected.badge && <div className="absolute top-4 left-4"><BadgePill text={selected.badge} /></div>}
              <button className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.6)' }}
                onClick={e => toggleFav(selected.id, e)}>
                <Heart size={16} fill={favs.has(selected.id) ? '#FF4040' : 'none'} color={favs.has(selected.id) ? '#FF4040' : '#aaa'} />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 overflow-y-auto flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between p-5 pb-3">
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: B.lime }}>{selected.cat}</p>
                  <h2 className="font-black tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, lineHeight: 1.1 }}>{selected.name}</h2>
                  <p className="text-xs mt-1" style={{ color: B.muted }}>{selected.color} · {selected.material}</p>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg transition-colors hover:bg-white/10">
                  <X size={18} style={{ color: B.muted }} />
                </button>
              </div>

              <div className="px-5 pb-5 flex flex-col flex-1">
                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-3xl font-black" style={{ color: B.lime }}>{fmt(selected.price)}</p>
                  {selected.priceOrig && (
                    <p className="text-sm line-through" style={{ color: B.muted }}>{fmt(selected.priceOrig)}</p>
                  )}
                </div>

                <Stars n={selected.stars} />

                {/* Description */}
                <p className="text-sm mt-4 mb-5 leading-relaxed" style={{ color: B.muted }}>{selected.desc}</p>

                {/* Sizes */}
                <div className="mb-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center justify-between"
                    style={{ color: sizeErr ? B.red : B.muted }}>
                    <span>{sizeErr ? '⚠ Elige una talla' : 'Selecciona talla'}</span>
                    {selSize && <span style={{ color: B.lime }}>{selSize} ✓</span>}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selected.sizes.map(s => (
                      <button key={s} onClick={() => { setSelSize(s); setSizeErr(false) }}
                        className="size-btn px-3 py-1.5 text-xs font-bold rounded-lg transition-all"
                        style={{
                          border: selSize === s ? `1.5px solid ${B.lime}` : `1px solid ${B.border}`,
                          color: selSize === s ? B.lime : B.muted,
                          background: selSize === s ? 'rgba(204,255,0,0.07)' : 'transparent',
                        }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => { addToCart(selected, selSize); if (selSize) { setCartOpen(true); setSelected(null) } }}
                    className="lime-btn flex-1 py-3.5 font-bold uppercase tracking-widest text-sm"
                    style={{ background: B.lime, color: '#000' }}>
                    Agregar al carro
                  </button>
                  <button
                    onClick={() => { addToCart(selected, selSize) }}
                    className="ghost-btn w-12 flex items-center justify-center rounded-lg"
                    style={{ border: `1px solid ${B.border}` }}>
                    <Heart size={18} fill={favs.has(selected.id) ? '#FF4040' : 'none'} color={favs.has(selected.id) ? '#FF4040' : B.muted} />
                  </button>
                </div>

                {/* Shipping info */}
                <div className="flex gap-4 mt-4 pt-4" style={{ borderTop: `1px solid ${B.border}` }}>
                  {[{ i: Truck, t: 'Envío 24h' }, { i: RefreshCw, t: '30 días' }, { i: Shield, t: 'Pago seguro' }].map(({ i, t }) => {
                    const Ico = i
                    return (
                      <span key={t} className="flex items-center gap-1 text-[11px]" style={{ color: B.muted }}>
                        <Ico size={11} style={{ color: B.lime }} /> {t}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CART DRAWER ── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-sm flex flex-col" style={{ background: B.card, borderLeft: `1px solid ${B.border}` }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${B.border}` }}>
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} style={{ color: B.lime }} />
                <p className="font-black text-lg tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  TU CARRO {totalItems > 0 && <span style={{ color: B.lime }}>({totalItems})</span>}
                </p>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10">
                <X size={18} style={{ color: B.muted }} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-20" style={{ color: B.muted }}>
                  <ShoppingBag size={36} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-semibold">Tu carro está vacío</p>
                  <p className="text-xs mt-1">Agrega productos para continuar</p>
                </div>
              ) : cartItems.map(({ key, product: p, size, qty }) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black truncate tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 15 }}>{p.name}</p>
                    <p className="text-xs mb-1" style={{ color: B.muted }}>Talla: {size}</p>
                    <p className="text-sm font-bold" style={{ color: B.lime }}>{fmt(p.price * qty)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => removeFromCart(key)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                      style={{ border: `1px solid ${B.border}` }}>
                      <Minus size={11} style={{ color: B.white }} />
                    </button>
                    <span className="text-sm font-black w-5 text-center">{qty}</span>
                    <button onClick={() => setCart(c => ({ ...c, [key]: { ...c[key], qty: qty + 1 } }))} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                      style={{ border: `1px solid ${B.border}` }}>
                      <Plus size={11} style={{ color: B.white }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="px-5 py-5" style={{ borderTop: `1px solid ${B.border}` }}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs uppercase tracking-widest" style={{ color: B.muted }}>Total</span>
                  <span className="text-2xl font-black" style={{ fontFamily: "'Bebas Neue', sans-serif", color: B.lime }}>{fmt(totalPrice)}</span>
                </div>
                <button
                  onClick={() => { setCartOpen(false); setCheckout(true) }}
                  className="lime-btn w-full py-4 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 mb-2"
                  style={{ background: B.lime, color: '#000' }}>
                  <CreditCard size={16} /> Pagar con Mercado Pago
                </button>
                <button
                  onClick={waOrder}
                  className="ghost-btn w-full py-3 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                  style={{ border: `1px solid ${B.border}`, color: B.muted, background: 'transparent' }}>
                  <MessageCircle size={13} /> O pedir por WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WA FAB */}
      <a href={WA} target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-40 lime-btn"
        style={{ background: '#25D366' }}>
        <MessageCircle size={26} color="#fff" strokeWidth={2} />
      </a>

    </div>

    {/* ── CHECKOUT MODAL ── */}
    {checkout && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)' }}>
        <div className="w-full max-w-md rounded-2xl overflow-hidden"
          style={{ background: B.card, border: `1px solid ${B.border}`, maxHeight: '96vh', overflowY: 'auto' }}>

          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5" style={{ borderBottom: `1px solid ${B.border}` }}>
            <div>
              <p className="font-black text-2xl tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>CHECKOUT</p>
              <p className="text-xs mt-0.5" style={{ color: B.muted }}>
                {totalItems} producto{totalItems !== 1 ? 's' : ''} · <span style={{ color: B.lime }}>{fmt(totalPrice)}</span>
              </p>
            </div>
            <button onClick={() => setCheckout(false)} className="p-1.5 rounded-lg hover:bg-white/10 mt-1">
              <X size={18} style={{ color: B.muted }} />
            </button>
          </div>

          {/* Order summary */}
          <div className="px-6 pt-4 pb-0 space-y-2">
            {cartItems.map(({ key, product: p, size, qty }) => (
              <div key={key} className="flex items-center gap-3 py-2" style={{ borderBottom: `1px solid ${B.border}` }}>
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black truncate tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13 }}>{p.name}</p>
                  <p className="text-[11px]" style={{ color: B.muted }}>Talla {size} · x{qty}</p>
                </div>
                <p className="text-sm font-bold shrink-0" style={{ color: B.lime }}>{fmt(p.price * qty)}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleCheckout} className="px-6 py-5 space-y-4">
            <CheckoutInput label="Nombre completo" value={form.nombre} onChange={v => setForm(f => ({ ...f, nombre: v }))} placeholder="Juan Pérez" required />
            <CheckoutInput label="Email" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="juan@email.com" required />
            <CheckoutInput label="Teléfono" type="tel" value={form.telefono} onChange={v => setForm(f => ({ ...f, telefono: v }))} placeholder="+56 9 1234 5678" />

            {/* Delivery type */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest block mb-2" style={{ color: B.muted }}>Tipo de entrega</label>
              <div className="grid grid-cols-2 gap-2">
                {[['despacho', 'Despacho a domicilio'], ['retiro', 'Retiro en tienda']].map(([val, lbl]) => (
                  <button type="button" key={val}
                    onClick={() => setForm(f => ({ ...f, entrega: val }))}
                    className="py-3 text-xs font-bold tracking-wider uppercase transition-all"
                    style={form.entrega === val
                      ? { background: B.lime, color: '#000' }
                      : { border: `1px solid ${B.border}`, color: B.muted, background: 'transparent' }}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {form.entrega === 'despacho' && (
              <CheckoutInput label="Dirección de envío" value={form.direccion} onChange={v => setForm(f => ({ ...f, direccion: v }))} placeholder="Av. Providencia 1234, Santiago" required />
            )}

            {mpError && (
              <p className="text-xs flex items-center gap-1.5" style={{ color: B.red }}>
                <AlertCircle size={13} /> {mpError}
              </p>
            )}

            <button type="submit" disabled={mpLoading}
              className="lime-btn w-full py-4 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2"
              style={{ background: B.lime, color: '#000', opacity: mpLoading ? 0.75 : 1, cursor: mpLoading ? 'not-allowed' : 'pointer' }}>
              <CreditCard size={16} />
              {mpLoading ? 'Redirigiendo a Mercado Pago...' : `Pagar ${fmt(totalPrice)}`}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px]" style={{ color: B.muted }}>
              <Shield size={11} style={{ color: B.lime }} />
              Pago seguro con tarjeta, débito o transferencia
            </div>
          </form>
        </div>
      </div>
    )}

    {/* ── PAYMENT RETURN OVERLAY ── */}
    {payStatus && (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.97)' }}>
        <div className="w-full max-w-sm text-center px-8 py-12 rounded-2xl"
          style={{ background: B.card, border: `1px solid ${B.border}` }}>

          {payStatus === 'approved' && (
            <>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: B.lime }}>
                <CheckCircle size={36} color="#000" strokeWidth={2.5} />
              </div>
              <h2 className="text-4xl font-black mb-3 tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif", color: B.lime }}>
                PAGO APROBADO
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: B.muted }}>
                Tu pedido fue confirmado. Recibirás un correo con los detalles y el seguimiento de tu compra.
              </p>
            </>
          )}

          {payStatus === 'failure' && (
            <>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: B.red }}>
                <X size={36} color="#fff" strokeWidth={2.5} />
              </div>
              <h2 className="text-4xl font-black mb-3 tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif", color: B.red }}>
                PAGO FALLIDO
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: B.muted }}>
                No se realizó ningún cargo. Puedes intentarlo de nuevo o contactarnos por WhatsApp.
              </p>
            </>
          )}

          {payStatus === 'pending' && (
            <>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: '#D97706' }}>
                <Clock size={36} color="#fff" strokeWidth={2.5} />
              </div>
              <h2 className="text-4xl font-black mb-3 tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif", color: '#F59E0B' }}>
                PAGO PENDIENTE
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: B.muted }}>
                Tu pago está siendo verificado. Te avisaremos por correo cuando se confirme.
              </p>
            </>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.history.replaceState({}, '', '/demos/tienda')}
              className="lime-btn w-full py-4 font-bold uppercase tracking-widest text-sm"
              style={{ background: B.lime, color: '#000' }}>
              {payStatus === 'approved' ? 'Seguir comprando' : 'Volver a la tienda'}
            </button>
            {payStatus !== 'approved' && (
              <a href={WA} target="_blank" rel="noreferrer"
                className="ghost-btn w-full py-3 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                style={{ border: `1px solid ${B.border}`, color: B.muted, background: 'transparent' }}>
                <MessageCircle size={13} /> Contactar por WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    )}

    </>
  )
}

function CheckoutInput({ label, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: '#777777' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 text-sm rounded-lg transition-all"
        style={{ background: '#111111', border: '1px solid #222222', color: '#EFEFEF', outline: 'none' }}
        onFocus={e => { e.target.style.borderColor = '#CCFF00' }}
        onBlur={e => { e.target.style.borderColor = '#222222' }}
      />
    </div>
  )
}

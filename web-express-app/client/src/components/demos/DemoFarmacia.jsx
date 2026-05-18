import { useState, useMemo } from 'react'
import { ShoppingCart, Search, Phone, MapPin, Clock, ChevronDown, X, Plus, Minus, MessageCircle, Truck, Shield, Tag, ArrowRight, Star } from 'lucide-react'

const BRAND = { green: '#16A34A', dark: '#14532D', light: '#F0FDF4', mid: '#DCFCE7', gray: '#6B7280', border: '#E5E7EB', black: '#111827' }
const WA = 'https://wa.me/56932930812'

const PRODUCTS = [
  // OTC
  { id:1,  cat:'OTC',            name:'Paracetamol 500mg',          sub:'Caja 20 comprimidos',        price:3490,  badge:'Más vendido', img:'💊', stars:4.8, stock:true },
  { id:2,  cat:'OTC',            name:'Ibuprofeno 400mg',            sub:'Caja 20 comprimidos',        price:4290,  badge:null,          img:'💊', stars:4.6, stock:true },
  { id:3,  cat:'OTC',            name:'Vitamina C 1000mg',           sub:'Frasco 30 cápsulas',         price:6990,  badge:'Oferta',      img:'🍊', stars:4.9, stock:true },
  { id:4,  cat:'OTC',            name:'Antigripal Noche',            sub:'Caja 10 sobres',             price:5490,  badge:null,          img:'🌙', stars:4.5, stock:true },
  // Dermocosmética
  { id:5,  cat:'Dermocosmética', name:'Protector Solar SPF 50+',     sub:'Loción 200ml · Eucerin',     price:18990, badge:'Premium',     img:'☀️', stars:4.9, stock:true },
  { id:6,  cat:'Dermocosmética', name:'Hidratante Facial',           sub:'Crema 50ml · Cetaphil',      price:14990, badge:null,          img:'🧴', stars:4.7, stock:true },
  { id:7,  cat:'Dermocosmética', name:'Shampoo Anticaída',           sub:'Frasco 400ml',               price:9990,  badge:'Oferta',      img:'🧴', stars:4.4, stock:true },
  { id:8,  cat:'Dermocosmética', name:'Vitamina E Facial',           sub:'Sérum 30ml',                 price:11990, badge:null,          img:'✨', stars:4.6, stock:true },
  // Vitaminas
  { id:9,  cat:'Vitaminas',      name:'Omega 3 · 1000mg',            sub:'Frasco 60 cápsulas',         price:12990, badge:'Más vendido', img:'🐟', stars:4.8, stock:true },
  { id:10, cat:'Vitaminas',      name:'Magnesio B6',                 sub:'Frasco 60 comprimidos',      price:8490,  badge:null,          img:'💪', stars:4.5, stock:true },
  { id:11, cat:'Vitaminas',      name:'Complejo B',                  sub:'Frasco 30 cápsulas',         price:7290,  badge:null,          img:'⚡', stars:4.6, stock:true },
  { id:12, cat:'Vitaminas',      name:'Zinc + Vitamina C',           sub:'Frasco 30 gummies',          price:9990,  badge:'Nuevo',       img:'🍬', stars:4.7, stock:true },
  // Bebé
  { id:13, cat:'Bebé',           name:'Paracetamol Pediátrico',      sub:'Suspensión 100ml',           price:4990,  badge:null,          img:'👶', stars:4.9, stock:true },
  { id:14, cat:'Bebé',           name:'Crema Pañal Bepanthen',       sub:'Tubo 100g',                  price:8990,  badge:'Recomendado', img:'🧸', stars:4.9, stock:true },
  { id:15, cat:'Bebé',           name:'Suero Fisiológico',           sub:'Unidosis 5ml · 20 unid.',    price:5490,  badge:null,          img:'💧', stars:4.7, stock:true },
  // Higiene
  { id:16, cat:'Higiene',        name:'Alcohol Gel 500ml',           sub:'Con hidratante',             price:3290,  badge:null,          img:'🧼', stars:4.4, stock:true },
  { id:17, cat:'Higiene',        name:'Mascarillas KN95',            sub:'Caja 10 unidades',           price:4990,  badge:null,          img:'😷', stars:4.5, stock:true },
  { id:18, cat:'Higiene',        name:'Termómetro Digital',          sub:'Lectura en 10 segundos',     price:14990, badge:'Oferta',      img:'🌡️', stars:4.8, stock:true },
]

const CATS = ['Todos', 'OTC', 'Dermocosmética', 'Vitaminas', 'Bebé', 'Higiene']

const fmt = (n) => '$' + n.toLocaleString('es-CL')

function BadgeChip({ text }) {
  const colors = { 'Más vendido': ['#FEF9C3','#854D0E'], 'Oferta': ['#FEE2E2','#991B1B'], 'Premium': ['#EDE9FE','#5B21B6'], 'Nuevo': ['#DBEAFE','#1E40AF'], 'Recomendado': [BRAND.mid, BRAND.dark] }
  const [bg, fg] = colors[text] || [BRAND.mid, BRAND.dark]
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: bg, color: fg }}>{text}</span>
}

function Stars({ n }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={11} fill="#FBBF24" color="#FBBF24" />
      <span className="text-[11px] font-semibold" style={{ color: BRAND.gray }}>{n}</span>
    </div>
  )
}

export default function DemoFarmacia() {
  const [cat, setCat] = useState('Todos')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState({})
  const [cartOpen, setCartOpen] = useState(false)

  const filtered = useMemo(() =>
    PRODUCTS.filter(p =>
      (cat === 'Todos' || p.cat === cat) &&
      (search === '' || p.name.toLowerCase().includes(search.toLowerCase()))
    ), [cat, search])

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0)
  const totalPrice = PRODUCTS.reduce((acc, p) => acc + (cart[p.id] || 0) * p.price, 0)

  const add = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }))
  const remove = (id) => setCart(c => { const n = { ...c }; if (n[id] > 1) n[id]--; else delete n[id]; return n })

  const waOrder = () => {
    const items = PRODUCTS.filter(p => cart[p.id]).map(p => `• ${p.name} x${cart[p.id]} — ${fmt(p.price * cart[p.id])}`).join('\n')
    const msg = `Hola Farmacia Santa Clara 👋\n\nQuisiera hacer el siguiente pedido:\n\n${items}\n\n*Total: ${fmt(totalPrice)}*\n\n¿Hacen despacho a domicilio?`
    window.open(`https://wa.me/56932930812?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="min-h-screen" style={{ background: '#F9FAFB', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Demo Banner ─────────────────────────────────────────────────── */}
      <div className="text-center py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-3 flex-wrap"
        style={{ background: BRAND.dark, color: '#fff' }}>
        <span>⚡ Demo creado por AgenciaSi — ¿Quieres este sitio para tu farmacia?</span>
        <a href="https://agenciasi.cl/#contact" target="_blank" rel="noreferrer"
          className="underline font-bold hover:opacity-80 transition-opacity flex items-center gap-1">
          Cotizar ahora <ArrowRight size={11} />
        </a>
      </div>

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="text-xs py-2 px-5 flex items-center justify-between flex-wrap gap-2"
        style={{ background: BRAND.light, borderBottom: `1px solid ${BRAND.mid}`, color: BRAND.dark }}>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1"><MapPin size={12} /> Av. Libertad 842, San Clemente</span>
          <span className="flex items-center gap-1"><Clock size={12} /> Lun–Sáb 8:30–21:00 · Dom 9:00–19:00</span>
        </div>
        <a href={WA} target="_blank" rel="noreferrer"
          className="flex items-center gap-1 font-bold hover:opacity-75 transition-opacity">
          <Phone size={12} /> +56 9 3293 0812
        </a>
      </div>

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: BRAND.green }}>
              💊
            </div>
            <div>
              <p className="font-black text-sm leading-tight" style={{ color: BRAND.dark }}>Farmacia</p>
              <p className="font-black text-sm leading-tight" style={{ color: BRAND.green }}>Santa Clara</p>
            </div>
          </div>

          <div className="flex-1 relative max-w-xl">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: BRAND.gray }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Busca medicamentos, vitaminas, dermocosméticos…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{ background: '#F3F4F6', border: `1.5px solid ${search ? BRAND.green : 'transparent'}` }}
            />
          </div>

          <button onClick={() => setCartOpen(true)} className="relative p-2.5 rounded-xl transition-colors hover:opacity-80"
            style={{ background: BRAND.green }}>
            <ShoppingCart size={18} color="#fff" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center text-white"
                style={{ background: '#DC2626' }}>
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <div className="py-10 px-4" style={{ background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.green} 100%)` }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white">
            <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Farmacia Santa Clara</p>
            <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight">
              Tu salud,<br />a un clic de distancia
            </h1>
            <p className="text-sm opacity-80 mb-5 max-w-sm">Medicamentos, vitaminas y dermocosméticos con despacho a domicilio el mismo día en San Clemente y alrededores.</p>
            <a href={WA} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
              style={{ background: '#fff', color: BRAND.dark }}>
              <MessageCircle size={16} style={{ color: '#25D366' }} />
              Pedir por WhatsApp
            </a>
          </div>
          <div className="grid grid-cols-3 gap-3 shrink-0">
            {[
              { icon: <Truck size={20} color={BRAND.green} />,  title: 'Despacho', sub: 'mismo día' },
              { icon: <Shield size={20} color={BRAND.green} />, title: 'Productos', sub: '100% originales' },
              { icon: <Tag size={20} color={BRAND.green} />,    title: 'Precios',   sub: 'convenientes' },
            ].map(b => (
              <div key={b.title} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center text-white">
                <div className="flex justify-center mb-1">{b.icon}</div>
                <p className="text-xs font-bold">{b.title}</p>
                <p className="text-[10px] opacity-70">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Category pills ──────────────────────────────────────────────── */}
      <div className="sticky top-[57px] z-30 bg-white border-b px-4 py-3" style={{ borderColor: BRAND.border }}>
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={cat === c
                ? { background: BRAND.green, color: '#fff' }
                : { background: '#F3F4F6', color: BRAND.gray }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Product grid ────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: BRAND.gray }}>
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold">No encontramos "{search}"</p>
            <p className="text-sm">Intenta con otro término o contáctanos por WhatsApp</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden flex flex-col transition-shadow hover:shadow-md"
                style={{ border: `1px solid ${BRAND.border}` }}>
                {/* Product image area */}
                <div className="h-28 flex items-center justify-center text-5xl" style={{ background: BRAND.light }}>
                  {p.img}
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <p className="text-xs font-bold leading-tight" style={{ color: BRAND.black }}>{p.name}</p>
                    {p.badge && <BadgeChip text={p.badge} />}
                  </div>
                  <p className="text-[11px] mb-2" style={{ color: BRAND.gray }}>{p.sub}</p>
                  <Stars n={p.stars} />
                  <p className="text-lg font-black mt-2 mb-3" style={{ color: BRAND.green }}>{fmt(p.price)}</p>

                  {cart[p.id] ? (
                    <div className="flex items-center justify-between rounded-xl overflow-hidden mt-auto" style={{ border: `1.5px solid ${BRAND.green}` }}>
                      <button onClick={() => remove(p.id)} className="px-3 py-2 font-bold text-lg transition-colors hover:opacity-70" style={{ color: BRAND.green }}>
                        <Minus size={14} />
                      </button>
                      <span className="font-black text-sm" style={{ color: BRAND.dark }}>{cart[p.id]}</span>
                      <button onClick={() => add(p.id)} className="px-3 py-2 font-bold text-lg transition-colors hover:opacity-70" style={{ color: BRAND.green }}>
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => add(p.id)}
                      className="w-full py-2 rounded-xl text-xs font-bold mt-auto transition-opacity hover:opacity-85"
                      style={{ background: BRAND.green, color: '#fff' }}>
                      Agregar al carro
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="mt-12 py-10 px-4" style={{ background: BRAND.dark, color: '#fff' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <p className="font-black text-lg mb-2">Farmacia Santa Clara</p>
            <p className="text-sm opacity-70 mb-3">Tu farmacia de confianza en San Clemente. Más de 15 años cuidando tu salud.</p>
            <a href={WA} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold"
              style={{ background: '#25D366' }}>
              <MessageCircle size={15} /> WhatsApp
            </a>
          </div>
          <div>
            <p className="font-bold mb-3 text-sm uppercase tracking-widest opacity-60">Horario</p>
            <div className="space-y-1 text-sm opacity-80">
              <p>Lunes a Sábado: 8:30 – 21:00</p>
              <p>Domingo: 9:00 – 19:00</p>
              <p>Festivos: 10:00 – 18:00</p>
            </div>
          </div>
          <div>
            <p className="font-bold mb-3 text-sm uppercase tracking-widest opacity-60">Contacto</p>
            <div className="space-y-1 text-sm opacity-80">
              <p className="flex items-center gap-2"><MapPin size={13} /> Av. Libertad 842, San Clemente</p>
              <p className="flex items-center gap-2"><Phone size={13} /> +56 9 3293 0812</p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 flex items-center justify-between flex-wrap gap-3 text-xs opacity-40"
          style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <span>© 2025 Farmacia Santa Clara</span>
          <a href="https://agenciasi.cl" target="_blank" rel="noreferrer" className="hover:opacity-70">
            Sitio desarrollado por AgenciaSi
          </a>
        </div>
      </footer>

      {/* ── Cart Drawer ─────────────────────────────────────────────────── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-sm bg-white flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${BRAND.border}` }}>
              <p className="font-black text-lg" style={{ color: BRAND.dark }}>Tu carro ({totalItems})</p>
              <button onClick={() => setCartOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {totalItems === 0 ? (
                <div className="text-center py-16" style={{ color: BRAND.gray }}>
                  <p className="text-5xl mb-3">🛒</p>
                  <p className="font-semibold">Tu carro está vacío</p>
                  <p className="text-sm">Agrega productos para continuar</p>
                </div>
              ) : (
                PRODUCTS.filter(p => cart[p.id]).map(p => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: BRAND.light }}>
                      {p.img}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: BRAND.black }}>{p.name}</p>
                      <p className="text-xs" style={{ color: BRAND.gray }}>{fmt(p.price)} c/u</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => remove(p.id)} className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: BRAND.mid, color: BRAND.dark }}>
                        <Minus size={10} />
                      </button>
                      <span className="text-sm font-black w-4 text-center" style={{ color: BRAND.dark }}>{cart[p.id]}</span>
                      <button onClick={() => add(p.id)} className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: BRAND.green, color: '#fff' }}>
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {totalItems > 0 && (
              <div className="px-5 py-4" style={{ borderTop: `1px solid ${BRAND.border}` }}>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold" style={{ color: BRAND.gray }}>Total</span>
                  <span className="text-xl font-black" style={{ color: BRAND.dark }}>{fmt(totalPrice)}</span>
                </div>
                <button onClick={waOrder}
                  className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                  style={{ background: '#25D366' }}>
                  <MessageCircle size={18} /> Pedir por WhatsApp
                </button>
                <p className="text-center text-[11px] mt-2" style={{ color: BRAND.gray }}>
                  Te confirmaremos disponibilidad y horario de entrega
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── WhatsApp FAB ────────────────────────────────────────────────── */}
      <a href={WA} target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-40 transition-transform hover:scale-110"
        style={{ background: '#25D366' }}>
        <MessageCircle size={26} color="#fff" />
      </a>
    </div>
  )
}

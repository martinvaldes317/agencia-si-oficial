import { useState, useMemo } from 'react'
import {
  MapPin, Clock, Phone, MessageCircle, ArrowRight, Star, Plus, Minus, X,
  ShoppingBag, Truck, UtensilsCrossed, Wine, ChefHat, Instagram, CheckCircle,
  CreditCard
} from 'lucide-react'

const B = {
  red: '#DC2626', dark: '#7F1D1D', orange: '#EA580C',
  light: '#FFF7ED', mid: '#FED7AA', gray: '#6B7280',
  border: '#E5E7EB', black: '#111827', cream: '#FFFBF5',
}
const WA = 'https://wa.me/56932930812'

const CATS = ['Todo', 'Entradas', 'Pastas', 'Carnes', 'Pizzas', 'Postres', 'Bebidas']

const MENU = [
  // Entradas
  { id:1,  cat:'Entradas', name:'Tabla de Quesos y Embutidos',  desc:'Selección artesanal con mermelada de higo, nueces y pan tostado.',        precio:12990, badge:'Para compartir', popular:true,  img:'https://images.unsplash.com/photo-1452195100486-9cc7a442f9f7?w=400&h=260&fit=crop&q=80' },
  { id:2,  cat:'Entradas', name:'Bruschetta al Tomate',          desc:'Pan de masa madre, tomate cherry confitado, albahaca y aceite de oliva.',  precio:7490,  badge:null,            popular:false, img:'https://images.unsplash.com/photo-1506280754576-f6fa8a873550?w=400&h=260&fit=crop&q=80' },
  { id:3,  cat:'Entradas', name:'Croquetas de Jamón',            desc:'Croquetas cremosas con jamón serrano y bechamel. 6 unidades.',             precio:8990,  badge:'Favorito',      popular:true,  img:'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=260&fit=crop&q=80' },
  // Pastas
  { id:4,  cat:'Pastas',   name:'Fettuccine al Funghi',          desc:'Pasta fresca, mix de hongos silvestres, crema, parmesano y trufa.',        precio:13990, badge:'Chef recomienda',popular:true,  img:'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=260&fit=crop&q=80' },
  { id:5,  cat:'Pastas',   name:'Spaghetti Carbonara',           desc:'Receta romana tradicional. Guanciale, huevo, pecorino y pimienta negra.',  precio:11990, badge:null,            popular:false, img:'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=260&fit=crop&q=80' },
  { id:6,  cat:'Pastas',   name:'Ravioles de Ricotta',           desc:'Ravioles caseros rellenos, salsa de tomates asados y albahaca fresca.',    precio:12490, badge:null,            popular:false, img:'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=260&fit=crop&q=80' },
  // Carnes
  { id:7,  cat:'Carnes',   name:'Entraña a la Parrilla',         desc:'350g de entraña premium, chimichurri casero y papas rústicas al horno.',   precio:19990, badge:'Estrella',      popular:true,  img:'https://images.unsplash.com/photo-1558030006-2cd4aea8ce97?w=400&h=260&fit=crop&q=80' },
  { id:8,  cat:'Carnes',   name:'Pollo al Limón y Hierbas',      desc:'Pechuga jugosa marinada, vegetales asados y arroz con azafrán.',           precio:13990, badge:null,            popular:false, img:'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=400&h=260&fit=crop&q=80' },
  { id:9,  cat:'Carnes',   name:'Costillas BBQ Lenta Cocción',   desc:'12 horas de cocción lenta, salsa BBQ ahumada, coleslaw y aros de cebolla.',precio:17990, badge:'Nuevo',         popular:true,  img:'https://images.unsplash.com/photo-1544025162-d76538d808f2?w=400&h=260&fit=crop&q=80' },
  // Pizzas
  { id:10, cat:'Pizzas',   name:'Pizza Margherita',              desc:'Masa napolitana, mozzarella di bufala, tomate san marzano y albahaca.',    precio:11990, badge:null,            popular:false, img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=260&fit=crop&q=80' },
  { id:11, cat:'Pizzas',   name:'Pizza Prosciutto e Rucola',     desc:'Jamón crudo, rúcula fresca, parmesano y aceite de oliva. Base blanca.',    precio:14990, badge:'Favorito',      popular:true,  img:'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=260&fit=crop&q=80' },
  { id:12, cat:'Pizzas',   name:'Pizza 4 Formaggi',              desc:'Mozzarella, gorgonzola, parmesano y brie. Con miel de trufa.',             precio:13990, badge:null,            popular:false, img:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=260&fit=crop&q=80' },
  // Postres
  { id:13, cat:'Postres',  name:'Tiramisú Clásico',              desc:'Receta original italiana. Mascarpone, café espresso y cacao amargo.',      precio:6990,  badge:'Imperdible',    popular:true,  img:'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=260&fit=crop&q=80' },
  { id:14, cat:'Postres',  name:'Panacotta de Vainilla',         desc:'Cremosa panna cotta con coulis de frutos rojos y menta fresca.',           precio:5990,  badge:null,            popular:false, img:'https://images.unsplash.com/photo-1488477181228-c57abb3f85d2?w=400&h=260&fit=crop&q=80' },
  { id:15, cat:'Postres',  name:'Lava Cake de Chocolate',        desc:'Bizcocho tibio con centro líquido de chocolate 70% y helado de vainilla.',  precio:7490,  badge:'Nuevo',         popular:true,  img:'https://images.unsplash.com/photo-1578985545062-6d596c981e52?w=400&h=260&fit=crop&q=80' },
  // Bebidas
  { id:16, cat:'Bebidas',  name:'Sangría de la Casa',            desc:'Vino tinto, frutas de temporada, naranja y especias. Jarra para 2.',       precio:9990,  badge:'Para compartir',popular:true,  img:'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=260&fit=crop&q=80' },
  { id:17, cat:'Bebidas',  name:'Limonada Artesanal',            desc:'Limón de Pica, menta fresca, jengibre y agua con gas. 500ml.',             precio:4490,  badge:null,            popular:false, img:'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?w=400&h=260&fit=crop&q=80' },
  { id:18, cat:'Bebidas',  name:'Café de Especialidad',          desc:'Granos de origen único, métodos de filtrado: V60, Chemex o espresso.',     precio:3990,  badge:null,            popular:false, img:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=260&fit=crop&q=80' },
]

const HORARIOS = [
  { dia: 'Lunes – Jueves',    hora: '12:30 – 15:30 · 19:00 – 23:00' },
  { dia: 'Viernes – Sábado',  hora: '12:30 – 16:00 · 19:00 – 00:00' },
  { dia: 'Domingo',           hora: '12:30 – 16:30 (solo almuerzo)' },
]

const fmt = n => '$' + n.toLocaleString('es-CL')

function BadgeChip({ text }) {
  const map = {
    'Chef recomienda': ['#FEF9C3', '#854D0E'],
    'Estrella':        ['#FEE2E2', '#991B1B'],
    'Favorito':        [B.mid,     B.dark],
    'Para compartir':  ['#DCFCE7', '#14532D'],
    'Nuevo':           ['#DBEAFE', '#1E40AF'],
    'Imperdible':      ['#EDE9FE', '#5B21B6'],
  }
  const [bg, fg] = map[text] || [B.mid, B.dark]
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: bg, color: fg }}>
      {text}
    </span>
  )
}

export default function DemoRestaurante() {
  const [cat, setCat]           = useState('Todo')
  const [cart, setCart]         = useState({})
  const [cartOpen, setCartOpen] = useState(false)
  const [tab, setTab]           = useState('delivery') // 'delivery' | 'reserva'
  const [reserva, setReserva]   = useState({ nombre:'', telefono:'', fecha:'', hora:'', personas:'2' })
  const [resSent, setResSent]   = useState(false)
  const [paying, setPaying]   = useState(false)
  const [payStatus]           = useState(() => new URLSearchParams(window.location.search).get('status'))

  const filtered   = useMemo(() => MENU.filter(p => cat === 'Todo' || p.cat === cat), [cat])
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0)
  const totalPrice = MENU.reduce((acc, p) => acc + (cart[p.id] || 0) * p.precio, 0)

  const add    = id => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }))
  const remove = id => setCart(c => {
    const n = { ...c }
    if (n[id] > 1) n[id]--
    else delete n[id]
    return n
  })

  const waOrder = () => {
    const items = MENU
      .filter(p => cart[p.id])
      .map(p => `• ${p.name} x${cart[p.id]} — ${fmt(p.precio * cart[p.id])}`)
      .join('\n')
    const msg = `Hola La Trattoria!\n\nQuisiera hacer un pedido para *${tab === 'delivery' ? 'delivery' : 'retiro'}*:\n\n${items}\n\n*Total: ${fmt(totalPrice)}*\n\n¿Cuánto demora aproximadamente?`
    window.open(`${WA}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const goCheckout = async () => {
    if (totalItems === 0) return
    setPaying(true)
    try {
      const items = MENU.filter(p => cart[p.id]).map(p => ({
        title: p.name,
        quantity: cart[p.id],
        unit_price: p.precio,
      }))
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/demos/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'restaurante', items }),
      })
      const data = await res.json()
      if (data.init_point) window.location.assign(data.init_point)
    } catch {
      setPaying(false)
    }
  }

  const waReserva = e => {
    e.preventDefault()
    const msg = `Hola La Trattoria!\n\nQuisiera reservar una mesa:\n\n• Nombre: ${reserva.nombre}\n• Teléfono: ${reserva.telefono}\n• Fecha: ${reserva.fecha}\n• Hora: ${reserva.hora}\n• Personas: ${reserva.personas}\n\n¿Tienen disponibilidad?`
    window.open(`${WA}?text=${encodeURIComponent(msg)}`, '_blank')
    setResSent(true)
  }

  const inp      = 'w-full px-4 py-3 rounded-xl text-sm outline-none'
  const inpStyle = { background: '#F9FAFB', border: `1.5px solid ${B.border}` }
  const f        = k => e => setReserva(p => ({ ...p, [k]: e.target.value }))

  return (
    <div className="min-h-screen" style={{ background: B.cream, fontFamily: "'Inter', sans-serif" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" />

      {/* ── Demo Banner ─────────────────────────────────────────────────── */}
      <div className="text-center py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-3 flex-wrap"
        style={{ background: B.dark, color: '#fff' }}>
        <span>Demo creado por AgenciaSi — ¿Quieres este sitio para tu restaurante?</span>
        <a href="https://agenciasi.cl/#contact" target="_blank" rel="noreferrer"
          className="underline hover:opacity-80 flex items-center gap-1">
          Cotizar ahora <ArrowRight size={11} />
        </a>
      </div>

      {/* ── Payment Status Banner ────────────────────────────────────────── */}
      {payStatus && (
        <div style={{
          background: payStatus === 'approved' ? '#16A34A' : payStatus === 'pending' ? '#D97706' : '#DC2626',
          color: '#fff', padding: '14px 20px', textAlign: 'center', fontWeight: 700, fontSize: 15,
          fontFamily: "'Inter', sans-serif",
        }}>
          {payStatus === 'approved' && '¡Pago aprobado! Tu pedido está en camino. Te avisamos cuando salga.'}
          {payStatus === 'pending' && 'Pago en proceso. Te avisaremos cuando se confirme.'}
          {payStatus === 'failure' && 'El pago no pudo procesarse. Intenta nuevamente o pide por WhatsApp.'}
        </div>
      )}

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="bg-white/90 backdrop-blur sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UtensilsCrossed size={24} color={B.dark} />
            <div>
              <p className="font-black text-base leading-tight" style={{ color: B.dark, fontFamily: "'Lora', serif" }}>La Trattoria</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: B.orange }}>
                Cocina Italiana · San Clemente
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold"
            style={{ color: B.gray }}>
            <a href="#menu"     className="hover:opacity-70">Menú</a>
            <a href="#nosotros" className="hover:opacity-70">Nosotros</a>
            <a href="#reservas" className="hover:opacity-70">Reservas</a>
          </div>
          <button onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-85"
            style={{ background: B.red }}>
            <ShoppingBag size={15} />
            <span>Pedir</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center"
                style={{ background: B.orange, color: '#fff' }}>
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[560px] md:min-h-[680px] flex items-center justify-center px-5 text-center"
        style={{ background: '#111' }}>
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&h=800&fit=crop&q=80"
          alt="Restaurante La Trattoria"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: 'rgba(20,0,0,0.62)' }} />

        <div className="relative max-w-3xl mx-auto text-white py-20 md:py-32">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4 opacity-60">
            Cocina italiana artesanal
          </p>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6" style={{ fontFamily: "'Lora', serif" }}>
            Auténtica cocina italiana<br />
            <em className="font-normal" style={{ color: '#FCA5A5' }}>hecha con pasión.</em>
          </h1>
          <p className="text-base opacity-75 mb-10 max-w-lg mx-auto leading-relaxed">
            Pasta fresca artesanal, carnes a la parrilla y una selección de vinos que transforma
            cada comida en una experiencia memorable.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="#menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
              style={{ background: '#fff', color: B.dark }}>
              <UtensilsCrossed size={16} /> Ver menú completo
            </a>
            <a href="#reservas"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
              style={{ background: B.red, color: '#fff' }}>
              Reservar mesa
            </a>
          </div>
          <div className="flex items-center justify-center gap-2 mt-10">
            <div className="flex">
              {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#FBBF24" color="#FBBF24" />)}
            </div>
            <span className="text-sm opacity-70">4.8 · +320 reseñas en Google</span>
          </div>
        </div>
      </section>

      {/* ── Highlights ──────────────────────────────────────────────────── */}
      <div className="py-8 px-5" style={{ background: '#fff', borderBottom: `1px solid ${B.border}` }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <ChefHat size={22} color={B.red} />, title: 'Pasta artesanal',   sub: 'hecha cada día' },
            { icon: <Truck   size={22} color={B.red} />, title: 'Delivery',           sub: 'hasta tu puerta' },
            { icon: <Wine    size={22} color={B.red} />, title: 'Carta de vinos',     sub: 'importados y nacionales' },
            { icon: <Star    size={22} color={B.red} />, title: '4.8 estrellas',      sub: 'en Google Maps' },
          ].map(c => (
            <div key={c.title} className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: B.light }}>
              {c.icon}
              <div>
                <p className="font-bold text-sm" style={{ color: B.black }}>{c.title}</p>
                <p className="text-[11px]"        style={{ color: B.gray }}>{c.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Menú ────────────────────────────────────────────────────────── */}
      <section id="menu" className="py-16 px-5">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-2 text-center"
            style={{ color: B.red }}>
            — Nuestra carta
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-center mb-10" style={{ color: B.black, fontFamily: "'Lora', serif" }}>
            Menú del día
          </h2>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 justify-start md:justify-center">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  ...(cat === c
                    ? { background: B.red, color: '#fff' }
                    : { background: '#F3F4F6', color: B.gray }),
                }}>
                {c}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(p => (
              <div key={p.id}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                style={{ border: `1px solid ${B.border}` }}>

                {/* Photo */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  {p.popular && (
                    <span className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full"
                      style={{ background: B.red, color: '#fff' }}>
                      <Star size={9} fill="#fff" color="#fff" /> Popular
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-sm leading-tight" style={{ color: B.black, fontFamily: "'Lora', serif" }}>{p.name}</h3>
                    {p.badge && <BadgeChip text={p.badge} />}
                  </div>
                  <p className="text-xs leading-relaxed flex-1 mb-3"
                    style={{ color: B.gray }}>
                    {p.desc}
                  </p>
                  <div className="flex items-center justify-between pt-3"
                    style={{ borderTop: `1px solid ${B.border}` }}>
                    <span className="font-black text-base" style={{ color: B.dark }}>{fmt(p.precio)}</span>
                    {cart[p.id] ? (
                      <div className="flex items-center gap-2 rounded-xl overflow-hidden"
                        style={{ border: `1.5px solid ${B.red}` }}>
                        <button onClick={() => remove(p.id)}
                          className="px-3 py-1.5 font-bold transition-colors hover:opacity-70"
                          style={{ color: B.red }}>
                          <Minus size={13} />
                        </button>
                        <span className="font-black text-sm w-4 text-center"
                          style={{ color: B.dark }}>
                          {cart[p.id]}
                        </span>
                        <button onClick={() => add(p.id)}
                          className="px-3 py-1.5 font-bold transition-colors hover:opacity-70"
                          style={{ color: B.red }}>
                          <Plus size={13} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => add(p.id)}
                        className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-85"
                        style={{ background: B.red }}>
                        <Plus size={12} /> Agregar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nosotros ────────────────────────────────────────────────────── */}
      <section id="nosotros" className="py-16 px-5"
        style={{ background: `linear-gradient(135deg, ${B.dark}, #450000)` }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Text side */}
            <div className="text-white">
              <p className="text-xs font-bold uppercase tracking-widest mb-3 opacity-60">
                — Nuestra historia
              </p>
              <h2 className="text-3xl md:text-4xl font-black mb-6" style={{ fontFamily: "'Lora', serif" }}>
                Más de 15 años cocinando<br />
                <em className="font-normal opacity-80">con el corazón.</em>
              </h2>
              <p className="text-base opacity-70 mb-8 leading-relaxed">
                La Trattoria nació en 2009 de la mano del Chef Marco Pellegrini, quien trajo las
                recetas de su nonna desde Nápoles. Cada plato es una historia: pasta amasada a mano
                cada mañana, salsas que hierven por horas y productos locales de la Región del Maule.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { n: '15+', l: 'Años de historia' },
                  { n: '48',  l: 'Platos en carta' },
                  { n: '4.8', l: 'Estrellas Google' },
                ].map(s => (
                  <div key={s.l} className="rounded-2xl p-5"
                    style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <p className="text-3xl font-black text-white mb-1">{s.n}</p>
                    <p className="text-[11px] opacity-60">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Chef image */}
            <div className="rounded-2xl overflow-hidden shadow-2xl h-80 md:h-96">
              <img
                src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=700&h=500&fit=crop&q=80"
                alt="Chef preparando platos en La Trattoria"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Reservas ────────────────────────────────────────────────────── */}
      <section id="reservas" className="py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-2 text-center"
            style={{ color: B.red }}>
            — Sin esperas
          </p>
          <h2 className="text-3xl font-black text-center mb-3" style={{ color: B.black, fontFamily: "'Lora', serif" }}>
            Reserva tu mesa
          </h2>
          <p className="text-center text-sm mb-8"
            style={{ color: B.gray }}>
            Confirmamos tu reserva vía WhatsApp en menos de 1 hora
          </p>

          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden mb-8"
            style={{ border: `1px solid ${B.border}` }}>
            {[
              ['delivery', <Truck size={14} />,         'Delivery / Retiro'],
              ['reserva',  <UtensilsCrossed size={14}/>, 'Reservar mesa'],
            ].map(([k, icon, label]) => (
              <button key={k} onClick={() => setTab(k)}
                className="flex-1 py-3 text-sm font-bold transition-all flex items-center justify-center gap-2"
                style={tab === k
                  ? { background: B.red, color: '#fff' }
                  : { background: '#fff', color: B.gray }}>
                {icon} {label}
              </button>
            ))}
          </div>

          {tab === 'delivery' ? (
            <div className="bg-white rounded-2xl p-8 text-center"
              style={{ border: `1px solid ${B.border}` }}>
              <div className="flex justify-center mb-4">
                <Truck size={48} color={B.red} />
              </div>
              <h3 className="font-black text-xl mb-2" style={{ color: B.black, fontFamily: "'Lora', serif" }}>Pedido por WhatsApp</h3>
              <p className="text-sm mb-6" style={{ color: B.gray }}>
                Selecciona tus platos del menú, haz clic en "Ver pedido" y te enviamos el total
                con el tiempo estimado de entrega.
              </p>
              <button onClick={() => setCartOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-opacity hover:opacity-85 mb-3"
                style={{ background: B.red }}>
                <ShoppingBag size={16} /> Ver mi pedido ({totalItems} items)
              </button>
              <p className="text-[11px]" style={{ color: B.gray }}>
                Delivery disponible en San Clemente y alrededores · Retiro sin costo
              </p>
            </div>
          ) : resSent ? (
            <div className="bg-white rounded-2xl p-10 text-center"
              style={{ border: `1px solid ${B.border}` }}>
              <div className="flex justify-center mb-4">
                <CheckCircle size={52} color={B.red} />
              </div>
              <h3 className="font-black text-xl mb-2" style={{ color: B.black, fontFamily: "'Lora', serif" }}>Reserva enviada</h3>
              <p className="text-sm mb-4" style={{ color: B.gray }}>
                Te confirmamos por WhatsApp en menos de 1 hora. ¡Nos vemos pronto!
              </p>
              <button onClick={() => setResSent(false)}
                className="text-sm font-bold"
                style={{ color: B.red }}>
                Hacer otra reserva
              </button>
            </div>
          ) : (
            <form onSubmit={waReserva}
              className="bg-white rounded-2xl p-8 space-y-4"
              style={{ border: `1px solid ${B.border}` }}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1.5"
                    style={{ color: B.gray }}>NOMBRE</label>
                  <input required value={reserva.nombre} onChange={f('nombre')}
                    placeholder="Tu nombre completo" className={inp} style={inpStyle} />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1.5"
                    style={{ color: B.gray }}>TELÉFONO</label>
                  <input required value={reserva.telefono} onChange={f('telefono')}
                    placeholder="+56 9 XXXX XXXX" className={inp} style={inpStyle} />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1.5"
                    style={{ color: B.gray }}>FECHA</label>
                  <input type="date" required value={reserva.fecha} onChange={f('fecha')}
                    className={inp} style={inpStyle}
                    min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1.5"
                    style={{ color: B.gray }}>HORA</label>
                  <select value={reserva.hora} onChange={f('hora')} className={inp} style={inpStyle}>
                    <option value="">Selecciona</option>
                    {['13:00','13:30','14:00','14:30','19:30','20:00','20:30','21:00','21:30']
                      .map(h => <option key={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1.5"
                    style={{ color: B.gray }}>PERSONAS</label>
                  <select value={reserva.personas} onChange={f('personas')} className={inp} style={inpStyle}>
                    {['1','2','3','4','5','6','7','8+'].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit"
                className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ background: B.red }}>
                <MessageCircle size={18} /> Confirmar por WhatsApp
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── Horarios ────────────────────────────────────────────────────── */}
      <div className="py-10 px-5" style={{ background: B.light }}>
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-black text-center mb-6 flex items-center justify-center gap-2"
            style={{ color: B.black, fontFamily: "'Lora', serif" }}>
            <Clock size={20} color={B.red} /> Horarios de atención
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {HORARIOS.map(h => (
              <div key={h.dia} className="bg-white rounded-xl p-5 text-center"
                style={{ border: `1px solid ${B.border}` }}>
                <p className="font-bold text-sm mb-1" style={{ color: B.dark }}>{h.dia}</p>
                <p className="text-xs"                style={{ color: B.gray }}>{h.hora}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="py-10 px-5" style={{ background: B.dark, color: '#fff' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <UtensilsCrossed size={18} color="#FCA5A5" />
              <p className="font-black text-lg" style={{ fontFamily: "'Lora', serif" }}>La Trattoria</p>
            </div>
            <p className="text-sm opacity-70 mb-4">
              Cocina italiana artesanal en el corazón de San Clemente. Reservas y delivery vía WhatsApp.
            </p>
            <a href={WA} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold"
              style={{ background: '#25D366' }}>
              <MessageCircle size={15} /> Pedir ahora
            </a>
          </div>
          <div>
            <p className="font-bold mb-3 text-sm uppercase tracking-widest opacity-60">
              Encuéntranos
            </p>
            <div className="space-y-2 text-sm opacity-80">
              <p className="flex items-center gap-2"><MapPin   size={13} /> Av. Balmaceda 530, San Clemente</p>
              <p className="flex items-center gap-2"><Phone    size={13} /> +56 9 3293 0812</p>
              <p className="flex items-center gap-2"><Instagram size={13} /> @latrattoria.sc</p>
            </div>
          </div>
          <div>
            <p className="font-bold mb-3 text-sm uppercase tracking-widest opacity-60">
              Aceptamos
            </p>
            <div className="flex flex-wrap gap-2">
              {['Efectivo', 'Débito', 'Crédito', 'Transferencia'].map(m => (
                <span key={m} className="text-xs px-3 py-1 rounded-full font-semibold"
                  style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 flex items-center justify-between flex-wrap gap-3 text-xs opacity-40"
          style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <span>© 2025 La Trattoria · San Clemente</span>
          <a href="https://agenciasi.cl" target="_blank" rel="noreferrer" className="hover:opacity-70">
            Sitio desarrollado por AgenciaSi
          </a>
        </div>
      </footer>

      {/* ── Cart Drawer ─────────────────────────────────────────────────── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/50" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-sm bg-white flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: `1px solid ${B.border}` }}>
              <p className="font-black text-lg" style={{ color: B.dark }}>
                Tu pedido ({totalItems})
              </p>
              <button onClick={() => setCartOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            {/* Delivery / Retiro toggle */}
            <div className="flex mx-5 mt-4 rounded-xl overflow-hidden"
              style={{ border: `1px solid ${B.border}` }}>
              {[
                ['delivery', <Truck size={13} />,   'Delivery'],
                ['retiro',   <MapPin size={13} />,  'Retiro'],
              ].map(([k, icon, label]) => (
                <button key={k} onClick={() => setTab(k)}
                  className="flex-1 py-2 text-xs font-bold transition-all flex items-center justify-center gap-1"
                  style={tab === k
                    ? { background: B.red, color: '#fff' }
                    : { background: '#fff', color: B.gray }}>
                  {icon} {label}
                </button>
              ))}
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {totalItems === 0 ? (
                <div className="text-center py-16" style={{ color: B.gray }}>
                  <ShoppingBag size={48} className="mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">Tu pedido está vacío</p>
                  <p className="text-sm">Agrega platos del menú</p>
                </div>
              ) : MENU.filter(p => cart[p.id]).map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded-xl shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: B.black }}>{p.name}</p>
                    <p className="text-xs" style={{ color: B.gray }}>{fmt(p.precio)} c/u</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => remove(p.id)}
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: B.mid, color: B.dark }}>
                      <Minus size={10} />
                    </button>
                    <span className="text-sm font-black w-4 text-center">{cart[p.id]}</span>
                    <button onClick={() => add(p.id)}
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: B.red, color: '#fff' }}>
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            {totalItems > 0 && (
              <div className="px-5 py-4" style={{ borderTop: `1px solid ${B.border}` }}>
                <div className="flex justify-between mb-4">
                  <span className="font-semibold" style={{ color: B.gray }}>Total</span>
                  <span className="text-xl font-black" style={{ color: B.dark }}>{fmt(totalPrice)}</span>
                </div>
                <button
                  onClick={goCheckout}
                  disabled={paying}
                  className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
                  style={{ background: '#2D2BB5' }}
                >
                  <CreditCard size={18} />
                  {paying ? 'Procesando…' : 'Pagar con MercadoPago'}
                </button>
                <button
                  onClick={waOrder}
                  className="w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-80 transition-opacity mt-2"
                  style={{ border: '1.5px solid #25D366', color: '#25D366', background: 'transparent', fontSize: 13 }}
                >
                  <MessageCircle size={15} /> O pedir por WhatsApp
                </button>
                <p className="text-center text-[11px] mt-2" style={{ color: B.gray }}>
                  Confirmamos tu pedido y tiempo de entrega al instante
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

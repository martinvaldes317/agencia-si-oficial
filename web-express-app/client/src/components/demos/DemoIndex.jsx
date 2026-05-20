import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, Globe, Code2, Zap } from 'lucide-react'

const T = {
  blue:   '#2D2BB5',
  black:  '#0A0A0A',
  gray:   '#5C5C6E',
  light:  '#F7F7FB',
  white:  '#FFFFFF',
  border: '#E8E8F0',
}

const DEMOS = [
  {
    slug:    '/demos/farmacia',
    label:   'Salud & Farmacia',
    name:    'FarmaVida',
    desc:    'E-commerce completo con catálogo de productos, carrito de compras, filtros por categoría y contacto por WhatsApp.',
    img:     'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&h=500&fit=crop&q=80',
    color:   '#16A34A',
    bg:      '#F0FDF4',
    tags:    ['Catálogo', 'Carrito', 'WhatsApp', 'Búsqueda'],
  },
  {
    slug:    '/demos/clinica',
    label:   'Salud & Clínica',
    name:    'Clínica Dental Sonrisa',
    desc:    'Sitio institucional con galería de servicios, equipo médico, preguntas frecuentes y formulario de agenda de citas.',
    img:     'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=500&fit=crop&q=80',
    color:   '#0EA5E9',
    bg:      '#F0F9FF',
    tags:    ['Servicios', 'Equipo', 'Agenda', 'FAQ'],
  },
  {
    slug:    '/demos/restaurante',
    label:   'Gastronomía',
    name:    'Bella Tavola',
    desc:    'Sitio para restaurante con menú interactivo, carrito de pedidos delivery/retiro, reservas y galería del local.',
    img:     'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop&q=80',
    color:   '#DC2626',
    bg:      '#FFF7ED',
    tags:    ['Menú', 'Pedidos', 'Reservas', 'Delivery'],
  },
  {
    slug:    '/demos/corredora',
    label:   'Inmobiliaria',
    name:    'Urbana Propiedades',
    desc:    'Portal inmobiliario con catálogo de propiedades en venta y arriendo, filtros avanzados, detalle con galería, favoritos y contacto directo por WhatsApp.',
    img:     'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=500&fit=crop&q=80',
    color:   '#1756C5',
    bg:      '#EEF4FF',
    tags:    ['Catálogo', 'Filtros', 'Favoritos', 'WhatsApp'],
  },
]

const FEATURES = [
  { Icon: Globe,  title: 'Diseño a medida',    desc: 'Cada sitio refleja la identidad visual del negocio, no un template genérico.' },
  { Icon: Zap,    title: 'Entrega en 5 días',  desc: 'Proceso ágil y directo. Del diagnóstico al sitio publicado en menos de una semana.' },
  { Icon: Code2,  title: 'Código propio',       desc: 'React + Node.js. Sin constructores visuales. Rendimiento y escalabilidad real.' },
]

export default function DemoIndex() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: T.light, minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{ background: T.white, borderBottom: `1px solid ${T.border}` }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: T.blue }}>
              <Code2 size={14} color="#fff" />
            </div>
            <span className="font-bold text-sm tracking-wide" style={{ color: T.black }}>AgenciaSI</span>
          </Link>
          <a
            href="https://wa.me/56932930812"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: T.blue, color: T.white }}
          >
            Cotizar mi sitio
            <ArrowRight size={14} />
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-14 text-center">
        <span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
          style={{ background: T.blue + '15', color: T.blue }}
        >
          Portafolio de demos
        </span>
        <h1
          className="text-4xl md:text-5xl font-extrabold leading-tight mb-5"
          style={{ color: T.black }}
        >
          Webs que <span style={{ color: T.blue }}>convierten</span>,<br className="hidden md:block" />
          no solo impresionan.
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: T.gray }}>
          Estos son ejemplos reales de lo que desarrollamos. Cada demo es funcional e interactiva.
          Tu negocio puede tener algo así en menos de una semana.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{ background: T.white, border: `1px solid ${T.border}`, color: T.black }}
            >
              <Icon size={14} style={{ color: T.blue }} />
              {title}
            </div>
          ))}
        </div>
      </section>

      {/* Demo cards */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid gap-10 md:grid-cols-1 lg:grid-cols-1">
          {DEMOS.map((d, i) => (
            <DemoCard key={d.slug} demo={d} reverse={i % 2 !== 0} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: T.black }}>
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            ¿Tu negocio necesita una web así?
          </h2>
          <p className="text-lg mb-10" style={{ color: '#9CA3AF' }}>
            Cotiza sin compromiso. Te respondemos en menos de 24 horas.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/56932930812?text=Hola,%20vi%20las%20demos%20y%20quiero%20cotizar%20mi%20sitio%20web"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-opacity hover:opacity-90"
              style={{ background: T.blue, color: T.white }}
            >
              Cotizar por WhatsApp
              <ArrowRight size={16} />
            </a>
            <Link
              to="/digitalizacion-express/wizard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-opacity hover:opacity-80"
              style={{ border: '2px solid #374151', color: T.white }}
            >
              Ver planes Web Express
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#050505', borderTop: '1px solid #1F2937' }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-sm" style={{ color: '#6B7280' }}>
            © 2025 AgenciaSI · Desarrollo web y sistemas a medida
          </span>
          <Link to="/" className="text-sm hover:underline" style={{ color: '#6B7280' }}>
            agenciasi.cl
          </Link>
        </div>
      </footer>
    </div>
  )
}

function DemoCard({ demo, reverse }) {
  const { slug, label, name, desc, img, color, bg, tags } = demo
  return (
    <div
      className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} rounded-3xl overflow-hidden`}
      style={{ background: T.white, border: `1px solid ${T.border}`, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
    >
      {/* Image */}
      <div className="md:w-[55%] relative overflow-hidden" style={{ minHeight: 300 }}>
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover"
          style={{ minHeight: 300 }}
        />
        {/* Browser chrome overlay */}
        <div
          className="absolute inset-0 flex flex-col pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 35%)' }}
        >
          <div className="flex items-center gap-1.5 px-4 pt-4">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 opacity-80" />
            <div className="ml-3 flex-1 h-5 rounded-full flex items-center px-3" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <span className="text-white text-[10px] opacity-70 truncate">agenciasi.cl{slug}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="md:w-[45%] flex flex-col justify-center p-8 md:p-12">
        <span
          className="inline-block self-start px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4"
          style={{ background: color + '18', color }}
        >
          {label}
        </span>
        <h2 className="text-2xl font-extrabold mb-3" style={{ color: T.black }}>{name}</h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: T.gray }}>{desc}</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map(t => (
            <span
              key={t}
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: bg, color }}
            >
              {t}
            </span>
          ))}
        </div>

        <Link
          to={slug}
          className="inline-flex items-center gap-2 self-start px-6 py-3 rounded-full text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: color, color: '#fff' }}
        >
          <ExternalLink size={14} />
          Ver demo completa
        </Link>
      </div>
    </div>
  )
}

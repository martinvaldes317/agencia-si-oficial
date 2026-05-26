import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, Globe, Code2, Zap, Calendar } from 'lucide-react'

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
  {
    slug:    '/demos/tienda',
    label:   'Moda & Streetwear',
    name:    'KULT. Store',
    desc:    'E-commerce premium de ropa y zapatillas exclusivas con diseño oscuro, animaciones avanzadas, selección de tallas, carrito y pedido por WhatsApp.',
    img:     'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=500&fit=crop&q=80',
    color:   '#CCFF00',
    bg:      '#1A1A00',
    tags:    ['Catálogo', 'Tallas', 'Carrito', 'WhatsApp'],
  },
  {
    slug:    '/demos/noticias',
    label:   'Medios & Periodismo',
    name:    'El Pulso',
    desc:    'Portal periodístico digital con breaking news ticker, portada editorial, filtros por categoría, buscador, clima, trending, newsletter y artículos completos con modal de lectura.',
    img:     'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=500&fit=crop&q=80',
    color:   '#E63946',
    bg:      '#1A0608',
    tags:    ['Breaking News', 'Artículos', 'Búsqueda', 'Newsletter'],
  },
]

const FEATURES = [
  { icon: Globe,  title: 'Diseño a medida' },
  { icon: Zap,    title: 'Entrega en 5 días' },
  { icon: Code2,  title: 'Código propio' },
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
          {FEATURES.map(({ icon, title }) => {
            const FeatureIcon = icon
            return (
            <div
              key={title}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{ background: T.white, border: `1px solid ${T.border}`, color: T.black }}
            >
              <FeatureIcon size={14} style={{ color: T.blue }} />
              {title}
            </div>
          )
          })}
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

      {/* Clientes */}
      <section style={{ background: T.white, padding: '80px 0', overflow: 'hidden' }}>
        <style>{`
          @keyframes di-marquee {
            0%   { transform: translateX(0) }
            100% { transform: translateX(-50%) }
          }
          .di-marquee-track {
            display: flex;
            width: max-content;
            animation: di-marquee 32s linear infinite;
          }
          .di-marquee-track:hover { animation-play-state: paused; }
          .di-logo-item {
            flex-shrink: 0;
            width: 148px;
            height: 80px;
            margin: 0 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #FFFFFF;
            border: 1px solid #E8E8F0;
            border-radius: 12px;
            padding: 12px 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            filter: grayscale(100%) opacity(0.6);
            transition: filter 0.3s, box-shadow 0.3s;
          }
          .di-logo-item:hover { filter: grayscale(0%) opacity(1); box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
          .di-logo-item img { max-width: 110px; max-height: 52px; object-fit: contain; }
        `}</style>

        <div className="max-w-4xl mx-auto px-6 text-center" style={{ marginBottom: 48 }}>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
            style={{ background: T.blue + '15', color: T.blue }}>
            Nuestros clientes
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: T.black }}>
            Nuestra reputación nos importa.
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: T.gray }}>
            Nos preocupamos de hacer diseños a medida, escuchando cada detalle de tu negocio. Cada cliente es un proyecto único — no usamos plantillas.
          </p>
        </div>

        <div style={{ overflow: 'hidden' }}>
          <div className="di-marquee-track">
            {[
              'astro-entretenimientos.svg','capitol-group.svg','espacio-cea.svg','guardias-cl.svg',
              'premiumlav.svg','calces.svg','vision-eventos.svg','solar-espectaculo.svg',
              'cft-araucania.svg','zona-plaga.svg','naturalpetworld.webp','hiiaka-dental.webp',
              'valoramos.webp','pili-orfebre.webp','centro-kinesico.webp','pacifico-salud.webp',
              'daza-maquinarias.webp','espacio-blue.webp','entrelluvias-sabores.webp','schopchile.webp',
              'ambulancias-pacifico.webp','asysam.webp','consultora-lawen.webp','d-tolentino.webp',
              'capitol-training.webp','limari-travel.webp','barras-pole-dance.webp','now-pos.png','lbepv.png',
              'astro-entretenimientos.svg','capitol-group.svg','espacio-cea.svg','guardias-cl.svg',
              'premiumlav.svg','calces.svg','vision-eventos.svg','solar-espectaculo.svg',
              'cft-araucania.svg','zona-plaga.svg','naturalpetworld.webp','hiiaka-dental.webp',
              'valoramos.webp','pili-orfebre.webp','centro-kinesico.webp','pacifico-salud.webp',
              'daza-maquinarias.webp','espacio-blue.webp','entrelluvias-sabores.webp','schopchile.webp',
              'ambulancias-pacifico.webp','asysam.webp','consultora-lawen.webp','d-tolentino.webp',
              'capitol-training.webp','limari-travel.webp','barras-pole-dance.webp','now-pos.png','lbepv.png',
            ].map((logo, i) => (
              <div key={i} className="di-logo-item">
                <img src={`/clientes/${logo}`} alt="cliente agenciasi" />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center" style={{ marginTop: 52, padding: '0 24px' }}>
          <p className="text-base mb-2" style={{ color: T.gray }}>¿Quieres ser parte de nuestros clientes?</p>
          <p className="text-sm mb-7 max-w-sm mx-auto" style={{ color: '#9CA3AF' }}>
            Conversemos sin compromiso. Te mostramos cómo podemos llevar tu negocio al mundo digital.
          </p>
          <a
            href="https://wa.me/56932930812?text=Hola%2C%20me%20interesa%20agendar%20una%20reuni%C3%B3n%20para%20hablar%20de%20mi%20proyecto."
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold transition-opacity hover:opacity-90"
            style={{ background: T.blue, color: T.white }}
          >
            <Calendar size={18} />
            Agendar una reunión gratis
          </a>
          <p className="text-xs mt-3" style={{ color: '#9CA3AF' }}>Sin costo · Sin compromiso · Respondemos en menos de 2 horas</p>
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

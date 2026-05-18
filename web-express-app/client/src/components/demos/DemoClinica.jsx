import { useState } from 'react'
import {
  Phone, MapPin, Clock, MessageCircle, ArrowRight, Star, CheckCircle,
  ChevronDown, ChevronUp, Calendar, Shield, Award, Users, Zap,
  Stethoscope, Sparkles, Sun, AlignCenter, AlertCircle, Heart,
  Gem, Scan, Activity
} from 'lucide-react'

const B = {
  blue: '#0EA5E9',
  dark: '#0C4A6E',
  light: '#F0F9FF',
  mid: '#E0F2FE',
  gray: '#6B7280',
  border: '#E5E7EB',
  black: '#111827',
  teal: '#0D9488',
}

const WA = 'https://wa.me/56932930812'

const SERVICIOS = [
  {
    Icon: Sparkles, iconColor: '#0EA5E9', iconBg: '#EFF6FF',
    name: 'Limpieza Dental',
    desc: 'Profilaxis completa, eliminación de sarro y pulido. Incluye revisión de encías.',
    precio: '$25.000', tiempo: '45 min', badge: 'Más solicitado',
  },
  {
    Icon: Sun, iconColor: '#D97706', iconBg: '#FFFBEB',
    name: 'Blanqueamiento',
    desc: 'Blanqueamiento LED profesional. Resultados visibles desde la primera sesión.',
    precio: '$89.000', tiempo: '90 min', badge: 'Oferta',
  },
  {
    Icon: AlignCenter, iconColor: '#4F46E5', iconBg: '#EEF2FF',
    name: 'Ortodoncia',
    desc: 'Brackets metálicos, cerámicos y alineadores invisibles. Evaluación gratuita.',
    precio: 'Desde $180.000', tiempo: 'Consultar', badge: null,
  },
  {
    Icon: Zap, iconColor: '#475569', iconBg: '#F1F5F9',
    name: 'Implantes Dentales',
    desc: 'Implantes de titanio de alta gama. Evaluación con radiografía panorámica incluida.',
    precio: 'Desde $450.000', tiempo: 'Consultar', badge: null,
  },
  {
    Icon: AlertCircle, iconColor: '#DC2626', iconBg: '#FEF2F2',
    name: 'Urgencias Dentales',
    desc: 'Atención prioritaria para dolor agudo, fracturas y abscesos. Sin espera.',
    precio: '$35.000', tiempo: '30 min', badge: '24/7',
  },
  {
    Icon: Heart, iconColor: '#E11D48', iconBg: '#FFF1F2',
    name: 'Odontopediatría',
    desc: 'Atención especializada para niños desde los 2 años. Ambiente amigable y sin miedo.',
    precio: '$20.000', tiempo: '40 min', badge: null,
  },
  {
    Icon: Gem, iconColor: '#7C3AED', iconBg: '#F5F3FF',
    name: 'Carillas de Porcelana',
    desc: 'Diseño de sonrisa con carillas ultrafinas. Transforma tu sonrisa en 2 sesiones.',
    precio: 'Desde $120.000', tiempo: 'Consultar', badge: 'Premium',
  },
  {
    Icon: Scan, iconColor: '#0D9488', iconBg: '#F0FDFA',
    name: 'Radiografías Digitales',
    desc: 'Radiografías periapicales y panorámicas digitales de alta resolución.',
    precio: '$12.000', tiempo: '15 min', badge: null,
  },
]

const EQUIPO = [
  {
    nombre: 'Dra. Valentina Reyes',
    esp: 'Directora · Ortodoncia',
    exp: '12 años',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&q=80',
  },
  {
    nombre: 'Dr. Matías Fuentes',
    esp: 'Implantología',
    exp: '9 años',
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&q=80',
  },
  {
    nombre: 'Dra. Camila Torres',
    esp: 'Odontopediatría',
    exp: '7 años',
    img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop&q=80',
  },
]

const PREGUNTAS = [
  {
    q: '¿Tienen convenio con Fonasa o Isapres?',
    a: 'Sí, trabajamos con Fonasa niveles C y D, y tenemos convenio con las principales isapres: Banmédica, Cruz Blanca, Colmena y Consalud.',
  },
  {
    q: '¿Puedo pagar en cuotas?',
    a: 'Sí. Aceptamos todas las tarjetas de crédito en hasta 12 cuotas sin interés para tratamientos sobre $100.000. También trabajamos con crédito dental.',
  },
  {
    q: '¿Cuánto dura el blanqueamiento?',
    a: 'El blanqueamiento LED profesional dura entre 12 y 18 meses con buena higiene. Incluimos kit de mantenimiento para casa.',
  },
  {
    q: '¿Atienden niños pequeños?',
    a: 'Desde los 2 años con nuestra especialista en odontopediatría. El ambiente está especialmente diseñado para que los niños se sientan cómodos y sin miedo.',
  },
]

function BadgeChip({ text }) {
  const colors = {
    'Más solicitado': ['#FEF9C3', '#854D0E'],
    'Oferta':         ['#FEE2E2', '#991B1B'],
    'Premium':        ['#EDE9FE', '#5B21B6'],
    '24/7':           [B.mid, B.dark],
  }
  const [bg, fg] = colors[text] || [B.mid, B.dark]
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: bg, color: fg }}
    >
      {text}
    </span>
  )
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${B.border}` }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50"
      >
        <span className="font-semibold text-sm pr-4" style={{ color: B.black }}>{q}</span>
        {open
          ? <ChevronUp size={16} style={{ color: B.gray, flexShrink: 0 }} />
          : <ChevronDown size={16} style={{ color: B.gray, flexShrink: 0 }} />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: B.gray }}>{a}</div>
      )}
    </div>
  )
}

export default function DemoClinica() {
  const [form, setForm] = useState({ nombre: '', telefono: '', servicio: '', fecha: '', hora: '' })
  const [sent, setSent] = useState(false)

  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    const msg = `Hola Clínica Dental Sonrisa\n\nQuisiera agendar una hora:\n\n- Nombre: ${form.nombre}\n- Teléfono: ${form.telefono}\n- Servicio: ${form.servicio}\n- Fecha preferida: ${form.fecha}\n- Hora preferida: ${form.hora || 'Sin preferencia'}\n\n¿Tienen disponibilidad?`
    window.open(`${WA}?text=${encodeURIComponent(msg)}`, '_blank')
    setSent(true)
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all'
  const inputStyle = { background: '#F9FAFB', border: `1.5px solid ${B.border}` }

  return (
    <div className="min-h-screen" style={{ background: '#F9FAFB', fontFamily: 'system-ui, sans-serif' }}>

      {/* Demo Banner */}
      <div
        className="text-center py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-3 flex-wrap"
        style={{ background: B.dark, color: '#fff' }}
      >
        <span>Demo creado por AgenciaSi — ¿Quieres este sitio para tu clinica?</span>
        <a
          href="https://agenciasi.cl/#contact"
          target="_blank"
          rel="noreferrer"
          className="underline font-bold hover:opacity-80 flex items-center gap-1"
        >
          Cotizar ahora <ArrowRight size={11} />
        </a>
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: B.blue }}
            >
              <Stethoscope size={20} color="#fff" />
            </div>
            <div>
              <p className="font-black text-sm leading-tight" style={{ color: B.dark }}>Clinica Dental</p>
              <p className="font-black text-sm leading-tight" style={{ color: B.blue }}>Sonrisa</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold" style={{ color: B.gray }}>
            <a href="#servicios" className="hover:opacity-70 transition-opacity">Servicios</a>
            <a href="#nosotros" className="hover:opacity-70 transition-opacity">Nosotros</a>
            <a href="#equipo" className="hover:opacity-70 transition-opacity">Equipo</a>
            <a href="#agendar" className="hover:opacity-70 transition-opacity">Agendar</a>
            <a href="#preguntas" className="hover:opacity-70 transition-opacity">FAQ</a>
          </div>
          <a
            href={`${WA}?text=${encodeURIComponent('Hola, quiero agendar una hora')}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-85"
            style={{ background: B.blue }}
          >
            <Calendar size={15} /> Agendar
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="relative py-24 md:py-36 px-5 flex items-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1400&h=700&fit=crop&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '560px',
        }}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(12,74,110,0.92) 0%, rgba(14,165,233,0.78) 100%)' }}
        />

        <div className="relative z-10 max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              <Star size={12} fill="#FBBF24" color="#FBBF24" /> 4.9 · +800 pacientes atendidos
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5">
              La sonrisa que siempre quisiste,{' '}
              <em className="font-normal opacity-80">mas cerca de lo que crees.</em>
            </h1>
            <p className="text-base opacity-80 mb-8 max-w-md leading-relaxed">
              Atencion dental de excelencia con tecnologia de ultima generacion. Convenio Fonasa e Isapres. Primera consulta sin costo.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#agendar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
                style={{ background: '#fff', color: B.dark }}
              >
                <Calendar size={16} /> Agendar hora gratis
              </a>
              <a
                href={WA}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90"
                style={{ background: '#25D366' }}
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </div>

          {/* Trust cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { Icon: Shield, title: 'Esterilizacion', sub: 'Protocolo certificado' },
              { Icon: Award,  title: 'Especialistas',  sub: 'Con +8 años de exp.' },
              { Icon: Zap,    title: 'Tecnologia',     sub: 'Radiografia digital' },
              { Icon: Users,  title: '+800 pacientes', sub: 'nos recomiendan' },
            ].map(c => (
              <div
                key={c.title}
                className="rounded-2xl p-5 text-center"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <div className="flex justify-center mb-2">
                  <c.Icon size={22} color="#fff" />
                </div>
                <p className="font-bold text-sm text-white">{c.title}</p>
                <p className="text-[11px] opacity-60 text-white">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info strip */}
      <div style={{ background: B.dark }}>
        <div className="max-w-6xl mx-auto px-5 py-4 grid sm:grid-cols-3 gap-4">
          {[
            { Icon: Clock,  text: 'Lun – Vie: 9:00 – 19:00 · Sab: 9:00 – 14:00' },
            { Icon: Phone,  text: '+56 9 3293 0812' },
            { Icon: MapPin, text: 'Av. Bernardo O\'Higgins 1240, Of. 305' },
          ].map(i => (
            <div key={i.text} className="flex items-center gap-2 text-xs text-white opacity-80">
              <i.Icon size={13} style={{ flexShrink: 0 }} />
              <span>{i.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Servicios */}
      <section id="servicios" className="py-16 md:py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: B.blue }}>
            — Lo que hacemos
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: B.black }}>
            Servicios dentales
          </h2>
          <p className="text-sm mb-10 max-w-xl" style={{ color: B.gray }}>
            Tratamientos completos con tecnologia de ultima generacion, desde la limpieza de rutina hasta la reconstruccion total de tu sonrisa.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICIOS.map(s => (
              <div
                key={s.name}
                className="bg-white rounded-2xl p-5 flex flex-col hover:shadow-lg transition-shadow duration-200"
                style={{ border: `1px solid ${B.border}` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: s.iconBg }}
                  >
                    <s.Icon size={20} color={s.iconColor} />
                  </div>
                  {s.badge && <BadgeChip text={s.badge} />}
                </div>
                <h3 className="font-bold text-sm mb-1.5" style={{ color: B.black }}>{s.name}</h3>
                <p className="text-xs leading-relaxed flex-1 mb-4" style={{ color: B.gray }}>{s.desc}</p>
                <div
                  className="flex items-center justify-between pt-3"
                  style={{ borderTop: `1px solid ${B.border}` }}
                >
                  <div>
                    <p className="font-black text-sm" style={{ color: B.blue }}>{s.precio}</p>
                    <p className="text-[10px]" style={{ color: B.gray }}>{s.tiempo}</p>
                  </div>
                  <a
                    href="#agendar"
                    className="flex items-center gap-1 text-xs font-bold transition-opacity hover:opacity-70"
                    style={{ color: B.blue }}
                  >
                    Agendar <ArrowRight size={11} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="py-16 md:py-24 px-5" style={{ background: B.light }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl" style={{ aspectRatio: '7/5' }}>
            <img
              src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=700&h=500&fit=crop&q=80"
              alt="Equipamiento dental de alta tecnologia"
              className="w-full h-full object-cover"
            />
            {/* Floating badge */}
            <div
              className="absolute bottom-5 left-5 rounded-2xl px-4 py-3 text-white text-xs font-semibold flex items-center gap-2 shadow-lg"
              style={{ background: B.dark, backdropFilter: 'blur(8px)' }}
            >
              <Activity size={14} color={B.blue} />
              Tecnologia digital de ultima generacion
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: B.blue }}>
              — Por que elegirnos
            </p>
            <h2 className="text-3xl md:text-4xl font-black mb-5" style={{ color: B.black }}>
              Mas de una decada cuidando tu salud bucal
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: B.gray }}>
              Fundada por la Dra. Valentina Reyes en 2013, Clinica Dental Sonrisa nacio con la mision de entregar atencion dental de excelencia en un ambiente moderno, calido y sin miedo. Hoy somos un equipo de 6 especialistas comprometidos con tu bienestar.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Equipamiento digital de ultima generacion',
                'Protocolo de esterilizacion certificado',
                'Convenio Fonasa C y D + principales Isapres',
                'Primera consulta completamente gratuita',
                'Atencion de urgencias via WhatsApp 24/7',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm" style={{ color: B.black }}>
                  <CheckCircle size={16} style={{ color: B.blue, flexShrink: 0, marginTop: 2 }} />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="#agendar"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90"
              style={{ background: B.blue }}
            >
              <Calendar size={15} /> Agenda tu consulta gratis
            </a>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section id="equipo" className="py-16 md:py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: B.blue }}>
            — Nuestros especialistas
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: B.black }}>
            El equipo detras de tu sonrisa
          </h2>
          <p className="text-sm mb-10 max-w-xl" style={{ color: B.gray }}>
            Profesionales titulados con especializaciones en las principales areas de la odontologia moderna.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {EQUIPO.map(m => (
              <div
                key={m.nombre}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
                style={{ border: `1px solid ${B.border}` }}
              >
                <div className="relative" style={{ aspectRatio: '1/1' }}>
                  <img
                    src={m.img}
                    alt={m.nombre}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(12,74,110,0.5) 0%, transparent 60%)' }}
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-black text-base mb-1" style={{ color: B.black }}>{m.nombre}</h3>
                  <p className="text-sm font-semibold mb-2" style={{ color: B.blue }}>{m.esp}</p>
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: B.mid, color: B.dark }}
                  >
                    <Award size={11} /> {m.exp} de experiencia
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agendar */}
      <section id="agendar" className="py-16 md:py-24 px-5" style={{ background: B.light }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-2 text-center" style={{ color: B.blue }}>
            — Primera consulta gratis
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-center" style={{ color: B.black }}>
            Agenda tu hora online
          </h2>
          <p className="text-center text-sm mb-10" style={{ color: B.gray }}>
            Confirmamos disponibilidad en menos de 2 horas via WhatsApp
          </p>

          {sent ? (
            <div className="bg-white rounded-2xl p-12 text-center" style={{ border: `1px solid ${B.border}` }}>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: B.mid }}
              >
                <CheckCircle size={32} style={{ color: B.blue }} />
              </div>
              <h3 className="font-black text-xl mb-2" style={{ color: B.black }}>Solicitud enviada</h3>
              <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: B.gray }}>
                Te redirigimos a WhatsApp para confirmar tu hora. Te respondemos en menos de 2 horas.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-sm font-bold underline"
                style={{ color: B.blue }}
              >
                Hacer otra reserva
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-8 space-y-4 shadow-sm"
              style={{ border: `1px solid ${B.border}` }}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: B.gray }}>NOMBRE COMPLETO</label>
                  <input
                    required
                    value={form.nombre}
                    onChange={f('nombre')}
                    placeholder="Ej: Maria Gonzalez"
                    className={inputCls}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: B.gray }}>TELEFONO</label>
                  <input
                    required
                    value={form.telefono}
                    onChange={f('telefono')}
                    placeholder="+56 9 XXXX XXXX"
                    className={inputCls}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold block mb-1.5" style={{ color: B.gray }}>SERVICIO</label>
                <select
                  required
                  value={form.servicio}
                  onChange={f('servicio')}
                  className={inputCls}
                  style={inputStyle}
                >
                  <option value="">Selecciona un servicio...</option>
                  {SERVICIOS.map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: B.gray }}>FECHA PREFERIDA</label>
                  <input
                    type="date"
                    required
                    value={form.fecha}
                    onChange={f('fecha')}
                    className={inputCls}
                    style={inputStyle}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: B.gray }}>HORA PREFERIDA</label>
                  <select
                    value={form.hora}
                    onChange={f('hora')}
                    className={inputCls}
                    style={inputStyle}
                  >
                    <option value="">Sin preferencia</option>
                    {['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00'].map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ background: B.blue }}
              >
                <MessageCircle size={18} /> Confirmar por WhatsApp
              </button>
              <p className="text-center text-[11px]" style={{ color: B.gray }}>
                Al enviar, te redirigimos a WhatsApp para confirmar disponibilidad.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section id="preguntas" className="py-16 md:py-24 px-5">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-2 text-center" style={{ color: B.blue }}>
            — FAQ
          </p>
          <h2 className="text-3xl font-black mb-10 text-center" style={{ color: B.black }}>
            Preguntas frecuentes
          </h2>
          <div className="space-y-3">
            {PREGUNTAS.map(p => <FAQ key={p.q} {...p} />)}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-5" style={{ background: B.dark, color: '#fff' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: B.blue }}
              >
                <Stethoscope size={17} color="#fff" />
              </div>
              <p className="font-black text-base">Clinica Dental Sonrisa</p>
            </div>
            <p className="text-sm opacity-70 mb-5 leading-relaxed">
              Especialistas en salud bucal con tecnologia de ultima generacion y atencion personalizada.
            </p>
            <a
              href={WA}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold"
              style={{ background: '#25D366' }}
            >
              <MessageCircle size={15} /> Escribir por WhatsApp
            </a>
          </div>
          <div>
            <p className="font-bold mb-4 text-xs uppercase tracking-widest opacity-50">Horario de atencion</p>
            <div className="space-y-2 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <Clock size={13} style={{ flexShrink: 0 }} />
                <span>Lunes a Viernes: 9:00 – 19:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={13} style={{ flexShrink: 0 }} />
                <span>Sabado: 9:00 – 14:00</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={13} style={{ flexShrink: 0 }} />
                <span>Urgencias: 24/7 via WhatsApp</span>
              </div>
            </div>
          </div>
          <div>
            <p className="font-bold mb-4 text-xs uppercase tracking-widest opacity-50">Ubicacion</p>
            <div className="space-y-2 text-sm opacity-80">
              <div className="flex items-start gap-2">
                <MapPin size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Av. Bernardo O'Higgins 1240, Of. 305</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={13} style={{ flexShrink: 0 }} />
                <span>+56 9 3293 0812</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={13} style={{ flexShrink: 0 }} />
                <span>Fonasa C y D · Isapres</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="max-w-6xl mx-auto mt-10 pt-6 flex items-center justify-between flex-wrap gap-3 text-xs opacity-40"
          style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
        >
          <span>© 2025 Clinica Dental Sonrisa</span>
          <a
            href="https://agenciasi.cl"
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            Sitio desarrollado por AgenciaSi
          </a>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a
        href={WA}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-40 transition-transform hover:scale-110"
        style={{ background: '#25D366' }}
      >
        <MessageCircle size={26} color="#fff" />
      </a>
    </div>
  )
}

import { useState } from 'react'
import { Phone, MapPin, Clock, MessageCircle, ArrowRight, Star, CheckCircle, X, ChevronDown, ChevronUp, Calendar, Shield, Award, Users, Smile, Zap } from 'lucide-react'

const B = { blue: '#0EA5E9', dark: '#0C4A6E', light: '#F0F9FF', mid: '#E0F2FE', gray: '#6B7280', border: '#E5E7EB', black: '#111827', teal: '#0D9488' }
const WA = 'https://wa.me/56932930812'

const SERVICIOS = [
  { icon: '🦷', name: 'Limpieza Dental', desc: 'Profilaxis completa, eliminación de sarro y pulido. Incluye revisión de encías.', precio: '$25.000', tiempo: '45 min', badge: 'Más solicitado' },
  { icon: '⚪', name: 'Blanqueamiento', desc: 'Blanqueamiento LED profesional. Resultados visibles desde la primera sesión.', precio: '$89.000', tiempo: '90 min', badge: 'Oferta' },
  { icon: '🔧', name: 'Ortodoncia', desc: 'Brackets metálicos, cerámicos y alineadores invisibles. Evaluación gratuita.', precio: 'Desde $180.000', tiempo: 'Consultar', badge: null },
  { icon: '🦺', name: 'Implantes Dentales', desc: 'Implantes de titanio de alta gama. Evaluación con radiografía panorámica incluida.', precio: 'Desde $450.000', tiempo: 'Consultar', badge: null },
  { icon: '😮', name: 'Urgencias Dentales', desc: 'Atención prioritaria para dolor agudo, fracturas y abscesos. Sin espera.', precio: '$35.000', tiempo: '30 min', badge: '24/7' },
  { icon: '👶', name: 'Odontopediatría', desc: 'Atención especializada para niños desde los 2 años. Ambiente amigable y sin miedo.', precio: '$20.000', tiempo: '40 min', badge: null },
  { icon: '💎', name: 'Carillas de Porcelana', desc: 'Diseño de sonrisa con carillas ultrafinas. Transforma tu sonrisa en 2 sesiones.', precio: 'Desde $120.000', tiempo: 'Consultar', badge: 'Premium' },
  { icon: '🩺', name: 'Radiografías', desc: 'Radiografías periapicales y panorámicas digitales de alta resolución.', precio: '$12.000', tiempo: '15 min', badge: null },
]

const EQUIPO = [
  { nombre: 'Dra. Valentina Reyes', esp: 'Directora · Ortodoncia', exp: '12 años', img: '👩‍⚕️' },
  { nombre: 'Dr. Matías Fuentes',   esp: 'Implantología',          exp: '9 años',  img: '👨‍⚕️' },
  { nombre: 'Dra. Camila Torres',   esp: 'Odontopediatría',        exp: '7 años',  img: '👩‍⚕️' },
]

const PREGUNTAS = [
  { q: '¿Tienen convenio con Fonasa o Isapres?', a: 'Sí, trabajamos con Fonasa niveles C y D, y tenemos convenio con las principales isapres: Banmédica, Cruz Blanca, Colmena y Consalud.' },
  { q: '¿Puedo pagar en cuotas?', a: 'Sí. Aceptamos todas las tarjetas de crédito en hasta 12 cuotas sin interés para tratamientos sobre $100.000. También trabajamos con crédito dental.' },
  { q: '¿Cuánto dura el blanqueamiento?', a: 'El blanqueamiento LED profesional dura entre 12 y 18 meses con buena higiene. Incluimos kit de mantenimiento para casa.' },
  { q: '¿Atienden niños pequeños?', a: 'Desde los 2 años con nuestra especialista en odontopediatría. El ambiente está especialmente diseñado para que los niños se sientan cómodos y sin miedo.' },
]

const fmt = (n) => '$' + n.toLocaleString('es-CL')

function BadgeChip({ text }) {
  const colors = { 'Más solicitado': ['#FEF9C3','#854D0E'], 'Oferta': ['#FEE2E2','#991B1B'], 'Premium': ['#EDE9FE','#5B21B6'], '24/7': [B.mid, B.dark] }
  const [bg, fg] = colors[text] || [B.mid, B.dark]
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: bg, color: fg }}>{text}</span>
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${B.border}` }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-gray-50">
        <span className="font-semibold text-sm" style={{ color: B.black }}>{q}</span>
        {open ? <ChevronUp size={16} style={{ color: B.gray }} /> : <ChevronDown size={16} style={{ color: B.gray }} />}
      </button>
      {open && <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: B.gray }}>{a}</div>}
    </div>
  )
}

export default function DemoClinica() {
  const [form, setForm] = useState({ nombre: '', telefono: '', servicio: '', fecha: '', hora: '' })
  const [sent, setSent] = useState(false)

  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    const msg = `Hola Clínica Dental Sonrisa 👋\n\nQuisiera agendar una hora:\n\n• Nombre: ${form.nombre}\n• Teléfono: ${form.telefono}\n• Servicio: ${form.servicio}\n• Fecha preferida: ${form.fecha}\n• Hora preferida: ${form.hora}\n\n¿Tienen disponibilidad?`
    window.open(`${WA}?text=${encodeURIComponent(msg)}`, '_blank')
    setSent(true)
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all'
  const inputStyle = { background: '#F9FAFB', border: `1.5px solid ${B.border}` }

  return (
    <div className="min-h-screen" style={{ background: '#F9FAFB', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Demo Banner ─────────────────────────────────────────────────── */}
      <div className="text-center py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-3 flex-wrap"
        style={{ background: B.dark, color: '#fff' }}>
        <span>⚡ Demo creado por AgenciaSi — ¿Quieres este sitio para tu clínica?</span>
        <a href="https://agenciasi.cl/#contact" target="_blank" rel="noreferrer"
          className="underline font-bold hover:opacity-80 flex items-center gap-1">
          Cotizar ahora <ArrowRight size={11} />
        </a>
      </div>

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: B.blue }}>😁</div>
            <div>
              <p className="font-black text-sm leading-tight" style={{ color: B.dark }}>Clínica Dental</p>
              <p className="font-black text-sm leading-tight" style={{ color: B.blue }}>Sonrisa</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold" style={{ color: B.gray }}>
            <a href="#servicios" className="hover:opacity-70 transition-opacity">Servicios</a>
            <a href="#equipo" className="hover:opacity-70 transition-opacity">Equipo</a>
            <a href="#agendar" className="hover:opacity-70 transition-opacity">Agendar</a>
            <a href="#preguntas" className="hover:opacity-70 transition-opacity">FAQ</a>
          </div>
          <a href={`${WA}?text=${encodeURIComponent('Hola, quiero agendar una hora 👋')}`} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-85"
            style={{ background: B.blue }}>
            <Calendar size={15} /> Agendar
          </a>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-5" style={{ background: `linear-gradient(135deg, ${B.dark} 0%, ${B.blue} 100%)` }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
              <Star size={12} fill="#FBBF24" color="#FBBF24" /> 4.9 · +800 pacientes atendidos
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5">
              La sonrisa que siempre quisiste,{' '}
              <em className="font-normal opacity-80">más cerca de lo que crees.</em>
            </h1>
            <p className="text-base opacity-75 mb-8 max-w-md leading-relaxed">
              Atención dental de excelencia con tecnología de última generación. Convenio Fonasa e Isapres. Primera consulta sin costo.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#agendar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
                style={{ background: '#fff', color: B.dark }}>
                <Calendar size={16} /> Agendar hora gratis
              </a>
              <a href={WA} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
                style={{ background: '#25D366' }}>
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </div>

          {/* Trust cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Shield size={22} color={B.blue} />, title: 'Esterilización', sub: 'Protocolo certificado' },
              { icon: <Award size={22} color={B.blue} />,  title: 'Especialistas', sub: 'Con +8 años de exp.' },
              { icon: <Zap size={22} color={B.blue} />,    title: 'Tecnología', sub: 'Radiografía digital' },
              { icon: <Users size={22} color={B.blue} />,  title: '+800 pacientes', sub: 'nos recomiendan' },
            ].map(c => (
              <div key={c.title} className="rounded-2xl p-5 text-center" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <div className="flex justify-center mb-2">{c.icon}</div>
                <p className="font-bold text-sm text-white">{c.title}</p>
                <p className="text-[11px] opacity-60 text-white">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Servicios ───────────────────────────────────────────────────── */}
      <section id="servicios" className="py-16 md:py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: B.blue }}>— Lo que hacemos</p>
          <h2 className="text-3xl md:text-4xl font-black mb-10" style={{ color: B.black }}>Servicios dentales</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICIOS.map(s => (
              <div key={s.name} className="bg-white rounded-2xl p-5 flex flex-col hover:shadow-md transition-shadow"
                style={{ border: `1px solid ${B.border}` }}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{s.icon}</span>
                  {s.badge && <BadgeChip text={s.badge} />}
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: B.black }}>{s.name}</h3>
                <p className="text-xs leading-relaxed flex-1 mb-4" style={{ color: B.gray }}>{s.desc}</p>
                <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${B.border}` }}>
                  <div>
                    <p className="font-black text-sm" style={{ color: B.blue }}>{s.precio}</p>
                    <p className="text-[10px]" style={{ color: B.gray }}>{s.tiempo}</p>
                  </div>
                  <a href="#agendar" className="text-xs font-bold transition-opacity hover:opacity-70" style={{ color: B.blue }}>
                    Agendar →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Equipo ──────────────────────────────────────────────────────── */}
      <section id="equipo" className="py-16 md:py-20 px-5" style={{ background: B.light }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: B.blue }}>— Nuestros especialistas</p>
          <h2 className="text-3xl md:text-4xl font-black mb-10" style={{ color: B.black }}>El equipo detrás de tu sonrisa</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {EQUIPO.map(m => (
              <div key={m.nombre} className="bg-white rounded-2xl p-6 text-center hover:shadow-md transition-shadow"
                style={{ border: `1px solid ${B.border}` }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
                  style={{ background: B.mid }}>
                  {m.img}
                </div>
                <h3 className="font-black text-base mb-1" style={{ color: B.black }}>{m.nombre}</h3>
                <p className="text-sm mb-2" style={{ color: B.blue }}>{m.esp}</p>
                <p className="text-xs" style={{ color: B.gray }}>{m.exp} de experiencia</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agendar ─────────────────────────────────────────────────────── */}
      <section id="agendar" className="py-16 md:py-20 px-5">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-2 text-center" style={{ color: B.blue }}>— Primera consulta gratis</p>
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-center" style={{ color: B.black }}>Agenda tu hora online</h2>
          <p className="text-center text-sm mb-10" style={{ color: B.gray }}>Confirmamos disponibilidad en menos de 2 horas vía WhatsApp</p>

          {sent ? (
            <div className="bg-white rounded-2xl p-10 text-center" style={{ border: `1px solid ${B.border}` }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: B.mid }}>
                <CheckCircle size={32} style={{ color: B.blue }} />
              </div>
              <h3 className="font-black text-xl mb-2" style={{ color: B.black }}>¡Solicitud enviada!</h3>
              <p className="text-sm mb-6" style={{ color: B.gray }}>Te redirigimos a WhatsApp para confirmar tu hora. Te respondemos en menos de 2 horas.</p>
              <button onClick={() => setSent(false)} className="text-sm font-bold" style={{ color: B.blue }}>
                Hacer otra reserva
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 space-y-4" style={{ border: `1px solid ${B.border}` }}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: B.gray }}>NOMBRE COMPLETO</label>
                  <input required value={form.nombre} onChange={f('nombre')} placeholder="Ej: María González"
                    className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: B.gray }}>TELÉFONO</label>
                  <input required value={form.telefono} onChange={f('telefono')} placeholder="+56 9 XXXX XXXX"
                    className={inputCls} style={inputStyle} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold block mb-1.5" style={{ color: B.gray }}>SERVICIO</label>
                <select required value={form.servicio} onChange={f('servicio')} className={inputCls} style={inputStyle}>
                  <option value="">Selecciona un servicio…</option>
                  {SERVICIOS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: B.gray }}>FECHA PREFERIDA</label>
                  <input type="date" required value={form.fecha} onChange={f('fecha')}
                    className={inputCls} style={inputStyle} min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1.5" style={{ color: B.gray }}>HORA PREFERIDA</label>
                  <select value={form.hora} onChange={f('hora')} className={inputCls} style={inputStyle}>
                    <option value="">Sin preferencia</option>
                    {['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00'].map(h =>
                      <option key={h} value={h}>{h}</option>
                    )}
                  </select>
                </div>
              </div>
              <button type="submit"
                className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ background: B.blue }}>
                <MessageCircle size={18} /> Confirmar por WhatsApp
              </button>
              <p className="text-center text-[11px]" style={{ color: B.gray }}>
                Al enviar, te redirigimos a WhatsApp para confirmar disponibilidad.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section id="preguntas" className="py-16 md:py-20 px-5" style={{ background: B.light }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-2 text-center" style={{ color: B.blue }}>— FAQ</p>
          <h2 className="text-3xl font-black mb-10 text-center" style={{ color: B.black }}>Preguntas frecuentes</h2>
          <div className="space-y-3">
            {PREGUNTAS.map(p => <FAQ key={p.q} {...p} />)}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="py-10 px-5" style={{ background: B.dark, color: '#fff' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <p className="font-black text-lg mb-2">Clínica Dental Sonrisa</p>
            <p className="text-sm opacity-70 mb-4">Especialistas en salud bucal con tecnología de última generación y atención personalizada.</p>
            <a href={WA} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold"
              style={{ background: '#25D366' }}>
              <MessageCircle size={15} /> Escribir por WhatsApp
            </a>
          </div>
          <div>
            <p className="font-bold mb-3 text-sm uppercase tracking-widest opacity-60">Horario de atención</p>
            <div className="space-y-1 text-sm opacity-80">
              <p>Lunes a Viernes: 9:00 – 19:00</p>
              <p>Sábado: 9:00 – 14:00</p>
              <p>Urgencias: 24/7 vía WhatsApp</p>
            </div>
          </div>
          <div>
            <p className="font-bold mb-3 text-sm uppercase tracking-widest opacity-60">Ubicación</p>
            <div className="space-y-1 text-sm opacity-80">
              <p className="flex items-center gap-2"><MapPin size={13} /> Av. Bernardo O'Higgins 1240, Of. 305</p>
              <p className="flex items-center gap-2"><Phone size={13} /> +56 9 3293 0812</p>
              <p className="flex items-center gap-2"><Smile size={13} /> Fonasa C y D · Isapres</p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 flex items-center justify-between flex-wrap gap-3 text-xs opacity-40"
          style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <span>© 2025 Clínica Dental Sonrisa</span>
          <a href="https://agenciasi.cl" target="_blank" rel="noreferrer" className="hover:opacity-70">
            Sitio desarrollado por AgenciaSi
          </a>
        </div>
      </footer>

      {/* ── WhatsApp FAB ────────────────────────────────────────────────── */}
      <a href={WA} target="_blank" rel="noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-40 transition-transform hover:scale-110"
        style={{ background: '#25D366' }}>
        <MessageCircle size={26} color="#fff" />
      </a>
    </div>
  )
}

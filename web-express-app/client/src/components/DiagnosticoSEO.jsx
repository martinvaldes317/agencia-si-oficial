import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Search, CheckCircle2, ArrowRight, ArrowLeft, BarChart3, Zap, Shield, TrendingUp, X } from 'lucide-react'

const T = {
    blue:   '#2D2BB5',
    yellow: '#FACC15',
    black:  '#0A0A0A',
    gray:   '#5C5C6E',
    light:  '#F7F7FB',
    white:  '#FFFFFF',
    border: '#E8E8F0',
}

const STEPS = [
    { n: '01', title: 'Datos de contacto',   sub: 'Para enviarte el diagnóstico personalizado' },
    { n: '02', title: 'Tu sitio web',         sub: 'Situación digital actual de tu empresa' },
    { n: '03', title: 'Objetivos SEO',        sub: 'Qué quieres lograr con posicionamiento orgánico' },
]

const INITIAL = {
    name: '', email: '', phone: '', company: '',
    website: '', industry: '', timeOnline: '', monthlyVisits: '', currentSeo: '', geoTarget: '',
    goal: '', budget: '', competitors: '',
}

export default function DiagnosticoSEO() {
    const [step, setStep] = useState(0)
    const [status, setStatus] = useState('')
    const [data, setData] = useState(INITIAL)

    const set = (k, v) => setData(p => ({ ...p, [k]: v }))

    const canNext = [
        !!(data.name && data.email && data.phone),
        !!(data.industry && data.geoTarget),
        !!(data.goal && data.budget),
    ]

    const submit = async () => {
        if (!canNext[2]) return
        setStatus('sending')
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/seo-diagnostic`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            setStatus(res.ok ? 'success' : 'error')
        } catch {
            setStatus('error')
        }
    }

    const iStyle = (focused) => ({
        borderBottom: `2px solid ${focused ? T.blue : T.border}`,
        color: T.black,
        fontFamily: 'Poppins, sans-serif',
    })

    const Field = ({ label, required, children }) => (
        <div className="w-full">
            <label className="text-[11px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.gray, fontFamily: 'Poppins, sans-serif' }}>
                {label}{required && <span style={{ color: T.blue }}> *</span>}
            </label>
            {children}
        </div>
    )

    const [focused, setFocused] = useState({})
    const focusProps = (k) => ({
        onFocus: () => setFocused(f => ({ ...f, [k]: true })),
        onBlur:  () => setFocused(f => ({ ...f, [k]: false })),
    })

    const inputCls = 'w-full py-3 bg-transparent text-sm focus:outline-none placeholder:opacity-30 transition-colors'

    const Inp = ({ k, type = 'text', placeholder = '', required = false }) => (
        <input
            type={type} required={required} placeholder={placeholder}
            value={data[k]} onChange={e => set(k, e.target.value)}
            className={inputCls} style={iStyle(focused[k])}
            {...focusProps(k)}
        />
    )

    const Sel = ({ k, opts }) => (
        <select
            value={data[k]} onChange={e => set(k, e.target.value)}
            className="w-full py-3 bg-white text-sm focus:outline-none cursor-pointer transition-colors"
            style={iStyle(focused[k])}
            {...focusProps(k)}
        >
            <option value="">Selecciona una opción</option>
            {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    )

    return (
        <div className="min-h-screen" style={{ background: T.white, fontFamily: 'Poppins, sans-serif' }}>
            <Helmet>
                <title>Diagnóstico SEO Gratuito | AgenciaSi</title>
                <meta name="description" content="Solicita tu diagnóstico SEO gratuito. Analizamos tu posicionamiento, detectamos oportunidades y te entregamos un plan de acción personalizado." />
                <link rel="canonical" href="https://agenciasi.cl/diagnostico-seo" />
            </Helmet>

            {/* Top bar */}
            <div style={{ background: T.blue }}>
                <div className="max-w-6xl mx-auto px-5 md:px-10 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center">
                        <img src="/logo-dark.png" alt="AgenciaSi" className="h-8 w-auto" />
                    </Link>
                    <Link to="/" className="text-xs font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-70"
                        style={{ color: 'rgba(255,255,255,0.7)' }}>
                        <X size={13} /> Cerrar
                    </Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-5 md:px-10 py-12 md:py-16">
                <div className="grid lg:grid-cols-5 gap-12 items-start">

                    {/* Left: info */}
                    <div className="lg:col-span-2">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6"
                            style={{ background: T.blue + '12', border: `1px solid ${T.blue}30` }}>
                            <Search size={13} style={{ color: T.blue }} />
                            <span className="text-[11px] font-bold tracking-wide" style={{ color: T.blue }}>Gratuito · Sin compromiso</span>
                        </div>

                        <h1 className="font-bold leading-[1.1] mb-5"
                            style={{ fontFamily: 'Playfair Display, serif', color: T.black, fontSize: 'clamp(2rem, 3.5vw, 2.8rem)' }}>
                            Diagnóstico SEO gratuito para tu negocio
                        </h1>
                        <p className="text-base leading-relaxed mb-8" style={{ color: T.gray }}>
                            En 3 minutos analizamos dónde está tu sitio en Google, qué oportunidades estás perdiendo y cómo crecer orgánicamente.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {[
                                { icon: Search,     text: 'Análisis de posicionamiento orgánico actual' },
                                { icon: BarChart3,  text: 'Identificación de palabras clave con potencial' },
                                { icon: TrendingUp, text: 'Comparativa con tus competidores directos' },
                                { icon: Zap,        text: 'Plan de acción personalizado para tu industria' },
                                { icon: Shield,     text: '100% gratuito, sin compromiso de contratación' },
                            ].map(({ icon: Icon, text }) => (
                                <li key={text} className="flex items-center gap-3 text-sm" style={{ color: T.gray }}>
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: T.blue + '12' }}>
                                        <Icon size={14} style={{ color: T.blue }} />
                                    </div>
                                    {text}
                                </li>
                            ))}
                        </ul>

                        {/* Steps preview */}
                        <div className="space-y-3">
                            {STEPS.map((s, i) => (
                                <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl transition-all"
                                    style={{
                                        background: i === step ? T.blue + '10' : 'transparent',
                                        border: `1px solid ${i === step ? T.blue + '30' : T.border}`,
                                    }}>
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
                                        style={{
                                            background: i < step ? T.blue : i === step ? T.blue : T.border,
                                            color: i <= step ? '#fff' : T.gray,
                                        }}>
                                        {i < step ? '✓' : s.n}
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-bold" style={{ color: i === step ? T.blue : i < step ? T.black : T.gray }}>{s.title}</p>
                                        <p className="text-[11px]" style={{ color: T.gray }}>{s.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: form */}
                    <div className="lg:col-span-3">
                        <div className="rounded-2xl shadow-sm overflow-hidden" style={{ border: `1.5px solid ${T.border}` }}>

                            {/* Form header */}
                            <div className="px-8 py-5 flex items-center justify-between" style={{ background: T.light, borderBottom: `1px solid ${T.border}` }}>
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: T.blue }}>Paso {step + 1} de {STEPS.length}</p>
                                    <p className="text-base font-bold mt-0.5" style={{ color: T.black, fontFamily: 'Playfair Display, serif' }}>
                                        {STEPS[step].title}
                                    </p>
                                </div>
                                {/* Progress bar */}
                                <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: T.border }}>
                                    <div className="h-full rounded-full transition-all duration-500"
                                        style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: T.blue }} />
                                </div>
                            </div>

                            {/* Form body */}
                            <div className="px-8 py-8">
                                {status === 'success' ? (
                                    <div className="text-center py-10">
                                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#f0fdf4' }}>
                                            <CheckCircle2 size={36} style={{ color: '#16a34a' }} />
                                        </div>
                                        <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: T.black }}>
                                            ¡Diagnóstico recibido!
                                        </h2>
                                        <p className="text-base mb-8 max-w-sm mx-auto" style={{ color: T.gray }}>
                                            Analizaremos tu sitio y te contactaremos en menos de 24 horas con el diagnóstico personalizado.
                                        </p>
                                        <Link to="/"
                                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold"
                                            style={{ background: T.blue, color: T.white }}>
                                            Volver al inicio <ArrowRight size={15} />
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-6">
                                            {step === 0 && (
                                                <>
                                                    <div className="grid sm:grid-cols-2 gap-6">
                                                        <Field label="Nombre completo" required><Inp k="name" placeholder="Juan Pérez" required /></Field>
                                                        <Field label="Empresa o marca"><Inp k="company" placeholder="Tu empresa" /></Field>
                                                    </div>
                                                    <div className="grid sm:grid-cols-2 gap-6">
                                                        <Field label="Correo electrónico" required><Inp k="email" type="email" placeholder="tu@empresa.cl" required /></Field>
                                                        <Field label="Teléfono / WhatsApp" required><Inp k="phone" type="tel" placeholder="+56 9 XXXX XXXX" required /></Field>
                                                    </div>
                                                </>
                                            )}

                                            {step === 1 && (
                                                <>
                                                    <Field label="URL de tu sitio web">
                                                        <Inp k="website" placeholder="www.tuempresa.cl" />
                                                    </Field>
                                                    <div className="grid sm:grid-cols-2 gap-6">
                                                        <Field label="Industria / sector" required>
                                                            <Sel k="industry" opts={['Salud y bienestar', 'E-commerce / Tienda online', 'Servicios profesionales', 'Turismo y hotelería', 'Inmobiliario', 'Restaurantes y gastronomía', 'Educación', 'Tecnología', 'Construcción', 'Otro']} />
                                                        </Field>
                                                        <Field label="Zona geográfica objetivo" required>
                                                            <Sel k="geoTarget" opts={['Local (mi ciudad/región)', 'Nacional (Chile)', 'Latinoamérica', 'Internacional']} />
                                                        </Field>
                                                    </div>
                                                    <div className="grid sm:grid-cols-2 gap-6">
                                                        <Field label="¿Cuánto tiempo lleva tu sitio online?">
                                                            <Sel k="timeOnline" opts={['No tengo sitio web aún', 'Menos de 1 año', '1 a 3 años', 'Más de 3 años']} />
                                                        </Field>
                                                        <Field label="Visitas mensuales aprox.">
                                                            <Sel k="monthlyVisits" opts={['No sé / Sin acceso a datos', 'Menos de 500', '500 – 2.000', '2.000 – 10.000', 'Más de 10.000']} />
                                                        </Field>
                                                    </div>
                                                    <Field label="¿Tienen estrategia SEO actualmente?">
                                                        <Sel k="currentSeo" opts={['No, nunca he trabajado el SEO', 'Algo básico pero informal', 'Sí, alguien lo gestiona', 'Lo gestiono yo mismo', 'No sé']} />
                                                    </Field>
                                                </>
                                            )}

                                            {step === 2 && (
                                                <>
                                                    <Field label="Objetivo principal con SEO" required>
                                                        <Sel k="goal" opts={['Aparecer en primeros resultados de Google', 'Conseguir más leads o consultas', 'Aumentar ventas directas', 'Mejorar visibilidad de marca', 'Reducir dependencia de publicidad pagada']} />
                                                    </Field>
                                                    <Field label="Presupuesto mensual estimado para SEO" required>
                                                        <Sel k="budget" opts={['No tengo definido', '$50.000 – $150.000 CLP/mes', '$150.000 – $300.000 CLP/mes', '$300.000 – $600.000 CLP/mes', 'Más de $600.000 CLP/mes']} />
                                                    </Field>
                                                    <Field label="Competidores que conoces (opcional)">
                                                        <textarea
                                                            value={data.competitors}
                                                            onChange={e => set('competitors', e.target.value)}
                                                            placeholder="Ej: empresa1.cl, empresa2.cl..."
                                                            rows={3}
                                                            className="w-full py-3 bg-transparent text-sm focus:outline-none placeholder:opacity-30 resize-none transition-colors"
                                                            style={iStyle(focused['competitors'])}
                                                            {...focusProps('competitors')}
                                                        />
                                                    </Field>

                                                    {/* Summary */}
                                                    <div className="rounded-xl p-5" style={{ background: T.light, border: `1px solid ${T.border}` }}>
                                                        <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: T.gray }}>Resumen de tu solicitud</p>
                                                        <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: T.gray }}>
                                                            {[
                                                                ['Nombre', data.name],
                                                                ['Email', data.email],
                                                                ['Industria', data.industry],
                                                                ['Zona', data.geoTarget],
                                                            ].map(([k, v]) => v && (
                                                                <div key={k}><span className="font-semibold" style={{ color: T.black }}>{k}:</span> {v}</div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Navigation */}
                                        <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: `1px solid ${T.border}` }}>
                                            {step > 0 ? (
                                                <button onClick={() => setStep(s => s - 1)}
                                                    className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-60"
                                                    style={{ color: T.gray }}>
                                                    <ArrowLeft size={15} /> Volver
                                                </button>
                                            ) : <div />}

                                            {step < STEPS.length - 1 ? (
                                                <button
                                                    onClick={() => canNext[step] && setStep(s => s + 1)}
                                                    disabled={!canNext[step]}
                                                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold transition-all active:scale-[0.98]"
                                                    style={{
                                                        background: canNext[step] ? T.yellow : T.border,
                                                        color: canNext[step] ? T.blue : T.gray,
                                                        cursor: canNext[step] ? 'pointer' : 'not-allowed',
                                                    }}>
                                                    Continuar <ArrowRight size={15} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={submit}
                                                    disabled={!canNext[2] || status === 'sending'}
                                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold transition-all active:scale-[0.98]"
                                                    style={{
                                                        background: canNext[2] ? T.yellow : T.border,
                                                        color: canNext[2] ? T.blue : T.gray,
                                                        cursor: canNext[2] ? 'pointer' : 'not-allowed',
                                                    }}>
                                                    {status === 'sending' ? 'Enviando...' : 'Solicitar diagnóstico gratuito →'}
                                                </button>
                                            )}
                                        </div>

                                        {status === 'error' && (
                                            <p className="text-sm text-center mt-4 font-semibold" style={{ color: '#ef4444' }}>
                                                Error al enviar. Escríbenos al{' '}
                                                <a href="https://wa.me/56932930812" target="_blank" rel="noopener noreferrer" style={{ color: T.blue }}>WhatsApp</a>.
                                            </p>
                                        )}

                                        <p className="text-[11px] text-center mt-4 font-medium" style={{ color: '#bbb' }}>
                                            Sin spam · Respuesta en &lt; 24 horas · Sin compromiso de contratación
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

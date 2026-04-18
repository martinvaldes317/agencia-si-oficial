import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
    Search, CheckCircle2, ArrowRight, ArrowLeft,
    BarChart3, Zap, Shield, TrendingUp, X,
} from 'lucide-react'

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
    { n: '01', title: 'Datos de contacto',  sub: 'Para enviarte el diagnóstico personalizado' },
    { n: '02', title: 'Tu sitio web',        sub: 'Situación digital actual de tu empresa' },
    { n: '03', title: 'Objetivos SEO',       sub: 'Qué quieres lograr con posicionamiento orgánico' },
]

const INITIAL = {
    name: '', email: '', phone: '', company: '',
    website: '', industry: '', timeOnline: '', monthlyVisits: '', currentSeo: '', geoTarget: '',
    goal: '', budget: '', competitors: '',
}

const inputBase = {
    width: '100%',
    padding: '12px 0',
    background: 'transparent',
    border: 'none',
    borderBottom: `2px solid #E8E8F0`,
    outline: 'none',
    fontSize: '14px',
    color: '#0A0A0A',
    fontFamily: 'Poppins, sans-serif',
    transition: 'border-color 0.2s',
}

const selectBase = {
    ...inputBase,
    background: 'white',
    cursor: 'pointer',
}

const Label = ({ text, required }) => (
    <label style={{
        display: 'block',
        marginBottom: '6px',
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        color: T.gray,
        fontFamily: 'Poppins, sans-serif',
    }}>
        {text}{required && <span style={{ color: T.blue }}> *</span>}
    </label>
)

export default function DiagnosticoSEO() {
    const [step, setStep]     = useState(0)
    const [status, setStatus] = useState('')
    const [data, setData]     = useState(INITIAL)

    const set = (k) => (e) => setData(p => ({ ...p, [k]: e.target.value }))

    const onFocus = (e) => { e.target.style.borderBottomColor = T.blue }
    const onBlur  = (e) => { e.target.style.borderBottomColor = T.border }

    const canNext = [
        !!(data.name.trim() && data.email.trim() && data.phone.trim()),
        !!(data.industry && data.geoTarget),
        !!(data.goal && data.budget),
    ]

    const submit = async () => {
        if (!canNext[2] || status === 'sending') return
        setStatus('sending')
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/seo-diagnostic`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                }
            )
            setStatus(res.ok ? 'success' : 'error')
        } catch {
            setStatus('error')
        }
    }

    const selectOpts = {
        industry: ['Salud y bienestar', 'E-commerce / Tienda online', 'Servicios profesionales',
            'Turismo y hotelería', 'Inmobiliario', 'Restaurantes y gastronomía',
            'Educación', 'Tecnología', 'Construcción', 'Otro'],
        timeOnline: ['No tengo sitio web aún', 'Menos de 1 año', '1 a 3 años', 'Más de 3 años'],
        monthlyVisits: ['No sé / Sin acceso a datos', 'Menos de 500', '500 – 2.000', '2.000 – 10.000', 'Más de 10.000'],
        currentSeo: ['No, nunca he trabajado el SEO', 'Algo básico pero informal',
            'Sí, alguien lo gestiona', 'Lo gestiono yo mismo', 'No sé'],
        geoTarget: ['Local (mi ciudad/región)', 'Nacional (Chile)', 'Latinoamérica', 'Internacional'],
        goal: ['Aparecer en primeros resultados de Google', 'Conseguir más leads o consultas',
            'Aumentar ventas directas', 'Mejorar visibilidad de marca',
            'Reducir dependencia de publicidad pagada'],
        budget: ['No tengo definido', '$50.000 – $150.000 CLP/mes', '$150.000 – $300.000 CLP/mes',
            '$300.000 – $600.000 CLP/mes', 'Más de $600.000 CLP/mes'],
    }

    const Opt = ({ field }) => (
        <select value={data[field]} onChange={set(field)} onFocus={onFocus} onBlur={onBlur} style={selectBase}>
            <option value="">Selecciona una opción</option>
            {selectOpts[field].map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    )

    return (
        <div style={{ minHeight: '100vh', background: T.white, fontFamily: 'Poppins, sans-serif' }}>
            <Helmet>
                <title>Diagnóstico SEO Gratuito | AgenciaSi</title>
                <meta name="description" content="Solicita tu diagnóstico SEO gratuito. Analizamos tu posicionamiento, detectamos oportunidades y te entregamos un plan de acción personalizado." />
                <link rel="canonical" href="https://agenciasi.cl/diagnostico-seo" />
            </Helmet>

            {/* Top bar */}
            <div style={{ background: T.blue }}>
                <div className="max-w-6xl mx-auto px-5 md:px-10 py-4 flex items-center justify-between">
                    <Link to="/"><img src="/logo-dark.png" alt="AgenciaSi" style={{ height: '32px', width: 'auto' }} /></Link>
                    <Link to="/" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <X size={13} /> Cerrar
                    </Link>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-5 md:px-10 py-12 md:py-16">
                <div className="grid lg:grid-cols-5 gap-12 items-start">

                    {/* ── Left panel ── */}
                    <div className="lg:col-span-2">
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: T.blue + '12', border: `1px solid ${T.blue}30`, marginBottom: '24px' }}>
                            <Search size={13} style={{ color: T.blue }} />
                            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: T.blue }}>Gratuito · Sin compromiso</span>
                        </div>

                        <h1 style={{ fontFamily: 'Playfair Display, serif', color: T.black, fontWeight: 700, lineHeight: 1.1, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', marginBottom: '16px' }}>
                            Diagnóstico SEO gratuito para tu negocio
                        </h1>
                        <p style={{ fontSize: '15px', lineHeight: 1.7, color: T.gray, marginBottom: '28px' }}>
                            En 3 minutos sabemos dónde está tu sitio en Google, qué oportunidades estás perdiendo y cómo crecer de forma orgánica.
                        </p>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                { icon: Search,     text: 'Análisis de posicionamiento orgánico actual' },
                                { icon: BarChart3,  text: 'Identificación de palabras clave con potencial' },
                                { icon: TrendingUp, text: 'Comparativa con tus competidores directos' },
                                { icon: Zap,        text: 'Plan de acción personalizado para tu industria' },
                                { icon: Shield,     text: '100% gratuito — sin compromiso de contratación' },
                            ].map(({ icon: Icon, text }) => (
                                <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: T.gray }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.blue + '12', flexShrink: 0 }}>
                                        <Icon size={14} style={{ color: T.blue }} />
                                    </div>
                                    {text}
                                </li>
                            ))}
                        </ul>

                        {/* Step tracker */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {STEPS.map((s, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '12px 14px', borderRadius: '12px',
                                    background: i === step ? T.blue + '10' : 'transparent',
                                    border: `1px solid ${i === step ? T.blue + '30' : T.border}`,
                                    transition: 'all 0.2s',
                                }}>
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '11px', fontWeight: 700, flexShrink: 0,
                                        background: i < step ? T.blue : i === step ? T.blue : T.border,
                                        color: i <= step ? '#fff' : T.gray,
                                    }}>
                                        {i < step ? '✓' : s.n}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', fontWeight: 700, color: i === step ? T.blue : i < step ? T.black : T.gray, margin: 0 }}>{s.title}</p>
                                        <p style={{ fontSize: '11px', color: T.gray, margin: 0 }}>{s.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Form panel ── */}
                    <div className="lg:col-span-3">
                        <div style={{ borderRadius: '20px', border: `1.5px solid ${T.border}`, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

                            {/* Form header */}
                            <div style={{ padding: '20px 32px', background: T.light, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: T.blue, margin: 0 }}>Paso {step + 1} de {STEPS.length}</p>
                                    <p style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '17px', color: T.black, margin: '2px 0 0' }}>{STEPS[step].title}</p>
                                </div>
                                {/* Progress */}
                                <div style={{ width: '80px', height: '6px', borderRadius: '99px', background: T.border, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', borderRadius: '99px', background: T.blue, width: `${((step + 1) / STEPS.length) * 100}%`, transition: 'width 0.4s ease' }} />
                                </div>
                            </div>

                            {/* Form body */}
                            <div style={{ padding: '32px' }}>
                                {status === 'success' ? (
                                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                            <CheckCircle2 size={34} style={{ color: '#16a34a' }} />
                                        </div>
                                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '24px', color: T.black, margin: '0 0 12px' }}>¡Diagnóstico recibido!</h2>
                                        <p style={{ fontSize: '14px', color: T.gray, maxWidth: '340px', margin: '0 auto 28px', lineHeight: 1.6 }}>
                                            Analizaremos tu sitio y te contactaremos en menos de 24 horas con el diagnóstico personalizado.
                                        </p>
                                        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '99px', background: T.blue, color: '#fff', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
                                            Volver al inicio <ArrowRight size={15} />
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        {/* ── STEP 1 ── */}
                                        {step === 0 && (
                                            <div style={{ display: 'grid', gap: '24px' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                                    <div>
                                                        <Label text="Nombre completo" required />
                                                        <input type="text" placeholder="Juan Pérez" value={data.name} onChange={set('name')} onFocus={onFocus} onBlur={onBlur} style={inputBase} autoComplete="name" />
                                                    </div>
                                                    <div>
                                                        <Label text="Empresa o marca" />
                                                        <input type="text" placeholder="Tu empresa" value={data.company} onChange={set('company')} onFocus={onFocus} onBlur={onBlur} style={inputBase} autoComplete="organization" />
                                                    </div>
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                                    <div>
                                                        <Label text="Correo electrónico" required />
                                                        <input type="email" placeholder="tu@empresa.cl" value={data.email} onChange={set('email')} onFocus={onFocus} onBlur={onBlur} style={inputBase} autoComplete="email" />
                                                    </div>
                                                    <div>
                                                        <Label text="Teléfono / WhatsApp" required />
                                                        <input type="tel" placeholder="+56 9 XXXX XXXX" value={data.phone} onChange={set('phone')} onFocus={onFocus} onBlur={onBlur} style={inputBase} autoComplete="tel" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* ── STEP 2 ── */}
                                        {step === 1 && (
                                            <div style={{ display: 'grid', gap: '24px' }}>
                                                <div>
                                                    <Label text="URL de tu sitio web" />
                                                    <input type="url" placeholder="https://www.tuempresa.cl" value={data.website} onChange={set('website')} onFocus={onFocus} onBlur={onBlur} style={inputBase} autoComplete="url" />
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                                    <div>
                                                        <Label text="Industria / sector" required />
                                                        <Opt field="industry" />
                                                    </div>
                                                    <div>
                                                        <Label text="Zona geográfica objetivo" required />
                                                        <Opt field="geoTarget" />
                                                    </div>
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                                    <div>
                                                        <Label text="Tiempo online del sitio" />
                                                        <Opt field="timeOnline" />
                                                    </div>
                                                    <div>
                                                        <Label text="Visitas mensuales aprox." />
                                                        <Opt field="monthlyVisits" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label text="¿Tienen estrategia SEO actualmente?" />
                                                    <Opt field="currentSeo" />
                                                </div>
                                            </div>
                                        )}

                                        {/* ── STEP 3 ── */}
                                        {step === 2 && (
                                            <div style={{ display: 'grid', gap: '24px' }}>
                                                <div>
                                                    <Label text="Objetivo principal con SEO" required />
                                                    <Opt field="goal" />
                                                </div>
                                                <div>
                                                    <Label text="Presupuesto mensual estimado" required />
                                                    <Opt field="budget" />
                                                </div>
                                                <div>
                                                    <Label text="Competidores que conoces (opcional)" />
                                                    <textarea
                                                        placeholder="Ej: empresa1.cl, empresa2.cl..."
                                                        value={data.competitors}
                                                        onChange={set('competitors')}
                                                        onFocus={onFocus}
                                                        onBlur={onBlur}
                                                        rows={3}
                                                        style={{ ...inputBase, resize: 'none', lineHeight: 1.6 }}
                                                    />
                                                </div>
                                                {/* Summary */}
                                                <div style={{ padding: '16px 20px', borderRadius: '12px', background: T.light, border: `1px solid ${T.border}` }}>
                                                    <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: T.gray, margin: '0 0 10px' }}>Resumen de tu solicitud</p>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
                                                        {[['Nombre', data.name], ['Email', data.email], ['Industria', data.industry], ['Zona', data.geoTarget]].map(([k, v]) => v ? (
                                                            <p key={k} style={{ fontSize: '12px', color: T.gray, margin: 0 }}>
                                                                <span style={{ fontWeight: 700, color: T.black }}>{k}:</span> {v}
                                                            </p>
                                                        ) : null)}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Navigation */}
                                        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            {step > 0 ? (
                                                <button type="button" onClick={() => setStep(s => s - 1)}
                                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: T.gray, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                                                    <ArrowLeft size={15} /> Volver
                                                </button>
                                            ) : <div />}

                                            {step < STEPS.length - 1 ? (
                                                <button type="button"
                                                    onClick={() => canNext[step] && setStep(s => s + 1)}
                                                    disabled={!canNext[step]}
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                        padding: '13px 28px', borderRadius: '99px',
                                                        fontSize: '14px', fontWeight: 700,
                                                        fontFamily: 'Poppins, sans-serif',
                                                        background: canNext[step] ? T.yellow : T.border,
                                                        color: canNext[step] ? T.blue : T.gray,
                                                        border: 'none',
                                                        cursor: canNext[step] ? 'pointer' : 'not-allowed',
                                                        transition: 'opacity 0.2s',
                                                    }}>
                                                    Continuar <ArrowRight size={15} />
                                                </button>
                                            ) : (
                                                <button type="button"
                                                    onClick={submit}
                                                    disabled={!canNext[2] || status === 'sending'}
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                        padding: '14px 32px', borderRadius: '99px',
                                                        fontSize: '14px', fontWeight: 700,
                                                        fontFamily: 'Poppins, sans-serif',
                                                        background: canNext[2] ? T.yellow : T.border,
                                                        color: canNext[2] ? T.blue : T.gray,
                                                        border: 'none',
                                                        cursor: canNext[2] ? 'pointer' : 'not-allowed',
                                                    }}>
                                                    {status === 'sending' ? 'Enviando...' : 'Solicitar diagnóstico gratuito →'}
                                                </button>
                                            )}
                                        </div>

                                        {status === 'error' && (
                                            <p style={{ fontSize: '13px', textAlign: 'center', marginTop: '12px', fontWeight: 600, color: '#ef4444' }}>
                                                Error al enviar. Escríbenos al{' '}
                                                <a href="https://wa.me/56932930812" target="_blank" rel="noopener noreferrer" style={{ color: T.blue }}>WhatsApp</a>.
                                            </p>
                                        )}

                                        <p style={{ fontSize: '11px', textAlign: 'center', marginTop: '16px', color: '#bbb', fontFamily: 'Poppins, sans-serif' }}>
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

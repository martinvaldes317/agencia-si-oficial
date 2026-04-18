import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
    Menu, X, BrainCircuit, Code2, Globe, Palette,
    TrendingUp, Sparkles, Video, MapPin, MessageSquare, Mail,
    ArrowRight, LogIn, Camera, Mic, ShoppingCart, CheckCircle2,
    BarChart3, Users, Zap, Shield, Search
} from 'lucide-react'

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
    blue:  '#2D2BB5',
    black: '#0A0A0A',
    gray:  '#5C5C6E',
    light: '#F7F7FB',
    white: '#FFFFFF',
    border: '#E8E8F0',
}

// ── Primitives ────────────────────────────────────────────────────────────────
const Label = ({ children, color = T.blue }) => (
    <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[11px] font-semibold tracking-wide"
        style={{ background: color + '18', color, fontFamily: 'Poppins, sans-serif' }}>
        {children}
    </span>
)

const PrimaryBtn = ({ href, to, children, onClick, className = '', small = false }) => {
    const cls = `inline-flex items-center justify-center gap-2 font-bold tracking-wide rounded-full transition-all hover:opacity-90 active:scale-[0.98] ${small ? 'px-5 py-2.5 text-[13px]' : 'px-7 py-3.5 text-[14px]'} ${className}`
    const s = { background: T.blue, color: T.white, fontFamily: 'Poppins, sans-serif' }
    if (to) return <Link to={to} className={cls} style={s}>{children}</Link>
    if (onClick) return <button type="button" onClick={onClick} className={cls} style={s}>{children}</button>
    return <a href={href} className={cls} style={s}>{children}</a>
}

const OutlineBtn = ({ href, children, className = '' }) => (
    <a href={href}
        className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[14px] font-bold tracking-wide rounded-full transition-all hover:bg-blue-50 active:scale-[0.98] ${className}`}
        style={{ border: `2px solid ${T.blue}`, color: T.blue, fontFamily: 'Poppins, sans-serif' }}>
        {children}
    </a>
)

const SectionLabel = ({ children }) => (
    <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2"
        style={{ color: T.blue, fontFamily: 'Poppins, sans-serif' }}>
        <span className="w-5 h-0.5 rounded-full inline-block" style={{ background: T.blue }} />
        {children}
    </p>
)

const H2 = ({ children, className = '', style = {} }) => (
    <h2 className={`font-bold leading-[1.1] ${className}`}
        style={{ fontFamily: 'Playfair Display, serif', color: T.black, ...style }}>
        {children}
    </h2>
)

// ── SEO Diagnostic Modal ──────────────────────────────────────────────────────
const SeoDiagnosticModal = ({ onClose }) => {
    const [step, setStep] = useState(0)
    const [status, setStatus] = useState('')
    const [data, setData] = useState({
        name: '', email: '', phone: '', company: '',
        website: '', industry: '', timeOnline: '', monthlyVisits: '', currentSeo: '', geoTarget: '',
        goal: '', budget: '', competitors: '',
    })

    const set = (k, v) => setData(p => ({ ...p, [k]: v }))

    const steps = [
        { title: 'Datos de contacto', sub: 'Para enviarte el diagnóstico personalizado' },
        { title: 'Tu sitio web actual', sub: 'Situación digital de tu empresa hoy' },
        { title: 'Objetivos SEO', sub: 'Qué quieres lograr con posicionamiento orgánico' },
    ]

    const canNext = [
        !!(data.name && data.email && data.phone),
        !!(data.industry && data.geoTarget),
        !!(data.goal && data.budget),
    ]

    const submit = async () => {
        setStatus('sending')
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/seo-diagnostic`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            setStatus(res.ok ? 'success' : 'error')
        } catch { setStatus('error') }
    }

    const IField = ({ label, required, children }) => (
        <div>
            <label className="text-[11px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.gray }}>
                {label}{required && <span style={{ color: T.blue }}> *</span>}
            </label>
            {children}
        </div>
    )

    const iStyle = { borderBottom: `2px solid ${T.border}`, color: T.black }
    const iCls = 'w-full py-3 bg-transparent text-sm focus:outline-none placeholder:opacity-30'
    const iFocus = e => e.target.style.borderBottomColor = T.blue
    const iBlur = e => e.target.style.borderBottomColor = T.border

    const Inp = ({ k, type = 'text', placeholder = '', required = false }) => (
        <input type={type} required={required} placeholder={placeholder}
            value={data[k]} onChange={e => set(k, e.target.value)}
            className={iCls} style={iStyle} onFocus={iFocus} onBlur={iBlur} />
    )

    const Sel = ({ k, opts }) => (
        <select value={data[k]} onChange={e => set(k, e.target.value)}
            className="w-full py-3 bg-white text-sm focus:outline-none cursor-pointer"
            style={{ ...iStyle, color: data[k] ? T.black : T.gray }}>
            <option value="">Selecciona una opción</option>
            {opts.map(o => <option key={o}>{o}</option>)}
        </select>
    )

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
                style={{ maxHeight: '92vh', overflowY: 'auto' }}>

                {/* Header */}
                <div className="px-7 pt-7 pb-6" style={{ background: T.blue }}>
                    <div className="flex items-start justify-between mb-5">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Search size={13} color="rgba(255,255,255,0.6)" />
                                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>Diagnóstico SEO Gratuito</span>
                            </div>
                            <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                                {steps[step].title}
                            </h3>
                            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>{steps[step].sub}</p>
                        </div>
                        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors mt-0.5 ml-3">
                            <X size={17} color="white" />
                        </button>
                    </div>
                    {/* Steps */}
                    <div className="flex items-center gap-2">
                        {steps.map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all"
                                    style={{ background: i <= step ? '#fff' : 'rgba(255,255,255,0.2)', color: i <= step ? T.blue : 'rgba(255,255,255,0.4)' }}>
                                    {i < step ? '✓' : i + 1}
                                </div>
                                {i < steps.length - 1 && (
                                    <div className="w-10 h-0.5 rounded-full" style={{ background: i < step ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)' }} />
                                )}
                            </div>
                        ))}
                        <span className="text-[10px] ml-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{step + 1} / {steps.length}</span>
                    </div>
                </div>

                {/* Body */}
                <div className="px-7 py-7">
                    {status === 'success' ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: '#f0fdf4' }}>
                                <CheckCircle2 size={30} style={{ color: '#16a34a' }} />
                            </div>
                            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>¡Diagnóstico recibido!</h3>
                            <p className="text-sm mb-6" style={{ color: T.gray }}>
                                Analizaremos tu sitio y te contactaremos en menos de 24 horas con tu diagnóstico personalizado.
                            </p>
                            <PrimaryBtn onClick={onClose}>Cerrar</PrimaryBtn>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-5">
                                {step === 0 && <>
                                    <IField label="Nombre completo" required><Inp k="name" placeholder="Juan Pérez" required /></IField>
                                    <IField label="Correo electrónico" required><Inp k="email" type="email" placeholder="tu@empresa.cl" required /></IField>
                                    <IField label="Teléfono / WhatsApp" required><Inp k="phone" type="tel" placeholder="+56 9 XXXX XXXX" required /></IField>
                                    <IField label="Empresa o marca"><Inp k="company" placeholder="Nombre de tu empresa" /></IField>
                                </>}

                                {step === 1 && <>
                                    <IField label="URL de tu sitio web"><Inp k="website" placeholder="www.tuempresa.cl" /></IField>
                                    <IField label="Industria / sector" required>
                                        <Sel k="industry" opts={['Salud y bienestar', 'E-commerce / Tienda online', 'Servicios profesionales', 'Turismo y hotelería', 'Inmobiliario', 'Restaurantes y gastronomía', 'Educación', 'Tecnología', 'Construcción', 'Otro']} />
                                    </IField>
                                    <IField label="¿Cuánto tiempo lleva tu sitio online?">
                                        <Sel k="timeOnline" opts={['No tengo sitio web aún', 'Menos de 1 año', '1 a 3 años', 'Más de 3 años']} />
                                    </IField>
                                    <IField label="Visitas mensuales aproximadas">
                                        <Sel k="monthlyVisits" opts={['No sé / Sin acceso a datos', 'Menos de 500', '500 – 2.000', '2.000 – 10.000', 'Más de 10.000']} />
                                    </IField>
                                    <IField label="¿Tienen estrategia SEO actualmente?">
                                        <Sel k="currentSeo" opts={['No, nunca he trabajado el SEO', 'Algo básico pero informal', 'Sí, alguien lo gestiona', 'Lo gestiono yo mismo', 'No sé']} />
                                    </IField>
                                    <IField label="Zona geográfica objetivo" required>
                                        <Sel k="geoTarget" opts={['Local (mi ciudad/región)', 'Nacional (Chile)', 'Latinoamérica', 'Internacional']} />
                                    </IField>
                                </>}

                                {step === 2 && <>
                                    <IField label="Objetivo principal con SEO" required>
                                        <Sel k="goal" opts={['Aparecer en primeros resultados de Google', 'Conseguir más leads o consultas', 'Aumentar ventas directas', 'Mejorar visibilidad de marca', 'Reducir dependencia de publicidad pagada']} />
                                    </IField>
                                    <IField label="Presupuesto mensual estimado para SEO" required>
                                        <Sel k="budget" opts={['No tengo definido', '$50.000 – $150.000 CLP/mes', '$150.000 – $300.000 CLP/mes', '$300.000 – $600.000 CLP/mes', 'Más de $600.000 CLP/mes']} />
                                    </IField>
                                    <IField label="Competidores que conoces (opcional)">
                                        <textarea value={data.competitors} onChange={e => set('competitors', e.target.value)}
                                            placeholder="Ej: empresa1.cl, empresa2.cl..." rows={3}
                                            className="w-full py-3 bg-transparent text-sm focus:outline-none placeholder:opacity-30 resize-none"
                                            style={iStyle} onFocus={iFocus} onBlur={iBlur} />
                                    </IField>
                                </>}
                            </div>

                            <div className="flex items-center justify-between mt-7 pt-5" style={{ borderTop: `1px solid ${T.border}` }}>
                                {step > 0
                                    ? <button onClick={() => setStep(s => s - 1)}
                                        className="text-sm font-semibold hover:opacity-60 transition-opacity"
                                        style={{ color: T.gray }}>← Volver</button>
                                    : <div />}

                                {step < 2
                                    ? <PrimaryBtn onClick={() => canNext[step] && setStep(s => s + 1)}
                                        className={!canNext[step] ? 'opacity-40 pointer-events-none' : ''}>
                                        Continuar <ArrowRight size={14} />
                                    </PrimaryBtn>
                                    : <PrimaryBtn onClick={submit}
                                        className={(!canNext[2] || status === 'sending') ? 'opacity-40 pointer-events-none' : ''}>
                                        {status === 'sending' ? 'Enviando...' : 'Solicitar diagnóstico →'}
                                    </PrimaryBtn>}
                            </div>

                            {status === 'error' && (
                                <p className="text-xs text-center mt-3 font-semibold" style={{ color: '#ef4444' }}>
                                    Error al enviar. Contáctanos por WhatsApp.
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

// ── Navbar ────────────────────────────────────────────────────────────────────
const Navbar = () => {
    const [scroll, setScroll] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const fn = () => setScroll(window.scrollY > 40)
        window.addEventListener('scroll', fn)
        return () => window.removeEventListener('scroll', fn)
    }, [])

    const links = [
        { label: 'Servicios', id: 'services' },
        { label: 'Metodología', id: 'methodology' },
        { label: 'Resultados', id: 'cases' },
        { label: 'Equipo', id: 'about' },
        { label: 'Contacto', id: 'contact' },
    ]

    return (
        <header className="fixed inset-x-0 top-0 z-50">
            <nav className={`w-full transition-all duration-500 ${scroll ? 'py-3 bg-white/96 backdrop-blur-xl shadow-sm border-b' : 'py-5 bg-transparent'}`}
                style={{ borderColor: scroll ? T.border : 'transparent' }}>
                <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between">
                    {/* Logo */}
                    <a href="#home" className="flex items-center group">
                        <img src="/logo-light.png" alt="AgenciaSi" className="h-9 w-auto transition-opacity group-hover:opacity-80" />
                    </a>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {links.map(l => (
                            <a key={l.id} href={`#${l.id}`}
                                className="text-[12px] font-medium transition-colors hover:opacity-50"
                                style={{ color: T.gray, fontFamily: 'Poppins, sans-serif' }}>
                                {l.label}
                            </a>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/portal"
                            className="flex items-center gap-1.5 text-[12px] font-semibold px-4 py-2 rounded-full transition-all hover:bg-blue-50"
                            style={{ color: T.blue, fontFamily: 'Poppins, sans-serif' }}>
                            <LogIn size={13} /> Portal
                        </Link>
                        <PrimaryBtn href="#contact" small>Cotización gratuita</PrimaryBtn>
                    </div>

                    <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg transition-colors hover:bg-gray-100" style={{ color: T.black }}>
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            <div className={`fixed inset-0 top-0 md:hidden transition-all duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                style={{ background: T.white, paddingTop: '72px' }}>
                <div className="flex flex-col px-7 py-8 gap-1">
                    {links.map(l => (
                        <a key={l.id} href={`#${l.id}`}
                            className="text-xl font-bold py-4 border-b flex items-center justify-between"
                            style={{ color: T.black, borderColor: T.border, fontFamily: 'Playfair Display, serif' }}
                            onClick={() => setOpen(false)}>
                            {l.label} <ArrowRight size={18} style={{ color: T.blue }} />
                        </a>
                    ))}
                    <Link to="/digitalizacion-express"
                        className="text-xl font-bold py-4 border-b flex items-center justify-between"
                        style={{ color: T.blue, borderColor: T.border, fontFamily: 'Playfair Display, serif' }}
                        onClick={() => setOpen(false)}>
                        Web Express <ArrowRight size={18} />
                    </Link>
                    <div className="pt-6 flex flex-col gap-3">
                        <Link to="/portal"
                            className="flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm border-2"
                            style={{ borderColor: T.blue, color: T.blue }}
                            onClick={() => setOpen(false)}>
                            <LogIn size={15} /> Portal clientes
                        </Link>
                        <PrimaryBtn href="#contact" className="w-full py-4" onClick={() => setOpen(false)}>
                            Cotización gratuita
                        </PrimaryBtn>
                    </div>
                </div>
            </div>
        </header>
    )
}

// ── Footer ────────────────────────────────────────────────────────────────────
const Footer = () => (
    <footer style={{ background: T.black }}>
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-20">
            <div className="grid md:grid-cols-4 gap-10 mb-14 pb-14" style={{ borderBottom: '1px solid #1e1e1e' }}>
                <div className="md:col-span-2">
                    <div className="mb-5">
                        <img src="/logo-dark.png" alt="AgenciaSi" className="h-10 w-auto" />
                    </div>
                    <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: '#666', fontFamily: 'Poppins, sans-serif' }}>
                        Agencia de marketing digital con foco en resultados medibles. Meta Ads, Google Ads, IA y desarrollo web.
                    </p>
                    <p className="text-xs" style={{ color: '#444', fontFamily: 'Poppins, sans-serif' }}>
                        San Clemente, Región del Maule — Chile<br />
                        Cobertura: Chile · Latinoamérica · Internacional
                    </p>
                </div>
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest mb-5" style={{ color: T.blue, fontFamily: 'Poppins, sans-serif' }}>Servicios</p>
                    <ul className="space-y-3 text-sm" style={{ color: '#666', fontFamily: 'Poppins, sans-serif' }}>
                        {['Meta & Google Ads', 'Desarrollo Web', 'WordPress Pro', 'Ecosistemas IA', 'Branding', 'E-commerce'].map(s => (
                            <li key={s}><a href="#services" className="hover:text-white transition-colors">{s}</a></li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest mb-5" style={{ color: T.blue, fontFamily: 'Poppins, sans-serif' }}>Contacto</p>
                    <ul className="space-y-3 text-sm" style={{ color: '#666', fontFamily: 'Poppins, sans-serif' }}>
                        <li><a href="https://wa.me/56932930812" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+56 9 3293 0812</a></li>
                        <li><a href="mailto:contacto@agenciasi.cl" className="hover:text-white transition-colors">contacto@agenciasi.cl</a></li>
                        <li className="text-xs" style={{ color: '#555' }}>www.agenciasi.cl</li>
                    </ul>
                    <div className="mt-6">
                        <PrimaryBtn href="#contact" small>Cotización gratuita</PrimaryBtn>
                    </div>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <p className="text-xs" style={{ color: '#333', fontFamily: 'Poppins, sans-serif' }}>
                    © 2026 AgenciaSi — Diseño y desarrollo integral
                </p>
                <Link to="/portal" className="text-xs hover:text-white transition-colors" style={{ color: '#333', fontFamily: 'Poppins, sans-serif' }}>
                    Portal clientes →
                </Link>
            </div>
        </div>
    </footer>
)

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
    const [form, setForm] = useState({ name: '', company: '', budget: '$500.000 - $1.500.000 CLP' })
    const [status, setStatus] = useState('')
    const [showSeoModal, setShowSeoModal] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('sending')
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            setStatus(res.ok ? 'success' : 'error')
            if (res.ok) setForm({ name: '', company: '', budget: '$500.000 - $1.500.000 CLP' })
        } catch { setStatus('error') }
    }

    return (
        <div className="antialiased overflow-x-hidden" style={{ background: T.white, color: T.black, fontFamily: 'Poppins, sans-serif' }}>
            {showSeoModal && <SeoDiagnosticModal onClose={() => setShowSeoModal(false)} />}
            <Helmet>
                <title>AgenciaSi | Meta Ads, Google Ads e IA para empresas en Chile</title>
                <meta name="description" content="AgenciaSi: asesoría 1:1 en Meta Ads y Google Ads con integración de IA. Control total de métricas, foco en rentabilidad y resultados medibles en Chile." />
                <link rel="canonical" href="https://agenciasi.cl/" />
            </Helmet>
            <Navbar />

            {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
            <section id="home" className="relative min-h-screen flex items-center overflow-hidden" style={{ background: T.white }}>
                {/* Gradient orb */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full opacity-[0.07]"
                        style={{ background: `radial-gradient(circle, ${T.blue}, transparent 70%)` }} />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.04]"
                        style={{ background: `radial-gradient(circle, ${T.blue}, transparent 70%)` }} />
                </div>

                <div className="max-w-7xl mx-auto px-5 md:px-10 w-full pt-28 pb-16 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="flex flex-wrap gap-2 mb-8">
                                <Label>Meta Ads</Label>
                                <Label>Google Ads</Label>
                                <Label>Integración IA</Label>
                                <Label>Chile</Label>
                            </div>

                            <h1 className="font-bold leading-[1.05] mb-7"
                                style={{ fontFamily: 'Playfair Display, serif', color: T.black, fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}>
                                Publicidad que genera clientes.{' '}
                                <em className="font-normal" style={{ color: T.blue }}>No reportes.</em>
                            </h1>

                            <p className="text-lg leading-relaxed mb-10 max-w-xl" style={{ color: T.gray }}>
                                Implementamos Meta Ads y Google Ads con IA, con acompañamiento 1:1 y control total de métricas. Sin humo, sin excusas.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 mb-12">
                                <PrimaryBtn href="#contact" className="text-base px-8 py-4">
                                    Cotización gratuita <ArrowRight size={17} />
                                </PrimaryBtn>
                                <OutlineBtn href="#cases">Ver resultados</OutlineBtn>
                            </div>

                            {/* Trust row */}
                            <div className="flex flex-wrap items-center gap-5">
                                {[
                                    { icon: CheckCircle2, text: 'Cuentas propias' },
                                    { icon: Shield,       text: 'Sin permanencia' },
                                    { icon: BarChart3,    text: 'Métricas claras' },
                                ].map(({ icon: Icon, text }) => (
                                    <div key={text} className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: T.gray }}>
                                        <Icon size={14} style={{ color: T.blue }} /> {text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hero card */}
                        <div className="hidden lg:block">
                            <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: `1px solid ${T.border}` }}>
                                {/* Card header */}
                                <div className="px-7 py-5 flex items-center justify-between" style={{ background: T.blue }}>
                                    <span className="text-white font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>Dashboard AgenciaSi</span>
                                    <span className="text-[11px] px-3 py-1 rounded-full font-semibold" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>En vivo</span>
                                </div>
                                {/* Stats grid */}
                                <div className="grid grid-cols-2 gap-px bg-gray-100">
                                    {[
                                        { label: 'ROAS promedio', value: '4.2×', sub: 'últimos 90 días', up: true },
                                        { label: 'Reducción CPA', value: '−38%', sub: 'vs. período anterior', up: true },
                                        { label: 'Clientes activos', value: '24+', sub: 'en Chile y LATAM', up: null },
                                        { label: 'Inversión gestionada', value: '$12M+', sub: 'CLP mensuales', up: null },
                                    ].map(stat => (
                                        <div key={stat.label} className="bg-white p-6">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: T.gray }}>{stat.label}</p>
                                            <p className="text-3xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif', color: stat.up ? T.blue : T.black }}>
                                                {stat.value}
                                            </p>
                                            <p className="text-xs" style={{ color: '#aaa' }}>{stat.sub}</p>
                                        </div>
                                    ))}
                                </div>
                                {/* Card footer */}
                                <div className="px-7 py-4 flex items-center justify-between bg-white" style={{ borderTop: `1px solid ${T.border}` }}>
                                    <span className="text-xs font-medium" style={{ color: T.gray }}>contacto@agenciasi.cl</span>
                                    <span className="text-xs font-bold" style={{ color: T.blue }}>+56 9 3293 0812</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ STATS BAR ══════════════════════════════════════════════════ */}
            <div className="border-y" style={{ borderColor: T.border, background: T.light }}>
                <div className="max-w-7xl mx-auto px-5 md:px-10 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
                        {[
                            { value: '24+',   label: 'Clientes activos' },
                            { value: '4.2×',  label: 'ROAS promedio' },
                            { value: '$12M+', label: 'Inversión gestionada / mes' },
                            { value: '−38%',  label: 'Reducción de CPA promedio' },
                        ].map(s => (
                            <div key={s.label} className="text-center">
                                <p className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif', color: T.blue }}>{s.value}</p>
                                <p className="text-xs font-medium" style={{ color: T.gray }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ PROPUESTA ══════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 px-5 md:px-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <SectionLabel>Por qué AgenciaSi</SectionLabel>
                            <H2 className="text-4xl md:text-5xl mb-6">
                                El fin de la gestión ciega.
                            </H2>
                            <p className="text-base leading-relaxed mb-10" style={{ color: T.gray }}>
                                La mayoría de agencias gestiona campañas "por ti" y te entrega reportes que nadie entiende. Nosotros trabajamos <strong style={{ color: T.black }}>contigo</strong>, con cuentas propias, métricas transparentes y foco en rentabilidad neta.
                            </p>

                            <div className="space-y-5">
                                {[
                                    { icon: Users,    title: 'Acompañamiento 1:1',   desc: 'Un estratega dedicado a tu cuenta. Sin intermediarios ni cuentas cuentos.' },
                                    { icon: BarChart3, title: 'Transparencia total',  desc: 'Acceso completo a métricas, cuentas y decisiones en tiempo real.' },
                                    { icon: Zap,      title: 'Integración con IA',   desc: 'Automatizaciones y análisis de datos para optimizar cada peso invertido.' },
                                    { icon: TrendingUp, title: 'Foco en ROI',        desc: 'Medimos el resultado en ventas reales, no en likes ni alcance.' },
                                ].map(({ icon: Icon, title, desc }) => (
                                    <div key={title} className="flex gap-4 p-4 rounded-xl transition-all hover:bg-gray-50">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                            style={{ background: T.blue + '12' }}>
                                            <Icon size={18} style={{ color: T.blue }} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm mb-0.5" style={{ color: T.black }}>{title}</p>
                                            <p className="text-sm leading-relaxed" style={{ color: T.gray }}>{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Feature card */}
                        <div className="rounded-2xl overflow-hidden" style={{ background: T.blue }}>
                            <div className="p-8 md:p-10">
                                <p className="text-[11px] font-semibold uppercase tracking-widest mb-4 opacity-60" style={{ color: '#fff' }}>
                                    Metodología SI
                                </p>
                                <H2 className="text-3xl md:text-4xl mb-4" style={{ color: '#fff' }}>
                                    Publicidad que convierte. <em className="font-normal">Sin humo.</em>
                                </H2>
                                <p className="text-sm leading-relaxed mb-7" style={{ color: 'rgba(255,255,255,0.65)' }}>
                                    Acompañamiento 1:1 con foco en métricas reales, control total de cuentas y resultados medibles desde el primer mes.
                                </p>

                                {/* Mini stats */}
                                <div className="grid grid-cols-3 gap-3 mb-7">
                                    {[
                                        { val: '4.2×', lbl: 'ROAS promedio' },
                                        { val: '−38%', lbl: 'Reducción CPA' },
                                        { val: '24+',  lbl: 'Clientes activos' },
                                    ].map(s => (
                                        <div key={s.lbl} className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,0,0,0.2)' }}>
                                            <p className="text-2xl font-black text-white mb-0.5" style={{ fontFamily: 'Playfair Display, serif' }}>{s.val}</p>
                                            <p className="text-[10px] font-medium leading-tight" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.lbl}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {['Meta Ads', 'Google Ads', 'IA Analytics', 'Cuentas propias'].map(t => (
                                        <span key={t} className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
                                            style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="px-8 md:px-10 py-5 flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.25)' }}>
                                <span className="text-sm font-semibold opacity-70 text-white">Diagnóstico gratuito</span>
                                <a href="#contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold"
                                    style={{ background: '#fff', color: T.blue }}>
                                    Agendar <ArrowRight size={14} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ METODOLOGÍA ════════════════════════════════════════════════ */}
            <section id="methodology" className="py-24 md:py-32 px-5 md:px-10" style={{ background: T.light }}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <SectionLabel>Cómo trabajamos</SectionLabel>
                        <H2 className="text-4xl md:text-5xl">El proceso en 4 pasos.</H2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { n: '01', title: 'Diagnóstico',   desc: 'Analizamos tu negocio, competencia y métricas actuales sin costo.' },
                            { n: '02', title: 'Estrategia',    desc: 'Diseñamos un plan de campañas con objetivos, presupuesto y KPIs claros.' },
                            { n: '03', title: 'Implementación', desc: 'Lanzamos campañas, integramos IA y optimizamos en tiempo real.' },
                            { n: '04', title: 'Escala',        desc: 'Con datos validados, escalamos lo que funciona y eliminamos lo que no.' },
                        ].map(step => (
                            <div key={step.n} className="relative p-8 rounded-2xl bg-white" style={{ border: `1px solid ${T.border}` }}>
                                <span className="text-6xl font-black opacity-[0.06] absolute top-6 right-6 select-none"
                                    style={{ fontFamily: 'Playfair Display, serif', color: T.blue }}>
                                    {step.n}
                                </span>
                                <span className="text-[13px] font-bold mb-4 block" style={{ color: T.blue }}>{step.n}</span>
                                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: T.black }}>
                                    {step.title}
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: T.gray }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ SERVICIOS ══════════════════════════════════════════════════ */}
            <section id="services" className="py-24 md:py-32 px-5 md:px-10 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                        <div>
                            <SectionLabel>Ecosistema digital</SectionLabel>
                            <H2 className="text-4xl md:text-5xl max-w-xl">
                                Todo lo que tu empresa necesita para crecer.
                            </H2>
                        </div>
                        <Link to="/digitalizacion-express"
                            className="inline-flex items-center gap-2 text-sm font-bold transition-colors hover:opacity-70 shrink-0"
                            style={{ color: T.blue }}>
                            Ver Web Express <ArrowRight size={15} />
                        </Link>
                    </div>

                    {/* Featured service */}
                    <div className="mb-6 p-8 md:p-10 rounded-2xl flex flex-col md:flex-row gap-8 items-center"
                        style={{ background: T.blue + '08', border: `1.5px solid ${T.blue}25` }}>
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                            style={{ background: T.blue }}>
                            <TrendingUp size={26} color="#fff" />
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: T.black }}>Meta & Google Ads con IA</h3>
                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: T.blue, color: '#fff' }}>Servicio principal</span>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: T.gray }}>
                                Gestión estratégica de campañas pagas con acompañamiento 1:1, integración de inteligencia artificial y foco absoluto en ROAS y rentabilidad neta.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <PrimaryBtn href="#contact">Solicitar info</PrimaryBtn>
                        </div>
                    </div>

                    {/* Service grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            { icon: Code2,        title: 'Desarrollo Web',      desc: 'Sitios profesionales, rápidos y orientados a conversión. Sin templates.',    price: 'Desde $249.990',   color: '#7F77DD' },
                            { icon: Globe,        title: 'WordPress Pro',        desc: 'SEO técnico avanzado, plugins a medida y velocidad optimizada.',             price: 'Desde $399.990',   color: '#7F77DD' },
                            { icon: BrainCircuit, title: 'Ecosistemas IA',       desc: 'Automatizaciones, CRM y flujos con IA para acelerar ventas.',               price: 'Cotizar',          color: T.blue   },
                            { icon: Palette,      title: 'Branding Autoridad',   desc: 'Identidad corporativa para posicionarte y atraer alto ticket.',             price: 'Cotizar',          color: T.blue   },
                            { icon: ShoppingCart, title: 'E-commerce',           desc: 'Tiendas con Webpay y Mercado Pago. Arquitectura orientada a conversión.',   price: 'Desde $399.990',   color: '#5DCAA5' },
                            { icon: Sparkles,     title: 'Gestión de RRSS',      desc: 'Estrategia de contenidos, pauta y comunidad para crecer en redes.',         price: 'Cotizar',          color: '#7EB8E8' },
                            { icon: Camera,       title: 'Studio Fotográfico',   desc: 'Arriendo por hora. Producción de contenido de alto nivel.',                 price: 'Desde $25.000/hr', color: '#F0997B', region: true },
                            { icon: Mic,          title: 'Studio Podcast',       desc: 'Estudio profesional en San Clemente. Grabación y edición completa.',        price: 'Desde $35.000/hr', color: '#E24B4A', region: true },
                            { icon: Video,        title: 'Producción Audiovisual', desc: 'Videos corporativos, reels y activos creativos para tus campañas.',       price: 'Cotizar',          color: '#CF9FCA' },
                        ].map((s, i) => (
                            <div key={i} className="p-6 rounded-xl flex flex-col group transition-all duration-200 hover:shadow-md cursor-default"
                                style={{ border: `1px solid ${T.border}` }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = s.color + '80'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
                                <div className="flex items-start justify-between mb-5">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.color + '12' }}>
                                        <s.icon size={20} style={{ color: s.color }} />
                                    </div>
                                    {s.region && (
                                        <span className="text-[10px] font-semibold px-2 py-1 rounded-full"
                                            style={{ background: T.light, color: T.gray }}>
                                            Región del Maule
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-[15px] font-bold mb-2" style={{ color: T.black, fontFamily: 'Playfair Display, serif' }}>
                                    {s.title}
                                </h4>
                                <p className="text-[13px] leading-relaxed flex-grow mb-5" style={{ color: T.gray }}>
                                    {s.desc}
                                </p>
                                <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${T.border}` }}>
                                    <span className="text-[12px] font-bold" style={{ color: s.color }}>{s.price}</span>
                                    <a href="#contact" className="text-[12px] font-bold transition-opacity hover:opacity-50"
                                        style={{ color: T.blue }}>
                                        Solicitar →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ CASOS ══════════════════════════════════════════════════════ */}
            <section id="cases" className="py-24 md:py-32 px-5 md:px-10" style={{ background: T.light }}>
                <div className="max-w-7xl mx-auto">
                    <SectionLabel>Resultados reales</SectionLabel>
                    <H2 className="text-4xl md:text-5xl mb-4">Casos que respaldan el método.</H2>
                    <p className="text-base mb-14 max-w-xl" style={{ color: T.gray }}>
                        Números reales de clientes reales. Sin casos hipotéticos ni datos inflados.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {[
                            {
                                cat: 'Turismo & Hospitality',
                                name: 'Complejo Turístico Fernandois',
                                result: '+140%', resultLabel: 'en reservas directas',
                                quote: 'Segmentación y optimización de campañas para capturar demanda nacional y reducir dependencia de OTAs.',
                                metrics: [{ k: 'ROAS', v: '5.1×' }, { k: 'CPC', v: '−42%' }, { k: 'Período', v: '4 meses' }],
                                tags: ['Meta Ads', 'Google Ads', 'Estrategia SI'],
                                color: T.blue,
                            },
                            {
                                cat: 'Wellness & Salud',
                                name: 'Pilates Magnolia',
                                result: '−45%', resultLabel: 'reducción de CPA',
                                quote: 'Optimización de campañas y mejora del embudo con foco en calidad de lead y conversión real.',
                                metrics: [{ k: 'Leads', v: '+120%' }, { k: 'CPA', v: '−45%' }, { k: 'Período', v: '3 meses' }],
                                tags: ['Meta Ads', 'Funnel optimizado'],
                                color: '#5DCAA5',
                            },
                        ].map(c => (
                            <div key={c.name} className="bg-white rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
                                {/* Top bar */}
                                <div className="h-1.5" style={{ background: c.color }} />
                                <div className="p-8 md:p-10">
                                    <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: T.gray }}>{c.cat}</p>
                                    <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: T.black }}>
                                        {c.name}
                                    </h3>

                                    {/* Big result */}
                                    <div className="flex items-end gap-3 mb-6">
                                        <span className="text-6xl font-black leading-none" style={{ fontFamily: 'Playfair Display, serif', color: c.color }}>
                                            {c.result}
                                        </span>
                                        <span className="text-sm font-medium pb-2" style={{ color: T.gray }}>{c.resultLabel}</span>
                                    </div>

                                    {/* Mini metrics */}
                                    <div className="flex gap-6 mb-6 pb-6" style={{ borderBottom: `1px solid ${T.border}` }}>
                                        {c.metrics.map(m => (
                                            <div key={m.k}>
                                                <p className="text-lg font-bold" style={{ color: T.black, fontFamily: 'Playfair Display, serif' }}>{m.v}</p>
                                                <p className="text-[11px] font-medium" style={{ color: T.gray }}>{m.k}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <p className="text-sm leading-relaxed mb-6 italic" style={{ color: T.gray }}>
                                        "{c.quote}"
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {c.tags.map(t => <Label key={t} color={c.color}>{t}</Label>)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <p className="text-sm mb-4" style={{ color: T.gray }}>¿Quieres resultados similares para tu empresa?</p>
                        <PrimaryBtn href="#contact">Solicitar diagnóstico gratuito</PrimaryBtn>
                    </div>
                </div>
            </section>

            {/* ═══ SEO DIAGNÓSTICO CTA ════════════════════════════════════════ */}
            <section style={{ background: T.black }}>
                <div className="max-w-7xl mx-auto px-5 md:px-10 py-20 md:py-28">
                    <div className="grid lg:grid-cols-5 gap-12 items-center">
                        <div className="lg:col-span-3">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-7"
                                style={{ background: T.blue + '20', border: `1px solid ${T.blue}35` }}>
                                <Search size={13} style={{ color: T.blue }} />
                                <span className="text-[11px] font-bold tracking-wide" style={{ color: T.blue }}>Diagnóstico SEO Gratuito</span>
                            </div>
                            <h2 className="font-bold leading-[1.1] text-white mb-5"
                                style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
                                ¿Tu sitio aparece cuando tus clientes{' '}
                                <em className="font-normal" style={{ color: T.blue }}>te buscan en Google?</em>
                            </h2>
                            <p className="text-base leading-relaxed mb-8" style={{ color: '#888' }}>
                                Analizamos tu posicionamiento orgánico actual, identificamos lo que estás perdiendo y te entregamos un plan de acción concreto. Sin costo, sin compromiso.
                            </p>
                            <ul className="space-y-3.5 mb-10">
                                {[
                                    { icon: Search,    text: 'Análisis de posicionamiento orgánico actual' },
                                    { icon: BarChart3, text: 'Palabras clave con mayor potencial para tu industria' },
                                    { icon: Zap,       text: 'Plan de acción personalizado y accionable' },
                                    { icon: Shield,    text: '100% gratuito, sin compromiso de contratación' },
                                ].map(({ icon: Icon, text }) => (
                                    <li key={text} className="flex items-center gap-3 text-sm" style={{ color: '#999' }}>
                                        <Icon size={15} style={{ color: T.blue, flexShrink: 0 }} />
                                        {text}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <PrimaryBtn onClick={() => setShowSeoModal(true)} className="px-8 py-4 text-base">
                                    <Search size={15} /> Quiero mi diagnóstico gratuito
                                </PrimaryBtn>
                                <p className="text-xs" style={{ color: '#555' }}>Sin spam · Respuesta en &lt; 24 horas</p>
                            </div>
                        </div>

                        {/* Reporte "bloqueado" */}
                        <div className="hidden lg:block lg:col-span-2">
                            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #1c1c1c' }}>
                                <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#111' }}>
                                    <div className="flex items-center gap-2">
                                        <Search size={13} style={{ color: T.blue }} />
                                        <span className="text-xs font-semibold" style={{ color: '#555' }}>Reporte SEO</span>
                                    </div>
                                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: T.blue + '25', color: T.blue }}>Gratuito</span>
                                </div>
                                <div className="p-5" style={{ background: '#0d0d0d' }}>
                                    {[
                                        'Posición promedio en Google',
                                        'Palabras clave indexadas',
                                        'Errores técnicos detectados',
                                        'Oportunidades de crecimiento',
                                        'Score de autoridad de dominio',
                                        'Análisis vs. competidores',
                                    ].map((item) => (
                                        <div key={item} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid #181818' }}>
                                            <span className="text-xs" style={{ color: '#555' }}>{item}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-14 h-1.5 rounded-full" style={{ background: '#1a1a1a' }} />
                                                <span className="text-[11px] font-bold" style={{ color: '#333' }}>—</span>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => setShowSeoModal(true)}
                                        className="w-full mt-4 py-3 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
                                        style={{ background: T.blue, color: '#fff' }}>
                                        Desbloquear mi reporte →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ PARA QUIÉN ═════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 px-5 md:px-10 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <SectionLabel>Para quién trabajamos</SectionLabel>
                            <H2 className="text-4xl md:text-5xl mb-6">Empresas listas para escalar.</H2>
                            <p className="text-base leading-relaxed mb-10" style={{ color: T.gray }}>
                                No somos para todos. Trabajamos con empresas que valoran la transparencia, exigen datos reales y tienen voluntad de crecer de forma sostenida.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Ventas B2B y servicios de alto ticket',
                                    'Inmobiliario e inversión',
                                    'Salud y clínicas privadas',
                                    'Consultoría y servicios profesionales',
                                    'E-commerce con foco en rentabilidad',
                                    'Cualquier empresa que quiera crecer con datos',
                                ].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-[15px]" style={{ color: T.black }}>
                                        <CheckCircle2 size={17} style={{ color: T.blue, flexShrink: 0 }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-10 flex items-center gap-3 p-4 rounded-xl" style={{ background: T.light, border: `1px solid ${T.border}` }}>
                                <MapPin size={17} style={{ color: T.blue, flexShrink: 0 }} />
                                <p className="text-sm font-semibold" style={{ color: T.black }}>
                                    Cobertura: <span style={{ color: T.blue }}>Chile · Latinoamérica · Mundo hispanohablante · English available</span>
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { value: '$500K',  label: 'Inversión mínima recomendada', sub: 'mensual en ads' },
                                { value: '1:1',    label: 'Modelo de trabajo', sub: 'un estratega, una cuenta' },
                                { value: '< 12h',  label: 'Tiempo de respuesta', sub: 'garantizado' },
                                { value: '100%',   label: 'Transparencia', sub: 'acceso total a datos' },
                            ].map(s => (
                                <div key={s.label} className="p-6 rounded-2xl" style={{ background: T.light, border: `1px solid ${T.border}` }}>
                                    <p className="text-3xl font-black mb-1" style={{ fontFamily: 'Playfair Display, serif', color: T.blue }}>{s.value}</p>
                                    <p className="text-[12px] font-bold mb-0.5" style={{ color: T.black }}>{s.label}</p>
                                    <p className="text-[11px]" style={{ color: T.gray }}>{s.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ EQUIPO ══════════════════════════════════════════════════════ */}
            <section id="about" className="py-24 md:py-32 px-5 md:px-10" style={{ background: T.light }}>
                <div className="max-w-7xl mx-auto">
                    <SectionLabel>El equipo</SectionLabel>
                    <H2 className="text-4xl md:text-5xl mb-4">Detrás de AgenciaSi.</H2>
                    <p className="text-base mb-14 max-w-xl" style={{ color: T.gray }}>
                        Especialistas en estrategia digital, creatividad y tecnología trabajando en conjunto por tus resultados.
                    </p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { name: 'Martín Nicolás Valdés', role: 'Founder & Digital Growth Strategist', icon: TrendingUp, desc: 'Diseña la estrategia de crecimiento, integra tecnología y construye sistemas de adquisición predecibles para empresas que buscan escalar.' },
                            { name: 'Laura Rodríguez', role: 'Creative Director & Ads Strategist', icon: Sparkles, desc: 'Dirige la narrativa visual y la optimización creativa para convertir campañas en motores sostenibles de generación de clientes.' },
                            { name: 'Fabio Contreras', role: 'Head of Audiovisual & Content', icon: Video, desc: 'Produce activos audiovisuales de alto impacto diseñados para captar atención, fortalecer marca y acelerar la conversión.' },
                        ].map((p, i) => (
                            <div key={i} className="bg-white rounded-2xl p-8 group hover:shadow-md transition-all" style={{ border: `1px solid ${T.border}` }}>
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors"
                                    style={{ background: T.blue + '12' }}>
                                    <p.icon size={22} style={{ color: T.blue }} />
                                </div>
                                <p className="text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: T.blue }}>{p.role}</p>
                                <h4 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: T.black }}>{p.name}</h4>
                                <p className="text-sm leading-relaxed" style={{ color: T.gray }}>{p.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Vision quote */}
                    <div className="mt-10 p-10 md:p-14 rounded-2xl text-center" style={{ background: T.blue }}>
                        <p className="text-2xl md:text-3xl font-bold leading-relaxed text-white max-w-3xl mx-auto"
                            style={{ fontFamily: 'Playfair Display, serif' }}>
                            "Eliminar la fricción entre tecnología de vanguardia y resultados comerciales reales."
                        </p>
                        <p className="text-sm mt-4 opacity-60 text-white">— Visión AgenciaSi</p>
                    </div>
                </div>
            </section>

            {/* ═══ CONTACTO ════════════════════════════════════════════════════ */}
            <section id="contact" className="py-24 md:py-32 px-5 md:px-10 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        <div>
                            <SectionLabel>Hablemos</SectionLabel>
                            <H2 className="text-4xl md:text-6xl mb-6">
                                Diagnóstico gratuito, sin compromiso.
                            </H2>
                            <p className="text-base leading-relaxed mb-10" style={{ color: T.gray }}>
                                No es una reunión de ventas. Analizamos tu situación actual y te decimos honestamente si podemos ayudarte y cómo.
                            </p>

                            <div className="space-y-4 mb-10">
                                {[
                                    { href: 'https://wa.me/56932930812', icon: MessageSquare, label: 'WhatsApp directo', val: '+56 9 3293 0812', cta: true },
                                    { href: 'mailto:contacto@agenciasi.cl', icon: Mail, label: 'Correo electrónico', val: 'contacto@agenciasi.cl', cta: false },
                                ].map(({ href, icon: Icon, label, val, cta }) => (
                                    <a key={val} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-5 rounded-xl bg-white hover:shadow-md transition-all group"
                                        style={{ border: `1.5px solid ${cta ? T.blue : T.border}` }}>
                                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                            style={{ background: T.blue + '12' }}>
                                            <Icon size={19} style={{ color: T.blue }} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[11px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: T.gray }}>{label}</p>
                                            <p className="text-base font-bold" style={{ fontFamily: 'Playfair Display, serif', color: T.black }}>{val}</p>
                                        </div>
                                        <ArrowRight size={16} style={{ color: T.blue }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                ))}
                            </div>

                            <div className="p-5 rounded-xl flex items-center gap-3" style={{ background: T.light, border: `1px solid ${T.border}` }}>
                                <MapPin size={16} style={{ color: T.blue, flexShrink: 0 }} />
                                <p className="text-sm" style={{ color: T.gray }}>
                                    San Clemente, Maule — Cobertura en <strong style={{ color: T.black }}>todo Chile y Latinoamérica</strong>
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="rounded-2xl p-8 md:p-12 shadow-sm" style={{ border: `1.5px solid ${T.border}` }}>
                            <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: T.black }}>
                                Solicitar cotización gratuita
                            </h3>
                            <p className="text-sm mb-8" style={{ color: T.gray }}>Respuesta garantizada en menos de 12 horas.</p>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {[
                                    { label: 'Nombre completo', key: 'name', type: 'text', placeholder: 'Juan Pérez', required: true },
                                    { label: 'Empresa o sitio web', key: 'company', type: 'text', placeholder: 'tuempresa.cl', required: false },
                                ].map(({ label, key, type, placeholder, required }) => (
                                    <div key={key}>
                                        <label className="text-[11px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.gray }}>
                                            {label}
                                        </label>
                                        <input type={type} required={required} placeholder={placeholder}
                                            className="w-full py-3 bg-transparent text-base focus:outline-none transition-colors placeholder:opacity-30"
                                            style={{ borderBottom: `2px solid ${T.border}`, color: T.black }}
                                            onFocus={e => e.target.style.borderBottomColor = T.blue}
                                            onBlur={e => e.target.style.borderBottomColor = T.border}
                                            value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                                    </div>
                                ))}

                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.gray }}>
                                        Inversión mensual estimada en Ads
                                    </label>
                                    <select className="w-full py-3 bg-transparent text-base focus:outline-none cursor-pointer"
                                        style={{ borderBottom: `2px solid ${T.border}`, color: T.black }}
                                        value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}>
                                        <option>$500.000 - $1.500.000 CLP</option>
                                        <option>$1.500.000 - $5.000.000 CLP</option>
                                        <option>$5.000.000+ CLP</option>
                                    </select>
                                </div>

                                <PrimaryBtn onClick={handleSubmit} className="w-full py-4 text-base mt-2">
                                    {status === 'sending' ? 'Enviando...' : 'Solicitar cotización gratuita'}
                                </PrimaryBtn>

                                {status === 'success' && (
                                    <div className="flex items-center gap-2 text-sm font-semibold p-4 rounded-xl" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                                        <CheckCircle2 size={16} /> ¡Mensaje enviado! Te contactamos pronto.
                                    </div>
                                )}
                                {status === 'error' && (
                                    <p className="text-sm font-semibold text-center" style={{ color: '#ef4444' }}>
                                        Error al enviar. Escríbenos directamente al WhatsApp.
                                    </p>
                                )}

                                <p className="text-[11px] text-center font-medium" style={{ color: '#bbb' }}>
                                    Sin spam · Respuesta en &lt; 12 horas · www.agenciasi.cl
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

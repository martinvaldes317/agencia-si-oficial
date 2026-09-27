import { useState, useEffect, useCallback } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
    Menu, X, BrainCircuit, Code2, Globe, 
    TrendingUp, Sparkles, MapPin, MessageSquare, Mail,
    ArrowRight, LogIn, ShoppingCart, CheckCircle2,
    BarChart3, Zap, Shield, ExternalLink
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
        { label: 'Proyectos', id: 'cases' },
        { label: 'Servicios', id: 'services' },
        { label: 'Metodología', id: 'methodology' },
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
                        <PrimaryBtn href="#contact" small>Agenda una conversación</PrimaryBtn>
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
                    <div className="pt-6 flex flex-col gap-3">
                        <Link to="/portal"
                            className="flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm border-2"
                            style={{ borderColor: T.blue, color: T.blue }}
                            onClick={() => setOpen(false)}>
                            <LogIn size={15} /> Portal clientes
                        </Link>
                        <PrimaryBtn href="#contact" className="w-full py-4" onClick={() => setOpen(false)}>
                            Agenda una conversación
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
                        Sistemas a medida, plataformas web e IA aplicada para empresas que quieren crecer. Web Express y campañas de Meta y Google Ads como complemento.
                    </p>
                    <p className="text-xs" style={{ color: '#444', fontFamily: 'Poppins, sans-serif' }}>
                        San Clemente, Región del Maule — Chile<br />
                        Cobertura: todo Chile, de forma remota
                    </p>
                </div>
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest mb-5" style={{ color: T.blue, fontFamily: 'Poppins, sans-serif' }}>Servicios</p>
                    <ul className="space-y-3 text-sm" style={{ color: '#666', fontFamily: 'Poppins, sans-serif' }}>
                        {[
                            { label: 'Sistemas a medida', href: '#services' },
                            { label: 'Ecosistemas IA', href: '#services' },
                            { label: 'E-commerce', href: '#services' },
                            { label: 'Web Express', href: '/sitio-web' },
                            { label: 'Meta & Google Ads', href: '#services' },
                            { label: 'Publicidad Talca ↗', href: 'https://publicidadtalca.cl' },
                        ].map(s => (
                            <li key={s.label}>
                                {s.href.startsWith('/')
                                    ? <Link to={s.href} className="hover:text-white transition-colors">{s.label}</Link>
                                    : <a href={s.href} {...(s.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="hover:text-white transition-colors">{s.label}</a>}
                            </li>
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
                        <PrimaryBtn href="#contact" small>Agenda una conversación</PrimaryBtn>
                    </div>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <p className="text-xs" style={{ color: '#333', fontFamily: 'Poppins, sans-serif' }}>
                    © 2026 AgenciaSi — Diseño y desarrollo integral
                </p>
                <div className="flex items-center gap-5 flex-wrap justify-center">
                    <Link to="/terminos-condiciones" className="text-xs hover:text-white transition-colors" style={{ color: '#333', fontFamily: 'Poppins, sans-serif' }}>
                        Términos y Condiciones
                    </Link>
                    <Link to="/politica-privacidad" className="text-xs hover:text-white transition-colors" style={{ color: '#333', fontFamily: 'Poppins, sans-serif' }}>
                        Privacidad
                    </Link>
                    <Link to="/portal" className="text-xs hover:text-white transition-colors" style={{ color: '#333', fontFamily: 'Poppins, sans-serif' }}>
                        Portal clientes →
                    </Link>
                </div>
            </div>
        </div>
    </footer>
)

const PROJECT_TYPES = [
    'Un sistema de gestión a medida',
    'Una plataforma web (usuarios, cursos, membresías)',
    'Una tienda online (e-commerce)',
    'Automatización o integración con IA',
    'Un sitio web simple',
    'Otro / aún no lo tengo claro',
]
const BUDGETS = [
    'Aún no lo sé',
    'Menos de $1.000.000 CLP',
    '$1.000.000 – $3.500.000 CLP',
    '$3.500.000 – $7.000.000 CLP',
    'Más de $7.000.000 CLP',
]
const FORM_INITIAL = { name: '', company: '', phone: '', email: '', message: '', projectType: PROJECT_TYPES[0], budget: BUDGETS[0] }

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
    const [form, setForm] = useState(FORM_INITIAL)
    const [status, setStatus] = useState('')
    const [showWaTooltip, setShowWaTooltip] = useState(false)

    useEffect(() => {
        const show = setTimeout(() => setShowWaTooltip(true), 5000)
        const hide = setTimeout(() => setShowWaTooltip(false), 15000)
        return () => { clearTimeout(show); clearTimeout(hide) }
    }, [])
    const { executeRecaptcha } = useGoogleReCaptcha()

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        if (!executeRecaptcha) return
        const token = await executeRecaptcha('contact_form')
        setStatus('sending')
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, message: `Tipo de proyecto: ${form.projectType}${form.message ? `\n\n${form.message}` : ''}`, recaptchaToken: token })
            })
            setStatus(res.ok ? 'success' : 'error')
            if (res.ok) setForm(FORM_INITIAL)
        } catch { setStatus('error') }
    }, [executeRecaptcha, form])

    return (
        <div className="antialiased overflow-x-hidden" style={{ background: T.white, color: T.black, fontFamily: 'Poppins, sans-serif' }}>
            {/* WhatsApp floating button */}
            <div className="fixed bottom-8 left-6 z-50 flex items-center gap-3" style={{ pointerEvents: 'none' }}>
                {/* Button */}
                <a href="https://wa.me/56932930812?text=Hola%2C%20me%20interesa%20saber%20m%C3%A1s%20sobre%20sus%20servicios"
                    target="_blank" rel="noopener noreferrer"
                    style={{ pointerEvents: 'auto', flexShrink: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#25D366', opacity: 0.25, animation: 'waPulse 2.5s ease-out infinite' }} />
                    <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#25D366', opacity: 0.15, animation: 'waPulse 2.5s ease-out infinite 0.6s' }} />
                    <span style={{
                        width: 56, height: 56, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #25D366, #1da851)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(37,211,102,0.45)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        position: 'relative',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(37,211,102,0.6)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,0.45)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="white">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.856L.057 23.215a.75.75 0 0 0 .916.916l5.36-1.477A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.502-5.241-1.381l-.375-.217-3.884 1.07 1.07-3.884-.217-.375A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        </svg>
                    </span>
                </a>

                {/* Tooltip — al lado derecho del botón */}
                <div style={{
                    pointerEvents: showWaTooltip ? 'auto' : 'none',
                    opacity: showWaTooltip ? 1 : 0,
                    transform: showWaTooltip ? 'translateX(0) scale(1)' : 'translateX(-8px) scale(0.96)',
                    transition: 'opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.45s cubic-bezier(0.16,1,0.3,1)',
                    background: '#fff',
                    border: `1.5px solid ${T.border}`,
                    borderRadius: '14px',
                    padding: '10px 16px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                    whiteSpace: 'nowrap',
                    position: 'relative',
                }}>
                    {/* Arrow izquierda */}
                    <span style={{
                        position: 'absolute', left: -7, top: '50%', transform: 'translateY(-50%) rotate(45deg)',
                        width: 12, height: 12, background: '#fff',
                        border: `1.5px solid ${T.border}`, borderRight: 'none', borderTop: 'none',
                    }} />
                    <p style={{ fontSize: '13px', fontWeight: 700, color: T.black, margin: 0 }}>¿Hablamos?</p>
                    <p style={{ fontSize: '12px', color: T.gray, margin: '2px 0 0', fontWeight: 400 }}>Respuesta inmediata</p>
                </div>
            </div>
            <Helmet>
                <title>AgenciaSI | Desarrollo Web, Apps y Sistemas a Medida en Chile</title>
                <meta name="description" content="Desarrollamos sitios web, aplicaciones y sistemas a medida en Chile. React, Node.js, e-commerce, integraciones con IA y automatizaciones. Plazos claros y resultados medibles." />
                <meta name="keywords" content="desarrollo web chile, aplicaciones web chile, sistemas a medida chile, empresa desarrollo software chile, desarrollo react chile, tienda online chile, automatizacion IA chile, agencia digital chile, web express, diseño web profesional" />
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
                                <Label>Sistemas a Medida</Label>
                                <Label>Plataformas Web</Label>
                                <Label>Software de Gestión</Label>
                                <Label>IA</Label>
                            </div>

                            <h1 className="font-bold leading-[1.05] mb-7"
                                style={{ fontFamily: 'Playfair Display, serif', color: T.black, fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}>
                                Sistemas a medida{' '}
                                <em className="font-normal" style={{ color: T.blue }}>para hacer crecer tu empresa.</em>
                            </h1>

                            <p className="text-lg leading-relaxed mb-10 max-w-xl" style={{ color: T.gray }}>
                                Plataformas, sistemas de gestión y aplicaciones a medida que automatizan procesos y escalan tu operación.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 mb-12">
                                <PrimaryBtn href="#contact" className="text-base px-8 py-4">
                                    Agenda una conversación <ArrowRight size={17} />
                                </PrimaryBtn>
                                <OutlineBtn href="#cases">Ver proyectos</OutlineBtn>
                            </div>

                            <p className="text-[13px] mb-10 -mt-6" style={{ color: T.gray, fontFamily: 'Poppins, sans-serif' }}>
                                ¿Solo necesitas una página web simple?{' '}
                                <Link to="/sitio-web" className="font-bold underline underline-offset-2" style={{ color: T.blue }}>Web Express desde $69.990 + IVA →</Link>
                            </p>

                            {/* Trust row */}
                            <div className="flex flex-wrap items-center gap-5">
                                {[
                                    { icon: CheckCircle2, text: 'Código propio' },
                                    { icon: Shield,       text: 'Proveedor del Estado' },
                                    { icon: BarChart3,    text: '60+ proyectos entregados' },
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
                                    <span className="text-white font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>AgenciaSi en cifras</span>
                                </div>
                                {/* Stats grid */}
                                <div className="grid grid-cols-2 gap-px bg-gray-100">
                                    {[
                                        { label: 'Proyectos entregados', value: '60+',   sub: 'sitios, sistemas y apps', up: true },
                                        { label: 'Proveedor del Estado', value: 'ChileCompra', sub: 'licitaciones ganadas',       up: true },
                                        { label: 'Proyectos activos',    value: '60+',   sub: 'sitios, sistemas y plataformas',        up: null },
                                        { label: 'Tecnologías',          value: '12+',   sub: 'React, Node, IA y más',   up: null },
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

            {/* ═══ PROYECTOS ══════════════════════════════════════════════════ */}
            <section id="cases" className="py-24 md:py-32 px-5 md:px-10 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-14">
                        <SectionLabel>Proyectos</SectionLabel>
                        <H2 className="text-4xl md:text-5xl max-w-2xl">Proyectos reales, funcionando en Chile.</H2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            { name: 'Espacio CEA', url: 'https://espaciocea.com', tag: 'Plataforma web', logo: '/clientes/espacio-cea.svg', desc: 'Plataforma de un centro de intervención virtual especializado en Análisis Aplicado de la Conducta, con capacitaciones y acceso para usuarios.' },
                            { name: 'MOVERSER', url: 'https://moverserstudio.com', tag: 'Plataforma de membresía', desc: 'Biblioteca de clases online de Pilates, movilidad, flexibilidad y danza, con membresía de acceso ilimitado.' },
                            { name: 'NowPOS', url: 'https://nowpos.cl', tag: 'Sistema de caja (POS)', logo: '/clientes/now-pos.png', desc: 'Sistema POS para almacenes y minimarkets: lector de código de barras, control de inventario, cierre de caja y modo offline.' },
                            { name: 'Consonancia', url: 'https://consonancia.cl', tag: 'Software para psicólogos', desc: 'Solución digital para psicólogos, pensada para el manejo de historiales clínicos.' },
                            { name: 'CFT Araucanía', url: 'https://cftaraucania.cl', tag: 'Sitio institucional', logo: '/clientes/cft-araucania.svg', desc: 'Sitio institucional de un centro de formación técnica: proyecto educativo, apoyo al estudiante y transparencia activa.' },
                            { name: 'Publicidad Talca', url: 'https://publicidadtalca.cl', tag: 'Catálogo y sitio comercial', desc: 'Sitio de merchandising y publicidad para empresas de todo Chile, con catálogo de productos.' },
                        ].map(c => (
                            <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer"
                                className="group p-6 rounded-2xl flex flex-col transition-all hover:shadow-lg hover:-translate-y-0.5"
                                style={{ border: `1px solid ${T.border}` }}>
                                <div className="h-12 mb-5 flex items-center">
                                    {c.logo
                                        ? <img src={c.logo} alt={c.name} className="max-h-10 max-w-[150px] object-contain" />
                                        : <span className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: T.blue }}>{c.name}</span>}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: T.blue, fontFamily: 'Poppins, sans-serif' }}>{c.tag}</span>
                                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: T.black }}>{c.name}</h3>
                                <p className="text-[13px] leading-relaxed flex-grow mb-5" style={{ color: T.gray }}>{c.desc}</p>
                                <span className="text-[12px] font-bold inline-flex items-center gap-1.5" style={{ color: T.blue }}>
                                    Ver sitio <ExternalLink size={12} />
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ STATS BAR ══════════════════════════════════════════════════ */}
            <div className="border-y" style={{ borderColor: T.border, background: T.light }}>
                <div className="max-w-7xl mx-auto px-5 md:px-10 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
                        {[
                            { value: '60+',    label: 'Proyectos entregados' },
                            { value: 'ChileCompra',  label: 'Proveedor del Estado' },
                            { value: '60+',    label: 'Proyectos activos' },
                            { value: '100%',   label: 'Código propio, sin templates' },
                        ].map(s => (
                            <div key={s.label} className="text-center">
                                <p className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif', color: T.blue }}>{s.value}</p>
                                <p className="text-xs font-medium" style={{ color: T.gray }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ DIGITALIZANDO CHILE + PROVEEDOR ESTADO ═════════════════════ */}
            <section style={{ background: 'linear-gradient(135deg, #1212CC 0%, #2D2BB5 50%, #1A4FC4 100%)', padding: '60px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -80, left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -60, right: '8%', width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
                    <div style={{ fontSize: 'clamp(38px, 6vw, 72px)', fontWeight: 900, color: '#FFFFFF', letterSpacing: -2, lineHeight: 1, marginBottom: 12 }}>
                        #DigitalizandoChile 🇨🇱
                    </div>
                    <p style={{ fontSize: 'clamp(14px, 1.8vw, 18px)', color: 'rgba(255,255,255,0.80)', fontWeight: 500, maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.6, fontFamily: 'Poppins, sans-serif' }}>
                        Llevamos negocios chilenos al mundo digital. Con tecnología real, diseño a medida y resultados concretos.
                    </p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 12, padding: '10px 18px', marginBottom: 24 }}>
                        <img src="/proveedor-del-estado.png" alt="Proveedor del Estado ChileCompra" style={{ height: 30, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: 12, fontWeight: 800, color: '#FFFFFF', letterSpacing: .3, fontFamily: 'Poppins, sans-serif' }}>Proveedor del Estado</div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', fontFamily: 'Poppins, sans-serif' }}>Registrados en ChileCompra · MercadoPúblico</div>
                        </div>
                    </div>
                    <br />
                    <a href="#contact"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#A8FFEA', color: '#1212CC', fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 40, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.25)', fontFamily: 'Poppins, sans-serif' }}>
                        Digitaliza tu negocio ahora →
                    </a>
                </div>
            </section>

            {/* ═══ PROPUESTA ══════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 px-5 md:px-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <SectionLabel>Por qué AgenciaSi</SectionLabel>
                            <H2 className="text-4xl md:text-5xl mb-6">
                                Tu negocio merece más que un template.
                            </H2>
                            <p className="text-base leading-relaxed mb-10" style={{ color: T.gray }}>
                                La mayoría de agencias te vende un WordPress con un theme comprado. Nosotros construimos <strong style={{ color: T.black }}>desde cero</strong>: código limpio y una arquitectura pensada para la operación de tu negocio.
                            </p>

                            <div className="space-y-5">
                                {[
                                    { icon: Code2,      title: 'Desarrollo a medida',     desc: 'Cada proyecto es único. Diseñamos y construimos la solución exacta que tu negocio necesita.' },
                                    { icon: Zap,        title: 'Plazos claros',            desc: 'Acordamos el plazo por escrito antes de comenzar y nos comprometemos a cumplirlo.' },
                                    { icon: BrainCircuit, title: 'Integración con IA',     desc: 'Automatizaciones, chatbots y flujos inteligentes que reducen tu carga operativa.' },
                                    { icon: Shield,     title: 'Soporte post-lanzamiento', desc: 'Te acompañamos después de la entrega para que todo funcione desde el primer día.' },
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
                                    Código propio. <em className="font-normal">Resultados reales.</em>
                                </H2>
                                <p className="text-sm leading-relaxed mb-7" style={{ color: 'rgba(255,255,255,0.65)' }}>
                                    Diseñamos, construimos y lanzamos tu plataforma digital, y te acompañamos después de la entrega.
                                </p>

                                {/* Mini stats */}
                                <div className="grid grid-cols-3 gap-3 mb-7">
                                    {[
                                        { val: '60+',    lbl: 'Proyectos entregados' },
                                        { val: 'ChileCompra',  lbl: 'Proveedor del Estado' },
                                        { val: '60+',    lbl: 'Proyectos activos' },
                                    ].map(s => (
                                        <div key={s.lbl} className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,0,0,0.2)' }}>
                                            <p className="text-2xl font-black text-white mb-0.5" style={{ fontFamily: 'Playfair Display, serif' }}>{s.val}</p>
                                            <p className="text-[10px] font-medium leading-tight" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.lbl}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {['React', 'Node.js', 'IA integrada', 'Código propio'].map(t => (
                                        <span key={t} className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
                                            style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="px-8 md:px-10 py-5 flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.25)' }}>
                                <span className="text-sm font-semibold opacity-70 text-white">¿Tienes un proyecto en mente?</span>
                                <a href="#contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold"
                                    style={{ background: '#fff', color: T.blue }}>
                                    Conversemos <ArrowRight size={14} />
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
                        <H2 className="text-4xl md:text-5xl">Del brief al lanzamiento en 4 pasos.</H2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { n: '01', title: 'Diagnóstico',    desc: 'Entendemos tu negocio, tus clientes y qué necesita tu plataforma digital para generar resultados.' },
                            { n: '02', title: 'Diseño',         desc: 'Wireframes, arquitectura de información y diseño UI orientado a conversión. Tú apruebas cada paso.' },
                            { n: '03', title: 'Desarrollo',     desc: 'Construimos con código propio: React, Node.js e integraciones con IA, Webpay y sistemas externos.' },
                            { n: '04', title: 'Lanzamiento',    desc: 'Deploy, pruebas y entrega. Soporte post-lanzamiento incluido para que todo funcione desde día uno.' },
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
                    </div>

                    {/* Featured service */}
                    <div className="mb-6 p-8 md:p-10 rounded-2xl flex flex-col md:flex-row gap-8 items-center"
                        style={{ background: T.blue + '08', border: `1.5px solid ${T.blue}25` }}>
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                            style={{ background: T.blue }}>
                            <Code2 size={26} color="#fff" />
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: T.black }}>Sistemas y plataformas a medida</h3>
                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: T.blue, color: '#fff' }}>Servicio principal</span>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: T.gray }}>
                                Software de gestión, plataformas web y aplicaciones a medida para automatizar la operación de tu empresa. Desde el análisis hasta la puesta en marcha, con código propio y acompañamiento 1:1.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <PrimaryBtn href="#contact">Agenda una conversación</PrimaryBtn>
                        </div>
                    </div>

                    {/* Service grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            { icon: BarChart3,    title: 'Software de gestión',        desc: 'Sistemas internos y de caja a medida: inventario, historiales, reportes y control de tu operación, como NowPOS y Consonancia.', price: 'Cotizar', color: T.blue, highlight: true },
                            { icon: Globe,        title: 'Plataformas y membresías',   desc: 'Plataformas con usuarios, cursos, clases o contenido de acceso restringido, como Espacio CEA y MOVERSER.',                      price: 'Cotizar', color: T.blue },
                            { icon: Sparkles,     title: 'Ecosistemas IA',             desc: 'Automatizaciones, CRM y flujos con inteligencia artificial para vender más con menos fricción.',                                price: 'Cotizar', color: T.blue },
                            { icon: ShoppingCart, title: 'E-commerce',                 desc: 'Tiendas que venden. Integración con Webpay y Mercado Pago, arquitectura pensada para maximizar conversión.',                    price: 'Cotizar', color: '#5DCAA5' },
                            { icon: TrendingUp,   title: 'Meta & Google Ads',          desc: 'Gestión de campañas pagas con foco en ROAS y rentabilidad, como complemento de tu sistema o sitio.',                            price: 'Cotizar', color: '#7F77DD' },
                            { icon: Code2,        title: 'Web Express',                desc: 'Página web profesional lista para publicar: dominio .CL y hosting por 1 año incluidos. Ideal para partir.',                     price: 'Desde $69.990 + IVA', color: '#7F77DD', href: '/sitio-web' },
                        ].map((s, i) => (
                            <div key={i}
                                className="p-6 rounded-xl flex flex-col group transition-all duration-200 hover:shadow-md cursor-default relative"
                                style={{ border: `1px solid ${s.highlight ? s.color + '60' : T.border}`, background: s.highlight ? s.color + '06' : undefined }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = s.color + '80'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = s.highlight ? s.color + '60' : T.border}>
                                {s.highlight && (
                                    <span className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
                                        style={{ background: s.color + '15', color: s.color }}>
                                        Más solicitado
                                    </span>
                                )}
                                <div className="flex items-start justify-between mb-5">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.color + '12' }}>
                                        <s.icon size={20} style={{ color: s.color }} />
                                    </div>
                                </div>
                                <h4 className="text-[15px] font-bold mb-2" style={{ color: T.black, fontFamily: 'Playfair Display, serif' }}>
                                    {s.title}
                                </h4>
                                <p className="text-[13px] leading-relaxed flex-grow mb-5" style={{ color: T.gray }}>
                                    {s.desc}
                                </p>
                                <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${T.border}` }}>
                                    <span className="text-[12px] font-bold" style={{ color: s.color }}>{s.price}</span>
                                    {s.href
                                        ? <Link to={s.href} className="text-[12px] font-bold transition-opacity hover:opacity-50" style={{ color: T.blue }}>Ver más →</Link>
                                        : <a href="#contact" className="text-[12px] font-bold transition-opacity hover:opacity-50" style={{ color: T.blue }}>Solicitar →</a>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ PARA QUIÉN ═════════════════════════════════════════════════ */}
            <section className="py-24 md:py-32 px-5 md:px-10 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <SectionLabel>Para quién trabajamos</SectionLabel>
                            <H2 className="text-4xl md:text-5xl mb-6">Empresas que necesitan digitalizar su operación.</H2>
                            <p className="text-base leading-relaxed mb-10" style={{ color: T.gray }}>
                                Trabajamos con empresas e instituciones que quieren dejar atrás las planillas y los procesos manuales, y contar con un sistema propio que se adapte a cómo trabajan.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Negocios que necesitan un sistema de caja, inventario o gestión',
                                    'Salud, educación y servicios profesionales con plataforma propia',
                                    'Instituciones y organismos que compran a través de ChileCompra',
                                    'Emprendimientos con membresías, cursos o clases online',
                                    'Empresas con procesos manuales que quieren automatizar',
                                ].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-[15px]" style={{ color: T.black }}>
                                        <CheckCircle2 size={17} style={{ color: T.blue, flexShrink: 0 }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { value: '60+',    label: 'Proyectos entregados', sub: 'sitios, sistemas y plataformas' },
                            { value: 'ChileCompra', label: 'Proveedor del Estado', sub: 'licitaciones ganadas' },
                            { value: '1:1',    label: 'Trato directo', sub: 'con el equipo que desarrolla' },
                            { value: 'Chile',  label: 'Cobertura', sub: 'trabajo remoto en todo el país' },
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

            {/* ═══ CONTACTO ════════════════════════════════════════════════════ */}
            <section id="contact" className="py-24 md:py-32 px-5 md:px-10 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        <div>
                            <SectionLabel>Hablemos</SectionLabel>
                            <H2 className="text-4xl md:text-6xl mb-6">
                                Cuéntanos tu proyecto.
                            </H2>
                            <p className="text-base leading-relaxed mb-10" style={{ color: T.gray }}>
                                Conversemos sobre lo que necesitas. Analizamos tu caso y te decimos honestamente si podemos ayudarte y cómo. Sin compromiso.
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
                                    San Clemente, Maule — Trabajamos de forma remota en <strong style={{ color: T.black }}>todo Chile</strong>
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="rounded-2xl p-8 md:p-12 shadow-sm" style={{ border: `1.5px solid ${T.border}` }}>
                            <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: T.black }}>
                                Cuéntanos qué necesitas
                            </h3>
                            <p className="text-sm mb-8" style={{ color: T.gray }}>Te respondemos a la brevedad, por WhatsApp o correo.</p>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {[
                                    { label: 'Nombre completo *', key: 'name', type: 'text', placeholder: 'Juan Pérez', required: true },
                                    { label: 'Correo electrónico *', key: 'email', type: 'email', placeholder: 'juan@tuempresa.cl', required: true },
                                    { label: 'Teléfono o celular *', key: 'phone', type: 'tel', placeholder: '+56 9 1234 5678', required: true },
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
                                        ¿Qué necesitas?
                                    </label>
                                    <select className="w-full py-3 bg-transparent text-base focus:outline-none cursor-pointer"
                                        style={{ borderBottom: `2px solid ${T.border}`, color: T.black }}
                                        value={form.projectType} onChange={e => setForm({ ...form, projectType: e.target.value })}>
                                        {PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                    {form.projectType === 'Un sitio web simple' && (
                                        <p className="text-[12px] mt-2" style={{ color: T.gray }}>
                                            Para un sitio web simple tenemos <Link to="/sitio-web" className="font-bold underline" style={{ color: T.blue }}>Web Express desde $69.990 + IVA</Link>, que puedes contratar directamente.
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.gray }}>
                                        Presupuesto estimado del proyecto
                                    </label>
                                    <select className="w-full py-3 bg-transparent text-base focus:outline-none cursor-pointer"
                                        style={{ borderBottom: `2px solid ${T.border}`, color: T.black }}
                                        value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}>
                                        {BUDGETS.map(b => <option key={b}>{b}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.gray }}>
                                        Detalles adicionales
                                    </label>
                                    <textarea rows={3} placeholder="Cuéntanos más sobre tu negocio o qué necesitas..."
                                        className="w-full py-3 bg-transparent text-base focus:outline-none transition-colors placeholder:opacity-30 resize-none"
                                        style={{ borderBottom: `2px solid ${T.border}`, color: T.black }}
                                        onFocus={e => e.target.style.borderBottomColor = T.blue}
                                        onBlur={e => e.target.style.borderBottomColor = T.border}
                                        value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                                </div>

                                <PrimaryBtn onClick={handleSubmit} className="w-full py-4 text-base mt-2">
                                    {status === 'sending' ? 'Enviando...' : 'Enviar y agendar conversación'}
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

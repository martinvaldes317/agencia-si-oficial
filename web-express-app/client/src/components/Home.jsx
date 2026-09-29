import { useState, useEffect, useCallback, useRef } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
    Menu, X, BrainCircuit, Code2, Globe,
    TrendingUp, Sparkles, MapPin, MessageSquare, Mail,
    ArrowRight, ArrowUpRight, LogIn, CheckCircle2,
    BarChart3, Zap, Shield,
} from 'lucide-react'
import './home-dark.css'
import { trackEvent } from '../lib/analytics'
import { useTheme } from '../theme/ThemeContext'
import ThemeToggle from '../theme/ThemeToggle'
import ThemeLogo from '../theme/ThemeLogo'

// ── Datos ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
    { label: 'Proyectos', id: 'cases' },
    { label: 'Servicios', id: 'services' },
    { label: 'Metodología', id: 'methodology' },
    { label: 'Contacto', id: 'contact' },
]

const PROJECTS = [
    { name: 'Espacio CEA', url: 'https://espaciocea.com', tag: 'Plataforma web', logo: '/clientes/espacio-cea.svg', desc: 'Plataforma de un centro de intervención virtual especializado en Análisis Aplicado de la Conducta, con capacitaciones y acceso para usuarios.' },
    { name: 'MOVERSER', url: 'https://moverserstudio.com', tag: 'Plataforma de membresía', desc: 'Biblioteca de clases online de Pilates, movilidad, flexibilidad y danza, con membresía de acceso ilimitado.' },
    { name: 'NowPOS', url: 'https://nowpos.cl', tag: 'Sistema de caja (POS)', logo: '/clientes/now-pos.png', desc: 'Sistema POS para almacenes y minimarkets: lector de código de barras, control de inventario, cierre de caja y modo offline.' },
    { name: 'Consonancia', url: 'https://consonancia.cl', tag: 'Software para psicólogos', desc: 'Solución digital para psicólogos, pensada para el manejo de historiales clínicos.' },
    { name: 'CFT Araucanía', url: 'https://cftaraucania.cl', tag: 'Sitio institucional', logo: '/clientes/cft-araucania.svg', desc: 'Sitio institucional de un centro de formación técnica: proyecto educativo, apoyo al estudiante y transparencia activa.' },
    { name: 'Publicidad Talca', url: 'https://publicidadtalca.cl', tag: 'Catálogo y sitio comercial', desc: 'Sitio de merchandising y publicidad para empresas de todo Chile, con catálogo de productos.' },
]

const POINTS = [
    { icon: Code2, title: 'Desarrollo a medida', desc: 'Cada proyecto es único. Diseñamos y construimos la solución exacta que tu negocio necesita.' },
    { icon: Zap, title: 'Plazos claros', desc: 'Acordamos el plazo por escrito antes de comenzar y nos comprometemos a cumplirlo.' },
    { icon: BrainCircuit, title: 'Integración con IA', desc: 'Automatizaciones, chatbots y flujos inteligentes que reducen tu carga operativa.' },
    { icon: Shield, title: 'Soporte post-lanzamiento', desc: 'Te acompañamos después de la entrega para que todo funcione desde el primer día.' },
]

const STEPS = [
    { n: '1', title: 'Diagnóstico', desc: 'Entendemos tu negocio, tus clientes y qué necesita tu plataforma digital para generar resultados.' },
    { n: '2', title: 'Diseño', desc: 'Nuestra diseñadora arma wireframes, arquitectura de información y UI pensada para tu operación. Tú apruebas cada paso.' },
    { n: '3', title: 'Desarrollo', desc: 'Construimos con código propio: React, Node.js e integraciones con IA, Webpay y sistemas externos.' },
    { n: '4', title: 'Pruebas y correcciones', desc: 'Probamos las tareas principales, revisamos la experiencia de uso con nuestra diseñadora y corregimos lo que no funciona antes de que apruebes el lanzamiento.' },
    { n: '5', title: 'Lanzamiento', desc: 'Deploy y entrega. Soporte post-lanzamiento incluido para que todo funcione desde día uno.' },
]

const SERVICES = [
    { icon: BarChart3, title: 'Software de gestión', desc: 'Sistemas internos y de caja a medida: inventario, historiales, reportes y control de tu operación, como NowPOS y Consonancia.', foot: 'Cotizar', to: '/servicios/sistemas-de-gestion' },
    { icon: Sparkles, title: 'Automatización de procesos', desc: 'Reduce tareas repetitivas y conecta tus herramientas: seguimiento de consultas, confirmaciones, pedidos y reportes.', foot: 'Cotizar', to: '/servicios/automatizacion-de-procesos' },
    { icon: Globe, title: 'Plataformas y e-commerce', desc: 'Vende, entrega contenido o atiende usuarios online, con login, catálogo o membresía, como Espacio CEA y MOVERSER.', foot: 'Cotizar', to: '/servicios/plataformas' },
    { icon: TrendingUp, title: 'Meta & Google Ads', desc: 'Gestión de campañas pagas con foco en ROAS y rentabilidad, como complemento de tu sistema o sitio.', foot: 'Cotizar' },
]

const AUDIENCE = [
    'Negocios que necesitan un sistema de caja, inventario o gestión',
    'Salud, educación y servicios profesionales con plataforma propia',
    'Instituciones y organismos que compran a través de ChileCompra',
    'Emprendimientos con membresías, cursos o clases online',
    'Empresas con procesos manuales que quieren automatizar',
]

const PROJECT_TYPES = [
    'Un sistema de gestión a medida',
    'Automatización de procesos',
    'Una plataforma web o tienda online',
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

// Mapea el slug de la página de origen (?servicio=...) al valor exacto que ya
// existe en PROJECT_TYPES, para preseleccionar el servicio en el formulario.
const SERVICE_PARAM_TO_PROJECT_TYPE = {
    'sistemas-de-gestion': 'Un sistema de gestión a medida',
    'automatizacion-de-procesos': 'Automatización de procesos',
    'plataformas': 'Una plataforma web o tienda online',
}

// ── Utilidades de animación ───────────────────────────────────────────────────
function useInView(threshold = 0.35) {
    const ref = useRef(null)
    const [seen, setSeen] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        if (typeof IntersectionObserver === 'undefined') { setSeen(true); return }
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold })
        io.observe(el)
        return () => io.disconnect()
    }, [threshold])
    return [ref, seen]
}

function CountUp({ to, suffix = '', active }) {
    const [v, setV] = useState(0)
    useEffect(() => {
        if (!active) return
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setV(to); return }
        let raf; const t0 = performance.now(), dur = 1600
        const tick = t => {
            const p = Math.min((t - t0) / dur, 1)
            setV(Math.round(to * (1 - Math.pow(1 - p, 3))))
            if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [active, to])
    return <>{v}{suffix}</>
}

// Brillo que sigue al cursor (filas y tarjetas)
const trackGlow = e => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

// ── Navbar ────────────────────────────────────────────────────────────────────
const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)
    const [open, setOpen] = useState(false)
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40)
        fn()
        window.addEventListener('scroll', fn, { passive: true })
        return () => window.removeEventListener('scroll', fn)
    }, [])
    return (
        <header>
            <nav className={`hd-nav ${scrolled ? 'is-scrolled' : ''}`} aria-label="Principal">
                <div className="hd-wrap hd-nav-in">
                    <a href="#home" aria-label="AgenciaSi, inicio"><ThemeLogo style={{ height: 36, width: 'auto', display: 'block' }} /></a>
                    <div className="hd-nav-links">
                        {NAV_LINKS.map(l => <a key={l.id} href={`#${l.id}`}>{l.label}</a>)}
                    </div>
                    <div className="hd-nav-cta">
                        <ThemeToggle />
                        <Link to="/portal" className="hd-portal"><LogIn size={14} /> Portal</Link>
                        <a href="#contact" className="hd-btn hd-btn-primary hd-btn-sm">Solicita una conversación</a>
                    </div>
                    <button className="hd-burger" onClick={() => setOpen(o => !o)} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open}>
                        {open ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>
            {open && (
                <div className="hd-mobile">
                    {NAV_LINKS.map(l => (
                        <a key={l.id} href={`#${l.id}`} className="hd-m-link" onClick={() => setOpen(false)}>{l.label} <ArrowRight size={18} /></a>
                    ))}
                    <Link to="/portal" className="hd-btn hd-btn-ghost" style={{ marginTop: 28 }} onClick={() => setOpen(false)}><LogIn size={15} /> Portal clientes</Link>
                    <a href="#contact" className="hd-btn hd-btn-primary" style={{ marginTop: 12 }} onClick={() => setOpen(false)}>Solicita una conversación</a>
                    <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <ThemeToggle />
                        <span style={{ fontSize: 13, color: 'var(--mut)' }}>Modo día / noche</span>
                    </div>
                </div>
            )}
        </header>
    )
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function Home() {
    const [form, setForm] = useState(FORM_INITIAL)
    const [status, setStatus] = useState('')
    const [showWaTooltip, setShowWaTooltip] = useState(false)
    const [statsRef, statsSeen] = useInView(0.4)
    const [tlRef, tlSeen] = useInView(0.3)
    const { executeRecaptcha } = useGoogleReCaptcha()
    const { theme } = useTheme()
    const [searchParams] = useSearchParams()
    // Origen de la visita (?servicio=slug) — se usa para preseleccionar el
    // desplegable y para que el correo que recibe el equipo diga de dónde
    // vino la consulta, no solo qué escribió la persona.
    const servicioParam = searchParams.get('servicio')
    // document.referrer solo sirve para una carga de página real (ej. alguien
    // llega desde Google) — una navegación interna con <Link> no lo actualiza,
    // por eso si venimos de una página de servicio la reconstruimos desde el
    // propio parámetro en vez de confiar en el referrer.
    const origenRef = useRef(
        SERVICE_PARAM_TO_PROJECT_TYPE[servicioParam] ? `agenciasi.cl/servicios/${servicioParam}` : (document.referrer || '')
    )

    useEffect(() => {
        const preselected = SERVICE_PARAM_TO_PROJECT_TYPE[servicioParam]
        if (preselected) setForm(f => ({ ...f, projectType: preselected }))
    }, [servicioParam])

    // Antes aparecía sola a los 5s y se quedaba 10s — en pantallas de
    // notebook (~800px de alto) tapaba el texto de "+60 proyectos
    // entregados" justo debajo de los botones del hero. Ahora es solo al
    // pasar el mouse: más discreto y no compite con nada.

    // Evita destellos del color equivocado al hacer overscroll mientras la home está abierta
    useEffect(() => {
        const prev = document.body.style.background
        document.body.style.background = theme === 'light' ? '#ffffff' : '#000'
        return () => { document.body.style.background = prev }
    }, [theme])

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()
        if (!executeRecaptcha) return
        const token = await executeRecaptcha('contact_form')
        setStatus('sending')
        // El equipo revisa esto en un correo compartido, no en un CRM con
        // ruteo automático — por eso el servicio y el origen van primero y
        // en mayúsculas, para que quien lo lea derive rápido sin tener que
        // leer todo el mensaje.
        const origenLinea = origenRef.current ? `\nPágina de origen: ${origenRef.current}` : ''
        const structuredMessage = `SERVICIO DE INTERÉS: ${form.projectType}${origenLinea}\n\n${form.message || '(sin mensaje adicional)'}`
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, message: structuredMessage, recaptchaToken: token })
            })
            setStatus(res.ok ? 'success' : 'error')
            if (res.ok) {
                // Distinto del "form_submit" genérico (que se dispara con el evento
                // submit del navegador, sin importar si el fetch después falla) —
                // este solo se registra cuando la consulta realmente llegó.
                trackEvent('contact_form_success', { label: form.projectType })
                setForm(FORM_INITIAL)
            }
        } catch { setStatus('error') }
    }, [executeRecaptcha, form])

    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

    return (
        <div className="hd">
            <Helmet>
                <title>AgenciaSI | Desarrollo Web, Apps y Sistemas a Medida en Chile</title>
                <meta name="description" content="Construimos sistemas a medida y automatizamos procesos en Chile. Software de gestión, plataformas, e-commerce e integración con IA. Plazos claros y resultados medibles." />
                <meta name="keywords" content="desarrollo web chile, sistemas a medida chile, automatizacion de procesos chile, empresa desarrollo software chile, desarrollo react chile, tienda online chile, automatizacion IA chile, agencia digital chile, web express, diseño web profesional" />
                <link rel="canonical" href="https://agenciasi.cl/" />
            </Helmet>

            {/* WhatsApp flotante */}
            <div className="hd-wa">
                <a className="hd-wa-btn" href="https://wa.me/56932930812?text=Hola%2C%20me%20interesa%20saber%20m%C3%A1s%20sobre%20sus%20servicios" target="_blank" rel="noopener noreferrer" aria-label="Escribir por WhatsApp"
                    onMouseEnter={() => setShowWaTooltip(true)} onMouseLeave={() => setShowWaTooltip(false)}
                    onFocus={() => setShowWaTooltip(true)} onBlur={() => setShowWaTooltip(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.856L.057 23.215a.75.75 0 0 0 .916.916l5.36-1.477A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.502-5.241-1.381l-.375-.217-3.884 1.07 1.07-3.884-.217-.375A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                    </svg>
                </a>
                <div className="hd-wa-tip" style={{ opacity: showWaTooltip ? 1 : 0, transform: showWaTooltip ? 'none' : 'translateX(-8px) scale(.96)' }} aria-hidden={!showWaTooltip}>
                    <b>¿Hablamos?</b><small>Respondemos en 24h hábiles</small>
                </div>
            </div>

            <Navbar />

            {/* ═══ HERO ═══ */}
            <section id="home" className="hd-hero">
                <div className="hd-grid-bg" aria-hidden="true" />
                <div className="hd-aurora a1" aria-hidden="true" />
                <div className="hd-aurora a2" aria-hidden="true" />
                <div className="hd-aurora a3" aria-hidden="true" />
                <div className="hd-wrap" style={{ width: '100%' }}>
                    <div className="hd-hero-grid">
                        <div>
                            <h1 className="hd-h1 hd-rise d1">Sistemas y automatización<br />para operar con menos trabajo manual.</h1>
                            <p className="hd-hero-sub hd-rise d2">
                                Desarrollamos software a medida y conectamos tus herramientas para ordenar la operación, reducir tareas repetitivas y acompañar el crecimiento de tu empresa.
                            </p>
                            <div className="hd-cta-row hd-rise d3">
                                <a href="#contact" className="hd-btn hd-btn-primary">Solicita una conversación <ArrowRight size={17} /></a>
                                <a href="#cases" className="hd-btn hd-btn-ghost">Ver proyectos</a>
                            </div>
                            <p className="hd-hero-note hd-rise d4">
                                <strong>60+ proyectos entregados</strong> · Proveedor del Estado.
                            </p>
                        </div>

                        <div className="hd-win-wrap hd-rise d3" aria-hidden="true">
                            <div className="hd-win">
                                <div className="hd-win-bar"><i /><i /><i /><span /></div>
                                <div className="hd-win-body">
                                    <div className="hd-win-side"><b /><b /><b /><b /></div>
                                    <div className="hd-win-main">
                                        <div className="hd-kpis">
                                            <div className="hd-kpi"><i /><em /></div>
                                            <div className="hd-kpi"><i /><em /></div>
                                            <div className="hd-kpi"><i /><em /></div>
                                        </div>
                                        <div className="hd-chart"><span /><span /><span /><span /><span /><span /><span /></div>
                                        <div className="hd-rows"><div /><div /><div /></div>
                                    </div>
                                </div>
                            </div>
                            <span className="hd-chip c1"><CheckCircle2 size={14} /> Inventario al día</span>
                            <span className="hd-chip c2"><CheckCircle2 size={14} /> Cierre de caja</span>
                            <span className="hd-chip c3"><CheckCircle2 size={14} /> Acceso por usuarios</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ PROYECTOS ═══ */}
            <section id="cases" className="hd-sec" style={{ paddingTop: 40 }}>
                <div className="hd-wrap">
                    <div className="hd-proj-head">
                        <h2 className="hd-h2">Ya funcionan en Chile.</h2>
                        <p className="hd-lead" style={{ margin: 0 }}>Algunos de los sistemas y plataformas que construimos, hoy en uso.</p>
                    </div>
                    <div className="hd-proj-list">
                        {PROJECTS.map(p => (
                            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="hd-row" onMouseMove={trackGlow} aria-label={`${p.name}, abrir sitio`}>
                                <div className="hd-row-name">{p.name}<span className="hd-row-tag">{p.tag}</span></div>
                                <p className="hd-row-desc">{p.desc}</p>
                                <div className={`hd-row-logo ${p.logo ? '' : 'empty'}`}>{p.logo && <img src={p.logo} alt="" loading="lazy" />}</div>
                                <ArrowUpRight className="hd-row-go" size={22} aria-hidden="true" />
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ CIFRAS ═══ */}
            <div className="hd-stats" ref={statsRef}>
                <div className="hd-wrap">
                    <div className="hd-stat-grid">
                        <div className="hd-stat"><div className="hd-stat-n"><CountUp to={60} suffix="+" active={statsSeen} /></div><div className="hd-stat-l">Proyectos entregados</div></div>
                        <div className="hd-stat"><div className="hd-stat-n"><CountUp to={60} suffix="+" active={statsSeen} /></div><div className="hd-stat-l">Proyectos activos</div></div>
                        <div className="hd-stat"><div className="hd-stat-n" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', paddingTop: 8 }}>ChileCompra</div><div className="hd-stat-l">Proveedor del Estado</div></div>
                        <div className="hd-stat"><div className="hd-stat-n"><CountUp to={100} suffix="%" active={statsSeen} /></div><div className="hd-stat-l">Código propio, sin templates</div></div>
                    </div>
                    <div className="hd-hash">
                        <p><strong>#DigitalizandoChile</strong>Llevamos negocios chilenos al mundo digital, con tecnología real y diseño a medida.</p>
                        <div className="hd-state">
                            <img src="/proveedor-del-estado.png" alt="" />
                            <div><b>Proveedor del Estado</b><small>Registrados en ChileCompra · MercadoPúblico</small></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ PROPUESTA ═══ */}
            <section className="hd-sec">
                <div className="hd-wrap">
                    <div className="hd-two">
                        <div>
                            <h2 className="hd-h2">Tu negocio merece más que un template.</h2>
                            <p className="hd-lead">
                                Construimos <strong>a medida, desde cero</strong> — sin plantillas ni constructores genéricos. Código propio, arquitectura pensada para cómo funciona tu negocio y resultados medibles.
                            </p>
                            <div className="hd-points">
                                {POINTS.map(({ icon: Icon, title, desc }) => (
                                    <div key={title} className="hd-point">
                                        <div className="hd-point-ico"><Icon size={19} /></div>
                                        <div><h3>{title}</h3><p>{desc}</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="hd-glow">
                            <div className="hd-glow-in">
                                <h3>Código propio.<br />Resultados reales.</h3>
                                <p>Diseñamos, construimos y lanzamos tu plataforma digital, y te acompañamos después de la entrega.</p>
                                <div className="hd-mini">
                                    <div><b>60+</b><small>Proyectos entregados</small></div>
                                    <div><b style={{ fontSize: '1rem', paddingTop: 5 }}>ChileCompra</b><small>Proveedor del Estado</small></div>
                                    <div><b>60+</b><small>Proyectos activos</small></div>
                                </div>
                                <div className="hd-tags">{['React', 'Node.js', 'IA integrada', 'Código propio'].map(t => <span key={t}>{t}</span>)}</div>
                                <a href="#contact" className="hd-btn hd-btn-primary">¿Tienes un proyecto en mente? Conversemos <ArrowRight size={16} /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ METODOLOGÍA ═══ */}
            <section id="methodology" className="hd-sec hd-method">
                <div className="hd-wrap">
                    <h2 className="hd-h2">Del brief al lanzamiento<br />en 5 pasos.</h2>
                    <div className={`hd-tl ${tlSeen ? 'in' : ''}`} ref={tlRef}>
                        <div className="hd-tl-line" aria-hidden="true" />
                        {STEPS.map(s => (
                            <div key={s.n} className="hd-step">
                                <div className="hd-dot">{s.n}</div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ SERVICIOS ═══ */}
            <section id="services" className="hd-sec">
                <div className="hd-wrap">
                    <h2 className="hd-h2" style={{ maxWidth: '22ch' }}>Todo lo que tu empresa necesita para crecer.</h2>
                    <p className="hd-lead">Elige por lo que necesitas resolver. Si no lo tienes claro, lo definimos juntos en la primera conversación.</p>
                    <div className="hd-bento">
                        {SERVICES.map(s => {
                            const Icon = s.icon
                            return (
                                <div key={s.title} className={`hd-card ${s.feat ? 'hd-feat' : ''}`} onMouseMove={trackGlow}>
                                    {s.feat && <span className="hd-badge">Servicio principal</span>}
                                    <div className="hd-card-ico"><Icon size={21} /></div>
                                    <h3>{s.title}</h3>
                                    <p>{s.desc}</p>
                                    {s.feat
                                        ? <a href="#contact" className="hd-btn hd-btn-primary">Solicita una conversación <ArrowRight size={16} /></a>
                                        : (
                                            <div className="hd-card-foot">
                                                <span>{s.foot}</span>
                                                {s.to ? <Link to={s.to}>Ver más →</Link> : <a href="#contact">Solicitar →</a>}
                                            </div>
                                        )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ═══ PARA QUIÉN ═══ */}
            <section className="hd-sec" style={{ paddingTop: 0 }}>
                <div className="hd-wrap">
                    <div className="hd-two">
                        <div>
                            <h2 className="hd-h2">Empresas que necesitan digitalizar su operación.</h2>
                            <p className="hd-lead">
                                Trabajamos con empresas e instituciones que quieren dejar atrás las planillas y los procesos manuales, y contar con un sistema propio que se adapte a cómo trabajan.
                            </p>
                            <ul className="hd-list">
                                {AUDIENCE.map(item => <li key={item}><CheckCircle2 size={18} />{item}</li>)}
                            </ul>
                        </div>
                        <div className="hd-quad">
                            <div><b>60+</b><strong>Proyectos entregados</strong><small>sitios, sistemas y plataformas</small></div>
                            <div><b style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', paddingTop: 6 }}>ChileCompra</b><strong>Proveedor del Estado</strong><small>licitaciones ganadas</small></div>
                            <div><b>1:1</b><strong>Trato directo</strong><small>con el equipo que desarrolla</small></div>
                            <div><b>Chile</b><strong>Cobertura</strong><small>trabajo remoto en todo el país</small></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ CONTACTO ═══ */}
            <section id="contact" className="hd-sec hd-contact">
                <div className="hd-aurora" aria-hidden="true" />
                <div className="hd-wrap" style={{ position: 'relative' }}>
                    <div className="hd-two" style={{ alignItems: 'start' }}>
                        <div>
                            <h2 className="hd-h2" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)' }}>Cuéntanos tu proyecto.</h2>
                            <p className="hd-lead">Conversemos sobre lo que necesitas. Analizamos tu caso y te decimos honestamente si podemos ayudarte y cómo. Sin compromiso.</p>
                            <div className="hd-links">
                                <a className="hd-link is-main" href="https://wa.me/56932930812" target="_blank" rel="noopener noreferrer">
                                    <span className="hd-link-ico"><MessageSquare size={19} /></span>
                                    <span><small>WhatsApp directo</small><b>+56 9 3293 0812</b></span>
                                </a>
                                <a className="hd-link" href="mailto:contacto@agenciasi.cl">
                                    <span className="hd-link-ico"><Mail size={19} /></span>
                                    <span><small>Correo electrónico</small><b>contacto@agenciasi.cl</b></span>
                                </a>
                            </div>
                            <div className="hd-place"><MapPin size={16} /> San Clemente, Maule — Trabajamos de forma remota en todo Chile</div>
                        </div>

                        <form className="hd-form" onSubmit={handleSubmit}>
                            <h3>Cuéntanos qué necesitas</h3>
                            <p>Te respondemos en menos de 24 horas hábiles, por WhatsApp o correo.</p>
                            <div className="hd-fields">
                                <div className="hd-field"><label htmlFor="f-name">Nombre completo *</label><input id="f-name" type="text" required placeholder="Juan Pérez" value={form.name} onChange={set('name')} autoComplete="name" /></div>
                                <div className="hd-field"><label htmlFor="f-email">Correo electrónico *</label><input id="f-email" type="email" required placeholder="juan@tuempresa.cl" value={form.email} onChange={set('email')} autoComplete="email" /></div>
                                <div className="hd-field"><label htmlFor="f-phone">Teléfono o celular *</label><input id="f-phone" type="tel" required placeholder="+56 9 1234 5678" value={form.phone} onChange={set('phone')} autoComplete="tel" /></div>
                                <div className="hd-field"><label htmlFor="f-company">Empresa o sitio web</label><input id="f-company" type="text" placeholder="tuempresa.cl" value={form.company} onChange={set('company')} autoComplete="organization" /></div>
                                <div className="hd-field">
                                    <label htmlFor="f-type">¿Qué necesitas?</label>
                                    <select id="f-type" value={form.projectType} onChange={set('projectType')}>{PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}</select>
                                    {form.projectType === 'Un sitio web simple' && (
                                        <p className="hd-hint">Para un sitio web simple tenemos <Link to="/sitio-web">Web Express</Link>, que puedes contratar directamente.</p>
                                    )}
                                </div>
                                <div className="hd-field">
                                    <label htmlFor="f-budget">Presupuesto estimado del proyecto</label>
                                    <select id="f-budget" value={form.budget} onChange={set('budget')}>{BUDGETS.map(b => <option key={b}>{b}</option>)}</select>
                                </div>
                                <div className="hd-field"><label htmlFor="f-msg">Detalles adicionales</label><textarea id="f-msg" rows={3} placeholder="Cuéntanos más sobre tu negocio o qué necesitas..." value={form.message} onChange={set('message')} /></div>
                                <button type="submit" className="hd-btn hd-btn-primary hd-submit" disabled={status === 'sending'}>
                                    {status === 'sending' ? 'Enviando...' : <>Solicitar conversación <ArrowRight size={16} /></>}
                                </button>
                                {status === 'success' && <div className="hd-ok" role="status"><CheckCircle2 size={16} /> ¡Listo! Recibimos tu solicitud — te respondemos en menos de 24 horas hábiles por WhatsApp o correo.</div>}
                                {status === 'error' && <div className="hd-err" role="alert">Error al enviar. Escríbenos directamente al WhatsApp.</div>}
                                <p className="hd-fine">Sin spam · www.agenciasi.cl</p>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="hd-foot">
                <div className="hd-wrap">
                    <div className="hd-foot-grid">
                        <div>
                            <ThemeLogo style={{ height: 40, width: 'auto', marginBottom: 20 }} />
                            <p style={{ color: 'var(--mut)', fontSize: 14, lineHeight: 1.75, maxWidth: '22rem', margin: '0 0 18px' }}>
                                Sistemas a medida, automatización de procesos y plataformas web para empresas que quieren crecer. Campañas de Meta y Google Ads como complemento.
                            </p>
                            <p style={{ color: '#6e6e85', fontSize: 12.5, lineHeight: 1.8, margin: 0 }}>San Clemente, Región del Maule — Chile<br />Cobertura: todo Chile, de forma remota</p>
                        </div>
                        <div>
                            <h4>Servicios</h4>
                            <ul>
                                <li><Link to="/servicios/sistemas-de-gestion">Sistemas a medida</Link></li>
                                <li><Link to="/servicios/automatizacion-de-procesos">Automatización de procesos</Link></li>
                                <li><Link to="/servicios/plataformas">Plataformas y e-commerce</Link></li>
                                <li><a href="#services">Meta & Google Ads</a></li>
                                <li><a href="https://publicidadtalca.cl" target="_blank" rel="noopener noreferrer">Publicidad Talca ↗</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4>Contacto</h4>
                            <ul>
                                <li><a href="https://wa.me/56932930812" target="_blank" rel="noopener noreferrer">+56 9 3293 0812</a></li>
                                <li><a href="mailto:contacto@agenciasi.cl">contacto@agenciasi.cl</a></li>
                                <li>www.agenciasi.cl</li>
                            </ul>
                            <div style={{ marginTop: 22 }}><a href="#contact" className="hd-btn hd-btn-primary hd-btn-sm">Solicita una conversación</a></div>
                        </div>
                    </div>
                    <div className="hd-foot-bottom">
                        <span>© 2026 AgenciaSi — Diseño y desarrollo integral</span>
                        <span style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
                            <Link to="/terminos-condiciones">Términos y Condiciones</Link>
                            <Link to="/politica-privacidad">Privacidad</Link>
                            <Link to="/portal">Portal clientes →</Link>
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    )
}

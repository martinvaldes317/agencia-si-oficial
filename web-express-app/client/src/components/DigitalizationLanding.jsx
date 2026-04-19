import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
    Check, ArrowRight, Zap, Smartphone, Globe, Layout,
    Clock, CreditCard, Rocket, ShieldCheck, Sparkles,
    MousePointer2, ChevronRight, ArrowLeft
} from 'lucide-react'

export default function DigitalizationLanding() {
    return (
        <div className="bg-black min-h-screen text-white font-sans selection:bg-white selection:text-black antialiased">
            <Helmet>
                <title>Web Profesional Express | AgenciaSi Chile</title>
                <meta name="description" content="Obtén tu sitio web profesional en tiempo récord. Diseño personalizado, optimizado para ventas y mobile-first. Desde $129.990 + IVA." />
                <meta name="keywords" content="web express chile, diseño web rápido, página web profesional chile, sitio web barato chile, web para negocios" />
                <link rel="canonical" href="https://agenciasi.cl/digitalizacion-express" />
                <meta property="og:title" content="Web Profesional Express | AgenciaSi" />
                <meta property="og:description" content="Tu sitio web profesional listo en tiempo récord. Diseño de autoridad, mobile-first y carga instantánea." />
                <meta property="og:url" content="https://agenciasi.cl/digitalizacion-express" />
            </Helmet>

            {/* Premium Header */}
            <header className="fixed w-full top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors group shrink-0">
                            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-zinc-500 group-hover:text-white transition-colors" />
                        </Link>
                        <Link to="/" className="border-l pl-3 md:pl-4 border-white/10 group shrink-0">
                            <img src="/logo-dark.png" alt="AgenciaSi" className="h-7 md:h-8 w-auto transition-opacity group-hover:opacity-70" style={{ display: 'block' }} />
                        </Link>
                    </div>
                    <Link to="/digitalizacion-express/wizard" className="shrink-0 bg-white text-black px-4 md:px-6 py-2 md:py-2.5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 whitespace-nowrap">
                        Comenzar
                        <span className="hidden md:inline"> Ahora</span>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 px-6 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-30 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-zinc-600 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-zinc-800 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 animate-fade-in">
                        <Zap className="w-3 h-3 text-white" />
                        Digitalización Express
                    </div>

                    <h1 className="text-5xl md:text-8xl font-light tracking-tighter mb-10 leading-[0.9] animate-slide-up">
                        Tu negocio online. <br />
                        <span className="text-zinc-500 italic font-light">Profesional. Rápido. Rentable.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-16 leading-relaxed font-light animate-fade-in delay-100">
                        Creamos tu <strong>Landing Page de alto rendimiento</strong> optimizada para recibir leads.
                        Diseño premium, lista en solo <span className="text-white border-b border-white/20">5 días hábiles</span>.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in delay-200">
                        <Link to="/digitalizacion-express/wizard" className="w-full sm:w-auto bg-white text-black px-12 py-6 text-xs font-bold uppercase tracking-[0.2em] hover:scale-105 transition-transform flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            Obtener mi web <ArrowRight className="w-4 h-4" />
                        </Link>
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Inversión única</p>
                            <p className="text-xl font-light tracking-tight">$129.990 <span className="text-xs text-zinc-600 font-bold ml-1">+ IVA</span></p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Proposition Grid */}
            <section className="py-24 bg-zinc-950 px-6 border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-1 px-1 bg-white/5">
                        {[
                            {
                                icon: Layout,
                                title: "Diseño de Autoridad",
                                desc: "No usamos plantillas genéricas. Aplicamos psicología de ventas y diseño UI de vanguardia."
                            },
                            {
                                icon: Smartphone,
                                title: "Mobile-First UX",
                                desc: "El 90% de tus clientes vendrán desde el celular. Tu sitio será perfecto en cualquier pantalla."
                            },
                            {
                                icon: Rocket,
                                title: "Carga Instantánea",
                                desc: "Velocidad extrema optimizada para mejorar tu posicionamiento y retención de usuarios."
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-black p-12 hover:bg-zinc-900/50 transition-colors group">
                                <item.icon className="w-8 h-8 mb-8 text-zinc-500 group-hover:text-white transition-colors" />
                                <h3 className="text-xl font-bold mb-4 tracking-tight uppercase tracking-widest text-sm">{item.title}</h3>
                                <p className="text-zinc-500 leading-relaxed text-sm font-light italic">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works / Process */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20 text-center">
                        <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-6">El Proceso SI</h2>
                        <p className="text-zinc-500 font-light max-w-xl mx-auto text-lg italic uppercase tracking-widest text-[10px]">De la idea al lanzamiento en 5 pasos</p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-8">
                        {[
                            { step: "01", title: "Wizard", desc: "Completas el formulario inteligente con tu información." },
                            { step: "02", title: "Curatía", desc: "Nuestro equipo procesa y optimiza tus textos y fotos." },
                            { step: "03", title: "Diseño", desc: "Construimos tu landing con arquitectura de alta conversión." },
                            { step: "04", title: "Revisión", desc: "Ajustes finales para que todo quede perfecto." },
                            { step: "05", title: "Go-Live", desc: "Lanzamos tu sitio con dominio y hosting incluido." }
                        ].map((s, i) => (
                            <div key={i} className="relative group">
                                <div className="text-5xl font-black text-white/5 mb-4 group-hover:text-white/10 transition-colors italic font-serif">{s.step}</div>
                                <h4 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                    {s.title}
                                    {i < 4 && <ChevronRight className="w-4 h-4 text-zinc-800 hidden md:block" />}
                                </h4>
                                <p className="text-zinc-500 text-xs font-light leading-relaxed italic">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Detailed List */}
            <section className="py-32 px-6 bg-zinc-950 border-t border-white/5">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-20 items-center">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-zinc-900 border border-white/10 text-zinc-500 text-[9px] font-bold uppercase tracking-widest mb-6">
                            Plan Todo Incluido
                        </div>
                        <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-12">¿Qué obtienes exactamente?</h2>

                        <div className="space-y-6">
                            {[
                                { t: "Landing Page High-End", d: "Arquitectura de sección única diseñada para convertir." },
                                { t: "Dominio .CL o .COM", d: "Gestionamos el registro por el primer año." },
                                { t: "Hosting Premium", d: "Servidores de alta velocidad con SSL (Candado de seguridad)." },
                                { t: "Email Corporativo", d: "Configuración de tu cuenta profesional (ej: info@tuempresa.cl)." },
                                { t: "Botón WhatsApp & Formulario", d: "Integración directa para recibir pedidos al instante." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="mt-1 shrink-0">
                                        <div className="w-5 h-5 rounded-full border border-zinc-800 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all">
                                            <Check className="w-3 h-3 text-zinc-500 group-hover:text-black" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold uppercase tracking-widest mb-1">{item.t}</h4>
                                        <p className="text-zinc-500 text-sm font-light italic">{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-md">
                        <div className="bg-black border border-white/10 p-12 rounded-sm shadow-2xl relative overflow-hidden group">
                            {/* Decorative element */}
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-zinc-800 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>

                            <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-8 italic">Oferta Digitalización</p>

                            <div className="flex items-baseline gap-2 mb-10">
                                <span className="text-6xl font-light tracking-tighter">$129.990</span>
                                <span className="text-sm text-zinc-600 font-bold uppercase tracking-widest">+ IVA</span>
                            </div>

                            <ul className="space-y-4 mb-12">
                                <li className="flex items-center gap-3 text-xs text-zinc-400 font-light uppercase tracking-widest">
                                    <ShieldCheck className="w-4 h-4 text-zinc-600" /> Pago único, sin mensualidades
                                </li>
                                <li className="flex items-center gap-3 text-xs text-zinc-400 font-light uppercase tracking-widest">
                                    <Clock className="w-4 h-4 text-zinc-600" /> Entrega en 5 días hábiles
                                </li>
                                <li className="flex items-center gap-3 text-xs text-zinc-400 font-light uppercase tracking-widest">
                                    <Sparkles className="w-4 h-4 text-zinc-600" /> Soporte post-entrega (7 días)
                                </li>
                            </ul>

                            <Link to="/digitalizacion-express/wizard" className="block w-full bg-white text-black py-5 font-bold uppercase tracking-[0.2em] text-[10px] text-center hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                Comenzar ahora
                            </Link>

                            <p className="text-[9px] text-center text-zinc-600 uppercase tracking-widest mt-6 italic font-bold">
                                Respaldado por AgenciaSi
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-32 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-7xl font-light tracking-tighter mb-10">¿Listo para dar el salto?</h2>
                    <p className="text-zinc-500 text-lg md:text-xl font-light mb-16 italic">No dejes pasar más tiempo. Tu competencia ya está online, es hora de que tú lo hagas con autoridad.</p>
                    <Link to="/digitalizacion-express/wizard" className="inline-flex items-center gap-4 border-b border-white pb-2 text-xl font-light hover:text-zinc-400 hover:border-zinc-400 transition-all group">
                        Empezar mi digitalización <MousePointer2 className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* Footer Simple */}
            <footer className="py-20 border-t border-white/5 text-center bg-zinc-950">
                <Link to="/" className="inline-flex justify-center mb-8 opacity-50 hover:opacity-100 transition-opacity">
                    <img src="/logo-dark.png" alt="AgenciaSi" className="h-7 w-auto" />
                </Link>
                <p className="text-zinc-600 text-[10px] uppercase tracking-[0.4em] font-bold">
                    © 2026 AgenciaSi • Estrategia & Crecimiento
                </p>
            </footer>
        </div>
    )
}

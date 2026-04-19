import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import {
    TrendingUp, Code2, Search, Globe, BrainCircuit,
    Mic, Camera, MessageSquare, Mail, LogIn, ArrowRight, Sparkles,
} from 'lucide-react'

const T = {
    blue:   '#2D2BB5',
    yellow: '#FACC15',
    black:  '#0A0A0A',
    gray:   '#5C5C6E',
    white:  '#FFFFFF',
}

const services = [
    {
        icon: TrendingUp,
        label: 'Meta & Google Ads',
        sub: 'Campañas que generan ventas reales',
        href: '/#contact',
        external: false,
        variant: 'primary',
    },
    {
        icon: Search,
        label: 'Diagnóstico SEO Gratuito',
        sub: 'Descubre dónde estás en Google',
        to: '/diagnostico-seo',
        variant: 'white',
    },
    {
        icon: Code2,
        label: 'Desarrollo Web Express',
        sub: 'Tu sitio en 7 días, desde $249.990',
        to: '/digitalizacion-express',
        variant: 'primary',
    },
    {
        icon: BrainCircuit,
        label: 'Ecosistemas con IA',
        sub: 'Automatizaciones y CRM inteligente',
        href: '/#contact',
        variant: 'outline',
    },
    {
        icon: Globe,
        label: 'WordPress & SEO Técnico',
        sub: 'Optimización avanzada para posicionarte',
        href: '/#contact',
        variant: 'outline',
    },
    {
        icon: Sparkles,
        label: 'Gestión de Redes Sociales',
        sub: 'Estrategia, contenido y pauta',
        href: '/#contact',
        variant: 'outline',
    },
    {
        icon: Mic,
        label: 'Studio Podcast',
        sub: 'Grabación profesional · San Clemente',
        href: '/#contact',
        variant: 'outline',
    },
    {
        icon: Camera,
        label: 'Studio Fotográfico',
        sub: 'Contenido de alto nivel por hora',
        href: '/#contact',
        variant: 'outline',
    },
]

const contacts = [
    {
        icon: MessageSquare,
        label: 'Escríbenos por WhatsApp',
        href: 'https://wa.me/56932930812',
        color: '#25D366',
    },
    {
        icon: Mail,
        label: 'contacto@agenciasi.cl',
        href: 'mailto:contacto@agenciasi.cl',
        color: T.blue,
    },
]

const BtnLink = ({ item }) => {
    const base = {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        width: '100%',
        padding: '15px 20px',
        borderRadius: '16px',
        textDecoration: 'none',
        transition: 'transform 0.15s, opacity 0.15s',
        cursor: 'pointer',
        fontFamily: 'Poppins, sans-serif',
    }

    const styles = {
        primary: { ...base, background: T.blue,   color: T.white, border: 'none' },
        yellow:  { ...base, background: T.yellow,  color: T.blue,  border: 'none' },
        white:   { ...base, background: T.white,   color: T.black, border: 'none' },
        outline: { ...base, background: 'rgba(255,255,255,0.06)', color: T.white, border: '1px solid rgba(255,255,255,0.12)' },
    }

    const s = styles[item.variant]

    const inner = (
        <>
            <div style={{
                width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: item.variant === 'primary' ? 'rgba(255,255,255,0.15)'
                          : item.variant === 'yellow'  ? 'rgba(45,43,181,0.15)'
                          : item.variant === 'white'   ? 'rgba(0,0,0,0.08)'
                          : 'rgba(255,255,255,0.1)',
            }}>
                <item.icon size={18} color={item.variant === 'yellow' || item.variant === 'white' ? T.blue : T.white} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', lineHeight: 1.2 }}>{item.label}</p>
                <p style={{ margin: '2px 0 0', fontSize: '11px', opacity: 0.65, lineHeight: 1.3 }}>{item.sub}</p>
            </div>
            <ArrowRight size={16} style={{ opacity: 0.5, flexShrink: 0 }} />
        </>
    )

    const hoverIn  = e => { e.currentTarget.style.transform = 'scale(1.015)'; e.currentTarget.style.opacity = '0.93' }
    const hoverOut = e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1' }

    if (item.to) return (
        <Link to={item.to} style={s} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>{inner}</Link>
    )
    return (
        <a href={item.href} style={s} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>{inner}</a>
    )
}

export default function Links() {
    return (
        <div style={{ minHeight: '100vh', background: '#0f0f1a', fontFamily: 'Poppins, sans-serif', display: 'flex', justifyContent: 'center', padding: '40px 16px 60px' }}>
            <Helmet>
                <title>AgenciaSi | Links</title>
                <meta name="robots" content="noindex" />
            </Helmet>

            <div style={{ width: '100%', maxWidth: '480px' }}>

                {/* Profile */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ margin: '0 auto 16px', display: 'flex', justifyContent: 'center' }}>
                        <img src="/logo-dark.png" alt="AgenciaSi" style={{ height: '48px', width: 'auto' }} />
                    </div>
                    <h1 style={{ color: T.white, fontWeight: 800, fontSize: '20px', margin: '0 0 4px', letterSpacing: '-0.01em' }}>AgenciaSi</h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', margin: '0 0 6px' }}>
                        Marketing digital · IA · Desarrollo web
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', margin: 0 }}>
                        San Clemente · Chile · Latinoamérica
                    </p>
                </div>

                {/* CTA highlight */}
                <div style={{
                    background: `linear-gradient(135deg, ${T.blue}cc, #1a1880cc)`,
                    border: `1px solid ${T.blue}50`,
                    borderRadius: '20px',
                    padding: '20px',
                    marginBottom: '24px',
                    textAlign: 'center',
                }}>
                    <p style={{ color: T.yellow, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 6px' }}>Oferta especial</p>
                    <p style={{ color: T.white, fontWeight: 700, fontSize: '16px', margin: '0 0 4px' }}>Diagnóstico SEO 100% gratuito</p>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', margin: '0 0 16px' }}>Descubre cómo aparecer primero en Google</p>
                    <Link to="/diagnostico-seo" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '11px 24px', borderRadius: '99px',
                        background: T.white, color: T.black,
                        fontWeight: 700, fontSize: '13px', textDecoration: 'none',
                    }}>
                        Solicitar gratis <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Services */}
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 12px 4px' }}>Servicios</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                    {services.map(item => <BtnLink key={item.label} item={item} />)}
                </div>

                {/* Contact */}
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 12px 4px' }}>Contacto directo</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                    {contacts.map(c => (
                        <a key={c.href} href={c.href} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 20px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', transition: 'opacity 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: c.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <c.icon size={18} color={c.color} />
                            </div>
                            <span style={{ color: T.white, fontWeight: 600, fontSize: '13px' }}>{c.label}</span>
                            <ArrowRight size={15} style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.25)' }} />
                        </a>
                    ))}
                </div>

                {/* Portal */}
                <Link to="/portal" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '13px', borderRadius: '16px', width: '100%',
                    border: `1px solid ${T.blue}40`, color: 'rgba(255,255,255,0.4)',
                    fontSize: '12px', fontWeight: 600, textDecoration: 'none',
                    background: 'transparent', marginBottom: '32px',
                }}>
                    <LogIn size={14} /> Portal de clientes
                </Link>

                {/* Footer */}
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>
                    © 2026 AgenciaSi · agenciasi.cl
                </p>
            </div>
        </div>
    )
}

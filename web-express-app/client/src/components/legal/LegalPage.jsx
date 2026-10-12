import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft } from 'lucide-react'
import { CARBON, CARBON_PANEL, AZUL_CONEXION } from '../../theme/brand'

const C = {
  blue: AZUL_CONEXION,
  black: '#f5f5fa',
  gray: '#9a9ab0',
  light: CARBON,
  panel: CARBON_PANEL,
  border: 'rgba(255,255,255,0.09)',
}

export default function LegalPage({ title, updated, children }) {
  return (
    <div style={{ fontFamily: 'var(--font-heading)', background: C.light, minHeight: '100vh', color: C.black }}>
      <Helmet>
        <title>{title} — AgenciaSI</title>
        <meta name="robots" content="index, follow" />
      </Helmet>

      <nav style={{ background: C.panel, padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            <ArrowLeft size={15} /> AgenciaSI
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 20px 80px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: C.black, marginBottom: 8 }}>{title}</h1>
        <p style={{ fontSize: 12, color: C.gray, marginBottom: 40 }}>Última actualización: {updated}</p>

        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 16, padding: '36px 32px' }}>
          {children}
        </div>

        <p style={{ fontSize: 12, color: C.gray, marginTop: 24 }}>
          ¿Preguntas sobre este documento? Escríbenos a <a href="mailto:contacto@agenciasi.cl" style={{ color: C.blue }}>contacto@agenciasi.cl</a>.
        </p>
      </div>
    </div>
  )
}

export function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: C.black, marginBottom: 10 }}>{title}</h2>
      <div style={{ fontSize: 14, color: '#c4c4d6', lineHeight: 1.8 }}>{children}</div>
    </section>
  )
}

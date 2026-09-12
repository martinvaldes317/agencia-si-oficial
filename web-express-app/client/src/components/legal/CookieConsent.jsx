import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const CONSENT_KEY = 'agenciasi_cookie_consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true)
    } catch { setVisible(true) }
  }, [])

  const accept = () => {
    try { localStorage.setItem(CONSENT_KEY, 'accepted') } catch { /* no-op */ }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', left: 16, right: 16, bottom: 16, zIndex: 200,
      maxWidth: 640, margin: '0 auto',
      background: '#0A0A0A', color: '#EDEDED', borderRadius: 14,
      padding: '18px 20px', boxShadow: '0 12px 40px rgba(0,0,0,.35)',
      display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14,
      fontFamily: "'Poppins', system-ui, sans-serif",
    }}>
      <p style={{ flex: '1 1 260px', fontSize: 12.5, lineHeight: 1.6, color: '#C9C9C9', margin: 0 }}>
        Usamos cookies propias y de terceros (Meta, Google) para analizar el uso del sitio y medir nuestras
        campañas publicitarias. Puedes revisar el detalle en nuestra{' '}
        <Link to="/politica-privacidad" style={{ color: '#8FD9FF', textDecoration: 'underline' }}>Política de Privacidad</Link>.
      </p>
      <button onClick={accept} style={{
        flexShrink: 0, background: '#22F2D8', color: '#0A0A0A', fontWeight: 800, fontSize: 13,
        padding: '10px 22px', borderRadius: 30, border: 'none', cursor: 'pointer',
      }}>
        Aceptar
      </button>
    </div>
  )
}

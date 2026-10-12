import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CARBON, AZUL_CONEXION, AZUL_NIEBLA } from '../../theme/brand'

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
      background: CARBON, color: '#EDEDED', borderRadius: 14,
      padding: '18px 20px', boxShadow: '0 12px 40px rgba(0,0,0,.35)',
      display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14,
      fontFamily: 'var(--font-heading)',
    }}>
      <p style={{ flex: '1 1 260px', fontSize: 12.5, lineHeight: 1.6, color: '#C9C9C9', margin: 0 }}>
        Usamos cookies propias y de terceros (Meta, Google) para analizar el uso del sitio y medir nuestras
        campañas publicitarias. Puedes revisar el detalle en nuestra{' '}
        <Link to="/politica-privacidad" style={{ color: AZUL_NIEBLA, textDecoration: 'underline' }}>Política de Privacidad</Link>.
      </p>
      <button onClick={accept} style={{
        flexShrink: 0, background: AZUL_CONEXION, color: '#F6F5F0', fontWeight: 800, fontSize: 13,
        padding: '10px 22px', borderRadius: 30, border: 'none', cursor: 'pointer',
      }}>
        Aceptar
      </button>
    </div>
  )
}

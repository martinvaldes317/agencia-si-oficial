import { Component } from 'react'
import { CARBON, AZUL_CONEXION } from '../theme/brand'

// Red de seguridad a nivel de toda la app: sin esto, cualquier error no
// capturado en el render (ej. un JSON.parse de un dato corrupto en
// localStorage) deja la pantalla completamente en blanco, en cualquier
// ruta del sitio, sin ninguna pista de qué pasó.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  handleReset = () => {
    try { localStorage.clear() } catch { /* no-op */ }
    window.location.href = '/'
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center',
        fontFamily: 'system-ui, sans-serif', background: CARBON, color: '#FFFFFF',
      }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Ocurrió un problema al cargar la página</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', maxWidth: 420, margin: 0 }}>
          Intenta recargar. Si el problema sigue, el botón de abajo limpia los datos guardados en tu navegador para este sitio.
        </p>
        <button onClick={this.handleReset} style={{
          background: AZUL_CONEXION, color: '#F6F5F0', fontWeight: 800, fontSize: 14,
          padding: '12px 24px', borderRadius: 10, border: 'none', cursor: 'pointer',
        }}>
          Recargar sitio
        </button>
      </div>
    )
  }
}

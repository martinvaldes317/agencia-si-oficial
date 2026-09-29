import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  Accessibility, Minus, Plus, AlignJustify, Contrast, Droplet,
  Link2, MousePointer2, BookOpen, Eye, Volume2, VolumeX, RotateCcw, X,
} from 'lucide-react'
import { useAccessibility } from './AccessibilityContext'

const PANEL = {
  bg: '#ffffff',
  ink: '#14141f',
  mut: '#6b6b80',
  border: '#e4e5ec',
  blue: '#2451c4',
  blueL: 'rgba(36,81,196,0.08)',
}

function Toggle({ icon: Icon, label, active, onClick }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      padding: '14px 10px', borderRadius: 14, cursor: 'pointer',
      background: active ? PANEL.blueL : PANEL.bg,
      border: `1.5px solid ${active ? PANEL.blue : PANEL.border}`,
      color: active ? PANEL.blue : PANEL.ink,
    }}>
      <Icon size={20} />
      <span style={{ fontSize: 12, fontWeight: 600, textAlign: 'center', lineHeight: 1.25 }}>{label}</span>
    </button>
  )
}

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const a11y = useAccessibility()

  useEffect(() => {
    if (!open) return
    const onClick = e => { if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false) }
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey) }
  }, [open])

  if (!a11y) return null
  const { settings, update, changeFontStep, reset, speaking, toggleReadAloud } = a11y

  return createPortal(
    <div id="agenciasi-a11y-widget" style={{ position: 'fixed', top: '50%', right: 18, transform: 'translateY(-50%)', zIndex: 998 }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Cerrar menú de accesibilidad' : 'Abrir menú de accesibilidad'}
        aria-expanded={open}
        style={{
          width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #3d5afe, #2451c4)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 22px rgba(36,81,196,.45)',
        }}
      >
        <Accessibility size={26} />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Menú de accesibilidad"
          style={{
            position: 'absolute', top: '50%', right: 64, transform: 'translateY(-50%)',
            width: 320, maxHeight: '86vh', overflowY: 'auto',
            background: PANEL.bg, color: PANEL.ink, borderRadius: 20,
            boxShadow: '0 24px 60px rgba(15,15,30,.28)', border: `1px solid ${PANEL.border}`,
          }}
        >
          <div style={{ background: 'linear-gradient(135deg, #3d5afe, #2451c4)', padding: '16px 20px', borderRadius: '20px 20px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff' }}>
              <Accessibility size={20} />
              <span style={{ fontWeight: 700, fontSize: 15 }}>Accesibilidad</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: .85, display: 'flex' }}>
              <X size={18} />
            </button>
          </div>

          <div style={{ padding: '18px 20px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: PANEL.mut, textTransform: 'uppercase', letterSpacing: .6, marginBottom: 8 }}>Tamaño del texto</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1.5px solid ${PANEL.border}`, borderRadius: 14, padding: '8px 12px', marginBottom: 18 }}>
              <button type="button" onClick={() => changeFontStep(-1)} disabled={settings.fontStep === 0} aria-label="Reducir texto"
                style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${PANEL.border}`, background: PANEL.bg, cursor: settings.fontStep === 0 ? 'default' : 'pointer', opacity: settings.fontStep === 0 ? .4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Minus size={14} />
              </button>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{['Normal', '+12%', '+25%', '+40%'][settings.fontStep]}</span>
              <button type="button" onClick={() => changeFontStep(1)} disabled={settings.fontStep === 3} aria-label="Aumentar texto"
                style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${PANEL.border}`, background: PANEL.bg, cursor: settings.fontStep === 3 ? 'default' : 'pointer', opacity: settings.fontStep === 3 ? .4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={14} />
              </button>
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: PANEL.mut, textTransform: 'uppercase', letterSpacing: .6, marginBottom: 8 }}>Visión y lectura</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 18 }}>
              <Toggle icon={Contrast} label="Alto contraste" active={settings.highContrast} onClick={() => update({ highContrast: !settings.highContrast })} />
              <Toggle icon={Droplet} label="Escala de grises" active={settings.grayscale} onClick={() => update({ grayscale: !settings.grayscale })} />
              <Toggle icon={Eye} label="Ayuda daltonismo" active={settings.colorBoost} onClick={() => update({ colorBoost: !settings.colorBoost })} />
              <Toggle icon={AlignJustify} label="Espaciado de texto" active={settings.spacing} onClick={() => update({ spacing: !settings.spacing })} />
              <Toggle icon={BookOpen} label="Fuente para dislexia" active={settings.dyslexiaFont} onClick={() => update({ dyslexiaFont: !settings.dyslexiaFont })} />
              <Toggle icon={Link2} label="Resaltar enlaces" active={settings.highlightLinks} onClick={() => update({ highlightLinks: !settings.highlightLinks })} />
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: PANEL.mut, textTransform: 'uppercase', letterSpacing: .6, marginBottom: 8 }}>Motriz y navegación</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 18 }}>
              <Toggle icon={MousePointer2} label="Cursor grande" active={settings.bigCursor} onClick={() => update({ bigCursor: !settings.bigCursor })} />
              <Toggle icon={speaking ? VolumeX : Volume2} label={speaking ? 'Detener lectura' : 'Leer en voz alta'} active={speaking} onClick={toggleReadAloud} />
            </div>

            <button type="button" onClick={reset} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '11px', borderRadius: 12, border: `1.5px solid ${PANEL.border}`, background: PANEL.bg,
              color: PANEL.mut, fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>
              <RotateCcw size={14} /> Restablecer todo
            </button>
            <p style={{ fontSize: 11, color: PANEL.mut, textAlign: 'center', margin: '12px 0 0', lineHeight: 1.5 }}>
              Herramienta propia de AgenciaSI. No reemplaza una auditoría de accesibilidad completa.
            </p>
          </div>
        </div>
      )}
    </div>,
    document.body
  )
}

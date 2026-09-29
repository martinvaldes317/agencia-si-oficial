import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'agenciasi-a11y'
export const FONT_SCALES = [1, 1.125, 1.25, 1.4]

const DEFAULTS = {
  fontStep: 0,          // índice en FONT_SCALES
  spacing: false,       // espaciado de letras/palabras/líneas
  highContrast: false,
  grayscale: false,
  highlightLinks: false,
  bigCursor: false,
  dyslexiaFont: false,
  colorBoost: false,    // ayuda genérica para daltonismo (satura + sube contraste de color)
}

const AccessibilityContext = createContext(null)

function loadSettings() {
  if (typeof window === 'undefined') return DEFAULTS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch { /* localStorage no disponible */ }
  return DEFAULTS
}

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings)
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    const root = document.documentElement

    // zoom (no transform) escala todo el layout de verdad, funciona igual con
    // los estilos en px fijos que usan casi todos los componentes del sitio.
    const scale = FONT_SCALES[settings.fontStep]
    root.style.zoom = scale !== 1 ? String(scale) : ''

    root.classList.toggle('a11y-spacing', settings.spacing)
    root.classList.toggle('a11y-highlight-links', settings.highlightLinks)
    root.classList.toggle('a11y-big-cursor', settings.bigCursor)
    root.classList.toggle('a11y-dyslexia-font', settings.dyslexiaFont)

    // contraste/grises/daltonismo se combinan en un solo filter (dos reglas
    // CSS con filter no se suman, la segunda pisa a la primera).
    const filters = []
    if (settings.highContrast) filters.push('contrast(1.3)')
    if (settings.grayscale) filters.push('grayscale(1)')
    if (settings.colorBoost) filters.push('saturate(1.7) contrast(1.15)')
    root.style.filter = filters.join(' ')

    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)) } catch { /* ignorar */ }
  }, [settings])

  // Al desmontar (navegación fuera de una SPA con full reload, etc.) no hace
  // falta limpiar: el próximo mount vuelve a aplicar desde localStorage.

  const update = useCallback((patch) => setSettings(s => ({ ...s, ...patch })), [])

  const changeFontStep = useCallback((dir) => {
    setSettings(s => ({ ...s, fontStep: Math.min(FONT_SCALES.length - 1, Math.max(0, s.fontStep + dir)) }))
  }, [])

  const reset = useCallback(() => {
    setSettings(DEFAULTS)
    try { window.speechSynthesis?.cancel() } catch { /* ignorar */ }
    setSpeaking(false)
  }, [])

  const toggleReadAloud = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    const text = document.body.innerText.replace(/\s+/g, ' ').trim().slice(0, 6000)
    if (!text) return
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'es-CL'
    utter.onend = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
    setSpeaking(true)
  }, [speaking])

  return (
    <AccessibilityContext.Provider value={{ settings, update, changeFontStep, reset, speaking, toggleReadAloud }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  return useContext(AccessibilityContext)
}

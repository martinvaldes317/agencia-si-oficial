import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'agenciasi-theme'
const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} })

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch { /* localStorage no disponible (modo privado, etc.) */ }
  return 'dark'
}

// Tema por defecto: oscuro (identidad de marca actual). El toggle es opt-in,
// no seguimos prefers-color-scheme para no sorprender a quien ya conoce el sitio.
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { window.localStorage.setItem(STORAGE_KEY, theme) } catch { /* ignorar */ }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

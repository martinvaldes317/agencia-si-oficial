import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'agenciasi-theme'
const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} })

// Sin preferencia guardada: modo día 07:00–21:00 hora de Chile continental,
// modo noche el resto — vía Intl con timeZone explícito, para que funcione
// igual sin importar dónde esté el visitante y sin tener que llevar la cuenta
// manual de los cambios de horario de verano de Chile.
function getTimeBasedTheme() {
  try {
    const hour = parseInt(
      new Intl.DateTimeFormat('en-US', { timeZone: 'America/Santiago', hour: 'numeric', hourCycle: 'h23' }).format(new Date()),
      10
    )
    return (hour >= 7 && hour < 21) ? 'light' : 'dark'
  } catch { /* Intl/timeZone no disponible */ }
  return 'dark'
}

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch { /* localStorage no disponible (modo privado, etc.) */ }
  return getTimeBasedTheme()
}

// Tema por defecto: según la hora de Chile (ver getTimeBasedTheme). El toggle
// es explícito y, una vez usado, la elección de la persona queda guardada y
// tiene prioridad sobre el horario en visitas futuras.
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark'
      try { window.localStorage.setItem(STORAGE_KEY, next) } catch { /* ignorar */ }
      return next
    })
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

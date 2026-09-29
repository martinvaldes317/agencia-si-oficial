import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeContext'

// Botón de tema reutilizable: hereda `color: currentColor`, así que toma el
// color de texto del header donde se lo use — sin diseño propio impuesto.
export default function ThemeToggle({ size = 17, style = {}, className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? 'Cambiar a modo noche' : 'Cambiar a modo día'}
      title={isLight ? 'Modo noche' : 'Modo día'}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size + 22,
        height: size + 22,
        borderRadius: '50%',
        border: '1px solid currentColor',
        background: 'transparent',
        color: 'inherit',
        opacity: 0.7,
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'opacity .2s ease',
        ...style,
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = 1 }}
      onMouseLeave={e => { e.currentTarget.style.opacity = style.opacity ?? 0.7 }}
    >
      {isLight ? <Moon size={size} /> : <Sun size={size} />}
    </button>
  )
}

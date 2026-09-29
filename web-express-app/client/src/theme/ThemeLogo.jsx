import { useTheme } from './ThemeContext'

// logo-dark.png = logo BLANCO (para fondos oscuros); logo-light.png = logo NEGRO (para fondos claros).
export default function ThemeLogo({ alt = 'AgenciaSi', ...props }) {
  const { theme } = useTheme()
  const src = theme === 'light' ? '/logo-light.png' : '/logo-dark.png'
  return <img src={src} alt={alt} {...props} />
}

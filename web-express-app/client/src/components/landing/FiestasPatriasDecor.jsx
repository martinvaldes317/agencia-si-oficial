import { useEffect, useState } from 'react'

// Paleta de temporada — SOLO para la landing de /sitio-web. No toca el tema
// T (navy/violeta/cyan) que usan el wizard, la confirmación y el recibo
// animado, ninguno de los cuales pidió cambiar de estilo.
// Disciplina de color: azul oscuro = base dominante (hace el rol que hacía
// el navy original), dorado = ÚNICO acento/CTA (rol que hacía el cyan), rojo
// = solo detalles pequeños (insignias, banderines, copihue) — nunca fondos
// grandes de sección. Mezclar los 3 colores de la bandera a partes iguales
// como bloques grandes es lo que hacía ver la página "de flyer de feria".
export const FP = {
  red:    '#B3272C',
  redD:   '#8C1F23',
  blue:   '#12235C',
  blueD:  '#0A1640',
  cream:  '#E9E8E4',
  wood:   '#7A4B2B',
  gold:   '#D4A24C',
  ink:    '#161022',
  grayTx: '#5B5750',
  grayLt: '#A79E90',
  border: '#DBD9D2',
}

// Assets reales (ilustraciones con textura halftone) provistos por el usuario
// — reemplazan los SVG hechos a mano donde hay un equivalente de mejor calidad.
export const IMG = {
  map:      '/img/fiestas-patrias/map-chile.png',
  rings:    '/img/fiestas-patrias/rings.png',
  divider:  '/img/fiestas-patrias/divider-stripe.png',
  flags:    '/img/fiestas-patrias/flags-crossed.png',
  sunburst: '/img/fiestas-patrias/sunburst.png',
  starsH:   '/img/fiestas-patrias/stars-pair-h.png',
  starsV:   '/img/fiestas-patrias/stars-pair-v.png',
}

export const fpStyles = `
  @keyframes fp-flag-wave {
    0%, 100% { transform: skewY(0deg) scaleY(1); }
    25%      { transform: skewY(-2.5deg) scaleY(.985); }
    50%      { transform: skewY(0deg) scaleY(1); }
    75%      { transform: skewY(2.5deg) scaleY(.985); }
  }
  .fp-flag-wave { animation: fp-flag-wave 3.4s ease-in-out infinite; transform-origin: 0% 50%; }
  @keyframes fp-sway {
    0%, 100% { transform: rotate(-4deg); }
    50%      { transform: rotate(4deg); }
  }
  .fp-sway { animation: fp-sway 2.6s ease-in-out infinite; transform-origin: top center; }
  @keyframes fp-bob {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-6px); }
  }
  .fp-bob { animation: fp-bob 3s ease-in-out infinite; }
`

// Bandera chilena ondeando (proporción 3:2), con asta simple.
export function WavingFlag({ size = 64 }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 100 75" style={{ overflow: 'visible' }}>
      <rect x="2" y="4" width="3" height="68" rx="1.5" fill="#8a8a8a" />
      <g className="fp-flag-wave">
        <rect x="5" y="7" width="90" height="30" fill="#FFFFFF" />
        <rect x="5" y="37" width="90" height="30" fill={FP.red} />
        <rect x="5" y="7" width="30" height="30" fill={FP.blue} />
        <path d="M20 15 L22.2 21.5 L29 21.5 L23.6 25.5 L25.6 32 L20 28 L14.4 32 L16.4 25.5 L11 21.5 L17.8 21.5 Z" fill="#FFFFFF" />
      </g>
    </svg>
  )
}

// Guirnalda de banderines (rojo/blanco/azul) colgando de un piolín.
export function Bunting({ count = 9, width = 320, height = 60 }) {
  const gap = width / (count - 1)
  const colors = [FP.red, '#FFFFFF', FP.blue]
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}>
      <path d={`M0,4 Q${width / 2},${height * 0.45} ${width},4`} stroke="rgba(0,0,0,.18)" strokeWidth="1.5" fill="none" />
      {Array.from({ length: count }).map((_, i) => {
        const t = i / (count - 1)
        const x = t * width
        const y = 4 + Math.sin(Math.PI * t) * (height * 0.45 - 4)
        const color = colors[i % colors.length]
        return (
          <g key={i} className="fp-sway" style={{ animationDelay: `${i * 0.12}s`, transformBox: 'fill-box' }}>
            <polygon points={`${x - 9},${y} ${x + 9},${y} ${x},${y + 22}`} fill={color} stroke={color === '#FFFFFF' ? FP.border : 'none'} strokeWidth={color === '#FFFFFF' ? 1 : 0} />
          </g>
        )
      })}
    </svg>
  )
}

// Copihue estilizado (flor nacional de Chile) — forma de campana colgante.
export function Copihue({ size = 46, style }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 40 52" style={{ overflow: 'visible', ...style }}>
      <path d="M20 2 C19 8 16 9 15 13" stroke="#3F7A3D" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M15 13 C11 12 8 9 6 6" stroke="#3F7A3D" strokeWidth="2" fill="none" strokeLinecap="round" />
      <g className="fp-sway" style={{ transformBox: 'fill-box', animationDuration: '3.4s' }}>
        <path
          d="M15 13
             C 6 15, 3 26, 8 37
             C 11 44, 19 49, 20 49
             C 21 49, 29 44, 32 37
             C 37 26, 34 15, 25 13
             C 22 12, 18 12, 15 13 Z"
          fill={FP.red}
        />
        <path
          d="M15 13 C 10 15, 7.5 22, 9 30 C 10.5 22, 13 16, 17 14 Z"
          fill="rgba(255,255,255,.22)"
        />
      </g>
    </svg>
  )
}

function useCountdownToSeptEnd() {
  const [remaining, setRemaining] = useState(null)
  useEffect(() => {
    const compute = () => {
      const now = new Date()
      const target = new Date(now.getFullYear(), 8, 30, 23, 59, 59) // mes 8 = septiembre
      const diff = target.getTime() - now.getTime()
      if (diff <= 0) { setRemaining({ expired: true }); return }
      setRemaining({
        expired: false,
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    compute()
    const id = setInterval(compute, 1000)
    return () => clearInterval(id)
  }, [])
  return remaining
}

function Unit({ value, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 40 }}>
      <span style={{ fontWeight: 800, fontSize: 18, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>{String(value).padStart(2, '0')}</span>
      <span style={{ fontSize: 9, color: 'rgba(255,255,255,.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5 }}>{label}</span>
    </div>
  )
}

// Banner de cuenta regresiva — solo temático (no cambia precios), termina el
// 30 de septiembre. Si ya pasó esa fecha (ej. viendo esto en otro mes), no
// muestra un contador negativo — se oculta a sí mismo.
export function FiestasPatriasCountdown() {
  const remaining = useCountdownToSeptEnd()
  if (!remaining || remaining.expired) return null
  return (
    <div style={{ background: `linear-gradient(90deg, ${FP.blueD}, ${FP.blue})`, padding: '9px 16px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: '#FFFFFF' }}>🇨🇱 Edición especial Fiestas Patrias</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Unit value={remaining.days} label="días" />
          <span style={{ color: 'rgba(255,255,255,.4)', fontWeight: 700 }}>:</span>
          <Unit value={remaining.hours} label="hrs" />
          <span style={{ color: 'rgba(255,255,255,.4)', fontWeight: 700 }}>:</span>
          <Unit value={remaining.minutes} label="min" />
          <span style={{ color: 'rgba(255,255,255,.4)', fontWeight: 700 }}>:</span>
          <Unit value={remaining.seconds} label="seg" />
        </div>
      </div>
    </div>
  )
}

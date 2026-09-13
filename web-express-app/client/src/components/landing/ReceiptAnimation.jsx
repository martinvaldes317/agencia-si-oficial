import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Loader2, Sparkle } from 'lucide-react'
import { T, fmt } from './SitioWebLanding'

// Genera un patrón de barras determinístico (mismo pedido → mismo "código de
// barras") solo decorativo, sin librerías — a partir de los caracteres del orderId.
function barcodeWidths(seed) {
  const chars = String(seed || 'AGENCIASI').split('')
  return chars.map((c, i) => 1 + ((c.charCodeAt(0) + i * 7) % 4))
}

// fmt() llama a n.toLocaleString() directo — con n undefined (pedido abierto
// desde otro dispositivo sin el resumen en localStorage) eso rompe la página.
const safe = n => (typeof n === 'number' ? fmt(n) : '—')

// Tiempos pensados para que se sienta una impresora real: una pausa procesando,
// luego el papel avanza LENTO y a velocidad constante (no un fade rápido).
const PROCESSING_MS = 1100
const FEED_MS = 2600

export default function ReceiptAnimation({ summary, orderId, status = 'approved', onDone }) {
  const [stage, setStage] = useState('processing') // processing → printing → complete

  const rejected = status === 'rejected'

  useEffect(() => {
    const t1 = setTimeout(() => setStage('printing'), PROCESSING_MS)
    const t2 = setTimeout(() => { setStage('complete'); onDone?.() }, PROCESSING_MS + FEED_MS)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const total = summary?.montoTotal
  const neto = summary?.montoNeto
  const iva = summary?.montoIva
  const fecha = new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
  const feeding = stage !== 'processing'
  const bars = barcodeWidths(orderId)
  const accent = rejected ? '#D9333F' : T.cyan

  return (
    <div style={{ maxWidth: 360, margin: '0 auto', background: T.light, borderRadius: 24, padding: '30px 20px 24px' }}>
      <style>{`
        @keyframes swl-receipt-spin { to { transform: rotate(360deg); } }
        .swl-receipt-spin { animation: swl-receipt-spin .8s linear infinite; }
        @keyframes swl-receipt-pop { from { transform: scale(.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .swl-receipt-check { animation: swl-receipt-pop .35s cubic-bezier(.34,1.56,.64,1); }
        @keyframes swl-receipt-blink { 0%, 100% { opacity: .35; } 50% { opacity: .9; } }
        .swl-receipt-led { animation: swl-receipt-blink 1.1s ease-in-out infinite; }
      `}</style>

      <div style={{ maxWidth: 300, margin: '0 auto' }}>
      {/* Cuerpo de la impresora */}
      <div style={{
        position: 'relative', zIndex: 2, background: `linear-gradient(180deg, ${T.navy2 || '#12134A'} 0%, ${T.navy} 100%)`,
        borderRadius: '20px 20px 10px 10px', padding: '18px 20px 16px',
        boxShadow: '0 22px 34px -12px rgba(10,11,46,.45), 0 8px 14px -6px rgba(10,11,46,.25), inset 0 1px 0 rgba(255,255,255,.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkle size={11} color={T.cyan} fill={T.cyan} />
            </div>
            <span style={{ color: 'rgba(255,255,255,.55)', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>AgenciaSI</span>
          </div>
          <div className={stage !== 'complete' ? 'swl-receipt-led' : ''} style={{ width: 7, height: 7, borderRadius: 999, background: stage === 'complete' ? (rejected ? '#D9333F' : '#22C55E') : '#F5B400' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12 }}>
          <div>
            <div style={{ color: T.white, fontWeight: 800, fontSize: 15 }}>Sitio Web Profesional</div>
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 12 }}>Pago único{summary?.wantsStore ? ' + Tienda Online' : ''}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 10, textTransform: 'uppercase', letterSpacing: .5 }}>Total</div>
            <div style={{ color: accent, fontWeight: 800, fontSize: 17 }}>${safe(total)}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,.85)', fontSize: 13, fontWeight: 600, marginBottom: 18 }}>
          {stage === 'complete'
            ? (rejected
              ? <XCircle size={16} color="#D9333F" className="swl-receipt-check" />
              : <CheckCircle2 size={16} color="#22C55E" className="swl-receipt-check" />)
            : <Loader2 size={16} className="swl-receipt-spin" />}
          <span>
            {stage === 'processing' && (rejected ? 'Verificando tu pago' : 'Procesando tu pedido')}
            {stage === 'printing' && (rejected ? 'Imprimiendo tu comprobante' : 'Imprimiendo tu comprobante')}
            {stage === 'complete' && (rejected ? 'Pago rechazado' : 'Pedido confirmado')}
          </span>
        </div>

        {/* Ranura de salida del papel */}
        <div style={{
          height: 8, borderRadius: 4, margin: '0 4px',
          background: '#050516',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,.6), inset 0 -1px 0 rgba(255,255,255,.05)',
        }} />
      </div>

      {/* Papel saliendo de la ranura */}
      <div style={{
        overflow: 'hidden',
        maxHeight: feeding ? 520 : 0,
        transition: `max-height ${FEED_MS}ms linear`,
      }}>
        <div style={{
          position: 'relative',
          background: '#FFFFFF',
          border: `1px solid rgba(10,11,46,.08)`,
          padding: '20px 20px 20px',
          boxShadow: '0 24px 30px -14px rgba(10,11,46,.30), 0 4px 10px rgba(10,11,46,.08)',
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 96%, 95% 100%, 90% 96%, 85% 100%, 80% 96%, 75% 100%, 70% 96%, 65% 100%, 60% 96%, 55% 100%, 50% 96%, 45% 100%, 40% 96%, 35% 100%, 30% 96%, 25% 100%, 20% 96%, 15% 100%, 10% 96%, 5% 100%, 0% 96%)',
        }}>
          {/* Sombra del pliegue justo donde el papel sale de la ranura */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 16, background: 'linear-gradient(180deg, rgba(10,11,46,.14), transparent)' }} />

          {rejected && stage === 'complete' && (
            <div style={{
              position: 'absolute', top: '38%', left: '50%',
              transform: 'translate(-50%, -50%) rotate(-14deg)',
              border: '3px solid #D9333F', color: '#D9333F', opacity: .55,
              fontWeight: 900, fontSize: 22, letterSpacing: 2, textTransform: 'uppercase',
              padding: '4px 14px', borderRadius: 8, pointerEvents: 'none',
            }}>
              Rechazado
            </div>
          )}
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <span style={{ fontWeight: 800, color: T.navy, fontSize: 13, letterSpacing: 1 }}>AGENCIA<span style={{ color: T.violet }}>SI</span></span>
          </div>
          <div style={{ borderTop: `1px dashed ${T.border}` }} />
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12.5, color: T.navy, padding: '14px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>SITIO WEB PROFESIONAL</span>
              <span>${safe(neto)}</span>
            </div>
          </div>
          <div style={{ borderTop: `1px dashed ${T.border}` }} />
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12.5, color: T.gray, padding: '14px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>${safe(neto)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>IVA</span><span>${safe(iva)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: rejected ? '#D9333F' : T.navy, fontWeight: 700, fontSize: 13.5, marginTop: 4 }}>
              <span>{rejected ? 'TOTAL NO COBRADO' : 'TOTAL PAGADO'}</span><span>${safe(total)}</span>
            </div>
          </div>
          <div style={{ borderTop: `1px dashed ${T.border}` }} />
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: T.gray, padding: '14px 0 4px', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Pedido</span><span style={{ color: T.navy }}>{orderId || '—'}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Fecha</span><span style={{ color: T.navy }}>{fecha}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Estado</span><span style={{ color: rejected ? '#D9333F' : '#1B8A4A', fontWeight: 700 }}>{rejected ? 'RECHAZADO' : 'APROBADO'}</span></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 2, marginTop: 14, height: 28 }}>
            {bars.map((w, i) => (
              <div key={i} style={{ width: w, height: '100%', background: T.navy, opacity: .85 }} />
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

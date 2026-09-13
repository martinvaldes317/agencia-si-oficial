import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { T, fmt } from './SitioWebLanding'

// Genera un patrón de barras determinístico (mismo pedido → mismo "código de
// barras") solo decorativo, sin librerías — a partir de los caracteres del orderId.
function barcodeWidths(seed) {
  const chars = String(seed || 'AGENCIASI').split('')
  return chars.map((c, i) => 1 + ((c.charCodeAt(0) + i * 7) % 4))
}

export default function ReceiptAnimation({ summary, orderId, onDone }) {
  const [stage, setStage] = useState('processing') // processing → printing → complete

  useEffect(() => {
    const t1 = setTimeout(() => setStage('printing'), 900)
    const t2 = setTimeout(() => { setStage('complete'); onDone?.() }, 2000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const total = summary?.montoTotal
  const neto = summary?.montoNeto
  const iva = summary?.montoIva
  const fecha = new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
  const revealed = stage !== 'processing'
  const bars = barcodeWidths(orderId)

  return (
    <div style={{ maxWidth: 340, margin: '0 auto' }}>
      <style>{`
        @keyframes swl-receipt-spin { to { transform: rotate(360deg); } }
        .swl-receipt-spin { animation: swl-receipt-spin .8s linear infinite; }
        @keyframes swl-receipt-pop { from { transform: scale(.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .swl-receipt-check { animation: swl-receipt-pop .35s cubic-bezier(.34,1.56,.64,1); }
      `}</style>

      {/* Tarjeta de estado */}
      <div style={{ position: 'relative', zIndex: 2, background: T.navy, borderRadius: 18, padding: '20px 22px', boxShadow: '0 16px 40px rgba(10,11,46,.22)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12 }}>
          <div>
            <div style={{ color: T.white, fontWeight: 800, fontSize: 15 }}>Sitio Web Profesional</div>
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 12 }}>Pago único{summary?.wantsStore ? ' + Tienda Online' : ''}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 10, textTransform: 'uppercase', letterSpacing: .5 }}>Total</div>
            <div style={{ color: T.cyan, fontWeight: 800, fontSize: 17 }}>${fmt(total)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,.85)', fontSize: 13, fontWeight: 600 }}>
          {stage === 'complete'
            ? <CheckCircle2 size={16} color="#22C55E" className="swl-receipt-check" />
            : <Loader2 size={16} className="swl-receipt-spin" />}
          <span>
            {stage === 'processing' && 'Procesando tu pedido'}
            {stage === 'printing' && 'Preparando tu comprobante'}
            {stage === 'complete' && 'Pedido confirmado'}
          </span>
        </div>
      </div>

      {/* Comprobante */}
      <div style={{
        overflow: 'hidden',
        maxHeight: revealed ? 480 : 0,
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(-14px)',
        transition: 'max-height .65s cubic-bezier(.16,1,.3,1), opacity .4s ease .1s, transform .65s cubic-bezier(.16,1,.3,1)',
      }}>
        <div style={{
          marginTop: 4,
          background: T.white,
          padding: '22px 22px 20px',
          boxShadow: '0 12px 24px rgba(10,11,46,.12)',
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 96%, 95% 100%, 90% 96%, 85% 100%, 80% 96%, 75% 100%, 70% 96%, 65% 100%, 60% 96%, 55% 100%, 50% 96%, 45% 100%, 40% 96%, 35% 100%, 30% 96%, 25% 100%, 20% 96%, 15% 100%, 10% 96%, 5% 100%, 0% 96%)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <span style={{ fontWeight: 800, color: T.navy, fontSize: 13, letterSpacing: 1 }}>AGENCIA<span style={{ color: T.violet }}>SI</span></span>
          </div>
          <div style={{ borderTop: `1px dashed ${T.border}` }} />
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12.5, color: T.navy, padding: '14px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>SITIO WEB PROFESIONAL</span>
              <span>${fmt(neto)}</span>
            </div>
          </div>
          <div style={{ borderTop: `1px dashed ${T.border}` }} />
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12.5, color: T.gray, padding: '14px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>${fmt(neto)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>IVA</span><span>${fmt(iva)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: T.navy, fontWeight: 700, fontSize: 13.5, marginTop: 4 }}><span>TOTAL PAGADO</span><span>${fmt(total)}</span></div>
          </div>
          <div style={{ borderTop: `1px dashed ${T.border}` }} />
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: T.gray, padding: '14px 0 4px', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Pedido</span><span style={{ color: T.navy }}>{orderId}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Fecha</span><span style={{ color: T.navy }}>{fecha}</span></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 2, marginTop: 14, height: 28 }}>
            {bars.map((w, i) => (
              <div key={i} style={{ width: w, height: '100%', background: T.navy, opacity: .85 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { CheckCircle2, Clock, XCircle, Code2, ArrowRight } from 'lucide-react'
import { T, WA_BASE, WaIcon, fmt, px, ga, pxPageView } from './SitioWebLanding'

export default function SitioWebConfirmacion() {
  const [params] = useSearchParams()
  const [summary, setSummary] = useState(null)

  // Mercado Pago can send the literal string "null" for every param (e.g. when
  // the customer cancels before picking a payment method) — that's truthy in
  // JS, so treating it as "no status" would have fallen through to "success".
  const rawStatus = params.get('collection_status') || params.get('status')
  const collectionStatus = rawStatus && rawStatus !== 'null' ? rawStatus : null
  const orderIdFromUrl = params.get('external_reference') || params.get('orderId')

  const isApproved = collectionStatus === 'approved'
  const isPending = collectionStatus === 'pending' || collectionStatus === 'in_process'
  // Fail closed: only an explicit "approved" counts as success. Anything else —
  // rejected, cancelled, missing, or garbage params — is treated as NOT paid,
  // instead of defaulting to a success message we can't actually prove.
  const isFailure = !isApproved && !isPending
  const hasOrderContext = !!orderIdFromUrl

  useEffect(() => {
    pxPageView()

    let parsed = null
    try {
      const raw = localStorage.getItem('agenciasi_last_web_order')
      if (raw) {
        parsed = JSON.parse(raw)
        if (!orderIdFromUrl || parsed.orderId === orderIdFromUrl) setSummary(parsed)
        else parsed = null // localStorage summary belongs to a different order — don't use it below
      }
    } catch { /* no-op */ }

    if (isApproved) {
      const orderId = orderIdFromUrl || parsed?.orderId
      // Same event_name + event_id as the server-side Purchase sent from the
      // Mercado Pago webhook, so Meta dedupes browser + server into one event.
      px('Purchase', { value: parsed?.montoTotal, currency: 'CLP', content_name: 'Sitio Web Profesional' }, orderId)
      ga('purchase', { value: parsed?.montoTotal, currency: 'CLP', transaction_id: orderId })
    }
  }, [])

  const WA = `${WA_BASE}${encodeURIComponent(`Hola, mi número de pedido es ${orderIdFromUrl || summary?.orderId || ''}. Necesito ayuda con mi sitio web.`)}`

  return (
    <div style={{ fontFamily: "'Poppins', system-ui, sans-serif", background: T.light, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Helmet>
        <title>Confirmación de tu pedido — AgenciaSI</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div style={{ background: T.navy, padding: '16px 20px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', maxWidth: 720, margin: '0 auto' }}>
          <div style={{ background: T.cyan, borderRadius: 7, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Code2 size={13} color={T.navy} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 14, color: T.white }}>AgenciaSI</span>
        </Link>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ maxWidth: 520, width: '100%', background: T.white, borderRadius: 20, padding: '40px 32px', textAlign: 'center', boxShadow: '0 20px 60px rgba(10,11,46,.10)' }}>

          {isFailure ? (
            <>
              <XCircle size={54} color="#D9333F" style={{ marginBottom: 16 }} />
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, color: T.navy, marginBottom: 10 }}>
                {hasOrderContext ? 'Tu pago no se completó' : 'No encontramos tu pedido'}
              </h1>
              <p style={{ fontSize: 14, color: T.gray, lineHeight: 1.7, marginBottom: 28 }}>
                {hasOrderContext
                  ? 'Tu proyecto quedó registrado, pero el pago fue rechazado o se canceló antes de completarse. Escríbenos por WhatsApp y te ayudamos a completar tu pedido.'
                  : 'Este enlace no tiene la información de un pedido. Si acabas de completar el formulario, vuelve a intentarlo o escríbenos por WhatsApp.'}
              </p>
            </>
          ) : isPending ? (
            <>
              <Clock size={54} color="#B98900" style={{ marginBottom: 16 }} />
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, color: T.navy, marginBottom: 10 }}>Tu pago está pendiente de confirmación</h1>
              <p style={{ fontSize: 14, color: T.gray, lineHeight: 1.7, marginBottom: 28 }}>
                Apenas se confirme, comenzaremos a trabajar en tu proyecto. Te avisaremos por correo y WhatsApp.
              </p>
            </>
          ) : (
            <>
              <CheckCircle2 size={54} color={T.violet} style={{ marginBottom: 16 }} />
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: T.navy, marginBottom: 10 }}>¡Listo! Ya recibimos tu proyecto</h1>
              <p style={{ fontSize: 14, color: T.gray, lineHeight: 1.7, marginBottom: 28 }}>
                Gracias por confiar en AgenciaSI. Nuestro equipo revisará la información que nos enviaste y nos pondremos en contacto contigo para comenzar el desarrollo.
              </p>
            </>
          )}

          <div style={{ background: T.light, borderRadius: 14, padding: '18px 20px', textAlign: 'left', marginBottom: 26 }}>
            <SummaryLine label="N° de solicitud" value={orderIdFromUrl || summary?.orderId || '—'} />
            {summary?.contactName && <SummaryLine label="Nombre" value={summary.contactName} />}
            <SummaryLine label="Servicio" value={`Sitio Web Profesional${summary?.wantsStore ? ' + Tienda Online' : ''}`} />
            {summary?.montoTotal && <SummaryLine label="Total" value={`$${fmt(summary.montoTotal)}`} />}
            {summary?.email && <SummaryLine label="Correo" value={summary.email} />}
            {summary?.whatsapp && <SummaryLine label="WhatsApp" value={summary.whatsapp} />}
          </div>

          {!isFailure && <p style={{ fontSize: 12, color: T.grayLt, marginBottom: 26 }}>También enviamos el resumen de tu compra a tu correo.</p>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#25D366', color: '#fff', fontWeight: 800, fontSize: 14, padding: '14px', borderRadius: 12, textDecoration: 'none' }}>
              <WaIcon size={16} /> Hablar con AgenciaSI
            </a>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: T.gray, fontWeight: 700, fontSize: 13, textDecoration: 'none', padding: '10px' }}>
              Volver al inicio <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryLine({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '5px 0', fontSize: 13 }}>
      <span style={{ color: T.gray, fontWeight: 600 }}>{label}</span>
      <span style={{ color: T.navy, fontWeight: 700, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

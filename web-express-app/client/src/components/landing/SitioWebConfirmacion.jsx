import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Clock, XCircle, Code2, ArrowRight, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { T, WA_BASE, WaIcon, fmt, px, ga, pxPageView } from './SitioWebLanding'
import ReceiptAnimation from './ReceiptAnimation'

export default function SitioWebConfirmacion() {
  const [params] = useSearchParams()
  const [summary, setSummary] = useState(null)
  const [animDone, setAnimDone] = useState(false)
  const [accessEmail, setAccessEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [pwdConfirm, setPwdConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [clientReady, setClientReady] = useState(false)

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
        if (!orderIdFromUrl || parsed.orderId === orderIdFromUrl) {
          setSummary(parsed)
          if (parsed.email) setAccessEmail(parsed.email)
        }
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

  const handleCreateAccess = async (e) => {
    e.preventDefault()
    setCreateError('')
    if (pwd.length < 6) return setCreateError('La contraseña debe tener al menos 6 caracteres.')
    if (pwd !== pwdConfirm) return setCreateError('Las contraseñas no coinciden.')
    setCreating(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const orderId = orderIdFromUrl || summary?.orderId
      const res = await fetch(`${apiUrl}/api/web-orders/${orderId}/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: accessEmail, password: pwd }),
      })
      const d = await res.json()
      if (!d.success) throw new Error(d.message || 'No pudimos crear tu acceso.')
      localStorage.setItem('clientToken', d.token)
      localStorage.setItem('clientData', JSON.stringify(d.client))
      setClientReady(true)
    } catch (err) {
      setCreateError(err.message)
    } finally {
      setCreating(false)
    }
  }

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

          {isApproved ? (
            <>
              <ReceiptAnimation summary={summary} orderId={orderIdFromUrl || summary?.orderId} onDone={() => setAnimDone(true)} />

              <div style={{
                overflow: 'hidden',
                maxHeight: animDone ? 600 : 0,
                opacity: animDone ? 1 : 0,
                transition: 'max-height .5s cubic-bezier(.16,1,.3,1), opacity .4s ease .15s',
              }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 800, color: T.navy, margin: '26px 0 6px' }}>
                  {clientReady ? '¡Tu portal ya está listo!' : '¡Listo! Ya recibimos tu proyecto'}
                </h1>
                <p style={{ fontSize: 13, color: T.gray, lineHeight: 1.6, marginBottom: 20 }}>
                  {clientReady
                    ? 'Ya puedes entrar a seguir el avance de tu sitio cuando quieras.'
                    : 'Crea tu contraseña para seguir el avance de tu proyecto desde tu portal — o si prefieres, sigue por WhatsApp.'}
                </p>

                {!clientReady && (
                  <form onSubmit={handleCreateAccess} style={{ textAlign: 'left', background: T.light, borderRadius: 14, padding: 18, marginBottom: 18 }}>
                    {createError && <p style={{ color: '#D9333F', fontSize: 12.5, marginBottom: 10, fontWeight: 600 }}>{createError}</p>}
                    <label style={{ fontSize: 11, fontWeight: 700, color: T.gray, textTransform: 'uppercase', letterSpacing: .5, display: 'block', marginBottom: 5 }}>Correo</label>
                    <input type="email" required value={accessEmail} onChange={e => setAccessEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      style={{ width: '100%', border: `1px solid ${T.border}`, borderRadius: 10, padding: '11px 12px', fontSize: 13.5, marginBottom: 12, background: T.white, boxSizing: 'border-box' }} />
                    <label style={{ fontSize: 11, fontWeight: 700, color: T.gray, textTransform: 'uppercase', letterSpacing: .5, display: 'block', marginBottom: 5 }}>Crea tu contraseña</label>
                    <div style={{ position: 'relative', marginBottom: 10 }}>
                      <Lock size={14} color={T.grayLt} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                      <input type={showPwd ? 'text' : 'password'} required minLength={6} value={pwd} onChange={e => setPwd(e.target.value)}
                        placeholder="Mínimo 6 caracteres" autoComplete="new-password"
                        style={{ width: '100%', border: `1px solid ${T.border}`, borderRadius: 10, padding: '11px 38px', fontSize: 13.5, background: T.white, boxSizing: 'border-box' }} />
                      <button type="button" onClick={() => setShowPwd(s => !s)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: T.grayLt, padding: 4 }}>
                        {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    <input type="password" required value={pwdConfirm} onChange={e => setPwdConfirm(e.target.value)}
                      placeholder="Repite la contraseña" autoComplete="new-password"
                      style={{ width: '100%', border: `1px solid ${T.border}`, borderRadius: 10, padding: '11px 12px', fontSize: 13.5, marginBottom: 14, background: T.white, boxSizing: 'border-box' }} />
                    <button type="submit" disabled={creating}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: T.violet, color: T.white, fontWeight: 800, fontSize: 14, padding: '13px', borderRadius: 10, border: 'none', cursor: 'pointer', opacity: creating ? .7 : 1 }}>
                      {creating ? <Loader2 size={15} className="swl-conf-spin" /> : 'Crear contraseña y ver mi portal'}
                    </button>
                    <style>{'@keyframes swl-conf-spin{to{transform:rotate(360deg)}} .swl-conf-spin{animation:swl-conf-spin .8s linear infinite}'}</style>
                  </form>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {clientReady && (
                    <button onClick={() => { window.location.href = '/portal/dashboard' }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: T.violet, color: T.white, fontWeight: 800, fontSize: 14, padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer' }}>
                      Ir a mi portal <ArrowRight size={15} />
                    </button>
                  )}
                  <a href={WA} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: clientReady ? T.light : '#25D366', color: clientReady ? T.navy : '#fff', fontWeight: 800, fontSize: 14, padding: '14px', borderRadius: 12, textDecoration: 'none', border: clientReady ? `1px solid ${T.border}` : 'none' }}>
                    <WaIcon size={16} /> {clientReady ? 'Seguir por WhatsApp' : 'Prefiero seguir por WhatsApp'}
                  </a>
                </div>
                <p style={{ fontSize: 12, color: T.grayLt, margin: '18px 0 0' }}>También enviamos el resumen de tu compra a tu correo.</p>
              </div>
            </>
          ) : (
            <>
              {isFailure ? (
                hasOrderContext ? (
                  <>
                    <ReceiptAnimation summary={summary} orderId={orderIdFromUrl || summary?.orderId} status="rejected" />
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: T.navy, margin: '24px 0 8px' }}>Tu pago no se completó</h1>
                    <p style={{ fontSize: 14, color: T.gray, lineHeight: 1.7, marginBottom: 28 }}>
                      Tu proyecto quedó registrado, pero el pago fue rechazado o se canceló antes de completarse. Escríbenos por WhatsApp y te ayudamos a completar tu pedido.
                    </p>
                  </>
                ) : (
                  <>
                    <XCircle size={54} color="#D9333F" style={{ marginBottom: 16 }} />
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, color: T.navy, marginBottom: 10 }}>No encontramos tu pedido</h1>
                    <p style={{ fontSize: 14, color: T.gray, lineHeight: 1.7, marginBottom: 28 }}>
                      Este enlace no tiene la información de un pedido. Si acabas de completar el formulario, vuelve a intentarlo o escríbenos por WhatsApp.
                    </p>
                  </>
                )
              ) : (
                <>
                  <Clock size={54} color="#B98900" style={{ marginBottom: 16 }} />
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, color: T.navy, marginBottom: 10 }}>Tu pago está pendiente de confirmación</h1>
                  <p style={{ fontSize: 14, color: T.gray, lineHeight: 1.7, marginBottom: 28 }}>
                    Apenas se confirme, comenzaremos a trabajar en tu proyecto. Te avisaremos por correo y WhatsApp.
                  </p>
                </>
              )}

              <div style={{ background: T.light, borderRadius: 14, padding: '18px 20px', textAlign: 'left', marginBottom: 26 }}>
                {!(isFailure && hasOrderContext) && (
                  <>
                    <SummaryLine label="N° de solicitud" value={orderIdFromUrl || summary?.orderId || '—'} />
                    <SummaryLine label="Servicio" value={`Sitio Web Profesional${summary?.wantsStore ? ' + Tienda Online' : ''}`} />
                    {summary?.montoTotal && <SummaryLine label="Total" value={`$${fmt(summary.montoTotal)}`} />}
                  </>
                )}
                {summary?.contactName && <SummaryLine label="Nombre" value={summary.contactName} />}
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
            </>
          )}
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

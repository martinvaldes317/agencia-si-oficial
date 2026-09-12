import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ArrowLeft, ArrowRight, Check, Upload, X, Loader2, Store,
  ShieldCheck, Code2, ChevronDown, Smartphone, Copy, CheckCheck, Mail,
} from 'lucide-react'
import { T, WA_BASE, PRICE_ONLINE, PRICE_STORE, SECTIONS_INCLUDED, PRICE_EXTRA_SECTION, WaIcon, fmt, px, ga, pxPageView } from './SitioWebLanding'
import { CHILE_REGIONES, comunasDeRegion } from '../../data/chileRegiones'

const TOTAL_STEPS = 6
const DRAFT_KEY = 'agenciasi_sitio_web_draft'

const SECCIONES_OPCIONES = [
  'Inicio', 'Nosotros', 'Servicios', 'Productos', 'Galería',
  'Proyectos', 'Preguntas frecuentes', 'Contacto', 'Ubicación', 'Otra',
]

// Mostrados en rotación mientras se procesa el pedido (justo antes de
// redirigir a Mercado Pago) — datos con fuente real, no cifras inventadas.
const TRUST_MESSAGES = [
  '9 de cada 10 personas buscan en Google antes de decidir comprarle a un negocio.',
  'Más del 90% de los consumidores revisa internet antes de visitar un negocio que no conoce (BrightLocal).',
  'El 83% de las pymes ya tiene su propio sitio web (Clutch, 2025).',
  'Cerca de 1 de cada 3 búsquedas en Google tiene intención de encontrar un negocio cercano.',
  'Estamos preparando tu proyecto — esto toma solo unos segundos.',
]

const initialData = {
  firstName: '', lastName: '', email: '', personalWhatsapp: '',
  companyName: '', rut: '', razonSocial: '',
  rubro: '', about: '',
  hasLogo: null, hasPhotos: null,
  secciones: [], otraSeccion: '',
  businessWhatsapp: '', publicEmail: '', address: '', comuna: '', region: '', wantsMaps: null,
  instagram: '', facebook: '', tiktok: '', youtube: '', otherSocial: '',
  hasDomain: null, domainWanted: '', domainExisting: '',
  wantsStore: null, productCount: '', hasMercadoPago: null,
  aceptaCondiciones: false,
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return initialData
    return { ...initialData, ...JSON.parse(raw) }
  } catch { return initialData }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

// ── Format helpers ───────────────────────────────────────────────────────────
// Phones: only digits, with an optional single leading "+" — strips anything
// else as the user types instead of just rejecting the whole field on submit.
function sanitizePhone(value) {
  let v = value.replace(/[^\d+]/g, '')
  const hasPlus = v.startsWith('+')
  v = v.replace(/\+/g, '')
  return (hasPlus ? '+' : '') + v
}
const PHONE_RE = /^\+?\d{8,15}$/

function sanitizeRut(value) {
  return value.replace(/[^\dkK.-]/g, '').toUpperCase()
}
function isValidRut(value) {
  const cleaned = value.replace(/\./g, '').trim()
  return /^\d{7,8}-[\dK]$/.test(cleaned)
}

const EMAIL_RE = /^\S+@\S+\.\S+$/
const DOMAIN_RE = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/
function sanitizeDomain(value) {
  return value.toLowerCase().replace(/\s+/g, '').replace(/^https?:\/\//, '').replace(/\/.*$/, '')
}

// ── UI primitives ──────────────────────────────────────────────────────────
function Field({ label, sub, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontWeight: 700, fontSize: 13, color: T.navy, marginBottom: 6 }}>{label}</label>
      {sub && <div style={{ fontSize: 12, color: T.gray, marginBottom: 8 }}>{sub}</div>}
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '13px 16px', fontSize: 14, borderRadius: 12,
  border: `1.5px solid ${T.border}`, fontFamily: 'inherit', color: T.navy,
  outline: 'none', boxSizing: 'border-box', background: T.white,
}

function TextInput(props) {
  return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} onFocus={e => e.target.style.borderColor = T.violet} onBlur={e => e.target.style.borderColor = T.border} />
}

function TextArea(props) {
  return <textarea {...props} rows={props.rows || 3} style={{ ...inputStyle, resize: 'vertical', ...(props.style || {}) }} onFocus={e => e.target.style.borderColor = T.violet} onBlur={e => e.target.style.borderColor = T.border} />
}

function SelectInput({ children, ...props }) {
  return (
    <select {...props} style={{ ...inputStyle, appearance: 'auto', cursor: 'pointer' }}
      onFocus={e => e.target.style.borderColor = T.violet} onBlur={e => e.target.style.borderColor = T.border}>
      {children}
    </select>
  )
}

function ChoiceCard({ selected, onClick, children, style }) {
  return (
    <div onClick={onClick} style={{
      cursor: 'pointer', flex: 1, textAlign: 'center', padding: '18px 16px', borderRadius: 14,
      border: `2px solid ${selected ? T.violet : T.border}`, background: selected ? `${T.violet}0D` : T.white,
      fontWeight: 700, fontSize: 14, color: selected ? T.violet : T.navy, transition: 'all .15s', ...style,
    }}>
      {children}
    </div>
  )
}

function SeccionChip({ selected, extra, onClick, children }) {
  const showExtraBadge = extra && !selected
  return (
    <div onClick={onClick} style={{
      cursor: 'pointer', padding: '12px 18px', borderRadius: 30,
      border: `2px solid ${selected ? T.violet : showExtraBadge ? '#B98900' : T.border}`,
      background: selected ? T.violet : T.white,
      color: selected ? T.white : T.navy, fontWeight: 700, fontSize: 13,
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>
      {selected && <Check size={13} />} {children}
      {showExtraBadge && <span style={{ fontSize: 10, fontWeight: 800, color: '#B98900' }}>+${fmt(PRICE_EXTRA_SECTION)}</span>}
    </div>
  )
}

function ErrorMsg({ children }) {
  if (!children) return null
  return <div style={{ color: '#D9333F', fontSize: 12, fontWeight: 600, marginTop: 6 }}>{children}</div>
}

function StepTitle({ children }) {
  return <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 800, color: T.navy, marginBottom: 26 }}>{children}</h2>
}

// ── Main component ──────────────────────────────────────────────────────────
export default function SitioWebWizard() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState(loadDraft)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [showTerms, setShowTerms] = useState(false)
  const [logoFile, setLogoFile] = useState(null)
  const [photoFiles, setPhotoFiles] = useState([])
  const [trustMsgIndex, setTrustMsgIndex] = useState(0)
  const [resumeOpen, setResumeOpen] = useState(false)
  const [resumeLink, setResumeLink] = useState('')
  const [savingDraft, setSavingDraft] = useState(false)
  const [draftError, setDraftError] = useState('')
  const [copied, setCopied] = useState(false)
  const [loadingResume, setLoadingResume] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
  }, [data])

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [step])
  useEffect(() => { pxPageView() }, [])

  // Retomar un borrador guardado en otro dispositivo (?resume=token)
  useEffect(() => {
    const token = searchParams.get('resume')
    if (!token) return
    setLoadingResume(true)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    fetch(`${apiUrl}/api/web-orders/draft/${token}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setData(d => ({ ...d, ...json.data }))
          setStep(json.step || 1)
        } else {
          setDraftError('Este enlace ya no está disponible. Puedes continuar desde aquí.')
        }
      })
      .catch(() => setDraftError('No pudimos cargar tu borrador. Puedes continuar desde aquí.'))
      .finally(() => setLoadingResume(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!submitting) return
    setTrustMsgIndex(0)
    const id = setInterval(() => setTrustMsgIndex(i => (i + 1) % TRUST_MESSAGES.length), 2600)
    return () => clearInterval(id)
  }, [submitting])

  const set = patch => setData(d => ({ ...d, ...patch }))

  const extraSecciones = Math.max(0, data.secciones.length - SECTIONS_INCLUDED)
  const montoNeto = PRICE_ONLINE + (data.wantsStore ? PRICE_STORE : 0) + extraSecciones * PRICE_EXTRA_SECTION
  const montoIva = Math.round(montoNeto * 0.19)
  const montoTotal = montoNeto + montoIva

  function toggleSeccion(s) {
    setData(d => {
      const has = d.secciones.includes(s)
      if (has) return { ...d, secciones: d.secciones.filter(x => x !== s) }
      return { ...d, secciones: [...d.secciones, s] }
    })
  }

  function validateStep(n) {
    const e = {}
    if (n === 1) {
      if (!data.firstName.trim()) e.firstName = 'Ingresa tu nombre.'
      if (!data.email.trim()) e.email = 'Ingresa tu correo electrónico.'
      else if (!EMAIL_RE.test(data.email.trim())) e.email = 'Correo inválido.'
      if (!data.personalWhatsapp.trim()) e.personalWhatsapp = 'Ingresa tu WhatsApp.'
      else if (!PHONE_RE.test(data.personalWhatsapp.trim())) e.personalWhatsapp = 'Ingresa un número válido (solo números, 8 a 15 dígitos).'
      if (!data.companyName.trim()) e.companyName = 'Ingresa el nombre de tu empresa o emprendimiento.'
      if (data.rut.trim() && !isValidRut(data.rut)) e.rut = 'RUT inválido (ej: 12345678-9).'
    }
    if (n === 2) {
      if (!data.rubro.trim()) e.rubro = 'Cuéntanos tu rubro o actividad.'
      if (!data.about.trim()) e.about = 'Describe brevemente qué hace tu negocio.'
      if (data.hasLogo === null) e.hasLogo = 'Selecciona una opción.'
      if (data.hasPhotos === null) e.hasPhotos = 'Selecciona una opción.'
    }
    if (n === 3) {
      if (data.secciones.length === 0) e.secciones = 'Elige al menos una sección.'
      if (data.secciones.includes('Otra') && !data.otraSeccion.trim()) e.otraSeccion = 'Escribe el nombre de la sección.'
    }
    if (n === 4) {
      if (!data.businessWhatsapp.trim()) e.businessWhatsapp = 'Ingresa el WhatsApp del negocio.'
      else if (!PHONE_RE.test(data.businessWhatsapp.trim())) e.businessWhatsapp = 'Ingresa un número válido (solo números, 8 a 15 dígitos).'
      if (data.publicEmail.trim() && !EMAIL_RE.test(data.publicEmail.trim())) e.publicEmail = 'Correo inválido.'
      if (!data.region.trim()) e.region = 'Selecciona tu región.'
      if (!data.comuna.trim()) e.comuna = 'Selecciona tu comuna.'
      if (data.wantsMaps === null) e.wantsMaps = 'Selecciona una opción.'
    }
    if (n === 5) {
      if (!data.hasDomain) e.hasDomain = 'Selecciona una opción.'
      if (data.hasDomain === 'necesito' && !DOMAIN_RE.test(data.domainWanted.trim())) e.domainWanted = 'Ingresa un dominio válido (ej: minegocio.cl).'
      if (data.hasDomain === 'tengo' && !DOMAIN_RE.test(data.domainExisting.trim())) e.domainExisting = 'Ingresa un dominio válido (ej: tudominio.cl).'
    }
    if (n === 6) {
      if (data.wantsStore === null) e.wantsStore = 'Selecciona una opción.'
      if (data.wantsStore) {
        if (!data.productCount) e.productCount = 'Selecciona una opción.'
        if (data.hasMercadoPago === null) e.hasMercadoPago = 'Selecciona una opción.'
      }
    }
    return e
  }

  function next() {
    const e = validateStep(step)
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setStep(s => Math.min(s + 1, 7))
  }
  function back() { setErrors({}); setStep(s => Math.max(s - 1, 1)) }
  function editStep(n) { setErrors({}); setStep(n) }

  async function openResumePanel() {
    setResumeOpen(true)
    if (resumeLink) return // ya generado en esta sesión, no crear otro
    setSavingDraft(true); setDraftError('')
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const res = await fetch(`${apiUrl}/api/web-orders/draft`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, step }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      setResumeLink(`${window.location.origin}/sitio-web/formulario?resume=${json.token}`)
    } catch (e) {
      setDraftError('No pudimos guardar tu progreso. Intenta de nuevo en unos segundos.')
    } finally {
      setSavingDraft(false)
    }
  }

  function copyResumeLink() {
    navigator.clipboard?.writeText(resumeLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  async function handleSubmit() {
    if (!data.aceptaCondiciones) { setSubmitError('Debes aceptar las condiciones del servicio para continuar.'); return }
    setSubmitting(true); setSubmitError('')
    try {
      let logoBase64 = null
      if (data.hasLogo === 'si' && logoFile) logoBase64 = await fileToDataUrl(logoFile)

      let photosPreviews = []
      if (data.hasPhotos === 'si' && photoFiles.length) {
        photosPreviews = await Promise.all(photoFiles.map(async f => ({ name: f.name, dataUrl: await fileToDataUrl(f) })))
      }

      const secciones = data.secciones.includes('Otra') && data.otraSeccion
        ? [...data.secciones.filter(s => s !== 'Otra'), data.otraSeccion]
        : data.secciones

      const payload = {
        modalidad: 'online',
        firstName: data.firstName, lastName: data.lastName, email: data.email, personalWhatsapp: data.personalWhatsapp,
        companyName: data.companyName, rut: data.rut, razonSocial: data.razonSocial,
        rubro: data.rubro, about: data.about,
        hasLogo: data.hasLogo === 'si', logoBase64, logoName: logoFile?.name,
        hasPhotos: data.hasPhotos === 'si', photosPreviews,
        secciones,
        businessWhatsapp: data.businessWhatsapp, publicEmail: data.publicEmail, address: data.address,
        comuna: data.comuna, region: data.region, wantsMaps: data.wantsMaps === 'si',
        instagram: data.instagram, facebook: data.facebook, tiktok: data.tiktok, youtube: data.youtube, otherSocial: data.otherSocial,
        hasDomain: data.hasDomain, domainWanted: data.domainWanted, domainExisting: data.domainExisting,
        wantsStore: !!data.wantsStore, productCount: data.productCount, hasMercadoPago: data.hasMercadoPago,
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const res = await fetch(`${apiUrl}/api/web-orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (!json.success) throw new Error(json.message || 'Error al procesar tu pedido')

      localStorage.setItem('agenciasi_last_web_order', JSON.stringify({
        orderId: json.orderId,
        contactName: `${data.firstName} ${data.lastName}`.trim(),
        companyName: data.companyName, email: data.email, whatsapp: data.personalWhatsapp,
        wantsStore: data.wantsStore, montoTotal: json.montoTotal,
      }))
      localStorage.removeItem(DRAFT_KEY)

      // 'Lead' matches the server-side Conversions API call fired when the order was
      // created (same orderId = same event_id → Meta dedupes them). The actual
      // 'Purchase' only fires on the confirmation page once Mercado Pago confirms
      // the payment — firing it here would count it before the customer has paid.
      px('Lead', { value: json.montoTotal, currency: 'CLP', content_name: 'Sitio Web Profesional' }, json.orderId)
      px('InitiateCheckout', { value: json.montoTotal, currency: 'CLP', content_name: 'Sitio Web Profesional' })
      ga('generate_lead', { value: json.montoTotal, currency: 'CLP', transaction_id: json.orderId })

      if (json.init_point) window.location.href = json.init_point
      else navigate(`/sitio-web/confirmacion?orderId=${json.orderId}`)
    } catch (e) {
      setSubmitError(e.message || 'Ocurrió un error. Intenta nuevamente.')
      setSubmitting(false)
    }
  }

  return (
    <div style={{ fontFamily: "'Poppins', system-ui, sans-serif", background: T.light, minHeight: '100vh', color: T.black }}>
      <Helmet>
        <title>Configura tu página web — AgenciaSI</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* NAV */}
      <div style={{ background: T.navy, padding: '14px 20px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/sitio-web" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: T.cyan, borderRadius: 7, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={13} color={T.navy} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 14, color: T.white }}>AgenciaSI</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {step <= TOTAL_STEPS && (
              <button onClick={openResumePanel} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.65)', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, padding: 0 }}>
                <Smartphone size={13} /> <span className="swl-hide-mobile">Continúa en tu notebook o tablet</span>
              </button>
            )}
            <span style={{ fontSize: 13, fontWeight: 700, color: T.cyan }}>${fmt(montoTotal)} total</span>
          </div>
        </div>
      </div>

      {loadingResume && (
        <div style={{ background: `${T.violet}15`, color: T.violet, fontSize: 12, fontWeight: 700, textAlign: 'center', padding: '8px 12px' }}>
          Cargando tu progreso guardado…
        </div>
      )}
      {draftError && (
        <div style={{ background: '#FFF3E0', color: '#B98900', fontSize: 12, fontWeight: 600, textAlign: 'center', padding: '8px 12px' }}>
          {draftError}
        </div>
      )}

      {resumeOpen && (
        <div onClick={() => setResumeOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: T.white, borderRadius: 18, padding: '28px 26px', maxWidth: 400, width: '100%' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 800, color: T.navy, marginBottom: 8 }}>Continúa en tu notebook o tablet</h3>
            <p style={{ fontSize: 13, color: T.gray, lineHeight: 1.6, marginBottom: 18 }}>
              Guardamos tu progreso. Envíate este enlace y sigue exactamente donde quedaste — el logo o fotos que
              hayas adjuntado deberás volver a subirlos.
            </p>
            {savingDraft ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: T.gray, fontSize: 13, padding: '12px 0' }}>
                <Loader2 size={16} className="swl-spin" /> Guardando tu progreso…
              </div>
            ) : draftError ? (
              <ErrorMsg>{draftError}</ErrorMsg>
            ) : resumeLink && (
              <>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <a href={`${WA_BASE}${encodeURIComponent(`Hola, quiero continuar mi cotización de sitio web: ${resumeLink}`)}`} target="_blank" rel="noopener noreferrer"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: '#25D366', color: '#fff', fontWeight: 800, fontSize: 13, padding: '12px', borderRadius: 10, textDecoration: 'none' }}>
                    <WaIcon size={15} /> WhatsApp
                  </a>
                  <a href={`mailto:?subject=${encodeURIComponent('Continuar mi sitio web — AgenciaSI')}&body=${encodeURIComponent(`Hola, este es el enlace para continuar mi cotización de sitio web: ${resumeLink}`)}`}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: T.navy, color: '#fff', fontWeight: 800, fontSize: 13, padding: '12px', borderRadius: 10, textDecoration: 'none' }}>
                    <Mail size={15} /> Correo
                  </a>
                </div>
                <button onClick={copyResumeLink} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: T.light, color: T.navy, fontWeight: 700, fontSize: 13, padding: '11px', borderRadius: 10, border: `1px solid ${T.border}`, cursor: 'pointer' }}>
                  {copied ? <><CheckCheck size={15} color="#0FA895" /> Copiado</> : <><Copy size={14} /> Copiar enlace</>}
                </button>
              </>
            )}
            <button onClick={() => setResumeOpen(false)} style={{ width: '100%', marginTop: 14, background: 'none', border: 'none', color: T.gray, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* PROGRESS BAR */}
      {step <= TOTAL_STEPS && (
        <div style={{ background: T.white, borderBottom: `1px solid ${T.border}`, padding: '14px 20px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: T.gray, marginBottom: 8 }}>
              <span>Paso {step} de {TOTAL_STEPS}</span>
              <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 4, background: T.border, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(step / TOTAL_STEPS) * 100}%`, background: T.violet, borderRadius: 4, transition: 'width .3s' }} />
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px 100px' }}>
        <div key={step} className="swl-step">

        {/* PASO 1 */}
        {step === 1 && (
          <div>
            <StepTitle>Primero, cuéntanos quién eres</StepTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Nombre">
                <TextInput value={data.firstName} onChange={e => set({ firstName: e.target.value })} placeholder="Tu nombre" />
                <ErrorMsg>{errors.firstName}</ErrorMsg>
              </Field>
              <Field label="Apellido">
                <TextInput value={data.lastName} onChange={e => set({ lastName: e.target.value })} placeholder="Tu apellido" />
              </Field>
            </div>
            <Field label="Correo electrónico">
              <TextInput type="email" value={data.email} onChange={e => set({ email: e.target.value })} placeholder="tucorreo@ejemplo.com" />
              <ErrorMsg>{errors.email}</ErrorMsg>
            </Field>
            <Field label="WhatsApp">
              <TextInput type="tel" inputMode="tel" value={data.personalWhatsapp} onChange={e => set({ personalWhatsapp: sanitizePhone(e.target.value) })} placeholder="+56 9 1234 5678" />
              <ErrorMsg>{errors.personalWhatsapp}</ErrorMsg>
            </Field>
            <Field label="Nombre de empresa o emprendimiento">
              <TextInput value={data.companyName} onChange={e => set({ companyName: e.target.value })} placeholder="Ej: Construcciones Pérez" />
              <ErrorMsg>{errors.companyName}</ErrorMsg>
            </Field>

            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, padding: '16px 18px', marginTop: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: T.violet, letterSpacing: .5, textTransform: 'uppercase', marginBottom: 12 }}>Datos para facturación (opcional)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="RUT">
                  <TextInput value={data.rut} onChange={e => set({ rut: sanitizeRut(e.target.value) })} placeholder="11.111.111-1" />
                  <ErrorMsg>{errors.rut}</ErrorMsg>
                </Field>
                <Field label="Razón Social"><TextInput value={data.razonSocial} onChange={e => set({ razonSocial: e.target.value })} placeholder="Razón social" /></Field>
              </div>
            </div>
          </div>
        )}

        {/* PASO 2 */}
        {step === 2 && (
          <div>
            <StepTitle>Cuéntanos sobre tu negocio</StepTitle>
            <Field label="Rubro / actividad">
              <TextInput value={data.rubro} onChange={e => set({ rubro: e.target.value })} placeholder="Ej: Construcción, gastronomía, salud..." />
              <ErrorMsg>{errors.rubro}</ErrorMsg>
            </Field>
            <Field label="Describe brevemente qué hace tu negocio">
              <TextArea value={data.about} onChange={e => set({ about: e.target.value })} placeholder="Ejemplo: Somos una empresa de construcción ubicada en Talca especializada en ampliaciones y remodelaciones." />
              <ErrorMsg>{errors.about}</ErrorMsg>
            </Field>

            <Field label="¿Ya tienes logo?">
              <div style={{ display: 'flex', gap: 12 }}>
                <ChoiceCard selected={data.hasLogo === 'si'} onClick={() => set({ hasLogo: 'si' })}>SÍ, TENGO LOGO</ChoiceCard>
                <ChoiceCard selected={data.hasLogo === 'no'} onClick={() => set({ hasLogo: 'no', })}>NO TENGO LOGO</ChoiceCard>
              </div>
              <ErrorMsg>{errors.hasLogo}</ErrorMsg>
              {data.hasLogo === 'si' && (
                <div style={{ marginTop: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, border: `1.5px dashed ${T.border}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', fontSize: 13, color: T.gray, fontWeight: 600 }}>
                    <Upload size={16} color={T.violet} />
                    {logoFile ? logoFile.name : 'Adjuntar logo (PNG, JPG, PDF o SVG)'}
                    <input type="file" accept=".png,.jpg,.jpeg,.pdf,.svg" hidden onChange={e => setLogoFile(e.target.files[0] || null)} />
                  </label>
                </div>
              )}
            </Field>

            <Field label="¿Tienes fotografías para utilizar en tu página?">
              <div style={{ display: 'flex', gap: 12 }}>
                <ChoiceCard selected={data.hasPhotos === 'si'} onClick={() => set({ hasPhotos: 'si' })}>SÍ</ChoiceCard>
                <ChoiceCard selected={data.hasPhotos === 'no'} onClick={() => set({ hasPhotos: 'no' })}>NO</ChoiceCard>
              </div>
              <ErrorMsg>{errors.hasPhotos}</ErrorMsg>
              {data.hasPhotos === 'si' && (
                <div style={{ marginTop: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, border: `1.5px dashed ${T.border}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', fontSize: 13, color: T.gray, fontWeight: 600 }}>
                    <Upload size={16} color={T.violet} />
                    Adjuntar fotografías (puedes elegir varias)
                    <input type="file" accept="image/*" multiple hidden onChange={e => setPhotoFiles(f => [...f, ...Array.from(e.target.files || [])])} />
                  </label>
                  {photoFiles.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                      {photoFiles.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: T.white, border: `1px solid ${T.border}`, borderRadius: 20, padding: '6px 10px', fontSize: 11, color: T.navy }}>
                          {f.name.length > 18 ? f.name.slice(0, 15) + '…' : f.name}
                          <X size={12} style={{ cursor: 'pointer' }} onClick={() => setPhotoFiles(fs => fs.filter((_, idx) => idx !== i))} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Field>
          </div>
        )}

        {/* PASO 3 */}
        {step === 3 && (
          <div>
            <StepTitle>¿Qué quieres mostrar en tu página?</StepTitle>
            <p style={{ fontSize: 13, color: T.gray, marginBottom: 6 }}>Tu sitio incluye hasta {SECTIONS_INCLUDED} secciones. Puedes agregar más por ${fmt(PRICE_EXTRA_SECTION)} + IVA cada una.</p>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.violet, marginBottom: 4 }}>
              {Math.min(data.secciones.length, SECTIONS_INCLUDED)} de {SECTIONS_INCLUDED} secciones incluidas
            </div>
            {extraSecciones > 0 && (
              <div style={{ fontSize: 12, fontWeight: 700, color: '#B98900', marginBottom: 12 }}>
                + {extraSecciones} adicional{extraSecciones > 1 ? 'es' : ''} (+${fmt(extraSecciones * PRICE_EXTRA_SECTION)} + IVA)
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 8, marginTop: 12 }}>
              {SECCIONES_OPCIONES.map((s, i) => (
                <SeccionChip key={s} selected={data.secciones.includes(s)} extra={!data.secciones.includes(s) && data.secciones.length >= SECTIONS_INCLUDED} onClick={() => toggleSeccion(s)}>{s}</SeccionChip>
              ))}
            </div>
            <ErrorMsg>{errors.secciones}</ErrorMsg>
            {data.secciones.includes('Otra') && (
              <Field label="Escribe el nombre de la sección" sub="">
                <TextInput value={data.otraSeccion} onChange={e => set({ otraSeccion: e.target.value })} placeholder="Ej: Testimonios" />
                <ErrorMsg>{errors.otraSeccion}</ErrorMsg>
              </Field>
            )}
          </div>
        )}

        {/* PASO 4 */}
        {step === 4 && (
          <div>
            <StepTitle>¿Cómo podrán encontrarte tus clientes?</StepTitle>
            <Field label="WhatsApp del negocio">
              <TextInput type="tel" inputMode="tel" value={data.businessWhatsapp} onChange={e => set({ businessWhatsapp: sanitizePhone(e.target.value) })} placeholder="+56 9 1234 5678" />
              <ErrorMsg>{errors.businessWhatsapp}</ErrorMsg>
            </Field>
            <Field label="Correo público (opcional)">
              <TextInput type="email" value={data.publicEmail} onChange={e => set({ publicEmail: e.target.value })} placeholder="contacto@tunegocio.cl" />
              <ErrorMsg>{errors.publicEmail}</ErrorMsg>
            </Field>
            <Field label="Dirección (opcional)">
              <TextInput value={data.address} onChange={e => set({ address: e.target.value })} placeholder="Calle, número" />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Región">
                <SelectInput value={data.region} onChange={e => set({ region: e.target.value, comuna: '' })}>
                  <option value="">Selecciona tu región</option>
                  {CHILE_REGIONES.map(r => <option key={r.region} value={r.region}>{r.region}</option>)}
                </SelectInput>
                <ErrorMsg>{errors.region}</ErrorMsg>
              </Field>
              <Field label="Comuna">
                <SelectInput value={data.comuna} onChange={e => set({ comuna: e.target.value })} disabled={!data.region}>
                  <option value="">{data.region ? 'Selecciona tu comuna' : 'Primero elige tu región'}</option>
                  {comunasDeRegion(data.region).map(c => <option key={c} value={c}>{c}</option>)}
                </SelectInput>
                <ErrorMsg>{errors.comuna}</ErrorMsg>
              </Field>
            </div>
            <Field label="¿Quieres mostrar tu ubicación en Google Maps?">
              <div style={{ display: 'flex', gap: 12 }}>
                <ChoiceCard selected={data.wantsMaps === 'si'} onClick={() => set({ wantsMaps: 'si' })}>SÍ</ChoiceCard>
                <ChoiceCard selected={data.wantsMaps === 'no'} onClick={() => set({ wantsMaps: 'no' })}>NO</ChoiceCard>
              </div>
              <ErrorMsg>{errors.wantsMaps}</ErrorMsg>
            </Field>

            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: T.violet, letterSpacing: .5, textTransform: 'uppercase', marginBottom: 12 }}>Redes sociales (opcional)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <TextInput value={data.instagram} onChange={e => set({ instagram: e.target.value })} placeholder="Instagram" />
                <TextInput value={data.facebook} onChange={e => set({ facebook: e.target.value })} placeholder="Facebook" />
                <TextInput value={data.tiktok} onChange={e => set({ tiktok: e.target.value })} placeholder="TikTok" />
                <TextInput value={data.youtube} onChange={e => set({ youtube: e.target.value })} placeholder="YouTube" />
              </div>
              <div style={{ marginTop: 12 }}>
                <TextInput value={data.otherSocial} onChange={e => set({ otherSocial: e.target.value })} placeholder="Otra red social" />
              </div>
            </div>
          </div>
        )}

        {/* PASO 5 */}
        {step === 5 && (
          <div>
            <StepTitle>Ahora elijamos tu dirección web</StepTitle>
            <Field label="¿Ya tienes un dominio?">
              <div style={{ display: 'flex', gap: 12 }}>
                <ChoiceCard selected={data.hasDomain === 'necesito'} onClick={() => set({ hasDomain: 'necesito' })}>NO, NECESITO UNO</ChoiceCard>
                <ChoiceCard selected={data.hasDomain === 'tengo'} onClick={() => set({ hasDomain: 'tengo' })}>SÍ, YA TENGO DOMINIO</ChoiceCard>
              </div>
              <ErrorMsg>{errors.hasDomain}</ErrorMsg>
            </Field>

            {data.hasDomain === 'necesito' && (
              <Field label="¿Qué dominio te gustaría?" sub="El dominio .CL está incluido durante el primer año.">
                <TextInput value={data.domainWanted} onChange={e => set({ domainWanted: sanitizeDomain(e.target.value) })} placeholder="minegocio.cl" />
                <ErrorMsg>{errors.domainWanted}</ErrorMsg>
                <div style={{ fontSize: 12, color: T.gray, marginTop: 6 }}>La disponibilidad será confirmada por nuestro equipo.</div>
              </Field>
            )}
            {data.hasDomain === 'tengo' && (
              <Field label="Escribe tu dominio">
                <TextInput value={data.domainExisting} onChange={e => set({ domainExisting: sanitizeDomain(e.target.value) })} placeholder="tudominio.cl" />
                <ErrorMsg>{errors.domainExisting}</ErrorMsg>
              </Field>
            )}
          </div>
        )}

        {/* PASO 6 — UPSELL TIENDA */}
        {step === 6 && (
          <div>
            <StepTitle>¿Quieres vender productos directamente desde tu página?</StepTitle>
            <p style={{ fontSize: 13, color: T.gray, marginBottom: 20 }}>Puedes convertir tu sitio web en una tienda online.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 8 }} className="swl-two-cards">
              <div onClick={() => set({ wantsStore: false })} style={{
                cursor: 'pointer', border: `2px solid ${data.wantsStore === false ? T.violet : T.border}`,
                background: data.wantsStore === false ? `${T.violet}0D` : T.white, borderRadius: 16, padding: '22px 18px',
              }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: T.navy, marginBottom: 6 }}>NO POR AHORA</div>
                <div style={{ fontSize: 12, color: T.gray }}>Solo necesito mi página web.</div>
              </div>
              <div onClick={() => set({ wantsStore: true })} style={{
                cursor: 'pointer', position: 'relative', border: `2px solid ${data.wantsStore === true ? T.violet : T.border}`,
                background: data.wantsStore === true ? `${T.violet}0D` : T.white, borderRadius: 16, padding: '22px 18px',
              }}>
                <span style={{ position: 'absolute', top: -11, left: 16, background: T.violet, color: T.white, fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 20 }}>OPCIONAL</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 14, color: T.navy, marginBottom: 6 }}>
                  <Store size={16} color={T.violet} /> AGREGAR TIENDA ONLINE
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: T.violet, marginBottom: 6 }}>+$25.990 + IVA</div>
                <div style={{ fontSize: 12, color: T.gray }}>Recibe pedidos y pagos directamente desde tu página web.</div>
              </div>
            </div>
            <ErrorMsg>{errors.wantsStore}</ErrorMsg>

            {data.wantsStore === true && (
              <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, padding: '18px 20px', marginTop: 18 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                  {['Carro de compras', 'Catálogo de productos', 'Carga inicial de hasta 25 productos', 'Página individual para cada producto', 'Proceso de compra online', 'Integración con Mercado Pago', 'Diseño del catálogo adaptado a celulares'].map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.navy }}>
                      <Check size={14} color={T.violet} style={{ flexShrink: 0 }} /> {t}
                    </div>
                  ))}
                </div>

                <Field label="¿Cuántos productos quieres cargar inicialmente?">
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {['1 a 10', '11 a 25', 'Más de 25'].map(opt => (
                      <ChoiceCard key={opt} selected={data.productCount === opt} onClick={() => set({ productCount: opt })} style={{ flex: 'unset', padding: '10px 16px', fontSize: 13 }}>{opt}</ChoiceCard>
                    ))}
                  </div>
                  <ErrorMsg>{errors.productCount}</ErrorMsg>
                  {data.productCount === 'Más de 25' && (
                    <div style={{ fontSize: 12, color: T.gray, marginTop: 8, lineHeight: 1.6 }}>
                      Este adicional incluye la carga inicial de hasta 25 productos. Si necesitas cargar más, podemos cotizar los productos adicionales.
                    </div>
                  )}
                </Field>

                <Field label="¿Ya tienes cuenta de Mercado Pago?">
                  <div style={{ display: 'flex', gap: 12 }}>
                    <ChoiceCard selected={data.hasMercadoPago === 'si'} onClick={() => set({ hasMercadoPago: 'si' })}>SÍ</ChoiceCard>
                    <ChoiceCard selected={data.hasMercadoPago === 'no'} onClick={() => set({ hasMercadoPago: 'no' })}>NO</ChoiceCard>
                  </div>
                  <ErrorMsg>{errors.hasMercadoPago}</ErrorMsg>
                  {data.hasMercadoPago === 'no' && (
                    <div style={{ fontSize: 12, color: T.gray, marginTop: 8 }}>No te preocupes. Nuestro equipo te indicará cómo crearla durante la configuración de tu tienda.</div>
                  )}
                </Field>
              </div>
            )}
          </div>
        )}

        {/* RESUMEN (paso 7) */}
        {step === 7 && (
          <div>
            <StepTitle>Revisa tu proyecto</StepTitle>

            <div style={{ background: T.navy, borderRadius: 16, padding: '22px 22px', marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontWeight: 800, fontSize: 15, color: T.white }}>Tu sitio web profesional</span>
                <span style={{ fontWeight: 800, fontSize: 16, color: T.cyan }}>${fmt(PRICE_ONLINE)} + IVA</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['Diseño personalizado', 'Hasta 5 secciones', 'Dominio .CL por 1 año', 'Hosting por 1 año', '3 correos corporativos', 'WhatsApp', 'Formulario', 'Google Maps', 'Indexación en Google'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,.8)' }}>
                    <Check size={12} color={T.cyan} /> {t}
                  </div>
                ))}
              </div>
            </div>

            {data.wantsStore && (
              <div style={{ background: `${T.violet}0D`, border: `1px solid ${T.violet}40`, borderRadius: 16, padding: '20px 22px', marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: T.violet, letterSpacing: 1, marginBottom: 6 }}>ADICIONAL</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontWeight: 800, fontSize: 14, color: T.navy }}>Tienda online</span>
                  <span style={{ fontWeight: 800, fontSize: 15, color: T.violet }}>+${fmt(PRICE_STORE)} + IVA</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {['Carro de compras', 'Hasta 25 productos cargados inicialmente', 'Mercado Pago', 'Catálogo de productos', 'Compra online'].map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.navy }}>
                      <Check size={12} color={T.violet} /> {t}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {extraSecciones > 0 && (
              <div style={{ background: '#FFF8E6', border: '1px solid #B9890040', borderRadius: 16, padding: '20px 22px', marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#B98900', letterSpacing: 1, marginBottom: 6 }}>ADICIONAL</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: 14, color: T.navy }}>
                    {extraSecciones} sección{extraSecciones > 1 ? 'es' : ''} adicional{extraSecciones > 1 ? 'es' : ''}
                  </span>
                  <span style={{ fontWeight: 800, fontSize: 15, color: '#B98900' }}>+${fmt(extraSecciones * PRICE_EXTRA_SECTION)} + IVA</span>
                </div>
              </div>
            )}

            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, padding: '18px 22px', marginBottom: 14 }}>
              <Row label="Subtotal" value={`$${fmt(montoNeto)}`} />
              <Row label="IVA (19%)" value={`$${fmt(montoIva)}`} />
              <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 8, paddingTop: 8 }}>
                <Row label="Total" value={`$${fmt(montoTotal)}`} bold />
              </div>
            </div>

            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, padding: '18px 22px', marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <SummaryRow label="Nombre" value={`${data.firstName} ${data.lastName}`.trim()} onEdit={() => editStep(1)} />
              <SummaryRow label="Empresa" value={data.companyName} onEdit={() => editStep(1)} />
              <SummaryRow label="Correo" value={data.email} onEdit={() => editStep(1)} />
              <SummaryRow label="WhatsApp" value={data.personalWhatsapp} onEdit={() => editStep(1)} />
              <SummaryRow label="Comuna" value={data.comuna ? `${data.comuna}, ${data.region}` : '—'} onEdit={() => editStep(4)} />
              <SummaryRow label="Dominio solicitado" value={data.hasDomain === 'tengo' ? data.domainExisting : (data.domainWanted || '—')} onEdit={() => editStep(5)} />
              <SummaryRow label="Secciones" value={(data.secciones.includes('Otra') ? [...data.secciones.filter(s => s !== 'Otra'), data.otraSeccion] : data.secciones).join(', ') || '—'} onEdit={() => editStep(3)} />
              <SummaryRow label="Tienda online" value={data.wantsStore ? 'Sí' : 'No'} onEdit={() => editStep(6)} />
            </div>

            <div style={{ marginBottom: 8 }}>
              <div onClick={() => setShowTerms(s => !s)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: T.violet, marginBottom: 8 }}>
                Ver condiciones del servicio <ChevronDown size={13} style={{ transform: showTerms ? 'rotate(180deg)' : 'none' }} />
              </div>
              {showTerms && (
                <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: '14px 16px', fontSize: 12, color: T.gray, lineHeight: 1.8, marginBottom: 12 }}>
                  · Dominio .CL incluido durante el primer año.<br />
                  · Hosting incluido durante el primer año.<br />
                  · Hasta 5 secciones.<br />
                  · Carga inicial de hasta 25 productos solo si se contrata el adicional de tienda.<br />
                  · Mercado Pago requiere una cuenta propia del comercio.<br />
                  · Servicios o funcionalidades adicionales pueden cotizarse por separado.
                </div>
              )}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: T.navy, cursor: 'pointer' }}>
                <input type="checkbox" checked={data.aceptaCondiciones} onChange={e => set({ aceptaCondiciones: e.target.checked })} style={{ marginTop: 3 }} />
                <span>
                  He revisado la información ingresada y acepto los{' '}
                  <a href="/terminos-condiciones" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: T.violet, fontWeight: 700 }}>Términos y Condiciones</a>
                  {' '}y la{' '}
                  <a href="/politica-privacidad" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: T.violet, fontWeight: 700 }}>Política de Privacidad</a>.
                </span>
              </label>
            </div>

            <ErrorMsg>{submitError}</ErrorMsg>

            <button onClick={handleSubmit} disabled={submitting} style={{
              width: '100%', marginTop: 16, background: T.cyan, color: T.navy, fontWeight: 800, fontSize: 16,
              padding: '17px', borderRadius: 14, border: 'none', cursor: submitting ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: submitting ? .7 : 1,
            }}>
              {submitting ? <><Loader2 size={18} className="swl-spin" /> Procesando…</> : <>Pagar y comenzar mi sitio web <ArrowRight size={17} /></>}
            </button>

            {submitting ? (
              <div key={trustMsgIndex} className="swl-trust-fade" style={{
                marginTop: 14, textAlign: 'center', fontSize: 12.5, color: T.violet, fontWeight: 600,
                lineHeight: 1.6, minHeight: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px',
              }}>
                {TRUST_MESSAGES[trustMsgIndex]}
              </div>
            ) : (
              <div style={{ textAlign: 'center', fontSize: 11, color: T.gray, marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <ShieldCheck size={13} /> Pago seguro con Mercado Pago
              </div>
            )}
          </div>
        )}
        </div>

        {/* NAV BUTTONS */}
        {step <= TOTAL_STEPS && (
          <div style={{ display: 'flex', gap: 12, marginTop: 30 }}>
            {step > 1 && (
              <button onClick={back} style={{ flex: '0 0 auto', background: T.white, border: `1.5px solid ${T.border}`, color: T.navy, fontWeight: 700, fontSize: 14, padding: '14px 20px', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ArrowLeft size={15} /> Atrás
              </button>
            )}
            <button onClick={next} style={{ flex: 1, background: T.violet, color: T.white, fontWeight: 800, fontSize: 15, padding: '14px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              Continuar <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step <= TOTAL_STEPS && (
          <button onClick={openResumePanel} style={{
            width: '100%', marginTop: 14, background: T.violet, border: 'none',
            color: T.white, fontWeight: 800, fontSize: 14, padding: '14px', borderRadius: 12, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Smartphone size={16} /> Continúa en tu notebook o tablet
          </button>
        )}
      </div>

      <style>{`
        @keyframes swl-spin { to { transform: rotate(360deg); } }
        .swl-spin { animation: swl-spin .8s linear infinite; }
        @media(max-width:640px) { .swl-two-cards { grid-template-columns: 1fr !important; } }
        @media(max-width:480px) { .swl-hide-mobile { display: none; } }

        @keyframes swl-step-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .swl-step { animation: swl-step-in .35s ease both; }

        @keyframes swl-trust-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .swl-trust-fade { animation: swl-trust-in .4s ease both; }
      `}</style>
    </div>
  )
}

function Row({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: bold ? 15 : 13, fontWeight: bold ? 800 : 500, color: T.navy, padding: '4px 0' }}>
      <span>{label}</span><span>{value}</span>
    </div>
  )
}

function SummaryRow({ label, value, onEdit }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.gray, textTransform: 'uppercase', letterSpacing: .5 }}>{label}</div>
        <div style={{ fontSize: 13, color: T.navy, fontWeight: 600 }}>{value || '—'}</div>
      </div>
      <button onClick={onEdit} style={{ background: 'none', border: 'none', color: T.violet, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Editar</button>
    </div>
  )
}

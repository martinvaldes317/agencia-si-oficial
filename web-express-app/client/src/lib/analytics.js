const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const VISITOR_KEY = 'swl_visitor_id'

function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return 'no-storage'
  }
}

function post(path, body) {
  try {
    fetch(`${API}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Never let a tracking failure affect navigation.
  }
}

export function trackPageView(path, referrer) {
  post('/api/analytics/pageview', {
    path,
    visitorId: getVisitorId(),
    referrer: referrer || (typeof document !== 'undefined' ? document.referrer : ''),
  })
}

export function trackEvent(eventName, { path, label } = {}) {
  post('/api/analytics/event', {
    eventName,
    path: path || window.location.pathname,
    visitorId: getVisitorId(),
    label,
  })
}

function findWhatsappLink(el) {
  const a = el.closest ? el.closest('a[href]') : null
  if (!a) return null
  const href = a.getAttribute('href') || ''
  return href.includes('wa.me') || href.includes('api.whatsapp.com') ? a : null
}

let initialized = false

export function initGlobalTracking() {
  if (initialized) return
  initialized = true

  document.addEventListener('click', (e) => {
    const target = e.target
    if (!target || !target.closest) return

    const tagged = target.closest('[data-analytics-event]')
    if (tagged) {
      trackEvent(tagged.getAttribute('data-analytics-event'), {
        label: (tagged.textContent || '').trim().slice(0, 191),
      })
      return
    }

    const waLink = findWhatsappLink(target)
    if (waLink) {
      trackEvent('whatsapp_click', { label: (waLink.textContent || '').trim().slice(0, 191) })
    }
  }, true)

  document.addEventListener('submit', (e) => {
    const form = e.target
    if (!(form instanceof HTMLFormElement)) return
    trackEvent('form_submit', { label: form.getAttribute('id') || form.getAttribute('name') || '' })
  }, true)
}

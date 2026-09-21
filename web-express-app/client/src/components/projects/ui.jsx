import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { X, Loader2 } from 'lucide-react'

export const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'
export const money = n => `$${Math.round(Number(n) || 0).toLocaleString('es-CL')}`
export const fmtDate = d => d ? new Date(d).toLocaleString('es-CL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
export const fmtDay = d => d ? new Date(d).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
export const waLink = (phone, text) => {
  const d = String(phone || '').replace(/\D/g, '')
  return `https://wa.me/${d}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

const COLORS = {
  slate: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20', sky: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20', emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20', teal: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20', indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  green: 'bg-green-500/10 text-green-400 border-green-500/20', red: 'bg-red-500/10 text-red-400 border-red-500/20',
}
export const Pill = ({ color = 'slate', children }) => (
  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap ${COLORS[color] || COLORS.slate}`}>{children}</span>
)

// Meta (estados, etiquetas, colores) viene del servidor: una sola fuente de verdad.
let metaCache = null
export function useProjectsApi() {
  const { authFetch, adminToken } = useAuth()
  const [meta, setMeta] = useState(metaCache)

  const api = useCallback(async (path, { method = 'GET', body } = {}) => {
    const res = await authFetch(`/api/projects${path}`, { method, body: body ? JSON.stringify(body) : undefined })
    const json = await res.json().catch(() => ({}))
    if (!res.ok || json.success === false) throw new Error(json.message || 'Error')
    return json
  }, [authFetch])

  const upload = useCallback(async (path, formData) => {
    const res = await fetch(`${API}/api/projects${path}`, { method: 'POST', headers: { Authorization: `Bearer ${adminToken}` }, body: formData })
    const json = await res.json().catch(() => ({}))
    if (!res.ok || json.success === false) throw new Error(json.message || 'Error al subir')
    return json
  }, [adminToken])

  const fileBlobUrl = useCallback(async id => {
    const res = await fetch(`${API}/api/projects/files/${id}/download`, { headers: { Authorization: `Bearer ${adminToken}` } })
    if (!res.ok) throw new Error('No se pudo abrir el archivo')
    return URL.createObjectURL(await res.blob())
  }, [adminToken])

  useEffect(() => {
    if (metaCache || !adminToken) return
    api('/meta').then(m => { metaCache = m; setMeta(m) }).catch(() => {})
  }, [adminToken, api])

  const statusOf = key => meta?.statuses.find(s => s.key === key)
  return { api, upload, fileBlobUrl, meta, statusOf }
}

export const StatusBadge = ({ status, meta }) => {
  const s = meta?.statuses.find(x => x.key === status)
  return <Pill color={s?.color}>{s?.label || status}</Pill>
}
export const PaymentBadge = ({ status, meta }) => {
  const s = meta?.paymentStatuses.find(x => x.key === status)
  const color = { pago_completo: 'emerald', abono_pagado: 'teal', abono_pendiente: 'amber', no_pagado: 'slate', reembolsado: 'red' }[status]
  return <Pill color={color}>{s?.label || status}</Pill>
}

export function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] overflow-auto bg-zinc-950 border border-white/10 rounded-2xl`}>
        <div className="p-5 border-b border-white/5 flex items-center justify-between sticky top-0 bg-zinc-950">
          <h3 className="text-white font-bold text-sm">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-full"><X className="w-4 h-4 text-zinc-500" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export const inputCls = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/25'
export const Field = ({ label, children, className = '' }) => (
  <label className={`block ${className}`}>
    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1.5">{label}</span>
    {children}
  </label>
)
export const Btn = ({ children, onClick, disabled, variant = 'ghost', className = '', type = 'button', loading }) => {
  const v = {
    primary: 'bg-white text-black hover:bg-zinc-200', ghost: 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10',
    green: 'bg-emerald-500 text-black hover:bg-emerald-400', danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
  }[variant]
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading}
      className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5 ${v} ${className}`}>
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}{children}
    </button>
  )
}
export const Spinner = () => <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /></div>
export const Card = ({ children, className = '' }) => <div className={`bg-white/5 border border-white/10 rounded-2xl ${className}`}>{children}</div>

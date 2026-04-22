import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, API } from '../../context/AuthContext'
import {
  Users, Plus, Search, TrendingUp, CreditCard, Calendar, FolderOpen,
  MessageSquare, ChevronLeft, X, Upload, Send, Trash2, LogOut,
  Eye, EyeOff, Loader, AlertCircle, DollarSign, BarChart2, CheckSquare, Square,
  Globe, Bell
} from 'lucide-react'

// ─── helpers ──────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg my-auto"
        onMouseDown={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <h3 className="text-white font-semibold">{title}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={20} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs text-zinc-400 uppercase tracking-wider block mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"

// ─── tabs ─────────────────────────────────────────────────────────────────────

function MetricsTab({ clientId, metrics, onRefresh, authFetch }) {
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0,10), platform: 'meta', impressions: '', clicks: '', spend: '', conversions: '', revenue: '' })
  const [loading, setLoading] = useState(false)
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await authFetch(`/api/clients/${clientId}/metrics`, { method: 'POST', body: JSON.stringify(form) })
    await onRefresh()
    setForm(p => ({ ...p, impressions: '', clicks: '', spend: '', conversions: '', revenue: '' }))
    setLoading(false)
  }

  const remove = async (id) => {
    await authFetch(`/api/clients/${clientId}/metrics/${id}`, { method: 'DELETE' })
    onRefresh()
  }

  return (
    <div className="space-y-5">
      <form onSubmit={submit} className="grid grid-cols-2 gap-3 bg-zinc-800 rounded-xl p-4">
        <div className="col-span-2 grid grid-cols-2 gap-3">
          <Field label="Fecha"><input type="date" value={form.date} onChange={f('date')} className={inputCls} /></Field>
          <Field label="Plataforma">
            <select value={form.platform} onChange={f('platform')} className={inputCls}>
              <option value="meta">Meta Ads</option>
              <option value="google">Google Ads</option>
              <option value="tiktok">TikTok Ads</option>
            </select>
          </Field>
        </div>
        {[['impressions','Impresiones'],['clicks','Clicks'],['spend','Inversión $'],['conversions','Conversiones'],['revenue','Ingresos $']].map(([k,l]) => (
          <Field key={k} label={l}><input type="number" value={form[k]} onChange={f(k)} className={inputCls} placeholder="0" /></Field>
        ))}
        <div className="col-span-2">
          <button type="submit" disabled={loading} className="w-full bg-white text-black py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-zinc-100 disabled:opacity-50">
            {loading ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />} Agregar métrica
          </button>
        </div>
      </form>
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {metrics.length === 0 ? <p className="text-zinc-600 text-sm text-center py-4">Sin métricas aún</p> : metrics.slice(0, 20).map(m => (
          <div key={m.id} className="flex items-center gap-3 bg-zinc-800 rounded-lg px-4 py-3 text-sm">
            <div className="flex-1">
              <span className="text-white font-medium">{new Date(m.date).toLocaleDateString('es-CL')} · {m.platform}</span>
              <span className="text-zinc-500 ml-3">${m.spend.toLocaleString()} spend · {m.roas.toFixed(1)}x ROAS · {m.clicks} clicks</span>
            </div>
            <button onClick={() => remove(m.id)} className="text-zinc-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}

function PaymentsTab({ clientId, payments, onRefresh, authFetch }) {
  const [form, setForm] = useState({ amount: '', description: '', status: 'pendiente', dueDate: '', invoiceUrl: '' })
  const [loading, setLoading] = useState(false)
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await authFetch(`/api/clients/${clientId}/payments`, { method: 'POST', body: JSON.stringify(form) })
    await onRefresh()
    setForm({ amount: '', description: '', status: 'pendiente', dueDate: '', invoiceUrl: '' })
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    await authFetch(`/api/clients/${clientId}/payments/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
    onRefresh()
  }

  return (
    <div className="space-y-5">
      <form onSubmit={submit} className="grid grid-cols-2 gap-3 bg-zinc-800 rounded-xl p-4">
        <div className="col-span-2"><Field label="Descripción"><input value={form.description} onChange={f('description')} className={inputCls} placeholder="Ej: Gestión mensual Mayo" /></Field></div>
        <Field label="Monto (CLP)"><input type="number" value={form.amount} onChange={f('amount')} required className={inputCls} placeholder="0" /></Field>
        <Field label="Estado">
          <select value={form.status} onChange={f('status')} className={inputCls}>
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
            <option value="vencido">Vencido</option>
          </select>
        </Field>
        <Field label="Vencimiento"><input type="date" value={form.dueDate} onChange={f('dueDate')} className={inputCls} /></Field>
        <Field label="URL Boleta"><input value={form.invoiceUrl} onChange={f('invoiceUrl')} className={inputCls} placeholder="https://..." /></Field>
        <div className="col-span-2">
          <button type="submit" disabled={loading} className="w-full bg-white text-black py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-zinc-100 disabled:opacity-50">
            {loading ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />} Agregar cobro
          </button>
        </div>
      </form>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {payments.length === 0 ? <p className="text-zinc-600 text-sm text-center py-4">Sin cobros aún</p> : payments.map(p => (
          <div key={p.id} className="flex items-center gap-3 bg-zinc-800 rounded-lg px-4 py-3 text-sm">
            <div className="flex-1">
              <span className="text-white font-medium">${p.amount.toLocaleString('es-CL')}</span>
              <span className="text-zinc-500 ml-2">{p.description || '—'}</span>
            </div>
            <select
              value={p.status}
              onChange={e => updateStatus(p.id, e.target.value)}
              className="bg-zinc-700 border-0 text-xs text-white rounded px-2 py-1 focus:outline-none"
            >
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
              <option value="vencido">Vencido</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

function MeetingsTab({ clientId, meetings, onRefresh, authFetch }) {
  const [form, setForm] = useState({ title: '', description: '', date: '', duration: 60, meetLink: '' })
  const [loading, setLoading] = useState(false)
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await authFetch(`/api/clients/${clientId}/meetings`, { method: 'POST', body: JSON.stringify(form) })
    await onRefresh()
    setForm({ title: '', description: '', date: '', duration: 60, meetLink: '' })
    setLoading(false)
  }

  const remove = async (id) => {
    await authFetch(`/api/clients/${clientId}/meetings/${id}`, { method: 'DELETE' })
    onRefresh()
  }

  return (
    <div className="space-y-5">
      <form onSubmit={submit} className="grid grid-cols-2 gap-3 bg-zinc-800 rounded-xl p-4">
        <div className="col-span-2"><Field label="Título"><input value={form.title} onChange={f('title')} required className={inputCls} placeholder="Ej: Revisión mensual de campañas" /></Field></div>
        <Field label="Fecha y hora"><input type="datetime-local" value={form.date} onChange={f('date')} required className={inputCls} /></Field>
        <Field label="Duración (min)"><input type="number" value={form.duration} onChange={f('duration')} className={inputCls} /></Field>
        <div className="col-span-2"><Field label="Link Meet"><input value={form.meetLink} onChange={f('meetLink')} className={inputCls} placeholder="https://meet.google.com/..." /></Field></div>
        <div className="col-span-2"><Field label="Descripción"><input value={form.description} onChange={f('description')} className={inputCls} placeholder="Opcional" /></Field></div>
        <div className="col-span-2">
          <button type="submit" disabled={loading} className="w-full bg-white text-black py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-zinc-100 disabled:opacity-50">
            {loading ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />} Agendar reunión
          </button>
        </div>
      </form>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {meetings.length === 0 ? <p className="text-zinc-600 text-sm text-center py-4">Sin reuniones aún</p> : meetings.map(m => (
          <div key={m.id} className="flex items-center gap-3 bg-zinc-800 rounded-lg px-4 py-3 text-sm">
            <div className="flex-1">
              <span className="text-white font-medium">{m.title}</span>
              <span className="text-zinc-500 ml-2">{new Date(m.date).toLocaleString('es-CL', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}</span>
            </div>
            <button onClick={() => remove(m.id)} className="text-zinc-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}

function FilesTab({ clientId, files, onRefresh, adminToken }) {
  const [uploading, setUploading] = useState(false)
  const [category, setCategory] = useState('general')
  const fileRef = useRef(null)

  const upload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('category', category)
    await fetch(`${API}/api/clients/${clientId}/files`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: fd
    })
    await onRefresh()
    setUploading(false)
    e.target.value = ''
  }

  const remove = async (fid) => {
    await fetch(`${API}/api/clients/${clientId}/files/${fid}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    })
    onRefresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 bg-zinc-800 rounded-xl p-4">
        <select value={category} onChange={e => setCategory(e.target.value)} className="bg-zinc-700 border-0 text-white text-sm rounded-lg px-3 py-2 focus:outline-none">
          <option value="general">General</option>
          <option value="reporte">Reporte</option>
          <option value="contrato">Contrato</option>
          <option value="creativo">Creativo</option>
        </select>
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-2 rounded-lg text-sm font-semibold hover:bg-zinc-100 disabled:opacity-50 transition-colors">
          {uploading ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? 'Subiendo...' : 'Subir archivo'}
        </button>
        <input ref={fileRef} type="file" className="hidden" onChange={upload} />
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {files.length === 0 ? <p className="text-zinc-600 text-sm text-center py-4">Sin archivos aún</p> : files.map(f => (
          <div key={f.id} className="flex items-center gap-3 bg-zinc-800 rounded-lg px-4 py-3 text-sm">
            <div className="flex-1 min-w-0">
              <p className="text-white truncate">{f.originalName}</p>
              <p className="text-zinc-500 text-xs">{f.category} · {(f.size/1024).toFixed(1)} KB</p>
            </div>
            <button onClick={() => remove(f.id)} className="text-zinc-600 hover:text-red-400 transition-colors shrink-0"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}

function TicketsTab({ tickets, onRefresh, authFetch }) {
  const [activeTicket, setActiveTicket] = useState(null)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)

  const sendReply = async (ticketId) => {
    if (!reply.trim()) return
    setSending(true)
    await authFetch(`/api/clients/tickets/${ticketId}/messages`, { method: 'POST', body: JSON.stringify({ content: reply }) })
    setReply('')
    await onRefresh()
    setSending(false)
  }

  const updateStatus = async (ticketId, status) => {
    await authFetch(`/api/clients/tickets/${ticketId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
    onRefresh()
  }

  if (activeTicket) {
    const ticket = tickets.find(t => t.id === activeTicket)
    if (!ticket) { setActiveTicket(null); return null }
    return (
      <div className="space-y-3">
        <button onClick={() => setActiveTicket(null)} className="text-zinc-500 hover:text-white text-sm flex items-center gap-1"><ChevronLeft size={16} /> Volver</button>
        <div className="flex items-center justify-between">
          <p className="text-white font-medium">{ticket.subject}</p>
          <select value={ticket.status} onChange={e => updateStatus(ticket.id, e.target.value)} className="bg-zinc-700 border-0 text-xs text-white rounded px-2 py-1 focus:outline-none">
            <option value="abierto">Abierto</option>
            <option value="en_progreso">En progreso</option>
            <option value="resuelto">Resuelto</option>
            <option value="cerrado">Cerrado</option>
          </select>
        </div>
        <div className="bg-zinc-800 rounded-xl p-4 space-y-3 max-h-56 overflow-y-auto">
          {ticket.messages.map(msg => (
            <div key={msg.id} className={`text-sm ${msg.isAdmin ? 'text-right' : ''}`}>
              <span className={`inline-block px-3 py-2 rounded-xl ${msg.isAdmin ? 'bg-white text-black' : 'bg-zinc-700 text-zinc-200'}`}>{msg.content}</span>
              <p className="text-zinc-600 text-[10px] mt-0.5">{msg.isAdmin ? 'Tú' : 'Cliente'} · {new Date(msg.createdAt).toLocaleString('es-CL', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={reply} onChange={e => setReply(e.target.value)} placeholder="Responder..." className={`${inputCls} flex-1`} onKeyDown={e => e.key === 'Enter' && sendReply(ticket.id)} />
          <button onClick={() => sendReply(ticket.id)} disabled={!reply.trim() || sending} className="bg-white text-black px-3 rounded-lg hover:bg-zinc-100 disabled:opacity-50">
            {sending ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-72 overflow-y-auto">
      {tickets.length === 0 ? <p className="text-zinc-600 text-sm text-center py-4">Sin tickets aún</p> : tickets.map(t => (
        <button key={t.id} onClick={() => setActiveTicket(t.id)} className="w-full flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg px-4 py-3 text-sm text-left transition-colors">
          <div className={`w-2 h-2 rounded-full shrink-0 ${t.status === 'abierto' ? 'bg-green-400' : t.status === 'en_progreso' ? 'bg-blue-400' : 'bg-zinc-500'}`} />
          <div className="flex-1 min-w-0">
            <p className="text-white truncate">{t.subject}</p>
            <p className="text-zinc-500 text-xs">{t.messages.length} mensajes · {new Date(t.updatedAt).toLocaleDateString('es-CL')}</p>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${t.priority === 'urgente' ? 'bg-red-900 text-red-300' : t.priority === 'alta' ? 'bg-amber-900 text-amber-300' : 'bg-zinc-700 text-zinc-400'}`}>{t.priority}</span>
        </button>
      ))}
    </div>
  )
}

function TasksTab({ clientId, tasks, onRefresh, authFetch }) {
  const [form, setForm] = useState({ title: '', detail: '', priority: 'normal', dueDate: '' })
  const [loading, setLoading] = useState(false)
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setLoading(true)
    await authFetch(`/api/clients/${clientId}/tasks`, { method: 'POST', body: JSON.stringify(form) })
    await onRefresh()
    setForm({ title: '', detail: '', priority: 'normal', dueDate: '' })
    setLoading(false)
  }

  const toggle = async (task) => {
    await authFetch(`/api/clients/${clientId}/tasks/${task.id}`, { method: 'PATCH', body: JSON.stringify({ done: !task.done }) })
    onRefresh()
  }

  const remove = async (id) => {
    await authFetch(`/api/clients/${clientId}/tasks/${id}`, { method: 'DELETE' })
    onRefresh()
  }

  const priorityColor = { urgente: 'bg-red-900 text-red-300', alta: 'bg-amber-900 text-amber-300', normal: 'bg-zinc-700 text-zinc-400', baja: 'bg-zinc-800 text-zinc-500' }
  const pending = tasks.filter(t => !t.done)
  const done = tasks.filter(t => t.done)

  return (
    <div className="space-y-5">
      {/* Form */}
      <form onSubmit={submit} className="bg-zinc-800 rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Field label="Título"><input value={form.title} onChange={f('title')} required className={inputCls} placeholder="Ej: Preparar reporte de campañas" /></Field>
          </div>
          <div className="col-span-2">
            <Field label="Detalle"><input value={form.detail} onChange={f('detail')} className={inputCls} placeholder="Descripción opcional..." /></Field>
          </div>
          <Field label="Prioridad">
            <select value={form.priority} onChange={f('priority')} className={inputCls}>
              <option value="baja">Baja</option>
              <option value="normal">Normal</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </Field>
          <Field label="Fecha límite"><input type="date" value={form.dueDate} onChange={f('dueDate')} className={inputCls} /></Field>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-white text-black py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-zinc-100 disabled:opacity-50">
          {loading ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />} Agregar tarea
        </button>
      </form>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="space-y-2">
          <p className="text-zinc-500 text-xs uppercase tracking-wider">Pendientes ({pending.length})</p>
          {pending.map(t => (
            <div key={t.id} className="flex items-start gap-3 bg-zinc-800 rounded-lg px-4 py-3 group">
              <button onClick={() => toggle(t)} className="mt-0.5 shrink-0 text-zinc-500 hover:text-white transition-colors">
                <Square size={16} />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{t.title}</p>
                {t.detail && <p className="text-zinc-500 text-xs mt-0.5">{t.detail}</p>}
                {t.dueDate && <p className="text-zinc-600 text-xs mt-1">📅 {new Date(t.dueDate).toLocaleDateString('es-CL')}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor[t.priority]}`}>{t.priority}</span>
                <button onClick={() => remove(t.id)} className="text-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Done */}
      {done.length > 0 && (
        <div className="space-y-2">
          <p className="text-zinc-600 text-xs uppercase tracking-wider">Completadas ({done.length})</p>
          {done.map(t => (
            <div key={t.id} className="flex items-start gap-3 bg-zinc-900 rounded-lg px-4 py-3 group opacity-60">
              <button onClick={() => toggle(t)} className="mt-0.5 shrink-0 text-green-500 hover:text-white transition-colors">
                <CheckSquare size={16} />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-zinc-400 text-sm line-through">{t.title}</p>
                {t.detail && <p className="text-zinc-600 text-xs mt-0.5">{t.detail}</p>}
              </div>
              <button onClick={() => remove(t.id)} className="text-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}

      {tasks.length === 0 && <p className="text-zinc-600 text-sm text-center py-4">Sin tareas aún</p>}
    </div>
  )
}

function ServicesTab({ client, onRefresh, authFetch }) {
  const [form, setForm] = useState({
    domainName: client.domainName || '',
    hostingProvider: client.hostingProvider || '',
    hostingRenewal: client.hostingRenewal ? client.hostingRenewal.slice(0, 10) : '',
    domainRenewal: client.domainRenewal ? client.domainRenewal.slice(0, 10) : '',
    serviceNotes: client.serviceNotes || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await authFetch(`/api/clients/${client.id}`, { method: 'PATCH', body: JSON.stringify(form) })
    await onRefresh()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const daysUntil = (dateStr) => {
    if (!dateStr) return null
    const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const RenewalBadge = ({ dateStr, label }) => {
    const days = daysUntil(dateStr)
    if (days === null) return null
    const color = days < 0 ? '#ef4444' : days <= 30 ? '#f59e0b' : '#22c55e'
    const text = days < 0 ? `Venció hace ${Math.abs(days)} días` : days === 0 ? 'Vence hoy' : `Vence en ${days} días`
    return (
      <div className="flex items-center gap-2 mt-1">
        <span style={{ background: color + '22', color, border: `1px solid ${color}44` }}
          className="text-xs px-2 py-0.5 rounded-full font-semibold">{label}: {text}</span>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nombre de dominio">
          <input value={form.domainName} onChange={f('domainName')} className={inputCls} placeholder="agenciasi.cl" />
        </Field>
        <Field label="Proveedor de hosting">
          <input value={form.hostingProvider} onChange={f('hostingProvider')} className={inputCls} placeholder="Hostinger, AWS, etc." />
        </Field>
        <div>
          <Field label="Renovación hosting">
            <input type="date" value={form.hostingRenewal} onChange={f('hostingRenewal')} className={inputCls} />
          </Field>
          <RenewalBadge dateStr={form.hostingRenewal} label="Hosting" />
        </div>
        <div>
          <Field label="Renovación dominio">
            <input type="date" value={form.domainRenewal} onChange={f('domainRenewal')} className={inputCls} />
          </Field>
          <RenewalBadge dateStr={form.domainRenewal} label="Dominio" />
        </div>
      </div>
      <Field label="Notas de servicio">
        <textarea value={form.serviceNotes} onChange={f('serviceNotes')} rows={4}
          className={`${inputCls} resize-none`} placeholder="Plan contratado, accesos, detalles técnicos..." />
      </Field>
      <button type="submit" disabled={saving}
        className="w-full bg-white text-black py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-zinc-100 disabled:opacity-50">
        {saving ? <Loader size={16} className="animate-spin" /> : saved ? '✓ Guardado' : 'Guardar cambios'}
      </button>
    </form>
  )
}

function NotifyTab({ client, authFetch }) {
  const [form, setForm] = useState({ type: 'pago', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const templates = {
    pago: { subject: 'Recordatorio de pago pendiente', message: `Hola ${client.name},\n\nTe recordamos que tienes un pago pendiente con AgenciaSi.\n\nPor favor contáctanos para coordinar el pago o revisa tu portal de clientes.\n\n¡Gracias!` },
    renovacion_hosting: { subject: 'Tu hosting está próximo a vencer', message: `Hola ${client.name},\n\nTe informamos que tu plan de hosting está próximo a su fecha de renovación.\n\nPara no interrumpir el servicio de tu sitio web, te recomendamos renovar con anticipación.\n\nContáctanos para ayudarte.` },
    renovacion_dominio: { subject: 'Tu dominio está próximo a vencer', message: `Hola ${client.name},\n\nTe informamos que tu dominio está próximo a vencer.\n\nEs importante renovarlo a tiempo para no perder tu presencia en línea.\n\nContacta a AgenciaSi y te ayudamos.` },
    mantencion: { subject: 'Mantención programada de tu sitio web', message: `Hola ${client.name},\n\nTe informamos que realizaremos una mantención programada en tu sitio web.\n\nEsta mantención puede causar una breve interrupción del servicio. Te notificaremos cuando esté completada.\n\nGracias por tu comprensión.` },
    personalizado: { subject: '', message: '' },
  }

  const applyTemplate = (type) => {
    const t = templates[type]
    setForm({ type, subject: t.subject, message: t.message })
  }

  const submit = async (e) => {
    e.preventDefault()
    setSending(true); setError('')
    const res = await authFetch(`/api/clients/${client.id}/notify`, { method: 'POST', body: JSON.stringify(form) })
    const d = await res.json()
    setSending(false)
    if (d.success) { setSent(true); setTimeout(() => setSent(false), 3000) }
    else setError('Error al enviar. Verifica la configuración SMTP.')
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Tipo de notificación">
        <select value={form.type} onChange={e => applyTemplate(e.target.value)} className={inputCls}>
          <option value="pago">💳 Aviso de pago</option>
          <option value="renovacion_hosting">🖥️ Renovación hosting</option>
          <option value="renovacion_dominio">🌐 Renovación dominio</option>
          <option value="mantencion">🔧 Mantención programada</option>
          <option value="personalizado">📢 Mensaje personalizado</option>
        </select>
      </Field>
      <Field label="Asunto">
        <input value={form.subject} onChange={f('subject')} required className={inputCls} placeholder="Asunto del correo" />
      </Field>
      <Field label="Mensaje">
        <textarea value={form.message} onChange={f('message')} required rows={7}
          className={`${inputCls} resize-none`} placeholder="Escribe el mensaje para el cliente..." />
      </Field>
      <p className="text-zinc-600 text-xs">Se enviará a: <span className="text-zinc-400">{client.email}</span></p>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button type="submit" disabled={sending}
        className="w-full bg-white text-black py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-zinc-100 disabled:opacity-50">
        {sending ? <Loader size={16} className="animate-spin" /> : sent ? '✓ Enviado' : <><Send size={15} /> Enviar notificación</>}
      </button>
    </form>
  )
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function ClientManagement() {
  const { adminToken, loginAdmin, logoutAdmin } = useAuth()
  const navigate = useNavigate()

  // Siempre usa el token admin. Si expira (401) desloguea automáticamente.
  const adminFetch = async (url, options = {}) => {
    const res = await fetch(`${API}${url}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}`, ...options.headers }
    })
    if (res.status === 401 || res.status === 403) {
      logoutAdmin()
    }
    return res
  }

  const [clients, setClients] = useState([])
  const [stats, setStats] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [activeTab, setActiveTab] = useState('metricas')
  const [showNew, setShowNew] = useState(false)
  const [adminPwd, setAdminPwd] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState('')

  const [newClient, setNewClient] = useState({ name: '', email: '', company: '', phone: '', plan: 'ads' })
  const [creating, setCreating] = useState(false)
  const nf = k => e => setNewClient(p => ({ ...p, [k]: e.target.value }))

  const fetchClients = async () => {
    try {
      const r = await adminFetch('/api/clients')
      const d = await r.json()
      setClients(d.clients || [])
    } catch { }
  }

  const fetchStats = async () => {
    try {
      const r = await adminFetch('/api/clients/stats')
      const d = await r.json()
      if (d.success) setStats(d.stats)
    } catch { }
  }

  const fetchClient = async (id) => {
    const r = await adminFetch(`/api/clients/${id}`)
    const d = await r.json()
    if (d.success) setSelected(d.client)
  }

  useEffect(() => {
    if (!adminToken) { setLoading(false); return }
    Promise.all([fetchClients(), fetchStats()]).finally(() => setLoading(false))
  }, [adminToken])

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    try {
      const token = await loginAdmin(adminPwd)
      setAdminPwd('')
      // usar el token recién obtenido directamente, sin esperar el estado de React
      const [rc, rs] = await Promise.all([
        fetch(`${API}/api/clients`, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/clients/stats`, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }),
      ])
      const dc = await rc.json()
      const ds = await rs.json()
      setClients(dc.clients || [])
      if (ds.success) setStats(ds.stats)
      setLoading(false)
    } catch (err) {
      setLoginError(err.message)
    }
  }

  const createClient = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await adminFetch('/api/clients', { method: 'POST', body: JSON.stringify(newClient) })
      setShowNew(false)
      setNewClient({ name: '', email: '', company: '', phone: '', plan: 'ads' })
      await fetchClients()
    } catch { }
    setCreating(false)
  }

  // Admin login gate
  if (!adminToken) return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <img src="/logo-dark.png" alt="AgenciaSi" className="h-10 w-auto" />
          </div>
          <p className="text-zinc-500 text-sm mt-3">Panel de administración</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          {loginError && (
            <div className="flex items-center gap-2 bg-red-950 border border-red-800 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              <AlertCircle size={16} />{loginError}
            </div>
          )}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <Field label="Contraseña de administrador">
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={adminPwd} onChange={e => setAdminPwd(e.target.value)} required className={`${inputCls} pr-10`} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>
            <button type="submit" className="w-full bg-white text-black py-2.5 rounded-lg font-semibold text-sm hover:bg-zinc-100 transition-colors">Entrar</button>
          </form>
        </div>
        {forgotSent ? (
          <p className="text-center text-green-400 text-sm mt-4">✓ Enlace enviado a contacto@agenciasi.cl</p>
        ) : (
          <>
            {forgotError && <p className="text-center text-red-400 text-xs mt-3">{forgotError}</p>}
            <button
              onClick={async () => {
                setForgotLoading(true)
                setForgotError('')
                try {
                  const res = await fetch(`${API}/api/auth/admin/forgot-password`, { method: 'POST' })
                  const d = await res.json()
                  if (d.success) setForgotSent(true)
                  else setForgotError(d.message || 'Error al enviar. Intenta de nuevo.')
                } catch {
                  setForgotError('Error de conexión con el servidor.')
                }
                setForgotLoading(false)
              }}
              disabled={forgotLoading}
              className="block w-full text-center text-zinc-600 hover:text-zinc-400 text-xs mt-4 transition-colors disabled:opacity-50"
            >
              {forgotLoading ? 'Enviando...' : '¿Olvidaste tu contraseña?'}
            </button>
          </>
        )}
        <button onClick={() => navigate('/admin/si')} className="block text-center text-zinc-600 hover:text-zinc-400 text-xs mt-2 transition-colors">← Volver al panel de pedidos</button>
      </div>
    </div>
  )

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // Client detail view
  if (selected) {
    const [resending, setResending] = useState(false)
    const [resent, setResent] = useState(false)
    const resendWelcome = async () => {
      setResending(true)
      await adminFetch(`/api/clients/${selected.id}/resend-welcome`, { method: 'POST' })
      setResent(true); setTimeout(() => setResent(false), 3000)
      setResending(false)
    }
    const tabs = [
      { id: 'metricas', label: 'Métricas', icon: TrendingUp },
      { id: 'pagos', label: 'Pagos', icon: CreditCard },
      { id: 'reuniones', label: 'Reuniones', icon: Calendar },
      { id: 'archivos', label: 'Archivos', icon: FolderOpen },
      { id: 'tickets', label: 'Tickets', icon: MessageSquare },
      { id: 'tasks', label: 'Tareas', icon: CheckSquare },
      { id: 'servicios', label: 'Servicios', icon: Globe },
      { id: 'notificar', label: 'Notificar', icon: Bell },
    ]
    const refresh = () => fetchClient(selected.id)

    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button onClick={() => setSelected(null)} className="text-zinc-500 hover:text-white transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{selected.name}</h1>
              <p className="text-zinc-500 text-sm">{selected.email} · {selected.company || '—'} · Plan: {selected.plan || '—'}</p>
            </div>
            <button onClick={resendWelcome} disabled={resending}
              className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors disabled:opacity-50">
              {resending ? <Loader size={12} className="animate-spin inline" /> : resent ? '✓ Enviado' : '📧 Reenviar acceso'}
            </button>
            <button onClick={() => { logoutAdmin(); navigate('/admin/clientes') }} className="text-zinc-600 hover:text-white text-xs transition-colors">Cerrar sesión</button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors
                  ${activeTab === id ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>
                <Icon size={14} /><span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            {activeTab === 'metricas' && <MetricsTab clientId={selected.id} metrics={selected.metrics} onRefresh={refresh} authFetch={adminFetch} />}
            {activeTab === 'pagos' && <PaymentsTab clientId={selected.id} payments={selected.payments} onRefresh={refresh} authFetch={adminFetch} />}
            {activeTab === 'reuniones' && <MeetingsTab clientId={selected.id} meetings={selected.meetings} onRefresh={refresh} authFetch={adminFetch} />}
            {activeTab === 'archivos' && <FilesTab clientId={selected.id} files={selected.files} onRefresh={refresh} adminToken={adminToken} />}
            {activeTab === 'tickets' && <TicketsTab tickets={selected.tickets} onRefresh={refresh} authFetch={adminFetch} />}
            {activeTab === 'tasks' && <TasksTab clientId={selected.id} tasks={selected.tasks || []} onRefresh={refresh} authFetch={adminFetch} />}
            {activeTab === 'servicios' && <ServicesTab client={selected} onRefresh={refresh} authFetch={adminFetch} />}
            {activeTab === 'notificar' && <NotifyTab client={selected} authFetch={adminFetch} />}
          </div>
        </div>
      </div>
    )
  }

  // Clients list
  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.company || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1">
              <img src="/logo-dark.png" alt="AgenciaSi" className="h-8 w-auto" />
            </div>
            <h1 className="text-2xl font-bold text-white">Gestión de clientes</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin/si')} className="text-zinc-500 hover:text-white text-sm transition-colors">Pedidos →</button>
            <button onClick={() => setShowNew(true)} className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-zinc-100 transition-colors">
              <Plus size={16} /> Nuevo cliente
            </button>
            <button onClick={() => { logoutAdmin(); navigate('/admin/clientes') }} className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm transition-colors" title="Cerrar sesión">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, email o empresa..."
            className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-12 pr-4 py-3 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Inversión en Ads', value: stats ? `$${Math.round(stats.totalSpend).toLocaleString('es-CL')}` : '—', icon: BarChart2, sub: 'total acumulado' },
            { label: 'Ingresos generados', value: stats ? `$${Math.round(stats.totalRevenue).toLocaleString('es-CL')}` : '—', icon: TrendingUp, sub: stats ? `ROAS ${stats.avgRoas.toFixed(1)}x` : '' },
            { label: 'Cobrado agencia', value: stats ? `$${Math.round(stats.cobrado).toLocaleString('es-CL')}` : '—', icon: DollarSign, sub: stats && stats.pendiente > 0 ? `$${Math.round(stats.pendiente).toLocaleString('es-CL')} pendiente` : 'sin pendientes' },
            { label: 'Clientes activos', value: `${clients.filter(c => c.active).length} / ${clients.length}`, icon: Users, sub: `${stats?.totalConversions ?? 0} conversiones` },
          ].map(({ label, value, icon: Icon, sub }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-zinc-500 text-xs">{label}</p>
                <Icon size={14} className="text-zinc-600" />
              </div>
              <p className="text-white text-xl font-bold">{value}</p>
              {sub && <p className="text-zinc-600 text-xs mt-1">{sub}</p>}
            </div>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
            <Users size={40} className="text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500">{search ? 'Sin resultados' : 'Sin clientes aún. Crea el primero.'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(c => (
              <button key={c.id} onClick={() => { fetchClient(c.id); setActiveTab('metricas') }}
                className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-5 text-left flex items-center gap-4 transition-all group">
                <div className="w-11 h-11 bg-white text-black rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                  {c.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium">{c.name}</p>
                  <p className="text-zinc-500 text-sm truncate">{c.email} · {c.company || 'Sin empresa'}</p>
                  {(() => {
                    const alerts = []
                    const checkRenewal = (date, label) => {
                      if (!date) return
                      const days = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
                      if (days <= 30) alerts.push({ label, days })
                    }
                    checkRenewal(c.hostingRenewal, 'Hosting')
                    checkRenewal(c.domainRenewal, 'Dominio')
                    if (alerts.length === 0) return null
                    return (
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {alerts.map(a => (
                          <span key={a.label} className="text-xs px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: a.days < 0 ? '#ef444422' : '#f59e0b22', color: a.days < 0 ? '#ef4444' : '#f59e0b' }}>
                            ⚠ {a.label} {a.days < 0 ? `venció hace ${Math.abs(a.days)}d` : `vence en ${a.days}d`}
                          </span>
                        ))}
                      </div>
                    )
                  })()}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {c.plan && <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded-full">{c.plan}</span>}
                  <span className={`w-2 h-2 rounded-full ${c.active ? 'bg-green-400' : 'bg-zinc-600'}`} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* New client modal */}
      {showNew && (
        <Modal title="Crear nuevo cliente" onClose={() => setShowNew(false)}>
          <form onSubmit={createClient} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nombre completo"><input value={newClient.name} onChange={nf('name')} required className={inputCls} placeholder="Juan Pérez" /></Field>
              <Field label="Empresa"><input value={newClient.company} onChange={nf('company')} className={inputCls} placeholder="Empresa S.A." /></Field>
            </div>
            <Field label="Email"><input type="email" value={newClient.email} onChange={nf('email')} required className={inputCls} placeholder="juan@empresa.cl" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Teléfono"><input value={newClient.phone} onChange={nf('phone')} className={inputCls} placeholder="+56 9..." /></Field>
              <Field label="Plan">
                <select value={newClient.plan} onChange={nf('plan')} className={inputCls}>
                  <option value="ads">Ads</option>
                  <option value="web">Web</option>
                  <option value="full">Full</option>
                </select>
              </Field>
            </div>
            <p className="text-zinc-500 text-xs bg-zinc-800 rounded-lg px-3 py-2">
              📧 Se enviará un correo al cliente para que cree su propia contraseña.
            </p>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowNew(false)} className="flex-1 bg-zinc-800 text-zinc-300 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors">Cancelar</button>
              <button type="submit" disabled={creating} className="flex-1 bg-white text-black py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-100 disabled:opacity-50 flex items-center justify-center gap-2">
                {creating ? <Loader size={16} className="animate-spin" /> : 'Crear y enviar acceso'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import ProjectsLayout from './ProjectsLayout'
import { useProjectsApi, money, fmtDay, StatusBadge, PaymentBadge, Card, Spinner, Btn, Modal, Field, inputCls } from './ui'

const clientName = p => `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.business || '—'

export function NewProjectModal({ meta, api, onClose, presetClientId }) {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [mode, setMode] = useState(presetClientId ? 'existing' : 'new')
  const [clientId, setClientId] = useState(presetClientId || '')
  const [c, setC] = useState({ firstName: '', lastName: '', business: '', email: '', whatsapp: '', origin: 'Meta Ads' })
  const [pr, setPr] = useState({ name: '', serviceType: 'Landing Page', netAmount: 74990 })
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('')
  useEffect(() => { api('/clients').then(r => setClients(r.clients)).catch(() => {}) }, [api])

  const submit = async () => {
    setBusy(true); setErr('')
    try {
      let cid = clientId
      if (mode === 'new') cid = (await api('/clients', { method: 'POST', body: c })).client.id
      if (!cid) throw new Error('Selecciona un cliente')
      const r = await api('/', { method: 'POST', body: { clientId: Number(cid), ...pr, name: pr.name || c.business, status: 'lead_nuevo' } })
      navigate(`/admin/proyectos/${r.id}`)
    } catch (e) { setErr(e.message); setBusy(false) }
  }
  return (
    <Modal title="Nuevo proyecto" onClose={onClose} wide>
      <div className="flex gap-2 mb-4">
        {!presetClientId && <Btn variant={mode === 'new' ? 'primary' : 'ghost'} onClick={() => setMode('new')}>Cliente nuevo</Btn>}
        <Btn variant={mode === 'existing' ? 'primary' : 'ghost'} onClick={() => setMode('existing')}>Cliente existente</Btn>
      </div>
      {mode === 'new' ? (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Field label="Nombre"><input className={inputCls} value={c.firstName} onChange={e => setC({ ...c, firstName: e.target.value })} /></Field>
          <Field label="Apellido"><input className={inputCls} value={c.lastName} onChange={e => setC({ ...c, lastName: e.target.value })} /></Field>
          <Field label="Negocio" className="col-span-2"><input className={inputCls} value={c.business} onChange={e => setC({ ...c, business: e.target.value })} /></Field>
          <Field label="Email"><input className={inputCls} value={c.email} onChange={e => setC({ ...c, email: e.target.value })} /></Field>
          <Field label="WhatsApp"><input className={inputCls} value={c.whatsapp} onChange={e => setC({ ...c, whatsapp: e.target.value })} placeholder="+56 9 ..." /></Field>
          <Field label="Origen"><select className={inputCls} value={c.origin} onChange={e => setC({ ...c, origin: e.target.value })}>{meta?.origins.map(o => <option key={o}>{o}</option>)}</select></Field>
        </div>
      ) : (
        <Field label="Cliente" className="mb-4">
          <select className={inputCls} value={clientId} onChange={e => setClientId(e.target.value)}>
            <option value="">Selecciona…</option>
            {clients.map(x => <option key={x.id} value={x.id}>{`${x.firstName} ${x.lastName}`.trim() || x.business} — {x.business || x.email}</option>)}
          </select>
        </Field>
      )}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Field label="Nombre del proyecto"><input className={inputCls} value={pr.name} onChange={e => setPr({ ...pr, name: e.target.value })} placeholder={c.business || 'Landing Page'} /></Field>
        <Field label="Tipo de servicio"><select className={inputCls} value={pr.serviceType} onChange={e => setPr({ ...pr, serviceType: e.target.value })}>{meta?.serviceTypes.map(o => <option key={o}>{o}</option>)}</select></Field>
        <Field label="Valor neto (sin IVA)"><input type="number" className={inputCls} value={pr.netAmount} onChange={e => setPr({ ...pr, netAmount: e.target.value })} /></Field>
      </div>
      {err && <p className="text-red-400 text-xs mb-3">{err}</p>}
      <Btn variant="primary" onClick={submit} loading={busy} className="w-full">Crear proyecto</Btn>
    </Modal>
  )
}

function Kanban({ projects, meta, api, reload }) {
  const [dragId, setDragId] = useState(null)
  const [over, setOver] = useState(null)
  const cols = meta.kanbanColumns
  const colOf = p => meta.statuses.find(s => s.key === p.status)?.column
  const drop = async col => {
    setOver(null)
    const p = projects.find(x => x.id === dragId)
    if (!p || colOf(p) === col.key) return
    try { await api(`/${p.id}/status`, { method: 'POST', body: { status: col.dropStatus, note: 'Movido en Kanban' } }); reload() } catch (e) { alert(e.message) }
  }
  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {cols.map(col => {
        const items = projects.filter(p => colOf(p) === col.key)
        return (
          <div key={col.key} onDragOver={e => { e.preventDefault(); setOver(col.key) }} onDragLeave={() => setOver(null)} onDrop={() => drop(col)}
            className={`w-64 shrink-0 rounded-2xl border p-2.5 transition-colors ${over === col.key ? 'border-white/30 bg-white/[0.06]' : 'border-white/10 bg-white/[0.02]'}`}>
            <div className="flex items-center justify-between px-1.5 py-1.5 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">{col.label}</span>
              <span className="text-[11px] text-zinc-600">{items.length}</span>
            </div>
            <div className="space-y-2 min-h-[40px]">
              {items.map(p => (
                <Link key={p.id} to={`/admin/proyectos/${p.id}`} draggable onDragStart={() => setDragId(p.id)} onDragEnd={() => setDragId(null)}
                  className="block bg-zinc-900 border border-white/10 rounded-xl p-3 hover:border-white/25 cursor-grab active:cursor-grabbing">
                  <p className="text-sm font-bold text-white truncate">{clientName(p)}</p>
                  <p className="text-xs text-zinc-500 truncate mb-2">{p.business || p.name}</p>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>{fmtDay(p.createdAt)}</span><span className="text-zinc-300 font-semibold">{money(p.totalAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[11px]">
                    <span className="text-zinc-500">{p.assignedTo || 'Sin responsable'}</span>
                    <StatusBadge status={p.status} meta={meta} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function ProjectsList({ kanban = false }) {
  const { api, meta } = useProjectsApi()
  const [sp] = useSearchParams()
  const vista = sp.get('vista')
  const [projects, setProjects] = useState(null); const [error, setError] = useState('')
  const [f, setF] = useState({ q: '', status: '', assignedTo: '', origin: '', paymentStatus: '', serviceType: '', from: '', to: '' })
  const [showNew, setShowNew] = useState(false)

  const load = useCallback(() => {
    const qs = new URLSearchParams()
    Object.entries(f).forEach(([k, v]) => v && qs.set(k, v))
    if (vista) qs.set('group', vista)
    api(`/?${qs}`).then(r => setProjects(r.projects)).catch(e => setError(e.message))
  }, [api, f, vista])

  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t) }, [load])

  const sel = (key, options, placeholder) => (
    <select value={f[key]} onChange={e => setF({ ...f, [key]: e.target.value })} className={`${inputCls} !w-auto`}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
  const titles = { pendientes_info: 'Pendientes de información', desarrollo: 'En desarrollo', revision: 'En revisión', finalizados: 'Finalizados', activos: 'Activos' }
  const assignees = [...new Set((projects || []).map(p => p.assignedTo).filter(Boolean))]

  return (
    <ProjectsLayout title={kanban ? 'Kanban' : titles[vista] || 'Proyectos'} actions={<Btn variant="primary" onClick={() => setShowNew(true)}><Plus className="w-3.5 h-3.5" /> Nuevo proyecto</Btn>}>
      <div className="flex flex-wrap gap-2 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input value={f.q} onChange={e => setF({ ...f, q: e.target.value })} placeholder="Buscar por nombre, empresa, WhatsApp, email, ID o dominio"
            className={`${inputCls} !pl-9`} />
        </div>
        {meta && !vista && sel('status', meta.statuses.map(s => ({ value: s.key, label: s.label })), 'Estado')}
        {meta && sel('paymentStatus', meta.paymentStatuses.map(s => ({ value: s.key, label: s.label })), 'Pago')}
        {meta && sel('origin', meta.origins.map(o => ({ value: o, label: o })), 'Origen')}
        {meta && sel('serviceType', meta.serviceTypes.map(o => ({ value: o, label: o })), 'Tipo')}
        {sel('assignedTo', assignees.map(o => ({ value: o, label: o })), 'Responsable')}
        <input type="date" value={f.from} onChange={e => setF({ ...f, from: e.target.value })} className={`${inputCls} !w-auto`} title="Desde" />
        <input type="date" value={f.to} onChange={e => setF({ ...f, to: e.target.value })} className={`${inputCls} !w-auto`} title="Hasta" />
      </div>

      {error ? <p className="text-red-400 text-sm">{error}</p> : !projects || !meta ? <Spinner /> : kanban ? (
        <Kanban projects={projects} meta={meta} api={api} reload={load} />
      ) : projects.length === 0 ? (
        <p className="text-zinc-600 text-sm">No hay proyectos con estos filtros.</p>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-left min-w-[860px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {['ID', 'Cliente', 'Estado', 'Pago', 'Total', 'Responsable', 'Próxima acción', 'Creado'].map(h => <th key={h} className="px-4 py-3.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3.5 text-xs text-zinc-500"><Link to={`/admin/proyectos/${p.id}`}>#{p.id}</Link></td>
                  <td className="px-4 py-3.5"><Link to={`/admin/proyectos/${p.id}`} className="block"><p className="text-sm font-bold text-white">{clientName(p)}</p><p className="text-xs text-zinc-500">{p.business || p.name}{p.domain ? ` · ${p.domain}` : ''}</p></Link></td>
                  <td className="px-4 py-3.5"><StatusBadge status={p.status} meta={meta} /></td>
                  <td className="px-4 py-3.5"><PaymentBadge status={p.paymentStatus} meta={meta} /></td>
                  <td className="px-4 py-3.5 text-sm text-zinc-300">{money(p.totalAmount)}</td>
                  <td className="px-4 py-3.5 text-xs text-zinc-400">{p.assignedTo || '—'}</td>
                  <td className="px-4 py-3.5 text-xs text-zinc-300 font-semibold">{p.nextAction}</td>
                  <td className="px-4 py-3.5 text-xs text-zinc-500">{fmtDay(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {showNew && <NewProjectModal meta={meta} api={api} onClose={() => setShowNew(false)} />}
    </ProjectsLayout>
  )
}

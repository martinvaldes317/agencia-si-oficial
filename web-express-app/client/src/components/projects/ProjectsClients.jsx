import { useEffect, useState, useCallback } from 'react'
import { Search, Plus } from 'lucide-react'
import ProjectsLayout from './ProjectsLayout'
import { NewProjectModal } from './ProjectsList'
import { useProjectsApi, fmtDay, waLink, Card, Spinner, Btn, Modal, Field, inputCls } from './ui'

const EMPTY = { firstName: '', lastName: '', business: '', rut: '', email: '', phone: '', whatsapp: '', city: '', region: '', origin: 'Meta Ads', waRef: '', notes: '', assignedTo: '', lastContactAt: '' }

export function ClientForm({ initial, meta, onSave, busy, err }) {
  const [c, setC] = useState({ ...EMPTY, ...initial, lastContactAt: initial?.lastContactAt ? String(initial.lastContactAt).slice(0, 10) : '' })
  const set = (k, v) => setC(x => ({ ...x, [k]: v }))
  const T = (k, label, extra = {}) => <Field label={label} className={extra.span ? 'col-span-2' : ''}><input className={inputCls} value={c[k] ?? ''} onChange={e => set(k, e.target.value)} type={extra.type} placeholder={extra.ph} /></Field>
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {T('firstName', 'Nombre')}{T('lastName', 'Apellido')}
        {T('business', 'Nombre empresa / negocio', { span: true })}
        {T('rut', 'RUT (opcional)')}{T('email', 'Email')}
        {T('phone', 'Teléfono')}{T('whatsapp', 'WhatsApp', { ph: '+56 9 ...' })}
        {T('city', 'Ciudad')}{T('region', 'Región')}
        <Field label="Origen"><select className={inputCls} value={c.origin || ''} onChange={e => set('origin', e.target.value)}><option value="">—</option>{meta?.origins.map(o => <option key={o}>{o}</option>)}</select></Field>
        {T('assignedTo', 'Persona responsable')}
        {T('waRef', 'URL conversación WhatsApp / identificador', { span: true })}
        {T('lastContactAt', 'Fecha último contacto', { type: 'date' })}
        <Field label="Notas internas" className="col-span-2"><textarea rows={3} className={inputCls} value={c.notes ?? ''} onChange={e => set('notes', e.target.value)} /></Field>
      </div>
      {err && <p className="text-red-400 text-xs mb-3">{err}</p>}
      <Btn variant="primary" onClick={() => onSave(c)} loading={busy} className="w-full">Guardar cliente</Btn>
    </div>
  )
}

export default function ProjectsClients() {
  const { api, meta } = useProjectsApi()
  const [clients, setClients] = useState(null); const [q, setQ] = useState(''); const [origin, setOrigin] = useState('')
  const [editing, setEditing] = useState(null) // null | {} (nuevo) | client
  const [projectFor, setProjectFor] = useState(null)
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('')

  const load = useCallback(() => {
    const qs = new URLSearchParams(); if (q) qs.set('q', q); if (origin) qs.set('origin', origin)
    api(`/clients?${qs}`).then(r => setClients(r.clients)).catch(e => setErr(e.message))
  }, [api, q, origin])
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t) }, [load])

  const save = async data => {
    setBusy(true); setErr('')
    try {
      const body = { ...data, lastContactAt: data.lastContactAt || null }
      if (editing.id) await api(`/clients/${editing.id}`, { method: 'PUT', body }); else await api('/clients', { method: 'POST', body })
      setEditing(null); load()
    } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }

  return (
    <ProjectsLayout title="Clientes" actions={<Btn variant="primary" onClick={() => { setErr(''); setEditing({}) }}><Plus className="w-3.5 h-3.5" /> Nuevo cliente</Btn>}>
      <div className="flex flex-wrap gap-2 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nombre, empresa, WhatsApp o email" className={`${inputCls} !pl-9`} />
        </div>
        <select value={origin} onChange={e => setOrigin(e.target.value)} className={`${inputCls} !w-auto`}><option value="">Origen</option>{meta?.origins.map(o => <option key={o}>{o}</option>)}</select>
      </div>
      {!clients ? <Spinner /> : clients.length === 0 ? <p className="text-zinc-600 text-sm">No hay clientes todavía.</p> : (
        <Card className="overflow-x-auto">
          <table className="w-full text-left min-w-[760px]">
            <thead><tr className="border-b border-white/5 bg-white/[0.02]">
              {['ID', 'Cliente', 'Contacto', 'Origen', 'Proyectos', 'Último contacto', ''].map(h => <th key={h} className="px-4 py-3.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {clients.map(c => (
                <tr key={c.id} className="hover:bg-white/[0.03]">
                  <td className="px-4 py-3.5 text-xs text-zinc-500">#{c.id}</td>
                  <td className="px-4 py-3.5 cursor-pointer" onClick={() => { setErr(''); setEditing(c) }}>
                    <p className="text-sm font-bold text-white">{`${c.firstName} ${c.lastName}`.trim() || '—'}</p><p className="text-xs text-zinc-500">{c.business}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-zinc-400">{c.email && <div>{c.email}</div>}{c.whatsapp && <a className="text-emerald-400 hover:underline" href={waLink(c.whatsapp)} target="_blank" rel="noopener noreferrer">+{c.whatsapp}</a>}</td>
                  <td className="px-4 py-3.5 text-xs text-zinc-400">{c.origin || '—'}</td>
                  <td className="px-4 py-3.5 text-xs text-zinc-400">{c.projectCount} <button className="ml-2 text-zinc-300 hover:text-white underline underline-offset-2" onClick={() => setProjectFor(c)}>+ proyecto</button></td>
                  <td className="px-4 py-3.5 text-xs text-zinc-500">{fmtDay(c.lastContactAt)}</td>
                  <td className="px-4 py-3.5"><Btn onClick={() => { setErr(''); setEditing(c) }}>Editar</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {editing && <Modal title={editing.id ? `Cliente #${editing.id}` : 'Nuevo cliente'} onClose={() => setEditing(null)} wide><ClientForm initial={editing} meta={meta} onSave={save} busy={busy} err={err} /></Modal>}
      {projectFor && <NewProjectModal meta={meta} api={api} presetClientId={projectFor.id} onClose={() => setProjectFor(null)} />}
    </ProjectsLayout>
  )
}

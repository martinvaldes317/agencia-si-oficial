import { useEffect, useState } from 'react'
import ProjectsLayout from './ProjectsLayout'
import { useProjectsApi, Card, Btn, Field, inputCls, Spinner, Pill } from './ui'

export default function ProjectsSettings() {
  const { api } = useProjectsApi()
  const [templates, setTemplates] = useState(null); const [msg, setMsg] = useState(''); const [busy, setBusy] = useState('')
  const [draft, setDraft] = useState({ code: '', name: '', body: '' })
  useEffect(() => { api('/templates/all').then(r => setTemplates(r.templates)).catch(e => setMsg(e.message)) }, [api])

  const edit = (code, k, v) => setTemplates(t => t.map(x => x.code === code ? { ...x, [k]: v } : x))
  const save = async t => {
    setBusy(t.code); setMsg('')
    try { const r = await api(`/templates/${t.code}`, { method: 'PUT', body: { name: t.name, body: t.body } }); setTemplates(r.templates); setMsg(`Plantilla ${t.code} guardada`) }
    catch (e) { setMsg(e.message) } finally { setBusy('') }
  }
  const remove = async code => {
    if (!confirm(`¿Eliminar la plantilla ${code}?`)) return
    const r = await api(`/templates/${code}`, { method: 'DELETE' }); setTemplates(r.templates)
  }
  const importOrders = async () => {
    setBusy('import'); setMsg('')
    try { const r = await api('/sync/orders', { method: 'POST' }); setMsg(`Se sincronizaron ${r.synced} pedidos del formulario.`) }
    catch (e) { setMsg(e.message) } finally { setBusy('') }
  }

  return (
    <ProjectsLayout title="Configuración">
      {msg && <p className="text-xs text-emerald-400 mb-4">{msg}</p>}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Plantillas de WhatsApp</h2>
          <p className="text-xs text-zinc-500">Variables disponibles: <code className="text-zinc-300">{'{URL_PREVIEW}'}</code> (enlace de la última versión), <code className="text-zinc-300">{'{NOMBRE}'}</code>, <code className="text-zinc-300">{'{NEGOCIO}'}</code>.</p>
          {!templates ? <Spinner /> : templates.map(t => (
            <Card key={t.code} className="p-4 space-y-3">
              <div className="flex items-center justify-between"><Pill color="violet">{t.code}</Pill>
                <div className="flex gap-2"><Btn variant="danger" onClick={() => remove(t.code)}>Eliminar</Btn><Btn variant="primary" loading={busy === t.code} onClick={() => save(t)}>Guardar</Btn></div></div>
              <input className={inputCls} value={t.name} onChange={e => edit(t.code, 'name', e.target.value)} />
              <textarea rows={3} className={inputCls} value={t.body} onChange={e => edit(t.code, 'body', e.target.value)} />
            </Card>
          ))}
          <Card className="p-4 space-y-3">
            <h3 className="text-xs font-bold text-white">Nueva plantilla</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Código (ej: RECORDATORIO)"><input className={inputCls} value={draft.code} onChange={e => setDraft({ ...draft, code: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '') })} /></Field>
              <Field label="Nombre"><input className={inputCls} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} /></Field>
            </div>
            <textarea rows={3} className={inputCls} placeholder="Mensaje…" value={draft.body} onChange={e => setDraft({ ...draft, body: e.target.value })} />
            <Btn variant="primary" disabled={!draft.code || !draft.body} onClick={async () => { await save(draft); setDraft({ code: '', name: '', body: '' }) }}>Agregar plantilla</Btn>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Sistema</h2>
          <Card className="p-4 space-y-3">
            <p className="text-sm font-bold text-white">Pedidos del formulario</p>
            <p className="text-xs text-zinc-500">Los pedidos nuevos entran solos. Este botón importa los anteriores a la instalación del módulo (es seguro repetirlo).</p>
            <Btn variant="primary" loading={busy === 'import'} onClick={importOrders}>Importar pedidos existentes</Btn>
          </Card>
          <Card className="p-4 space-y-2">
            <p className="text-sm font-bold text-white">Acceso</p>
            <p className="text-xs text-zinc-500">Hoy solo el administrador accede. Los roles Ventas y Producción están previstos para una próxima etapa.</p>
          </Card>
          <Card className="p-4 space-y-2">
            <p className="text-sm font-bold text-white">Integraciones futuras</p>
            {['Generación de sitios con IA', 'Deploy en Hostinger / Git / SSH', 'WhatsApp API'].map(x => <div key={x} className="flex items-center justify-between text-xs text-zinc-400"><span>{x}</span><Pill>Próximamente</Pill></div>)}
          </Card>
        </div>
      </div>
    </ProjectsLayout>
  )
}

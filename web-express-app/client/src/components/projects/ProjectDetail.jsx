import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Sparkles, Upload, Trash2, FileText, Check, X as XIcon, ExternalLink, ChevronRight } from 'lucide-react'
import ProjectsLayout from './ProjectsLayout'
import { ClientForm } from './ProjectsClients'
import { useProjectsApi, money, fmtDate, fmtDay, waLink, StatusBadge, PaymentBadge, Pill, Card, Spinner, Btn, Modal, Field, inputCls } from './ui'

const lines = v => Array.isArray(v) ? v.join('\n') : (v || '')
const SITE_FIELDS = [
  ['businessName', 'Nombre del negocio'], ['descriptionShort', 'Descripción breve'], ['descriptionLong', 'Descripción completa', 'textarea'],
  ['services', 'Servicios (uno por línea)', 'list'], ['products', 'Productos (uno por línea)', 'list'],
  ['phone', 'Teléfono'], ['whatsapp', 'WhatsApp'], ['email', 'Email'], ['address', 'Dirección'], ['city', 'Ciudad'], ['schedule', 'Horario'],
  ['instagram', 'Instagram'], ['facebook', 'Facebook'], ['tiktok', 'TikTok'], ['linkedin', 'LinkedIn'], ['otherSocial', 'Otras redes'],
  ['hasDomain', 'Tiene dominio', 'select', [['', '—'], ['si', 'Sí'], ['no', 'No']]], ['domainCurrent', 'Dominio actual'],
  ['needsNewDomain', 'Necesita dominio nuevo', 'select', [['', '—'], ['si', 'Sí'], ['no', 'No']]], ['domainFinal', 'Dominio definitivo'],
  ['hosting', 'Hosting', 'select', [['pendiente', 'Pendiente'], ['agenciasi', 'Hosting AgenciaSi'], ['cliente', 'Hosting cliente']]],
]
const CONTENT_FIELDS = [
  ['heroTitle', 'Título principal'], ['heroSubtitle', 'Subtítulo'], ['about', 'Quiénes somos', 'textarea'], ['services', 'Servicios', 'textarea'],
  ['benefits', 'Beneficios', 'textarea'], ['contact', 'Contacto', 'textarea'], ['faq', 'Preguntas frecuentes', 'textarea'], ['cta', 'CTA principal'],
]

function InfoForm({ section, fields, values, onSave, extra }) {
  const [draft, setDraft] = useState(values || {})
  const [busy, setBusy] = useState(false)
  useEffect(() => setDraft(values || {}), [values])
  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }))
  const save = async () => { setBusy(true); try { await onSave({ [section]: draft }) } finally { setBusy(false) } }
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-3 mb-4">
        {fields.map(([k, label, type, opts]) => (
          <Field key={k} label={label} className={type === 'textarea' || type === 'list' ? 'md:col-span-2' : ''}>
            {type === 'textarea' ? <textarea rows={4} className={inputCls} value={draft[k] || ''} onChange={e => set(k, e.target.value)} />
              : type === 'list' ? <textarea rows={3} className={inputCls} value={lines(draft[k])} onChange={e => set(k, e.target.value.split('\n'))} onBlur={e => set(k, e.target.value.split('\n').map(x => x.trim()).filter(Boolean))} />
              : type === 'select' ? <select className={inputCls} value={draft[k] || ''} onChange={e => set(k, e.target.value)}>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
              : type === 'color' ? <div className="flex gap-2"><input type="color" className="h-9 w-12 bg-transparent" value={/^#[0-9a-f]{6}$/i.test(draft[k] || '') ? draft[k] : '#000000'} onChange={e => set(k, e.target.value)} /><input className={inputCls} value={draft[k] || ''} onChange={e => set(k, e.target.value)} placeholder="#000000" /></div>
              : <input className={inputCls} value={draft[k] || ''} onChange={e => set(k, e.target.value)} />}
          </Field>
        ))}
      </div>
      {extra}
      <Btn variant="primary" onClick={save} loading={busy}>Guardar cambios</Btn>
    </div>
  )
}

function FileThumb({ file, fileBlobUrl }) {
  const [src, setSrc] = useState(null)
  const isImg = (file.mime || '').startsWith('image/')
  useEffect(() => {
    if (!isImg) return
    let url; let alive = true
    fileBlobUrl(file.id).then(u => { url = u; if (alive) setSrc(u) }).catch(() => {})
    return () => { alive = false; if (url) URL.revokeObjectURL(url) }
  }, [file.id, isImg, fileBlobUrl])
  return src ? <img src={src} alt={file.name} className="w-full h-full object-cover" /> : <FileText className="w-8 h-8 text-zinc-600" />
}

export default function ProjectDetail() {
  const { id } = useParams()
  const { api, upload, fileBlobUrl, meta } = useProjectsApi()
  const [d, setD] = useState(null); const [error, setError] = useState('')
  const [tab, setTab] = useState('resumen')
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')
  const [busy, setBusy] = useState('')

  const say = m => { setToast(m); setTimeout(() => setToast(''), 3500) }
  const load = useCallback(() => api(`/${id}`).then(setD).catch(e => setError(e.message)), [api, id])
  useEffect(() => { load() }, [load])

  const run = async (fn, okMsg) => {
    try { const r = await fn(); if (r?.project) setD(r); if (okMsg) say(okMsg); return r } catch (e) { say(e.message) }
  }
  const setStatus = (status, msg) => run(() => api(`/${id}/status`, { method: 'POST', body: { status } }), msg || 'Estado actualizado')
  const saveInfo = info => run(() => api(`/${id}`, { method: 'PUT', body: { info } }), 'Guardado')
  const saveProject = body => run(() => api(`/${id}`, { method: 'PUT', body }), 'Guardado')

  if (error) return <ProjectsLayout><p className="text-red-400 text-sm">{error}</p></ProjectsLayout>
  if (!d || !meta) return <ProjectsLayout><Spinner /></ProjectsLayout>

  const { project: p, client, payments, versions, feedback, files, history, completeness, nextAction } = d
  const paid = payments.reduce((a, x) => a + x.amount, 0)
  const owes = Math.max(0, p.totalAmount - paid)
  const phone = client?.whatsapp || client?.phone
  const name = `${client?.firstName || ''} ${client?.lastName || ''}`.trim() || client?.business || 'Cliente'
  const latestUrl = versions.find(v => v.previewUrl)?.previewUrl || p.stagingUrl || ''

  // Botón principal según la próxima acción
  const primary = {
    'Cobrar abono': () => setModal('pay:deposit'), 'Cobrar saldo': () => setModal('pay:balance'),
    'Contactar al cliente': () => setModal('wa'), 'Presentar la propuesta': () => setModal('wa:PROMO'),
    'Revisar información': () => setStatus('listo_produccion', 'Listo para producción'),
    'Crear V1': () => setModal('version'), 'Terminar y enviar versión': () => setTab('versiones'),
    'Enviar V1 al cliente': () => setModal('wa:VERSION_LISTA'), 'Enviar nueva versión al cliente': () => setModal('wa:CAMBIOS_REALIZADOS'),
    'Procesar cambios': () => setTab('feedback'), 'Publicar web': () => setStatus('publicado', 'Marcado como publicado'),
    'Marcar como finalizado': () => setStatus('finalizado', 'Proyecto finalizado'),
    'Pedir información faltante': () => setModal('wa:INFORMACION'), 'Esperar información': () => setModal('wa'),
  }[nextAction.title]

  const tabs = [['resumen', 'Resumen'], ['sitio', 'Información del sitio'], ['visual', 'Identidad visual'], ['contenido', 'Contenido'], ['archivos', `Archivos (${files.length})`],
    ['versiones', `Versiones (${versions.length})`], ['feedback', `Feedback (${feedback.length})`], ['pagos', 'Pagos'], ['deploy', 'Despliegue'], ['historial', 'Historial']]

  return (
    <ProjectsLayout title={`#${p.id}`}
      actions={<Link to="/admin/proyectos/lista" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Volver</Link>}>
      {toast && <div className="fixed top-5 right-5 z-[60] bg-white text-black text-xs font-bold px-4 py-2.5 rounded-lg shadow-xl">{toast}</div>}

      {/* Encabezado: cliente, qué compró, cuánto pagó/debe, estado */}
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Card className="p-5 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-xl font-bold text-white">{name}</p>
              <p className="text-sm text-zinc-500">{client?.business}{client?.email ? ` · ${client.email}` : ''}{phone ? ` · +${phone}` : ''}</p>
            </div>
            <div className="flex gap-2 flex-wrap"><StatusBadge status={p.status} meta={meta} /><PaymentBadge status={p.paymentStatus} meta={meta} /></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[['Compró', p.serviceType], ['Total', money(p.totalAmount)], ['Pagado', money(paid)], ['Debe', money(owes)]].map(([l, v]) => (
              <div key={l}><p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{l}</p><p className={`text-lg font-bold ${l === 'Debe' && owes > 0 ? 'text-amber-400' : l === 'Pagado' ? 'text-emerald-400' : 'text-white'}`}>{v}</p></div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/5">
            <div><p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Información</p><p className="text-sm text-white font-bold">{completeness.percent}%{p.infoSufficient ? ' · suficiente' : ''}</p></div>
            <div><p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Responsable</p>
              <input defaultValue={p.assignedTo || ''} placeholder="Sin asignar" onBlur={e => e.target.value !== (p.assignedTo || '') && saveProject({ assignedTo: e.target.value })} className="bg-transparent border-b border-white/10 text-sm text-white w-full focus:outline-none focus:border-white/40" /></div>
            <div><p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Origen</p><p className="text-sm text-white">{client?.origin || '—'}</p></div>
            <div><p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Creado</p><p className="text-sm text-white">{fmtDay(p.createdAt)}</p></div>
          </div>
        </Card>

        <div className="rounded-2xl p-5 bg-gradient-to-br from-violet-600/30 to-indigo-600/10 border border-violet-500/30 flex flex-col">
          <p className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mb-2">Próxima acción</p>
          <p className="text-2xl font-bold text-white leading-tight mb-1">{nextAction.title}</p>
          <p className="text-xs text-zinc-400 mb-4 flex-1">{nextAction.hint}</p>
          {primary && <Btn variant="primary" onClick={primary} className="w-full">{nextAction.title} <ChevronRight className="w-3.5 h-3.5" /></Btn>}
        </div>
      </div>

      {/* Acciones rápidas */}
      <Card className="p-4 mb-5">
        <div className="flex flex-wrap gap-2">
          <a href={phone ? waLink(phone) : undefined} target="_blank" rel="noopener noreferrer"
            className={`px-3.5 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 bg-emerald-500 text-black hover:bg-emerald-400 ${phone ? '' : 'opacity-40 pointer-events-none'}`}><MessageCircle className="w-3.5 h-3.5" /> Abrir WhatsApp</a>
          <Btn onClick={() => setModal('wa:PROMO')}>Enviar landing promoción</Btn>
          <Btn onClick={() => setModal('wa')}>Plantillas WhatsApp</Btn>
          <Btn onClick={() => setModal('pay:deposit')} disabled={['abono_pagado', 'pago_completo'].includes(p.paymentStatus)}>Registrar abono</Btn>
          <Btn onClick={() => setStatus('info_completa', 'Información marcada como recibida')} disabled={['info_completa', 'listo_produccion'].includes(p.status)}>Marcar información recibida</Btn>
          <Btn onClick={() => setModal('version')}>Crear versión</Btn>
          <Btn onClick={() => setModal('feedback')}>Registrar feedback</Btn>
          <Btn onClick={() => setStatus('aprobado', 'Marcado como aprobado')} disabled={p.status === 'aprobado'}>Marcar aprobado</Btn>
          <Btn onClick={() => setModal('pay:balance')} disabled={p.paymentStatus !== 'abono_pagado'}>Registrar saldo</Btn>
          <Btn onClick={() => setStatus('publicado', 'Marcado como publicado')} disabled={p.status === 'publicado'}>Marcar publicado</Btn>
          <Btn onClick={() => run(() => api(`/${id}/ai/generate`, { method: 'POST' }))} className="opacity-60"><Sparkles className="w-3.5 h-3.5" /> Generar sitio con IA</Btn>
          <select value={p.status} onChange={e => setStatus(e.target.value)} className={`${inputCls} !w-auto !py-1.5 text-xs`} title="Cambiar estado manualmente">
            {meta.statuses.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
      </Card>

      <div className="flex gap-1 overflow-x-auto border-b border-white/5 mb-5">
        {tabs.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 -mb-px ${tab === k ? 'border-white text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>{l}</button>)}
      </div>

      {tab === 'resumen' && (
        <div className="grid lg:grid-cols-2 gap-5">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-bold text-white">Calidad de la información</h3><span className="text-2xl font-bold text-white">{completeness.percent}%</span></div>
            <div className="h-2 rounded-full bg-white/10 mb-4 overflow-hidden"><div className="h-full bg-emerald-500 transition-all" style={{ width: `${completeness.percent}%` }} /></div>
            <ul className="grid grid-cols-2 gap-2 mb-4">
              {completeness.items.map(i => <li key={i.key} className={`text-xs flex items-center gap-1.5 ${i.ok ? 'text-emerald-400' : 'text-zinc-500'}`}>{i.ok ? <Check className="w-3.5 h-3.5" /> : <XIcon className="w-3.5 h-3.5 text-red-400" />}{i.label}</li>)}
            </ul>
            <Btn onClick={() => saveProject({ infoSufficient: !p.infoSufficient })} variant={p.infoSufficient ? 'green' : 'ghost'}>
              {p.infoSufficient ? '✓ Información marcada como suficiente' : 'Marcar información como suficiente para comenzar'}</Btn>
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-bold text-white mb-3">Cliente</h3>
            <ClientForm initial={client} meta={meta} busy={busy === 'client'} onSave={async c => { setBusy('client'); await run(async () => { await api(`/clients/${client.id}`, { method: 'PUT', body: { ...c, lastContactAt: c.lastContactAt || null } }); return api(`/${id}`) }, 'Cliente guardado'); setBusy('') }} />
          </Card>
        </div>
      )}

      {tab === 'sitio' && <Card className="p-5"><InfoForm section="site" fields={SITE_FIELDS} values={p.info.site} onSave={saveInfo} /></Card>}
      {tab === 'visual' && (
        <Card className="p-5">
          <InfoForm section="visual" values={p.info.visual} onSave={saveInfo}
            fields={[['colorPrimary', 'Color principal', 'color'], ['colorSecondary', 'Color secundario', 'color'], ['colorExtra', 'Color adicional', 'color'], ['typography', 'Tipografía preferida'],
              ['style', 'Estilo visual', 'select', [['', '—'], ...meta.visualStyles.map(s => [s, s])]], ['ref1', 'URL sitio referencia 1'], ['ref2', 'URL sitio referencia 2'], ['ref3', 'URL sitio referencia 3'], ['comments', 'Comentarios', 'textarea']]}
            extra={<p className="text-xs text-zinc-500 mb-4">Logo y logo alternativo: súbelos en la pestaña Archivos con la categoría «Logos».</p>} />
        </Card>
      )}
      {tab === 'contenido' && (
        <Card className="p-5 space-y-6">
          <InfoForm section="content" fields={CONTENT_FIELDS} values={p.info.content} onSave={saveInfo} />
          <div className="border-t border-white/5 pt-5">
            <FreeText value={p.info.free} onSave={v => saveInfo({ free: v })} />
          </div>
        </Card>
      )}

      {tab === 'archivos' && (
        <FilesTab files={files} meta={meta} upload={upload} fileBlobUrl={fileBlobUrl} projectId={id}
          onChange={r => { if (r?.project) setD(r) }} say={say} api={api} />
      )}

      {tab === 'versiones' && (
        <div className="space-y-3">
          <Btn variant="primary" onClick={() => setModal('version')}>+ Crear versión</Btn>
          {versions.length === 0 && <p className="text-zinc-600 text-sm">Todavía no hay versiones.</p>}
          {versions.map(v => (
            <Card key={v.id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3"><span className="text-lg font-bold text-white">Versión {v.number}</span><span className="text-xs text-zinc-500">{fmtDate(v.createdAt)} · {v.createdBy}</span></div>
                <select value={v.status} onChange={e => run(async () => { await api(`/versions/${v.id}`, { method: 'PUT', body: { status: e.target.value } }); return api(`/${id}`) }, 'Versión actualizada')} className={`${inputCls} !w-auto !py-1.5 text-xs`}>
                  {meta.versionStatuses.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
              {v.previewUrl && <a href={v.previewUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-400 hover:underline inline-flex items-center gap-1 mb-2"><ExternalLink className="w-3 h-3" />{v.previewUrl}</a>}
              {v.changes && <p className="text-xs text-zinc-300 whitespace-pre-wrap mb-1"><b className="text-zinc-500">Cambios:</b> {v.changes}</p>}
              {v.notes && <p className="text-xs text-zinc-400 whitespace-pre-wrap"><b className="text-zinc-500">Notas internas:</b> {v.notes}</p>}
            </Card>
          ))}
        </div>
      )}

      {tab === 'feedback' && (
        <div className="space-y-3">
          <Btn variant="primary" onClick={() => setModal('feedback')}>+ Registrar feedback</Btn>
          {feedback.length === 0 && <p className="text-zinc-600 text-sm">Sin feedback registrado.</p>}
          {feedback.map(fb => (
            <Card key={fb.id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <span className="text-sm font-bold text-white">Revisión #{fb.round} <span className="text-xs text-zinc-500 font-normal">· {fmtDate(fb.createdAt)}</span></span>
                <select value={fb.status} onChange={e => run(async () => { await api(`/feedback/${fb.id}`, { method: 'PUT', body: { status: e.target.value } }); return api(`/${id}`) }, 'Feedback actualizado')} className={`${inputCls} !w-auto !py-1.5 text-xs`}>
                  {meta.feedbackStatuses.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
              <p className="text-sm text-zinc-200 whitespace-pre-wrap mb-3"><b className="text-zinc-500 text-[10px] uppercase tracking-widest block">Cliente solicita</b>{fb.originalText}</p>
              <textarea disabled rows={2} className={`${inputCls} opacity-50`} placeholder="Prompt procesado para IA — se completará cuando se integre la IA" value={fb.aiPrompt || ''} readOnly />
            </Card>
          ))}
        </div>
      )}

      {tab === 'pagos' && (
        <div className="grid lg:grid-cols-2 gap-5">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Información comercial</h3>
            <CommercialForm p={p} meta={meta} onSave={saveProject} />
            <div className="flex gap-2 pt-2">
              <Btn variant="primary" onClick={() => setModal('pay:deposit')} disabled={['abono_pagado', 'pago_completo'].includes(p.paymentStatus)}>Registrar abono</Btn>
              <Btn onClick={() => setModal('pay:balance')} disabled={p.paymentStatus !== 'abono_pagado'}>Registrar saldo</Btn>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-bold text-white mb-3">Pagos registrados</h3>
            {payments.length === 0 ? <p className="text-zinc-600 text-sm">Sin pagos.</p> : payments.map(x => (
              <div key={x.id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <div><p className="text-sm text-white font-bold">{x.kind === 'deposit' ? 'Abono' : 'Saldo'} · {money(x.amount)}</p>
                  <p className="text-[11px] text-zinc-500">{fmtDate(x.paidAt)} · {meta.paymentMethods.find(m => m.key === x.method)?.label || x.method || '—'}{x.mpPaymentId ? ` · MP #${x.mpPaymentId}` : x.txId ? ` · ${x.txId}` : ''}</p></div>
                <Pill color="emerald">Pagado</Pill>
              </div>
            ))}
            <p className="text-[11px] text-zinc-500 mt-3">Abono: {fmtDate(p.depositPaidAt)} · Pago final: {fmtDate(p.balancePaidAt)} · ID transacción: {p.depositTxId || '—'}</p>
          </Card>
        </div>
      )}

      {tab === 'deploy' && (
        <Card className="p-5">
          <DeployForm p={p} onSave={saveProject} />
          <p className="text-[11px] text-zinc-500 mt-4">Aún sin conexión con Hostinger. Nunca guardes contraseñas o llaves aquí: las credenciales de despliegue irán en variables de entorno del servidor.</p>
        </Card>
      )}

      {tab === 'historial' && (
        <Card className="p-5">
          {history.length === 0 ? <p className="text-zinc-600 text-sm">Sin registros.</p> : history.map(h => (
            <div key={h.id} className="flex gap-3 py-2.5 border-b border-white/5 last:border-0 text-xs">
              <span className="text-zinc-500 w-36 shrink-0">{fmtDate(h.createdAt)}</span>
              <span className="text-zinc-300 font-semibold w-40 shrink-0">{h.action.replace(/_/g, ' ')}</span>
              <span className="text-zinc-400 flex-1">
                {h.fromValue || h.toValue ? <>{h.fromValue && <b className="text-zinc-300">{meta.statuses.find(s => s.key === h.fromValue)?.label || h.fromValue}</b>}{h.fromValue && h.toValue ? ' → ' : ''}{h.toValue && <b className="text-zinc-300">{meta.statuses.find(s => s.key === h.toValue)?.label || h.toValue}</b>}</> : null}
                {h.detail ? <span className="text-zinc-600"> {JSON.stringify(h.detail)}</span> : null}
              </span>
              <span className="text-zinc-500">{h.actor}</span>
            </div>
          ))}
        </Card>
      )}

      {modal?.startsWith('pay:') && <PaymentModal kind={modal.split(':')[1]} p={p} meta={meta} onClose={() => setModal(null)}
        onSubmit={body => run(() => api(`/${id}/payments`, { method: 'POST', body }), body.kind === 'deposit' ? 'Abono registrado' : 'Saldo registrado').then(() => setModal(null))} />}
      {modal === 'version' && <VersionModal meta={meta} onClose={() => setModal(null)} nextNumber={(versions[0]?.number || 0) + 1}
        onSubmit={body => run(() => api(`/${id}/versions`, { method: 'POST', body }), 'Versión creada').then(() => { setModal(null); setTab('versiones') })} />}
      {modal === 'feedback' && <FeedbackModal versions={versions} onClose={() => setModal(null)}
        onSubmit={body => run(() => api(`/${id}/feedback`, { method: 'POST', body }), 'Feedback registrado').then(() => { setModal(null); setTab('feedback') })} />}
      {modal?.startsWith('wa') && <WhatsAppModal api={api} phone={phone} client={client} p={p} url={latestUrl} preset={modal.split(':')[1]} onClose={() => setModal(null)}
        onSent={() => api(`/clients/${client.id}`, { method: 'PUT', body: { lastContactAt: new Date().toISOString() } }).catch(() => {})} />}
    </ProjectsLayout>
  )
}

function FreeText({ value, onSave }) {
  const [v, setV] = useState(value || ''); const [busy, setBusy] = useState(false)
  useEffect(() => setV(value || ''), [value])
  return (
    <div>
      <Field label="Información entregada libremente por el cliente"><textarea rows={8} className={inputCls} value={v} onChange={e => setV(e.target.value)} /></Field>
      <Btn variant="primary" className="mt-3" loading={busy} onClick={async () => { setBusy(true); try { await onSave(v) } finally { setBusy(false) } }}>Guardar texto</Btn>
    </div>
  )
}

function CommercialForm({ p, meta, onSave }) {
  const [net, setNet] = useState(p.netAmount); const [pct, setPct] = useState(p.depositPct); const [method, setMethod] = useState(p.payMethod || '')
  const locked = ['abono_pagado', 'pago_completo'].includes(p.paymentStatus)
  const iva = Math.round(net * p.ivaRate), total = Math.round(net) + iva, dep = Math.round(total * pct / 100)
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field label="Valor neto"><input type="number" disabled={locked} className={inputCls} value={net} onChange={e => setNet(e.target.value)} /></Field>
        <Field label="% de abono"><input type="number" disabled={locked} className={inputCls} value={pct} onChange={e => setPct(e.target.value)} /></Field>
        <Field label="Método de pago"><select className={inputCls} value={method} onChange={e => setMethod(e.target.value)}><option value="">—</option>{meta.paymentMethods.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}</select></Field>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm mb-3">
        {[['IVA (19%)', money(iva)], ['Valor total', money(total)], [`Abono ${pct}%`, money(dep)], ['Saldo pendiente', money(total - dep)]].map(([l, v]) => <div key={l} className="flex justify-between"><span className="text-zinc-500">{l}</span><b className="text-white">{v}</b></div>)}
      </div>
      <Btn onClick={() => onSave({ netAmount: Number(net), depositPct: Number(pct), payMethod: method })}>Guardar valores</Btn>
      {locked && <p className="text-[11px] text-zinc-500 mt-2">Con pagos registrados el valor neto ya no se puede modificar.</p>}
    </div>
  )
}

function DeployForm({ p, onSave }) {
  const [f, setF] = useState({ serverName: p.serverName || '', stagingUrl: p.stagingUrl || '', productionUrl: p.productionUrl || '', repoUrl: p.repoUrl || '', deployStatus: p.deployStatus || '' })
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {[['serverName', 'Servidor'], ['stagingUrl', 'Staging URL'], ['productionUrl', 'Producción URL'], ['repoUrl', 'Repositorio'], ['deployStatus', 'Estado deploy']].map(([k, l]) => (
        <Field key={k} label={l}><input className={inputCls} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} /></Field>
      ))}
      <Field label="Último deploy"><input disabled className={inputCls} value={p.lastDeployAt ? fmtDate(p.lastDeployAt) : '—'} readOnly /></Field>
      <div className="md:col-span-2"><Btn variant="primary" onClick={() => onSave(f)}>Guardar</Btn></div>
    </div>
  )
}

function FilesTab({ files, meta, upload, fileBlobUrl, projectId, onChange, say, api }) {
  const [cat, setCat] = useState('foto'); const [filter, setFilter] = useState(''); const [busy, setBusy] = useState(false)
  const onPick = async e => {
    const list = Array.from(e.target.files || []); e.target.value = ''
    if (!list.length) return
    const fd = new FormData(); fd.append('category', cat); list.forEach(f => fd.append('files', f))
    setBusy(true)
    try { onChange(await upload(`/${projectId}/files`, fd)); say('Archivos subidos') } catch (err) { say(err.message) } finally { setBusy(false) }
  }
  const open = async f => { try { window.open(await fileBlobUrl(f.id), '_blank') } catch (e) { say(e.message) } }
  const remove = async f => {
    if (!confirm(`¿Eliminar ${f.name}?`)) return
    try { await api(`/files/${f.id}`, { method: 'DELETE' }); onChange(await api(`/${projectId}`)) } catch (e) { say(e.message) }
  }
  const shown = filter ? files.filter(f => f.category === filter) : files
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <select value={cat} onChange={e => setCat(e.target.value)} className={`${inputCls} !w-auto`}>{meta.fileCategories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}</select>
        <label className={`px-3.5 py-2 rounded-lg text-xs font-bold bg-white text-black cursor-pointer inline-flex items-center gap-1.5 ${busy ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload className="w-3.5 h-3.5" /> {busy ? 'Subiendo…' : 'Subir archivos'}<input type="file" multiple className="hidden" onChange={onPick} accept=".jpg,.jpeg,.png,.webp,.gif,.svg,.pdf,.doc,.docx,.xls,.xlsx,.txt" />
        </label>
        <select value={filter} onChange={e => setFilter(e.target.value)} className={`${inputCls} !w-auto ml-auto`}><option value="">Todas las categorías</option>{meta.fileCategories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}</select>
      </div>
      {shown.length === 0 ? <p className="text-zinc-600 text-sm">No hay archivos.</p> : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {shown.map(f => (
            <div key={f.id} className="group relative bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
              <button onClick={() => open(f)} className="block w-full aspect-square flex items-center justify-center bg-black/30"><FileThumb file={f} fileBlobUrl={fileBlobUrl} /></button>
              <div className="p-2"><p className="text-[11px] text-zinc-300 truncate" title={f.name}>{f.name}</p><p className="text-[10px] text-zinc-600">{meta.fileCategories.find(c => c.key === f.category)?.label}</p></div>
              <button onClick={() => remove(f)} className="absolute top-1.5 right-1.5 p-1.5 rounded-md bg-black/70 opacity-0 group-hover:opacity-100 hover:bg-red-500/80"><Trash2 className="w-3 h-3 text-white" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PaymentModal({ kind, p, meta, onClose, onSubmit }) {
  const [amount, setAmount] = useState(kind === 'deposit' ? p.depositAmount : p.balanceAmount)
  const [method, setMethod] = useState(p.payMethod || 'transferencia'); const [txId, setTxId] = useState('')
  const [paidAt, setPaidAt] = useState(new Date().toISOString().slice(0, 10)); const [busy, setBusy] = useState(false)
  return (
    <Modal title={kind === 'deposit' ? 'Registrar abono' : 'Registrar saldo'} onClose={onClose}>
      <div className="space-y-3">
        <Field label="Monto (IVA incluido)"><input type="number" className={inputCls} value={amount} onChange={e => setAmount(e.target.value)} /></Field>
        <Field label="Método de pago"><select className={inputCls} value={method} onChange={e => setMethod(e.target.value)}>{meta.paymentMethods.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}</select></Field>
        <Field label="ID de transacción (opcional)"><input className={inputCls} value={txId} onChange={e => setTxId(e.target.value)} /></Field>
        <Field label="Fecha del pago"><input type="date" className={inputCls} value={paidAt} onChange={e => setPaidAt(e.target.value)} /></Field>
        <Btn variant="primary" className="w-full" loading={busy} onClick={async () => { setBusy(true); await onSubmit({ kind, amount: Number(amount), method, txId, paidAt }); setBusy(false) }}>Confirmar pago</Btn>
      </div>
    </Modal>
  )
}

function VersionModal({ meta, nextNumber, onClose, onSubmit }) {
  const [f, setF] = useState({ previewUrl: '', status: 'generando', notes: '', changes: '' }); const [busy, setBusy] = useState(false)
  return (
    <Modal title={`Crear versión ${nextNumber}`} onClose={onClose}>
      <div className="space-y-3">
        <Field label="URL preview / staging"><input className={inputCls} value={f.previewUrl} onChange={e => setF({ ...f, previewUrl: e.target.value })} placeholder="https://" /></Field>
        <Field label="Estado"><select className={inputCls} value={f.status} onChange={e => setF({ ...f, status: e.target.value })}>{meta.versionStatuses.filter(s => ['generando', 'lista', 'enviada'].includes(s.key)).map(s => <option key={s.key} value={s.key}>{s.label}</option>)}</select></Field>
        <Field label="Cambios realizados"><textarea rows={3} className={inputCls} value={f.changes} onChange={e => setF({ ...f, changes: e.target.value })} /></Field>
        <Field label="Notas internas"><textarea rows={3} className={inputCls} value={f.notes} onChange={e => setF({ ...f, notes: e.target.value })} /></Field>
        <Btn variant="primary" className="w-full" loading={busy} onClick={async () => { setBusy(true); await onSubmit(f); setBusy(false) }}>Crear versión</Btn>
      </div>
    </Modal>
  )
}

function FeedbackModal({ versions, onClose, onSubmit }) {
  const [text, setText] = useState(''); const [versionId, setVersionId] = useState(versions[0]?.id || ''); const [busy, setBusy] = useState(false)
  return (
    <Modal title="Registrar feedback del cliente" onClose={onClose} wide>
      <div className="space-y-3">
        <Field label="Versión revisada"><select className={inputCls} value={versionId} onChange={e => setVersionId(e.target.value)}><option value="">—</option>{versions.map(v => <option key={v.id} value={v.id}>Versión {v.number}</option>)}</select></Field>
        <Field label="Texto original del cliente"><textarea rows={7} autoFocus className={inputCls} value={text} onChange={e => setText(e.target.value)} placeholder="- cambiar fotografía principal&#10;- modificar texto de servicios" /></Field>
        <Btn variant="primary" className="w-full" disabled={!text.trim()} loading={busy} onClick={async () => { setBusy(true); await onSubmit({ text, versionId: versionId ? Number(versionId) : null }); setBusy(false) }}>Guardar feedback</Btn>
      </div>
    </Modal>
  )
}

function WhatsAppModal({ api, phone, client, p, url, preset, onClose, onSent }) {
  const [templates, setTemplates] = useState([]); const [code, setCode] = useState(preset || ''); const [text, setText] = useState('')
  const fill = t => t.replace(/\{URL_PREVIEW\}/g, url || '[falta URL de preview]').replace(/\{NOMBRE\}/g, client?.firstName || '').replace(/\{NEGOCIO\}/g, client?.business || p.name || '')
  useEffect(() => { api('/templates/all').then(r => setTemplates(r.templates)).catch(() => {}) }, [api])
  useEffect(() => { const t = templates.find(x => x.code === code); if (t) setText(fill(t.body)) }, [code, templates]) // eslint-disable-line
  return (
    <Modal title="Enviar por WhatsApp" onClose={onClose} wide>
      {!phone && <p className="text-xs text-red-400 mb-3">Este cliente no tiene WhatsApp ni teléfono registrado.</p>}
      <Field label="Plantilla" className="mb-3">
        <select className={inputCls} value={code} onChange={e => setCode(e.target.value)}><option value="">Mensaje libre</option>{templates.map(t => <option key={t.code} value={t.code}>{t.name}</option>)}</select>
      </Field>
      <Field label="Mensaje" className="mb-4"><textarea rows={6} className={inputCls} value={text} onChange={e => setText(e.target.value)} /></Field>
      <a href={phone ? waLink(phone, text) : undefined} target="_blank" rel="noopener noreferrer" onClick={() => { onSent(); onClose() }}
        className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 bg-emerald-500 text-black hover:bg-emerald-400 ${phone ? '' : 'opacity-40 pointer-events-none'}`}>
        <MessageCircle className="w-3.5 h-3.5" /> Abrir en WhatsApp</a>
    </Modal>
  )
}

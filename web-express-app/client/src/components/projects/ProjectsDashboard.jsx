import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectsLayout from './ProjectsLayout'
import { useProjectsApi, money, Card, Spinner, Btn, inputCls } from './ui'

const RANGES = [['today', 'Hoy'], ['7d', 'Últimos 7 días'], ['30d', 'Últimos 30 días'], ['month', 'Este mes'], ['custom', 'Rango personalizado']]

function Stat({ label, value, to, tone }) {
  const body = (
    <Card className={`p-4 ${to ? 'hover:bg-white/[0.08] transition-colors' : ''}`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">{label}</p>
      <p className={`text-2xl font-bold ${tone || 'text-white'}`}>{value}</p>
    </Card>
  )
  return to ? <Link to={to}>{body}</Link> : body
}

export default function ProjectsDashboard() {
  const { api } = useProjectsApi()
  const [range, setRange] = useState('30d')
  const [from, setFrom] = useState(''); const [to, setTo] = useState('')
  const [data, setData] = useState(null); const [error, setError] = useState('')

  useEffect(() => {
    if (range === 'custom' && !from) return
    setError('')
    const qs = `range=${range}${range === 'custom' ? `&from=${from}&to=${to}` : ''}`
    api(`/dashboard?${qs}`).then(setData).catch(e => setError(e.message))
  }, [range, from, to, api])

  const c = data?.counters, f = data?.financial
  const maxPipe = Math.max(1, ...(data?.pipeline || []).map(s => s.count))

  return (
    <ProjectsLayout title="Dashboard">
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {RANGES.map(([k, l]) => (
          <button key={k} onClick={() => setRange(k)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${range === k ? 'bg-white text-black border-white' : 'border-white/10 text-zinc-400 hover:text-white'}`}>{l}</button>
        ))}
        {range === 'custom' && (
          <>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} className={`${inputCls} !w-auto`} />
            <input type="date" value={to} onChange={e => setTo(e.target.value)} className={`${inputCls} !w-auto`} />
          </>
        )}
      </div>

      {error ? <p className="text-red-400 text-sm">{error}</p> : !data ? <Spinner /> : (
        <div className="space-y-8">
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Finanzas del período</h2>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <Stat label="Ventas totales" value={money(f.totalSales)} />
              <Stat label="Abonos recibidos" value={money(f.depositsReceived)} tone="text-emerald-400" />
              <Stat label="Saldos pendientes" value={money(f.pendingBalance)} tone="text-amber-400" />
              <Stat label="Proyectos vendidos" value={f.projectsSold} />
              <Stat label="Ticket promedio" value={money(f.averageTicket)} />
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Estado actual</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <Stat label="Clientes nuevos" value={c.newClients} to="/admin/proyectos/clientes" />
              <Stat label="Proyectos activos" value={c.activeProjects} to="/admin/proyectos/lista?vista=activos" />
              <Stat label="Pendientes de abono" value={c.pendingDeposit} tone="text-amber-400" />
              <Stat label="Pendientes de información" value={c.pendingInfo} tone="text-amber-400" to="/admin/proyectos/lista?vista=pendientes_info" />
              <Stat label="En desarrollo" value={c.inDevelopment} to="/admin/proyectos/lista?vista=desarrollo" />
              <Stat label="Esperando revisión cliente" value={c.awaitingReview} to="/admin/proyectos/lista?vista=revision" />
              <Stat label="Cambios solicitados" value={c.changesRequested} tone="text-orange-400" />
              <Stat label="Pendientes de saldo" value={c.pendingBalance} tone="text-amber-400" />
              <Stat label="Finalizados" value={c.finished} tone="text-emerald-400" to="/admin/proyectos/lista?vista=finalizados" />
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Pipeline</h2>
            <Card className="p-5">
              <div className="flex items-stretch gap-1.5 overflow-x-auto">
                {data.pipeline.map((s, i) => (
                  <div key={s.key} className="flex-1 min-w-[92px]">
                    <div className="h-16 flex items-end mb-2"><div className="w-full rounded-t-md bg-violet-500/40" style={{ height: `${Math.max(6, (s.count / maxPipe) * 100)}%` }} /></div>
                    <p className="text-white font-bold text-lg leading-none">{s.count}</p>
                    <p className="text-[10px] text-zinc-500 mt-1 leading-tight">{i + 1}. {s.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {data.byOrigin.length > 0 && (
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Origen de los proyectos del período</h2>
              <div className="flex flex-wrap gap-2">
                {data.byOrigin.map(o => <span key={o.origin} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300">{o.origin}: <b className="text-white">{o.n}</b></span>)}
              </div>
            </section>
          )}
        </div>
      )}
    </ProjectsLayout>
  )
}

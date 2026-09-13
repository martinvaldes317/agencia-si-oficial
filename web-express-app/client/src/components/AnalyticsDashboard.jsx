import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { Lock, Loader2, Smartphone, Tablet, Monitor, Eye, Users, MessageCircle, FileText } from 'lucide-react'

const GRANULARITIES = [
  { value: 'day', label: 'Día' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'quarter', label: 'Trimestre' },
  { value: 'semester', label: 'Semestre' },
]

const DEVICE_LABELS = { mobile: 'Móvil', tablet: 'Tablet', desktop: 'Escritorio' }
const DEVICE_ICONS = { mobile: Smartphone, tablet: Tablet, desktop: Monitor }

function formatBucket(bucket, granularity) {
  const d = new Date(bucket)
  if (Number.isNaN(d.getTime())) return bucket
  if (granularity === 'day') return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' })
  if (granularity === 'week') return `Sem ${d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' })}`
  if (granularity === 'month') return d.toLocaleDateString('es-CL', { month: 'short', year: 'numeric' })
  if (granularity === 'quarter') return `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`
  return `S${d.getMonth() < 6 ? 1 : 2} ${d.getFullYear()}`
}

export default function AnalyticsDashboard() {
  const { adminToken, loginAdmin, authFetch } = useAuth()
  const [pwd, setPwd] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [granularity, setGranularity] = useState('day')
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!adminToken) { setLoading(false); return }
    setLoading(true)
    authFetch(`/api/analytics/summary?granularity=${granularity}`)
      .then(r => r.json())
      .then(data => { if (data.success) setSummary(data) })
      .finally(() => setLoading(false))
  }, [adminToken, granularity])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoggingIn(true); setLoginError('')
    try { await loginAdmin(pwd) }
    catch (err) { setLoginError(err.message || 'Contraseña incorrecta') }
    finally { setLoggingIn(false) }
  }

  if (!adminToken) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 bg-white flex items-center justify-center rounded-sm">
              <span className="text-black font-bold text-sm italic">SI</span>
            </div>
            <span className="text-white font-bold tracking-tighter text-sm uppercase">Admin Panel</span>
          </div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Contraseña de administrador</label>
          <div className="relative mb-4">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="password" value={pwd} onChange={e => setPwd(e.target.value)} required autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20"
            />
          </div>
          {loginError && <p className="text-red-400 text-xs mb-4">{loginError}</p>}
          <button type="submit" disabled={loggingIn}
            className="w-full bg-white text-black py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:opacity-50 transition-all">
            {loggingIn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Ingresar'}
          </button>
        </form>
      </div>
    )
  }

  const totals = summary?.totals || { pageviews: 0, uniqueVisitors: 0, whatsappClicks: 0, formSubmits: 0 }
  const devices = summary?.devices || { mobile: 0, tablet: 0, desktop: 0 }
  const deviceTotal = devices.mobile + devices.tablet + devices.desktop || 1
  const series = (summary?.series || []).map(row => ({ ...row, label: formatBucket(row.bucket, granularity) }))

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans antialiased p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-white font-bold uppercase tracking-widest text-sm">Analítica del sitio</h1>
        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
          {GRANULARITIES.map(g => (
            <button key={g.value} onClick={() => setGranularity(g.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${granularity === g.value ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Visitas', value: totals.pageviews, icon: Eye },
              { label: 'Visitantes únicos', value: totals.uniqueVisitors, icon: Users },
              { label: 'Clics WhatsApp', value: totals.whatsappClicks, icon: MessageCircle },
              { label: 'Formularios enviados', value: totals.formSubmits, icon: FileText },
            ].map(card => (
              <div key={card.label} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <card.icon className="w-4 h-4 text-zinc-500 mb-3" />
                <div className="text-2xl font-bold text-white">{card.value.toLocaleString('es-CL')}</div>
                <div className="text-xs text-zinc-500 mt-1">{card.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <h2 className="text-sm font-bold text-white mb-4">Visitas y visitantes en el tiempo</h2>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="label" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8 }} />
                  <Legend />
                  <Line type="monotone" dataKey="pageviews" name="Visitas" stroke="#22d3ee" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="visitors" name="Visitantes únicos" stroke="#a78bfa" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-sm font-bold text-white mb-4">Páginas más visitadas</h2>
              <div className="space-y-2">
                {(summary?.topPages || []).map(p => (
                  <div key={p.path} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 truncate pr-2">{p.path}</span>
                    <span className="text-white font-semibold">{p.pageviews}</span>
                  </div>
                ))}
                {(!summary?.topPages || summary.topPages.length === 0) && <p className="text-xs text-zinc-600">Sin datos en este período.</p>}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-sm font-bold text-white mb-4">Botones y formularios más usados</h2>
              <div className="space-y-2">
                {(summary?.topEvents || []).map((e, i) => (
                  <div key={`${e.eventName}-${e.label}-${i}`} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 truncate pr-2">{e.label || e.eventName}</span>
                    <span className="text-white font-semibold">{e.count}</span>
                  </div>
                ))}
                {(!summary?.topEvents || summary.topEvents.length === 0) && <p className="text-xs text-zinc-600">Sin datos en este período.</p>}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-sm font-bold text-white mb-4">Dispositivos</h2>
              <div className="space-y-3">
                {Object.entries(devices).map(([key, count]) => {
                  const Icon = DEVICE_ICONS[key]
                  const pct = Math.round((count / deviceTotal) * 100)
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="flex items-center gap-2 text-zinc-400"><Icon className="w-3.5 h-3.5" /> {DEVICE_LABELS[key]}</span>
                        <span className="text-white font-semibold">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { TrendingUp, CreditCard, Calendar, FolderOpen, MessageSquare, ArrowRight, AlertCircle } from 'lucide-react'

function StatCard({ icon: Icon, label, value, sub, to, color = 'white' }) {
  return (
    <Link to={to} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-colors group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color === 'white' ? 'bg-white' : 'bg-zinc-800'}`}>
          <Icon size={20} className={color === 'white' ? 'text-black' : 'text-zinc-400'} />
        </div>
        <ArrowRight size={16} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
      </div>
      <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
      {sub && <p className="text-zinc-600 text-xs mt-1">{sub}</p>}
    </Link>
  )
}

export default function PortalDashboard() {
  const { client, authFetch } = useAuth()
  const [data, setData] = useState(null)
  const [metrics, setMetrics] = useState([])
  const [payments, setPayments] = useState([])
  const [meetings, setMeetings] = useState([])
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      authFetch('/api/portal/me').then(r => r.json()),
      authFetch('/api/portal/metrics?limit=7').then(r => r.json()),
      authFetch('/api/portal/payments').then(r => r.json()),
      authFetch('/api/portal/meetings').then(r => r.json()),
      authFetch('/api/portal/tickets').then(r => r.json()),
    ]).then(([me, m, p, meet, t]) => {
      setData(me.client)
      setMetrics(m.metrics || [])
      setPayments(p.payments || [])
      setMeetings(meet.meetings || [])
      setTickets(t.tickets || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const pendingPayments = payments.filter(p => p.status === 'pendiente')
  const nextMeeting = meetings.find(m => new Date(m.date) > new Date() && m.status === 'programada')
  const openTickets = tickets.filter(t => t.status !== 'resuelto' && t.status !== 'cerrado')
  const latestMetric = metrics[0]

  // Last 7 metrics for mini chart
  const chartData = [...metrics].reverse().slice(-7)
  const maxSpend = Math.max(...chartData.map(m => m.spend), 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Hola, {client.name.split(' ')[0]} 👋</h1>
        <p className="text-zinc-500 text-sm mt-1">Aquí tienes el resumen de tu cuenta</p>
      </div>

      {/* Alerts */}
      {pendingPayments.length > 0 && (
        <div className="bg-amber-950/50 border border-amber-800 rounded-xl px-5 py-4 flex items-center gap-3">
          <AlertCircle size={18} className="text-amber-400 shrink-0" />
          <div>
            <p className="text-amber-300 text-sm font-medium">
              Tienes {pendingPayments.length} pago{pendingPayments.length > 1 ? 's' : ''} pendiente{pendingPayments.length > 1 ? 's' : ''}
            </p>
            <p className="text-amber-600 text-xs">
              Total: ${pendingPayments.reduce((s, p) => s + p.amount, 0).toLocaleString('es-CL')} CLP
            </p>
          </div>
          <Link to="/portal/pagos" className="ml-auto text-amber-400 hover:text-amber-300 text-xs font-medium whitespace-nowrap">Ver pagos →</Link>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp} label="ROAS actual" to="/portal/metricas"
          value={latestMetric ? `${latestMetric.roas.toFixed(1)}x` : '—'}
          sub={latestMetric ? latestMetric.platform : 'Sin datos aún'}
        />
        <StatCard
          icon={CreditCard} label="Pagos pendientes" to="/portal/pagos" color="gray"
          value={pendingPayments.length}
          sub={pendingPayments.length ? `$${pendingPayments.reduce((s, p) => s + p.amount, 0).toLocaleString('es-CL')}` : 'Al día'}
        />
        <StatCard
          icon={Calendar} label="Próxima reunión" to="/portal/calendario" color="gray"
          value={nextMeeting ? new Date(nextMeeting.date).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }) : '—'}
          sub={nextMeeting?.title || 'Sin reuniones'}
        />
        <StatCard
          icon={MessageSquare} label="Tickets abiertos" to="/portal/tickets" color="gray"
          value={openTickets.length}
          sub={openTickets.length ? 'Requiere atención' : 'Sin pendientes'}
        />
      </div>

      {/* Mini spend chart */}
      {chartData.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-semibold">Inversión en anuncios</h2>
              <p className="text-zinc-500 text-xs">Últimos periodos</p>
            </div>
            <Link to="/portal/metricas" className="text-zinc-500 hover:text-white text-xs transition-colors">Ver detalle →</Link>
          </div>
          <div className="flex items-end gap-2 h-24">
            {chartData.map((m, i) => {
              const h = (m.spend / maxSpend) * 100
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-white rounded-sm transition-all" style={{ height: `${h}%`, minHeight: '4px' }} title={`$${m.spend.toLocaleString('es-CL')}`} />
                  <span className="text-zinc-600 text-[10px]">{new Date(m.date).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' })}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Bottom grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent tickets */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Tickets recientes</h2>
            <Link to="/portal/tickets" className="text-zinc-500 hover:text-white text-xs transition-colors">Ver todos →</Link>
          </div>
          {tickets.length === 0 ? (
            <p className="text-zinc-600 text-sm">Sin tickets aún. <Link to="/portal/tickets" className="text-white underline">Crear uno</Link></p>
          ) : (
            <div className="space-y-2">
              {tickets.slice(0, 3).map(t => (
                <div key={t.id} className="flex items-center gap-3 py-2 border-b border-zinc-800 last:border-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    t.status === 'abierto' ? 'bg-green-400' :
                    t.status === 'en_progreso' ? 'bg-blue-400' :
                    t.status === 'resuelto' ? 'bg-zinc-500' : 'bg-zinc-600'
                  }`} />
                  <p className="text-zinc-300 text-sm truncate flex-1">{t.subject}</p>
                  <span className="text-zinc-600 text-xs shrink-0">{new Date(t.createdAt).toLocaleDateString('es-CL')}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming meetings */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Próximas reuniones</h2>
            <Link to="/portal/calendario" className="text-zinc-500 hover:text-white text-xs transition-colors">Ver todas →</Link>
          </div>
          {meetings.filter(m => new Date(m.date) > new Date()).length === 0 ? (
            <p className="text-zinc-600 text-sm">No hay reuniones programadas.</p>
          ) : (
            <div className="space-y-3">
              {meetings.filter(m => new Date(m.date) > new Date()).slice(0, 3).map(m => (
                <div key={m.id} className="flex items-start gap-3">
                  <div className="bg-zinc-800 rounded-lg p-2 text-center min-w-[44px]">
                    <p className="text-white text-xs font-bold leading-none">{new Date(m.date).toLocaleDateString('es-CL', { day: '2-digit' })}</p>
                    <p className="text-zinc-500 text-[10px] uppercase">{new Date(m.date).toLocaleDateString('es-CL', { month: 'short' })}</p>
                  </div>
                  <div>
                    <p className="text-zinc-300 text-sm font-medium">{m.title}</p>
                    <p className="text-zinc-600 text-xs">{new Date(m.date).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} — {m.duration} min</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

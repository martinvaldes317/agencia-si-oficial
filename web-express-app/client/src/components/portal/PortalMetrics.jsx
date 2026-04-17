import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { TrendingUp, TrendingDown, Eye, MousePointer, DollarSign, Target, Filter } from 'lucide-react'

function KpiCard({ label, value, sub, up }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <p className="text-zinc-500 text-xs uppercase tracking-wider mb-3">{label}</p>
      <p className="text-white text-2xl font-bold mb-1">{value}</p>
      {sub && (
        <div className={`flex items-center gap-1 text-xs ${up === true ? 'text-green-400' : up === false ? 'text-red-400' : 'text-zinc-500'}`}>
          {up === true ? <TrendingUp size={12} /> : up === false ? <TrendingDown size={12} /> : null}
          <span>{sub}</span>
        </div>
      )}
    </div>
  )
}

const platformColors = { meta: 'bg-blue-600', google: 'bg-red-600', tiktok: 'bg-pink-600' }
const platformLabels = { meta: 'Meta Ads', google: 'Google Ads', tiktok: 'TikTok Ads' }

export default function PortalMetrics() {
  const { authFetch } = useAuth()
  const [metrics, setMetrics] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authFetch('/api/portal/metrics?limit=30')
      .then(r => r.json())
      .then(d => { setMetrics(d.metrics || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? metrics : metrics.filter(m => m.platform === filter)
  const platforms = [...new Set(metrics.map(m => m.platform))]

  // Aggregate totals
  const totals = filtered.reduce((acc, m) => ({
    impressions: acc.impressions + m.impressions,
    clicks: acc.clicks + m.clicks,
    spend: acc.spend + m.spend,
    conversions: acc.conversions + m.conversions,
    revenue: acc.revenue + m.revenue,
  }), { impressions: 0, clicks: 0, spend: 0, conversions: 0, revenue: 0 })

  const avgCTR = totals.impressions ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : '0.00'
  const avgCPC = totals.clicks ? (totals.spend / totals.clicks).toFixed(0) : '0'
  const avgROAS = totals.spend ? (totals.revenue / totals.spend).toFixed(2) : '0.00'

  // Chart (spend over time)
  const chartData = [...filtered].reverse()
  const maxSpend = Math.max(...chartData.map(m => m.spend), 1)
  const maxRevenue = Math.max(...chartData.map(m => m.revenue), 1)
  const maxVal = Math.max(maxSpend, maxRevenue)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Métricas de anuncios</h1>
          <p className="text-zinc-500 text-sm mt-1">Rendimiento de tus campañas publicitarias</p>
        </div>

        {/* Platform filter */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-zinc-500" />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="all">Todas las plataformas</option>
            {platforms.map(p => <option key={p} value={p}>{platformLabels[p] || p}</option>)}
          </select>
        </div>
      </div>

      {metrics.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <TrendingUp size={40} className="text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">Aún no hay métricas registradas.</p>
          <p className="text-zinc-600 text-sm mt-1">Tu agencia las irá actualizando periódicamente.</p>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Inversión total" value={`$${totals.spend.toLocaleString('es-CL')}`} sub="CLP gastado en anuncios" />
            <KpiCard label="ROAS" value={`${avgROAS}x`} sub={`$${totals.revenue.toLocaleString('es-CL')} generados`} up={Number(avgROAS) >= 2} />
            <KpiCard label="CTR" value={`${avgCTR}%`} sub={`${totals.clicks.toLocaleString()} clicks de ${totals.impressions.toLocaleString()}`} up={Number(avgCTR) >= 1} />
            <KpiCard label="CPC" value={`$${Number(avgCPC).toLocaleString('es-CL')}`} sub={`${totals.conversions} conversiones`} />
          </div>

          {/* Chart */}
          {chartData.length > 1 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <h2 className="text-white font-semibold mb-1">Inversión vs Ingresos</h2>
              <p className="text-zinc-500 text-xs mb-4">Comparativa por periodo</p>
              <div className="flex items-end gap-2" style={{ height: '140px' }}>
                {chartData.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-700 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      Spend: ${m.spend.toLocaleString('es-CL')}<br />Rev: ${m.revenue.toLocaleString('es-CL')}
                    </div>
                    <div className="w-full flex items-end gap-0.5 flex-1">
                      <div className="flex-1 bg-white/80 rounded-sm" style={{ height: `${(m.spend / maxVal) * 100}%`, minHeight: '4px' }} />
                      <div className="flex-1 bg-green-500/70 rounded-sm" style={{ height: `${(m.revenue / maxVal) * 100}%`, minHeight: '4px' }} />
                    </div>
                    <span className="text-zinc-600 text-[10px]">{new Date(m.date).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' })}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white/80 rounded-sm" /><span className="text-zinc-500 text-xs">Inversión</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500/70 rounded-sm" /><span className="text-zinc-500 text-xs">Ingresos</span></div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-zinc-800">
              <h2 className="text-white font-semibold">Detalle por periodo</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {['Fecha', 'Plataforma', 'Inversión', 'Clicks', 'CTR', 'CPC', 'Conversiones', 'ROAS'].map(h => (
                      <th key={h} className="text-left text-zinc-500 text-xs uppercase tracking-wider px-5 py-3 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {filtered.map(m => (
                    <tr key={m.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-5 py-3 text-zinc-300">{new Date(m.date).toLocaleDateString('es-CL')}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${platformColors[m.platform] || 'bg-zinc-600'}`}>
                          {platformLabels[m.platform] || m.platform}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-white font-medium">${m.spend.toLocaleString('es-CL')}</td>
                      <td className="px-5 py-3 text-zinc-300">{m.clicks.toLocaleString()}</td>
                      <td className="px-5 py-3 text-zinc-300">{m.ctr.toFixed(2)}%</td>
                      <td className="px-5 py-3 text-zinc-300">${m.cpc.toLocaleString('es-CL')}</td>
                      <td className="px-5 py-3 text-zinc-300">{m.conversions}</td>
                      <td className="px-5 py-3">
                        <span className={`font-semibold ${m.roas >= 2 ? 'text-green-400' : m.roas >= 1 ? 'text-amber-400' : 'text-red-400'}`}>
                          {m.roas.toFixed(2)}x
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

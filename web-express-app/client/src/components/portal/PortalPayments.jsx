import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { CreditCard, CheckCircle, Clock, XCircle, Download, FileText } from 'lucide-react'

const statusConfig = {
  pendiente: { label: 'Pendiente', icon: Clock, color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  pagado: { label: 'Pagado', icon: CheckCircle, color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  vencido: { label: 'Vencido', icon: XCircle, color: 'text-red-400 bg-red-400/10 border-red-400/20' },
}

export default function PortalPayments() {
  const { authFetch } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    authFetch('/api/portal/payments')
      .then(r => r.json())
      .then(d => { setPayments(d.payments || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter)

  const total = payments.reduce((s, p) => s + p.amount, 0)
  const paid = payments.filter(p => p.status === 'pagado').reduce((s, p) => s + p.amount, 0)
  const pending = payments.filter(p => p.status === 'pendiente').reduce((s, p) => s + p.amount, 0)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pagos y facturación</h1>
        <p className="text-zinc-500 text-sm mt-1">Historial de pagos y estado de cuenta</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Total facturado</p>
          <p className="text-white text-2xl font-bold">${total.toLocaleString('es-CL')}</p>
          <p className="text-zinc-600 text-xs mt-1">CLP · {payments.length} cobros</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Pagado</p>
          <p className="text-green-400 text-2xl font-bold">${paid.toLocaleString('es-CL')}</p>
          <p className="text-zinc-600 text-xs mt-1">{payments.filter(p => p.status === 'pagado').length} cobros completados</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Pendiente</p>
          <p className={`text-2xl font-bold ${pending > 0 ? 'text-amber-400' : 'text-zinc-500'}`}>${pending.toLocaleString('es-CL')}</p>
          <p className="text-zinc-600 text-xs mt-1">{payments.filter(p => p.status === 'pendiente').length} cobros por pagar</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {[['all', 'Todos'], ['pendiente', 'Pendientes'], ['pagado', 'Pagados'], ['vencido', 'Vencidos']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === val ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <CreditCard size={40} className="text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">No hay cobros en esta categoría.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(payment => {
            const cfg = statusConfig[payment.status] || statusConfig.pendiente
            const StatusIcon = cfg.icon
            return (
              <div key={payment.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-center gap-4">
                <div className="w-11 h-11 bg-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={20} className="text-zinc-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{payment.description || 'Servicio mensual'}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-zinc-500 text-xs">
                      {new Date(payment.createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    {payment.dueDate && payment.status === 'pendiente' && (
                      <span className="text-zinc-600 text-xs">
                        Vence: {new Date(payment.dueDate).toLocaleDateString('es-CL')}
                      </span>
                    )}
                    {payment.paidAt && (
                      <span className="text-zinc-600 text-xs">
                        Pagado: {new Date(payment.paidAt).toLocaleDateString('es-CL')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-white font-bold">${payment.amount.toLocaleString('es-CL')}</p>
                  <p className="text-zinc-600 text-xs">{payment.currency}</p>
                </div>

                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium shrink-0 ${cfg.color}`}>
                  <StatusIcon size={12} />
                  {cfg.label}
                </div>

                {payment.invoiceUrl && (
                  <a href={payment.invoiceUrl} target="_blank" rel="noreferrer"
                    className="text-zinc-500 hover:text-white transition-colors shrink-0" title="Descargar boleta">
                    <Download size={18} />
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <p className="text-zinc-500 text-sm">
          ¿Tienes dudas sobre un cobro?{' '}
          <a href="mailto:contacto@agenciasi.cl" className="text-white hover:underline">contacto@agenciasi.cl</a>
          {' '}o WhatsApp{' '}
          <a href="https://wa.me/56932930812" target="_blank" rel="noreferrer" className="text-white hover:underline">+56 9 3293 0812</a>
        </p>
      </div>
    </div>
  )
}

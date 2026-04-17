import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { MessageSquare, Plus, Send, ChevronLeft, Clock, AlertCircle, CheckCircle, XCircle, Loader } from 'lucide-react'

const statusConfig = {
  abierto: { label: 'Abierto', color: 'text-green-400 bg-green-400/10 border-green-400/20', icon: CheckCircle },
  en_progreso: { label: 'En progreso', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: Clock },
  resuelto: { label: 'Resuelto', color: 'text-zinc-400 bg-zinc-700/50 border-zinc-600', icon: CheckCircle },
  cerrado: { label: 'Cerrado', color: 'text-zinc-600 bg-zinc-800/50 border-zinc-700', icon: XCircle },
}

const priorityColors = {
  baja: 'text-zinc-400',
  normal: 'text-blue-400',
  alta: 'text-amber-400',
  urgente: 'text-red-400',
}

export default function PortalTickets() {
  const { authFetch } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  const [newTicket, setNewTicket] = useState({ subject: '', content: '', priority: 'normal' })
  const [creating, setCreating] = useState(false)

  const fetchTickets = async () => {
    const r = await authFetch('/api/portal/tickets')
    const d = await r.json()
    const list = d.tickets || []
    setTickets(list)
    if (selected) {
      const updated = list.find(t => t.id === selected.id)
      if (updated) setSelected(updated)
    }
  }

  useEffect(() => {
    fetchTickets().finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selected?.messages])

  const handleCreateTicket = async (e) => {
    e.preventDefault()
    if (!newTicket.subject.trim() || !newTicket.content.trim()) return
    setCreating(true)
    try {
      await authFetch('/api/portal/tickets', {
        method: 'POST',
        body: JSON.stringify(newTicket)
      })
      setNewTicket({ subject: '', content: '', priority: 'normal' })
      setShowNew(false)
      await fetchTickets()
    } catch { }
    setCreating(false)
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!reply.trim() || !selected) return
    setSending(true)
    try {
      await authFetch(`/api/portal/tickets/${selected.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content: reply })
      })
      setReply('')
      await fetchTickets()
    } catch { }
    setSending(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // Ticket detail view
  if (selected) {
    const cfg = statusConfig[selected.status] || statusConfig.abierto
    const StatusIcon = cfg.icon
    const isOpen = selected.status !== 'resuelto' && selected.status !== 'cerrado'

    return (
      <div className="space-y-4 max-w-3xl">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm">
          <ChevronLeft size={18} /> Volver a tickets
        </button>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-zinc-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-white font-semibold">{selected.subject}</h2>
                <p className="text-zinc-600 text-xs mt-1">
                  Ticket #{selected.id} · {new Date(selected.createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                  · <span className={priorityColors[selected.priority]}>Prioridad {selected.priority}</span>
                </p>
              </div>
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium shrink-0 ${cfg.color}`}>
                <StatusIcon size={12} />{cfg.label}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="p-5 space-y-4 max-h-96 overflow-y-auto">
            {selected.messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.isAdmin ? '' : 'flex-row-reverse'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${msg.isAdmin ? 'bg-white text-black' : 'bg-zinc-700 text-white'}`}>
                  {msg.isAdmin ? 'SI' : 'Tú'}
                </div>
                <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${msg.isAdmin ? 'bg-zinc-800 text-zinc-200' : 'bg-white text-black'}`}>
                  <p>{msg.content}</p>
                  <p className={`text-[10px] mt-1.5 ${msg.isAdmin ? 'text-zinc-500' : 'text-zinc-500'}`}>
                    {new Date(msg.createdAt).toLocaleString('es-CL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply */}
          {isOpen ? (
            <form onSubmit={handleReply} className="p-4 border-t border-zinc-800 flex gap-3">
              <input
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="flex-1 bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
              />
              <button
                type="submit"
                disabled={!reply.trim() || sending}
                className="bg-white text-black px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-zinc-100 disabled:opacity-50 transition-colors"
              >
                {sending ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </form>
          ) : (
            <div className="p-4 border-t border-zinc-800 text-center text-zinc-500 text-sm">
              Este ticket está {selected.status}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Soporte</h1>
          <p className="text-zinc-500 text-sm mt-1">Tickets de soporte para tu sitio web</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-zinc-100 transition-colors"
        >
          <Plus size={18} /> Nuevo ticket
        </button>
      </div>

      {/* New ticket modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowNew(false)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-white font-semibold mb-4">Crear ticket de soporte</h2>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 uppercase tracking-wider block mb-1.5">Asunto</label>
                <input
                  value={newTicket.subject}
                  onChange={e => setNewTicket(p => ({ ...p, subject: e.target.value }))}
                  required
                  placeholder="Ej: Error en formulario de contacto"
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 uppercase tracking-wider block mb-1.5">Prioridad</label>
                <select
                  value={newTicket.priority}
                  onChange={e => setNewTicket(p => ({ ...p, priority: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none"
                >
                  <option value="baja">Baja</option>
                  <option value="normal">Normal</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-400 uppercase tracking-wider block mb-1.5">Descripción</label>
                <textarea
                  value={newTicket.content}
                  onChange={e => setNewTicket(p => ({ ...p, content: e.target.value }))}
                  required
                  rows={4}
                  placeholder="Describe el problema con detalle..."
                  className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowNew(false)} className="flex-1 bg-zinc-800 text-zinc-300 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={creating} className="flex-1 bg-white text-black py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-100 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                  {creating ? <Loader size={16} className="animate-spin" /> : 'Enviar ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tickets list */}
      {tickets.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <MessageSquare size={40} className="text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500">No tienes tickets aún.</p>
          <p className="text-zinc-600 text-sm mt-1">Crea uno para reportar un problema o hacer una consulta.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map(ticket => {
            const cfg = statusConfig[ticket.status] || statusConfig.abierto
            const StatusIcon = cfg.icon
            const lastMsg = ticket.messages[ticket.messages.length - 1]
            return (
              <button
                key={ticket.id}
                onClick={() => setSelected(ticket)}
                className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-5 text-left transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                      <MessageSquare size={18} className="text-zinc-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm truncate">{ticket.subject}</p>
                      <p className="text-zinc-600 text-xs mt-0.5 truncate">
                        {lastMsg ? lastMsg.content : 'Sin mensajes'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-medium ${cfg.color}`}>
                      <StatusIcon size={10} />{cfg.label}
                    </span>
                    <span className="text-zinc-600 text-xs">{new Date(ticket.updatedAt).toLocaleDateString('es-CL')}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

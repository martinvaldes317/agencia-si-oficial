import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Calendar, ChevronLeft, ChevronRight, Clock, Video, CheckCircle, XCircle, ExternalLink } from 'lucide-react'

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const statusConfig = {
  programada: { label: 'Programada', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  completada: { label: 'Completada', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  cancelada: { label: 'Cancelada', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
}

export default function PortalCalendar() {
  const { authFetch } = useAuth()
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)

  useEffect(() => {
    authFetch('/api/portal/meetings')
      .then(r => r.json())
      .then(d => { setMeetings(d.meetings || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const getMeetingsForDay = (day) => {
    return meetings.filter(m => {
      const d = new Date(m.date)
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    })
  }

  const selectedMeetings = selectedDay ? getMeetingsForDay(selectedDay) : []
  const today = new Date()
  const upcomingMeetings = meetings.filter(m => new Date(m.date) >= today).sort((a, b) => new Date(a.date) - new Date(b.date))

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Calendario de reuniones</h1>
        <p className="text-zinc-500 text-sm mt-1">Tus reuniones programadas con Agencia SI</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold text-lg">{MONTHS[month]} {year}</h2>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="text-xs text-zinc-500 hover:text-white transition-colors px-2 py-1 rounded hover:bg-zinc-800">
                Hoy
              </button>
              <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-medium text-zinc-500 py-2">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dayMeetings = getMeetingsForDay(day)
              const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
              const isSelected = selectedDay === day
              const hasMeeting = dayMeetings.length > 0

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all
                    ${isSelected ? 'bg-white text-black' :
                      isToday ? 'bg-zinc-700 text-white' :
                      'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                >
                  {day}
                  {hasMeeting && (
                    <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-black' : 'bg-blue-400'}`} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Selected day meetings */}
          {selectedDay && (
            <div className="mt-5 pt-5 border-t border-zinc-800">
              <h3 className="text-white font-medium mb-3 text-sm">
                {selectedDay} de {MONTHS[month]}
              </h3>
              {selectedMeetings.length === 0 ? (
                <p className="text-zinc-600 text-sm">Sin reuniones este día.</p>
              ) : (
                <div className="space-y-3">
                  {selectedMeetings.map(m => (
                    <MeetingCard key={m.id} meeting={m} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Upcoming */}
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Próximas reuniones</h2>
            {upcomingMeetings.length === 0 ? (
              <div className="text-center py-6">
                <Calendar size={32} className="text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-600 text-sm">Sin reuniones próximas.</p>
                <p className="text-zinc-700 text-xs mt-1">Tu agencia las irá agendando.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingMeetings.slice(0, 5).map(m => (
                  <MeetingCard key={m.id} meeting={m} compact />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MeetingCard({ meeting: m, compact }) {
  const cfg = statusConfig[m.status] || statusConfig.programada
  const date = new Date(m.date)

  if (compact) return (
    <div className="flex items-start gap-3 py-2 border-b border-zinc-800 last:border-0">
      <div className="bg-zinc-800 rounded-lg p-2 text-center min-w-[44px]">
        <p className="text-white text-xs font-bold leading-none">{date.getDate()}</p>
        <p className="text-zinc-500 text-[10px] uppercase">{MONTHS[date.getMonth()].slice(0, 3)}</p>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-zinc-300 text-sm font-medium truncate">{m.title}</p>
        <p className="text-zinc-600 text-xs">{date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })} · {m.duration} min</p>
      </div>
    </div>
  )

  return (
    <div className="bg-zinc-800 rounded-xl p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-white font-medium text-sm">{m.title}</p>
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium shrink-0 ${cfg.color}`}>
          {cfg.label}
        </span>
      </div>
      {m.description && <p className="text-zinc-500 text-xs mb-3">{m.description}</p>}
      <div className="flex items-center gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1"><Clock size={12} />{date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</span>
        <span>{m.duration} min</span>
      </div>
      {m.meetLink && m.status === 'programada' && (
        <a href={m.meetLink} target="_blank" rel="noreferrer"
          className="mt-3 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors w-fit">
          <Video size={14} />
          Unirme a la reunión
          <ExternalLink size={12} />
        </a>
      )}
    </div>
  )
}

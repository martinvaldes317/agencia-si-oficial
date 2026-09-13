import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import AdminLayout from './admin/AdminLayout'
import { Lock, Loader2, X, ChevronRight, Clock } from 'lucide-react'

function prettifyKey(key) {
  const withSpaces = key.replace(/([A-Z])/g, ' $1')
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
}

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'justo ahora'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.round(hours / 24)
  return `hace ${days} d`
}

export default function AdminDrafts() {
  const { adminToken, loginAdmin, authFetch } = useAuth()
  const [pwd, setPwd] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [detail, setDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  // Se actualiza sola cada 20s (sin recargar la página ni mostrar el
  // spinner de nuevo) para que si alguien está llenando el formulario
  // ahora mismo, aparezca sin que el admin tenga que refrescar.
  useEffect(() => {
    if (!adminToken) { setLoading(false); return }
    let cancelled = false
    const fetchDrafts = (isFirstLoad) => {
      if (isFirstLoad) setLoading(true)
      authFetch('/api/web-orders/drafts')
        .then(r => r.json())
        .then(data => { if (!cancelled && data.success) setDrafts(data.drafts) })
        .finally(() => { if (isFirstLoad) setLoading(false) })
    }
    fetchDrafts(true)
    const id = setInterval(() => fetchDrafts(false), 20000)
    return () => { cancelled = true; clearInterval(id) }
  }, [adminToken])

  const openDetail = async (token) => {
    setSelected(token)
    setLoadingDetail(true)
    try {
      const res = await authFetch(`/api/web-orders/drafts/${token}`)
      const data = await res.json()
      if (data.success) setDetail(data)
    } finally {
      setLoadingDetail(false)
    }
  }

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

  return (
    <AdminLayout active="formularios">
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-white font-bold uppercase tracking-widest text-sm mb-1">Formularios en proceso</h1>
        <p className="text-zinc-500 text-xs mb-6">Gente que empezó a cotizar en /sitio-web — con o sin terminar. Se actualiza sola cada 20 segundos.</p>

        {loading ? (
          <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /></div>
        ) : drafts.length === 0 ? (
          <p className="text-zinc-600 text-sm">Todavía no hay nadie completando el formulario en este período.</p>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nombre / Empresa</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Contacto</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Paso</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Última actividad</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {drafts.map(d => (
                  <tr key={d.token} onClick={() => openDetail(d.token)} className="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white">{d.name || '—'}</p>
                      <p className="text-xs text-zinc-500">{d.companyName || '—'}</p>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 text-xs">
                      {d.email && <div>{d.email}</div>}
                      {d.whatsapp && <div>{d.whatsapp}</div>}
                      {!d.email && !d.whatsapp && '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-violet-500/10 text-violet-400 border border-violet-500/20">
                        Paso {d.step} {d.step >= 7 ? '(resumen)' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 text-xs flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {timeAgo(d.updatedAt)}
                      {d.expired && <span className="ml-2 text-zinc-600">(vencido)</span>}
                    </td>
                    <td className="px-6 py-4">
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-lg bg-zinc-950 border-l border-white/10 h-full flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-white font-bold text-sm">Detalle del formulario</h2>
              <button onClick={() => { setSelected(null); setDetail(null) }} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {loadingDetail || !detail ? (
                <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /></div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(detail.data)
                    .filter(([, v]) => v !== null && v !== undefined && v !== '' && v !== false && !(Array.isArray(v) && v.length === 0))
                    .map(([key, value]) => (
                      <div key={key} className="flex justify-between gap-4 text-xs border-b border-white/5 pb-2">
                        <span className="text-zinc-500 shrink-0">{prettifyKey(key)}</span>
                        <span className="text-white text-right break-words">{Array.isArray(value) ? value.join(', ') : String(value)}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

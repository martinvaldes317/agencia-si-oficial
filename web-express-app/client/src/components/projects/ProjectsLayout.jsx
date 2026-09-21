import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Lock, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../admin/AdminLayout'

const TABS = [
  { to: '/admin/proyectos', label: 'Dashboard', end: true },
  { to: '/admin/proyectos/clientes', label: 'Clientes' },
  { to: '/admin/proyectos/lista', label: 'Proyectos', end: true },
  { to: '/admin/proyectos/lista?vista=pendientes_info', label: 'Pendientes de información', vista: 'pendientes_info' },
  { to: '/admin/proyectos/lista?vista=desarrollo', label: 'En desarrollo', vista: 'desarrollo' },
  { to: '/admin/proyectos/lista?vista=revision', label: 'En revisión', vista: 'revision' },
  { to: '/admin/proyectos/lista?vista=finalizados', label: 'Finalizados', vista: 'finalizados' },
  { to: '/admin/proyectos/kanban', label: 'Kanban' },
  { to: '/admin/proyectos/configuracion', label: 'Configuración' },
]

function Gate() {
  const { loginAdmin } = useAuth()
  const [pwd, setPwd] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  const submit = async e => {
    e.preventDefault(); setBusy(true); setErr('')
    try { await loginAdmin(pwd) } catch (x) { setErr(x.message || 'Contraseña incorrecta') } finally { setBusy(false) }
  }
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8">
        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Contraseña de administrador</label>
        <div className="relative mb-4">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} required autoFocus
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/20" />
        </div>
        {err && <p className="text-red-400 text-xs mb-4">{err}</p>}
        <button type="submit" disabled={busy} className="w-full bg-white text-black py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50">
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}

export default function ProjectsLayout({ title, actions, children }) {
  const { adminToken } = useAuth()
  const loc = useLocation()
  if (!adminToken) return <Gate />
  const vista = new URLSearchParams(loc.search).get('vista')
  return (
    <AdminLayout active="proyectos">
      <div className="border-b border-white/5 px-8 pt-6">
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <h1 className="text-white font-bold uppercase tracking-widest text-sm">Proyectos Web{title ? <span className="text-zinc-500"> · {title}</span> : null}</h1>
          <div className="flex gap-2">{actions}</div>
        </div>
        <nav className="flex gap-1 overflow-x-auto -mb-px">
          {TABS.map(t => {
            const isActive = t.vista ? vista === t.vista && loc.pathname === '/admin/proyectos/lista'
              : t.to === '/admin/proyectos/lista' ? loc.pathname === t.to && !vista
              : undefined
            return (
              <NavLink key={t.to} to={t.to} end={t.end}
                className={({ isActive: a }) => `px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${(isActive ?? a) ? 'border-white text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
                {t.label}
              </NavLink>
            )
          })}
        </nav>
      </div>
      <div className="flex-1 overflow-auto p-8">{children}</div>
    </AdminLayout>
  )
}

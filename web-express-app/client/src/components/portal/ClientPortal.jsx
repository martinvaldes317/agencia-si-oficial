import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, TrendingUp, CreditCard, Calendar,
  FolderOpen, MessageSquare, LogOut, Menu, X, ChevronRight
} from 'lucide-react'

const navItems = [
  { path: '/portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/portal/metricas', label: 'Métricas', icon: TrendingUp },
  { path: '/portal/pagos', label: 'Pagos', icon: CreditCard },
  { path: '/portal/calendario', label: 'Calendario', icon: Calendar },
  { path: '/portal/archivos', label: 'Archivos', icon: FolderOpen },
  { path: '/portal/tickets', label: 'Soporte', icon: MessageSquare },
]

export default function ClientPortal() {
  const { client, loading, logoutClient } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !client) navigate('/portal')
  }, [client, loading, navigate])

  if (loading || !client) return null

  const handleLogout = () => { logoutClient(); navigate('/portal') }

  const initials = client.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="min-h-screen bg-black flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white tracking-tighter">Agencia</span>
            <span className="bg-white text-black text-xl font-black px-1.5 rounded tracking-tighter">SI</span>
          </div>
          <p className="text-zinc-600 text-xs mt-1">Portal de cliente</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${active ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
              >
                <Icon size={18} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-white text-black rounded-full flex items-center justify-center text-xs font-bold">{initials}</div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{client.name}</p>
              <p className="text-zinc-500 text-xs truncate">{client.company || client.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-zinc-500 hover:text-red-400 text-sm transition-colors py-1">
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top bar mobile */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950">
          <button onClick={() => setSidebarOpen(true)} className="text-white">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-white font-black tracking-tighter">Agencia</span>
            <span className="bg-white text-black font-black px-1 rounded text-sm tracking-tighter">SI</span>
          </div>
          <div className="w-9 h-9 bg-white text-black rounded-full flex items-center justify-center text-xs font-bold">{initials}</div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

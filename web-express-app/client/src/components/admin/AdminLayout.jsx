import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, BarChart3, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { key: 'pedidos', icon: LayoutDashboard, label: 'Pedidos', path: '/admin/si' },
  { key: 'clientes', icon: Users, label: 'Clientes', path: '/admin/clientes' },
  { key: 'analitica', icon: BarChart3, label: 'Analítica', path: '/admin/analitica' },
  { key: 'configuracion', icon: Settings, label: 'Configuración', path: '/admin/configuracion' },
]

export default function AdminLayout({ active, children }) {
  const navigate = useNavigate()
  const { logoutAdmin } = useAuth()

  return (
    <div className="flex h-screen bg-black text-zinc-300 font-sans antialiased">
      <aside className="w-64 border-r border-white/5 flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-6 h-6 bg-white flex items-center justify-center rounded-sm">
              <span className="text-black font-bold text-sm italic">SI</span>
            </div>
            <span className="text-white font-bold tracking-tighter text-sm uppercase">Admin Panel</span>
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active === item.key ? 'bg-white/5 text-white' : 'hover:bg-white/5 hover:text-white'}`}
              >
                <item.icon className="w-4 h-4 text-zinc-500" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8">
          <button onClick={logoutAdmin} className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors text-sm font-medium">
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}

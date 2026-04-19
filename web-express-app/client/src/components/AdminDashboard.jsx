import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    LayoutDashboard, Users, Settings, Package,
    Search, Filter, ChevronRight, Clock,
    CheckCircle2, AlertCircle, FileText, Download,
    MoreVertical, LogOut
} from 'lucide-react'

export default function AdminDashboard() {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState('todos');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/orders`);
            const data = await response.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();
            if (data.success) {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'recibido': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'en_proceso': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'revision': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'completado': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
        }
    };

    const filteredOrders = filter === 'todos'
        ? orders
        : orders.filter(o => o.status === filter);

    return (
        <div className="flex h-screen bg-black text-zinc-300 font-sans antialiased">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 flex flex-col">
                <div className="p-8">
                    <div className="flex items-center gap-2 mb-12">
                        <div className="w-6 h-6 bg-white flex items-center justify-center rounded-sm">
                            <span className="text-black font-bold text-sm italic">SI</span>
                        </div>
                        <span className="text-white font-bold tracking-tighter text-sm uppercase">Admin Panel</span>
                    </div>

                    <nav className="space-y-1">
                        {[
                            { icon: LayoutDashboard, label: 'Dashboard', active: true, action: null },
                            { icon: Package, label: 'Pedidos', action: null },
                            { icon: Users, label: 'Clientes', action: () => navigate('/admin/clientes') },
                            { icon: Settings, label: 'Configuración', action: null },
                        ].map((item, i) => (
                            <button key={i} onClick={item.action || undefined} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${item.active ? 'bg-white/5 text-white' : 'hover:bg-white/5 hover:text-white'}`}>
                                <item.icon className="w-4 h-4 text-zinc-500" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-8">
                    <button className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors text-sm font-medium">
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-10">
                    <h1 className="text-white font-bold tracking-tight text-xl uppercase tracking-widest text-sm">Gestión de Pedidos</h1>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Buscar pedido..."
                                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-white/20 transition-all w-64"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10"></div>
                            <span className="text-sm font-medium text-white">Administrador</span>
                        </div>
                    </div>
                </header>

                {/* Dashboard Grid */}
                <div className="flex-1 overflow-auto p-10">
                    <div className="grid grid-cols-4 gap-6 mb-10">
                        {[
                            { label: 'Total Pedidos', value: orders.length, icon: Package, color: 'text-white' },
                            { label: 'En Proceso', value: orders.filter(o => o.status === 'en_proceso').length, icon: Clock, color: 'text-amber-500' },
                            { label: 'Finalizados', value: orders.filter(o => o.status === 'completado').length, icon: CheckCircle2, color: 'text-emerald-500' },
                            { label: 'Ingresos Totales', value: `$${(orders.length * 129990).toLocaleString()}`, icon: FileText, color: 'text-blue-500' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2 rounded-lg bg-black border border-white/5 ${stat.color}`}>
                                        <stat.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">+12% vs mes anterior</span>
                                </div>
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Table View */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest">Recientes</h3>
                            <div className="flex gap-2">
                                {['todos', 'recibido', 'en_proceso', 'completado'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setFilter(s)}
                                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${filter === s ? 'bg-white text-black' : 'bg-white/5 text-zinc-500 hover:text-white'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.02]">
                                        <th className="px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">ID Pedido</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Empresa</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Email</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Estado</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Fecha</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-20 text-center text-zinc-500 italic">Cargando pedidos...</td>
                                        </tr>
                                    ) : filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-20 text-center text-zinc-500 italic">No se encontraron pedidos.</td>
                                        </tr>
                                    ) : filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-5 font-mono text-xs text-white">{order.id}</td>
                                            <td className="px-8 py-5">
                                                <p className="text-sm font-bold text-white">{order.businessName}</p>
                                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{order.city || 'Chile'}</p>
                                            </td>
                                            <td className="px-8 py-5 text-zinc-500 text-sm">{order.email}</td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                                                    {order.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-zinc-500 text-xs">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-5">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors group-hover:scale-110 active:scale-95"
                                                >
                                                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Detail Sidebar / Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
                    <div className="w-full max-w-2xl bg-zinc-950 border-l border-white/10 h-full flex flex-col animate-slide-in-right">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">{selectedOrder.businessName}</h2>
                                <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase mt-1">ID: {selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                <ChevronRight className="w-6 h-6 text-zinc-500 rotate-180" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto p-12 space-y-12">
                            {/* Actions Header */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Estado del Proyecto</label>
                                    <select
                                        value={selectedOrder.status}
                                        onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-white/20"
                                    >
                                        <option value="recibido">Recibido</option>
                                        <option value="en_proceso">En Proceso</option>
                                        <option value="revision">En Revisión</option>
                                        <option value="completado">Completado</option>
                                    </select>
                                </div>
                                <div className="flex-none flex items-end">
                                    <button
                                        onClick={() => window.print()}
                                        className="bg-white text-black px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-200 transition-all"
                                    >
                                        <Download className="w-3.5 h-3.5" /> Descargar PDF
                                    </button>
                                </div>
                            </div>

                            {/* Info Sections */}
                            <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                                <div>
                                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Información de Contacto</h4>
                                    <div className="space-y-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-1">Teléfono</span>
                                            <span className="text-white text-sm">{selectedOrder.phone}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-1">Email</span>
                                            <span className="text-white text-sm">{selectedOrder.email}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-1">WhatsApp</span>
                                            <span className="text-white text-sm">{selectedOrder.whatsapp || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Ubicación</h4>
                                    <div className="space-y-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-1">Ciudad</span>
                                            <span className="text-white text-sm">{selectedOrder.city}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-1">Dirección</span>
                                            <span className="text-white text-sm">{selectedOrder.address || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Institution Info */}
                            <div className="space-y-10 pt-10 border-t border-white/5">
                                <div>
                                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Productos / Servicios</h4>
                                    <p className="text-zinc-400 text-sm leading-relaxed italic">{selectedOrder.products}</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">¿Quiénes somos?</h4>
                                    <p className="text-zinc-400 text-sm leading-relaxed">{selectedOrder.about || 'No especificado'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Misión</h4>
                                        <p className="text-zinc-500 text-xs italic">{selectedOrder.mission || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Visión</h4>
                                        <p className="text-zinc-500 text-xs italic">{selectedOrder.vision || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Visual Identity */}
                            <div className="space-y-8 pt-10 border-t border-white/5">
                                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Identidad Visual</h4>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest mb-2 block">Estilo</span>
                                        <span className="text-white text-xs font-bold uppercase tracking-widest">{selectedOrder.visualStyle}</span>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest mb-2 block">Dominio</span>
                                        <span className="text-white text-xs font-bold uppercase tracking-widest">{selectedOrder.hasDomain === 'yes' ? 'SÍ' : 'NO'}</span>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest mb-2 block">Color Base</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: selectedOrder.brandColorPrimary }}></div>
                                            <span className="text-white text-xs font-mono">{selectedOrder.brandColorPrimary}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Print Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body * { visibility: hidden; }
                    .animate-slide-in-right, .animate-slide-in-right * { visibility: visible; }
                    .animate-slide-in-right { position: absolute; left: 0; top: 0; width: 100%; border: none; }
                    button, select { display: none !important; }
                }
                @keyframes slide-in-right {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}} />
        </div>
    )
}

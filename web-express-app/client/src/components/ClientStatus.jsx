import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    Clock, CheckCircle2,
    ArrowLeft, MessageSquare, ShieldCheck,
    Sparkles, AlertCircle
} from 'lucide-react'

export default function ClientStatus() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/orders/${orderId}`);
            if (!response.ok) {
                setError(true);
                setLoading(false);
                return;
            }
            const data = await response.json();
            if (data.success) {
                setOrder(data.order);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error('Error fetching order:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-white/5 border-t-white rounded-full animate-spin"></div>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Cargando estado...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
                <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Pedido no encontrado</h1>
                <p className="text-zinc-500 max-w-sm mb-8">No pudimos encontrar un pedido con el ID proporcionado. Por favor verifica el enlace enviado a tu correo.</p>
                <Link to="/" className="text-white border-b border-white pb-1 font-bold uppercase tracking-widest text-xs hover:text-zinc-400 hover:border-zinc-400 transition-all">
                    Volver al inicio
                </Link>
            </div>
        );
    }

    const steps = [
        { id: 'recibido', label: 'Recibido', desc: 'Información confirmada' },
        { id: 'en_proceso', label: 'En Proceso', desc: 'Diseñando tu landing' },
        { id: 'revision', label: 'En Revisión', desc: 'Ajustes de calidad' },
        { id: 'completado', label: '¡Listo!', desc: 'Sitio publicado' }
    ];

    const currentStepIndex = steps.findIndex(s => s.id === order.status);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black antialiased font-sans">
            {/* Header */}
            <header className="fixed w-full top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors group">
                            <ArrowLeft className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                        </Link>
                        <Link to="/" className="border-l pl-4 border-white/10 group hidden sm:flex">
                            <img src="/logo-dark.png" alt="AgenciaSi" className="h-7 w-auto transition-opacity group-hover:opacity-70" />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Welcome Header */}
                    <div className="mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-6">
                            <Sparkles className="w-3 h-3 text-white" /> Estado de tu proyecto
                        </div>
                        <h1 className="text-4xl md:text-6xl font-light tracking-tighter mb-4">
                            ¡Hola, <span className="italic font-light text-zinc-500">{order.businessName}</span>!
                        </h1>
                        <p className="text-zinc-500 text-lg md:text-xl font-light">Estamos trabajando para que tu marca alcance su máximo potencial digital.</p>
                    </div>

                    {/* Progress visualizer */}
                    <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-zinc-800 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                            {steps.map((step, i) => {
                                const isCompleted = i <= currentStepIndex;
                                const isCurrent = i === currentStepIndex;

                                return (
                                    <div key={step.id} className="flex flex-row md:flex-col items-center gap-4 flex-1 w-full md:w-auto relative">
                                        {/* Connector Line */}
                                        {i < steps.length - 1 && (
                                            <div className="hidden md:block absolute top-5 left-1/2 w-full h-[1px] bg-white/10">
                                                <div
                                                    className={`h-full bg-white transition-all duration-1000 ${i < currentStepIndex ? 'w-full' : 'w-0'}`}
                                                />
                                            </div>
                                        )}

                                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 relative z-10 bg-black ${isCompleted ? 'border-white text-white' : 'border-white/10 text-zinc-700'
                                            } ${isCurrent ? 'scale-125 shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''}`}>
                                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-bold">{i + 1}</span>}
                                        </div>

                                        <div className="flex flex-col md:items-center">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isCompleted ? 'text-white' : 'text-zinc-700'}`}>
                                                {step.label}
                                            </span>
                                            <span className="text-[10px] text-zinc-600 uppercase tracking-tighter whitespace-nowrap">
                                                {step.desc}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Dashboard Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Status Card */}
                        <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-8 border-b border-white/5 pb-4">Detalles del Pedido</h3>

                            <dl className="space-y-6">
                                <div>
                                    <dt className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-700 mb-1">ID Seguimiento</dt>
                                    <dd className="text-sm font-mono text-white">{order.id}</dd>
                                </div>
                                <div>
                                    <dt className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-700 mb-1">Fecha de Ingreso</dt>
                                    <dd className="text-sm text-white">{new Date(order.createdAt).toLocaleDateString()}</dd>
                                </div>
                                <div>
                                    <dt className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-700 mb-1">Tiempo Estimado</dt>
                                    <dd className="text-sm text-white flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-zinc-500" /> 3-5 días hábiles
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-700 mb-1">Servicio</dt>
                                    <dd className="text-sm text-white italic">Web Profesional Express</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Actions Card */}
                        <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8 flex flex-col">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-8 border-b border-white/5 pb-4">Centro de Ayuda</h3>

                            <p className="text-zinc-500 text-xs italic leading-relaxed mb-10">
                                ¿Tienes alguna duda sobre tu proyecto o quieres enviar archivos adicionales? Nuestro equipo está disponible para ayudarte.
                            </p>

                            <div className="space-y-4 mt-auto">
                                <a
                                    href={`https://wa.me/56912345678?text=Hola,%20quisiera%20consultar%20por%20mi%20pedido%20${order.id}`}
                                    className="flex items-center justify-center gap-3 w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-all"
                                >
                                    <MessageSquare className="w-4 h-4" /> Hablar con un experto
                                </a>
                                <button className="flex items-center justify-center gap-3 w-full border border-white/10 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all">
                                    <ShieldCheck className="w-4 h-4" /> Soporte Técnico
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer note */}
                    <div className="mt-20 text-center">
                        <p className="text-zinc-700 text-[10px] uppercase tracking-[0.5em] font-bold">
                            © 2026 AGENCIA SI • ESTRATEGIA & CRECIMIENTO
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}

import { useSearchParams } from 'react-router-dom'
import { CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react'

export default function PaymentReturn() {
    const [params] = useSearchParams()
    const status = params.get('status') || 'failure'
    const orderId = params.get('external_reference')

    if (status === 'approved') return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pago recibido!</h1>
                <p className="text-gray-500 mb-6">
                    Tu pedido fue confirmado. Nuestro equipo comienza a trabajar ahora mismo.
                </p>
                {orderId && (
                    <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-mono mb-6">
                        <span className="text-zinc-500">ID:</span> {orderId}
                    </div>
                )}
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-left mb-8">
                    <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">Próximos pasos</p>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex gap-2"><span className="font-bold text-black shrink-0">1.</span> Revisaremos tu información y empezamos el diseño.</li>
                        <li className="flex gap-2"><span className="font-bold text-black shrink-0">2.</span> Te enviamos por correo el acceso a tu panel de cliente.</li>
                        <li className="flex gap-2 text-green-700 font-semibold text-xs uppercase tracking-widest pt-2 border-t border-gray-200">
                            <span className="shrink-0">3.</span> Entrega estimada: 3 a 5 días hábiles.
                        </li>
                    </ul>
                </div>
                <a href="/portal" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-80 transition-opacity">
                    Ir al portal de cliente <ArrowRight className="w-4 h-4" />
                </a>
            </div>
        </div>
    )

    if (status === 'pending' || status === 'in_process') return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-10 h-10 text-yellow-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Pago en proceso</h1>
                <p className="text-gray-500 mb-6">
                    Tu pago está siendo verificado. Te avisaremos por correo cuando se confirme y empezaremos de inmediato.
                </p>
                {orderId && (
                    <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-mono mb-6">
                        <span className="text-zinc-500">ID:</span> {orderId}
                    </div>
                )}
                <a href="/" className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm hover:border-black transition-colors">
                    Volver al inicio
                </a>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">El pago no se completó</h1>
                <p className="text-gray-500 mb-8">
                    No se realizó ningún cargo. Puedes intentarlo de nuevo o contactarnos si necesitas ayuda.
                </p>
                <div className="flex gap-3 justify-center">
                    <a href="/digitalizacion-express/wizard" className="inline-block bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-80 transition-opacity">
                        Intentar de nuevo
                    </a>
                    <a href="/" className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm hover:border-black transition-colors">
                        Volver al inicio
                    </a>
                </div>
            </div>
        </div>
    )
}

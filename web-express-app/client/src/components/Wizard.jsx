import { useState, useEffect } from 'react'
import {
    Clock, ArrowRight, UploadCloud, Image as ImageIcon,
    Layout, Briefcase, Zap, Palette, CheckCircle2,
    Lock, Loader2, Check, Info, Rocket, ArrowLeft
} from 'lucide-react'

// --- Step Components (inline for simplicity or separate files) ---
const Step1 = ({ data, handleChange }) => (
    <div className="space-y-6 animate-fade-in">
        <p className="text-gray-500 text-sm mb-6">Esta información permitirá que tus clientes te encuentren fácilmente.</p>
        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Nombre de la Empresa</label>
                <input
                    type="text"
                    name="businessName"
                    value={data.businessName || ''}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-200 py-3 text-lg focus:outline-none focus:border-black transition-colors"
                    placeholder="Ej: Sushi King"
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Ciudad</label>
                <input
                    type="text"
                    name="city"
                    value={data.city || ''}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-200 py-3 text-lg focus:outline-none focus:border-black transition-colors"
                    placeholder="Santiago"
                    required
                />
            </div>
        </div>
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Dirección</label>
            <input
                type="text"
                name="address"
                value={data.address || ''}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-200 py-3 text-lg focus:outline-none focus:border-black transition-colors"
                placeholder="Av. Providencia 1234, Of. 301"
            />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Teléfono</label>
                <input
                    type="tel"
                    name="phone"
                    value={data.phone || ''}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-200 py-3 text-lg focus:outline-none focus:border-black transition-colors"
                    placeholder="+56 9 1234 5678"
                    required
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">WhatsApp Comercial</label>
                <input
                    type="tel"
                    name="whatsapp"
                    value={data.whatsapp || ''}
                    onChange={handleChange}
                    className="w-full bg-gray-50/50 border-b-2 border-gray-200 py-3 px-3 text-lg focus:outline-none focus:border-green-500 transition-colors rounded-t-md"
                    placeholder="+56 9 1234 5678"
                />
            </div>
        </div>
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email de Contacto</label>
            <input
                type="email"
                name="email"
                value={data.email || ''}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-200 py-3 text-lg focus:outline-none focus:border-black transition-colors"
                placeholder="contacto@tuempresa.cl"
                required
            />
        </div>
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Redes Sociales (Links)</label>
            <input
                type="text"
                name="socials"
                value={data.socials || ''}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-200 py-3 text-lg focus:outline-none focus:border-black transition-colors"
                placeholder="Instagram, Facebook, LinkedIn..."
            />
        </div>
    </div>
)

const Step2 = ({ data, handleChange, handleFileChange }) => (
    <div className="space-y-8 animate-fade-in">
        <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Tu Logotipo</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group relative">
                <input
                    type="file"
                    name="logo"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    <UploadCloud className="w-10 h-10 mx-auto mb-3" />
                    <p className="text-sm font-medium">Arrastra tu logo aquí o haz clic para buscar</p>
                    <p className="text-xs mt-1 text-gray-300">PNG, JPG, SVG (Máx 5MB)</p>
                </div>
                {data.logoName && (
                    <div className="mt-4 text-sm font-bold text-black bg-white shadow-sm py-2 px-4 rounded-full inline-block border border-gray-200">
                        {data.logoName}
                    </div>
                )}
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Colores de Marca (Opcional)</label>
            <div className="flex gap-4 items-center">
                <input
                    type="color"
                    name="brandColorPrimary"
                    value={data.brandColorPrimary || '#000000'}
                    onChange={handleChange}
                    className="w-12 h-12 rounded-full cursor-pointer border-none bg-transparent"
                />
                <input
                    type="text"
                    name="brandColorsText"
                    value={data.brandColorsText || ''}
                    onChange={handleChange}
                    placeholder="Ej: Negro y Dorado, o códigos Hex"
                    className="flex-grow border-b-2 border-gray-200 py-2 focus:outline-none focus:border-black transition-colors"
                />
            </div>
        </div>

        <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">¿Tienes dominio web?</label>
            <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-black flex items-center justify-center relative`}>
                        <input
                            type="radio"
                            name="hasDomain"
                            value="yes"
                            checked={data.hasDomain === 'yes'}
                            onChange={handleChange}
                            className="opacity-0 absolute"
                        />
                        {data.hasDomain === 'yes' && <div className="w-2.5 h-2.5 bg-black rounded-full"></div>}
                    </div>
                    <span className="text-sm font-medium">Sí, ya tengo</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-black flex items-center justify-center relative`}>
                        <input
                            type="radio"
                            name="hasDomain"
                            value="no"
                            checked={data.hasDomain === 'no'}
                            onChange={handleChange}
                            className="opacity-0 absolute"
                        />
                        {data.hasDomain === 'no' && <div className="w-2.5 h-2.5 bg-black rounded-full"></div>}
                    </div>
                    <span className="text-sm font-medium">No, aún no</span>
                </label>
            </div>

            {data.hasDomain === 'no' && (
                <div className="pt-4 border-t border-gray-200 animate-fade-in">
                    <div className="flex items-start gap-3 text-blue-800 bg-blue-50 p-4 rounded-lg">
                        <Info className="w-5 h-5 shrink-0 mt-0.5" />
                        <p className="text-sm">
                            <strong>¡Nosotros nos encargamos!</strong><br />
                            Podemos registrar tu dominio .cl o .com por ti para asegurar tu nombre de marca.
                        </p>
                    </div>
                </div>
            )}
        </div>
    </div>
)

const Step3 = ({ data, handleChange }) => (
    <div className="space-y-6 animate-fade-in">
        <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Describe tus Productos o Servicios</label>
            <p className="text-sm text-gray-500">Cuéntanos qué vendes. Incluye categorías principales, productos estrella o servicios clave.</p>
            <textarea
                name="products"
                value={data.products || ''}
                onChange={handleChange}
                rows="8"
                className="w-full border-2 border-gray-100 rounded-xl p-4 focus:outline-none focus:border-black focus:ring-0 transition-all resize-none text-base"
                placeholder="Ejemplo: Venta de sushi, rolls especiales (Acevichado, Furay), despacho a domicilio en Providencia. Tenemos promociones de Lunes a Miércoles de 2x1..."
                required
            />
            <div className="flex justify-between text-xs text-gray-400">
                <span>Mínimo 50 caracteres para asegurar un buen diseño.</span>
                <span>{(data.products || '').length} caracteres</span>
            </div>
        </div>
    </div>
)

const Step4 = ({ data, handleChange }) => (
    <div className="space-y-8 animate-fade-in">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 text-blue-900 mb-6">
            <div className="shrink-0"><Zap className="w-5 h-5" /></div>
            <p className="text-xs sm:text-sm font-medium">Si no sabes exactamente cómo redactarlo, escribe tus ideas y nuestro equipo de redacción profesional lo optimizará por ti.</p>
        </div>

        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">¿Quiénes Somos?</label>
            <textarea
                name="about"
                value={data.about || ''}
                onChange={handleChange}
                rows="4"
                className="w-full border-b-2 border-gray-200 py-3 focus:outline-none focus:border-black transition-colors resize-none"
                placeholder="Breve historia de la empresa, experiencia, etc."
            />
        </div>

        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Misión (Opcional)</label>
            <textarea
                name="mission"
                value={data.mission || ''}
                onChange={handleChange}
                rows="2"
                className="w-full border-b-2 border-gray-200 py-3 focus:outline-none focus:border-black transition-colors resize-none"
                placeholder="¿Cuál es el propósito de tu negocio?"
            />
        </div>

        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Visión (Opcional)</label>
            <textarea
                name="vision"
                value={data.vision || ''}
                onChange={handleChange}
                rows="2"
                className="w-full border-b-2 border-gray-200 py-3 focus:outline-none focus:border-black transition-colors resize-none"
                placeholder="¿A dónde quieres llegar?"
            />
        </div>
    </div>
)

const Step5 = ({ data, handleMultiFileChange }) => (
    <div className="space-y-6 animate-fade-in">
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <ImageIcon className="w-8 h-8 text-gray-500" />
            </div>
            <h3 class="text-lg font-bold">Sube tus fotos</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">Sube fotos de tu fachada, productos, equipo o local. No es necesario que sean ultra profesionales, nosotros las optimizamos.</p>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
            <input
                type="file"
                multiple
                onChange={handleMultiFileChange}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2">
                <UploadCloud className="w-8 h-8 mx-auto text-blue-600" />
                <p className="font-medium text-gray-900">Elegir archivos</p>
                <p className="text-xs text-gray-400">JPG, PNG, WebP permitidos</p>
            </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-6">
            {/* Previews would go here based on data.photosPreviews array */}
            {data.photosPreviews && data.photosPreviews.map((src, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group">
                    <img src={src} className="w-full h-full object-cover" />
                </div>
            ))}
        </div>
    </div>
)

const StyleCard = ({ id, icon: Icon, title, desc, selected, onChange }) => (
    <label className="cursor-pointer group relative block h-full">
        <input
            type="radio"
            name="visualStyle"
            value={id}
            checked={selected === id}
            onChange={onChange}
            className="opacity-0 absolute peer"
        />
        <div className={`border-2 rounded-xl p-6 h-full transition-all peer-checked:border-black peer-checked:bg-gray-50 hover:border-black ${selected === id ? 'border-black bg-gray-50' : 'border-gray-100'}`}>
            <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400 group-hover:text-black">
                <Icon className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
        </div>
        <div className={`absolute top-4 right-4 text-black transition-opacity ${selected === id ? 'opacity-100' : 'opacity-0'}`}>
            <CheckCircle2 className="w-5 h-5 fill-current" />
        </div>
    </label>
)

const Step6 = ({ data, handleChange }) => (
    <div className="space-y-6 animate-fade-in">
        <p className="text-gray-500 text-sm mb-6">Elige la estética que mejor represente a tu marca.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StyleCard
                id="minimalista"
                icon={Layout}
                title="Minimalista"
                desc="Limpio, mucho espacio en blanco, tipografía sofisticada. 'Menos es más'."
                selected={data.visualStyle}
                onChange={handleChange}
            />
            <StyleCard
                id="corporativo"
                icon={Briefcase}
                title="Corporativo"
                desc="Serio, colores sólidos, estructura tradicional. Genera confianza y estabilidad."
                selected={data.visualStyle}
                onChange={handleChange}
            />
            <StyleCard
                id="moderno"
                icon={Zap}
                title="Moderno / Tech"
                desc="Colores vibrantes, gradientes, bordes redondeados. Sensación de innovación."
                selected={data.visualStyle}
                onChange={handleChange}
            />
            <StyleCard
                id="creativo"
                icon={Palette}
                title="Creativo"
                desc="Rupturista, asimétrico, uso audaz de tipografía e imagen. Destaca del resto."
                selected={data.visualStyle}
                onChange={handleChange}
            />
        </div>
    </div>
)

const Step7 = ({ processPayment, isProcessing }) => (
    <div className="space-y-8 animate-fade-in">
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Resumen del pedido</p>
                    <h3 className="text-xl font-bold text-gray-900">Web Profesional Express</h3>
                    <p className="text-sm text-gray-500 mt-1">Diseño personalizado + Optimización móvil</p>
                </div>
                <div className="text-right">
                    <span className="block text-xs font-bold text-gray-400 decoration-red-400 line-through decoration-2">$149.990</span>
                    <span className="block text-2xl font-bold text-black tracking-tight">$59.990</span>
                    <span className="text-[9px] uppercase font-bold text-gray-400">+ IVA</span>
                </div>
            </div>

            <ul className="space-y-2 mb-6">
                {[
                    'Diseño basado en tu identidad de marca',
                    'Estructura optimizada para ventas',
                    'Integración con WhatsApp y Redes',
                    'Hosting de alta velocidad incluido (1 año)'
                ].map((item, i) => (
                    <li key={i} className="flex gap-2 text-xs text-gray-600">
                        <Check className="w-4 h-4 text-green-500" /> {item}
                    </li>
                ))}
            </ul>

            <div className="border-t border-gray-200 pt-4 flex gap-4 justify-center grayscale opacity-60">
                <span className="font-bold text-gray-400 italic">VISA</span>
                <span className="font-bold text-gray-400 italic">MasterCard</span>
                <span className="font-bold text-gray-400 italic">WebPay</span>
            </div>
        </div>

        <div className="space-y-4">
            <button
                type="button"
                onClick={processPayment}
                disabled={isProcessing}
                className="w-full bg-black text-white py-5 rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-[1.01] hover:shadow-2xl transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Procesando...
                    </>
                ) : (
                    <>
                        <span>Pagar y Comenzar</span>
                        <Lock className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                    </>
                )}
            </button>
            <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold">Pago 100% Seguro vía Stripe / Mercado Pago</p>
        </div>
    </div>
)

const SuccessState = ({ orderId }) => (
    <div className="text-center py-10 animate-fade-in block">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 relative overflow-hidden group">
            <Check className="w-10 h-10" />
            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Tu web ya está en producción!</h2>
        <p className="text-gray-500 text-lg mb-4 max-w-md mx-auto">Hemos recibido tu información correctamente. Nuestro equipo comenzará a trabajar ahora mismo.</p>

        <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-mono mb-8">
            <span className="text-zinc-500">ID DE SEGUIMIENTO:</span> {orderId}
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 inline-block text-left w-full max-w-md mb-8">
            <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">Próximos pasos:</p>
            <ul className="space-y-4">
                <li className="flex gap-3 text-sm flex-col">
                    <div className="flex gap-3">
                        <span className="font-bold text-black shrink-0">1.</span>
                        <span>Revisaremos tus archivos y textos.</span>
                    </div>
                </li>
                <li className="flex gap-3 text-sm flex-col">
                    <div className="flex gap-3">
                        <span className="font-bold text-black shrink-0">2.</span>
                        <span>Puedes hacer seguimiento en tiempo real en tu panel.</span>
                    </div>
                    <a
                        href={`/status/${orderId}`}
                        className="ml-7 text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                    >
                        Ver mi panel de cliente <ArrowRight className="w-3 h-3" />
                    </a>
                </li>
                <li className="flex gap-3 text-sm border-t border-gray-200 pt-4 mt-2">
                    <span className="font-bold text-black shrink-0">3.</span>
                    <span className="text-green-600 font-bold uppercase tracking-widest text-[10px] mt-0.5">Entrega estimada: 3 a 5 días hábiles.</span>
                </li>
            </ul>
        </div>

        <div className="block pt-4">
            <a href="/" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-all">Volver al inicio</a>
        </div>
    </div>
)

export default function Wizard() {
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [complete, setComplete] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);
    const [orderId, setOrderId] = useState(null);

    // Insights ticker state
    const [insightIndex, setInsightIndex] = useState(0);
    const insights = [
        "Tu marca merece una presencia digital de alto impacto",
        "El 92% de tus clientes te buscarán en Google primero",
        "Transforma curiosos en clientes con diseño de autoridad",
        "Tu negocio online trabajando 24/7 para ti",
        "La digitalización no es una opción, es tu ventaja competitiva"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setInsightIndex((prev) => (prev + 1) % insights.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const [formData, setFormData] = useState({
        businessName: '',
        city: '',
        address: '',
        phone: '',
        whatsapp: '',
        email: '',
        socials: '',
        hasDomain: '', // 'yes' | 'no'
        brandColorPrimary: '#000000',
        brandColorsText: '',
        products: '',
        about: '',
        mission: '',
        vision: '',
        visualStyle: 'minimalista',
        logoName: '', // just for UI preview
        photosPreviews: [] // array of base64
    });

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('webExpressData');
        if (saved) {
            try {
                setFormData(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load saved data", e);
            }
        }
    }, []);

    // Save on change
    useEffect(() => {
        localStorage.setItem('webExpressData', JSON.stringify(formData));
    }, [formData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                logoName: file.name
                // In a real app, upload via API immediately or convert to base64
            }));
        }
    };

    const handleMultiFileChange = (e) => {
        const files = Array.from(e.target.files);
        // Create base64 previews
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setFormData(prev => ({
                    ...prev,
                    photosPreviews: [...(prev.photosPreviews || []), ev.target.result]
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const validateStep = (current) => {
        if (current === 1) {
            if (!formData.businessName || !formData.email || !formData.phone) {
                alert("Por favor completa los campos obligatorios.");
                return false;
            }
        }
        if (current === 3) {
            if ((formData.products || '').length < 50) {
                alert("Por favor detalla un poco más tus productos (mínimo 50 caracteres).");
                return false;
            }
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setIsLaunching(true);
            setTimeout(() => {
                setStep(prev => Math.min(prev + 1, 7));
                window.scrollTo(0, 0);
                setTimeout(() => setIsLaunching(false), 200);
            }, 600);
        }
    };

    const prevStep = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    const processPayment = () => {
        setIsProcessing(true);
        // Mock API call
        setTimeout(async () => {
            setIsProcessing(false);
            setComplete(true);
            window.scrollTo(0, 0);

            // Here you would call your backend API
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/submit-order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const data = await response.json();
                if (data.success) {
                    setOrderId(data.orderId);
                }
            } catch (e) { console.error("API Error", e); } // Silently fail for demo

            localStorage.removeItem('webExpressData');
        }, 2000);
    };

    if (complete) {
        return (
            <div className="w-full max-w-3xl mx-auto pt-20 pb-12 px-4">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <SuccessState orderId={orderId} />
                </div>
            </div>
        );
    }

    const titles = [
        "",
        "Datos del Negocio",
        "Identidad de Marca",
        "Productos o Servicios",
        "Información Institucional",
        "Fotografías",
        "Estilo Visual",
        "Confirmación y Pago"
    ];

    const progress = (step / 7) * 100;

    return (
        <>
            {/* Header */}
            <header className="fixed w-full top-0 z-50 glass border-b border-gray-200 transition-all duration-300 bg-white/95 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <a href="/digitalizacion-express" className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                        </a>
                        <a href="/" className="border-l pl-4 border-gray-100 group hidden sm:flex">
                            <img src="/logo-light.png" alt="AgenciaSi" className="h-7 w-auto transition-opacity group-hover:opacity-70" />
                        </a>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
                            Web Profesional Express
                        </div>
                        <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-500 transition-all duration-1000 animate-fade-in text-right max-w-[200px] sm:max-w-none" key={insightIndex}>
                            {insights[insightIndex]}
                        </div>
                    </div>
                </div>
                <div className="w-full h-1.5 bg-gray-100 relative overflow-hidden">
                    <div
                        className="h-full bg-black transition-all duration-500 ease-out relative animate-shimmer"
                        style={{
                            width: `${progress}%`,
                            backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
                            backgroundSize: '200% 100%'
                        }}
                    >
                    </div>
                    {/* Rocket Animation */}
                    <div
                        className={`absolute top-[-10px] transition-all duration-700 ease-in-out pointer-events-none ${isLaunching ? 'opacity-100 scale-125' : 'opacity-0 scale-100'}`}
                        style={{
                            left: `${progress}%`,
                            transform: isLaunching ? `translate(-50%, -40px) rotate(0deg)` : `translate(-50%, 0px) rotate(0deg)`
                        }}
                    >
                        <div className="relative">
                            <Rocket className="w-6 h-6 text-black fill-current" />
                            {isLaunching && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-1 h-4 bg-gradient-to-t from-orange-500 to-transparent blur-sm animate-pulse" />
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow pt-32 pb-12 px-4 md:px-6 flex items-center justify-center min-h-screen">
                <div className="w-full max-w-3xl">
                    <form className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative min-h-[500px] flex flex-col" onSubmit={e => e.preventDefault()}>

                        {/* Step Header */}
                        <div className="pt-8 px-8 pb-4 border-b border-gray-50 flex justify-between items-center bg-white z-10">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-full mb-2 inline-block">
                                    Paso {step} de 7
                                </span>
                                <h2 className="text-2xl font-bold tracking-tight text-gray-900">{titles[step]}</h2>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                <span>5 min aprox.</span>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-8 flex-grow overflow-y-auto max-h-[60vh] md:max-h-[65vh] relative">
                            {step === 1 && <Step1 data={formData} handleChange={handleChange} />}
                            {step === 2 && <Step2 data={formData} handleChange={handleChange} handleFileChange={handleFileChange} />}
                            {step === 3 && <Step3 data={formData} handleChange={handleChange} />}
                            {step === 4 && <Step4 data={formData} handleChange={handleChange} />}
                            {step === 5 && <Step5 data={formData} handleMultiFileChange={handleMultiFileChange} />}
                            {step === 6 && <Step6 data={formData} handleChange={handleChange} />}
                            {step === 7 && <Step7 processPayment={processPayment} isProcessing={isProcessing} />}
                        </div>

                        {/* Footer Actions */}
                        {step < 7 && (
                            <div className="p-6 border-t border-gray-50 bg-white flex justify-between items-center z-10">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    disabled={step === 1}
                                    className="text-gray-400 font-bold uppercase tracking-widest text-xs hover:text-black disabled:opacity-0 transition-colors"
                                >
                                    Atrás
                                </button>

                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-black text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-all flex items-center gap-2"
                                >
                                    Continuar <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </form>

                    <p className="text-center mt-6 text-[10px] text-gray-400 uppercase tracking-widest">
                        © 2026 AgenciaSi • Web Profesional Express
                    </p>
                </div>
            </main>
        </>
    );
}

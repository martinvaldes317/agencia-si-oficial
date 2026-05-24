import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, X, Menu, Clock, Eye, Heart, Share2, Bookmark,
  ArrowRight, ArrowLeft, Facebook, Twitter, Instagram, Youtube,
  TrendingUp, Zap, MessageCircle, Code2,
  Wind, Cloud, MapPin, Bell, ChevronRight, Mail, BookOpen,
  Sun, CloudRain
} from 'lucide-react'

/* ── BRAND ─────────────────────────────────────────────── */
const C = {
  bg:    '#07070A',
  s1:    '#0F0F18',
  s2:    '#17171F',
  s3:    '#1E1E2C',
  bdr:   '#2A2A3C',
  red:   '#E63946',
  gold:  '#F5A623',
  white: '#F0F0F5',
  muted: '#9090A8',
  dim:   '#5C5C72',
}
const WA = 'https://wa.me/56932930812'
const fmt = n => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n

/* ── CSS ANIMATIONS + RESPONSIVE ────────────────────────── */
const CSS_ANIM = `
  @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  .ep-ticker { animation: ticker 38s linear infinite; display:flex; width:200%; }
  .ep-ticker:hover { animation-play-state:paused }
  @keyframes epfade { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .ep-fade { animation: epfade .3s ease both }
  @keyframes epslide { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
  .ep-slide { animation: epslide .25s ease both }
  @keyframes epmodal { from{opacity:0;transform:scale(.97)} to{opacity:1;transform:scale(1)} }
  .ep-modal-anim { animation: epmodal .22s ease both }
  @keyframes eppage { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .ep-page { animation: eppage .3s ease both }
  .ep-art:hover img { transform:scale(1.04) }
  .ep-art img { transition: transform .5s ease }
  .ep-link:hover { color: ${C.red} !important }
  .ep-bookmark:hover { color: ${C.gold} !important }
  /* Desktop defaults */
  .ep-nav-desktop { display:flex; gap:4px; }
  .ep-mobile-btn  { display:none; }
  .ep-topbar      { display:flex; }
  .ep-subscribe-label { display:inline; }
  .ep-grid-main   { display:grid; grid-template-columns:1fr 300px; gap:36px; }
  /* Mobile overrides */
  @media (max-width: 640px) {
    .ep-topbar         { display:none !important; }
    .ep-nav-desktop    { display:none !important; }
    .ep-mobile-btn     { display:flex !important; }
    .ep-subscribe-label{ display:none !important; }
    .ep-grid-main      { grid-template-columns:1fr !important; gap:24px !important; }
    .ep-hero           { height:300px !important; }
    .ep-hero-content   { padding:16px !important; }
    .ep-hero-deck      { display:none !important; }
    .ep-hero-meta      { gap:12px !important; flex-wrap:wrap; }
    .ep-modal-wrap     { margin:0 !important; border-radius:0 !important; min-height:100vh; }
    .ep-modal-img      { height:220px !important; }
    .ep-modal-body     { padding:20px 16px !important; }
    .ep-modal-meta     { flex-direction:column !important; align-items:flex-start !important; gap:10px !important; }
    .ep-modal-actions  { flex-wrap:wrap !important; gap:8px !important; }
    .ep-modal-actions button { flex:1 1 auto; justify-content:center; }
    .ep-list-img       { width:80px !important; height:68px !important; }
    .ep-list-author    { display:none !important; }
    .ep-search-wrap    { margin:20px auto 0 !important; }
  }
`

/* ── DATA ────────────────────────────────────────────────── */
const CATS = ['Portada', 'Política', 'Economía', 'Tecnología', 'Deportes', 'Cultura', 'Internacional', 'Opinión']

const TRENDING = [
  'Reforma constitucional 2026',
  'Copa Libertadores Chile',
  'Precio del dólar hoy',
  'IA y desempleo',
  'Energía solar Atacama',
  'Elecciones municipales',
]

const BREAKING = [
  '🔴 URGENTE: Sismo 5.2° en el Maule — sin daños reportados por autoridades de emergencia',
  '📈 Dólar sube a $938 en apertura de mercados tras tensiones geopolíticas en Oriente Medio',
  '⚽ La Roja confirma lista de 26 para la próxima fecha de clasificatorias sudamericanas',
  '🏛️ Cámara debate este jueves el proyecto de pensiones garantizadas en sesión especial',
  '🌍 COP31 en Bogotá: Chile presenta plan de carbono neutro para el 2040',
]

const ARTICLES = [
  {
    id: 1, cat: 'Política', tag: 'URGENTE',
    title: 'Gobierno anuncia el mayor paquete de reformas sociales en dos décadas',
    deck: 'El Ejecutivo presentó medidas que afectarán a más de 4 millones de familias, con foco en pensiones, vivienda y salud mental.',
    body: `El Presidente anunció ayer en La Moneda un ambicioso programa de reformas sociales que el gobierno califica como "el mayor avance en protección social en dos décadas". El paquete incluye un aumento del 15% en las pensiones más bajas, 50.000 nuevas viviendas sociales y la expansión de la Red de Salud Mental a todas las comunas del país.\n\nEl Ministro de Hacienda señaló que el financiamiento provendrá de una reasignación presupuestaria de $800 mil millones y una esperada mayor recaudación tributaria. "Estamos ante una oportunidad histórica de cerrar brechas que han existido por generaciones", declaró ante los medios.\n\nLa oposición reaccionó con escepticismo. El líder del principal partido de derecha cuestionó la viabilidad fiscal: "No hay recursos para tantas promesas simultáneas". La discusión legislativa comenzará en junio, con un cronograma apretado antes del receso parlamentario.\n\nOrganizaciones sociales celebraron el anuncio, aunque exigieron mayores detalles sobre los plazos de implementación. "El diablo está en los detalles y en la velocidad de ejecución", advirtió la presidenta de la Coordinadora Nacional de Pensionados.`,
    author: 'Claudia Romero', role: 'Editora Política',
    time: 'Hace 23 min', readTime: '4 min', views: 18420, comments: 234,
    img: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1400&h=800&fit=crop&q=80',
    featured: true,
  },
  {
    id: 2, cat: 'Economía', tag: 'ANÁLISIS',
    title: 'Banco Central sube tasa ante presiones inflacionarias globales',
    deck: 'La institución elevó en 25 puntos base la tasa rectora, marcando el tercer ajuste del año en un contexto de incertidumbre internacional.',
    body: `El Banco Central de Chile decidió elevar la tasa de política monetaria en 25 puntos base, llevándola al 5,25% anual. La decisión, tomada por unanimidad del Consejo, fue anticipada por los mercados pero genera debate sobre su impacto en el crecimiento económico.\n\nEn su comunicado, el instituto emisor justificó la medida por la persistencia de presiones inflacionarias importadas, vinculadas a tensiones geopolíticas y la depreciación del peso. "La convergencia al 3% requiere una política monetaria prudentemente restrictiva", señaló el presidente del Banco Central.\n\nLos economistas consultados mostraron opiniones divididas. Algunos celebraron la señal antiinflacionaria; otros advirtieron que nuevos aumentos frenarían el incipiente repunte de inversión privada del primer trimestre.\n\nLos mercados reaccionaron con moderación: el IPSA cayó 0,4% y el peso se apreció levemente. Las tasas hipotecarias, en máximos históricos, podrían seguir subiendo, golpeando al mercado inmobiliario.`,
    author: 'Rodrigo Vega', role: 'Periodista Económico',
    time: 'Hace 1 h', readTime: '5 min', views: 9870, comments: 89,
    img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop&q=80',
  },
  {
    id: 3, cat: 'Deportes', tag: 'EN VIVO',
    title: 'La Roja aplastó 4-0 a Uruguay y lidera las Clasificatorias al Mundial',
    deck: 'Una actuación sublime de Sánchez con dos goles y dos asistencias catapultó a Chile al primer lugar de las clasificatorias sudamericanas.',
    body: `Chile goleó 4-0 a Uruguay en el Estadio Nacional ante 47.000 espectadores enfervorecidos, en el partido más contundente de la selección en años. Alexis Sánchez fue el gran protagonista con dos goles y dos asistencias.\n\nEl primer gol llegó a los 12 minutos con un remate de volea que se coló por el ángulo superior. Uruguay intentó reaccionar pero la defensa chilena fue impenetrable. La segunda parte fue un recital.\n\nCon 2-0 al descanso, Chile salió enchufado y anotó dos veces más en 15 minutos. El estadio estalló cuando el VAR confirmó el 4-0 en el minuto 78.\n\nCon este resultado, Chile suma 19 puntos y supera a Brasil, que empató ante Colombia. Las dos próximas fechas son clave para consolidar la clasificación directa al Mundial 2030.`,
    author: 'Diego Fuentes', role: 'Periodista Deportivo',
    time: 'Hace 3 h', readTime: '3 min', views: 38900, comments: 512,
    img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop&q=80',
  },
  {
    id: 4, cat: 'Tecnología', tag: 'EXCLUSIVA',
    title: 'Chile lanza el mayor parque solar del cono sur en el desierto de Atacama',
    deck: 'El proyecto de 800 MW comenzará a operar en junio y abastecerá a más de 1 millón de hogares con energía 100% renovable.',
    body: `El Ministerio de Energía inauguró en Atacama el Parque Solar Atacama I, el mayor proyecto fotovoltaico de América del Sur con 800 MW de capacidad instalada. La obra, con inversión de US$1.200 millones, tardó tres años y empleó a 4.000 trabajadores.\n\nEl ministro destacó que Chile se consolida como líder regional en transición energética: "Tenemos el mejor recurso solar del mundo aquí y por fin lo aprovechamos a escala". La energía ingresará al sistema nacional a través de una nueva línea de 500 kV.\n\nEl proyecto contempla almacenamiento en baterías que permitirán entregar energía nocturna, resolviendo el histórico desafío de la intermitencia solar. Una segunda fase de 400 MW adicionales está proyectada para 2028.`,
    author: 'Carlos Herrera', role: 'Periodista Ciencia',
    time: 'Hace 5 h', readTime: '4 min', views: 11450, comments: 98,
    img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=500&fit=crop&q=80',
  },
  {
    id: 5, cat: 'Internacional', tag: '',
    title: 'ONU pide cese inmediato de hostilidades en Oriente Medio',
    deck: 'El Consejo de Seguridad aprobó por 13 votos la resolución que exige un alto al fuego y apertura de corredores humanitarios.',
    body: `El Consejo de Seguridad de las Naciones Unidas aprobó con 13 votos a favor y 2 abstenciones la resolución que exige un cese inmediato de hostilidades y apertura de corredores humanitarios para el ingreso de ayuda de emergencia.\n\nEl secretario general calificó la votación como "un paso crucial pero insuficiente" y urgió a las partes a respetar el derecho internacional humanitario. La resolución no incluye mecanismos de cumplimiento obligatorio, lo que varios diplomáticos consideraron una debilidad.\n\nOrganizaciones humanitarias informaron que más de 2 millones de personas están desplazadas y los hospitales operan al límite. Cruz Roja solicitó acceso urgente a las zonas de conflicto.`,
    author: 'Ana Castillo', role: 'Corresponsal Internacional',
    time: 'Hace 4 h', readTime: '4 min', views: 7340, comments: 44,
    img: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&h=500&fit=crop&q=80',
  },
  {
    id: 6, cat: 'Cultura', tag: 'ESTRENO',
    title: 'Festival de Cine de Valdivia bate récord con 85.000 espectadores',
    deck: 'La edición 2026 superó todas las marcas históricas y una película chilena ganó la Competencia Internacional.',
    body: `El Festival Internacional de Cine de Valdivia cerró su edición 2026 con cifras históricas: 85.000 espectadores en 10 días y 120 películas en competencia. La producción nacional "Río Oscuro", del director Pablo Larraín, se llevó la Gran Manzana de Oro.\n\nLa película, rodada en la Patagonia con actores no profesionales, cautivó al jurado con su mirada cruda sobre la vida en los márgenes del sur de Chile. "Es un cine que nace de la tierra, de la lluvia y del silencio", declaró Larraín al recibir el premio.\n\nEl festival destacó por su programación centrada en cambio climático y derechos indígenas, reflejando las preocupaciones centrales del momento cultural iberoamericano.`,
    author: 'Valentina Pino', role: 'Periodista Cultural',
    time: 'Hace 5 h', readTime: '3 min', views: 4210, comments: 31,
    img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=500&fit=crop&q=80',
  },
  {
    id: 7, cat: 'Política', tag: '',
    title: 'Senado aprobó reducción de jornada laboral a 40 horas semanales',
    deck: 'Con 28 votos a favor, la norma comenzará a regir de forma gradual desde enero de 2027 hasta alcanzar plena aplicación en 2030.',
    body: `El Senado aprobó con 28 votos a favor y 14 en contra el proyecto que reduce la jornada laboral de 45 a 40 horas semanales. La norma se implementará gradualmente desde el 1 de enero de 2027 y alcanzará plena aplicación en 2030.\n\nLa votación incluyó encendidos discursos de ambos lados. Los partidarios destacaron que Chile trabaja demasiadas horas comparado con la OCDE. Los detractores advirtieron efectos negativos en productividad y empleo formal.\n\nLas organizaciones sindicales celebraron la aprobación como "una victoria histórica". La CUT convocó una concentración de celebración frente al Congreso en Valparaíso. El mundo empresarial anunció un período de ajuste para evaluar el impacto en costos laborales.`,
    author: 'Claudia Romero', role: 'Editora Política',
    time: 'Hace 12 h', readTime: '4 min', views: 22100, comments: 341,
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop&q=80',
  },
  {
    id: 8, cat: 'Opinión', tag: 'EDITORIAL',
    title: 'La democracia chilena ante su mayor prueba: elegir sin miedo',
    deck: 'A semanas de las elecciones municipales, el 40% de los votantes considera no participar. Una señal que debe preocuparnos a todos.',
    body: `Estamos ante uno de los procesos electorales más importantes de la última década. Las elecciones municipales definirán el curso de los gobiernos locales en 340 comunas, en un momento en que la desconfianza institucional alcanza niveles alarmantes.\n\nLas encuestas revelan que el 40% de los votantes habilitados afirma que "probablemente no irá a votar". Esta cifra debe despertar una alarma profunda en toda la clase política.\n\nLa abstención no es neutralidad. Cuando los ciudadanos se retiran del proceso democrático, el campo queda libre para las opciones más extremas. La democracia se debilita cuando la mayoría silenciosa cede su voz.\n\nDesde El Pulso, hacemos un llamado a participar. No como fe ciega en el sistema, sino como decisión pragmática: quien no vota, renuncia a influir. En tiempos de incertidumbre, influir es más necesario que nunca.`,
    author: 'Directorio Editorial', role: 'El Pulso',
    time: 'Hace 8 h', readTime: '3 min', views: 6890, comments: 156,
    img: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&h=500&fit=crop&q=80',
  },
  {
    id: 9, cat: 'Economía', tag: '',
    title: 'Exportaciones de litio superan récord histórico de US$4.200 millones',
    deck: 'Chile consolida su posición como mayor productor mundial con participación de mercado del 38% impulsada por demanda de baterías eléctricas.',
    body: `Las exportaciones de litio reportaron ingresos récord por US$4.200 millones en el primer trimestre de 2026, un aumento del 34% respecto al año anterior. El repunte coincide con el alza del precio internacional del carbonato de litio, impulsado por la demanda de baterías para vehículos eléctricos.\n\nChile ha fortalecido su posición como el mayor productor mundial de litio de alta pureza, con participación de mercado del 38% global. "Nuestro litio tiene características geoquímicas únicas que lo hacen preferido por los fabricantes de baterías de última generación".\n\nEl gobierno anunció que los excedentes serán parcialmente reinvertidos en el Fondo Soberano de Innovación, destinado a financiar startups en energías renovables y movilidad eléctrica.`,
    author: 'Rodrigo Vega', role: 'Periodista Económico',
    time: 'Hace 10 h', readTime: '3 min', views: 8120, comments: 67,
    img: 'https://images.unsplash.com/photo-1530569673472-307dc017a82d?w=800&h=500&fit=crop&q=80',
  },
  {
    id: 10, cat: 'Deportes', tag: '',
    title: 'Colo-Colo avanza a semifinales de la Copa Libertadores tras vencer a River Plate',
    deck: 'El Cacique venció 2-1 en Buenos Aires con un doblete de Pavez y clasificó como líder de su llave.',
    body: `Colo-Colo protagonizó una hazaña en el Monumental de Buenos Aires al vencer 2-1 a River Plate y avanzar a las semifinales de la Copa Libertadores 2026. Esteban Pavez fue el héroe con dos goles en la segunda parte que dieron vuelta el partido.\n\nEl técnico Gustavo Quinteros, visiblemente emocionado, destacó el colectivo sobre las individualidades: "Este equipo tiene hambre, tiene alma, tiene orgullo. Hoy mostramos por qué somos Colo-Colo".\n\nEn semifinales, el Cacique enfrentará al Flamengo de Brasil. El primer partido se jugará en Santiago en tres semanas, ante lo que se espera sea el Estadio Monumental lleno.`,
    author: 'Diego Fuentes', role: 'Periodista Deportivo',
    time: 'Hace 14 h', readTime: '3 min', views: 29500, comments: 428,
    img: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=800&h=500&fit=crop&q=80',
  },
  {
    id: 11, cat: 'Tecnología', tag: '',
    title: 'Intel presenta el primer chip de 1 nanómetro diseñado íntegramente con IA',
    deck: 'El procesador "Clarity 1N" promete multiplicar por diez el rendimiento energético de los centros de datos actuales.',
    body: `Intel anunció en San Francisco el primer chip de 1 nanómetro del mundo diseñado y fabricado con inteligencia artificial generativa en todas sus etapas. El procesador reduce el consumo energético en un 68% respecto a los chips actuales de 3nm.\n\nEl CEO demostró en vivo el chip ejecutando modelos de IA de 400.000 millones de parámetros en tiempo real sobre hardware de escritorio. "La IA de nivel data-center llega al hogar", afirmó.\n\nExpertos en semiconductores lo calificaron de "hito generacional", aunque advirtieron que la producción masiva tomará 18 a 24 meses. TSMC y Samsung respondieron que están en etapas similares de desarrollo.`,
    author: 'Sofía Martínez', role: 'Periodista Tecnología',
    time: 'Hace 6 h', readTime: '4 min', views: 14200, comments: 167,
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop&q=80',
  },
  {
    id: 12, cat: 'Internacional', tag: '',
    title: 'Elecciones en Brasil: Lula lidera con 54% a dos semanas de la segunda vuelta',
    deck: 'El presidente busca la reelección en un país polarizado con alta abstención en la primera vuelta.',
    body: `A dos semanas de la segunda vuelta en Brasil, el presidente Lula mantiene una ventaja de 10 puntos sobre su rival de centro-derecha Romero Jucá, según Datafolha: 54% vs 44%.\n\nSin embargo, el 23% de abstención en la primera vuelta introduce alta incertidumbre. La campaña gira en torno a la economía: Brasil creció 2,8% en 2025 pero la inflación sigue preocupando.\n\nUna victoria de Lula consolidaría el giro de América del Sur hacia centroizquierda; una sorpresa de Jucá marcaría un nuevo ciclo político en la mayor economía regional.`,
    author: 'Ana Castillo', role: 'Corresponsal Internacional',
    time: 'Hace 16 h', readTime: '3 min', views: 5670, comments: 78,
    img: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=500&fit=crop&q=80',
  },
]

/* ── MAIN COMPONENT ──────────────────────────────────────── */
export default function DemoNoticias() {
  const [activeArticle, setActiveArticle] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Portada')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [bookmarks, setBookmarks] = useState(new Set())
  const [likes, setLikes] = useState({})
  const [email, setEmail] = useState('')
  const [subDone, setSubDone] = useState(false)

  const toggleBookmark = id => setBookmarks(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
  const toggleLike = id => setLikes(prev => ({ ...prev, [id]: !prev[id] }))

  const openArticle = art => {
    setActiveArticle(art)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const closeArticle = () => {
    setActiveArticle(null)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const displayed = activeCategory === 'Portada' ? ARTICLES : ARTICLES.filter(a => a.cat === activeCategory)
  const hero = displayed[0]
  const featured = displayed.slice(1, 4)
  const rest = displayed.slice(activeCategory === 'Portada' ? 4 : 1)
  const searchResults = searchQuery.length > 1
    ? ARTICLES.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.cat.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  return (
    <div style={{ background: C.bg, color: C.white, fontFamily: "'Inter', system-ui, sans-serif", minHeight: '100vh' }}>
      <style>{CSS_ANIM}</style>

      {/* ── BREAKING TICKER ── */}
      <div style={{ background: C.red, overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', height: 36 }}>
          <span style={{ background: '#B02030', color: '#fff', fontWeight: 800, fontSize: 10, letterSpacing: 2, padding: '0 14px', whiteSpace: 'nowrap', height: '100%', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Zap size={12} style={{ marginRight: 5 }} /> ÚLTIMA HORA
          </span>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div className="ep-ticker">
              {[...BREAKING, ...BREAKING].map((item, i) => (
                <span key={i} style={{ whiteSpace: 'nowrap', padding: '0 40px', fontSize: 12, fontWeight: 600, color: '#fff' }}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── TOP BAR (oculta en móvil) ── */}
      <div className="ep-topbar" style={{ background: C.s1, borderBottom: `1px solid ${C.bdr}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 38, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 11, color: C.muted, display: 'flex', alignItems: 'center', gap: 5 }}>
              <MapPin size={10} /> Santiago, Chile
            </span>
            <span style={{ fontSize: 11, color: C.muted, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Cloud size={10} /> 14°C · Parcialmente nublado
            </span>
            <span style={{ fontSize: 11, color: C.muted }}>Viernes, 23 de mayo de 2026</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" style={{ color: C.dim, transition: 'color .2s' }} className="ep-link">
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── HEADER ── */}
      <header style={{ background: C.s1, borderBottom: `1px solid ${C.bdr}`, position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

          {/* Logo */}
          <Link to="/demos" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: C.red, borderRadius: 6, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BookOpen size={17} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.white, letterSpacing: -1, lineHeight: 1 }}>EL PULSO</div>
              <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, textTransform: 'uppercase' }}>Diario Digital · Chile</div>
            </div>
          </Link>

          {/* Center nav (desktop) */}
          <nav className="ep-nav-desktop">
            {CATS.slice(0, 6).map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{ background: activeCategory === cat ? C.red : 'transparent', color: activeCategory === cat ? '#fff' : C.muted, border: 'none', cursor: 'pointer', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, transition: 'all .2s' }}>
                {cat}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setSearchOpen(true)}
              style={{ background: C.s3, border: `1px solid ${C.bdr}`, color: C.muted, borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Search size={15} />
            </button>
            <button className="ep-subscribe-btn"
              style={{ background: C.red, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Bell size={13} />
              <span className="ep-subscribe-label">Suscribirse</span>
            </button>
            <button onClick={() => setMobileNavOpen(v => !v)}
              className="ep-mobile-btn"
              style={{ background: C.s3, border: `1px solid ${C.bdr}`, color: C.white, borderRadius: 8, width: 36, height: 36, alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              {mobileNavOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Category bar */}
        <div style={{ borderTop: `1px solid ${C.bdr}`, background: C.bg }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {CATS.map(cat => (
              <button key={cat} onClick={() => { setActiveCategory(cat); setMobileNavOpen(false) }}
                style={{ whiteSpace: 'nowrap', padding: '10px 14px', fontSize: 12, fontWeight: 600, color: activeCategory === cat ? C.red : C.muted, borderBottom: '2px solid transparent', borderBottomColor: activeCategory === cat ? C.red : 'transparent', background: 'none', border: 'none', borderBottomWidth: 2, borderBottomStyle: 'solid', cursor: 'pointer', transition: 'all .2s', letterSpacing: .3 }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileNavOpen && (
          <div style={{ background: C.s2, borderTop: `1px solid ${C.bdr}`, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {CATS.map(cat => (
              <button key={cat} onClick={() => { setActiveCategory(cat); setMobileNavOpen(false) }}
                style={{ textAlign: 'left', padding: '12px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600, color: activeCategory === cat ? '#fff' : C.muted, background: activeCategory === cat ? C.red : 'transparent', border: 'none', cursor: 'pointer' }}>
                {cat}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── CONTENIDO PRINCIPAL O ARTÍCULO ── */}
      {activeArticle ? (
        <ArticlePage
          art={activeArticle}
          onBack={closeArticle}
          onRelated={openArticle}
          bookmarks={bookmarks} toggleBookmark={toggleBookmark}
          likes={likes} toggleLike={toggleLike}
        />
      ) : (
      <>
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>

        {/* HERO */}
        {hero && (
          <div className="ep-art ep-fade ep-hero" onClick={() => openArticle(hero)}
            style={{ cursor: 'pointer', marginBottom: 24, borderRadius: 12, overflow: 'hidden', position: 'relative', height: 520 }}>
            <img src={hero.img} alt={hero.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,10,.95) 40%, rgba(5,5,10,.2) 80%)' }} />
            <div className="ep-hero-content" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 40px 36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ background: C.red, color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 4, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                  {hero.cat}
                </span>
                {hero.tag && (
                  <span style={{ background: C.gold, color: '#000', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 4, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                    {hero.tag}
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: 'clamp(18px, 4vw, 36px)', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 10, maxWidth: 780 }}>
                {hero.title}
              </h1>
              <p className="ep-hero-deck" style={{ fontSize: 15, color: 'rgba(240,240,245,.75)', marginBottom: 16, maxWidth: 640, lineHeight: 1.6 }}>
                {hero.deck}
              </p>
              <div className="ep-hero-meta" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: C.gold, fontWeight: 700 }}>{hero.author}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.muted }}>
                  <Clock size={11} /> {hero.time}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.muted }}>
                  <BookOpen size={11} /> {hero.readTime}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.muted }}>
                  <Eye size={11} /> {fmt(hero.views)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* FEATURED ROW */}
        {featured.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 36 }}>
            {featured.map(art => <ArticleCardMedium key={art.id} art={art} onOpen={openArticle} bookmarks={bookmarks} toggleBookmark={toggleBookmark} likes={likes} toggleLike={toggleLike} />)}
          </div>
        )}

        {/* MAIN GRID + SIDEBAR */}
        <div className="ep-grid-main">
          {/* Articles */}
          <div>
            {rest.length > 0 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 4, height: 20, background: C.red, borderRadius: 2 }} />
                  <h2 style={{ fontSize: 13, fontWeight: 800, color: C.white, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                    {activeCategory === 'Portada' ? 'Más noticias' : activeCategory}
                  </h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {rest.map((art, i) => <ArticleCardList key={art.id} art={art} onOpen={openArticle} bookmarks={bookmarks} toggleBookmark={toggleBookmark} likes={likes} toggleLike={toggleLike} last={i === rest.length - 1} />)}
                </div>
              </>
            )}
          </div>

          {/* SIDEBAR */}
          <aside>
            {/* Weather */}
            <div style={{ background: C.s2, border: `1px solid ${C.bdr}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 3, height: 16, background: C.red, borderRadius: 2 }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: C.white, letterSpacing: 1.5, textTransform: 'uppercase' }}>El Tiempo</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <Cloud size={42} color={C.gold} />
                <div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: C.white, lineHeight: 1 }}>14°</div>
                  <div style={{ fontSize: 11, color: C.muted }}>Santiago, RM</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 14 }}>Parcialmente nublado</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { label: 'Máx', val: '17°', icon: Sun },
                  { label: 'Mín', val: '9°', icon: CloudRain },
                  { label: 'Viento', val: '18 km/h', icon: Wind },
                  { label: 'Humedad', val: '72%', icon: Cloud },
                ].map(({ label, val, icon: Icon }) => (
                  <div key={label} style={{ background: C.s3, borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={13} color={C.muted} />
                    <div>
                      <div style={{ fontSize: 10, color: C.dim }}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div style={{ background: C.s2, border: `1px solid ${C.bdr}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 3, height: 16, background: C.red, borderRadius: 2 }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: C.white, letterSpacing: 1.5, textTransform: 'uppercase' }}>Trending</span>
                <TrendingUp size={13} color={C.red} style={{ marginLeft: 'auto' }} />
              </div>
              {TRENDING.map((topic, i) => (
                <div key={topic} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < TRENDING.length - 1 ? `1px solid ${C.bdr}` : 'none', cursor: 'pointer' }}
                  onClick={() => setSearchQuery(topic) || setSearchOpen(true)}>
                  <span style={{ fontSize: 20, fontWeight: 900, color: C.bdr, lineHeight: 1, minWidth: 28 }}>{i + 1}</span>
                  <span style={{ fontSize: 13, color: C.white, fontWeight: 600, lineHeight: 1.4 }} className="ep-link">{topic}</span>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div style={{ background: `linear-gradient(135deg, #1a0a0c, #2a0a10)`, border: `1px solid ${C.red}30`, borderRadius: 12, padding: 24 }}>
              <Mail size={22} color={C.red} style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: 16, fontWeight: 800, color: C.white, marginBottom: 8 }}>Newsletter diario</h3>
              <p style={{ fontSize: 12, color: C.muted, marginBottom: 16, lineHeight: 1.6 }}>
                Recibe el resumen de noticias más importantes cada mañana en tu correo.
              </p>
              {subDone ? (
                <div style={{ background: C.red + '20', border: `1px solid ${C.red}50`, borderRadius: 8, padding: '12px 16px', fontSize: 13, color: C.red, fontWeight: 600, textAlign: 'center' }}>
                  ✓ ¡Te has suscrito correctamente!
                </div>
              ) : (
                <>
                  <input type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)}
                    style={{ width: '100%', background: C.s3, border: `1px solid ${C.bdr}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: C.white, marginBottom: 10, outline: 'none', boxSizing: 'border-box' }} />
                  <button onClick={() => email.includes('@') && setSubDone(true)}
                    style={{ width: '100%', background: C.red, color: '#fff', border: 'none', borderRadius: 8, padding: '11px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    Suscribirme gratis
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* ── OPINION SECTION ── */}
      {activeCategory === 'Portada' && (
        <section style={{ background: C.s1, borderTop: `1px solid ${C.bdr}`, borderBottom: `1px solid ${C.bdr}`, padding: '40px 20px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 4, height: 22, background: C.gold, borderRadius: 2 }} />
              <h2 style={{ fontSize: 13, fontWeight: 800, color: C.white, letterSpacing: 2, textTransform: 'uppercase' }}>Opinión & Editorial</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              {ARTICLES.filter(a => a.cat === 'Opinión').map(art => (
                <div key={art.id} onClick={() => openArticle(art)}
                  style={{ background: C.s2, border: `1px solid ${C.bdr}`, borderRadius: 12, padding: 24, cursor: 'pointer', transition: 'border-color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.gold}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.bdr}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: C.gold, letterSpacing: 2, textTransform: 'uppercase' }}>EDITORIAL</span>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: C.white, marginTop: 10, marginBottom: 10, lineHeight: 1.35 }}>{art.title}</h3>
                  <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 16 }}>{art.deck}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.gold + '30', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: C.gold }}>{art.author[0]}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{art.author}</div>
                      <div style={{ fontSize: 11, color: C.dim }}>{art.role}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: C.dim }}>{art.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer style={{ background: C.s1, borderTop: `1px solid ${C.bdr}`, padding: '48px 20px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ background: C.red, borderRadius: 6, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={14} color="#fff" />
                </div>
                <span style={{ fontSize: 18, fontWeight: 900, color: C.white, letterSpacing: -0.5 }}>EL PULSO</span>
              </div>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 16 }}>La información que mueve al país. Periodismo independiente y riguroso desde 2018.</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <a key={i} href="#" style={{ width: 34, height: 34, background: C.s3, border: `1px solid ${C.bdr}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, transition: 'color .2s' }} className="ep-link">
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: 'Secciones', links: ['Política', 'Economía', 'Deportes', 'Tecnología', 'Cultura', 'Internacional'] },
              { title: 'El Pulso', links: ['Sobre nosotros', 'Equipo editorial', 'Contacto', 'Publicidad', 'Carta al editor'] },
              { title: 'Legal', links: ['Términos de uso', 'Privacidad', 'Política de cookies', 'Código ético'] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 11, fontWeight: 800, color: C.white, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 }}>{col.title}</h4>
                {col.links.map(link => (
                  <div key={link} style={{ marginBottom: 10 }}>
                    <span style={{ fontSize: 13, color: C.muted, cursor: 'pointer', transition: 'color .2s' }} className="ep-link">{link}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${C.bdr}`, paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 12, color: C.dim }}>© 2026 El Pulso · Diario Digital · Todos los derechos reservados</span>
            <Link to="/demos" style={{ fontSize: 12, color: C.dim, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }} className="ep-link">
              <Code2 size={12} /> Demo por AgenciaSI
            </Link>
          </div>
        </div>
      </footer>

      </> )}

      {/* ── SEARCH MODAL ── */}
      {searchOpen && (
        <SearchModal query={searchQuery} onChange={setSearchQuery} results={searchResults}
          onClose={() => { setSearchOpen(false); setSearchQuery('') }}
          onOpen={art => { openArticle(art); setSearchOpen(false); setSearchQuery('') }} />
      )}

      {/* ── WA FLOAT ── */}
      <a href={WA} target="_blank" rel="noopener noreferrer"
        style={{ position: 'fixed', bottom: 28, right: 28, background: '#25D366', color: '#fff', width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,.5)', zIndex: 50, textDecoration: 'none', fontSize: 22 }}>
        💬
      </a>
    </div>
  )
}

/* ── SUB-COMPONENTS ──────────────────────────────────────── */

function ArticleCardMedium({ art, onOpen, bookmarks, toggleBookmark, likes, toggleLike }) {
  return (
    <div className="ep-art ep-fade" onClick={() => onOpen(art)}
      style={{ background: C.s2, border: `1px solid ${C.bdr}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'border-color .2s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = C.red + '60'}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.bdr}>
      <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
        <img src={art.img} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
          <span style={{ background: C.red, color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 4, letterSpacing: 1 }}>{art.cat}</span>
          {art.tag && <span style={{ background: C.gold, color: '#000', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 4, letterSpacing: 1 }}>{art.tag}</span>}
        </div>
        <button onClick={e => { e.stopPropagation(); toggleBookmark(art.id) }}
          style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,.5)', border: 'none', borderRadius: 6, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: bookmarks.has(art.id) ? C.gold : C.muted }}
          className="ep-bookmark">
          <Bookmark size={13} fill={bookmarks.has(art.id) ? C.gold : 'none'} />
        </button>
      </div>
      <div style={{ padding: 18 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: C.white, lineHeight: 1.35, marginBottom: 10 }}>{art.title}</h3>
        <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{art.deck}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, color: C.dim, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} />{art.time}</span>
            <span style={{ fontSize: 11, color: C.dim, display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={10} />{fmt(art.views)}</span>
          </div>
          <button onClick={e => { e.stopPropagation(); toggleLike(art.id) }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: likes[art.id] ? C.red : C.dim }}>
            <Heart size={12} fill={likes[art.id] ? C.red : 'none'} />
            {likes[art.id] ? 'Me gusta' : 'Me gusta'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ArticleCardList({ art, onOpen, bookmarks, toggleBookmark, likes, toggleLike, last }) {
  return (
    <div className="ep-art" onClick={() => onOpen(art)}
      style={{ display: 'flex', gap: 16, padding: '18px 0', borderBottom: last ? 'none' : `1px solid ${C.bdr}`, cursor: 'pointer' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ background: C.red + '25', color: C.red, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>{art.cat}</span>
          {art.tag && <span style={{ background: C.gold + '25', color: C.gold, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>{art.tag}</span>}
          <span style={{ fontSize: 11, color: C.dim, marginLeft: 'auto' }}>{art.time}</span>
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: C.white, lineHeight: 1.35, marginBottom: 6 }} className="ep-link">{art.title}</h3>
        <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{art.deck}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="ep-list-author" style={{ fontSize: 11, color: C.dim }}>{art.author}</span>
          <span style={{ fontSize: 11, color: C.dim, display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={10} />{fmt(art.views)}</span>
          <span style={{ fontSize: 11, color: C.dim, display: 'flex', alignItems: 'center', gap: 3 }}><MessageCircle size={10} />{art.comments}</span>
          <button onClick={e => { e.stopPropagation(); toggleBookmark(art.id) }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: bookmarks.has(art.id) ? C.gold : C.dim, marginLeft: 'auto' }}
            className="ep-bookmark">
            <Bookmark size={12} fill={bookmarks.has(art.id) ? C.gold : 'none'} />
          </button>
        </div>
      </div>
      <div className="ep-list-img" style={{ width: 110, height: 80, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
        <img src={art.img} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    </div>
  )
}

function ArticlePage({ art, onBack, onRelated, bookmarks, toggleBookmark, likes, toggleLike }) {
  const related = ARTICLES.filter(a => a.id !== art.id && a.cat === art.cat).slice(0, 3)

  return (
    <div className="ep-page">
      {/* Breadcrumb / volver */}
      <div style={{ background: C.s1, borderBottom: `1px solid ${C.bdr}` }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 10, height: 44 }}>
          <button onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: '6px 10px 6px 0' }}>
            <ArrowLeft size={15} /> Volver
          </button>
          <span style={{ color: C.bdr }}>›</span>
          <span style={{ fontSize: 12, color: C.red, fontWeight: 700 }}>{art.cat}</span>
          <span style={{ color: C.bdr }}>›</span>
          <span style={{ fontSize: 12, color: C.dim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{art.title}</span>
        </div>
      </div>

      {/* Hero image full width */}
      <div style={{ width: '100%', position: 'relative', overflow: 'hidden', maxHeight: 480 }}>
        <img src={art.img} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', maxHeight: 480 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,7,10,.7) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 860, padding: '0 20px', display: 'flex', gap: 8 }}>
          <span style={{ background: C.red, color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 4, letterSpacing: 1.5, textTransform: 'uppercase' }}>{art.cat}</span>
          {art.tag && <span style={{ background: C.gold, color: '#000', fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 4, letterSpacing: 1.5, textTransform: 'uppercase' }}>{art.tag}</span>}
        </div>
      </div>

      {/* Article body */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 20px 60px' }}>

        {/* Headline */}
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 900, color: C.white, lineHeight: 1.2, marginBottom: 16 }}>
          {art.title}
        </h1>

        {/* Deck */}
        <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.7, marginBottom: 28, fontStyle: 'italic', borderLeft: `4px solid ${C.red}`, paddingLeft: 20 }}>
          {art.deck}
        </p>

        {/* Author + meta */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0', borderTop: `1px solid ${C.bdr}`, borderBottom: `1px solid ${C.bdr}`, marginBottom: 36, flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: C.red + '25', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `2px solid ${C.red}40` }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: C.red }}>{art.author[0]}</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{art.author}</div>
              <div style={{ fontSize: 12, color: C.dim }}>{art.role}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: C.dim, display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={13} />{art.time}</span>
            <span style={{ fontSize: 12, color: C.dim, display: 'flex', alignItems: 'center', gap: 5 }}><BookOpen size={13} />{art.readTime} lectura</span>
            <span style={{ fontSize: 12, color: C.dim, display: 'flex', alignItems: 'center', gap: 5 }}><Eye size={13} />{fmt(art.views)}</span>
            <span style={{ fontSize: 12, color: C.dim, display: 'flex', alignItems: 'center', gap: 5 }}><MessageCircle size={13} />{art.comments} comentarios</span>
          </div>
        </div>

        {/* Body text */}
        <div style={{ fontSize: 17, color: '#CFCFDF', lineHeight: 1.9, marginBottom: 40 }}>
          {art.body.split('\n\n').map((p, i) => (
            <p key={i} style={{ marginBottom: 24 }}>{p}</p>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 0', borderTop: `1px solid ${C.bdr}`, borderBottom: `1px solid ${C.bdr}`, marginBottom: 48, flexWrap: 'wrap' }}>
          <button onClick={() => toggleLike(art.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, border: `1px solid ${C.bdr}`, background: likes[art.id] ? C.red + '20' : 'transparent', color: likes[art.id] ? C.red : C.muted, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            <Heart size={15} fill={likes[art.id] ? C.red : 'none'} /> Me gusta
          </button>
          <button onClick={() => toggleBookmark(art.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, border: `1px solid ${C.bdr}`, background: bookmarks.has(art.id) ? C.gold + '20' : 'transparent', color: bookmarks.has(art.id) ? C.gold : C.muted, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            <Bookmark size={15} fill={bookmarks.has(art.id) ? C.gold : 'none'} /> Guardar
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, border: `1px solid ${C.bdr}`, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            <Share2 size={15} /> Compartir
          </button>
          <button onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, border: `1px solid ${C.bdr}`, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: 14, fontWeight: 600, marginLeft: 'auto' }}>
            <ArrowLeft size={15} /> Volver al inicio
          </button>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 4, height: 20, background: C.red, borderRadius: 2 }} />
              <h2 style={{ fontSize: 13, fontWeight: 800, color: C.white, letterSpacing: 1.5, textTransform: 'uppercase' }}>Más en {art.cat}</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {related.map(rel => (
                <div key={rel.id} onClick={() => onRelated(rel)}
                  className="ep-art"
                  style={{ background: C.s2, border: `1px solid ${C.bdr}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'border-color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.red + '60'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.bdr}>
                  <div style={{ height: 130, overflow: 'hidden' }}>
                    <img src={rel.img} alt={rel.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: 10, color: C.red, fontWeight: 700, marginBottom: 6 }}>{rel.cat} · {rel.time}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.white, lineHeight: 1.35 }}>{rel.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: C.s1, borderTop: `1px solid ${C.bdr}`, padding: '32px 20px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: `1px solid ${C.bdr}`, color: C.muted, cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 8 }}>
            <ArrowLeft size={14} /> Volver a El Pulso
          </button>
          <span style={{ fontSize: 12, color: C.dim }}>© 2026 El Pulso · Diario Digital</span>
          <Link to="/demos" style={{ fontSize: 12, color: C.dim, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }} className="ep-link">
            <Code2 size={12} /> Demo por AgenciaSI
          </Link>
        </div>
      </footer>
    </div>
  )
}

function SearchModal({ query, onChange, results, onClose, onOpen }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,5,10,.95)', zIndex: 200, display: 'flex', flexDirection: 'column', backdropFilter: 'blur(8px)' }}>
      <div className="ep-modal-anim ep-search-wrap" style={{ maxWidth: 700, width: '100%', margin: '40px auto 0', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: C.s2, border: `1px solid ${C.red}`, borderRadius: 14, padding: '16px 20px', marginBottom: 24 }}>
          <Search size={20} color={C.red} />
          <input autoFocus value={query} onChange={e => onChange(e.target.value)}
            placeholder="Buscar noticias, temas, autores..."
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 18, color: C.white, fontWeight: 500 }} />
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted }}>
            <X size={20} />
          </button>
        </div>

        {query.length > 1 && (
          <div style={{ background: C.s2, border: `1px solid ${C.bdr}`, borderRadius: 12, overflow: 'hidden' }}>
            {results.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: C.muted, fontSize: 14 }}>
                No se encontraron resultados para "{query}"
              </div>
            ) : (
              results.map((art, i) => (
                <div key={art.id} onClick={() => onOpen(art)}
                  style={{ display: 'flex', gap: 14, padding: '14px 20px', borderBottom: i < results.length - 1 ? `1px solid ${C.bdr}` : 'none', cursor: 'pointer', transition: 'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = C.s3}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <img src={art.img} alt={art.title} style={{ width: 60, height: 44, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: C.red, fontWeight: 700, marginBottom: 4 }}>{art.cat} · {art.time}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.white, lineHeight: 1.35 }}>{art.title}</div>
                  </div>
                  <ArrowRight size={16} color={C.dim} style={{ flexShrink: 0, alignSelf: 'center' }} />
                </div>
              ))
            )}
          </div>
        )}

        {query.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <div style={{ fontSize: 13, color: C.dim, marginBottom: 20 }}>Temas populares</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {TRENDING.map(t => (
                <button key={t} onClick={() => onChange(t)}
                  style={{ background: C.s2, border: `1px solid ${C.bdr}`, color: C.muted, borderRadius: 20, padding: '8px 16px', fontSize: 13, cursor: 'pointer', transition: 'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.white }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.bdr; e.currentTarget.style.color = C.muted }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

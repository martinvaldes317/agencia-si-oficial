import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'

import Home from './components/Home'
import AdminDashboard from './components/AdminDashboard'
import ClientManagement from './components/admin/ClientManagement'
import ResetAdminPassword from './components/admin/ResetAdminPassword'
import DiagnosticoSEO from './components/DiagnosticoSEO'
import Links from './components/Links'

// Portal
import PortalLogin from './components/portal/PortalLogin'
import PortalSetup from './components/portal/PortalSetup'
import ClientPortal from './components/portal/ClientPortal'
import PortalDashboard from './components/portal/PortalDashboard'
import PortalMetrics from './components/portal/PortalMetrics'
import PortalPayments from './components/portal/PortalPayments'
import PortalCalendar from './components/portal/PortalCalendar'
import PortalFiles from './components/portal/PortalFiles'
import PortalTickets from './components/portal/PortalTickets'
import DemoFarmacia from './components/demos/DemoFarmacia'
import DemoClinica from './components/demos/DemoClinica'
import DemoRestaurante from './components/demos/DemoRestaurante'
import DemoCorredora from './components/demos/DemoCorredora'
import DemoTienda from './components/demos/DemoTienda'
import DemoNoticias from './components/demos/DemoNoticias'
import DemoIndex from './components/demos/DemoIndex'
import LandingWebSistemas from './components/LandingWebSistemas'
import LandingSEOLocal from './components/seo/LandingSEOLocal'
import HomeSEOLocal from './components/seo/HomeSEOLocal'
import MarketingSEOLocal from './components/seo/MarketingSEOLocal'
import LetrerosSEOLocal from './components/seo/LetrerosSEOLocal'
import CorporateSEOLocal from './components/seo/CorporateSEOLocal'

const MAULE_REGION = 'Región del Maule'

const MAULE_COMUNAS = {
  // Provincia de Talca
  'talca':          { name: 'Talca',          slug: 'talca',          provincia: 'Talca',      region: MAULE_REGION, context: 'comercios, clínicas, restaurantes y empresas de Talca' },
  'constitucion':   { name: 'Constitución',   slug: 'constitucion',   provincia: 'Talca',      region: MAULE_REGION, context: 'negocios y comercios de Constitución' },
  'curepto':        { name: 'Curepto',        slug: 'curepto',        provincia: 'Talca',      region: MAULE_REGION, context: 'comercios y empresas locales de Curepto' },
  'empedrado':      { name: 'Empedrado',      slug: 'empedrado',      provincia: 'Talca',      region: MAULE_REGION, context: 'negocios de Empedrado y alrededores' },
  'maule':          { name: 'Maule',          slug: 'maule',          provincia: 'Talca',      region: MAULE_REGION, context: 'comercios y empresas de la comuna de Maule' },
  'pelarco':        { name: 'Pelarco',        slug: 'pelarco',        provincia: 'Talca',      region: MAULE_REGION, context: 'negocios locales de Pelarco' },
  'pencahue':       { name: 'Pencahue',       slug: 'pencahue',       provincia: 'Talca',      region: MAULE_REGION, context: 'comercios de Pencahue' },
  'rio-claro':      { name: 'Río Claro',      slug: 'rio-claro',      provincia: 'Talca',      region: MAULE_REGION, context: 'empresas y locales de Río Claro' },
  'san-clemente':   { name: 'San Clemente',   slug: 'san-clemente',   provincia: 'Talca',      region: MAULE_REGION, context: 'negocios y comercios de San Clemente' },
  'san-rafael':     { name: 'San Rafael',     slug: 'san-rafael',     provincia: 'Talca',      region: MAULE_REGION, context: 'locales comerciales de San Rafael' },
  // Provincia de Curicó
  'curico':         { name: 'Curicó',         slug: 'curico',         provincia: 'Curicó',     region: MAULE_REGION, context: 'comercios, empresas y negocios de Curicó' },
  'hualane':        { name: 'Hualañé',        slug: 'hualane',        provincia: 'Curicó',     region: MAULE_REGION, context: 'negocios locales de Hualañé' },
  'licanten':       { name: 'Licantén',       slug: 'licanten',       provincia: 'Curicó',     region: MAULE_REGION, context: 'comercios de Licantén' },
  'molina':         { name: 'Molina',         slug: 'molina',         provincia: 'Curicó',     region: MAULE_REGION, context: 'empresas, bodegas y comercios de Molina' },
  'rauco':          { name: 'Rauco',          slug: 'rauco',          provincia: 'Curicó',     region: MAULE_REGION, context: 'locales y negocios de Rauco' },
  'romeral':        { name: 'Romeral',        slug: 'romeral',        provincia: 'Curicó',     region: MAULE_REGION, context: 'comercios de Romeral' },
  'sagrada-familia':{ name: 'Sagrada Familia',slug: 'sagrada-familia',provincia: 'Curicó',     region: MAULE_REGION, context: 'negocios y locales de Sagrada Familia' },
  'teno':           { name: 'Teno',           slug: 'teno',           provincia: 'Curicó',     region: MAULE_REGION, context: 'empresas y comercios de Teno' },
  'vichuquen':      { name: 'Vichuquén',      slug: 'vichuquen',      provincia: 'Curicó',     region: MAULE_REGION, context: 'negocios turísticos y comercios de Vichuquén' },
  // Provincia de Linares
  'linares':        { name: 'Linares',        slug: 'linares',        provincia: 'Linares',    region: MAULE_REGION, context: 'comercios, empresas y negocios de Linares' },
  'colbun':         { name: 'Colbún',         slug: 'colbun',         provincia: 'Linares',    region: MAULE_REGION, context: 'negocios y comercios de Colbún' },
  'longavi':        { name: 'Longaví',        slug: 'longavi',        provincia: 'Linares',    region: MAULE_REGION, context: 'empresas agrícolas y comercios de Longaví' },
  'parral':         { name: 'Parral',         slug: 'parral',         provincia: 'Linares',    region: MAULE_REGION, context: 'comercios, empresas y locales de Parral' },
  'retiro':         { name: 'Retiro',         slug: 'retiro',         provincia: 'Linares',    region: MAULE_REGION, context: 'negocios locales de Retiro' },
  'san-javier':     { name: 'San Javier',     slug: 'san-javier',     provincia: 'Linares',    region: MAULE_REGION, context: 'viñas, comercios y empresas de San Javier' },
  'villa-alegre':   { name: 'Villa Alegre',   slug: 'villa-alegre',   provincia: 'Linares',    region: MAULE_REGION, context: 'negocios y locales de Villa Alegre' },
  'yerbas-buenas':  { name: 'Yerbas Buenas',  slug: 'yerbas-buenas',  provincia: 'Linares',    region: MAULE_REGION, context: 'comercios de Yerbas Buenas' },
  // Provincia de Cauquenes
  'cauquenes':      { name: 'Cauquenes',      slug: 'cauquenes',      provincia: 'Cauquenes',  region: MAULE_REGION, context: 'comercios, empresas y negocios de Cauquenes' },
  'chanco':         { name: 'Chanco',         slug: 'chanco',         provincia: 'Cauquenes',  region: MAULE_REGION, context: 'negocios de Chanco' },
  'pelluhue':       { name: 'Pelluhue',       slug: 'pelluhue',       provincia: 'Cauquenes',  region: MAULE_REGION, context: 'negocios turísticos y comercios de Pelluhue' },
  // Sector especial
  'las-rastras':    { name: 'Sector Las Rastras', slug: 'las-rastras', provincia: 'Talca',   region: MAULE_REGION, context: 'locales, talleres y comercios del Sector Las Rastras, Talca' },
}

const CITIES = {
  'talca':        { name: 'Talca',        slug: 'talca',        region: 'Región del Maule',         context: 'ferreterías, clínicas, restaurantes y comercios del Maule' },
  'rancagua':     { name: 'Rancagua',     slug: 'rancagua',     region: "Región de O'Higgins",       context: "pymes, profesionales y comercios de O'Higgins" },
  'santiago':     { name: 'Santiago',     slug: 'santiago',     region: 'Región Metropolitana',      context: 'empresas, startups y profesionales de Santiago' },
  'vina-del-mar': { name: 'Viña del Mar', slug: 'vina-del-mar', region: 'Región de Valparaíso',      context: 'hoteles, restaurantes, comercios y servicios de Viña del Mar' },
  'pucon':        { name: 'Pucón',        slug: 'pucon',        region: 'Región de La Araucanía',    context: 'hostales, actividades turísticas y negocios de Pucón' },
  'temuco':       { name: 'Temuco',       slug: 'temuco',       region: 'Región de La Araucanía',    context: 'pymes, clínicas, comercios y profesionales de Temuco' },
  'las-condes':   { name: 'Las Condes',   slug: 'las-condes',   region: 'Región Metropolitana',      context: 'empresas, consultorios y negocios premium de Las Condes' },
}

const CORPORATE_CITIES = {
  ...MAULE_COMUNAS,
  ...Object.fromEntries(Object.entries(CITIES).filter(([slug]) => !MAULE_COMUNAS[slug])),
}

const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', { page_path: pathname, page_title: document.title })
    }
  }, [pathname])
  return null
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/diagnostico-seo" element={<DiagnosticoSEO />} />
          <Route path="/links" element={<Links />} />
          <Route path="/demos" element={<DemoIndex />} />
          <Route path="/demos/farmacia" element={<DemoFarmacia />} />
          <Route path="/demos/clinica" element={<DemoClinica />} />
          <Route path="/demos/restaurante" element={<DemoRestaurante />} />
          <Route path="/demos/corredora" element={<DemoCorredora />} />
          <Route path="/demos/tienda" element={<DemoTienda />} />
          <Route path="/demos/noticias" element={<DemoNoticias />} />
          <Route path="/web" element={<LandingWebSistemas />} />
          {Object.values(CITIES).map(city => (
            <Route key={city.slug} path={`/web/${city.slug}`} element={<LandingSEOLocal city={city} />} />
          ))}
          {Object.values(CITIES).map(city => (
            <Route key={`agencia-${city.slug}`} path={`/agencia/${city.slug}`} element={<HomeSEOLocal city={city} />} />
          ))}
          <Route path="/marketing/rancagua" element={<MarketingSEOLocal city={CITIES['rancagua']} />} />
          {Object.values(MAULE_COMUNAS).map(city => (
            <Route key={`marketing-${city.slug}`} path={`/marketing/${city.slug}`} element={<MarketingSEOLocal city={city} />} />
          ))}
          {Object.values(MAULE_COMUNAS).map(city => (
            <Route key={`letreros-${city.slug}`} path={`/letreros/${city.slug}`} element={<LetrerosSEOLocal city={city} />} />
          ))}
          {Object.values(CORPORATE_CITIES).map(city => (
            <Route key={`corporativa-${city.slug}`} path={`/publicidad-corporativa/${city.slug}`} element={<CorporateSEOLocal city={city} />} />
          ))}

          {/* Admin */}
          <Route path="/admin/si" element={<AdminDashboard />} />
          <Route path="/admin/clientes" element={<ClientManagement />} />
          <Route path="/admin/reset-password" element={<ResetAdminPassword />} />

          {/* Client portal */}
          <Route path="/portal/setup" element={<PortalSetup />} />
          <Route path="/portal" element={<PortalLogin />} />
          <Route path="/portal" element={<ClientPortal />}>
            <Route path="dashboard" element={<PortalDashboard />} />
            <Route path="metricas" element={<PortalMetrics />} />
            <Route path="pagos" element={<PortalPayments />} />
            <Route path="calendario" element={<PortalCalendar />} />
            <Route path="archivos" element={<PortalFiles />} />
            <Route path="tickets" element={<PortalTickets />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

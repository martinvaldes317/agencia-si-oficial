import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'

import Wizard from './components/Wizard'
import Home from './components/Home'
import DigitalizationLanding from './components/DigitalizationLanding'
import AdminDashboard from './components/AdminDashboard'
import ClientStatus from './components/ClientStatus'
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
import PaymentReturn from './components/PaymentReturn'
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

const CITIES = {
  'talca':        { name: 'Talca',        slug: 'talca',        region: 'Región del Maule',         context: 'ferreterías, clínicas, restaurantes y comercios del Maule' },
  'rancagua':     { name: 'Rancagua',     slug: 'rancagua',     region: "Región de O'Higgins",       context: "pymes, profesionales y comercios de O'Higgins" },
  'santiago':     { name: 'Santiago',     slug: 'santiago',     region: 'Región Metropolitana',      context: 'empresas, startups y profesionales de Santiago' },
  'vina-del-mar': { name: 'Viña del Mar', slug: 'vina-del-mar', region: 'Región de Valparaíso',      context: 'hoteles, restaurantes, comercios y servicios de Viña del Mar' },
  'pucon':        { name: 'Pucón',        slug: 'pucon',        region: 'Región de La Araucanía',    context: 'hostales, actividades turísticas y negocios de Pucón' },
  'temuco':       { name: 'Temuco',       slug: 'temuco',       region: 'Región de La Araucanía',    context: 'pymes, clínicas, comercios y profesionales de Temuco' },
  'las-condes':   { name: 'Las Condes',   slug: 'las-condes',   region: 'Región Metropolitana',      context: 'empresas, consultorios y negocios premium de Las Condes' },
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
          <Route path="/digitalizacion-express" element={<DigitalizationLanding />} />
          <Route path="/digitalizacion-express/wizard" element={<Wizard />} />
          <Route path="/digitalizacion-express/pago" element={<PaymentReturn />} />
          <Route path="/status/:orderId" element={<ClientStatus />} />
          <Route path="/pack-express" element={<Wizard />} />
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
          <Route path="/marketing/talca"    element={<MarketingSEOLocal city={CITIES['talca']} />} />
          <Route path="/marketing/rancagua" element={<MarketingSEOLocal city={CITIES['rancagua']} />} />

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

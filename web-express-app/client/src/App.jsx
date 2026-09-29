import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import { trackPageView, initGlobalTracking } from './lib/analytics'
import { AuthProvider } from './context/AuthContext'

import Home from './components/Home'
import AdminDashboard from './components/AdminDashboard'
import ClientManagement from './components/admin/ClientManagement'
import ResetAdminPassword from './components/admin/ResetAdminPassword'
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
import ServicioSEOLocal, { SERVICIOS } from './components/seo/ServicioSEOLocal'
import SitioWebLanding from './components/landing/SitioWebLanding'
import SitioWebWizard from './components/landing/SitioWebWizard'
import SitioWebConfirmacion from './components/landing/SitioWebConfirmacion'
import PoliticaPrivacidad from './components/legal/PoliticaPrivacidad'
import TerminosCondiciones from './components/legal/TerminosCondiciones'
import CookieConsent from './components/legal/CookieConsent'
import AccessibilityWidget from './a11y/AccessibilityWidget'

const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'))
const AdminSettings = lazy(() => import('./components/AdminSettings'))
const ProjectsDashboard = lazy(() => import('./components/projects/ProjectsDashboard'))
const ProjectsList = lazy(() => import('./components/projects/ProjectsList'))
const ProjectsClients = lazy(() => import('./components/projects/ProjectsClients'))
const ProjectsSettings = lazy(() => import('./components/projects/ProjectsSettings'))
const ProjectDetail = lazy(() => import('./components/projects/ProjectDetail'))
const AdminDrafts = lazy(() => import('./components/AdminDrafts'))

initGlobalTracking()

const CITIES = {
  'talca':        { name: 'Talca',        slug: 'talca',        region: 'Región del Maule',         context: 'ferreterías, clínicas, restaurantes y comercios del Maule' },
  'rancagua':     { name: 'Rancagua',     slug: 'rancagua',     region: "Región de O'Higgins",       context: "pymes, profesionales y comercios de O'Higgins" },
  'santiago':     { name: 'Santiago',     slug: 'santiago',     region: 'Región Metropolitana',      context: 'empresas, startups y profesionales de Santiago' },
  'vina-del-mar': { name: 'Viña del Mar', slug: 'vina-del-mar', region: 'Región de Valparaíso',      context: 'hoteles, restaurantes, comercios y servicios de Viña del Mar' },
  'pucon':        { name: 'Pucón',        slug: 'pucon',        region: 'Región de La Araucanía',    context: 'hostales, actividades turísticas y negocios de Pucón' },
  'temuco':       { name: 'Temuco',       slug: 'temuco',       region: 'Región de La Araucanía',    context: 'pymes, clínicas, comercios y profesionales de Temuco' },
  'las-condes':   { name: 'Las Condes',   slug: 'las-condes',   region: 'Región Metropolitana',      context: 'empresas, consultorios y negocios premium de Las Condes' },
  'concepcion':   { name: 'Concepción',   slug: 'concepcion',   region: 'Región del Biobío',          context: 'pymes, comercios y empresas del Biobío' },
  'antofagasta':  { name: 'Antofagasta',  slug: 'antofagasta',  region: 'Región de Antofagasta',      context: 'empresas de minería, servicios y comercio de Antofagasta' },
  'la-serena':    { name: 'La Serena',    slug: 'la-serena',    region: 'Región de Coquimbo',         context: 'comercios, turismo y profesionales de La Serena y Coquimbo' },
  'valdivia':     { name: 'Valdivia',     slug: 'valdivia',     region: 'Región de Los Ríos',         context: 'pymes, turismo y profesionales de Valdivia' },
  'puerto-montt': { name: 'Puerto Montt', slug: 'puerto-montt', region: 'Región de Los Lagos',        context: 'empresas de servicios, turismo y comercio de Puerto Montt' },
  'iquique':      { name: 'Iquique',      slug: 'iquique',      region: 'Región de Tarapacá',         context: 'comercios y empresas de servicios de Iquique' },
  // Santiago y comunas de la Región Metropolitana
  'providencia':  { name: 'Providencia',  slug: 'providencia',  region: 'Región Metropolitana',      context: 'empresas, oficinas y profesionales de Providencia' },
  'nunoa':        { name: 'Ñuñoa',        slug: 'nunoa',        region: 'Región Metropolitana',      context: 'comercios, clínicas y profesionales de Ñuñoa' },
  'vitacura':     { name: 'Vitacura',     slug: 'vitacura',     region: 'Región Metropolitana',      context: 'empresas y negocios premium de Vitacura' },
  'la-reina':     { name: 'La Reina',     slug: 'la-reina',     region: 'Región Metropolitana',      context: 'comercios y profesionales de La Reina' },
  'maipu':        { name: 'Maipú',        slug: 'maipu',        region: 'Región Metropolitana',      context: 'pymes y comercios de Maipú' },
  'la-florida':   { name: 'La Florida',   slug: 'la-florida',   region: 'Región Metropolitana',      context: 'pymes y comercios de La Florida' },
  'puente-alto':  { name: 'Puente Alto',  slug: 'puente-alto',  region: 'Región Metropolitana',      context: 'pymes y comercios de Puente Alto' },
  'san-miguel':   { name: 'San Miguel',   slug: 'san-miguel',   region: 'Región Metropolitana',      context: 'pymes y comercios de San Miguel' },
  // Comunas de la Región de O'Higgins (además de Rancagua)
  'san-fernando': { name: 'San Fernando', slug: 'san-fernando', region: "Región de O'Higgins",       context: 'pymes y comercios de San Fernando' },
  'rengo':        { name: 'Rengo',        slug: 'rengo',        region: "Región de O'Higgins",       context: 'comercios y agroindustria de Rengo' },
  'machali':      { name: 'Machalí',      slug: 'machali',      region: "Región de O'Higgins",       context: 'comercios y empresas de Machalí' },
  // Sur de Chile
  'chillan':      { name: 'Chillán',      slug: 'chillan',      region: 'Región de Ñuble',            context: 'pymes, comercios y profesionales de Chillán' },
  'los-angeles':  { name: 'Los Ángeles',  slug: 'los-angeles',  region: 'Región del Biobío',          context: 'pymes y comercios agrícolas de Los Ángeles' },
  'osorno':       { name: 'Osorno',       slug: 'osorno',       region: 'Región de Los Lagos',         context: 'pymes y comercios de Osorno' },
  'coyhaique':    { name: 'Coyhaique',    slug: 'coyhaique',    region: 'Región de Aysén',             context: 'turismo y comercios de Coyhaique' },
  'punta-arenas': { name: 'Punta Arenas', slug: 'punta-arenas', region: 'Región de Magallanes',        context: 'turismo, comercio y empresas de Punta Arenas' },
}

const ScrollToTop = () => {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', { page_path: pathname, page_title: document.title })
    }
    if (!pathname.startsWith('/admin') && !pathname.startsWith('/portal')) {
      trackPageView(pathname)
    }
    if (hash) {
      // Un <Link to="/otra-ruta#seccion"> no dispara el scroll nativo del
      // navegador (eso solo pasa en una carga de página completa) — hay que
      // hacerlo a mano. Reintenta porque el destino puede tardar un instante
      // en montarse (viene de otra ruta). Si nunca aparece, cae al scroll-top
      // de siempre en vez de dejar la página a mitad de camino.
      const id = hash.slice(1)
      const tryScroll = (attemptsLeft) => {
        const el = document.getElementById(id)
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return }
        if (attemptsLeft > 0) setTimeout(() => tryScroll(attemptsLeft - 1), 60)
        else window.scrollTo(0, 0)
      }
      tryScroll(8)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
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
          <Route path="/links" element={<Links />} />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
          <Route path="/demos" element={<DemoIndex />} />
          <Route path="/demos/farmacia" element={<DemoFarmacia />} />
          <Route path="/demos/clinica" element={<DemoClinica />} />
          <Route path="/demos/restaurante" element={<DemoRestaurante />} />
          <Route path="/demos/corredora" element={<DemoCorredora />} />
          <Route path="/demos/tienda" element={<DemoTienda />} />
          <Route path="/demos/noticias" element={<DemoNoticias />} />
          <Route path="/web" element={<LandingWebSistemas />} />
          <Route path="/sitio-web" element={<SitioWebLanding />} />
          <Route path="/sitio-web/formulario" element={<SitioWebWizard />} />
          <Route path="/sitio-web/confirmacion" element={<SitioWebConfirmacion />} />
          {Object.values(CITIES).map(city => (
            <Route key={city.slug} path={`/web/${city.slug}`} element={<LandingSEOLocal city={city} />} />
          ))}
          {Object.values(CITIES).map(city => (
            <Route key={`agencia-${city.slug}`} path={`/agencia/${city.slug}`} element={<HomeSEOLocal city={city} />} />
          ))}
          {Object.values(SERVICIOS).map(service => (
            <Route key={`servicio-${service.slug}`} path={`/servicios/${service.slug}`} element={<ServicioSEOLocal service={service} />} />
          ))}

          {/* Admin */}
          <Route path="/admin/si" element={<AdminDashboard />} />
          <Route path="/admin/clientes" element={<ClientManagement />} />
          <Route path="/admin/reset-password" element={<ResetAdminPassword />} />
          <Route path="/admin/analitica" element={
            <Suspense fallback={<div style={{ background: '#000', minHeight: '100vh' }} />}>
              <AnalyticsDashboard />
            </Suspense>
          } />
          <Route path="/admin/configuracion" element={
            <Suspense fallback={<div style={{ background: '#000', minHeight: '100vh' }} />}>
              <AdminSettings />
            </Suspense>
          } />
          <Route path="/admin/formularios" element={
            <Suspense fallback={<div style={{ background: '#000', minHeight: '100vh' }} />}>
              <AdminDrafts />
            </Suspense>
          } />

          <Route path="/admin/proyectos/*" element={
            <Suspense fallback={<div style={{ background: '#000', minHeight: '100vh' }} />}>
              <Routes>
                <Route index element={<ProjectsDashboard />} />
                <Route path="clientes" element={<ProjectsClients />} />
                <Route path="lista" element={<ProjectsList />} />
                <Route path="kanban" element={<ProjectsList kanban />} />
                <Route path="configuracion" element={<ProjectsSettings />} />
                <Route path=":id" element={<ProjectDetail />} />
              </Routes>
            </Suspense>
          } />

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
        <CookieConsent />
        <AccessibilityWidget />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

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
import ClientPortal from './components/portal/ClientPortal'
import PortalDashboard from './components/portal/PortalDashboard'
import PortalMetrics from './components/portal/PortalMetrics'
import PortalPayments from './components/portal/PortalPayments'
import PortalCalendar from './components/portal/PortalCalendar'
import PortalFiles from './components/portal/PortalFiles'
import PortalTickets from './components/portal/PortalTickets'

const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
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
          <Route path="/status/:orderId" element={<ClientStatus />} />
          <Route path="/pack-express" element={<Wizard />} />
          <Route path="/diagnostico-seo" element={<DiagnosticoSEO />} />
          <Route path="/links" element={<Links />} />

          {/* Admin */}
          <Route path="/admin/si" element={<AdminDashboard />} />
          <Route path="/admin/clientes" element={<ClientManagement />} />
          <Route path="/admin/reset-password" element={<ResetAdminPassword />} />

          {/* Client portal */}
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

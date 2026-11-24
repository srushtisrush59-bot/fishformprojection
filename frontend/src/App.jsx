import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppDataProvider } from './context/AppDataContext'
import AppLayout from './components/layout/AppLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import LiveMonitoringPage from './pages/LiveMonitoringPage'
import AIDetectionPage from './pages/AIDetectionPage'
import ProtectedZonesPage from './pages/ProtectedZonesPage'
import AlertsPage from './pages/AlertsPage'
import IncidentHistoryPage from './pages/IncidentHistoryPage'
import CameraManagementPage from './pages/CameraManagementPage'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="live-monitoring" element={<LiveMonitoringPage />} />
              <Route path="ai-detection" element={<AIDetectionPage />} />
              <Route path="zones" element={<ProtectedZonesPage />} />
              <Route path="alerts" element={<AlertsPage />} />
              <Route path="incidents" element={<IncidentHistoryPage />} />
              <Route path="cameras" element={<CameraManagementPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppDataProvider>
    </AuthProvider>
  )
}

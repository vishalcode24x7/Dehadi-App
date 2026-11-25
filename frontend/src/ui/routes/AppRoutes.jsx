import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppHeader from '../layouts/AppHeader'
import ContractorBottomNav from '../layouts/ContractorBottomNav'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'
import OfflineBanner from '../components/OfflineBanner'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Settings from '../pages/Settings'
import ContractorDashboard from '../pages/contractor/ContractorDashboard'
import WorkerDashboard from '../pages/worker/WorkerDashboard'
import Workers from '../pages/contractor/Workers'
import Attendance from '../pages/contractor/Attendance'
import Payments from '../pages/contractor/Payments'
import Khoraki from '../pages/contractor/Khoraki'
import WorkerDetail from '../pages/contractor/WorkerDetail'
import WorkerAttendance from '../pages/worker/WorkerAttendance'
import WorkerPaise from '../pages/worker/WorkerPaise'
import WorkerKhoraki from '../pages/worker/WorkerKhoraki'
import WorkerChart from '../pages/worker/WorkerChart'

function AppRoutes() {
  const { pathname } = useLocation()
  const showContractorNav = pathname.startsWith('/contractor')
  const [installPrompt, setInstallPrompt] = useState(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault()
      setInstallPrompt(event)
    }
    const handleAppInstalled = () => setInstallPrompt(null)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <OfflineBanner />
      <AppHeader />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/settings"
            element={
              <Settings
                installPrompt={installPrompt}
                onInstallPromptConsumed={() => setInstallPrompt(null)}
              />
            }
          />
          <Route element={<RoleRoute role="contractor" />}>
            <Route path="/contractor" element={<ContractorDashboard />} />
            <Route path="/contractor/workers" element={<Workers />} />
            <Route path="/contractor/attendance" element={<Attendance />} />
            <Route path="/contractor/payments" element={<Payments />} />
            <Route path="/contractor/khoraki" element={<Khoraki />} />
            <Route path="/contractor/workers/:id" element={<WorkerDetail />} />
          </Route>
          <Route element={<RoleRoute role="worker" />}>
            <Route path="/worker" element={<WorkerDashboard />} />
            <Route path="/worker/attendance" element={<WorkerAttendance />} />
            <Route path="/worker/paise" element={<WorkerPaise />} />
            <Route path="/worker/khoraki" element={<WorkerKhoraki />} />
            <Route path="/worker/chart" element={<WorkerChart />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      {showContractorNav && <ContractorBottomNav />}
    </div>
  )
}

export default AppRoutes

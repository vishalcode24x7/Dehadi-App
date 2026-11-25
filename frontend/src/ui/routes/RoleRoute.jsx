import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function RoleRoute({ role }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (user?.role !== role) {
    return <Navigate to={user?.role === 'contractor' ? '/contractor' : '/worker'} replace />
  }
  return <Outlet />
}

export default RoleRoute

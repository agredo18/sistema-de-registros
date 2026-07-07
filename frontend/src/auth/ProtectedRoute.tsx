import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Bloquea el acceso si no hay sesión: redirige a /login.
export default function ProtectedRoute() {
  const { usuario } = useAuth();
  const hasToken = !!localStorage.getItem('token');

  if (!usuario && !hasToken) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

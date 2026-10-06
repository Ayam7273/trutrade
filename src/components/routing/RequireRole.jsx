import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RequireRole({ role }) {
  const { profile } = useAuth();
  if (profile?.role !== role) {
    if (profile?.role === 'seller') return <Navigate to="/dashboard" replace />;
    if (profile?.role === 'buyer') return <Navigate to="/marketplace" replace />;
    return <Navigate to="/verify" replace />;
  }
  return <Outlet />;
}

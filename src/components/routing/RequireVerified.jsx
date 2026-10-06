import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RequireVerified() {
  const { profile, loading } = useAuth();
  if (loading) return null;
  if (!profile || profile.verification_status !== 'verified') {
    return <Navigate to="/verify" replace />;
  }
  return <Outlet />;
}

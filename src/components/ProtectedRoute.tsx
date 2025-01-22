import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BottomNav from './BottomNav';

const ProtectedRoute = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect admin users to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="pb-16">
      <Outlet />
      <BottomNav />
    </div>
  );
};

export default ProtectedRoute;
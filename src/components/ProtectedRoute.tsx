import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BottomNav from './BottomNav';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
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
      {children}
      <BottomNav />
    </div>
  );
};

export default ProtectedRoute;
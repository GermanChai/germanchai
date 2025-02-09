
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

  // Pass a no-op function if search isn't needed on this route
  const handleSearch = (query: string) => {
    // This will be handled by the specific page components that need search
    console.log('Search query:', query);
  };

  return (
    <div className="pb-16">
      {children}
      <BottomNav onSearch={handleSearch} />
    </div>
  );
};

export default ProtectedRoute;

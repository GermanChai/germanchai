import { LayoutDashboard, ClipboardList, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';

const AdminBottomNav = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center">
        <Link
          to="/admin"
          className={`flex flex-col items-center ${
            isActive('/admin') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <LayoutDashboard size={24} />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        
        <Link
          to="/admin/orders"
          className={`flex flex-col items-center ${
            isActive('/admin/orders') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <ClipboardList size={24} />
          <span className="text-xs mt-1">Orders</span>
        </Link>
        
        <Button
          variant="ghost"
          className="flex flex-col items-center text-gray-500 hover:text-primary"
          onClick={() => logout()}
        >
          <LogOut size={24} />
          <span className="text-xs mt-1">Logout</span>
        </Button>
      </div>
    </nav>
  );
};

export default AdminBottomNav;
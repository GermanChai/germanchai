import { Home, ShoppingCart, ClipboardList, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center">
        <Link
          to="/"
          className={`flex flex-col items-center ${
            isActive('/') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Menu</span>
        </Link>
        
        <Link
          to="/cart"
          className={`flex flex-col items-center ${
            isActive('/cart') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <ShoppingCart size={24} />
          <span className="text-xs mt-1">Cart</span>
        </Link>
        
        <Link
          to="/orders"
          className={`flex flex-col items-center ${
            isActive('/orders') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <ClipboardList size={24} />
          <span className="text-xs mt-1">Orders</span>
        </Link>
        
        <Link
          to="/profile"
          className={`flex flex-col items-center ${
            isActive('/profile') ? 'text-primary' : 'text-gray-500'
          }`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
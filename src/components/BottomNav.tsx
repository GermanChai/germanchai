
import { Home, ShoppingCart, ClipboardList, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe-area-inset-bottom z-50">
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex justify-around items-center">
          <Link
            to="/"
            className={`flex flex-col items-center space-y-1 ${
              isActive('/') ? 'text-[#FF5A5F]' : 'text-gray-400'
            }`}
          >
            <Home size={24} strokeWidth={2} />
            <span className="text-xs font-medium">Browse</span>
          </Link>
          
          <Link
            to="/cart"
            className={`flex flex-col items-center space-y-1 ${
              isActive('/cart') ? 'text-[#FF5A5F]' : 'text-gray-400'
            }`}
          >
            <ShoppingCart size={24} strokeWidth={2} />
            <span className="text-xs font-medium">Cart</span>
          </Link>
          
          <Link
            to="/orders"
            className={`flex flex-col items-center space-y-1 ${
              isActive('/orders') ? 'text-[#FF5A5F]' : 'text-gray-400'
            }`}
          >
            <ClipboardList size={24} strokeWidth={2} />
            <span className="text-xs font-medium">Orders</span>
          </Link>
          
          <Link
            to="/profile"
            className={`flex flex-col items-center space-y-1 ${
              isActive('/profile') ? 'text-[#FF5A5F]' : 'text-gray-400'
            }`}
          >
            <User size={24} strokeWidth={2} />
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;

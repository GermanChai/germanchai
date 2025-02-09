
import { Home, Search, ShoppingCart, ClipboardList, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Input } from './ui/input';

interface BottomNavProps {
  onSearch: (query: string) => void;
}

const BottomNav = ({ onSearch }: BottomNavProps) => {
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    } else {
      onSearch(''); // Clear search when closing
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      onSearch(e.target.value);
    } catch (error) {
      console.error('Error in search handler:', error);
    }
  };

  return (
    <>
      {showSearch && (
        <div className="fixed top-0 left-0 right-0 p-4 bg-white border-b border-gray-200 animate-fade-in z-50">
          <Input
            id="search-input"
            placeholder="Search menu items..."
            className="w-full"
            onChange={handleSearchChange}
            autoFocus
          />
        </div>
      )}
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
        <div className="flex justify-around items-center">
          <Link
            to="/"
            className={`flex flex-col items-center ${
              isActive('/') ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <button
            onClick={toggleSearch}
            className={`flex flex-col items-center ${
              showSearch ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <Search size={24} />
            <span className="text-xs mt-1">Search</span>
          </button>
          
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
            to="/cart"
            className={`flex flex-col items-center ${
              isActive('/cart') ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <ShoppingCart size={24} />
            <span className="text-xs mt-1">Cart</span>
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
    </>
  );
};

export default BottomNav;

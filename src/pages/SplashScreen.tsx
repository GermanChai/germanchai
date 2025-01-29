import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SplashScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const [hasShownSplash, setHasShownSplash] = useState(false);

  useEffect(() => {
    // Only show splash screen if we haven't shown it yet and we're at the root path
    if (!hasShownSplash && location.pathname === '/') {
      const timer = setTimeout(() => {
        setHasShownSplash(true);
        if (user) {
          navigate('/menu');
        } else {
          navigate('/login');
        }
      }, 3000);

      return () => clearTimeout(timer);
    } else if (location.pathname === '/' && hasShownSplash) {
      // If we've already shown the splash screen and we're back at root, redirect immediately
      if (user) {
        navigate('/menu');
      } else {
        navigate('/login');
      }
    }
  }, [navigate, user, location.pathname, hasShownSplash]);

  // Only render the splash screen if we haven't shown it yet and we're at the root path
  if (hasShownSplash || location.pathname !== '/') {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/90 to-primary animate-fadeIn">
      <div className="text-white text-center space-y-6">
        <Coffee className="w-20 h-20 mx-auto animate-bounce" />
        <h1 className="text-4xl font-bold mb-4">German Chai Wala</h1>
        <p className="text-xl">Authentic German Tea Experience</p>
      </div>
    </div>
  );
};

export default SplashScreen;
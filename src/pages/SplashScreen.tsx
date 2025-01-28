import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SplashScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      // If user is already logged in, redirect to menu, otherwise to login
      if (user) {
        navigate('/menu');
      } else {
        navigate('/login');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, user]);

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
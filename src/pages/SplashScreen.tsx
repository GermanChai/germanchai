import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary animate-fadeIn">
      <div className="text-white text-center">
        <h1 className="text-4xl font-bold mb-4">FoodDelight</h1>
        <p className="text-lg">Delicious food at your doorstep</p>
      </div>
    </div>
  );
};

export default SplashScreen;
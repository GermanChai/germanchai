import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee } from 'lucide-react';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/20 to-background">
      <div className="animate-bounce">
        <Coffee className="h-24 w-24 text-primary" />
      </div>
      <h1 className="mt-8 text-4xl font-bold text-primary animate-fade-in">
        German Chai Wala
      </h1>
      <p className="mt-4 text-muted-foreground animate-fade-in" style={{ animationDelay: '200ms' }}>
        Your daily cup of happiness
      </p>
    </div>
  );
};

export default SplashScreen;
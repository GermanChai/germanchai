import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coffee } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <Coffee className="mx-auto h-12 w-12 text-primary animate-scale-in" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 animate-fade-in" style={{ animationDelay: '200ms' }}>
            German Chai Wala
          </h2>
          <p className="mt-2 text-sm text-gray-600 animate-fade-in" style={{ animationDelay: '400ms' }}>
            Sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6 animate-fade-in" onSubmit={handleSubmit} style={{ animationDelay: '600ms' }}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="hover-scale transition-all duration-200">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="transform transition-all duration-200 hover:scale-[1.02] focus:scale-[1.02]"
              />
            </div>
            <div className="hover-scale transition-all duration-200">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transform transition-all duration-200 hover:scale-[1.02] focus:scale-[1.02]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between animate-fade-in" style={{ animationDelay: '800ms' }}>
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-primary hover:text-primary/80 transition-colors duration-200"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '1000ms' }}>
            <Button
              type="submit"
              className="w-full transform transition-all duration-200 hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full transform transition-all duration-200 hover:scale-105"
              onClick={() => navigate('/admin-login')}
            >
              Admin Login
            </Button>
          </div>
        </form>

        <div className="text-center animate-fade-in" style={{ animationDelay: '1200ms' }}>
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-primary hover:text-primary/80 transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
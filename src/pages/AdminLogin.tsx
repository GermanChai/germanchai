
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coffee, ArrowLeft, UserPlus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { createAdminUser } from '@/utils/adminSetup';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  console.log('AdminLogin render - user:', user?.email, 'isAdmin:', isAdmin);

  // Redirect if already logged in as admin
  if (user && isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  // Redirect normal users to menu
  if (user && !isAdmin) {
    return <Navigate to="/menu" replace />;
  }

  const handleCreateAdmin = async () => {
    setIsCreatingAdmin(true);
    try {
      const result = await createAdminUser();
      if (result.success) {
        toast({
          title: "Success",
          description: "Admin user created successfully! You can now log in.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to create admin user",
        });
      }
    } catch (error) {
      console.error('Error in handleCreateAdmin:', error);
      toast({
        variant: "destructive",
        title: "Error",  
        description: "Failed to create admin user",
      });
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with email:', email, 'password length:', password.length);
    
    // Check if user is trying to access admin panel with non-admin email
    if (email !== 'admin@restaurant.com') {
      console.log('Non-admin email attempted:', email);
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "This login is reserved for administrators only.",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Calling login function...');
      await login(email, password);
      console.log('Login function completed successfully');
      // If login succeeds, navigation will be handled by AuthContext
    } catch (error) {
      console.error('Admin login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Coffee className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access admin dashboard
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Debug: Use admin@restaurant.com / admin1234
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-sm text-yellow-800 mb-3">
            If you're getting "Invalid login credentials", you may need to create the admin user first:
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={handleCreateAdmin}
            disabled={isCreatingAdmin}
            className="w-full"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {isCreatingAdmin ? 'Creating Admin User...' : 'Create Admin User'}
          </Button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
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
              />
            </div>
            <div>
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
              />
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in as Admin'}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate('/login')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to User Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;


import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    // Check active session and handle initial authentication state
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setUser(null);
          // Clear any stored session data
          await supabase.auth.signOut();
          navigate('/login');
        } else {
          console.log('Initial session:', session?.user?.email || 'No session');
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, 'User email:', session?.user?.email || 'No user');
      setUser(session?.user ?? null);
      setLoading(false);
      
      switch (event) {
        case 'SIGNED_OUT':
          // Clear any stored data
          localStorage.removeItem('cart');
          setUser(null);
          navigate('/login');
          break;
        case 'SIGNED_IN':
          localStorage.removeItem('cart');
          const email = session?.user?.email;
          console.log('User signed in with email:', email);
          if (email === 'admin@restaurant.com') {
            console.log('Redirecting to admin dashboard');
            navigate('/admin-dashboard');
          } else {
            console.log('Redirecting to menu');
            navigate('/menu');
          }
          break;
        case 'TOKEN_REFRESHED':
          // Handle successful token refresh
          setUser(session?.user ?? null);
          break;
        case 'INITIAL_SESSION':
          // Initial session loaded
          break;
        default:
          // Handle other events if needed
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Login response:', { user: data.user?.email, error: error?.message });

      if (error) throw error;

      if (!data.user) {
        throw new Error('No user data returned');
      }

      // Clear cart data when logging in
      localStorage.removeItem('cart');
      
      toast({
        title: "Success",
        description: "Logged in successfully",
      });

      // Navigation is handled by onAuthStateChange
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Invalid login credentials",
      });
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Account created successfully. Please check your email for verification.",
      });
      navigate('/login');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create account",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Navigation and cleanup handled by onAuthStateChange
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to logout",
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Password reset link sent to your email",
      });
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send reset link",
      });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isAdmin: user?.email === 'admin@restaurant.com',
        login, 
        signup, 
        logout, 
        resetPassword 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

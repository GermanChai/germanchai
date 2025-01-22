import React, { createContext, useContext, useState, useEffect } from 'react';
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Clear cart data from localStorage on auth state change
      if (_event === 'SIGNED_IN' || _event === 'SIGNED_OUT') {
        localStorage.removeItem('cart');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Clear cart data when logging in
      localStorage.removeItem('cart');

      // Navigate based on user role
      if (email === 'admin@restaurant.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to login",
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

      setUser(null);
      navigate('/login');
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error: any) {
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
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
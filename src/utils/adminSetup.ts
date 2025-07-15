
import { supabase } from '@/integrations/supabase/client';

export const createAdminUser = async () => {
  try {
    console.log('Creating admin user through Supabase Auth...');
    
    // Sign up the admin user properly through Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@restaurant.com',
      password: 'admin1234',
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: 'Admin User',
          role: 'admin'
        }
      }
    });

    if (error) {
      console.error('Error creating admin user:', error);
      return { success: false, error: error.message };
    }

    console.log('Admin user created successfully:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('Exception creating admin user:', error);
    return { success: false, error: error.message };
  }
};

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import AdminBottomNav from "@/components/AdminBottomNav";
import AdminOrders from "@/components/AdminOrders";
import AdminStats from "@/components/AdminStats";
import AdminMenuItems from "@/components/AdminMenuItems";
import AddMenuItemForm from "@/components/AddMenuItemForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // Fetch menu items with loading state
  const { data: menuItems, isLoading: menuLoading, refetch: refetchMenu } = useQuery({
    queryKey: ['admin-menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category');
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch orders with loading state
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (*)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleAddItem = async (
    e: React.FormEvent,
    newItem: { name: string; description: string; price: string; category: string },
    imageFile: File | null
  ) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const menuItem = {
        name: newItem.name,
        description: newItem.description,
        price: parseFloat(newItem.price),
        category: newItem.category,
        image_url: imageUrl,
      };

      const { error } = await supabase
        .from('menu_items')
        .insert(menuItem);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Menu item added successfully",
      });
      
      refetchMenu();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
      
      refetchMenu();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleClearData = async () => {
    try {
      const { data, error } = await supabase.rpc('clear_admin_data');
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin data cleared successfully",
      });
      refetchMenu();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  // Calculate total earnings
  const totalEarnings = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

  // Only show loading when menu items are loading (orders load in background)
  if (menuLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clear Admin Data</DialogTitle>
              <DialogDescription>
                This action will clear all orders and order items. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleClearData}
              >
                Confirm Clear Data
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <AdminStats 
        totalEarnings={totalEarnings} 
        totalOrders={orders?.length || 0} 
      />
      
      <AddMenuItemForm 
        onSubmit={handleAddItem}
        isUploading={isUploading}
      />

      <AdminMenuItems 
        menuItems={menuItems || []}
        onDeleteItem={handleDeleteItem}
      />

      <AdminOrders />
      <AdminBottomNav />
    </div>
  );
};

export default AdminDashboard;

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { format, differenceInMinutes } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Orders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please login to view your orders",
      });
    }
  }, [user, navigate, toast]);

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Authentication required');
      
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (*)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      return orders;
    },
    enabled: !!user,
  });

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Order cancelled successfully",
        description: "Your order has been cancelled.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error cancelling order",
        description: error.message,
      });
    },
  });

  const handleCancelOrder = (orderId: string, createdAt: string) => {
    const minutesSinceOrder = differenceInMinutes(new Date(), new Date(createdAt));
    
    if (minutesSinceOrder > 10) {
      toast({
        variant: "destructive",
        title: "Cannot cancel order",
        description: "Orders can only be cancelled within 10 minutes of placing them.",
      });
      return;
    }

    cancelOrderMutation.mutate(orderId);
  };

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Failed to load orders. Please try again later.</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
        <p className="text-gray-600 text-center">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      <div className="space-y-6">
        {orders.map(order => {
          const minutesSinceOrder = differenceInMinutes(new Date(), new Date(order.created_at));
          const canCancel = minutesSinceOrder <= 10 && order.status === 'pending';

          return (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Order placed: {format(new Date(order.created_at), 'PPp')}
                  </p>
                  <p className="text-sm font-semibold mt-1">
                    Status: <span className="capitalize">{order.status}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold mb-2">
                    Total: ₹{order.total_amount.toFixed(2)}
                  </p>
                  {canCancel && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelOrder(order.id, order.created_at)}
                      disabled={cancelOrderMutation.isPending}
                    >
                      {cancelOrderMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Cancel Order'
                      )}
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Order Items:</h3>
                <div className="space-y-2">
                  {order.order_items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.menu_items.name}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × ₹{item.price_at_time.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">
                        ₹{(item.quantity * item.price_at_time).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
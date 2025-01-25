import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AdminBottomNav from "./AdminBottomNav";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Phone, MapPin } from "lucide-react";

const AdminOrders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
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
  });

  const markDelivered = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'delivered' })
        .eq('id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({
        title: "Success",
        description: "Order marked as delivered",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden border rounded-lg bg-white shadow-sm mb-16">
        <h2 className="text-xl font-semibold p-4 border-b">Recent Orders</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Customer Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono">{order.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    {order.order_items.map((item: any) => (
                      <div key={item.id}>
                        {item.quantity}x {item.menu_items.name}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>₹{order.total_amount.toFixed(2)}</TableCell>
                  <TableCell>
                    {order.customer_phone && (
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-4 w-4" />
                        {order.customer_phone}
                      </div>
                    )}
                    {order.customer_address && (
                      <div className="flex items-center gap-1 text-sm mt-1">
                        <MapPin className="h-4 w-4" />
                        {order.customer_address}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="capitalize">{order.status}</TableCell>
                  <TableCell>
                    {order.status !== 'delivered' && (
                      <Button
                        size="sm"
                        onClick={() => markDelivered.mutate(order.id)}
                        disabled={markDelivered.isPending}
                      >
                        {markDelivered.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Mark Delivered'
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <AdminBottomNav />
    </>
  );
};

export default AdminOrders;
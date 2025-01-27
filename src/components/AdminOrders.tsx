import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Phone, MapPin, User } from "lucide-react";

const AdminOrders = () => {
  const { toast } = useToast();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price_at_time,
            menu_item_id,
            menu_items (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Orders fetch error:', error);
        throw error;
      }
      return data;
    },
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Order status has been updated to ${newStatus}`,
      });
    } catch (error: any) {
      console.error('Status update error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Customer Details</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.order_items?.map((item: any, index: number) => (
                    <div key={`${order.id}-${index}`} className="mb-1">
                      {item.quantity}x {item.menu_items?.name}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  <Select
                    defaultValue={order.status}
                    onValueChange={(value) => handleStatusChange(order.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="preparing">Preparing</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>₹{order.total_amount.toFixed(2)}</TableCell>
                <TableCell>
                  {order.customer_name && (
                    <div className="flex items-center gap-1 text-sm">
                      <User className="h-4 w-4" />
                      {order.customer_name}
                    </div>
                  )}
                  {order.customer_phone && (
                    <div className="flex items-center gap-1 text-sm mt-1">
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
                <TableCell>
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrders;
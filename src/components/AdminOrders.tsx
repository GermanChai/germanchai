
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const AdminOrders = () => {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data: orders, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (
            *,
            menu_items (*)
          ),
          addresses (*)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return orders;
    },
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating order status",
        description: error.message,
      });
    } else {
      toast({
        title: "Order status updated",
        description: `Order ${orderId} status changed to ${newStatus}`,
      });
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
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

  return (
    <div className="container mx-auto px-4 py-8">
      <NavigationMenu className="mb-6">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/admin/dashboard">
              <NavigationMenuLink className="px-4 py-2 hover:bg-accent rounded-md">
                Dashboard
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/admin/orders">
              <NavigationMenuLink className="px-4 py-2 hover:bg-accent rounded-md">
                Orders
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer Details</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Order Type</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-gray-500">{order.customer_phone}</p>
                    {order.dining_option === "dine-out" && (
                      <p className="text-sm text-gray-500">
                        {order.customer_address}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    {order.order_items.map((item: any) => (
                      <li key={item.id}>
                        {item.quantity}x {item.menu_items.name} - ₹
                        {item.price_at_time}
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>
                  <span className="capitalize">{order.dining_option}</span>
                </TableCell>
                <TableCell>₹{order.total_amount}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={order.status}
                    onValueChange={(value) => handleStatusChange(order.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {format(new Date(order.created_at), "PPp")}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Dining Option</h3>
                          <p className="capitalize">{order.dining_option}</p>
                        </div>
                        
                        {order.dining_option === "dine-in" && order.estimated_arrival_time && (
                          <div>
                            <h3 className="font-semibold mb-2">Estimated Arrival</h3>
                            <p>{format(new Date(order.estimated_arrival_time), "PPp")}</p>
                          </div>
                        )}

                        {order.dining_option === "dine-out" && (
                          <div>
                            <h3 className="font-semibold mb-2">Delivery Address</h3>
                            <p>{order.customer_address}</p>
                          </div>
                        )}

                        {order.special_requests && (
                          <div>
                            <h3 className="font-semibold mb-2">Special Requests</h3>
                            <p>{order.special_requests}</p>
                          </div>
                        )}

                        <div>
                          <h3 className="font-semibold mb-2">Items</h3>
                          <ul className="list-disc list-inside">
                            {order.order_items.map((item: any) => (
                              <li key={item.id}>
                                {item.quantity}x {item.menu_items.name} - ₹
                                {item.price_at_time}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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

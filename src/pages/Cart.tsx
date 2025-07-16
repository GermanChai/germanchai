
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { format, addHours } from "date-fns";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

const Cart = () => {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [specialRequests, setSpecialRequests] = useState("");
  const [diningOption, setDiningOption] = useState<"dine-in" | "dine-out">("dine-out");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [estimatedArrival, setEstimatedArrival] = useState("");

  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleCheckout = async () => {
    try {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to checkout",
        });
        navigate('/login');
        return;
      }

      if (!profile?.full_name || !profile?.phone) {
        toast({
          variant: "destructive",
          title: "Profile Incomplete",
          description: "Please complete your profile before placing an order",
        });
        navigate('/profile');
        return;
      }

      if (diningOption === "dine-out" && !selectedAddressId) {
        toast({
          variant: "destructive",
          title: "Address Required",
          description: "Please select a delivery address",
        });
        return;
      }

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'pending',
          customer_name: profile.full_name,
          customer_phone: profile.phone,
          customer_address: diningOption === "dine-out" 
            ? addresses?.find(a => a.id === selectedAddressId)?.address_line 
            : null,
          special_requests: specialRequests.trim() || null,
          dining_option: diningOption,
          estimated_arrival_time: diningOption === "dine-in" && estimatedArrival 
            ? new Date(estimatedArrival).toISOString()
            : null,
          delivery_address_id: diningOption === "dine-out" ? selectedAddressId : null
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      toast({
        title: "Order placed successfully",
        description: "Your order has been placed and is being processed.",
      });
      navigate('/orders');
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        variant: "destructive",
        title: "Error placing order",
        description: error.message || 'An error occurred while placing your order',
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Button onClick={() => navigate('/')}>Browse Menu</Button>
        </div>
      </div>
    );
  }

  // Generate time slots for the next 12 hours
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const time = addHours(new Date(), i + 1);
    return format(time, "yyyy-MM-dd'T'HH:mm");
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <div className="flex items-center space-x-4">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">₹{item.price.toFixed(2)} each</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-white rounded-lg shadow">
        <div className="space-y-4 mb-6">
          <div>
            <Label>Special Requests</Label>
            <Textarea
              placeholder="Any special requests for the chef?"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Dining Option</Label>
            <RadioGroup
              value={diningOption}
              onValueChange={(value: "dine-in" | "dine-out") => setDiningOption(value)}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dine-in" id="dine-in" />
                <Label htmlFor="dine-in">Dine In</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dine-out" id="dine-out" />
                <Label htmlFor="dine-out">Dine Out (Delivery)</Label>
              </div>
            </RadioGroup>
          </div>

          {diningOption === "dine-in" && (
            <div>
              <Label>Estimated Arrival Time</Label>
              <Select
                value={estimatedArrival}
                onValueChange={setEstimatedArrival}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select arrival time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {format(new Date(time), 'h:mm a')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {diningOption === "dine-out" && (
            <div>
              <Label>Delivery Address</Label>
              {addresses?.length === 0 ? (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">No addresses found</p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/profile')}
                  >
                    Add Address
                  </Button>
                </div>
              ) : (
                <Select
                  value={selectedAddressId}
                  onValueChange={setSelectedAddressId}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select delivery address" />
                  </SelectTrigger>
                  <SelectContent>
                    {addresses?.map((address) => (
                      <SelectItem key={address.id} value={address.id}>
                        {address.label} - {address.address_line}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total:</span>
          <span className="text-xl font-bold">₹{total.toFixed(2)}</span>
        </div>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={clearCart}>
            Clear Cart
          </Button>
          <Button onClick={handleCheckout}>
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

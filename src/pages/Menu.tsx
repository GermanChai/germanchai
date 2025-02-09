
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Tables } from '@/integrations/supabase/types';
import { Loader2, ShoppingCart, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

type MenuItem = Tables<'menu_items'>;

const Menu = () => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category');
      
      if (error) throw error;
      return data as MenuItem[];
    },
  });

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
    toast({
      title: "Added to cart!",
      description: `${item.name} has been added to your cart`,
      duration: 2000,
    });
  };

  const filteredItems = menuItems?.filter(item => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search)
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const categories = Array.from(new Set(filteredItems?.map(item => item.category)));

  return (
    <div className="container mx-auto px-4 py-8 pb-24 min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Our Menu
        </h1>
        <p className="text-gray-600 mt-2">
          Discover our delicious offerings
        </p>
      </div>
      
      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-gray-800">
                {category}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems
                ?.filter(item => item.category === category)
                .map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {item.image_url && (
                      <div className="relative h-48">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {!item.available && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-medium px-3 py-1 rounded-full bg-red-500/80">
                              Unavailable
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800">
                          {item.name}
                        </h3>
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                          ₹{item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                      <Button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.available}
                        className="w-full"
                        variant="default"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Tables } from '@/integrations/supabase/types';
import { Loader2 } from "lucide-react";

type MenuItem = Tables<'menu_items'>;

const Menu = () => {
  const { addItem } = useCart();
  
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const categories = Array.from(new Set(menuItems?.map(item => item.category)));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Our Menu</h1>
      
      {categories.map(category => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-left">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems
              ?.filter(item => item.category === category)
              .map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold">₹{item.price.toFixed(2)}</span>
                    <Button
                      onClick={() => addItem(item)}
                      disabled={!item.available}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
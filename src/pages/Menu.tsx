
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Tables } from '@/integrations/supabase/types';
import { Loader2, ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

type MenuItem = Tables<'menu_items'>;

const Menu = () => {
  const { addItem } = useCart();
  const { toast } = useToast();
  
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const categories = Array.from(new Set(menuItems?.map(item => item.category)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <div className="pt-6 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Our Menu</h1>
        
        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 px-2">
                {category}
              </h2>
              
              <div className="relative">
                <div className="overflow-x-auto scrollbar-none">
                  <div className="flex space-x-6 px-4 pb-4">
                    {menuItems
                      ?.filter(item => item.category === category)
                      .map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative flex-none w-36"
                        >
                          <div 
                            className="relative group"
                            onClick={() => handleAddToCart(item)}
                          >
                            {item.image_url && (
                              <div className="relative w-36 h-36 mb-3">
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-full h-full object-cover rounded-full shadow-md transform transition-transform group-hover:scale-105"
                                />
                                {!item.available && (
                                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium px-3 py-1 rounded-full bg-red-500/90">
                                      Unavailable
                                    </span>
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white hover:text-primary hover:bg-white transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddToCart(item);
                                    }}
                                    disabled={!item.available}
                                  >
                                    <ShoppingCart className="h-6 w-6" />
                                  </Button>
                                </div>
                              </div>
                            )}
                            
                            <div className="text-center space-y-1">
                              <h3 className="font-medium text-gray-800 group-hover:text-primary transition-colors">
                                {item.name}
                              </h3>
                              <p className="text-primary font-semibold">
                                ₹{item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
                
                {/* Show a peek of the next item */}
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;

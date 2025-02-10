
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Tables } from '@/integrations/supabase/types';
import { Loader2, ShoppingCart, ChefHat, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-50 to-orange-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Menu
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Discover our delicious offerings crafted with love
          </p>
          <div className="absolute bottom-0 right-0 opacity-10">
            <ChefHat size={120} />
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {categories.map((category, categoryIndex) => (
          <div key={category} className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-primary pb-2">
                {category}
              </h2>
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems
                ?.filter(item => item.category === category)
                .map((item, itemIndex) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: itemIndex * 0.1 }}
                    key={item.id}
                    className="group relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    {item.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        {!item.available && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                            <span className="text-white font-medium px-4 py-2 rounded-full bg-red-500/90 backdrop-blur-sm">
                              Currently Unavailable
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
                          ₹{item.price.toFixed(2)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <Button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.available}
                        className="w-full bg-primary hover:bg-primary/90 text-white transition-colors group"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        Add to Cart
                      </Button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;

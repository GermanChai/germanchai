
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Tables } from '@/integrations/supabase/types';
import { Loader2, ShoppingCart, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";

type MenuItem = Tables<'menu_items'>;

const Menu = () => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
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

  const filteredMenuItems = menuItems?.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const categories = Array.from(new Set(filteredMenuItems?.map(item => item.category)));

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="pt-6 px-4 pb-4">
          {/* Title with enhanced styling */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            What would you like{"\n"}to eat?
          </h1>
          
          {/* Uber Eats style search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search for food or cuisines"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>
      </div>
      
      {/* Categories and Menu Items */}
      <div className="px-4 space-y-8">
        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 sticky top-28 bg-white py-2 z-10">
              {category}
            </h2>
            
            {/* Grid layout for menu items */}
            <div className="grid grid-cols-2 gap-4">
              {filteredMenuItems
                ?.filter(item => item.category === category)
                .map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                    onClick={() => handleAddToCart(item)}
                  >
                    <div className="relative group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                      {item.image_url && (
                        <div className="relative h-36">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          {!item.available && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                              <span className="text-white text-sm font-medium px-3 py-1 rounded-full bg-red-500/90">
                                Unavailable
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="p-3">
                        <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-primary font-semibold mt-1">
                          ₹{item.price.toFixed(2)}
                        </p>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-2 hover:bg-primary/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          disabled={!item.available}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to cart
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
};

export default Menu;

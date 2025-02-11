
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
      <div className="flex justify-center items-center min-h-screen bg-[#DDEB9D]">
        <Loader2 className="h-8 w-8 animate-spin text-[#27667B]" />
      </div>
    );
  }

  const categories = Array.from(new Set(filteredMenuItems?.map(item => item.category)));

  return (
    <div className="min-h-screen bg-[#DDEB9D] pb-24">
      <div className="sticky top-0 z-10 bg-[#DDEB9D] shadow-sm">
        <div className="pt-6 px-4 pb-4 max-w-7xl mx-auto">
          {/* Enhanced Title */}
          <h1 className="text-[32px] font-bold text-[#143D60] mb-6 leading-tight">
            What would you like{"\n"}to eat today?
          </h1>
          
          {/* Search Bar with Enhanced Styling */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search menu items"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#A0C878] rounded-full 
                         shadow-sm focus:outline-none focus:ring-2 focus:ring-[#27667B] focus:border-transparent 
                         text-[#143D60] placeholder-[#27667B]/50 text-base"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#27667B] h-5 w-5" />
          </div>
        </div>
      </div>
      
      {/* Categories and Menu Items with Enhanced Styling */}
      <div className="px-4 space-y-8 max-w-7xl mx-auto">
        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-bold text-[#143D60] sticky top-28 bg-[#DDEB9D] py-2 z-10">
              {category}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenuItems
                ?.filter(item => item.category === category)
                .map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => handleAddToCart(item)}
                  >
                    <div className="bg-white rounded-xl shadow-sm border border-[#A0C878] overflow-hidden 
                                  hover:shadow-md transition-all duration-300 hover:border-[#27667B]">
                      {item.image_url && (
                        <div className="relative h-48 w-full">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          {!item.available && (
                            <div className="absolute inset-0 bg-[#143D60]/60 backdrop-blur-sm flex items-center justify-center">
                              <span className="text-white text-sm font-medium px-3 py-1 rounded-full bg-red-500/90">
                                Unavailable
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-[#143D60] group-hover:text-[#27667B] 
                                       transition-colors line-clamp-2 flex-1 text-lg">
                            {item.name}
                          </h3>
                          <span className="text-[#27667B] font-bold ml-2">
                            ₹{item.price.toFixed(2)}
                          </span>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 border-[#27667B] text-[#27667B] hover:bg-[#27667B] hover:text-white
                                   transition-colors duration-300"
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

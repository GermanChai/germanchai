
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Tables } from '@/integrations/supabase/types';
import { Loader2, ShoppingCart, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import BottomNav from "@/components/BottomNav";
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
    <>
      <div className="container mx-auto px-4 py-8 pb-24 min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 text-gray-800 hover:text-primary transition-colors duration-300">
            Our Menu
          </h1>
          <p className="text-gray-600 animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
            Discover our delicious offerings
          </p>
        </div>
        
        <div className="space-y-12">
          {categories.map((category, categoryIndex) => (
            <div 
              key={category} 
              className="animate-fade-in opacity-0"
              style={{ animationDelay: `${categoryIndex * 0.1}s` }}
            >
              <div className="flex items-center gap-2 mb-6 group">
                <Sparkles className="h-6 w-6 text-primary transform group-hover:rotate-12 transition-transform duration-300" />
                <h2 className="text-2xl font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300">
                  {category}
                </h2>
              </div>
              
              <div className="relative">
                <div className="overflow-x-auto pb-4 hide-scrollbar">
                  <div className="flex gap-6 min-w-full">
                    {filteredItems
                      ?.filter(item => item.category === category)
                      .map((item, index) => (
                        <div 
                          key={item.id} 
                          className="w-[300px] flex-shrink-0 group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden transform hover:-translate-y-1 animate-fade-in opacity-0"
                          style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                        >
                          {item.image_url && (
                            <div className="relative overflow-hidden h-48">
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                              />
                              {!item.available && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
                                  <span className="text-white font-semibold px-4 py-2 rounded-full bg-red-500/80 animate-pulse">
                                    Currently Unavailable
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300">
                                {item.name}
                              </h3>
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold transform group-hover:scale-105 transition-transform duration-300">
                                ₹{item.price.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                            <Button
                              onClick={() => handleAddToCart(item)}
                              disabled={!item.available}
                              className="w-full group-hover:bg-primary/90 transition-colors duration-300 transform active:scale-95"
                            >
                              <ShoppingCart className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav onSearch={setSearchQuery} />
    </>
  );
};

export default Menu;

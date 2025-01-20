import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, Plus } from 'lucide-react';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  // Mock item data (replace with actual data fetching)
  const item = {
    id,
    name: 'Sample Item',
    description: 'A delicious sample item that everyone loves.',
    price: 12.99,
    preparationTime: '20 mins',
    image: '/placeholder.svg',
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    navigate('/cart');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-[300px] object-cover rounded-lg"
        />

        <div>
          <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
          <p className="text-gray-600 mb-4">{item.description}</p>
          
          <div className="mb-6">
            <p className="text-2xl font-bold text-primary">${item.price}</p>
            <p className="text-gray-500">Preparation time: {item.preparationTime}</p>
          </div>

          <div className="flex items-center mb-6">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="mx-4 text-xl font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full"
          >
            Add to Cart - ${(item.price * quantity).toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems] = useState([
    {
      id: 1,
      name: 'Sample Item 1',
      price: 12.99,
      quantity: 2,
      image: '/placeholder.svg',
    },
  ]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Button
            onClick={() => navigate('/')}
          >
            Browse Menu
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {cartItems.map(item => (
            <div
              key={item.id}
              className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-primary">${item.price}</p>
                
                <div className="flex items-center mt-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button className="p-2 hover:bg-gray-100 rounded">
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ))}

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between mb-4">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Delivery Fee</span>
              <span>$2.00</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${(total + 2).toFixed(2)}</span>
            </div>

            <Button
              className="w-full mt-6"
              onClick={() => {
                // Handle checkout
              }}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
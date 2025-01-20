import { useState } from 'react';

const Orders = () => {
  const [orders] = useState([
    {
      id: 1,
      date: '2024-03-20',
      status: 'Delivered',
      items: [
        { name: 'Sample Item 1', quantity: 2, price: 12.99 },
      ],
      total: 27.98,
    },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      <div className="space-y-6">
        {orders.map(order => (
          <div
            key={order.id}
            className="bg-white p-6 rounded-lg shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Order #{order.id}</p>
                <p className="text-sm text-gray-500">{order.date}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {order.status}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between mb-2">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
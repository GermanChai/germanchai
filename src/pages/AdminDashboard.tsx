import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const [orders] = useState([
    {
      id: 1,
      customerName: 'John Doe',
      items: ['2x Burger', '1x Fries'],
      total: 25.98,
      status: 'Pending',
    },
  ]);

  const [menuItems] = useState([
    {
      id: 1,
      name: 'Burger',
      price: 9.99,
      category: 'Main Course',
    },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button>
          <Plus className="w-5 h-5 mr-2" />
          Add New Item
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Orders Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white p-4 rounded-lg shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-gray-500">Order #{order.id}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {order.items.map((item, index) => (
                    <p key={index}>{item}</p>
                  ))}
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="font-medium">${order.total}</span>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Accept
                    </Button>
                    <Button variant="outline" size="sm">
                      Complete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Items Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Menu Items</h2>
          <div className="space-y-4">
            {menuItems.map(item => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="text-primary font-medium">${item.price}</p>
                </div>
                <div className="space-x-2">
                  <Button variant="ghost" size="icon">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
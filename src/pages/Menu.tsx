import { useState } from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  const [categories] = useState([
    { id: 1, name: 'Starters' },
    { id: 2, name: 'Main Course' },
    { id: 3, name: 'Desserts' },
    { id: 4, name: 'Beverages' },
  ]);

  const [items] = useState([
    { id: 1, name: 'Spring Rolls', price: 8.99, category: 1, image: '/placeholder.svg' },
    { id: 2, name: 'Butter Chicken', price: 15.99, category: 2, image: '/placeholder.svg' },
    { id: 3, name: 'Chocolate Cake', price: 6.99, category: 3, image: '/placeholder.svg' },
    { id: 4, name: 'Mango Lassi', price: 4.99, category: 4, image: '/placeholder.svg' },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Menu</h1>
      
      {categories.map(category => (
        <div key={category.id} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items
              .filter(item => item.category === category.id)
              .map(item => (
                <Link
                  key={item.id}
                  to={`/item/${item.id}`}
                  className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-primary font-medium">${item.price}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
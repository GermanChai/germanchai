import { Button } from "@/components/ui/button";

const Menu = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Our Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold">Menu Coming Soon</h2>
          <p className="text-gray-600 mt-2">Our delicious menu is being prepared.</p>
        </div>
      </div>
    </div>
  );
};

export default Menu;
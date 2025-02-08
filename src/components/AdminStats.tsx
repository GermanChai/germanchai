
import { IndianRupee, Package } from "lucide-react";

interface AdminStatsProps {
  totalEarnings: number;
  totalOrders: number;
}

const AdminStats = ({ totalEarnings, totalOrders }: AdminStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <div className="flex items-center gap-2 text-primary">
          <IndianRupee className="h-5 w-5" />
          <h2 className="font-semibold">Total Earnings</h2>
        </div>
        <p className="text-2xl font-bold mt-2">₹{totalEarnings.toFixed(2)}</p>
      </div>
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <div className="flex items-center gap-2 text-primary">
          <Package className="h-5 w-5" />
          <h2 className="font-semibold">Total Orders</h2>
        </div>
        <p className="text-2xl font-bold mt-2">{totalOrders}</p>
      </div>
    </div>
  );
};

export default AdminStats;

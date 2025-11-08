import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pill, AlertTriangle, Package, DollarSign } from "lucide-react";

export default function PharmacyStats({ medicines, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  const totalMedicines = medicines.length;
  const lowStock = medicines.filter(m => m.stock_quantity <= m.minimum_stock && m.status !== 'out_of_stock').length;
  const outOfStock = medicines.filter(m => m.status === 'out_of_stock').length;
  const expired = medicines.filter(m => {
    if (!m.expiry_date) return false;
    return new Date(m.expiry_date) < new Date();
  }).length;
  const totalValue = medicines.reduce((sum, m) => sum + (m.stock_quantity * m.unit_price || 0), 0);

  const stats = [
    {
      title: "Total Medicines",
      value: totalMedicines,
      icon: Pill,
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      title: "Low Stock",
      value: lowStock,
      icon: AlertTriangle,
      color: "yellow",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600"
    },
    {
      title: "Out of Stock",
      value: outOfStock,
      icon: Package,
      color: "red",
      bgColor: "bg-red-100",
      textColor: "text-red-600"
    },
    {
      title: "Inventory Value",
      value: `₹${totalValue.toFixed(0)}`,
      icon: DollarSign,
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, idx) => (
        <Card key={idx} className="p-6 bg-white shadow-lg border-slate-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
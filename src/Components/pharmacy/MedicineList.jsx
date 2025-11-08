import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, Building2, AlertTriangle, Calendar, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, differenceInDays } from "date-fns";

const categoryColors = {
  antibiotic: "bg-purple-100 text-purple-700",
  painkiller: "bg-blue-100 text-blue-700",
  antipyretic: "bg-green-100 text-green-700",
  antihistamine: "bg-yellow-100 text-yellow-700",
  antacid: "bg-pink-100 text-pink-700",
  vitamin: "bg-orange-100 text-orange-700",
  cardiac: "bg-red-100 text-red-700",
  diabetic: "bg-indigo-100 text-indigo-700",
  respiratory: "bg-teal-100 text-teal-700",
  dermatology: "bg-cyan-100 text-cyan-700",
  other: "bg-slate-100 text-slate-700"
};

const statusColors = {
  available: "bg-green-100 text-green-700 border-green-200",
  low_stock: "bg-yellow-100 text-yellow-700 border-yellow-200",
  out_of_stock: "bg-red-100 text-red-700 border-red-200",
  expired: "bg-orange-100 text-orange-700 border-orange-200",
  discontinued: "bg-slate-100 text-slate-700 border-slate-200"
};

export default function MedicineList({ medicines, loading, onSelect, selectedId }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (medicines.length === 0) {
    return (
      <Card className="p-12 text-center bg-white shadow-lg border-slate-200">
        <Pill className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Medicines Found</h3>
        <p className="text-slate-500">Add medicines to your pharmacy inventory</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {medicines.map((medicine) => {
        const stockPercentage = (medicine.stock_quantity / (medicine.minimum_stock * 3)) * 100;
        const daysToExpiry = medicine.expiry_date ? differenceInDays(new Date(medicine.expiry_date), new Date()) : null;
        const isExpiringSoon = daysToExpiry !== null && daysToExpiry <= 30 && daysToExpiry > 0;

        return (
          <Card
            key={medicine.id}
            onClick={() => onSelect(medicine)}
            className={`p-6 cursor-pointer transition-all duration-200 bg-white border-2 hover:shadow-xl ${
              selectedId === medicine.id 
                ? 'border-pink-500 shadow-lg' 
                : 'border-slate-200 hover:border-pink-300'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Pill className="w-7 h-7 text-pink-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{medicine.name}</h3>
                  {medicine.generic_name && (
                    <p className="text-sm text-slate-500 mb-2">{medicine.generic_name}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Badge className={categoryColors[medicine.category]}>
                      {medicine.category}
                    </Badge>
                    <Badge variant="outline" className="bg-slate-50">
                      {medicine.form}
                    </Badge>
                    {medicine.strength && (
                      <Badge variant="outline" className="bg-slate-50">
                        {medicine.strength}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Badge className={statusColors[medicine.status] + " border"}>
                  {medicine.status.replace(/_/g, ' ')}
                </Badge>
                {medicine.prescription_required && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 text-xs">
                    Rx Required
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">In Stock</p>
                <p className="text-lg font-bold text-slate-900">{medicine.stock_quantity}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">Min. Stock</p>
                <p className="text-lg font-bold text-slate-900">{medicine.minimum_stock}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">Unit Price</p>
                <p className="text-lg font-bold text-slate-900">₹{medicine.unit_price || 0}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">Total Value</p>
                <p className="text-lg font-bold text-slate-900">
                  ₹{((medicine.stock_quantity || 0) * (medicine.unit_price || 0)).toFixed(0)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {medicine.hospital_name && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Building2 className="w-4 h-4" />
                  <span>{medicine.hospital_name}</span>
                </div>
              )}
              
              {medicine.expiry_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-slate-600" />
                  <span className={isExpiringSoon ? 'text-orange-600 font-medium' : 'text-slate-600'}>
                    Expires: {format(new Date(medicine.expiry_date), "MMM d, yyyy")}
                    {isExpiringSoon && ` (${daysToExpiry} days left)`}
                  </span>
                  {isExpiringSoon && <AlertTriangle className="w-4 h-4 text-orange-600" />}
                </div>
              )}

              {medicine.manufacturer && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Package className="w-4 h-4" />
                  <span>Mfg: {medicine.manufacturer}</span>
                </div>
              )}
            </div>

            {(medicine.stock_quantity <= medicine.minimum_stock || isExpiringSoon) && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-orange-700 font-medium">
                    {medicine.stock_quantity <= medicine.minimum_stock && "Low stock alert"}
                    {medicine.stock_quantity <= medicine.minimum_stock && isExpiringSoon && " • "}
                    {isExpiringSoon && "Expiring soon"}
                  </span>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
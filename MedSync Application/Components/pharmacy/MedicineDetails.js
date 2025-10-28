import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Edit, Building2, Package, Calendar, AlertTriangle, DollarSign } from "lucide-react";
import { format, differenceInDays } from "date-fns";

const categoryColors = {
  antibiotic: "bg-purple-100 text-purple-700 border-purple-200",
  painkiller: "bg-blue-100 text-blue-700 border-blue-200",
  antipyretic: "bg-green-100 text-green-700 border-green-200",
  antihistamine: "bg-yellow-100 text-yellow-700 border-yellow-200",
  antacid: "bg-pink-100 text-pink-700 border-pink-200",
  vitamin: "bg-orange-100 text-orange-700 border-orange-200",
  cardiac: "bg-red-100 text-red-700 border-red-200",
  diabetic: "bg-indigo-100 text-indigo-700 border-indigo-200",
  respiratory: "bg-teal-100 text-teal-700 border-teal-200",
  dermatology: "bg-cyan-100 text-cyan-700 border-cyan-200",
  other: "bg-slate-100 text-slate-700 border-slate-200"
};

export default function MedicineDetails({ medicine, onEdit, onClose }) {
  const daysToExpiry = medicine.expiry_date ? differenceInDays(new Date(medicine.expiry_date), new Date()) : null;
  const isExpiringSoon = daysToExpiry !== null && daysToExpiry <= 30 && daysToExpiry > 0;
  const isExpired = daysToExpiry !== null && daysToExpiry < 0;

  return (
    <Card className="bg-white shadow-lg border-slate-200 sticky top-4">
      <CardHeader className="border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Medicine Details</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">{medicine.name}</h3>
          {medicine.generic_name && (
            <p className="text-slate-500 mb-3">{medicine.generic_name}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <Badge className={categoryColors[medicine.category] + " border"}>
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
            {medicine.prescription_required && (
              <Badge className="bg-red-100 text-red-700 border-red-200 border">
                Rx Required
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-600 font-medium mb-1">In Stock</p>
            <p className="text-2xl font-bold text-slate-900">{medicine.stock_quantity}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-xs text-orange-600 font-medium mb-1">Min. Stock</p>
            <p className="text-2xl font-bold text-slate-900">{medicine.minimum_stock}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-green-600 font-medium mb-1">Unit Price</p>
            <p className="text-2xl font-bold text-slate-900">₹{medicine.unit_price || 0}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-xs text-purple-600 font-medium mb-1">Total Value</p>
            <p className="text-2xl font-bold text-slate-900">
              ₹{((medicine.stock_quantity || 0) * (medicine.unit_price || 0)).toFixed(0)}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-200">
          {medicine.hospital_name && (
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500">Hospital/Pharmacy</p>
                <p className="text-slate-900">{medicine.hospital_name}</p>
              </div>
            </div>
          )}

          {medicine.manufacturer && (
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500">Manufacturer</p>
                <p className="text-slate-900">{medicine.manufacturer}</p>
              </div>
            </div>
          )}

          {medicine.supplier && (
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500">Supplier</p>
                <p className="text-slate-900">{medicine.supplier}</p>
              </div>
            </div>
          )}

          {medicine.batch_number && (
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500">Batch Number</p>
                <p className="text-slate-900">{medicine.batch_number}</p>
              </div>
            </div>
          )}

          {medicine.expiry_date && (
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500">Expiry Date</p>
                <p className={`${isExpired ? 'text-red-700 font-medium' : isExpiringSoon ? 'text-orange-700 font-medium' : 'text-slate-900'}`}>
                  {format(new Date(medicine.expiry_date), "MMMM d, yyyy")}
                  {daysToExpiry !== null && (
                    <span className="ml-2">
                      ({daysToExpiry > 0 ? `${daysToExpiry} days left` : 'Expired'})
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {medicine.storage_instructions && (
          <div className="pt-4 border-t border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2">Storage Instructions</h4>
            <p className="text-slate-700">{medicine.storage_instructions}</p>
          </div>
        )}

        {medicine.notes && (
          <div className="pt-4 border-t border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2">Notes</h4>
            <p className="text-slate-700">{medicine.notes}</p>
          </div>
        )}

        {(medicine.stock_quantity <= medicine.minimum_stock || isExpiringSoon || isExpired) && (
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-900">Alerts</p>
                <ul className="text-sm text-orange-700 mt-1 space-y-1">
                  {medicine.stock_quantity <= medicine.minimum_stock && (
                    <li>• Stock level is below minimum threshold</li>
                  )}
                  {isExpiringSoon && (
                    <li>• Medicine expiring in {daysToExpiry} days</li>
                  )}
                  {isExpired && (
                    <li>• Medicine has expired</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={() => onEdit(medicine)} 
          className="w-full bg-gradient-to-r from-pink-600 to-pink-700"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Medicine
        </Button>
      </CardContent>
    </Card>
  );
}
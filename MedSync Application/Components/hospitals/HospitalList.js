import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Bed, Phone, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HospitalList({ hospitals, loading, onSelect, selectedId }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (hospitals.length === 0) {
    return (
      <Card className="p-12 text-center bg-white shadow-lg border-slate-200">
        <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Hospitals Yet</h3>
        <p className="text-slate-500">Add your first hospital to get started</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {hospitals.map((hospital) => {
        const occupancyRate = hospital.total_beds > 0 
          ? ((hospital.total_beds - hospital.available_beds) / hospital.total_beds) * 100 
          : 0;

        return (
          <Card
            key={hospital.id}
            onClick={() => onSelect(hospital)}
            className={`p-6 cursor-pointer transition-all duration-200 bg-white border-2 hover:shadow-xl ${
              selectedId === hospital.id 
                ? 'border-blue-500 shadow-lg' 
                : 'border-slate-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{hospital.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{hospital.city}</span>
                  </div>
                  {hospital.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-slate-700">{hospital.rating}/5</span>
                    </div>
                  )}
                </div>
              </div>
              <Badge
                className={
                  hospital.status === 'active'
                    ? 'bg-green-100 text-green-700 border-green-200 border'
                    : 'bg-slate-100 text-slate-700 border-slate-200 border'
                }
              >
                {hospital.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Bed className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-blue-600 font-medium">Total Beds</span>
                </div>
                <p className="text-xl font-bold text-slate-900">{hospital.total_beds}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Bed className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">Available</span>
                </div>
                <p className="text-xl font-bold text-slate-900">{hospital.available_beds}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <span className="text-xs text-purple-600 font-medium block mb-1">ICU Beds</span>
                <p className="text-xl font-bold text-slate-900">
                  {hospital.icu_beds_available || 0}/{hospital.icu_beds_total || 0}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <span className="text-xs text-orange-600 font-medium block mb-1">Occupancy</span>
                <p className="text-xl font-bold text-slate-900">{occupancyRate.toFixed(0)}%</p>
              </div>
            </div>

            {hospital.specialties && hospital.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {hospital.specialties.slice(0, 4).map((specialty, idx) => (
                  <Badge key={idx} variant="outline" className="bg-slate-50">
                    {specialty}
                  </Badge>
                ))}
                {hospital.specialties.length > 4 && (
                  <Badge variant="outline" className="bg-slate-50">
                    +{hospital.specialties.length - 4} more
                  </Badge>
                )}
              </div>
            )}

            {hospital.contact_phone && (
              <div className="flex items-center gap-2 text-sm text-slate-600 pt-3 border-t border-slate-200">
                <Phone className="w-4 h-4" />
                <span>{hospital.contact_phone}</span>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
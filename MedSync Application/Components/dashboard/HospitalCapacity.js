import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Bed } from "lucide-react";

export default function HospitalCapacity({ hospitals, loading }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hospitals.length === 0 ? (
        <div className="text-center py-8">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No hospitals registered</p>
        </div>
      ) : (
        hospitals.map((hospital) => {
          const occupancyRate = hospital.total_beds > 0 
            ? ((hospital.total_beds - hospital.available_beds) / hospital.total_beds) * 100 
            : 0;
          
          const getOccupancyColor = () => {
            if (occupancyRate < 50) return "bg-green-500";
            if (occupancyRate < 80) return "bg-yellow-500";
            return "bg-red-500";
          };

          return (
            <div
              key={hospital.id}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{hospital.name}</p>
                    <p className="text-sm text-slate-500">{hospital.city}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{hospital.available_beds}</p>
                  <p className="text-xs text-slate-500">available</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Bed Occupancy</span>
                  <span className="font-semibold text-slate-900">
                    {occupancyRate.toFixed(0)}%
                  </span>
                </div>
                <Progress value={occupancyRate} className="h-2" indicatorClassName={getOccupancyColor()} />
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Total: {hospital.total_beds} beds</span>
                  {hospital.icu_beds_available !== undefined && (
                    <span className="flex items-center gap-1">
                      <Bed className="w-3 h-3" />
                      ICU: {hospital.icu_beds_available}/{hospital.icu_beds_total}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Edit, Building2, MapPin, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

const statusColors = {
  available: "bg-green-100 text-green-700 border-green-200",
  limited: "bg-yellow-100 text-yellow-700 border-yellow-200",
  unavailable: "bg-red-100 text-red-700 border-red-200",
  maintenance: "bg-orange-100 text-orange-700 border-orange-200"
};

const typeColors = {
  medical_equipment: "bg-blue-100 text-blue-700",
  staff: "bg-purple-100 text-purple-700",
  bed: "bg-green-100 text-green-700",
  operation_theater: "bg-indigo-100 text-indigo-700",
  ambulance: "bg-red-100 text-red-700",
  laboratory: "bg-pink-100 text-pink-700",
  other: "bg-slate-100 text-slate-700"
};

export default function ResourceList({ resources, loading, onEdit }) {
  if (loading) {
    return (
      <Card className="bg-white shadow-lg border-slate-200">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (resources.length === 0) {
    return (
      <Card className="bg-white shadow-lg border-slate-200">
        <CardContent className="p-12 text-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Resources</h3>
          <p className="text-slate-500">Add your first resource to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map((resource) => {
        const utilizationRate = resource.total_quantity > 0 
          ? ((resource.total_quantity - resource.available_quantity) / resource.total_quantity) * 100 
          : 0;

        const getUtilizationColor = () => {
          if (utilizationRate < 50) return "bg-green-500";
          if (utilizationRate < 80) return "bg-yellow-500";
          return "bg-red-500";
        };

        return (
          <Card
            key={resource.id}
            className="bg-white border-2 border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all duration-200"
          >
            <CardHeader className="border-b border-slate-200 p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex gap-2">
                  <Badge className={statusColors[resource.status] + " border text-xs"}>
                    {resource.status}
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(resource)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg font-bold text-slate-900">
                {resource.resource_name}
              </CardTitle>
              <Badge className={typeColors[resource.resource_type] + " text-xs w-fit"}>
                {resource.resource_type.replace(/_/g, ' ')}
              </Badge>
            </CardHeader>
            
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Building2 className="w-4 h-4" />
                <span className="truncate">{resource.hospital_name}</span>
              </div>

              {resource.location && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{resource.location}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Utilization</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {utilizationRate.toFixed(0)}%
                  </span>
                </div>
                <Progress value={utilizationRate} className="h-2" indicatorClassName={getUtilizationColor()} />
                <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                  <span>Available: {resource.available_quantity}</span>
                  <span>Total: {resource.total_quantity}</span>
                </div>
                {resource.unit && (
                  <p className="text-xs text-slate-500 text-center mt-1">Unit: {resource.unit}</p>
                )}
              </div>

              {resource.last_maintenance && (
                <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-200">
                  <Calendar className="w-3 h-3" />
                  <span>Last maintenance: {format(new Date(resource.last_maintenance), "MMM d, yyyy")}</span>
                </div>
              )}

              {resource.notes && (
                <p className="text-xs text-slate-600 pt-2 border-t border-slate-200">
                  {resource.notes}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
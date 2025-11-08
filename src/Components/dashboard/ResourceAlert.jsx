import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResourceAlerts({ resources, loading }) {
  const criticalResources = resources.filter(r => {
    const utilizationRate = r.total_quantity > 0 
      ? (r.available_quantity / r.total_quantity) * 100 
      : 0;
    return utilizationRate < 20 || r.status === 'unavailable';
  });

  if (loading) {
    return (
      <Card className="bg-white shadow-lg border-slate-200">
        <CardHeader className="border-b border-slate-200">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="p-6">
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (criticalResources.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white shadow-lg border-red-200 border-2">
      <CardHeader className="border-b border-red-200 p-6 bg-red-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">Resource Alerts</CardTitle>
            <p className="text-sm text-red-600">{criticalResources.length} critical items requiring attention</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {criticalResources.map((resource) => {
            const utilizationRate = resource.total_quantity > 0 
              ? ((resource.total_quantity - resource.available_quantity) / resource.total_quantity) * 100 
              : 0;

            return (
              <div
                key={resource.id}
                className="p-4 rounded-xl border-2 border-red-200 bg-red-50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-red-600" />
                    <p className="font-semibold text-slate-900">{resource.resource_name}</p>
                  </div>
                  <Badge className="bg-red-100 text-red-700 border-red-200 border">
                    Critical
                  </Badge>
                </div>
                
                <p className="text-sm text-slate-600 mb-2">{resource.hospital_name}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Available</span>
                  <span className="font-bold text-red-700">
                    {resource.available_quantity} / {resource.total_quantity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
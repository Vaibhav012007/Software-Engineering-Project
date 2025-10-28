import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

const colorClasses = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    gradient: "from-blue-600 to-blue-700"
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
    gradient: "from-green-600 to-green-700"
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    gradient: "from-purple-600 to-purple-700"
  },
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-600",
    gradient: "from-orange-600 to-orange-700"
  }
};

export default function StatsCard({ title, value, icon: Icon, color = "blue", trend, loading }) {
  const colors = colorClasses[color];

  if (loading) {
    return (
      <Card className="p-6 border-slate-200 bg-white shadow-lg">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-10 w-20 mb-3" />
        <Skeleton className="h-4 w-24" />
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-slate-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.gradient} opacity-5 rounded-full transform translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform duration-300`} />
      
      <div className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
          </div>
          <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${colors.text}`} />
          </div>
        </div>
        
        {trend && (
          <div className="flex items-center gap-1.5 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-slate-600">{trend}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
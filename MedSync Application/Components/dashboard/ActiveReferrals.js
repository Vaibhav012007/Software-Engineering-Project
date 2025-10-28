import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const priorityColors = {
  low: "bg-blue-100 text-blue-700 border-blue-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  critical: "bg-red-100 text-red-700 border-red-200"
};

export default function ActiveReferrals({ referrals, loading }) {
  if (loading) {
    return (
      <Card className="bg-white shadow-lg border-slate-200">
        <CardHeader className="border-b border-slate-200">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg border-slate-200">
      <CardHeader className="border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">Active Referrals</CardTitle>
              <p className="text-sm text-slate-500">Pending transfers</p>
            </div>
          </div>
          <Link to={createPageUrl("Referrals")}>
            <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">
              View All
            </Badge>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {referrals.length === 0 ? (
            <div className="text-center py-8">
              <ArrowLeftRight className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No active referrals</p>
            </div>
          ) : (
            referrals.slice(0, 5).map((referral) => (
              <div
                key={referral.id}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  referral.priority === 'critical' 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-slate-200 bg-slate-50 hover:border-orange-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-slate-900">{referral.patient_name}</p>
                    <p className="text-sm text-slate-500">{referral.department_needed}</p>
                  </div>
                  <Badge className={priorityColors[referral.priority] + " border"}>
                    {referral.priority}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">From</p>
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {referral.from_hospital_name}
                      </p>
                    </div>
                    <ArrowLeftRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-1">To</p>
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {referral.to_hospital_name}
                      </p>
                    </div>
                  </div>

                  {referral.priority === 'critical' && (
                    <div className="flex items-center gap-2 pt-2 border-t border-red-200">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-xs text-red-700 font-medium">Immediate attention required</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
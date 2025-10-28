import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeftRight, User, AlertTriangle, Calendar, Edit, MoreVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const priorityColors = {
  low: "bg-blue-100 text-blue-700 border-blue-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  critical: "bg-red-100 text-red-700 border-red-200"
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  accepted: "bg-green-100 text-green-700 border-green-200",
  in_transit: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-slate-100 text-slate-700 border-slate-200",
  rejected: "bg-red-100 text-red-700 border-red-200"
};

export default function ReferralList({ 
  referrals, 
  loading, 
  onEdit, 
  onStatusChange,
  filterStatus,
  onFilterChange 
}) {
  if (loading) {
    return (
      <Card className="bg-white shadow-lg border-slate-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-48 w-full" />
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
          <CardTitle className="text-xl font-bold">All Referrals</CardTitle>
          <Tabs value={filterStatus} onValueChange={onFilterChange}>
            <TabsList className="bg-slate-100">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="in_transit">In Transit</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {referrals.length === 0 ? (
          <div className="text-center py-12">
            <ArrowLeftRight className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Referrals</h3>
            <p className="text-slate-500">Create your first referral to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                  referral.priority === 'critical' 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-slate-200 bg-slate-50 hover:border-orange-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                      <User className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{referral.patient_name}</h3>
                      <p className="text-slate-600">{referral.department_needed}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={priorityColors[referral.priority] + " border"}>
                      {referral.priority}
                    </Badge>
                    <Badge className={statusColors[referral.status] + " border"}>
                      {referral.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(referral)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(referral, 'accepted')}>
                          Accept
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(referral, 'in_transit')}>
                          Mark In Transit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(referral, 'completed')}>
                          Mark Complete
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(referral, 'rejected')}>
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">From</p>
                    <p className="font-medium text-slate-900">{referral.from_hospital_name}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowLeftRight className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">To</p>
                    <p className="font-medium text-slate-900">{referral.to_hospital_name}</p>
                  </div>
                </div>

                {referral.transfer_date && (
                  <div className="flex items-center gap-2 mb-3 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>Transfer Date: {format(new Date(referral.transfer_date), "MMM d, yyyy")}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200">
                  <p className="text-sm text-slate-600 mb-2">
                    <span className="font-medium">Reason:</span> {referral.reason}
                  </p>
                  {referral.required_resources?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {referral.required_resources.map((resource, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {resource}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {referral.priority === 'critical' && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-red-200">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-red-700 font-medium">Critical - Immediate attention required</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
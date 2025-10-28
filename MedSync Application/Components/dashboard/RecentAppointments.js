import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const statusColors = {
  scheduled: "bg-blue-100 text-blue-700 border-blue-200",
  confirmed: "bg-green-100 text-green-700 border-green-200",
  completed: "bg-slate-100 text-slate-700 border-slate-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  no_show: "bg-orange-100 text-orange-700 border-orange-200"
};

const priorityColors = {
  routine: "bg-slate-100 text-slate-700",
  urgent: "bg-orange-100 text-orange-700",
  emergency: "bg-red-100 text-red-700"
};

export default function RecentAppointments({ appointments, loading }) {
  if (loading) {
    return (
      <Card className="bg-white shadow-lg border-slate-200">
        <CardHeader className="border-b border-slate-200">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-24 w-full" />
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
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">Recent Appointments</CardTitle>
              <p className="text-sm text-slate-500">Latest scheduled visits</p>
            </div>
          </div>
          <Link to={createPageUrl("Appointments")}>
            <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">
              View All
            </Badge>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No appointments scheduled</p>
            </div>
          ) : (
            appointments.slice(0, 5).map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-slate-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                      <User className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{appointment.patient_name}</p>
                      <p className="text-sm text-slate-500">{appointment.department}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={statusColors[appointment.status] + " border"}>
                      {appointment.status}
                    </Badge>
                    {appointment.priority !== 'routine' && (
                      <Badge className={priorityColors[appointment.priority]}>
                        {appointment.priority}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building2 className="w-4 h-4" />
                    <span className="truncate">{appointment.hospital_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      {appointment.appointment_date && format(new Date(appointment.appointment_date), "MMM d")}
                      {appointment.appointment_time && `, ${appointment.appointment_time}`}
                    </span>
                  </div>
                </div>
                
                {appointment.doctor_name && (
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <p className="text-sm text-slate-600">
                      Dr. {appointment.doctor_name}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
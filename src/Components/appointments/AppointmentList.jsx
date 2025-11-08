import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, Building2, Edit, MoreVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export default function AppointmentList({ 
  appointments, 
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
            {[1, 2, 3, 4].map(i => (
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
          <CardTitle className="text-xl font-bold">All Appointments</CardTitle>
          <Tabs value={filterStatus} onValueChange={onFilterChange}>
            <TabsList className="bg-slate-100">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Appointments</h3>
            <p className="text-slate-500">Book your first appointment to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-5 rounded-xl border-2 border-slate-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 bg-slate-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                      <User className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{appointment.patient_name}</h3>
                      <p className="text-slate-600">{appointment.department}</p>
                      {appointment.doctor_name && (
                        <p className="text-sm text-slate-500">Dr. {appointment.doctor_name}</p>
                      )}
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(appointment)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(appointment, 'confirmed')}>
                          Confirm
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(appointment, 'completed')}>
                          Mark Complete
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(appointment, 'cancelled')}>
                          Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm truncate">{appointment.hospital_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {appointment.appointment_date && format(new Date(appointment.appointment_date), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{appointment.appointment_time || "Not set"}</span>
                  </div>
                </div>

                {appointment.reason && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Reason:</span> {appointment.reason}
                    </p>
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
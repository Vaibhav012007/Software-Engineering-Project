import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon } from "lucide-react";

import AppointmentList from "../components/appointments/AppointmentList";
import AppointmentForm from "../components/appointments/AppointmentForm";

export default function Appointments() {
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => base44.entities.Appointment.list('-appointment_date'),
    initialData: [],
  });

  const { data: hospitals, isLoading: hospitalsLoading } = useQuery({
    queryKey: ['hospitals'],
    queryFn: () => base44.entities.Hospital.list(),
    initialData: [],
  });

  const { data: patients, isLoading: patientsLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => base44.entities.Patient.list(),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Appointment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setShowForm(false);
      setEditingAppointment(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Appointment.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setShowForm(false);
      setEditingAppointment(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingAppointment) {
      updateMutation.mutate({ id: editingAppointment.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleStatusChange = (appointment, newStatus) => {
    updateMutation.mutate({
      id: appointment.id,
      data: { ...appointment, status: newStatus }
    });
  };

  const filteredAppointments = filterStatus === "all" 
    ? appointments 
    : appointments.filter(a => a.status === filterStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Appointments</h1>
              <p className="text-slate-600 mt-1">Schedule and manage patient visits</p>
            </div>
          </div>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingAppointment(null);
            }}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Book Appointment
          </Button>
        </div>

        {showForm && (
          <div className="mb-6">
            <AppointmentForm
              appointment={editingAppointment}
              hospitals={hospitals}
              patients={patients}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingAppointment(null);
              }}
              loading={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        )}

        <AppointmentList
          appointments={filteredAppointments}
          loading={isLoading}
          onEdit={(apt) => {
            setEditingAppointment(apt);
            setShowForm(true);
          }}
          onStatusChange={handleStatusChange}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />
      </div>
    </div>
  );
}
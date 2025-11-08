import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

import PatientList from "../components/patients/PatientList";
import PatientForm from "../components/patients/PatientForm";
import PatientDetails from "../components/patients/PatientDetails";

export default function Patients() {
  const [showForm, setShowForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);

  const queryClient = useQueryClient();

  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => base44.entities.Patient.list('-created_date'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Patient.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setShowForm(false);
      setEditingPatient(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Patient.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setShowForm(false);
      setEditingPatient(null);
      setSelectedPatient(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingPatient) {
      updateMutation.mutate({ id: editingPatient.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setShowForm(true);
    setSelectedPatient(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Patient Records</h1>
              <p className="text-slate-600 mt-1">Manage patient information and history</p>
            </div>
          </div>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingPatient(null);
              setSelectedPatient(null);
            }}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Patient
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PatientList
              patients={patients}
              loading={isLoading}
              onSelect={setSelectedPatient}
              selectedId={selectedPatient?.id}
            />
          </div>

          <div>
            {showForm ? (
              <PatientForm
                patient={editingPatient}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingPatient(null);
                }}
                loading={createMutation.isPending || updateMutation.isPending}
              />
            ) : selectedPatient ? (
              <PatientDetails
                patient={selectedPatient}
                onEdit={handleEdit}
                onClose={() => setSelectedPatient(null)}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center sticky top-4">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Select a patient to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
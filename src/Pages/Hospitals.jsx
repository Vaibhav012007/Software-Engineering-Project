import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Building2 } from "lucide-react";

import HospitalList from "../components/hospitals/HospitalList";
import HospitalForm from "../components/hospitals/HospitalForm";
import HospitalDetails from "../components/hospitals/HospitalDetails";

export default function Hospitals() {
  const [showForm, setShowForm] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [editingHospital, setEditingHospital] = useState(null);

  const queryClient = useQueryClient();

  const { data: hospitals, isLoading } = useQuery({
    queryKey: ['hospitals'],
    queryFn: () => base44.entities.Hospital.list('-created_date'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Hospital.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitals'] });
      setShowForm(false);
      setEditingHospital(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Hospital.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hospitals'] });
      setShowForm(false);
      setEditingHospital(null);
      setSelectedHospital(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingHospital) {
      updateMutation.mutate({ id: editingHospital.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (hospital) => {
    setEditingHospital(hospital);
    setShowForm(true);
    setSelectedHospital(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Hospital Network</h1>
              <p className="text-slate-600 mt-1">Manage connected healthcare facilities</p>
            </div>
          </div>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingHospital(null);
              setSelectedHospital(null);
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Hospital
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <HospitalList
              hospitals={hospitals}
              loading={isLoading}
              onSelect={setSelectedHospital}
              selectedId={selectedHospital?.id}
            />
          </div>

          <div>
            {showForm ? (
              <HospitalForm
                hospital={editingHospital}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingHospital(null);
                }}
                loading={createMutation.isPending || updateMutation.isPending}
              />
            ) : selectedHospital ? (
              <HospitalDetails
                hospital={selectedHospital}
                onEdit={handleEdit}
                onClose={() => setSelectedHospital(null)}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
                <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Select a hospital to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
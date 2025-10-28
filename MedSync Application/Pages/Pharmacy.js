import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Pill, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

import MedicineList from "../components/pharmacy/MedicineList";
import MedicineForm from "../components/pharmacy/MedicineForm";
import MedicineDetails from "../components/pharmacy/MedicineDetails";
import PharmacyStats from "../components/pharmacy/PharmacyStats";

export default function Pharmacy() {
  const [showForm, setShowForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const queryClient = useQueryClient();

  const { data: medicines, isLoading } = useQuery({
    queryKey: ['medicines'],
    queryFn: () => base44.entities.Medicine.list('-created_date'),
    initialData: [],
  });

  const { data: hospitals } = useQuery({
    queryKey: ['hospitals'],
    queryFn: () => base44.entities.Hospital.list(),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Medicine.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      setShowForm(false);
      setEditingMedicine(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Medicine.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      setShowForm(false);
      setEditingMedicine(null);
      setSelectedMedicine(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingMedicine) {
      updateMutation.mutate({ id: editingMedicine.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setShowForm(true);
    setSelectedMedicine(null);
  };

  const filteredMedicines = medicines.filter(med => {
    const categoryMatch = filterCategory === "all" || med.category === filterCategory;
    const searchMatch = searchQuery === "" || 
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.generic_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl flex items-center justify-center shadow-lg">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Pharmacy Management</h1>
              <p className="text-slate-600 mt-1">Manage medicine inventory and stock</p>
            </div>
          </div>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingMedicine(null);
              setSelectedMedicine(null);
            }}
            className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Medicine
          </Button>
        </div>

        <PharmacyStats medicines={medicines} loading={isLoading} />

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search medicines by name or generic name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white shadow-sm"
              />
            </div>
          </div>
          <Tabs value={filterCategory} onValueChange={setFilterCategory}>
            <TabsList className="bg-white shadow-sm">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="antibiotic">Antibiotic</TabsTrigger>
              <TabsTrigger value="painkiller">Painkiller</TabsTrigger>
              <TabsTrigger value="cardiac">Cardiac</TabsTrigger>
              <TabsTrigger value="diabetic">Diabetic</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MedicineList
              medicines={filteredMedicines}
              loading={isLoading}
              onSelect={setSelectedMedicine}
              selectedId={selectedMedicine?.id}
            />
          </div>

          <div>
            {showForm ? (
              <MedicineForm
                medicine={editingMedicine}
                hospitals={hospitals}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingMedicine(null);
                }}
                loading={createMutation.isPending || updateMutation.isPending}
              />
            ) : selectedMedicine ? (
              <MedicineDetails
                medicine={selectedMedicine}
                onEdit={handleEdit}
                onClose={() => setSelectedMedicine(null)}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center sticky top-4">
                <Pill className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Select a medicine to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
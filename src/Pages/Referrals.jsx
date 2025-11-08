import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeftRight } from "lucide-react";

import ReferralList from "../components/referrals/ReferralList";
import ReferralForm from "../components/referrals/ReferralForm";

export default function Referrals() {
  const [showForm, setShowForm] = useState(false);
  const [editingReferral, setEditingReferral] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const queryClient = useQueryClient();

  const { data: referrals, isLoading } = useQuery({
    queryKey: ['referrals'],
    queryFn: () => base44.entities.Referral.list('-created_date'),
    initialData: [],
  });

  const { data: hospitals } = useQuery({
    queryKey: ['hospitals'],
    queryFn: () => base44.entities.Hospital.list(),
    initialData: [],
  });

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: () => base44.entities.Patient.list(),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Referral.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referrals'] });
      setShowForm(false);
      setEditingReferral(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Referral.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referrals'] });
      setShowForm(false);
      setEditingReferral(null);
    },
  });

  const handleSubmit = (data) => {
    if (editingReferral) {
      updateMutation.mutate({ id: editingReferral.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleStatusChange = (referral, newStatus) => {
    updateMutation.mutate({
      id: referral.id,
      data: { ...referral, status: newStatus }
    });
  };

  const filteredReferrals = filterStatus === "all" 
    ? referrals 
    : referrals.filter(r => r.status === filterStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center shadow-lg">
              <ArrowLeftRight className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Patient Referrals</h1>
              <p className="text-slate-600 mt-1">Transfer patients between facilities</p>
            </div>
          </div>
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingReferral(null);
            }}
            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Referral
          </Button>
        </div>

        {showForm && (
          <div className="mb-6">
            <ReferralForm
              referral={editingReferral}
              hospitals={hospitals}
              patients={patients}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingReferral(null);
              }}
              loading={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        )}

        <ReferralList
          referrals={filteredReferrals}
          loading={isLoading}
          onEdit={(ref) => {
            setEditingReferral(ref);
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
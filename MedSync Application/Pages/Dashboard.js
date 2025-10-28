import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Building2, 
  Users, 
  Calendar, 
  ArrowLeftRight,
  Bed,
  AlertCircle,
  TrendingUp,
  Activity
} from "lucide-react";

import StatsCard from "../components/dashboard/StatsCard";
import RecentAppointments from "../components/dashboard/RecentAppointments";
import HospitalCapacity from "../components/dashboard/HospitalCapacity";
import ActiveReferrals from "../components/dashboard/ActiveReferrals";
import ResourceAlerts from "../components/dashboard/ResourceAlerts";

export default function Dashboard() {
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

  const { data: appointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => base44.entities.Appointment.list('-created_date', 10),
    initialData: [],
  });

  const { data: referrals, isLoading: referralsLoading } = useQuery({
    queryKey: ['referrals'],
    queryFn: () => base44.entities.Referral.list('-created_date'),
    initialData: [],
  });

  const { data: resources, isLoading: resourcesLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: () => base44.entities.Resource.list(),
    initialData: [],
  });

  const totalBeds = hospitals.reduce((sum, h) => sum + (h.total_beds || 0), 0);
  const availableBeds = hospitals.reduce((sum, h) => sum + (h.available_beds || 0), 0);
  const activeReferrals = referrals.filter(r => r.status === 'pending' || r.status === 'accepted').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Healthcare Network Dashboard
            </h1>
            <p className="text-slate-600 mt-2">
              Real-time monitoring across all connected hospitals
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-600 font-medium">System Online</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Connected Hospitals"
            value={hospitals.length}
            icon={Building2}
            color="blue"
            trend="+2 this month"
            loading={hospitalsLoading}
          />
          <StatsCard
            title="Total Patients"
            value={patients.length}
            icon={Users}
            color="green"
            trend="+45 new patients"
            loading={patientsLoading}
          />
          <StatsCard
            title="Today's Appointments"
            value={appointments.length}
            icon={Calendar}
            color="purple"
            trend={`${appointments.filter(a => a.status === 'confirmed').length} confirmed`}
            loading={appointmentsLoading}
          />
          <StatsCard
            title="Active Referrals"
            value={activeReferrals}
            icon={ArrowLeftRight}
            color="orange"
            trend="2 critical"
            loading={referralsLoading}
          />
        </div>

        {/* Bed Capacity Overview */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Bed className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Network Bed Capacity</h2>
                <p className="text-sm text-slate-500">Real-time availability across all hospitals</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-slate-900">{availableBeds}</p>
              <p className="text-sm text-slate-500">of {totalBeds} available</p>
            </div>
          </div>
          <HospitalCapacity hospitals={hospitals} loading={hospitalsLoading} />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Appointments */}
          <div className="lg:col-span-2">
            <RecentAppointments 
              appointments={appointments} 
              loading={appointmentsLoading}
            />
          </div>

          {/* Active Referrals */}
          <div>
            <ActiveReferrals 
              referrals={referrals.filter(r => r.status === 'pending' || r.status === 'accepted')} 
              loading={referralsLoading}
            />
          </div>
        </div>

        {/* Resource Alerts */}
        <ResourceAlerts resources={resources} loading={resourcesLoading} />
      </div>
    </div>
  );
}
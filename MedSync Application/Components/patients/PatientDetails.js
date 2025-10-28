import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Edit, Phone, Mail, MapPin, Heart, AlertTriangle, Activity, FileText, Plus } from "lucide-react";
import PatientReports from "./PatientReports";

export default function PatientDetails({ patient, onEdit, onClose }) {
  const [showReportForm, setShowReportForm] = useState(false);

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ['patient-reports', patient.id],
    queryFn: () => base44.entities.Report.filter({ patient_id: patient.id }, '-report_date'),
    initialData: [],
  });

  return (
    <Card className="bg-white shadow-lg border-slate-200 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <CardHeader className="border-b border-slate-200 p-6 sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Patient Details</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="reports">
              Reports ({reports.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{patient.full_name}</h3>
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  className={
                    patient.status === 'active'
                      ? 'bg-green-100 text-green-700 border-green-200 border'
                      : patient.status === 'admitted'
                      ? 'bg-blue-100 text-blue-700 border-blue-200 border'
                      : 'bg-slate-100 text-slate-700 border-slate-200 border'
                  }
                >
                  {patient.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">Age</p>
                <p className="text-lg font-semibold text-slate-900">{patient.age} years</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">Gender</p>
                <p className="text-lg font-semibold text-slate-900 capitalize">{patient.gender}</p>
              </div>
              {patient.blood_group && (
                <div className="bg-red-50 rounded-lg p-3 col-span-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <p className="text-xs text-red-500 font-medium">Blood Group</p>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{patient.blood_group}</p>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200">
              {patient.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Phone</p>
                    <p className="text-slate-900">{patient.phone}</p>
                  </div>
                </div>
              )}
              {patient.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Email</p>
                    <p className="text-slate-900">{patient.email}</p>
                  </div>
                </div>
              )}
              {patient.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Address</p>
                    <p className="text-slate-900">{patient.address}</p>
                  </div>
                </div>
              )}
            </div>

            {patient.medical_conditions?.length > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <h4 className="font-semibold text-slate-900">Medical Conditions</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {patient.medical_conditions.map((condition, idx) => (
                    <Badge key={idx} variant="outline" className="bg-blue-50">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {patient.allergies?.length > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h4 className="font-semibold text-slate-900">Allergies</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy, idx) => (
                    <Badge key={idx} className="bg-red-100 text-red-700 border-red-200">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={() => onEdit(patient)} 
              className="w-full bg-gradient-to-r from-green-600 to-green-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Patient
            </Button>
          </TabsContent>

          <TabsContent value="reports">
            <PatientReports 
              patient={patient} 
              reports={reports} 
              loading={reportsLoading}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
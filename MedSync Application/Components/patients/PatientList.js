import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, Heart, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PatientList({ patients, loading, onSelect, selectedId }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <Card className="p-12 text-center bg-white shadow-lg border-slate-200">
        <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Patients Yet</h3>
        <p className="text-slate-500">Add your first patient to get started</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <Card
          key={patient.id}
          onClick={() => onSelect(patient)}
          className={`p-6 cursor-pointer transition-all duration-200 bg-white border-2 hover:shadow-xl ${
            selectedId === patient.id 
              ? 'border-green-500 shadow-lg' 
              : 'border-slate-200 hover:border-green-300'
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <User className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{patient.full_name}</h3>
                <div className="flex items-center gap-3 text-sm text-slate-600 mb-2">
                  <span>{patient.age} years</span>
                  <span>•</span>
                  <span className="capitalize">{patient.gender}</span>
                  {patient.blood_group && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-500" />
                        {patient.blood_group}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
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

          <div className="space-y-2 mb-3">
            {patient.phone && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="w-4 h-4" />
                <span>{patient.phone}</span>
              </div>
            )}
            {patient.email && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-4 h-4" />
                <span>{patient.email}</span>
              </div>
            )}
          </div>

          {(patient.medical_conditions?.length > 0 || patient.allergies?.length > 0) && (
            <div className="pt-3 border-t border-slate-200">
              {patient.medical_conditions?.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-slate-500 mb-1">Conditions:</p>
                  <div className="flex flex-wrap gap-1">
                    {patient.medical_conditions.map((condition, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-blue-50">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {patient.allergies?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-red-500 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Allergies:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {patient.allergies.map((allergy, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-red-50 text-red-700">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
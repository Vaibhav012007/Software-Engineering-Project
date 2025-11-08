import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Edit, MapPin, Phone, Mail, Bed, Star, Activity } from "lucide-react";

export default function HospitalDetails({ hospital, onEdit, onClose }) {
  return (
    <Card className="bg-white shadow-lg border-slate-200 sticky top-4">
      <CardHeader className="border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Hospital Details</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">{hospital.name}</h3>
          <div className="flex items-center gap-2 mb-3">
            <Badge
              className={
                hospital.status === 'active'
                  ? 'bg-green-100 text-green-700 border-green-200 border'
                  : 'bg-slate-100 text-slate-700 border-slate-200 border'
              }
            >
              {hospital.status}
            </Badge>
            {hospital.emergency_available && (
              <Badge className="bg-red-100 text-red-700 border-red-200 border">
                <Activity className="w-3 h-3 mr-1" />
                Emergency
              </Badge>
            )}
          </div>
          {hospital.rating && (
            <div className="flex items-center gap-1.5 mb-4">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-semibold text-slate-700">{hospital.rating}/5</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-500">Location</p>
              <p className="text-slate-900">{hospital.location}</p>
              <p className="text-sm text-slate-600">{hospital.city}</p>
            </div>
          </div>

          {hospital.contact_phone && (
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500">Phone</p>
                <p className="text-slate-900">{hospital.contact_phone}</p>
              </div>
            </div>
          )}

          {hospital.contact_email && (
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500">Email</p>
                <p className="text-slate-900">{hospital.contact_email}</p>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-3">Bed Capacity</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Bed className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">Total Beds</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{hospital.total_beds}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Bed className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600 font-medium">Available</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{hospital.available_beds}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <span className="text-xs text-purple-600 font-medium block mb-1">ICU Total</span>
              <p className="text-2xl font-bold text-slate-900">{hospital.icu_beds_total || 0}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <span className="text-xs text-orange-600 font-medium block mb-1">ICU Available</span>
              <p className="text-2xl font-bold text-slate-900">{hospital.icu_beds_available || 0}</p>
            </div>
          </div>
        </div>

        {hospital.specialties && hospital.specialties.length > 0 && (
          <div className="pt-4 border-t border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-3">Specialties</h4>
            <div className="flex flex-wrap gap-2">
              {hospital.specialties.map((specialty, idx) => (
                <Badge key={idx} variant="outline" className="bg-slate-50">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button 
          onClick={() => onEdit(hospital)} 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Hospital
        </Button>
      </CardContent>
    </Card>
  );
}
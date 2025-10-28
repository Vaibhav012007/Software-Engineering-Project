import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ReferralForm({ referral, hospitals, patients, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState(referral || {
    patient_id: "",
    patient_name: "",
    from_hospital_id: "",
    from_hospital_name: "",
    to_hospital_id: "",
    to_hospital_name: "",
    reason: "",
    department_needed: "",
    priority: "medium",
    status: "pending",
    medical_summary: "",
    required_resources: [],
    transfer_date: ""
  });

  const [resourceInput, setResourceInput] = useState("");

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePatientChange = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    handleChange('patient_id', patientId);
    handleChange('patient_name', patient?.full_name || "");
  };

  const handleFromHospitalChange = (hospitalId) => {
    const hospital = hospitals.find(h => h.id === hospitalId);
    handleChange('from_hospital_id', hospitalId);
    handleChange('from_hospital_name', hospital?.name || "");
  };

  const handleToHospitalChange = (hospitalId) => {
    const hospital = hospitals.find(h => h.id === hospitalId);
    handleChange('to_hospital_id', hospitalId);
    handleChange('to_hospital_name', hospital?.name || "");
  };

  const addResource = () => {
    if (resourceInput && !formData.required_resources.includes(resourceInput)) {
      handleChange('required_resources', [...formData.required_resources, resourceInput]);
      setResourceInput("");
    }
  };

  const removeResource = (resource) => {
    handleChange('required_resources', formData.required_resources.filter(r => r !== resource));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="bg-white shadow-lg border-slate-200">
      <CardHeader className="border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">
            {referral ? 'Edit Referral' : 'Create New Referral'}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient *</Label>
              <Select value={formData.patient_id} onValueChange={handlePatientChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department_needed">Department Required *</Label>
              <Input
                id="department_needed"
                value={formData.department_needed}
                onChange={(e) => handleChange('department_needed', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from_hospital">From Hospital *</Label>
              <Select value={formData.from_hospital_id} onValueChange={handleFromHospitalChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select hospital" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals.map(h => (
                    <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to_hospital">To Hospital *</Label>
              <Select value={formData.to_hospital_id} onValueChange={handleToHospitalChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select hospital" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals.filter(h => h.id !== formData.from_hospital_id).map(h => (
                    <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transfer_date">Transfer Date</Label>
              <Input
                id="transfer_date"
                type="date"
                value={formData.transfer_date}
                onChange={(e) => handleChange('transfer_date', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Referral *</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              required
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medical_summary">Medical Summary</Label>
            <Textarea
              id="medical_summary"
              value={formData.medical_summary}
              onChange={(e) => handleChange('medical_summary', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Required Resources</Label>
            <div className="flex gap-2">
              <Input
                value={resourceInput}
                onChange={(e) => setResourceInput(e.target.value)}
                placeholder="e.g., ICU bed, ventilator"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResource())}
              />
              <Button type="button" onClick={addResource} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.required_resources.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.required_resources.map((resource, idx) => (
                  <Badge key={idx} variant="secondary" className="gap-1">
                    {resource}
                    <button type="button" onClick={() => removeResource(resource)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700"
            >
              {loading ? 'Saving...' : referral ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
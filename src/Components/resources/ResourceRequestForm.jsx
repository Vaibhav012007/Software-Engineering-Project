import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ResourceRequestForm({ hospitals, resources, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    requesting_hospital_id: "",
    requesting_hospital_name: "",
    providing_hospital_id: "",
    providing_hospital_name: "",
    resource_id: "",
    resource_name: "",
    resource_type: "",
    quantity_requested: 1,
    urgency: "medium",
    reason: "",
    requested_date: new Date().toISOString().split('T')[0],
    required_by_date: "",
    contact_person: "",
    contact_phone: "",
    status: "pending"
  });

  const [availableResources, setAvailableResources] = useState([]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRequestingHospitalChange = (hospitalId) => {
    const hospital = hospitals.find(h => h.id === hospitalId);
    handleChange('requesting_hospital_id', hospitalId);
    handleChange('requesting_hospital_name', hospital?.name || "");
  };

  const handleProvidingHospitalChange = (hospitalId) => {
    const hospital = hospitals.find(h => h.id === hospitalId);
    handleChange('providing_hospital_id', hospitalId);
    handleChange('providing_hospital_name', hospital?.name || "");
    
    // Filter resources from selected hospital
    const hospitalResources = resources.filter(r => 
      r.hospital_id === hospitalId && 
      r.available_quantity > 0 &&
      r.status === 'available'
    );
    setAvailableResources(hospitalResources);
    
    // Reset resource selection
    handleChange('resource_id', '');
    handleChange('resource_name', '');
    handleChange('resource_type', '');
  };

  const handleResourceChange = (resourceId) => {
    const resource = availableResources.find(r => r.id === resourceId);
    if (resource) {
      handleChange('resource_id', resourceId);
      handleChange('resource_name', resource.resource_name);
      handleChange('resource_type', resource.resource_type);
      // Set max quantity to available
      if (formData.quantity_requested > resource.available_quantity) {
        handleChange('quantity_requested', resource.available_quantity);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const selectedResource = availableResources.find(r => r.id === formData.resource_id);

  return (
    <Card className="bg-white shadow-lg border-slate-200">
      <CardHeader className="border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Request Resource from Another Hospital</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requesting_hospital">Your Hospital *</Label>
              <Select value={formData.requesting_hospital_id} onValueChange={handleRequestingHospitalChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your hospital" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals.map(h => (
                    <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="providing_hospital">Request From Hospital *</Label>
              <Select 
                value={formData.providing_hospital_id} 
                onValueChange={handleProvidingHospitalChange} 
                required
                disabled={!formData.requesting_hospital_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hospital to request from" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals
                    .filter(h => h.id !== formData.requesting_hospital_id)
                    .map(h => (
                      <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.providing_hospital_id && (
            <div className="space-y-2">
              <Label htmlFor="resource">Select Resource *</Label>
              <Select 
                value={formData.resource_id} 
                onValueChange={handleResourceChange} 
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resource" />
                </SelectTrigger>
                <SelectContent>
                  {availableResources.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">
                      No available resources at this hospital
                    </div>
                  ) : (
                    availableResources.map(r => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.resource_name} - Available: {r.available_quantity} {r.unit}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedResource && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900 mb-1">Resource Details</p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                    <div>
                      <span className="font-medium">Type:</span> {selectedResource.resource_type.replace(/_/g, ' ')}
                    </div>
                    <div>
                      <span className="font-medium">Available:</span> {selectedResource.available_quantity} {selectedResource.unit}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {selectedResource.location || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {selectedResource.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity_requested">Quantity Requested *</Label>
              <Input
                id="quantity_requested"
                type="number"
                min="1"
                max={selectedResource?.available_quantity || 999999}
                value={formData.quantity_requested}
                onChange={(e) => handleChange('quantity_requested', parseInt(e.target.value))}
                required
                disabled={!selectedResource}
              />
              {selectedResource && (
                <p className="text-xs text-slate-500">Max: {selectedResource.available_quantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency *</Label>
              <Select value={formData.urgency} onValueChange={(value) => handleChange('urgency', value)}>
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
              <Label htmlFor="required_by_date">Required By</Label>
              <Input
                id="required_by_date"
                type="date"
                value={formData.required_by_date}
                onChange={(e) => handleChange('required_by_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Request *</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              required
              rows={3}
              placeholder="Explain why you need this resource..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => handleChange('contact_person', e.target.value)}
                placeholder="Name of contact person"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                placeholder="Phone number"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !selectedResource}
              className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

export default function ResourceForm({ resource, hospitals, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState(resource || {
    hospital_id: "",
    hospital_name: "",
    resource_name: "",
    resource_type: "medical_equipment",
    total_quantity: 0,
    available_quantity: 0,
    unit: "",
    status: "available",
    location: "",
    last_maintenance: "",
    notes: ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleHospitalChange = (hospitalId) => {
    const hospital = hospitals.find(h => h.id === hospitalId);
    handleChange('hospital_id', hospitalId);
    handleChange('hospital_name', hospital?.name || "");
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
            {resource ? 'Edit Resource' : 'Add New Resource'}
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
              <Label htmlFor="hospital">Hospital *</Label>
              <Select value={formData.hospital_id} onValueChange={handleHospitalChange} required>
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
              <Label htmlFor="resource_type">Resource Type *</Label>
              <Select value={formData.resource_type} onValueChange={(value) => handleChange('resource_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical_equipment">Medical Equipment</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="bed">Bed</SelectItem>
                  <SelectItem value="operation_theater">Operation Theater</SelectItem>
                  <SelectItem value="ambulance">Ambulance</SelectItem>
                  <SelectItem value="laboratory">Laboratory</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resource_name">Resource Name *</Label>
            <Input
              id="resource_name"
              value={formData.resource_name}
              onChange={(e) => handleChange('resource_name', e.target.value)}
              required
              placeholder="e.g., Ventilator, X-Ray Machine"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_quantity">Total Quantity *</Label>
              <Input
                id="total_quantity"
                type="number"
                min="0"
                value={formData.total_quantity}
                onChange={(e) => handleChange('total_quantity', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="available_quantity">Available *</Label>
              <Input
                id="available_quantity"
                type="number"
                min="0"
                value={formData.available_quantity}
                onChange={(e) => handleChange('available_quantity', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                placeholder="e.g., units, beds"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="limited">Limited</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., Floor 3, Wing A"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_maintenance">Last Maintenance Date</Label>
            <Input
              id="last_maintenance"
              type="date"
              value={formData.last_maintenance}
              onChange={(e) => handleChange('last_maintenance', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700"
            >
              {loading ? 'Saving...' : resource ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
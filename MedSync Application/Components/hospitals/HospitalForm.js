import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const specialtiesOptions = [
  "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Oncology",
  "Radiology", "Emergency Medicine", "Surgery", "Internal Medicine",
  "Obstetrics", "Psychiatry", "Dermatology", "Ophthalmology"
];

export default function HospitalForm({ hospital, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState(hospital || {
    name: "",
    location: "",
    city: "",
    contact_phone: "",
    contact_email: "",
    specialties: [],
    total_beds: 0,
    available_beds: 0,
    icu_beds_total: 0,
    icu_beds_available: 0,
    emergency_available: true,
    status: "active",
    rating: 0
  });

  const [specialtyInput, setSpecialtyInput] = useState("");

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSpecialty = () => {
    if (specialtyInput && !formData.specialties.includes(specialtyInput)) {
      handleChange('specialties', [...formData.specialties, specialtyInput]);
      setSpecialtyInput("");
    }
  };

  const removeSpecialty = (specialty) => {
    handleChange('specialties', formData.specialties.filter(s => s !== specialty));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="bg-white shadow-lg border-slate-200 sticky top-4">
      <CardHeader className="border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">
            {hospital ? 'Edit Hospital' : 'Add New Hospital'}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Hospital Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Full Address *</Label>
            <Textarea
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              required
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Phone</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleChange('contact_email', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_beds">Total Beds *</Label>
              <Input
                id="total_beds"
                type="number"
                min="0"
                value={formData.total_beds}
                onChange={(e) => handleChange('total_beds', parseInt(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="available_beds">Available Beds *</Label>
              <Input
                id="available_beds"
                type="number"
                min="0"
                value={formData.available_beds}
                onChange={(e) => handleChange('available_beds', parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icu_beds_total">ICU Beds Total</Label>
              <Input
                id="icu_beds_total"
                type="number"
                min="0"
                value={formData.icu_beds_total}
                onChange={(e) => handleChange('icu_beds_total', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icu_beds_available">ICU Available</Label>
              <Input
                id="icu_beds_available"
                type="number"
                min="0"
                value={formData.icu_beds_available}
                onChange={(e) => handleChange('icu_beds_available', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Rating (1-5)</Label>
            <Input
              id="rating"
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={(e) => handleChange('rating', parseFloat(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Specialties</Label>
            <div className="flex gap-2">
              <Select value={specialtyInput} onValueChange={setSpecialtyInput}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialtiesOptions.map((spec) => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addSpecialty} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.specialties.map((spec, idx) => (
                  <Badge key={idx} variant="secondary" className="gap-1">
                    {spec}
                    <button type="button" onClick={() => removeSpecialty(spec)}>
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
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700"
            >
              {loading ? 'Saving...' : hospital ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
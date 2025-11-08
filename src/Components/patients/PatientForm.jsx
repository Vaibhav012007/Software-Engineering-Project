import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PatientForm({ patient, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState(patient || {
    full_name: "",
    age: 0,
    gender: "male",
    phone: "",
    email: "",
    address: "",
    blood_group: "",
    medical_conditions: [],
    allergies: [],
    status: "active"
  });

  const [conditionInput, setConditionInput] = useState("");
  const [allergyInput, setAllergyInput] = useState("");

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCondition = () => {
    if (conditionInput && !formData.medical_conditions.includes(conditionInput)) {
      handleChange('medical_conditions', [...formData.medical_conditions, conditionInput]);
      setConditionInput("");
    }
  };

  const removeCondition = (condition) => {
    handleChange('medical_conditions', formData.medical_conditions.filter(c => c !== condition));
  };

  const addAllergy = () => {
    if (allergyInput && !formData.allergies.includes(allergyInput)) {
      handleChange('allergies', [...formData.allergies, allergyInput]);
      setAllergyInput("");
    }
  };

  const removeAllergy = (allergy) => {
    handleChange('allergies', formData.allergies.filter(a => a !== allergy));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="bg-white shadow-lg border-slate-200 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <CardHeader className="border-b border-slate-200 p-6 sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">
            {patient ? 'Edit Patient' : 'Add New Patient'}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                min="0"
                value={formData.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="blood_group">Blood Group</Label>
              <Select value={formData.blood_group} onValueChange={(value) => handleChange('blood_group', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="admitted">Admitted</SelectItem>
                  <SelectItem value="discharged">Discharged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Medical Conditions</Label>
            <div className="flex gap-2">
              <Input
                value={conditionInput}
                onChange={(e) => setConditionInput(e.target.value)}
                placeholder="Enter condition"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
              />
              <Button type="button" onClick={addCondition} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.medical_conditions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.medical_conditions.map((cond, idx) => (
                  <Badge key={idx} variant="secondary" className="gap-1">
                    {cond}
                    <button type="button" onClick={() => removeCondition(cond)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Allergies</Label>
            <div className="flex gap-2">
              <Input
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                placeholder="Enter allergy"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
              />
              <Button type="button" onClick={addAllergy} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.allergies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.allergies.map((allergy, idx) => (
                  <Badge key={idx} className="gap-1 bg-red-100 text-red-700">
                    {allergy}
                    <button type="button" onClick={() => removeAllergy(allergy)}>
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
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700"
            >
              {loading ? 'Saving...' : patient ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
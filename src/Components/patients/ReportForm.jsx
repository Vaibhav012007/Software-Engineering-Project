import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Upload, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ReportForm({ report, patient, hospitals, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState(report || {
    hospital_id: "",
    hospital_name: "",
    report_type: "consultation",
    report_title: "",
    report_date: "",
    doctor_name: "",
    findings: "",
    diagnosis: "",
    recommendations: "",
    medications: [],
    test_results: [],
    file_url: "",
    notes: "",
    status: "final"
  });

  const [medicationInput, setMedicationInput] = useState({ name: "", dosage: "", frequency: "", duration: "" });
  const [testInput, setTestInput] = useState({ test_name: "", result: "", unit: "", normal_range: "", status: "normal" });
  const [uploading, setUploading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleHospitalChange = (hospitalId) => {
    const hospital = hospitals.find(h => h.id === hospitalId);
    handleChange('hospital_id', hospitalId);
    handleChange('hospital_name', hospital?.name || "");
  };

  const addMedication = () => {
    if (medicationInput.name) {
      handleChange('medications', [...formData.medications, medicationInput]);
      setMedicationInput({ name: "", dosage: "", frequency: "", duration: "" });
    }
  };

  const removeMedication = (index) => {
    handleChange('medications', formData.medications.filter((_, i) => i !== index));
  };

  const addTest = () => {
    if (testInput.test_name) {
      handleChange('test_results', [...formData.test_results, testInput]);
      setTestInput({ test_name: "", result: "", unit: "", normal_range: "", status: "normal" });
    }
  };

  const removeTest = (index) => {
    handleChange('test_results', formData.test_results.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    handleChange('file_url', file_url);
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {report ? 'Edit Report' : 'Add New Report'}
        </h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="report_type">Report Type *</Label>
            <Select value={formData.report_type} onValueChange={(value) => handleChange('report_type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lab_test">Lab Test</SelectItem>
                <SelectItem value="radiology">Radiology</SelectItem>
                <SelectItem value="prescription">Prescription</SelectItem>
                <SelectItem value="discharge_summary">Discharge Summary</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="surgery">Surgery</SelectItem>
                <SelectItem value="pathology">Pathology</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report_date">Report Date *</Label>
            <Input
              id="report_date"
              type="date"
              value={formData.report_date}
              onChange={(e) => handleChange('report_date', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="report_title">Report Title *</Label>
          <Input
            id="report_title"
            value={formData.report_title}
            onChange={(e) => handleChange('report_title', e.target.value)}
            required
            placeholder="e.g., Blood Test Results, X-Ray Chest"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hospital">Hospital</Label>
            <Select value={formData.hospital_id} onValueChange={handleHospitalChange}>
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
            <Label htmlFor="doctor_name">Doctor Name</Label>
            <Input
              id="doctor_name"
              value={formData.doctor_name}
              onChange={(e) => handleChange('doctor_name', e.target.value)}
              placeholder="Dr. Name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="findings">Findings</Label>
          <Textarea
            id="findings"
            value={formData.findings}
            onChange={(e) => handleChange('findings', e.target.value)}
            rows={2}
            placeholder="Clinical findings and observations"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="diagnosis">Diagnosis</Label>
          <Textarea
            id="diagnosis"
            value={formData.diagnosis}
            onChange={(e) => handleChange('diagnosis', e.target.value)}
            rows={2}
            placeholder="Medical diagnosis"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recommendations">Recommendations</Label>
          <Textarea
            id="recommendations"
            value={formData.recommendations}
            onChange={(e) => handleChange('recommendations', e.target.value)}
            rows={2}
            placeholder="Doctor's recommendations"
          />
        </div>

        {/* Medications */}
        <div className="space-y-2 pt-3 border-t border-slate-200">
          <Label>Medications</Label>
          <div className="grid grid-cols-4 gap-2">
            <Input
              placeholder="Medicine name"
              value={medicationInput.name}
              onChange={(e) => setMedicationInput({...medicationInput, name: e.target.value})}
            />
            <Input
              placeholder="Dosage"
              value={medicationInput.dosage}
              onChange={(e) => setMedicationInput({...medicationInput, dosage: e.target.value})}
            />
            <Input
              placeholder="Frequency"
              value={medicationInput.frequency}
              onChange={(e) => setMedicationInput({...medicationInput, frequency: e.target.value})}
            />
            <div className="flex gap-2">
              <Input
                placeholder="Duration"
                value={medicationInput.duration}
                onChange={(e) => setMedicationInput({...medicationInput, duration: e.target.value})}
              />
              <Button type="button" onClick={addMedication} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {formData.medications.length > 0 && (
            <div className="space-y-2 mt-2">
              {formData.medications.map((med, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <div className="text-sm">
                    <span className="font-medium">{med.name}</span>
                    {med.dosage && ` - ${med.dosage}`}
                    {med.frequency && ` - ${med.frequency}`}
                    {med.duration && ` - ${med.duration}`}
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeMedication(idx)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Test Results */}
        {(formData.report_type === 'lab_test' || formData.report_type === 'pathology') && (
          <div className="space-y-2 pt-3 border-t border-slate-200">
            <Label>Test Results</Label>
            <div className="grid grid-cols-5 gap-2">
              <Input
                placeholder="Test name"
                value={testInput.test_name}
                onChange={(e) => setTestInput({...testInput, test_name: e.target.value})}
              />
              <Input
                placeholder="Result"
                value={testInput.result}
                onChange={(e) => setTestInput({...testInput, result: e.target.value})}
              />
              <Input
                placeholder="Unit"
                value={testInput.unit}
                onChange={(e) => setTestInput({...testInput, unit: e.target.value})}
              />
              <Input
                placeholder="Normal range"
                value={testInput.normal_range}
                onChange={(e) => setTestInput({...testInput, normal_range: e.target.value})}
              />
              <Button type="button" onClick={addTest} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.test_results.length > 0 && (
              <div className="space-y-2 mt-2">
                {formData.test_results.map((test, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <div className="text-sm">
                      <span className="font-medium">{test.test_name}</span>: {test.result}
                      {test.unit && ` ${test.unit}`}
                      {test.normal_range && ` (Normal: ${test.normal_range})`}
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeTest(idx)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="space-y-2 pt-3 border-t border-slate-200">
          <Label>Upload Report File</Label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              onClick={() => document.getElementById('report-file').click()}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </>
              )}
            </Button>
            <input
              id="report-file"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {formData.file_url && (
              <Badge variant="outline" className="bg-green-50">
                File uploaded
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
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
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700"
          >
            {loading ? 'Saving...' : report ? 'Update' : 'Save Report'}
          </Button>
        </div>
      </form>
    </div>
  );
}
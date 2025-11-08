import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Calendar, User, Building2, ExternalLink, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import ReportForm from "./ReportForm";
import ReportDetails from "./ReportDetails";

const reportTypeColors = {
  lab_test: "bg-purple-100 text-purple-700",
  radiology: "bg-blue-100 text-blue-700",
  prescription: "bg-green-100 text-green-700",
  discharge_summary: "bg-orange-100 text-orange-700",
  consultation: "bg-teal-100 text-teal-700",
  surgery: "bg-red-100 text-red-700",
  pathology: "bg-pink-100 text-pink-700",
  other: "bg-slate-100 text-slate-700"
};

export default function PatientReports({ patient, reports, loading }) {
  const [showForm, setShowForm] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const queryClient = useQueryClient();

  const { data: hospitals } = useQuery({
    queryKey: ['hospitals'],
    queryFn: () => base44.entities.Hospital.list(),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Report.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-reports', patient.id] });
      setShowForm(false);
      setEditingReport(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Report.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-reports', patient.id] });
      setShowForm(false);
      setEditingReport(null);
      setSelectedReport(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Report.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-reports', patient.id] });
      setSelectedReport(null);
    },
  });

  const handleSubmit = (data) => {
    const reportData = {
      ...data,
      patient_id: patient.id,
      patient_name: patient.full_name
    };
    
    if (editingReport) {
      updateMutation.mutate({ id: editingReport.id, data: reportData });
    } else {
      createMutation.mutate(reportData);
    }
  };

  if (selectedReport) {
    return (
      <ReportDetails
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onEdit={(report) => {
          setEditingReport(report);
          setShowForm(true);
          setSelectedReport(null);
        }}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
    );
  }

  if (showForm) {
    return (
      <ReportForm
        report={editingReport}
        patient={patient}
        hospitals={hospitals}
        onSubmit={handleSubmit}
        onCancel={() => {
          setShowForm(false);
          setEditingReport(null);
        }}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={() => {
          setShowForm(true);
          setEditingReport(null);
        }}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Medical Report
      </Button>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-slate-500">Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Reports Yet</h3>
          <p className="text-slate-500 text-sm">Add the first medical report for this patient</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="p-4 rounded-lg border-2 border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{report.report_title}</h4>
                    <Badge className={reportTypeColors[report.report_type] + " text-xs mt-1"}>
                      {report.report_type.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
                {report.file_url && (
                  <a
                    href={report.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="space-y-1.5 text-sm text-slate-600">
                {report.hospital_name && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span className="truncate">{report.hospital_name}</span>
                  </div>
                )}
                {report.doctor_name && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Dr. {report.doctor_name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(report.report_date), "MMM d, yyyy")}</span>
                </div>
              </div>

              {report.diagnosis && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Diagnosis:</span> {report.diagnosis.substring(0, 80)}
                    {report.diagnosis.length > 80 && '...'}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
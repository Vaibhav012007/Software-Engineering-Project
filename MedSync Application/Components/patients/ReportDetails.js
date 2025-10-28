import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Calendar, User, Building2, FileText, ExternalLink, Pill, Activity } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const reportTypeColors = {
  lab_test: "bg-purple-100 text-purple-700 border-purple-200",
  radiology: "bg-blue-100 text-blue-700 border-blue-200",
  prescription: "bg-green-100 text-green-700 border-green-200",
  discharge_summary: "bg-orange-100 text-orange-700 border-orange-200",
  consultation: "bg-teal-100 text-teal-700 border-teal-200",
  surgery: "bg-red-100 text-red-700 border-red-200",
  pathology: "bg-pink-100 text-pink-700 border-pink-200",
  other: "bg-slate-100 text-slate-700 border-slate-200"
};

export default function ReportDetails({ report, onClose, onEdit, onDelete }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reports
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(report)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Report</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this report? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(report.id)} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{report.report_title}</h3>
            <Badge className={reportTypeColors[report.report_type] + " border"}>
              {report.report_type.replace(/_/g, ' ')}
            </Badge>
          </div>
          {report.file_url && (
            <a
              href={report.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View File
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {report.hospital_name && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Building2 className="w-4 h-4" />
              <span>{report.hospital_name}</span>
            </div>
          )}
          {report.doctor_name && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <User className="w-4 h-4" />
              <span>Dr. {report.doctor_name}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(report.report_date), "MMMM d, yyyy")}</span>
          </div>
        </div>
      </div>

      {report.findings && (
        <div className="p-4 bg-slate-50 rounded-lg">
          <h4 className="font-semibold text-slate-900 mb-2">Findings</h4>
          <p className="text-slate-700 whitespace-pre-wrap">{report.findings}</p>
        </div>
      )}

      {report.diagnosis && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-slate-900 mb-2">Diagnosis</h4>
          <p className="text-slate-700 whitespace-pre-wrap">{report.diagnosis}</p>
        </div>
      )}

      {report.recommendations && (
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-slate-900 mb-2">Recommendations</h4>
          <p className="text-slate-700 whitespace-pre-wrap">{report.recommendations}</p>
        </div>
      )}

      {report.medications && report.medications.length > 0 && (
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Pill className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-slate-900">Prescribed Medications</h4>
          </div>
          <div className="space-y-2">
            {report.medications.map((med, idx) => (
              <div key={idx} className="p-3 bg-white rounded border border-purple-200">
                <p className="font-medium text-slate-900">{med.name}</p>
                <div className="text-sm text-slate-600 mt-1">
                  {med.dosage && <span>Dosage: {med.dosage} • </span>}
                  {med.frequency && <span>Frequency: {med.frequency} • </span>}
                  {med.duration && <span>Duration: {med.duration}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {report.test_results && report.test_results.length > 0 && (
        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-yellow-600" />
            <h4 className="font-semibold text-slate-900">Test Results</h4>
          </div>
          <div className="space-y-2">
            {report.test_results.map((test, idx) => (
              <div key={idx} className="p-3 bg-white rounded border border-yellow-200">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{test.test_name}</p>
                  {test.status && (
                    <Badge 
                      className={
                        test.status === 'normal' 
                          ? 'bg-green-100 text-green-700' 
                          : test.status === 'abnormal'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }
                    >
                      {test.status}
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  <span className="font-medium">Result: </span>
                  {test.result} {test.unit}
                  {test.normal_range && (
                    <span className="ml-2">(Normal: {test.normal_range})</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {report.notes && (
        <div className="p-4 bg-slate-50 rounded-lg">
          <h4 className="font-semibold text-slate-900 mb-2">Additional Notes</h4>
          <p className="text-slate-700 whitespace-pre-wrap">{report.notes}</p>
        </div>
      )}
    </div>
  );
}
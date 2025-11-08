import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Calendar, Package, User, Phone, AlertTriangle, Check, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const urgencyColors = {
  low: "bg-blue-100 text-blue-700 border-blue-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  critical: "bg-red-100 text-red-700 border-red-200"
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  fulfilled: "bg-slate-100 text-slate-700 border-slate-200",
  cancelled: "bg-slate-100 text-slate-700 border-slate-200"
};

export default function ResourceRequestList({ requests, loading, onStatusChange }) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseNotes, setResponseNotes] = useState("");
  const [approvedQuantity, setApprovedQuantity] = useState(0);
  const [showApproveDialog, setShowApproveDialog] = useState(false);

  if (loading) {
    return (
      <Card className="bg-white shadow-lg border-slate-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredRequests = filterStatus === "all" 
    ? requests 
    : requests.filter(r => r.status === filterStatus);

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setApprovedQuantity(request.quantity_requested);
    setResponseNotes("");
    setShowApproveDialog(true);
  };

  const confirmApprove = () => {
    if (selectedRequest) {
      onStatusChange(
        { ...selectedRequest, quantity_approved: approvedQuantity },
        'approved',
        responseNotes
      );
      setShowApproveDialog(false);
      setSelectedRequest(null);
    }
  };

  const handleReject = (request, notes) => {
    onStatusChange(request, 'rejected', notes);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Tabs value={filterStatus} onValueChange={setFilterStatus}>
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredRequests.length === 0 ? (
        <Card className="bg-white shadow-lg border-slate-200">
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Requests</h3>
            <p className="text-slate-500">No resource requests found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card
              key={request.id}
              className={`bg-white border-2 transition-all duration-200 hover:shadow-lg ${
                request.urgency === 'critical' 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-slate-200 hover:border-teal-300'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{request.resource_name}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={urgencyColors[request.urgency] + " border"}>
                          {request.urgency} urgency
                        </Badge>
                        <Badge className={statusColors[request.status] + " border"}>
                          {request.status}
                        </Badge>
                        {request.resource_type && (
                          <Badge variant="outline" className="bg-slate-50">
                            {request.resource_type.replace(/_/g, ' ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Building2 className="w-4 h-4" />
                      <div>
                        <span className="font-medium">From: </span>
                        {request.requesting_hospital_name}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Building2 className="w-4 h-4" />
                      <div>
                        <span className="font-medium">To: </span>
                        {request.providing_hospital_name}
                      </div>
                    </div>
                    {request.requested_date && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>Requested: {format(new Date(request.requested_date), "MMM d, yyyy")}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 mb-1">Quantity Requested</p>
                      <p className="text-2xl font-bold text-slate-900">{request.quantity_requested}</p>
                      {request.quantity_approved && (
                        <p className="text-sm text-green-600 mt-1">Approved: {request.quantity_approved}</p>
                      )}
                    </div>
                    {request.required_by_date && (
                      <div className="flex items-center gap-2 text-sm text-orange-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Required by: {format(new Date(request.required_by_date), "MMM d, yyyy")}</span>
                      </div>
                    )}
                  </div>
                </div>

                {request.reason && (
                  <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-700 mb-1">Reason:</p>
                    <p className="text-sm text-slate-600">{request.reason}</p>
                  </div>
                )}

                {request.contact_person && (
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-slate-600">
                    {request.contact_person && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{request.contact_person}</span>
                      </div>
                    )}
                    {request.contact_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{request.contact_phone}</span>
                      </div>
                    )}
                  </div>
                )}

                {request.response_notes && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-1">Response Notes:</p>
                    <p className="text-sm text-blue-700">{request.response_notes}</p>
                  </div>
                )}

                {request.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <Dialog open={showApproveDialog && selectedRequest?.id === request.id} onOpenChange={setShowApproveDialog}>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={() => handleApprove(request)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Approve Resource Request</DialogTitle>
                          <DialogDescription>
                            Approve this request and specify the quantity you can provide.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="approved_quantity">Approved Quantity</Label>
                            <Input
                              id="approved_quantity"
                              type="number"
                              min="1"
                              max={request.quantity_requested}
                              value={approvedQuantity}
                              onChange={(e) => setApprovedQuantity(parseInt(e.target.value))}
                            />
                            <p className="text-xs text-slate-500">
                              Requested: {request.quantity_requested}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="response_notes">Response Notes (Optional)</Label>
                            <Textarea
                              id="response_notes"
                              value={responseNotes}
                              onChange={(e) => setResponseNotes(e.target.value)}
                              rows={3}
                              placeholder="Add any notes for the requesting hospital..."
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={confirmApprove} className="bg-green-600 hover:bg-green-700">
                            Approve Request
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700 border-red-200">
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reject Resource Request</DialogTitle>
                          <DialogDescription>
                            Please provide a reason for rejecting this request.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <Textarea
                            placeholder="Reason for rejection..."
                            value={responseNotes}
                            onChange={(e) => setResponseNotes(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setResponseNotes("")}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={() => {
                              handleReject(request, responseNotes);
                              setResponseNotes("");
                            }}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Reject Request
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                {request.status === 'approved' && (
                  <div className="pt-4 border-t border-slate-200">
                    <Button 
                      onClick={() => onStatusChange(request, 'fulfilled', '')}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Mark as Fulfilled
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
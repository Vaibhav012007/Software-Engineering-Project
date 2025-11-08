import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Package, Send } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import ResourceList from "../components/resources/ResourceList";
import ResourceForm from "../components/resources/ResourceForm";
import ResourceRequestForm from "../components/resources/ResourceRequestForm";
import ResourceRequestList from "../components/resources/ResourceRequestList";

export default function Resources() {
  const [showForm, setShowForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("inventory");

  const queryClient = useQueryClient();

  const { data: resources, isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: () => base44.entities.Resource.list('-created_date'),
    initialData: [],
  });

  const { data: hospitals } = useQuery({
    queryKey: ['hospitals'],
    queryFn: () => base44.entities.Hospital.list(),
    initialData: [],
  });

  const { data: resourceRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ['resource-requests'],
    queryFn: () => base44.entities.ResourceRequest.list('-created_date'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Resource.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      setShowForm(false);
      setEditingResource(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Resource.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      setShowForm(false);
      setEditingResource(null);
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: (data) => base44.entities.ResourceRequest.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-requests'] });
      setShowRequestForm(false);
    },
  });

  const updateRequestMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ResourceRequest.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource-requests'] });
    },
  });

  const handleSubmit = (data) => {
    if (editingResource) {
      updateMutation.mutate({ id: editingResource.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleRequestSubmit = (data) => {
    createRequestMutation.mutate(data);
  };

  const handleRequestStatusChange = (request, newStatus, responseNotes = "") => {
    updateRequestMutation.mutate({
      id: request.id,
      data: { ...request, status: newStatus, response_notes: responseNotes }
    });
  };

  const filteredResources = filterType === "all" 
    ? resources 
    : resources.filter(r => r.resource_type === filterType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Resource Management</h1>
              <p className="text-slate-600 mt-1">Track, allocate and request hospital resources</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowRequestForm(true)}
              variant="outline"
              className="border-teal-300 text-teal-700 hover:bg-teal-50"
            >
              <Send className="w-5 h-5 mr-2" />
              Request Resource
            </Button>
            <Button
              onClick={() => {
                setShowForm(true);
                setEditingResource(null);
              }}
              className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Resource
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="inventory">Inventory ({resources.length})</TabsTrigger>
            <TabsTrigger value="requests">
              Resource Requests ({resourceRequests.filter(r => r.status === 'pending').length} pending)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory">
            <div className="mb-6">
              <Tabs value={filterType} onValueChange={setFilterType}>
                <TabsList className="bg-white shadow-sm">
                  <TabsTrigger value="all">All Resources</TabsTrigger>
                  <TabsTrigger value="medical_equipment">Equipment</TabsTrigger>
                  <TabsTrigger value="bed">Beds</TabsTrigger>
                  <TabsTrigger value="staff">Staff</TabsTrigger>
                  <TabsTrigger value="ambulance">Ambulance</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {showForm && (
              <div className="mb-6">
                <ResourceForm
                  resource={editingResource}
                  hospitals={hospitals}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingResource(null);
                  }}
                  loading={createMutation.isPending || updateMutation.isPending}
                />
              </div>
            )}

            <ResourceList
              resources={filteredResources}
              loading={isLoading}
              onEdit={(res) => {
                setEditingResource(res);
                setShowForm(true);
              }}
            />
          </TabsContent>

          <TabsContent value="requests">
            {showRequestForm && (
              <div className="mb-6">
                <ResourceRequestForm
                  hospitals={hospitals}
                  resources={resources}
                  onSubmit={handleRequestSubmit}
                  onCancel={() => setShowRequestForm(false)}
                  loading={createRequestMutation.isPending}
                />
              </div>
            )}

            <ResourceRequestList
              requests={resourceRequests}
              loading={requestsLoading}
              onStatusChange={handleRequestStatusChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
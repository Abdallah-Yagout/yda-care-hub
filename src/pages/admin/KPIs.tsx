import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Save, X, TrendingUp, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface KPI {
  id: string;
  key: string;
  value_int?: number | null;
  value_dec?: number | null;
  year?: number | null;
  value_text?: any;
  created_at?: string;
  updated_at?: string;
}

const AdminKPIs = () => {
  const [kpis, setKPIs] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<KPI>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newKPI, setNewKPI] = useState<Partial<KPI>>({
    key: "",
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    loadKPIs();
  }, []);

  useRealtimeSubscription({
    table: "kpi",
    onInsert: () => loadKPIs(),
    onUpdate: () => loadKPIs(),
    onDelete: () => loadKPIs(),
  });

  const loadKPIs = async () => {
    try {
      const { data, error } = await supabase
        .from("kpi")
        .select("*")
        .order("key");

      if (error) throw error;
      setKPIs(data || []);
    } catch (error) {
      console.error("Error loading KPIs:", error);
      toast.error("Failed to load KPIs");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (kpi: KPI) => {
    setEditingId(kpi.id);
    setEditData(kpi);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    if (!editingId || !editData.key) return;

    try {
      const { error } = await supabase
        .from("kpi")
        .update({
          value_int: editData.value_int || null,
          value_dec: editData.value_dec || null,
          year: editData.year || null,
          value_text: editData.value_text || null,
        })
        .eq("id", editingId);

      if (error) throw error;

      toast.success("KPI updated successfully");
      setEditingId(null);
      setEditData({});
      loadKPIs();
    } catch (error) {
      console.error("Error updating KPI:", error);
      toast.error("Failed to update KPI");
    }
  };

  const addKPI = async () => {
    if (!newKPI.key) {
      toast.error("Key is required");
      return;
    }

    try {
      const { error } = await supabase.from("kpi").insert({
        key: newKPI.key,
        value_int: newKPI.value_int || null,
        value_dec: newKPI.value_dec || null,
        year: newKPI.year || new Date().getFullYear(),
        value_text: newKPI.value_text || null,
      });

      if (error) throw error;

      toast.success("KPI added successfully");
      setAddingNew(false);
      setNewKPI({ key: "", year: new Date().getFullYear() });
      loadKPIs();
    } catch (error) {
      console.error("Error adding KPI:", error);
      toast.error("Failed to add KPI");
    }
  };

  const deleteKPI = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase.from("kpi").delete().eq("id", deleteId);

      if (error) throw error;

      toast.success("KPI deleted successfully");
      setDeleteId(null);
      loadKPIs();
    } catch (error) {
      console.error("Error deleting KPI:", error);
      toast.error("Failed to delete KPI");
    }
  };

  const renderKPIRow = (kpi: KPI) => {
    const isEditing = editingId === kpi.id;
    const data = isEditing ? editData : kpi;

    return (
      <Card key={kpi.id} className="hover-lift">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span className="font-mono text-sm text-muted-foreground">{kpi.key}</span>
            {!isEditing ? (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(kpi)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteId(kpi.id)}
                >
                  Delete
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" onClick={saveEdit}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={cancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Integer Value</Label>
              <Input
                type="number"
                value={data.value_int || ""}
                onChange={(e) =>
                  isEditing &&
                  setEditData({
                    ...editData,
                    value_int: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                disabled={!isEditing}
                placeholder="e.g., 1000"
              />
            </div>
            <div>
              <Label>Decimal Value</Label>
              <Input
                type="number"
                step="0.01"
                value={data.value_dec || ""}
                onChange={(e) =>
                  isEditing &&
                  setEditData({
                    ...editData,
                    value_dec: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                disabled={!isEditing}
                placeholder="e.g., 12.5"
              />
            </div>
            <div>
              <Label>Year</Label>
              <Input
                type="number"
                value={data.year || ""}
                onChange={(e) =>
                  isEditing &&
                  setEditData({
                    ...editData,
                    year: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                disabled={!isEditing}
                placeholder={new Date().getFullYear().toString()}
              />
            </div>
            <div>
              <Label>Display Value</Label>
              <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50 text-sm">
                {data.value_int || data.value_dec || data.value_text?.en || "—"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">KPIs Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage key performance indicators and statistics
          </p>
        </div>
        <Button onClick={() => setAddingNew(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add KPI
        </Button>
      </div>

      {/* Add New KPI Form */}
      {addingNew && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-lg">Add New KPI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label>Key *</Label>
                <Input
                  value={newKPI.key || ""}
                  onChange={(e) => setNewKPI({ ...newKPI, key: e.target.value })}
                  placeholder="e.g., total_patients"
                  className="font-mono text-sm"
                />
              </div>
              <div>
                <Label>Integer Value</Label>
                <Input
                  type="number"
                  value={newKPI.value_int || ""}
                  onChange={(e) =>
                    setNewKPI({
                      ...newKPI,
                      value_int: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  placeholder="e.g., 1000"
                />
              </div>
              <div>
                <Label>Decimal Value</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newKPI.value_dec || ""}
                  onChange={(e) =>
                    setNewKPI({
                      ...newKPI,
                      value_dec: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  placeholder="e.g., 12.5"
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  type="number"
                  value={newKPI.year || new Date().getFullYear()}
                  onChange={(e) =>
                    setNewKPI({
                      ...newKPI,
                      year: e.target.value ? parseInt(e.target.value) : new Date().getFullYear(),
                    })
                  }
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={addKPI} className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button variant="outline" onClick={() => setAddingNew(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPIs List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading KPIs...</p>
          </div>
        </div>
      ) : kpis.length > 0 ? (
        <div className="grid gap-4">
          {kpis.map(renderKPIRow)}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No KPIs yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              Get started by creating your first KPI
            </p>
            <Button onClick={() => setAddingNew(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First KPI
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the KPI.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteKPI}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminKPIs;

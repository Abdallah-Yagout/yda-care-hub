import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrograms, useDeleteProgram } from "@/hooks/usePrograms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Search, Loader2, Edit, Trash2 } from "lucide-react";

const AdminPrograms = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: programs, isLoading } = usePrograms();
  const deleteProgram = useDeleteProgram();

  const filteredPrograms = programs?.filter(program => {
    const searchLower = searchQuery.toLowerCase();
    return (
      program.title.ar.toLowerCase().includes(searchLower) ||
      program.title.en.toLowerCase().includes(searchLower) ||
      program.slug.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async () => {
    if (deleteId) {
      await deleteProgram.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Programs Management</h1>
        <Button onClick={() => navigate('/admin/programs/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Program
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Programs List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredPrograms && filteredPrograms.length > 0 ? (
        <div className="grid gap-4">
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {program.icon && <span className="text-2xl">{program.icon}</span>}
                      <CardTitle>
                        {program.title.ar} / {program.title.en}
                      </CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Slug: {program.slug}
                    </p>
                    {program.summary?.en && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {program.summary.en}
                      </p>
                    )}
                  </div>
                  <Badge variant={program.status === "published" ? "default" : "secondary"}>
                    {program.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/admin/programs/${program.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteId(program.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No programs found matching your search.' : 'No programs yet.'}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate('/admin/programs/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Program
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the program.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPrograms;

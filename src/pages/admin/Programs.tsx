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
import { Plus, Search, Loader2, Edit, Trash2, BookOpen } from "lucide-react";

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Programs Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage your programs</p>
        </div>
        <Button onClick={() => navigate('/admin/programs/new')} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Program
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search programs by title or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Programs List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading programs...</p>
          </div>
        </div>
      ) : filteredPrograms && filteredPrograms.length > 0 ? (
        <div className="grid gap-4">
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="hover-lift">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      {program.icon && (
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                          {program.icon}
                        </div>
                      )}
                      <CardTitle className="text-lg">
                        {program.title.ar} / {program.title.en}
                      </CardTitle>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="font-medium">Slug:</span>
                        <code className="px-2 py-1 bg-muted rounded text-xs">{program.slug}</code>
                      </p>
                      {program.summary?.en && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {program.summary.en}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant={program.status === "published" ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {program.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
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
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'No programs found' : 'No programs yet'}
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Get started by creating your first program'}
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

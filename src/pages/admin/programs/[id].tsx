import { useParams, useNavigate } from "react-router-dom";
import { useProgram, useCreateProgram, useUpdateProgram, ProgramFormData } from "@/hooks/usePrograms";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

const ProgramDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: program, isLoading: loadingProgram } = useProgram(id);
  const createProgram = useCreateProgram();
  const updateProgram = useUpdateProgram();

  const isNew = id === 'new';
  const isLoading = loadingProgram || createProgram.isPending || updateProgram.isPending;

  const handleSubmit = async (data: ProgramFormData) => {
    if (isNew) {
      await createProgram.mutateAsync(data);
      navigate('/admin/programs');
    } else if (id) {
      await updateProgram.mutateAsync({ id, data });
    }
  };

  if (loadingProgram) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isNew && !program) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Program Not Found</h2>
        <Button onClick={() => navigate('/admin/programs')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Programs
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/programs')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Programs
        </Button>
        <h1 className="text-3xl font-bold">
          {isNew ? 'Create New Program' : 'Edit Program'}
        </h1>
      </div>

      <ProgramForm
        program={program}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProgramDetail;

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Program {
  id: string;
  slug: string;
  title: { ar: string; en: string };
  summary?: { ar: string; en: string };
  body?: { ar: string; en: string };
  cover_url?: string;
  icon?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProgramFormData {
  slug: string;
  title: { ar: string; en: string };
  summary?: { ar: string; en: string };
  body?: { ar: string; en: string };
  cover_url?: string;
  icon?: string;
  status: string;
}

// Fetch all programs
export const usePrograms = (status?: string) => {
  return useQuery({
    queryKey: ['programs', status],
    queryFn: async () => {
      let query = supabase
        .from('program')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Program[];
    },
  });
};

// Fetch single program by ID
export const useProgram = (id?: string) => {
  return useQuery({
    queryKey: ['program', id],
    queryFn: async () => {
      if (!id || id === 'new') return null;

      const { data, error } = await supabase
        .from('program')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Program | null;
    },
    enabled: !!id && id !== 'new',
  });
};

// Create program
export const useCreateProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProgramFormData) => {
      const { data: program, error } = await supabase
        .from('program')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return program;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast({
        title: "Success",
        description: "Program created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Update program
export const useUpdateProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProgramFormData }) => {
      const { data: program, error } = await supabase
        .from('program')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return program;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['program', variables.id] });
      toast({
        title: "Success",
        description: "Program updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Delete program
export const useDeleteProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('program')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      toast({
        title: "Success",
        description: "Program deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

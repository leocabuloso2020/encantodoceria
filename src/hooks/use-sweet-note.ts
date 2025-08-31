import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SweetNote {
  id: string;
  title: string | null;
  content: string;
  is_active: boolean;
  created_at: string;
}

interface UpsertSweetNotePayload {
  id?: string; // Optional for new notes
  title?: string | null;
  content: string;
  is_active: boolean;
}

export const useSweetNote = () => {
  return useQuery<SweetNote | null, Error>({
    queryKey: ["sweetNote"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sweet_notes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
};

export const useUpsertSweetNote = () => {
  const queryClient = useQueryClient();
  return useMutation<SweetNote, Error, UpsertSweetNotePayload>({
    mutationFn: async (payload) => {
      if (payload.id) {
        // Update existing note
        const { data, error } = await supabase
          .from("sweet_notes")
          .update({
            title: payload.title,
            content: payload.content,
            is_active: payload.is_active,
          })
          .eq("id", payload.id)
          .select()
          .single();
        if (error) throw new Error(error.message);
        return data;
      } else {
        // Insert new note
        const { data, error } = await supabase
          .from("sweet_notes")
          .insert({
            title: payload.title,
            content: payload.content,
            is_active: payload.is_active,
          })
          .select()
          .single();
        if (error) throw new Error(error.message);
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sweetNote"] });
      toast.success("Bilhetinho Doce salvo com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao salvar bilhetinho.", { description: error.message });
    },
  });
};
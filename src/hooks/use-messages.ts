import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/Message";
import { toast } from "sonner";

export const useMessages = () => {
  return useQuery<Message[], Error>({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("messages").select("*").order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation<Message, Error, Partial<Message>>({
    mutationFn: async (updatedMessage) => {
      const { id, ...updateValues } = updatedMessage;
      if (!id) throw new Error("Message ID is required for update.");
      const { data, error } = await supabase.from("messages").update(updateValues).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Mensagem atualizada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar mensagem.", { description: error.message });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Mensagem excluída com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir mensagem.", { description: error.message });
    },
  });
};
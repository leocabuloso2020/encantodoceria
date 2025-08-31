import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/Message";
import { toast } from "sonner";

export const useUpdateMessageStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<Message, Error, { messageId: number; approved: boolean }>({
    mutationFn: async ({ messageId, approved }) => {
      const { data, error } = await supabase
        .from("messages")
        .update({ approved })
        .eq("id", messageId)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (updatedMessage) => {
      queryClient.invalidateQueries({ queryKey: ["messages", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["messages", "approved"] }); // Invalida o cache público também
      toast.success(`Mensagem de ${updatedMessage.author_name} ${updatedMessage.approved ? 'aprovada' : 'desaprovada'}!`);
    },
    onError: (error) => {
      toast.error("Erro ao atualizar status da mensagem.", { description: error.message });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (messageId) => {
      const { error } = await supabase.from("messages").delete().eq("id", messageId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["messages", "approved"] }); // Invalida o cache público também
      toast.success("Mensagem excluída com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir mensagem.", { description: error.message });
    },
  });
};
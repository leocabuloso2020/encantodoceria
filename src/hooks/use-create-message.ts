import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/Message";
import { toast } from "sonner";

export interface CreateMessagePayload {
  author_name: string;
  author_email?: string | null;
  message: string;
}

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation<Message, Error, CreateMessagePayload>({
    mutationFn: async (newMessageData) => {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          ...newMessageData,
          approved: false, // Novas mensagens sempre começam como não aprovadas
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      // Não invalidamos as queries de "approved" aqui, pois a mensagem ainda não está aprovada.
      // Apenas informamos ao usuário que a mensagem foi enviada.
      toast.success("Sua mensagem doce foi enviada!", {
        description: "Agradecemos seu carinho! Ela será revisada e em breve aparecerá no nosso mural.",
      });
    },
    onError: (error) => {
      toast.error("Erro ao enviar sua mensagem.", { description: error.message });
    },
  });
};
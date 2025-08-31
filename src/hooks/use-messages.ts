import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/Message";

export const useMessages = () => {
  return useQuery<Message[], Error>({
    queryKey: ["messages", "approved"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: false }); // Mensagens mais recentes primeiro

      if (error) throw new Error(error.message);
      return data;
    },
    staleTime: 1000 * 60 * 1, // Cache por 1 minuto para mensagens públicas
  });
};
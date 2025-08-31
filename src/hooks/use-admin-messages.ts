import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/Message";
import { useSession } from "@/components/SessionContextProvider";

export const useAdminMessages = () => {
  const { isAdmin, loading: sessionLoading } = useSession();

  return useQuery<Message[], Error>({
    queryKey: ["messages", "admin"],
    queryFn: async () => {
      if (!isAdmin) {
        throw new Error("Acesso negado. Você não é um administrador.");
      }
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: isAdmin && !sessionLoading, // Só executa a query se for admin e a sessão não estiver carregando
  });
};
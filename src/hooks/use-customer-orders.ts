import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/Order";
import { useSession } from "@/components/SessionContextProvider";

export const useCustomerOrders = () => {
  const { user, loading: sessionLoading } = useSession();
  const userId = user?.id;

  return useQuery<Order[], Error>({
    queryKey: ["customerOrders", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User not logged in.");
      }
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!userId && !sessionLoading, // Só executa a query se o userId existir e a sessão não estiver carregando
  });
};
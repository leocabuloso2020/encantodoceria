import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/Order";

export const useOrderDetails = (orderId: string | null) => {
  return useQuery<Order, Error>({
    queryKey: ["orderDetails", orderId],
    queryFn: async () => {
      if (!orderId) {
        throw new Error("Order ID is required to fetch details.");
      }
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!orderId, // A query só será executada se orderId não for nulo
  });
};
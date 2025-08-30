import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem } from "@/types/Order";
import { toast } from "sonner";

interface CreateOrderPayload {
  customer_name: string;
  customer_contact: string;
  total_amount: number;
  items: OrderItem[];
  payment_method: string;
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<Order, Error, CreateOrderPayload>({
    mutationFn: async (newOrderData) => {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          ...newOrderData,
          status: 'pending', // Pedido começa como pendente
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (createdOrder) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(`Pedido #${createdOrder.id.substring(0, 8)}... criado com sucesso!`, {
        description: "Aguardando confirmação de pagamento PIX.",
      });
    },
    onError: (error) => {
      toast.error("Erro ao criar pedido.", { description: error.message });
    },
  });
};
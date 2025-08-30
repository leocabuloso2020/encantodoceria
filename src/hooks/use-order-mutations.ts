import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/Order";
import { toast } from "sonner";

type OrderStatus = 'pending' | 'paid' | 'preparing' | 'delivered' | 'cancelled';

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<Order, Error, { orderId: string; status: OrderStatus }>({
    mutationFn: async ({ orderId, status }) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(`Status do pedido ${updatedOrder.id.substring(0, 8)}... atualizado para ${updatedOrder.status}!`);
    },
    onError: (error) => {
      toast.error("Erro ao atualizar status do pedido.", { description: error.message });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (orderId) => {
      const { error } = await supabase.from("orders").delete().eq("id", orderId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Pedido excluído com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir pedido.", { description: error.message });
    },
  });
};
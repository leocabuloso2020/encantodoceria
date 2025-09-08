import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem } from "@/types/Order";
import { toast } from "sonner";

export interface CreateOrderPayload {
  customer_name: string;
  customer_contact: string;
  total_amount: number;
  items: OrderItem[];
  payment_method: string;
  user_id: string;
}

// Adicionando um tipo para os detalhes do PIX retornados
export interface PixDetails {
  qrcode_image: string;
  qrcode_payload: string;
  expiration_date: number; // Em segundos
  txid: string;
}

// O tipo de retorno da mutação agora inclui os detalhes do PIX
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<Order & { pixDetails?: PixDetails }, Error, CreateOrderPayload>({
    mutationFn: async (newOrderData) => {
      // 1. Criar o pedido no Supabase
      const { data: createdOrder, error: orderError } = await supabase
        .from("orders")
        .insert({
          ...newOrderData,
          status: 'pending', // Pedido começa como pendente
        })
        .select()
        .single();

      if (orderError) throw new Error(orderError.message);

      // 2. Chamar a função Edge para gerar o PIX
      const { data: pixResponse, error: pixError } = await supabase.functions.invoke('create-efi-pix-charge', {
        body: {
          orderId: createdOrder.id,
          totalAmount: createdOrder.total_amount,
          customerName: createdOrder.customer_name,
          customerContact: createdOrder.customer_contact,
        },
      });

      if (pixError) {
        console.error("Error invoking create-efi-pix-charge:", pixError);
        // Se houver erro no PIX, ainda retornamos o pedido, mas sem os detalhes do PIX
        toast.error("Erro ao gerar PIX.", { description: "Por favor, entre em contato para finalizar o pagamento." });
        return createdOrder;
      }

      // Retorna o pedido criado junto com os detalhes do PIX
      return { ...createdOrder, pixDetails: pixResponse as PixDetails };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["customerOrders", data.user_id] });
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Invalida produtos para refletir a mudança de estoque
      toast.success(`Pedido #${data.id.substring(0, 8)}... criado com sucesso!`, {
        description: "Aguardando confirmação de pagamento PIX.",
      });
    },
    onError: (error) => {
      toast.error("Erro ao criar pedido.", { description: error.message });
    },
  });
};
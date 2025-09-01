import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "@/components/SessionContextProvider";

interface ToggleFavoritePayload {
  product_id: string;
  isFavorite: boolean; // Indica se o produto já é favorito
}

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { user } = useSession();

  return useMutation<void, Error, ToggleFavoritePayload>({
    mutationFn: async ({ product_id, isFavorite }) => {
      if (!user?.id) {
        throw new Error("Você precisa estar logado para gerenciar favoritos.");
      }

      if (isFavorite) {
        // Remover dos favoritos
        const { error } = await supabase
          .from("user_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", product_id);
        if (error) throw new Error(error.message);
      } else {
        // Adicionar aos favoritos
        const { error } = await supabase
          .from("user_favorites")
          .insert({ user_id: user.id, product_id: product_id });
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: (_, { isFavorite }) => { // 'product_id' removido da desestruturação
      queryClient.invalidateQueries({ queryKey: ["userFavorites", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(isFavorite ? "Removido dos favoritos!" : "Adicionado aos favoritos!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar favoritos.", { description: error.message });
    },
  });
};
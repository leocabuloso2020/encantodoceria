import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/Product";
import { useUserFavorites } from "./use-user-favorites";

export const useFavoriteProducts = () => {
  const { data: favoriteProductIds, isLoading: isLoadingFavorites } = useUserFavorites();

  return useQuery<Product[], Error>({
    queryKey: ["favoriteProducts", favoriteProductIds],
    queryFn: async () => {
      if (!favoriteProductIds || favoriteProductIds.length === 0) {
        return []; // Retorna um array vazio se não houver favoritos
      }
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("id", favoriteProductIds);

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !isLoadingFavorites && !!favoriteProductIds, // Só executa a query quando os IDs dos favoritos estiverem carregados
  });
};
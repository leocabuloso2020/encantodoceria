import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionContextProvider";

export const useUserFavorites = () => {
  const { user, loading: sessionLoading } = useSession();
  const userId = user?.id;

  return useQuery<string[], Error>({
    queryKey: ["userFavorites", userId],
    queryFn: async () => {
      if (!userId) {
        return []; // Retorna um array vazio se não houver usuário logado
      }
      const { data, error } = await supabase
        .from("user_favorites")
        .select("product_id")
        .eq("user_id", userId);

      if (error) throw new Error(error.message);
      return data.map(fav => fav.product_id);
    },
    enabled: !!userId && !sessionLoading, // Só executa a query se o userId existir e a sessão não estiver carregando
    staleTime: 1000 * 60 * 5, // 5 minutos de cache para favoritos
  });
};
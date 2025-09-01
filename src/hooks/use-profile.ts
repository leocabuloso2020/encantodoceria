import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionContextProvider";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean;
}

// Exportando a interface UpdateProfilePayload
export interface UpdateProfilePayload {
  first_name: string | null;
  last_name: string | null;
}

export const useUserProfile = () => {
  const { user, loading: sessionLoading } = useSession();
  const userId = user?.id;

  return useQuery<UserProfile | null, Error>({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!userId) {
        return null;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, is_admin")
        .eq("id", userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine for a new user
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!userId && !sessionLoading, // Só executa a query se o userId existir e a sessão não estiver carregando
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useSession();

  return useMutation<UserProfile, Error, UpdateProfilePayload>({
    mutationFn: async (payload) => {
      if (!user?.id) {
        throw new Error("Você precisa estar logado para atualizar seu perfil.");
      }
      const { data, error } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", user.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", user?.id] });
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar perfil.", { description: error.message });
    },
  });
};
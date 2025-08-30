import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/Product";
import { toast } from "sonner";

// Type for form values, excluding 'id' and 'created_at' which are handled by Supabase
type ProductFormValues = Omit<Product, "id" | "created_at">;

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, ProductFormValues>({
    mutationFn: async (newProduct) => {
      const { data, error } = await supabase.from("products").insert(newProduct).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["featuredProducts"] });
      toast.success("Produto adicionado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao adicionar produto.", { description: error.message });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, Product>({
    mutationFn: async (updatedProduct) => {
      const { id, ...updateValues } = updatedProduct;
      const { data, error } = await supabase.from("products").update(updateValues).eq("id", id).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["featuredProducts"] });
      toast.success("Produto atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar produto.", { description: error.message });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["featuredProducts"] });
      toast.success("Produto excluído com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir produto.", { description: error.message });
    },
  });
};
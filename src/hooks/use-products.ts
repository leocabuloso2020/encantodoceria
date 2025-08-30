import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/Product";

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

export const useFeaturedProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ["featuredProducts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").eq("featured", true);
      if (error) throw new Error(error.message);
      return data;
    },
  });
};
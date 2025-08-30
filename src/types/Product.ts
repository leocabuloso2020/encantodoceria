export interface Product {
  id: string;
  created_at: string; // Adicionado: Propriedade created_at
  name: string;
  description: string;
  price: number;
  image: string;
  category: "trufa" | "doce" | "torta";
  stock: number;
  featured?: boolean;
}
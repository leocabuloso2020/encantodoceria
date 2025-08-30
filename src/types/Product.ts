export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "trufa" | "doce" | "torta";
  stock: number;
  featured?: boolean;
}
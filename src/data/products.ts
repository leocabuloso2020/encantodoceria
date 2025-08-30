import { Product } from "@/types/Product";
import trufaChocolateImg from "@/assets/trufa-chocolate.jpg";
import trufaMorangoImg from "@/assets/trufa-morango.jpg";
import trufaCocoImg from "@/assets/trufa-coco.jpg";
import brigadeiroImg from "@/assets/brigadeiro.jpg";
import trufaPistacheImg from "@/assets/trufa-pistache.jpg";
import miniCupcakesImg from "@/assets/mini-cupcakes.jpg";

export const products: Product[] = [
  {
    id: "1",
    name: "Trufa de Chocolate Belga",
    description: "Deliciosa trufa feita com chocolate belga premium, derrete na boca com sabor intenso e marcante.",
    price: 4.50,
    image: trufaChocolateImg,
    category: "trufa",
    stock: 25,
    featured: true,
  },
  {
    id: "2", 
    name: "Trufa de Morango",
    description: "Trufa suave com sabor natural de morango, coberta com chocolate branco e finalizada com açúcar cristal.",
    price: 5.00,
    image: trufaMorangoImg,
    category: "trufa",
    stock: 18,
    featured: true,
  },
  {
    id: "3",
    name: "Trufa de Coco",
    description: "Trufa cremosa de coco fresco, coberta com coco ralado selecionado. Um sabor tropical irresistível.",
    price: 4.80,
    image: trufaCocoImg,
    category: "trufa", 
    stock: 22,
  },
  {
    id: "4",
    name: "Brigadeiro Gourmet",
    description: "O clássico brasileiro reinventado com chocolate nobre e granulado belga. Tradição e sofisticação.",
    price: 3.50,
    image: brigadeiroImg,
    category: "doce",
    stock: 30,
    featured: true,
  },
  {
    id: "5",
    name: "Trufa de Pistache",
    description: "Requintada trufa com pistache importado, sabor único e textura cremosa que encanta o paladar.",
    price: 6.50,
    image: trufaPistacheImg,
    category: "trufa",
    stock: 12,
  },
  {
    id: "6",
    name: "Mini Cupcakes Sortidos",
    description: "Kit com 6 mini cupcakes de sabores variados: baunilha, chocolate e morango. Perfeitos para presentear.",
    price: 18.00,
    image: miniCupcakesImg,
    category: "doce",
    stock: 15,
  },
];

export const featuredProducts = products.filter(product => product.featured);
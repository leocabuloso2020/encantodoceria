import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { Product } from "@/types/Product";
import { Skeleton } from "@/components/ui/skeleton"; // Importar Skeleton para estado de carregamento

interface ProductGridProps {
  title?: string;
}

const ProductGrid = ({ title = "Nossos Doces" }: ProductGridProps) => {
  const { data: products, isLoading, isError, error } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4" id="produtos">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Carregando nossas delícias...
            </p>
            <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <Skeleton key={index} className="h-96 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 px-4" id="produtos">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-destructive mb-4">Erro ao carregar produtos</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Não foi possível carregar os doces. Por favor, tente novamente mais tarde.
            <br />
            Detalhes do erro: {error?.message}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4" id="produtos">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trufas artesanais feitas com ingredientes selecionados e muito carinho. 
            Cada doce é uma experiência única de sabor.
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products?.map((product, index) => (
            <div 
              key={product.id} 
              className="fade-in-up hover:transform hover:-translate-y-2 transition-transform duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} onViewDetails={handleViewDetails} />
            </div>
          ))}
        </div>
        
        {products?.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Nenhum produto encontrado. Volte em breve para conferir nossas delícias!
            </p>
          </div>
        )}
        
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </section>
  );
};

export default ProductGrid;
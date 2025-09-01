import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSession } from "@/components/SessionContextProvider";
import { useNavigate } from "react-router-dom";
import React from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ShoppingBag } from "lucide-react";
import { useFavoriteProducts } from "@/hooks/use-favorite-products";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import { Product } from "@/types/Product";
import { Button } from "@/components/ui/button";

const Favorites = () => {
  const { user, loading: sessionLoading } = useSession();
  const navigate = useNavigate();
  const { data: favoriteProducts, isLoading, isError, error } = useFavoriteProducts();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (!sessionLoading && !user) {
      toast.info("Você precisa estar logado para ver seus favoritos.");
      navigate('/login');
    }
  }, [sessionLoading, user, navigate]);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (sessionLoading || (!user && !sessionLoading)) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Skeleton className="h-12 w-1/3 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-96 w-full rounded-lg" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground font-dancing gradient-text flex items-center">
              <Heart className="h-8 w-8 mr-3 text-primary" fill="currentColor" />
              Meus Favoritos
            </CardTitle>
            <p className="text-muted-foreground">Seus doces mais amados, todos em um só lugar.</p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} className="h-96 w-full rounded-lg" />
                ))}
              </div>
            ) : isError ? (
              <p className="text-destructive text-center py-8">
                Erro ao carregar seus favoritos: {error?.message}
              </p>
            ) : favoriteProducts && favoriteProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {favoriteProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={product} onViewDetails={handleViewDetails} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground">Sua lista de favoritos está vazia.</h3>
                <p className="text-muted-foreground mt-2 mb-6">
                  Clique no coração dos produtos que você ama para salvá-los aqui!
                </p>
                <Button onClick={() => navigate('/')} className="pix-button">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Ver Produtos
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Favorites;
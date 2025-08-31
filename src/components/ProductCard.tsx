import { ShoppingBag, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/Product";
import { useSession } from "@/components/SessionContextProvider";
import { useUserFavorites } from "@/hooks/use-user-favorites";
import { useToggleFavorite } from "@/hooks/use-toggle-favorite";
import { toast } from "sonner"; // Usando sonner para toasts

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const { user, loading: sessionLoading } = useSession();
  const { data: favoriteProductIds, isLoading: isLoadingFavorites } = useUserFavorites();
  const toggleFavoriteMutation = useToggleFavorite();

  const isFavorite = favoriteProductIds?.includes(product.id) || false;

  const handlePixPaymentClick = () => {
    onViewDetails(product);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening modal when clicking heart
    if (!user) {
      toast.info("Faça login para adicionar produtos aos favoritos.");
      return;
    }
    await toggleFavoriteMutation.mutateAsync({ product_id: product.id, isFavorite });
  };

  return (
    <Card className="product-card group relative overflow-hidden bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg hover:shadow-xl">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
          onClick={() => onViewDetails(product)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* View Details Button - appears on hover */}
        <button
          onClick={() => onViewDetails(product)}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <div className="bg-primary/90 text-primary-foreground px-4 py-2 rounded-full font-semibold flex items-center space-x-2 transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Eye className="h-4 w-4" />
            <span>Ver Detalhes</span>
          </div>
        </button>
        
        <button
          onClick={handleToggleFavorite}
          disabled={sessionLoading || isLoadingFavorites || toggleFavoriteMutation.isPending}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Heart 
            className={`h-4 w-4 transition-all duration-300 ${
              isFavorite ? 'text-primary fill-primary' : 'text-muted-foreground'
            }`} 
          />
        </button>
        
        {product.featured && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            Destaque
          </div>
        )}
      </div>
      
      <CardContent className="p-4 sm:p-5 md:p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              {product.name}
            </h3>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">
                R$ {product.price.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {product.stock > 0 ? `${product.stock} disponíveis` : 'Esgotado'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(product)}
              className="flex-1 border-primary/20 hover:bg-primary/10 text-xs sm:text-sm"
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Detalhes
            </Button>
            
            <Button
              onClick={handlePixPaymentClick}
              disabled={product.stock === 0}
              className="flex-1 pix-button bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-2 sm:py-3 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
            >
              <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Comprar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Heart, Star, Clock, Truck } from "lucide-react";
import { Product } from "@/types/Product";
import { useState } from "react";
import { toast } from "sonner";
// import CustomerDetailsDialog from "./CustomerDetailsDialog"; // Removido: não utilizado diretamente aqui
// import { useCreateOrder } from "@/hooks/use-create-order"; // Removido: não utilizado diretamente aqui
import { useSession } from "@/components/SessionContextProvider";
import { useUserFavorites } from "@/hooks/use-user-favorites";
import { useToggleFavorite } from "@/hooks/use-toggle-favorite";
import { useCart } from "@/hooks/use-cart";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  // const [isCustomerDetailsDialogOpen, setIsCustomerDetailsDialogOpen] = useState(false); // Removido: não utilizado
  // const createOrderMutation = useCreateOrder(); // Removido: não utilizado
  const { user, loading: sessionLoading } = useSession();
  const { data: favoriteProductIds, isLoading: isLoadingFavorites } = useUserFavorites();
  const toggleFavoriteMutation = useToggleFavorite();
  const { addItem } = useCart();

  if (!product) return null;

  const isFavorite = favoriteProductIds?.includes(product.id) || false;

  const handleAddToCart = () => {
    console.log('handleAddToCart called from modal for product:', product);
    if (product.stock === 0) {
      toast.error("Produto esgotado!", { description: "Não é possível adicionar este item ao carrinho." });
      return;
    }
    addItem(product, 1);
    onClose();
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.info("Faça login para adicionar produtos aos favoritos.");
      return;
    }
    await toggleFavoriteMutation.mutateAsync({ product_id: product.id, isFavorite });
  };

  const categoryLabels = {
    trufa: "Trufa Artesanal",
    doce: "Doce Especial",
    torta: "Torta Gourmet"
  };

  const isAddToCartButtonDisabled = product.stock === 0;
  const isFavoriteButtonDisabled = sessionLoading || isLoadingFavorites || toggleFavoriteMutation.isPending;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-gradient-to-br from-card to-secondary-soft border-border/50 max-h-[90vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px] md:min-h-[600px]">
            {/* Image Section */}
            <div className="relative overflow-hidden h-64 md:h-full">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
              
              {product.featured && (
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  ⭐ Destaque
                </Badge>
              )}
              
              <button
                onClick={handleToggleFavorite}
                disabled={isFavoriteButtonDisabled}
                className="absolute top-4 right-4 p-3 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Heart 
                  className={`h-5 w-5 transition-all duration-300 ${
                    isFavorite ? 'text-primary fill-primary' : 'text-muted-foreground'
                  }`} 
                />
              </button>
            </div>

            {/* Content Section */}
            <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <DialogHeader>
                  <div className="space-y-3">
                    <Badge variant="outline" className="w-fit">
                      {categoryLabels[product.category]}
                    </Badge>
                    <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
                      {product.name}
                    </DialogTitle>
                  </div>
                </DialogHeader>

                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {product.description}
                  </p>

                  <div className="flex items-center space-x-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">Avaliação 5 estrelas</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Preparo: 2h</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Truck className="h-4 w-4 text-accent" />
                      <span className="text-muted-foreground">Entrega: Mesmo dia</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-3xl font-bold text-primary">
                        R$ {product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {product.stock > 0 ? `${product.stock} disponíveis` : 'Esgotado'}
                      </span>
                    </div>
                    
                    {product.stock <= 5 && product.stock > 0 && (
                      <p className="text-sm text-destructive font-medium">
                        ⚠️ Últimas unidades disponíveis!
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddToCartButtonDisabled}
                  className="w-full pix-button bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-4 text-lg rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {product.stock > 0 ? 'Comprar' : 'Produto Esgotado'}
                </Button>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Pagamento seguro via PIX • Chave: 31993305095
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Details Dialog is now handled by CartDrawer for multi-item orders */}
    </>
  );
};

export default ProductModal;
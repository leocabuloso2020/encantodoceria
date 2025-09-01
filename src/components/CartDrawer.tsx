import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Trash2, MinusCircle, PlusCircle, XCircle } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import CustomerDetailsDialog from "./CustomerDetailsDialog";
import { useCreateOrder } from "@/hooks/use-create-order";
import { useSession } from "@/components/SessionContextProvider";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { cartItems, removeItem, updateItemQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [isCustomerDetailsDialogOpen, setIsCustomerDetailsDialogOpen] = useState(false);
  const createOrderMutation = useCreateOrder();
  const { user, loading: sessionLoading } = useSession();
  const navigate = useNavigate();

  const handleInitiateCheckout = () => {
    if (!user) {
      toast.error("Você precisa estar logado para finalizar o pedido.", {
        description: "Por favor, faça login ou cadastre-se.",
      });
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Seu carrinho está vazio!", {
        description: "Adicione alguns doces antes de finalizar o pedido.",
      });
      return;
    }
    setIsCustomerDetailsDialogOpen(true);
  };

  const handleConfirmOrderAndPix = async (customerDetails: { customer_name: string; customer_contact: string }) => {
    if (!user?.id || cartItems.length === 0) return;

    const orderItems = cartItems.map(item => ({
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    const newOrderPayload = {
      customer_name: customerDetails.customer_name,
      customer_contact: customerDetails.customer_contact,
      total_amount: totalPrice,
      items: orderItems,
      payment_method: 'PIX',
      user_id: user.id,
    };

    try {
      const createdOrder = await createOrderMutation.mutateAsync(newOrderPayload);
      
      const pixKey = "31993305095";
      const amount = totalPrice.toFixed(2);
      const description = `Doces da Paty - Pedido ${createdOrder.id.substring(0, 8)}`;
      
      const pixUrl = `pix://${pixKey}?amount=${amount}&description=${encodeURIComponent(description)}`;
      window.location.href = pixUrl;
      
      toast.info("Redirecionando para pagamento PIX", {
        description: `Valor: R$ ${amount} - Chave PIX: ${pixKey}`,
      });
      
      clearCart();
      setIsCustomerDetailsDialogOpen(false);
      onClose();
    } catch (error) {
      setIsCustomerDetailsDialogOpen(false);
    }
  };

  const handleLoginClick = () => {
    onClose();
    navigate('/login');
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle className="font-dancing text-3xl gradient-text flex items-center">
              <ShoppingBag className="h-7 w-7 mr-2 text-primary" />
              Seu Carrinho ({totalItems})
            </SheetTitle>
          </SheetHeader>
          <Separator className="my-4" />
          <div className="flex-1 overflow-y-auto space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Seu carrinho está vazio. Adicione alguns doces!</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 border-b border-border/50 pb-4 last:border-b-0">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium text-foreground">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">R$ {item.price.toFixed(2)} cada</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="font-semibold text-foreground">R$ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))
            )}
          </div>
          <SheetFooter className="flex flex-col gap-4 mt-6">
            <div className="flex justify-between items-center"> {/* Removidas as classes de texto do div pai */}
              <span className="text-base text-muted-foreground">Total:</span>
              <span className="text-xl font-bold text-primary">R$ {totalPrice.toFixed(2)}</span>
            </div>

            {!user ? (
              <Button
                onClick={handleLoginClick}
                className="w-full pix-button bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-2 text-base rounded-lg shadow-lg hover:shadow-xl"
                disabled={sessionLoading}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {sessionLoading ? 'Carregando...' : 'Faça login'}
              </Button>
            ) : (
              <Button
                onClick={handleInitiateCheckout}
                className="w-full pix-button bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-3 text-lg rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cartItems.length === 0 || createOrderMutation.isPending || sessionLoading}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {createOrderMutation.isPending ? 'Processando...' : 'Finalizar'}
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {isCustomerDetailsDialogOpen && (
        <CustomerDetailsDialog
          isOpen={isCustomerDetailsDialogOpen}
          onClose={() => setIsCustomerDetailsDialogOpen(false)}
          onConfirm={handleConfirmOrderAndPix}
          productName="itens do carrinho"
          totalAmount={totalPrice}
        />
      )}
    </>
  );
};

export default CartDrawer;
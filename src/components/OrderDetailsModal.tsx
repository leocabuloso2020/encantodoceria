import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Package, CheckCircle, XCircle, Truck, Clock, User, Phone, DollarSign, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useOrderDetails } from "@/hooks/use-order-details";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderDetailsModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal = ({ orderId, isOpen, onClose }: OrderDetailsModalProps) => {
  const { data: order, isLoading, isError, error } = useOrderDetails(orderId || null);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'preparing':
        return 'secondary';
      case 'delivered':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      case 'pending':
      default:
        return 'secondary';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Detalhes do Pedido {orderId ? orderId.substring(0, 8) : ''}...
          </DialogTitle>
          <DialogDescription>
            Informações completas sobre o pedido selecionado.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-4 py-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        )}

        {isError && (
          <div className="text-destructive py-4">
            <p>Erro ao carregar detalhes do pedido: {error?.message}</p>
          </div>
        )}

        {order && (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center mb-1">
                  <User className="h-4 w-4 mr-2" /> Cliente:
                </p>
                <p className="font-medium text-foreground">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center mb-1">
                  <Phone className="h-4 w-4 mr-2" /> Contato:
                </p>
                <p className="font-medium text-foreground">{order.customer_contact}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center mb-1">
                  <CalendarDays className="h-4 w-4 mr-2" /> Data do Pedido:
                </p>
                <p className="font-medium text-foreground">
                  {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center mb-1">
                  <DollarSign className="h-4 w-4 mr-2" /> Método de Pagamento:
                </p>
                <p className="font-medium text-foreground">{order.payment_method}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Itens do Pedido:</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-md" />}
                      <span>{item.quantity}x {item.name}</span>
                    </div>
                    <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center text-lg font-bold text-foreground">
              <span>Total do Pedido:</span>
              <span>R$ {order.total_amount.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-foreground">Status:</span>
              <Badge variant={getStatusBadgeVariant(order.status)} className="text-base px-3 py-1">
                {order.status === 'pending' && <Clock className="h-4 w-4 mr-2" />}
                {order.status === 'paid' && <CheckCircle className="h-4 w-4 mr-2" />}
                {order.status === 'preparing' && <Package className="h-4 w-4 mr-2" />}
                {order.status === 'delivered' && <Truck className="h-4 w-4 mr-2" />}
                {order.status === 'cancelled' && <XCircle className="h-4 w-4 mr-2" />}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
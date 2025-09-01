import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderDetails } from '@/hooks/use-order-details';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, DollarSign, CalendarDays, User, Phone, ShoppingBag, Clock, Package, Truck, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, isError, error } = useOrderDetails(orderId || null);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'preparing': return 'secondary';
      case 'delivered': return 'outline';
      case 'cancelled': return 'destructive';
      case 'pending': default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-destructive font-dancing gradient-text">
                Erro ao Carregar Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground mb-6">
                Não foi possível encontrar os detalhes do seu pedido.
                <br />
                {error?.message || "Por favor, verifique o link ou tente novamente."}
              </p>
              <Button onClick={() => navigate('/')} className="pix-button">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Voltar para Produtos
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg max-w-3xl mx-auto">
          <CardHeader className="text-center pb-6">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4 animate-bounce-in" />
            <CardTitle className="text-4xl font-bold text-foreground font-dancing gradient-text">
              Obrigado pelo seu Pedido!
            </CardTitle>
            <p className="text-lg text-muted-foreground mt-2">
              {order.status === 'pending' ? 'Aguardando confirmação de pagamento.' : 'Seu pagamento foi confirmado!'}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground flex items-center mb-1"><User className="h-4 w-4 mr-2" /> Cliente:</p>
                <p className="font-medium text-foreground">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center mb-1"><Phone className="h-4 w-4 mr-2" /> Contato:</p>
                <p className="font-medium text-foreground">{order.customer_contact}</p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center mb-1"><CalendarDays className="h-4 w-4 mr-2" /> Data do Pedido:</p>
                <p className="font-medium text-foreground">
                  {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center mb-1"><DollarSign className="h-4 w-4 mr-2" /> Total:</p>
                <p className="font-bold text-primary text-xl">R$ {order.total_amount.toFixed(2)}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-foreground">Status do Pedido:</span>
              <Badge variant={getStatusBadgeVariant(order.status)} className="text-base px-3 py-1">
                {order.status === 'pending' && <Clock className="h-4 w-4 mr-2" />}
                {order.status === 'paid' && <CheckCircle className="h-4 w-4 mr-2" />}
                {order.status === 'preparing' && <Package className="h-4 w-4 mr-2" />}
                {order.status === 'delivered' && <Truck className="h-4 w-4 mr-2" />}
                {order.status === 'cancelled' && <XCircle className="h-4 w-4 mr-2" />}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <Separator />
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Você pode acompanhar o status do seu pedido a qualquer momento na seção "Meus Pedidos".
              </p>
              <Button variant="outline" onClick={() => navigate('/my-orders')} className="hover:bg-primary/10">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Ver Meus Pedidos
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCustomerOrders } from "@/hooks/use-customer-orders";
import { useUpdateOrderStatus } from "@/hooks/use-order-mutations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Package, Truck, XCircle, Ban, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/components/SessionContextProvider";
import React from "react";

const MyOrders = () => {
  const { data: orders, isLoading, isError, error } = useCustomerOrders();
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const navigate = useNavigate();
  const { user, loading: sessionLoading } = useSession();

  React.useEffect(() => {
    if (!sessionLoading && !user) {
      toast.info("Você precisa estar logado para ver seus pedidos.");
      navigate('/login');
    }
  }, [sessionLoading, user, navigate]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default'; // Primary color
      case 'preparing':
        return 'secondary';
      case 'delivered':
        return 'outline'; // Greenish
      case 'cancelled':
        return 'destructive';
      case 'pending':
      default:
        return 'secondary'; // Muted color
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm("Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.")) {
      await updateOrderStatusMutation.mutateAsync({ orderId, status: 'cancelled' });
      toast.success("Pedido cancelado com sucesso!");
    }
  };

  if (sessionLoading || (!user && !sessionLoading)) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-foreground">Meus Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full mb-4" />
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-foreground">Meus Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full mb-4" />
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-destructive">Erro ao carregar pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                Não foi possível carregar seus pedidos. Por favor, tente novamente mais tarde.
                <br />
                Detalhes do erro: {error?.message}
              </p>
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
        <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-foreground font-dancing gradient-text">Meus Pedidos</CardTitle>
            <p className="text-muted-foreground">Acompanhe o status dos seus pedidos e gerencie suas compras.</p>
          </CardHeader>
          <CardContent>
            {orders && orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID do Pedido</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Itens</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                      <TableCell>
                        {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-sm text-muted-foreground">
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell className="text-right">R$ {order.total_amount.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {order.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                          {order.status === 'paid' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {order.status === 'preparing' && <Package className="h-3 w-3 mr-1" />}
                          {order.status === 'delivered' && <Truck className="h-3 w-3 mr-1" />}
                          {order.status === 'cancelled' && <XCircle className="h-3 w-3 mr-1" />}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {order.status === 'pending' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={updateOrderStatusMutation.isPending}
                            className="h-8 gap-1"
                          >
                            <Ban className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Cancelar</span>
                          </Button>
                        )}
                        {order.status !== 'pending' && (
                          <span className="text-muted-foreground text-sm">Ação indisponível</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground mb-4">Você ainda não fez nenhum pedido.</p>
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
    </div>
  );
};

export default MyOrders;
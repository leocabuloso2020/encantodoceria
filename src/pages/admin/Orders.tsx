import { useOrders } from '@/hooks/use-orders';
import { useUpdateOrderStatus, useDeleteOrder } from '@/hooks/use-order-mutations'; // Importar os novos hooks
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, CheckCircle, XCircle, Truck, Clock, MoreHorizontal, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const AdminOrders = () => {
  const { data: orders, isLoading, isError, error } = useOrders();
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const deleteOrderMutation = useDeleteOrder();

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

  const handleUpdateStatus = async (orderId: string, status: 'pending' | 'paid' | 'preparing' | 'delivered' | 'cancelled') => {
    await updateOrderStatusMutation.mutateAsync({ orderId, status });
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este pedido? Esta ação é irreversível.")) {
      await deleteOrderMutation.mutateAsync(orderId);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Erro ao carregar pedidos: {error?.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Gerenciar Pedidos</CardTitle>
        {/* Botão para adicionar novo pedido ou filtrar, se necessário */}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID do Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{order.customer_contact}</TableCell>
                <TableCell>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-sm text-muted-foreground">
                      {item.quantity}x {item.name} (R$ {item.price.toFixed(2)})
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
                  {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => console.log('Ver detalhes', order.id)}>
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'paid')}>
                        Marcar como Pago
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'preparing')}>
                        Marcar em Preparo
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'delivered')}>
                        Marcar como Entregue
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => handleUpdateStatus(order.id, 'cancelled')}>
                        Cancelar Pedido
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteOrder(order.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Excluir Pedido
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders?.length === 0 && (
          <p className="text-center text-muted-foreground mt-4">Nenhum pedido encontrado.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminOrders;
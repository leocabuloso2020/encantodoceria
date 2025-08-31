import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingBag, DollarSign, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/hooks/use-products';
import { useOrders } from '@/hooks/use-orders';
import { useMemo } from 'react';

const AdminDashboard = () => {
  const { data: products, isLoading: isLoadingProducts, isError: isErrorProducts, error: errorProducts } = useProducts();
  const { data: orders, isLoading: isLoadingOrders, isError: isErrorOrders, error: errorOrders } = useOrders();

  const { totalProducts, pendingOrders, totalRevenue } = useMemo(() => {
    const calculatedTotalProducts = products?.length || 0;
    const calculatedPendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
    
    let calculatedTotalRevenue = 0;
    orders?.forEach(order => {
      calculatedTotalRevenue += order.total_amount;
    });

    return {
      totalProducts: calculatedTotalProducts,
      pendingOrders: calculatedPendingOrders,
      totalRevenue: calculatedTotalRevenue,
    };
  }, [products, orders]);

  if (isLoadingProducts || isLoadingOrders) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground">Visão Geral do Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isErrorProducts || isErrorOrders) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground">Visão Geral do Dashboard</h2>
        <Card>
          <CardHeader>
            <CardTitle>Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              Erro ao carregar dados: {errorProducts?.message || errorOrders?.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Visão Geral do Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Produtos cadastrados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Aguardando ação</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Acumulado de todos os pedidos</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle>Atalhos Rápidos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a href="/admin/products" className="flex items-center space-x-3 p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors duration-200">
            <Package className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">Gerenciar Produtos</span>
          </a>
          <a href="/admin/orders" className="flex items-center space-x-3 p-4 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors duration-200">
            <ShoppingBag className="h-5 w-5 text-accent" />
            <span className="font-medium text-foreground">Ver Pedidos</span>
          </a>
          <a href="/admin/financeiro" className="flex items-center space-x-3 p-4 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors duration-200">
            <DollarSign className="h-5 w-5 text-secondary-foreground" />
            <span className="font-medium text-foreground">Relatório Financeiro</span>
          </a>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
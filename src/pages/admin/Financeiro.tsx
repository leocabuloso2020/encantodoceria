import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp } from 'lucide-react'; // Removido TrendingDown, pois não é mais usado
import { Skeleton } from '@/components/ui/skeleton';
import { useOrders } from '@/hooks/use-orders';
import { useMemo } from 'react';

const AdminFinanceiro = () => {
  const { data: orders, isLoading, isError, error } = useOrders();

  const { totalRevenue, monthlySales, profit } = useMemo(() => {
    if (!orders) {
      return { totalRevenue: 0, monthlySales: 0, profit: 0 };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let calculatedTotalRevenue = 0;
    let calculatedMonthlySales = 0;
    let calculatedProfit = 0;

    orders.forEach(order => {
      calculatedTotalRevenue += order.total_amount;

      const orderDate = new Date(order.created_at);
      if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
        calculatedMonthlySales += order.total_amount;
      }
    });

    // Removido: mockExpenses. O lucro agora reflete apenas as vendas do mês,
    // pois não há um sistema de despesas real implementado.
    calculatedProfit = calculatedMonthlySales;

    return {
      totalRevenue: calculatedTotalRevenue,
      monthlySales: calculatedMonthlySales,
      profit: calculatedProfit,
    };
  }, [orders]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
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
          <p className="text-destructive">Erro ao carregar dados financeiros: {error?.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Visão Geral Financeira</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {monthlySales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Vendas no mês atual</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido (Estimado)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {profit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Vendas do mês (sem despesas fixas)</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle>Relatório Detalhado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aqui você poderá ver relatórios mais detalhados, gráficos de vendas, despesas e projeções.
            (Funcionalidade a ser implementada)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFinanceiro;
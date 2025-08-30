import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const AdminFinanceiro = () => {
  const isLoading = false; // Placeholder for loading state
  const isError = false; // Placeholder for error state

  // Mock data for financial overview
  const totalRevenue = 12500.75;
  const monthlySales = 3200.50;
  const expenses = 1500.00;
  const profit = monthlySales - expenses;

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
          <p className="text-destructive">Erro ao carregar dados financeiros.</p>
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
            <p className="text-xs text-muted-foreground">+20.1% do mês passado</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {monthlySales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+180.1% do mês passado</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {profit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Baseado em vendas e despesas</p>
          </CardContent>
        </Card>
      </div>

      {/* Adicionar mais seções financeiras aqui, como gráficos, tabelas de transações, etc. */}
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
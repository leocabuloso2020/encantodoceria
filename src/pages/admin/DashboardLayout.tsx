import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Home, Package, MessageSquare, LogOut, Heart, DollarSign } from 'lucide-react'; // Importa DollarSign
import { Button } from '@/components/ui/button';
import { useSession } from '@/components/SessionContextProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardLayout = () => {
  const { loading, isAdmin } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erro ao fazer logout.', { description: error.message });
    } else {
      toast.success('Logout realizado com sucesso!');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <aside className="w-64 bg-sidebar p-6 border-r border-sidebar-border flex flex-col justify-between">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48 mb-8" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" /> {/* Adicionado para o novo item */}
          </div>
          <Skeleton className="h-10 w-full" />
        </aside>
        <main className="flex-1 p-8">
          <Skeleton className="h-12 w-1/3 mb-8" />
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    // This case should ideally be handled by SessionContextProvider redirect,
    // but as a fallback, we can show a message or redirect.
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-destructive text-lg">Acesso negado. Você não é um administrador.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar p-6 border-r border-sidebar-border flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <Heart className="h-6 w-6 text-primary" fill="currentColor" />
            <h2 className="font-dancing text-xl font-bold text-sidebar-foreground">Admin Paty</h2>
          </div>
          <nav className="space-y-2">
            <Link to="/admin" className="flex items-center space-x-3 p-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200">
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link to="/admin/products" className="flex items-center space-x-3 p-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200">
              <Package className="h-5 w-5" />
              <span>Produtos</span>
            </Link>
            <Link to="/admin/messages" className="flex items-center space-x-3 p-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200">
              <MessageSquare className="h-5 w-5" />
              <span>Mensagens</span>
            </Link>
            <Link to="/admin/financeiro" className="flex items-center space-x-3 p-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200">
              <DollarSign className="h-5 w-5" />
              <span>Financeiro</span>
            </Link>
          </nav>
        </div>
        <Button 
          onClick={handleLogout} 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet /> {/* Renders child routes */}
      </main>
    </div>
  );
};

export default DashboardLayout;
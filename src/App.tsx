import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import DashboardLayout from "./pages/admin/DashboardLayout";
import AdminProducts from "./pages/admin/Products";
import AdminMessages from "./pages/admin/Messages"; // Importa o novo componente de mensagens
import { SessionContextProvider } from "./components/SessionContextProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionContextProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            {/* Rotas do Admin */}
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<AdminProducts />} /> {/* Default admin page */}
              <Route path="products" element={<AdminProducts />} />
              <Route path="messages" element={<AdminMessages />} /> {/* Nova rota para mensagens */}
              {/* ADD ALL CUSTOM ADMIN ROUTES HERE */}
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SessionContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
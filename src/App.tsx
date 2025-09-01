import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import DashboardLayout from "./pages/admin/DashboardLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminFinanceiro from "./pages/admin/Financeiro";
import AdminOrders from "./pages/admin/Orders";
import AdminSweetNotes from "./pages/admin/SweetNotes";
import AdminMessages from "./pages/admin/Messages";
import MyOrders from "./pages/MyOrders";
import OrderConfirmation from "./pages/OrderConfirmation";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites"; // Importar a nova página
import { SessionContextProvider } from "./components/SessionContextProvider";
import { CartProvider } from "./context/CartContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <SessionContextProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/favorites" element={<Favorites />} /> {/* Nova rota de favoritos */}
              {/* Rotas do Admin */}
              <Route path="/admin" element={<DashboardLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="financeiro" element={<AdminFinanceiro />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="sweet-notes" element={<AdminSweetNotes />} />
                <Route path="messages" element={<AdminMessages />} />
                {/* ADD ALL CUSTOM ADMIN ROUTES HERE */}
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </SessionContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
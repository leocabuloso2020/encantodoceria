import { Heart, Menu, X, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@/components/SessionContextProvider";
import { useCart } from "@/hooks/use-cart";
import CartDrawer from "./CartDrawer";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, loading: sessionLoading } = useSession();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleScrollToSection = (id: string) => {
    closeMobileMenu();

    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToId: id } });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Heart className="h-8 w-8 text-primary animate-pulse" fill="currentColor" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-bounce"></div>
              </div>
              <div>
                <h1 className="font-dancing text-2xl font-bold gradient-text">Encanto Doceria</h1>
                <p className="text-sm text-muted-foreground">Trufas artesanais feitas com amor</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <a 
                onClick={() => handleScrollToSection('produtos')} 
                className="cursor-pointer text-sm lg:text-base text-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                Produtos
              </a>
              <a 
                onClick={() => handleScrollToSection('sobre')} 
                className="cursor-pointer text-sm lg:text-base text-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                Sobre
              </a>
              <a 
                onClick={() => handleScrollToSection('como-funciona')} 
                className="cursor-pointer text-sm lg:text-base text-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                Como Funciona
              </a>
              <a 
                onClick={() => handleScrollToSection('contato')} 
                className="cursor-pointer text-sm lg:text-base text-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                Contato
              </a>
              {!sessionLoading && user && (
                <>
                  <Link to="/my-orders" className="text-sm lg:text-base text-foreground hover:text-primary transition-colors duration-300 font-medium flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Meus Pedidos
                  </Link>
                  <Link to="/favorites" className="text-sm lg:text-base text-foreground hover:text-primary transition-colors duration-300 font-medium flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    Favoritos
                  </Link>
                  <Link to="/profile" className="text-sm lg:text-base text-foreground hover:text-primary transition-colors duration-300 font-medium flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Perfil
                  </Link>
                </>
              )}
              {!sessionLoading && !user && (
                <Link to="/login" className="text-sm lg:text-base text-foreground hover:text-primary transition-colors duration-300 font-medium">
                  Login
                </Link>
              )}
              {/* Ícone do Carrinho */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-lg hover:bg-accent transition-colors duration-300"
                aria-label="Abrir Carrinho"
              >
                <ShoppingBag className="h-6 w-6 text-foreground" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              {/* Ícone do Carrinho para Mobile */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-lg hover:bg-accent transition-colors duration-300 mr-2"
                aria-label="Abrir Carrinho"
              >
                <ShoppingBag className="h-6 w-6 text-foreground" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-accent transition-colors duration-300"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-foreground" />
                ) : (
                  <Menu className="h-6 w-6 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur border-t border-border/50">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              <a 
                onClick={() => handleScrollToSection('produtos')} 
                className="cursor-pointer text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
              >
                Produtos
              </a>
              <a 
                onClick={() => handleScrollToSection('sobre')} 
                className="cursor-pointer text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
              >
                Sobre
              </a>
              <a 
                onClick={() => handleScrollToSection('como-funciona')} 
                className="cursor-pointer text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
              >
                Como Funciona
              </a >
              <a 
                onClick={() => handleScrollToSection('contato')} 
                className="cursor-pointer text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
              >
                Contato
              </a >
              {!sessionLoading && user && (
                <>
                  <Link 
                    to="/my-orders" 
                    className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-2 flex items-center"
                    onClick={closeMobileMenu}
                  >
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Meus Pedidos
                  </Link>
                  <Link 
                    to="/favorites" 
                    className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-2 flex items-center"
                    onClick={closeMobileMenu}
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    Favoritos
                  </Link>
                  <Link 
                    to="/profile" 
                    className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-2 flex items-center"
                    onClick={closeMobileMenu}
                  >
                    <User className="h-4 w-4 mr-1" />
                    Perfil
                  </Link>
                </>
              )}
              {!sessionLoading && !user && (
                <Link 
                  to="/login" 
                  className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
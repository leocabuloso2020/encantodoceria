import { Heart, Menu, X, ShoppingBag } from "lucide-react"; // Adicionado ShoppingBag
import { useState } from "react";
import { Link } from "react-router-dom"; // Importar Link do react-router-dom
import { useSession } from "@/components/SessionContextProvider"; // Importar useSession

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading: sessionLoading } = useSession(); // Obter o usuário logado

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Heart className="h-8 w-8 text-primary animate-pulse" fill="currentColor" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-bounce"></div>
            </div>
            <div>
              <h1 className="font-dancing text-2xl font-bold gradient-text">Doces da Paty</h1>
              <p className="text-sm text-muted-foreground">Trufas artesanais feitas com amor</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <a href="#produtos" className="text-sm lg:text-base text-foreground hover:text-primary transition-colors duration-300 font-medium">
              Produtos
            </a>
            <a href="#sobre" className="text-sm lg:text-base text-foreground hover:text-primary transition-colors duration-300 font-medium">
              Sobre
            </a>
            <a href="#como-funciona" className="text-sm lg:text-base text-foreground hover:text-primary transition-colors duration-300 font-medium">
              Como Funciona
            </a>
            <a href="#contato" className="text-sm lg:text-base text-foreground hover:text-primary transition-colors duration-300 font-medium">
              Contato
            </a>
            {!sessionLoading && user && ( // Mostrar "Meus Pedidos" se o usuário estiver logado
              <Link to="/my-orders" className="text-sm lg:text-base text-foreground hover:text-primary transition-colors duration-300 font-medium flex items-center">
                <ShoppingBag className="h-4 w-4 mr-1" />
                Meus Pedidos
              </Link>
            )}
            {!sessionLoading && !user && ( // Mostrar "Login" se o usuário não estiver logado
              <Link to="/login" className="text-sm lg:text-base text-foreground hover:text-primary transition-colors duration-300 font-medium">
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors duration-300"
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

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur border-t border-border/50">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              <a 
                href="#produtos" 
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
                onClick={closeMobileMenu}
              >
                Produtos
              </a>
              <a 
                href="#sobre" 
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
                onClick={closeMobileMenu}
              >
                Sobre
              </a>
              <a 
                href="#como-funciona" 
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
                onClick={closeMobileMenu}
              >
                Como Funciona
              </a>
              <a 
                href="#contato" 
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
                onClick={closeMobileMenu}
              >
                Contato
              </a>
              {!sessionLoading && user && (
                <Link 
                  to="/my-orders" 
                  className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-2 flex items-center"
                  onClick={closeMobileMenu}
                >
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  Meus Pedidos
                </Link>
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
    </header>
  );
};

export default Header;
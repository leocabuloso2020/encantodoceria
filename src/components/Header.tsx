import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
import { Heart, Phone, MessageCircle, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-secondary to-secondary-soft border-t border-border/50" id="contato">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-primary" fill="currentColor" />
              <h3 className="font-dancing text-2xl font-bold gradient-text">Doces da Paty</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Criado por Paola Ribeiro com muito amor e ingredientes selecionados. 
              Saboreie momentos especiais com nossos doces únicos.
            </p>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Fale Conosco</h4>
            <div className="space-y-3">
              <a 
                href="tel:31993305095" 
                className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                <Phone className="h-5 w-5" />
                <span>(31) 9 9330-5095</span>
              </a>
              
              <a 
                href="https://wa.me/5531993305095" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                <MessageCircle className="h-5 w-5" />
                <span>WhatsApp</span>
              </a>
              
              <a 
                href="#" 
                className="flex items-center space-x-3 text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                <Instagram className="h-5 w-5" />
                <span>@docesdapaty</span>
              </a>
            </div>
          </div>

          {/* Informações */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Informações</h4>
            <div className="space-y-2 text-muted-foreground">
              <p className="text-sm">🚚 Entrega no mesmo dia</p>
              <p className="text-sm">💳 Pagamento via PIX</p>
              <p className="text-sm">📦 Embalagem especial inclusa</p>
              <p className="text-sm">⭐ Garantia de qualidade</p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-primary">Chave PIX para pagamentos:</p>
              <p className="text-sm text-foreground font-mono">31993305095</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Doces da Paty. Feito com{" "}
            <Heart className="inline h-4 w-4 text-primary mx-1" fill="currentColor" />
            para adoçar seus momentos especiais.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
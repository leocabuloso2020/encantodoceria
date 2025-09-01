import { ShoppingBag, CreditCard, Truck, Heart } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: ShoppingBag,
    title: "Escolha seus Doces",
    description: "Navegue por nossa seleção de trufas artesanais e escolha seus sabores favoritos",
    color: "primary"
  },
  {
    id: 2,
    icon: CreditCard,
    title: "Pague via PIX",
    description: "Clique em 'Comprar via PIX' e será redirecionado para o pagamento instantâneo",
    color: "accent"
  },
  {
    id: 3,
    icon: Truck,
    title: "Entrega Rápida",
    description: "Após confirmarmos o pagamento, preparamos e entregamos no mesmo dia",
    color: "primary"
  },
  {
    id: 4,
    icon: Heart,
    title: "Saboreie a Felicidade",
    description: "Receba seus doces fresquinhos e desfrute de momentos especiais",
    color: "accent"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-background to-secondary-soft" id="como-funciona">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
            Como Funciona
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Processo simples e rápido para você receber seus doces favoritos
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              // const isEven = index % 2 === 0; // Removido: 'isEven' não utilizada
              
              return (
                <div 
                  key={step.id}
                  className="relative opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Connecting line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-accent/30 z-0"></div>
                  )}
                  
                  <div className="relative bg-gradient-to-br from-card to-secondary-soft rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border/50 z-10">
                    <div className="relative mb-6">
                      <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg ${
                        step.color === 'primary' 
                          ? 'bg-gradient-to-br from-primary to-primary-hover' 
                          : 'bg-gradient-to-br from-accent to-accent-soft'
                      }`}>
                        <IconComponent className="h-10 w-10 text-white" />
                      </div>
                      
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center text-sm font-bold">
                        {step.id}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      {step.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-16 opacity-0 animate-[fadeInUp_0.6s_ease-out_1s_forwards]">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Dúvidas sobre o processo?
              </h3>
              <p className="text-muted-foreground mb-6">
                Entre em contato conosco pelo WhatsApp e tire todas as suas dúvidas!
              </p>
              <a
                href="https://wa.me/5531993305095"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Heart className="h-5 w-5" fill="currentColor" />
                <span>Falar no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
import { Button } from "@/components/ui/button";
import { Heart, Star, Gift } from "lucide-react";

const Hero = () => {
  const scrollToProducts = () => {
    document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background via-secondary-soft to-accent-soft overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 animate-float">
          <Heart className="h-8 w-8 text-primary/30" fill="currentColor" />
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
          <Star className="h-6 w-6 text-accent/40" fill="currentColor" />
        </div>
        <div className="absolute bottom-32 left-1/4 animate-float" style={{ animationDelay: '2s' }}>
          <Gift className="h-10 w-10 text-primary/20" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-float" style={{ animationDelay: '0.5s' }}>
          <Heart className="h-4 w-4 text-accent/50" fill="currentColor" />
        </div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.2s_forwards] pb-4">
            <h1 className="font-dancing text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight py-2">
              Doces da Paty
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              Trufas artesanais feitas com ingredientes premium e muito carinho. 
              Cada doce é uma pequena obra de arte que desperta seus sentidos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 animate-[fadeInUp_0.6s_ease-out_0.5s_forwards] px-4">
            <Button 
              onClick={scrollToProducts}
              size="lg"
              className="pix-button bg-primary hover:bg-primary-hover text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl w-full sm:w-auto sm:min-w-[200px]"
            >
              <Gift className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Ver Produtos
            </Button>
            
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                ))}
              </div>
              <span className="text-sm font-medium">Avaliação 5 estrelas</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.8s_forwards]">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary" fill="currentColor" />
              </div>
              <h3 className="font-semibold text-foreground">Feito com Amor</h3>
              <p className="text-sm text-muted-foreground">Cada doce é preparado artesanalmente com muito carinho</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-accent" fill="currentColor" />
              </div>
              <h3 className="font-semibold text-foreground">Ingredientes Premium</h3>
              <p className="text-sm text-muted-foreground">Utilizamos apenas os melhores ingredientes selecionados</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-secondary/30 rounded-full flex items-center justify-center">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Entrega Rápida</h3>
              <p className="text-sm text-muted-foreground">Pagamento por PIX e entrega no mesmo dia</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
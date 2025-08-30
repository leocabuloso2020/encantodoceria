import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Maria Santos",
    location: "Belo Horizonte",
    rating: 5,
    comment: "As trufas da Paty são simplesmente divinas! O sabor é incrível e a entrega super rápida. Já virei cliente fiel!",
    product: "Trufa de Chocolate Belga"
  },
  {
    id: 2,
    name: "João Silva",
    location: "Contagem",
    rating: 5,
    comment: "Encomendei para o aniversário da minha esposa e foi um sucesso! Qualidade excepcional e embalagem linda.",
    product: "Kit Mini Cupcakes"
  },
  {
    id: 3,
    name: "Ana Costa",
    location: "Nova Lima",
    rating: 5,
    comment: "A trufa de morango é a melhor que já provei! Cremosa, saborosa e feita com muito capricho. Recomendo!",
    product: "Trufa de Morango"
  },
  {
    id: 4,
    name: "Carlos Lima",
    location: "Betim",
    rating: 5,
    comment: "Atendimento impecável e produtos de altíssima qualidade. O pagamento via PIX é super prático. Nota 10!",
    product: "Brigadeiro Gourmet"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cada sorriso e cada elogio nos motivam a continuar criando momentos doces especiais
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="relative bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Quote className="h-4 w-4 text-primary-foreground" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{testimonial.product}</span>
                  </div>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed italic">
                    "{testimonial.comment}"
                  </p>
                  
                  <div className="border-t border-border/50 pt-4">
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20 inline-block">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-primary fill-primary" />
                ))}
              </div>
              <span className="text-2xl font-bold text-foreground">5.0</span>
            </div>
            <p className="text-lg font-semibold text-foreground mb-2">Avaliação média dos clientes</p>
            <p className="text-sm text-muted-foreground">Baseado em mais de 500 avaliações</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
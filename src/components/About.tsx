import { Heart, Award, Users, Clock } from "lucide-react";

const About = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-secondary-soft to-accent-soft" id="sobre">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
              Nossa História
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Uma paixão que começou na cozinha de casa e se transformou em momentos especiais para centenas de famílias
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <div className="opacity-0 animate-[fadeInUp_0.6s_ease-out_0.2s_forwards]">
                <h3 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                  <Heart className="h-6 w-6 text-primary mr-3" fill="currentColor" />
                  A Paixão pelos Doces
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tudo começou com uma receita de família e o sonho de levar felicidade através dos sabores únicos. 
                  Cada trufa é preparada artesanalmente, com ingredientes cuidadosamente selecionados e muito amor.
                </p>
              </div>
              
              <div className="opacity-0 animate-[fadeInUp_0.6s_ease-out_0.4s_forwards]">
                <h3 className="text-2xl font-semibold text-foreground mb-4 flex items-center">
                  <Award className="h-6 w-6 text-accent mr-3" />
                  Qualidade Premium
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Utilizamos apenas chocolates belgas, frutas frescas e ingredientes importados. 
                  Cada doce passa por um rigoroso controle de qualidade antes de chegar até você.
                </p>
              </div>
            </div>

            <div className="relative opacity-0 animate-[fadeInUp_0.6s_ease-out_0.6s_forwards]">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 backdrop-blur-sm border border-primary/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="text-3xl font-bold text-foreground">500+</h4>
                    <p className="text-sm text-muted-foreground">Clientes Felizes</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-primary/30 rounded-full flex items-center justify-center mb-4">
                      <Heart className="h-8 w-8 text-primary" fill="currentColor" />
                    </div>
                    <h4 className="text-3xl font-bold text-foreground">100%</h4>
                    <p className="text-sm text-muted-foreground">Feito com Amor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-card to-secondary-soft rounded-3xl p-12 shadow-lg border border-border/50 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.8s_forwards]">
            <blockquote className="text-2xl md:text-3xl font-semibold text-foreground mb-6 leading-relaxed">
              "Cada trufa é como um abraço doce, feita para criar momentos especiais e memórias inesquecíveis"
            </blockquote>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary" fill="currentColor" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Paola Ribeiro</p>
                <p className="text-sm text-muted-foreground">Fundadora - Doces da Paty</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
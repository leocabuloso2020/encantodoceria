import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqData = [
  {
    question: "Como funciona o pagamento via PIX?",
    answer: "Muito simples! Ao clicar em 'Comprar via PIX', você será redirecionado automaticamente para seu aplicativo bancário com o valor e nossa chave PIX (31993305095) já preenchidos. Após o pagamento, confirmaremos automaticamente e prepararemos seu pedido."
  },
  {
    question: "Quanto tempo demora para entregar?",
    answer: "Trabalhamos com entrega no mesmo dia! Após a confirmação do pagamento, preparamos seus doces fresquinhos e entregamos em até 4 horas na região de Belo Horizonte e cidades próximas."
  },
  {
    question: "Os doces são realmente artesanais?",
    answer: "Sim! Todos os nossos doces são feitos à mão, com ingredientes premium selecionados. Utilizamos chocolate belga, frutas frescas e seguimos receitas desenvolvidas especialmente com muito carinho e dedicação."
  },
  {
    question: "Vocês fazem encomendas para festas?",
    answer: "Claro! Atendemos encomendas especiais para aniversários, casamentos e eventos. Entre em contato pelo WhatsApp (31) 9 9330-5095 para orçamentos personalizados e quantidades maiores."
  },
  {
    question: "Como posso saber se meu pedido foi confirmado?",
    answer: "Após o pagamento via PIX, você receberá uma confirmação automática pelo WhatsApp com todos os detalhes do seu pedido e prazo de entrega. Também acompanhamos todo o processo até a entrega."
  },
  {
    question: "Qual a validade dos doces?",
    answer: "Nossos doces são preparados frescos e têm validade de 7 dias quando armazenados em temperatura ambiente, ou até 15 dias na geladeira. Recomendamos consumir logo para aproveitar o sabor no seu melhor!"
  },
  {
    question: "Posso cancelar meu pedido?",
    answer: "Sim, você pode cancelar seu pedido em até 30 minutos após o pagamento entrando em contato conosco pelo WhatsApp. Após esse prazo, como já iniciamos a preparação, não conseguimos cancelar."
  },
  {
    question: "Vocês atendem pessoas com restrições alimentares?",
    answer: "Alguns de nossos produtos podem ser adaptados para pessoas com restrições. Entre em contato pelo WhatsApp informando sua necessidade específica (sem glúten, sem lactose, vegano) que verificaremos as opções disponíveis."
  }
];

const FAQ = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-background to-secondary-soft">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tire suas dúvidas sobre nossos produtos e processo de compra
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-gradient-to-r from-card to-secondary-soft border border-border/50 rounded-2xl px-6 shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-6 text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-16 opacity-0 animate-[fadeInUp_0.6s_ease-out_1s_forwards]">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Ainda tem dúvidas?
              </h3>
              <p className="text-muted-foreground mb-6">
                Nossa equipe está sempre pronta para ajudar! Entre em contato pelo WhatsApp.
              </p>
              <a
                href="https://wa.me/5531993305095"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-lg"
              >
                <HelpCircle className="h-5 w-5" />
                <span>Falar no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
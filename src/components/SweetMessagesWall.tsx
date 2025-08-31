import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageSquareText, Send } from "lucide-react";
import { useMessages } from "@/hooks/use-messages";
import { useCreateMessage } from "@/hooks/use-create-message";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const messageSchema = z.object({
  author_name: z.string().min(2, { message: "Seu nome deve ter pelo menos 2 caracteres." }).nonempty({ message: "O nome não pode ser vazio." }),
  author_email: z.string().email({ message: "E-mail inválido." }).optional().or(z.literal('')),
  message: z.string().min(10, { message: "A mensagem deve ter pelo menos 10 caracteres." }).max(500, { message: "A mensagem não pode exceder 500 caracteres." }).nonempty({ message: "A mensagem não pode ser vazia." }),
});

type MessageFormValues = z.infer<typeof messageSchema>;

const SweetMessagesWall = () => {
  const { data: messages, isLoading, isError, error } = useMessages();
  const createMessageMutation = useCreateMessage();

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      author_name: "",
      author_email: "",
      message: "",
    },
  });

  const onSubmit = async (values: MessageFormValues) => {
    await createMessageMutation.mutateAsync(values);
    form.reset(); // Limpa o formulário após o envio
  };

  return (
    <section className="py-20 bg-gradient-to-br from-background to-secondary-soft" id="mural-mensagens">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <MessageSquareText className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
            Mural de Mensagens Doces
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Deixe seu carinho e veja o que outros clientes estão dizendo sobre nossos doces!
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Formulário para Enviar Mensagem */}
          <Card className="lg:col-span-1 bg-gradient-to-r from-card to-accent-soft border-border/50 shadow-lg p-6 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.2s_forwards]">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-foreground flex items-center space-x-2">
                <Heart className="h-6 w-6 text-primary" fill="currentColor" />
                <span>Deixe sua Mensagem</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="author_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seu Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Maria Doce" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="author_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seu E-mail (Opcional)</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="exemplo@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sua Mensagem Doce</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Escreva o que você achou dos nossos doces!"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full pix-button" disabled={createMessageMutation.isPending}>
                    <Send className="h-4 w-4 mr-2" />
                    {createMessageMutation.isPending ? "Enviando..." : "Enviar Mensagem"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Mural de Mensagens */}
          <div className="lg:col-span-2 space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-lg" />
                ))}
              </div>
            ) : isError ? (
              <p className="text-destructive text-center">Erro ao carregar mensagens: {error?.message}</p>
            ) : messages && messages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.map((msg, index) => (
                  <Card 
                    key={msg.id} 
                    className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                    style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground text-lg">{msg.author_name}</h4>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(msg.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                      <p className="text-muted-foreground italic leading-relaxed">
                        "{msg.message}"
                      </p>
                      <div className="flex justify-end">
                        <Heart className="h-4 w-4 text-primary fill-primary" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center text-lg py-8">
                Nenhum bilhetinho doce ainda. Seja o primeiro a deixar o seu!
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SweetMessagesWall;
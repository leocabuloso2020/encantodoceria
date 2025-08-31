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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSweetNote, useUpsertSweetNote } from "@/hooks/use-sweet-note";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import React from "react";

const sweetNoteSchema = z.object({
  title: z.string().max(100, { message: "O título não pode exceder 100 caracteres." }).optional().nullable(),
  content: z.string().min(10, { message: "O conteúdo deve ter pelo menos 10 caracteres." }).max(500, { message: "O conteúdo não pode exceder 500 caracteres." }),
  is_active: z.boolean().default(false),
});

type SweetNoteFormValues = z.infer<typeof sweetNoteSchema>;

const AdminSweetNotes = () => {
  const { data: sweetNote, isLoading, isError, error } = useSweetNote();
  const upsertSweetNoteMutation = useUpsertSweetNote();

  const form = useForm<SweetNoteFormValues>({
    resolver: zodResolver(sweetNoteSchema),
    defaultValues: {
      title: "",
      content: "",
      is_active: false,
    },
  });

  React.useEffect(() => {
    if (sweetNote) {
      form.reset({
        title: sweetNote.title,
        content: sweetNote.content,
        is_active: sweetNote.is_active,
      });
    }
  }, [sweetNote, form]);

  const onSubmit = async (values: SweetNoteFormValues) => {
    await upsertSweetNoteMutation.mutateAsync({
      id: sweetNote?.id, // Passa o ID se estiver editando
      title: values.title,
      content: values.content,
      is_active: values.is_active,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bilhetinho Doce</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Erro ao carregar bilhetinho: {error?.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center space-x-2">
          <Heart className="h-6 w-6 text-primary" fill="currentColor" />
          <span>Gerenciar Bilhetinho Doce</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título (Interno para Admin)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Mensagem de Boas-Vindas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo do Bilhetinho</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escreva uma mensagem fofa para seus clientes! Ex: 'Olá, que seu dia seja tão doce quanto nossas trufas!'"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Exibir Bilhetinho no Site?</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={upsertSweetNoteMutation.isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={upsertSweetNoteMutation.isPending}>
              {upsertSweetNoteMutation.isPending ? "Salvando..." : "Salvar Bilhetinho"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AdminSweetNotes;
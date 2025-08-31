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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShoppingBag } from "lucide-react";

const customerDetailsSchema = z.object({
  customer_name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  customer_contact: z.string().min(9, { message: "O contato deve ter pelo menos 9 dígitos (ex: 31999998888)." }).max(15, { message: "O contato não deve exceder 15 dígitos." }),
});

type CustomerDetailsFormValues = z.infer<typeof customerDetailsSchema>;

interface CustomerDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (values: CustomerDetailsFormValues) => void;
  productName: string; // Agora pode ser um texto genérico como "itens do carrinho"
  totalAmount: number;
}

const CustomerDetailsDialog = ({ isOpen, onClose, onConfirm, productName, totalAmount }: CustomerDetailsDialogProps) => {
  const form = useForm<CustomerDetailsFormValues>({
    resolver: zodResolver(customerDetailsSchema),
    defaultValues: {
      customer_name: "",
      customer_contact: "",
    },
  });

  const handleSubmit = (values: CustomerDetailsFormValues) => {
    onConfirm(values);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-dancing gradient-text text-2xl">Finalizar Pedido</DialogTitle>
          <DialogDescription>
            Para prosseguir com a compra de <span className="font-semibold text-foreground">{productName}</span> (R$ {totalAmount.toFixed(2)}), por favor, informe seus dados.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customer_contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu Contato (WhatsApp)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 31999998888" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full pix-button" disabled={form.formState.isSubmitting}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Confirmar e Pagar via PIX
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsDialog;
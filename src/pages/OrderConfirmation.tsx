import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderDetails } from '@/hooks/use-order-details';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Copy, DollarSign, CalendarDays, User, Phone, ShoppingBag, QrCode } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import QRCode from 'qrcode.react'; // Importar qrcode.react
import { supabase } from '@/integrations/supabase/client'; // Importar supabase para chamar Edge Function

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, isError, error } = useOrderDetails(orderId || null);
  const [brCode, setBrCode] = React.useState<string | null>(null);
  const [isGeneratingQr, setIsGeneratingQr] = React.useState(false);

  const pixKey = "31993305095"; // Chave PIX fixa
  const merchantName = "Encanto Doceria";
  const merchantCity = "Belo Horizonte"; // Ou a cidade da sua empresa

  React.useEffect(() => {
    const generateQrCode = async () => {
      if (order && orderId && !brCode && !isGeneratingQr) {
        setIsGeneratingQr(true);
        try {
          const { data, error } = await supabase.functions.invoke('generate-pix-qr', {
            body: {
              pixKey: pixKey,
              amount: order.total_amount.toFixed(2),
              transactionId: orderId.substring(0, 25), // Usar parte do ID do pedido como ID da transação
              merchantName: merchantName,
              merchantCity: merchantCity,
            },
          });

          if (error) {
            console.error('Error invoking generate-pix-qr function:', error);
            toast.error("Erro ao gerar QR Code PIX.", { description: error.message });
          } else if (data && data.brCode) {
            setBrCode(data.brCode);
          }
        } catch (err: any) {
          console.error('Unexpected error generating QR Code:', err);
          toast.error("Erro inesperado ao gerar QR Code PIX.", { description: err.message });
        } finally {
          setIsGeneratingQr(false);
        }
      }
    };

    generateQrCode();
  }, [order, orderId, brCode, isGeneratingQr]);

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    toast.success("Chave PIX copiada!", { description: "Agora é só colar no seu aplicativo bancário." });
  };

  const handleOpenPixApp = () => {
    if (order) {
      const amount = order.total_amount.toFixed(2);
      const description = `Encanto Doceria - Pedido ${order.id.substring(0, 8)}`;
      const pixUrl = `pix://${pixKey}?amount=${amount}&description=${encodeURIComponent(description)}`;
      window.location.href = pixUrl;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg">
            <CardHeader className="text-center">
              <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-destructive font-dancing gradient-text">
                Erro ao Carregar Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground mb-6">
                Não foi possível encontrar os detalhes do seu pedido ou houve um erro.
                <br />
                {error?.message || "Por favor, verifique o link ou tente novamente."}
              </p>
              <Button onClick={() => navigate('/')} className="pix-button">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Voltar para Produtos
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg max-w-3xl mx-auto">
          <CardHeader className="text-center pb-6">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4 animate-bounce-in" />
            <CardTitle className="text-4xl font-bold text-foreground font-dancing gradient-text">
              Pedido Recebido!
            </CardTitle>
            <p className="text-lg text-muted-foreground mt-2">
              Seu pedido foi registrado com sucesso. Agora, finalize o pagamento via PIX.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground flex items-center mb-1">
                  <User className="h-4 w-4 mr-2" /> Cliente:
                </p>
                <p className="font-medium text-foreground">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center mb-1">
                  <Phone className="h-4 w-4 mr-2" /> Contato:
                </p>
                <p className="font-medium text-foreground">{order.customer_contact}</p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center mb-1">
                  <CalendarDays className="h-4 w-4 mr-2" /> Data do Pedido:
                </p>
                <p className="font-medium text-foreground">
                  {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center mb-1">
                  <DollarSign className="h-4 w-4 mr-2" /> Total:
                </p>
                <p className="font-bold text-primary text-xl">R$ {order.total_amount.toFixed(2)}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
                Pague com PIX
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Escaneie o QR Code abaixo ou use a chave PIX para transferir o valor de <span className="font-bold text-primary">R$ {order.total_amount.toFixed(2)}</span>.
                Seu pedido será confirmado automaticamente após o pagamento.
              </p>
              
              <div className="flex flex-col items-center justify-center gap-4 mb-6">
                {isGeneratingQr ? (
                  <Skeleton className="h-48 w-48 rounded-lg" />
                ) : brCode ? (
                  <div className="p-4 bg-white rounded-lg shadow-md border border-border/50">
                    <QRCode value={brCode} size={192} level="H" />
                  </div>
                ) : (
                  <div className="text-destructive flex items-center space-x-2">
                    <QrCode className="h-6 w-6" />
                    <span>Não foi possível gerar o QR Code.</span>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm">
                  <div className="bg-secondary-soft border border-border/50 rounded-lg p-3 flex items-center justify-between w-full flex-grow">
                    <span className="font-mono text-foreground text-lg">{pixKey}</span>
                    <Button variant="ghost" size="icon" onClick={handleCopyPixKey} className="ml-2">
                      <Copy className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </Button>
                  </div>
                  <Button onClick={handleOpenPixApp} className="pix-button w-full sm:w-auto">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Abrir App PIX
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Você também pode acompanhar o status do seu pedido na seção "Meus Pedidos".
              </p>
              <Button variant="outline" onClick={() => navigate('/my-orders')} className="hover:bg-primary/10">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Ver Meus Pedidos
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
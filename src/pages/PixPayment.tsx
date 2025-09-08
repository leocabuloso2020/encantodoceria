import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { QrCode, Copy, Clock, CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import * as QRCodeModule from 'qrcode.react'; // Importação de namespace
import { PixDetails } from '@/hooks/use-create-order'; // Importar o tipo PixDetails

const PixPayment = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const pixDetails: PixDetails | undefined = location.state?.pixDetails;

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!pixDetails || !orderId) {
      toast.error("Detalhes do PIX não encontrados.", {
        description: "Redirecionando para a página inicial.",
      });
      navigate('/');
      return;
    }

    // A Efi retorna a expiração em segundos a partir do momento da criação.
    // Precisamos calcular o tempo restante.
    // Para simplificar, vamos assumir que `expiration_date` é o tempo total em segundos.
    // Se `expiration_date` for um timestamp, precisaríamos ajustar.
    // Por enquanto, vamos usar o valor bruto como segundos restantes.
    setTimeLeft(pixDetails.expiration_date);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === null) return null;
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          toast.error("Pagamento PIX expirado!", {
            description: "Por favor, refaça o pedido para gerar um novo PIX.",
          });
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [pixDetails, orderId, navigate]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "Carregando...";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCopyPixCode = useCallback(() => {
    if (pixDetails?.qrcode_payload) {
      navigator.clipboard.writeText(pixDetails.qrcode_payload);
      toast.success("Código PIX copiado!", {
        description: "Agora cole no seu aplicativo bancário para finalizar o pagamento.",
      });
    } else {
      toast.error("Não foi possível copiar o código PIX.");
    }
  }, [pixDetails]);

  if (!pixDetails || !orderId) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card className="bg-gradient-to-br from-card to-secondary-soft border-border/50 shadow-lg max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <CardTitle className="text-3xl font-bold text-destructive font-dancing gradient-text">
                Erro ao Carregar Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground mb-6">
                Não foi possível encontrar os detalhes do pagamento PIX.
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
            <QrCode className="h-16 w-16 text-primary mx-auto mb-4 animate-bounce-in" />
            <CardTitle className="text-4xl font-bold text-foreground font-dancing gradient-text">
              Pagamento PIX
            </CardTitle>
            <p className="text-lg text-muted-foreground mt-2">
              Escaneie o QR Code ou copie o código para pagar.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              {isExpired ? (
                <div className="text-center text-destructive text-xl font-semibold flex items-center space-x-2">
                  <AlertCircle className="h-6 w-6" />
                  <span>PIX Expirado!</span>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-white rounded-lg shadow-md border border-border/50">
                    <QRCodeModule.default value={pixDetails.qrcode_payload} size={256} level="H" />
                  </div>
                  <div className="flex items-center space-x-2 text-lg font-semibold text-foreground">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Tempo restante: {formatTime(timeLeft)}</span>
                  </div>
                </>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground text-center">Código PIX Copia e Cola</h3>
              <div className="flex items-center space-x-2">
                <div className="flex-1 p-3 border border-border/50 rounded-md bg-muted text-muted-foreground text-sm break-all">
                  {pixDetails.qrcode_payload}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyPixCode}
                  disabled={isExpired}
                  className="h-10 w-10"
                >
                  <Copy className="h-5 w-5" />
                  <span className="sr-only">Copiar código PIX</span>
                </Button>
              </div>
            </div>

            <Separator />

            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Após o pagamento, seu pedido será automaticamente confirmado.
              </p>
              <Button onClick={() => navigate(`/order-confirmation/${orderId}`)} className="pix-button" disabled={isExpired}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Ver Status do Pedido
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PixPayment;
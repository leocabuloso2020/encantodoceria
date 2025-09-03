import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'; // Corrigido: Adicionado 'from'

console.log("DEBUG: Starting mercadopago-webhook module load."); // Added for debugging

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função para verificar a assinatura do webhook do Mercado Pago usando a Web Crypto API
async function verifySignature(
  rawRequestBody: string, // Adicionado: corpo da requisição
  xSignature: string,
  xRequestId: string,
  secret: string
): Promise<boolean> {
  console.log("Iniciando verificação de assinatura com Web Crypto API...");
  
  // --- NOVOS LOGS DE DEBUG ---
  console.log("DEBUG: Secret length:", secret.length); 
  console.log("DEBUG: xSignature header (raw):", xSignature);
  console.log("DEBUG: xRequestId header:", xRequestId);
  // --- FIM NOVOS LOGS DE DEBUG ---

  const signatureParts = xSignature.split(',');
  let ts = '';
  let v1 = '';

  for (const part of signatureParts) {
    if (part.startsWith('ts=')) {
      ts = part.substring(3);
    } else if (part.startsWith('v1=')) {
      v1 = part.substring(3);
    }
  }

  // --- NOVOS LOGS DE DEBUG ---
  console.log("DEBUG: Parsed ts:", ts);
  console.log("DEBUG: Parsed v1:", v1);
  console.log("DEBUG: Raw Request Body (for signature):", rawRequestBody);
  // --- FIM NOVOS LOGS DE DEBUG ---

  if (!ts || !v1) {
    console.error("Erro: 'ts' ou 'v1' ausentes no cabeçalho x-signature.");
    return false;
  }

  // CORRIGIDO: Incluindo o corpo da requisição na mensagem a ser assinada
  const message = `id:${xRequestId};ts:${ts};data:${rawRequestBody}`;
  console.log("Mensagem para assinar:", message); // Este log já existia, mas é crucial

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, messageData);

  // Converte o ArrayBuffer da assinatura para uma string hexadecimal
  const calculatedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  console.log("Assinatura calculada:", calculatedSignature);
  console.log("Assinatura recebida (v1):", v1);

  return calculatedSignature === v1;
}

serve(async (req) => {
  console.log("mercadopago-webhook function invoked - START.");

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MERCADO_PAGO_WEBHOOK_SECRET = Deno.env.get('MERCADO_PAGO_WEBHOOK_SECRET');
    const MERCADO_PAGO_ACCESS_TOKEN = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

    if (!MERCADO_PAGO_WEBHOOK_SECRET || !MERCADO_PAGO_ACCESS_TOKEN || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('Erro: Variáveis de ambiente do Mercado Pago ou Supabase não configuradas.');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Obter o corpo da requisição como texto para verificação de assinatura
    const rawRequestBody = await req.text();
    const webhookPayload = JSON.parse(rawRequestBody);

    console.log("Webhook Payload recebido:", webhookPayload);

    const xSignature = req.headers.get('x-signature');
    const xRequestId = req.headers.get('x-request-id');

    if (!xSignature || !xRequestId) {
      console.error("Erro: Cabeçalhos 'x-signature' ou 'x-request-id' ausentes.");
      return new Response(JSON.stringify({ error: 'Missing required headers' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // CORRIGIDO: Passando o rawRequestBody para a função verifySignature
    const isSignatureValid = await verifySignature(
      rawRequestBody,
      xSignature,
      xRequestId,
      MERCADO_PAGO_WEBHOOK_SECRET
    );

    if (!isSignatureValid) {
      console.error("Erro: Assinatura do webhook inválida.");
      return new Response(JSON.stringify({ error: 'Invalid webhook signature' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }
    console.log("Assinatura do webhook verificada com sucesso!");

    if (webhookPayload.type === 'payment' && webhookPayload.action === 'payment.updated') {
      const paymentId = webhookPayload.data.id;
      console.log("Webhook de pagamento recebido para ID:", paymentId);

      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!mpResponse.ok) {
        const errorBody = await mpResponse.json();
        console.error("Erro ao consultar API do Mercado Pago:", errorBody);
        return new Response(JSON.stringify({ error: 'Failed to fetch payment details from Mercado Pago', details: errorBody }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }

      const paymentDetails = await mpResponse.json();
      console.log("Detalhes do pagamento do Mercado Pago:", paymentDetails);

      const orderId = paymentDetails.external_reference;
      const paymentStatus = paymentDetails.status;

      let newOrderStatus: 'pending' | 'paid' | 'preparing' | 'delivered' | 'cancelled';
      switch (paymentStatus) {
        case 'approved': newOrderStatus = 'paid'; break;
        case 'pending': case 'in_process': newOrderStatus = 'pending'; break;
        case 'rejected': case 'cancelled': case 'refunded': case 'charged_back': newOrderStatus = 'cancelled'; break;
        default: newOrderStatus = 'pending';
      }

      console.log(`Atualizando pedido ${orderId} para status: ${newOrderStatus}`);

      const { data: updatedOrder, error: updateError } = await supabase
        .from('orders')
        .update({ status: newOrderStatus })
        .eq('id', orderId)
        .select()
        .single();

      if (updateError) {
        console.error('Erro ao atualizar status do pedido no Supabase:', updateError);
        return new Response(JSON.stringify({ error: 'Failed to update order status in Supabase', details: updateError.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }

      console.log("Pedido atualizado com sucesso no Supabase:", updatedOrder);

      return new Response(JSON.stringify({ message: 'Webhook processed successfully', orderStatus: newOrderStatus }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });

    } else {
      console.log("Webhook recebido, mas não é um evento de pagamento.updated. Ignorando.");
      return new Response(JSON.stringify({ message: 'Webhook type not handled' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

  } catch (error) {
    console.error('Erro geral na função mercadopago-webhook:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
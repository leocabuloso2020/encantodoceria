import { createClient } from '@supabase/supabase-js';
import { Request, Response } from 'express';

// Adicionado um novo log para forçar o deploy
console.log("DEBUG: mercadopago-webhook Vercel function - Removing debug block (Attempt 6)");

// Função para verificar a assinatura do webhook do Mercado Pago usando a Web Crypto API
async function verifySignature(
  rawRequestBody: string,
  xSignature: string,
  xRequestId: string,
  secret: string
): Promise<boolean> {
  console.log("Iniciando verificação de assinatura com Web Crypto API...");
  
  console.log("DEBUG: Secret length:", secret.length); 
  console.log("DEBUG: xSignature header (raw):", xSignature);
  console.log("DEBUG: xRequestId header:", xRequestId);

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

  console.log("DEBUG: Parsed ts:", ts);
  console.log("DEBUG: Parsed v1:", v1);
  console.log("DEBUG: Raw Request Body (original):", rawRequestBody);

  if (!ts || !v1) {
    console.error("Erro: 'ts' ou 'v1' ausentes no cabeçalho x-signature.");
    return false;
  }

  let normalizedRequestBody = rawRequestBody;
  try {
    const parsedBody = JSON.parse(rawRequestBody);
    // Stringify para garantir que o JSON esteja compacto e sem formatação
    normalizedRequestBody = JSON.stringify(parsedBody);
    console.log("DEBUG: Normalized Request Body (for signature):", normalizedRequestBody);
  } catch (e) {
    console.warn("Aviso: Não foi possível normalizar o corpo da requisição JSON. Usando o corpo original.", e);
  }

  const message = `id:${xRequestId};ts:${ts};data:${normalizedRequestBody}`;
  console.log("Mensagem para assinar:", message);

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  // Usando Web Crypto API nativa do Node.js (disponível em ambientes Vercel)
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, messageData);

  const calculatedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  console.log("Assinatura calculada:", calculatedSignature);
  console.log("Assinatura recebida (v1):", v1);

  return calculatedSignature === v1;
}

// Exporta a função como um handler para a Vercel
export default async function handler(req: Request, res: Response) {
  console.log("mercadopago-webhook Vercel function invoked - START.");
  console.log(`Received request with method: ${req.method}`); // Log do método da requisição

  if (req.method === 'OPTIONS') {
    // CORS preflight request
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type, x-signature, x-request-id');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const MERCADO_PAGO_WEBHOOK_SECRET = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
    const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

    if (!MERCADO_PAGO_WEBHOOK_SECRET || !MERCADO_PAGO_ACCESS_TOKEN || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('Erro: Variáveis de ambiente do Mercado Pago ou Supabase não configuradas.');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const rawRequestBody = JSON.stringify(req.body); // req.body já é o objeto parseado pelo Vercel
    const webhookPayload = req.body; // Usar req.body diretamente

    console.log("Webhook Payload recebido:", webhookPayload);

    const xSignature = req.headers['x-signature'] as string;
    const xRequestId = req.headers['x-request-id'] as string;

    if (!xSignature || !xRequestId) {
      console.error("Erro: Cabeçalhos 'x-signature' ou 'x-request-id' ausentes.");
      return res.status(400).json({ error: 'Missing required headers' });
    }

    const isSignatureValid = await verifySignature(
      rawRequestBody, // Passar o corpo RAW para a verificação
      xSignature,
      xRequestId,
      MERCADO_PAGO_WEBHOOK_SECRET
    );

    if (!isSignatureValid) {
      console.error("Erro: Assinatura do webhook inválida.");
      return res.status(403).json({ error: 'Invalid webhook signature' });
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
        return res.status(500).json({ error: 'Failed to fetch payment details from Mercado Pago', details: errorBody });
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
        return res.status(500).json({ error: 'Failed to update order status in Supabase', details: updateError.message });
      }

      console.log("Pedido atualizado com sucesso no Supabase:", updatedOrder);

      return res.status(200).json({ message: 'Webhook processed successfully', orderStatus: newOrderStatus });

    } else {
      console.log("Webhook recebido, mas não é um evento de payment.updated. Ignorando.");
      return res.status(200).json({ message: 'Webhook type not handled' });
    }

  } catch (error: any) {
    console.error('Erro geral na função mercadopago-webhook:', error.message);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
// Removido: import { createHmac } from "https://deno.land/std@0.224.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("mercadopago-webhook function invoked.");

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Incoming headers:");
    for (const [key, value] of req.headers.entries()) {
      console.log(`${key}: ${value}`);
    }

    const webhookSecret = Deno.env.get('MERCADO_PAGO_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error("MERCADO_PAGO_WEBHOOK_SECRET not set in environment variables.");
      return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // --- Validação da Assinatura do Mercado Pago ---
    const xSignature = req.headers.get('x-signature');
    const xRequestId = req.headers.get('x-request-id');
    const xWebhookId = req.headers.get('x-webhook-id');
    const xTimestamp = req.headers.get('x-timestamp');

    if (!xSignature || !xRequestId || !xWebhookId || !xTimestamp) {
      console.error("Missing Mercado Pago signature headers.");
      return new Response(JSON.stringify({ error: 'Missing Mercado Pago signature headers' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401, // Unauthorized
      });
    }

    const rawBody = await req.text(); // Ler o corpo da requisição como texto
    const message = `id:${xWebhookId};uri:/v1/payments;ts:${xTimestamp};data:${rawBody}`;

    // Usando Web Crypto API para calcular HMAC
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(webhookSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(message)
    );

    const expectedSignature = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSignature !== xSignature) {
      console.error("Mercado Pago signature verification failed.");
      return new Response(JSON.stringify({ error: 'Invalid Mercado Pago signature' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401, // Unauthorized
      });
    }
    // --- Fim da Validação da Assinatura ---

    const notification = JSON.parse(rawBody); // Agora parseamos o corpo que já lemos

    console.log("Webhook received:", JSON.stringify(notification, null, 2));

    // Processa a notificação de forma assíncrona após responder ao Mercado Pago
    setTimeout(async () => {
      if (notification.type === 'payment' && notification.data && notification.data.id) {
        const paymentId = notification.data.id;
        const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!accessToken || !serviceRoleKey || !supabaseUrl) {
          console.error("Missing environment variables for webhook processing.");
          return;
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (!paymentResponse.ok) {
          console.error(`Failed to fetch payment details for ID ${paymentId}`);
          return;
        }

        const paymentDetails = await paymentResponse.json();
        const orderId = paymentDetails.external_reference;
        const paymentStatus = paymentDetails.status;

        if (orderId && paymentStatus === 'approved') {
          const { error } = await supabaseAdmin
            .from('orders')
            .update({ status: 'paid' })
            .eq('id', orderId);

          if (error) {
            console.error(`Error updating order ${orderId}:`, error.message);
          } else {
            console.log(`Order ${orderId} successfully updated to 'paid'.`);
          }
        }
      }
    }, 0);

    return new Response(JSON.stringify({ status: 'received' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error processing webhook:', error.message);
    return new Response(JSON.stringify({ error: 'Webhook processing error', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
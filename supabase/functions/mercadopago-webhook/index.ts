import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const notification = await req.json();
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
          const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
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
    return new Response(JSON.stringify({ error: 'Webhook processing error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
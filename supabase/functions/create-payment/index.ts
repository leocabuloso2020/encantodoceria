import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MERCADO_PAGO_API_URL = "https://api.mercadopago.com/checkout/preferences";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { order } = await req.json();
    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
    const supabaseProjectUrl = Deno.env.get('SUPABASE_URL');

    if (!accessToken) {
      throw new Error("Mercado Pago access token is not configured.");
    }
    if (!order) {
      throw new Error("Order details are missing.");
    }
    if (!supabaseProjectUrl) {
      throw new Error("Supabase project URL is not configured.");
    }

    const items = order.items.map((item: any) => ({
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: 'BRL',
    }));

    const preference = {
      items: items,
      payer: {
        name: order.customer_name,
        email: `cliente_${Date.now()}@encantodoceria.com`, // E-mail fictício, pois é obrigatório pelo MP
      },
      back_urls: {
        success: `${req.headers.get('origin')}/order-confirmation/${order.id}`,
        failure: `${req.headers.get('origin')}/order-confirmation/${order.id}`,
        pending: `${req.headers.get('origin')}/order-confirmation/${order.id}`,
      },
      notification_url: `${supabaseProjectUrl}/functions/v1/mercadopago-webhook`,
      external_reference: order.id,
      payment_methods: {
        excluded_payment_types: [
          { id: "ticket" },
          { id: "credit_card" },
          { id: "debit_card" }
        ],
      },
    };

    const response = await fetch(MERCADO_PAGO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preference),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Mercado Pago API error:", errorBody);
      throw new Error(`Failed to create payment preference: ${errorBody.message || response.statusText}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify({ init_point: data.init_point }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in create-payment function:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
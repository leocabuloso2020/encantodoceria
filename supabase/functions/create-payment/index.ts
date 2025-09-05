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
    const VERCEL_PROJECT_URL = Deno.env.get('VERCEL_PROJECT_URL');

    if (!accessToken) {
      throw new Error("Mercado Pago access token is not configured.");
    }
    if (!order) {
      throw new Error("Order details are missing.");
    }
    if (!VERCEL_PROJECT_URL) {
      throw new Error("Vercel project URL is not configured.");
    }

    const items = order.items.map((item: any) => ({
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: 'BRL',
    }));

    // Extrair DDD e número do contato do cliente
    let areaCode = '';
    let phoneNumber = order.customer_contact;
    if (order.customer_contact && order.customer_contact.length >= 10) { // Assumindo DDD + 8 ou 9 dígitos
      areaCode = order.customer_contact.substring(0, 2);
      phoneNumber = order.customer_contact.substring(2);
    }

    const preference = {
      items: items,
      payer: {
        name: order.customer_name,
        email: `cliente_${Date.now()}@encantodoceria.com`, // E-mail fictício, pois é obrigatório pelo MP
        phone: { // Adicionando informações de telefone
          area_code: areaCode,
          number: phoneNumber,
        },
        // Não temos informações de endereço ou identificação no fluxo atual, então omitimos por enquanto.
      },
      back_urls: {
        success: `${req.headers.get('origin')}/order-confirmation/${order.id}`,
        failure: `${req.headers.get('origin')}/order-confirmation/${order.id}`,
        pending: `${req.headers.get('origin')}/order-confirmation/${order.id}`,
      },
      notification_url: `${VERCEL_PROJECT_URL}/api/mercadopago-webhook`,
      external_reference: order.id,
      payment_methods: {
        installments: 1, // Força o parcelamento para 1
        excluded_payment_methods: [], // Explicitamente não exclui nenhum método
        excluded_payment_types: [], // Explicitamente não exclui nenhum tipo de pagamento
      },
    };

    console.log("DEBUG: Mercado Pago Preference object being sent:", JSON.stringify(preference, null, 2));

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
    console.log("DEBUG: Mercado Pago API response data:", JSON.stringify(data, null, 2));

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
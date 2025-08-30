import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { record: order } = await req.json();

    if (!order) {
      return new Response(JSON.stringify({ error: 'No order data provided' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set in environment variables.');
      return new Response(JSON.stringify({ error: 'Telegram credentials not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const itemsList = order.items.map((item: any) => `  - ${item.quantity}x ${item.name} (R$ ${item.price.toFixed(2)})`).join('\n');

    const message = `
🎉 *NOVO PEDIDO RECEBIDO!* 🎉

*ID do Pedido:* \`${order.id.substring(0, 8)}\`
*Cliente:* ${order.customer_name}
*Contato:* ${order.customer_contact}
*Total:* R$ ${order.total_amount.toFixed(2)}
*Método de Pagamento:* ${order.payment_method}
*Status:* ${order.status}

*Itens do Pedido:*
${itemsList}

_Data do Pedido:_ ${new Date(order.created_at).toLocaleString('pt-BR')}
    `;

    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const telegramResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown', // Para formatar o texto
      }),
    });

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error('Failed to send Telegram message:', telegramData);
      return new Response(JSON.stringify({ error: 'Failed to send Telegram message', details: telegramData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ message: 'Notification sent successfully', telegramData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in notify-new-order function:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
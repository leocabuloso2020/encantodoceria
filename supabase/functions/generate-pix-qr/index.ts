import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { Pix } from "https://esm.sh/deno_pix@v1.0.0/mod.ts"; // Caminho corrigido para esm.sh com /mod.ts

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pixKey, amount, transactionId, merchantName, merchantCity } = await req.json();

    if (!pixKey || !amount || !transactionId || !merchantName || !merchantCity) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const pix = new Pix();
    pix.setPixKey(pixKey);
    pix.setAmount(amount);
    pix.setTransactionId(transactionId);
    pix.setMerchantName(merchantName);
    pix.setMerchantCity(merchantCity);

    const brCode = pix.getBrCode();

    return new Response(JSON.stringify({ brCode }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in generate-pix-qr function:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
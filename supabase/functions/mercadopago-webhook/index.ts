import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("mercadopago-webhook function invoked - START."); // <-- NOVO LOG AQUI

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // TODO: Reativar a lógica de validação e processamento após confirmar o logging.
  // Por enquanto, apenas retorna um 200 para testar se o log aparece.
  return new Response(JSON.stringify({ status: 'temporarily_received_for_logging_test' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
});
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// URL da API da Efi (Gerencianet) - Usando a URL de produção conforme o link fornecido
const EFI_API_BASE_URL = "https://api.sejaefi.com.br";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, totalAmount, customerName, customerContact } = await req.json();
    console.log("DEBUG: create-efi-pix-charge received request for orderId:", orderId);

    const EFI_CLIENT_ID = Deno.env.get('EFI_CLIENT_ID');
    const EFI_CLIENT_SECRET = Deno.env.get('EFI_CLIENT_SECRET');

    if (!EFI_CLIENT_ID || !EFI_CLIENT_SECRET) {
      console.error("ERROR: EFI_CLIENT_ID or EFI_CLIENT_SECRET not configured.");
      throw new Error("EFI_CLIENT_ID or EFI_CLIENT_SECRET not configured.");
    }
    if (!orderId || !totalAmount || !customerName || !customerContact) {
      console.error("ERROR: Missing required order details for PIX charge.");
      throw new Error("Missing required order details for PIX charge.");
    }

    // 1. Obter Token de Acesso da Efi
    console.log("DEBUG: Attempting to get Efi access token...");
    const credentials = btoa(`${EFI_CLIENT_ID}:${EFI_CLIENT_SECRET}`);
    const authResponse = await fetch(`${EFI_API_BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
      }),
    });

    if (!authResponse.ok) {
      const errorBody = await authResponse.json();
      console.error("ERROR: Efi Auth API error:", JSON.stringify(errorBody));
      throw new Error(`Failed to get Efi access token: ${errorBody.error_description || authResponse.statusText}`);
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;
    console.log("DEBUG: Successfully obtained Efi access token.");

    // 2. Criar Cobrança PIX (Cobrança Imediata - 'cob')
    console.log("DEBUG: Attempting to create PIX charge...");
    const pixChargePayload = {
      calendario: {
        expiracao: 3600 // 1 hora para expirar o PIX
      },
      devedor: {
        nome: customerName,
        // O CPF/CNPJ é opcional para cobranças imediatas, mas pode ser adicionado se necessário
        // cpf: "12345678900" // Exemplo, se você coletar CPF
      },
      valor: {
        original: totalAmount.toFixed(2) // Formata para 2 casas decimais
      },
      chave: "31993305095", // Sua chave PIX cadastrada na Efi
      solicitacaoPagador: `Pedido #${orderId.substring(0, 8)} - Encanto Doceria`,
      infoAdicionais: [
        { nome: "Contato", valor: customerContact },
        { nome: "ID do Pedido", valor: orderId }
      ]
    };

    const pixChargeResponse = await fetch(`${EFI_API_BASE_URL}/v2/cob`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(pixChargePayload),
    });

    if (!pixChargeResponse.ok) {
      const errorBody = await pixChargeResponse.json();
      console.error("ERROR: Efi PIX Charge API error:", JSON.stringify(errorBody));
      throw new Error(`Failed to create PIX charge: ${errorBody.detail || pixChargeResponse.statusText}`);
    }

    const pixChargeData = await pixChargeResponse.json();
    const locId = pixChargeData.loc.id;
    console.log("DEBUG: Successfully created PIX charge. locId:", locId);

    // 3. Obter QR Code e Payload
    console.log("DEBUG: Attempting to get QR Code...");
    const qrcodeResponse = await fetch(`${EFI_API_BASE_URL}/v2/loc/${locId}/qrcode`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!qrcodeResponse.ok) {
      const errorBody = await qrcodeResponse.json();
      console.error("ERROR: Efi QR Code API error:", JSON.stringify(errorBody));
      throw new Error(`Failed to get PIX QR Code: ${errorBody.detail || qrcodeResponse.statusText}`);
    }

    const qrcodeData = await qrcodeResponse.json();
    console.log("DEBUG: Successfully obtained QR Code data.");

    return new Response(JSON.stringify({
      qrcode_image: qrcodeData.imagemQrcode,
      qrcode_payload: qrcodeData.qrcode,
      expiration_date: pixChargeData.calendario.expiracao, // Retorna a expiração em segundos
      txid: pixChargeData.txid,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('FATAL ERROR in create-efi-pix-charge function:', error.message);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
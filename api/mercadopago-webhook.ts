import { createClient } from '@supabase/supabase-js';
import { Request, Response } from 'express';

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

  // Temporariamente, vamos apenas retornar 200 OK para qualquer POST para depuração
  if (req.method === 'POST') {
    console.log("Received POST request. Returning 200 OK for debugging.");
    return res.status(200).json({ message: 'Webhook received (debugging mode)' });
  }

  // Se não for OPTIONS nem POST, retorna 405
  return res.status(405).json({ error: 'Method Not Allowed' });
}
/// <reference types="vite/client" />

// This file provides ambient type declarations for Deno remote modules
// to satisfy the local TypeScript compiler when it attempts to type-check
// files within the 'supabase/functions' directory.
// The actual Deno runtime handles these imports directly.

declare module "https://deno.land/std@0.190.0/http/server.ts" {
  export function serve(handler: (req: Request) => Response | Promise<Response>) : Promise<void>;
}

declare module "https://esm.sh/@supabase/supabase-js@2.45.0" {
  // Minimal declaration to satisfy the type checker for createClient
  export function createClient(supabaseUrl: string, supabaseKey: string): any;
}

// Adicionando declarações para a Web Crypto API, se necessário para funções Edge
// Nota: Deno já possui tipos globais para Crypto, mas para garantir compatibilidade
// com o ambiente de build local, podemos adicionar declarações específicas se houver problemas.
// Por enquanto, vamos assumir que os tipos globais do Deno são suficientes.

// No entanto, para o uso de certificados mTLS, precisamos de variáveis de ambiente para os certificados.
// A função Edge irá decodificá-los de Base64.
declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
  }
}

// Estender a interface RequestInit para incluir as propriedades 'cert' e 'key'
// que são suportadas pelo Deno Fetch API para mTLS.
declare interface RequestInit {
  cert?: Uint8Array | string;
  key?: Uint8Array | string;
}
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

// A declaração para createHmac foi removida, pois agora usamos a Web Crypto API nativa.

declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
  }
}
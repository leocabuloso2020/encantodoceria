/// <reference types="https://deno.land/std@0.190.0/http/server.ts" />
/// <reference types="https://esm.sh/@supabase/supabase-js@2.45.0" />
/// <reference types="https://deno.land/x/deno_pix@v1.0.0/mod.ts" />

declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
  }
}
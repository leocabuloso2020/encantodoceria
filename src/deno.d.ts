/// <reference types="https://deno.land/std@0.190.0/http/server.ts" />
/// <reference types="https://esm.sh/@supabase/supabase-js@2.45.0" />

declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
  }
}
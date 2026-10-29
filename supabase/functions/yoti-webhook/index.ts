// supabase/functions/yoti-webhook/index.ts
//
// SCAFFOLD — receives the result of a Yoti identity session. Deploy with:
//   supabase functions deploy yoti-webhook --no-verify-jwt
// (Yoti calls this without a Supabase JWT, so JWT verification is disabled;
//  authenticity is instead checked from the Yoti signature header.)
//
// Secrets required:
//   YOTI_CLIENT_SDK_ID
//   YOTI_API_KEY
//   SUPABASE_SERVICE_ROLE_KEY  (auto-injected) — needed to write
//                               verification_status, which the browser can't.
//
// Responsibilities when implemented:
//   1. Verify the request really came from Yoti (signature / shared secret).
//   2. Fetch the completed session result from the Yoti API.
//   3. Map the outcome to 'verified' or 'rejected'.
//   4. Update public.profiles.verification_status for the matching user,
//      using the service-role client (bypasses the guard trigger/RLS).

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  // Service-role client — the only path allowed to write verification_status.
  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  // TODO: verify Yoti signature, fetch the session result, resolve the user id,
  // then:
  //   await admin.from('profiles')
  //     .update({ verification_status: outcome }) // 'verified' | 'rejected'
  //     .eq('id', userId);
  console.log('yoti-webhook received (scaffold, not processed):', payload);

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});

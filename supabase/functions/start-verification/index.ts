// supabase/functions/start-verification/index.ts
//
// SCAFFOLD — not yet wired to Yoti. Deploy with:
//   supabase functions deploy start-verification
//
// Secrets required (Dashboard → Settings → Edge Functions → Secrets):
//   YOTI_CLIENT_SDK_ID
//   YOTI_API_KEY               (PEM private key for the Yoti app)
//   YOTI_SESSION_CALLBACK_URL  (public URL of the yoti-webhook function)
//
// Responsibilities when implemented:
//   1. Authenticate the caller from the Authorization header.
//   2. Create a Yoti IDV session (document + liveness checks) via the Yoti API.
//   3. Email the user the Yoti hosted-flow link (Resend/Postmark/Supabase SMTP).
//   4. Store the Yoti session id against the profile and set
//      verification_status = 'pending' using the service-role key.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

serve(async (req) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', { status: 401 });

  // Caller-scoped client (respects RLS) — used to resolve who is requesting.
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return new Response('Unauthorized', { status: 401 });

  // TODO: create Yoti session, email the link, set verification_status='pending'
  // via a service-role client. Returning 501 until Yoti credentials are set.
  return new Response(
    JSON.stringify({ error: 'Verification provider not configured yet.' }),
    { status: 501, headers: { 'Content-Type': 'application/json' } },
  );
});

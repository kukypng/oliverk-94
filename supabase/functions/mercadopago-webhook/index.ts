
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { MercadoPagoConfig, PreApproval } from 'https://esm.sh/mercadopago@2.0.9'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
}

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const notification = await req.json();
    console.log('Mercado Pago Webhook Received:', JSON.stringify(notification, null, 2));

    if (notification.type === 'preapproval' && notification.data?.id) {
      const preapprovalId = notification.data.id;
      
      const mercadoPagoAccessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
      if (!mercadoPagoAccessToken) throw new Error("MERCADO_PAGO_ACCESS_TOKEN is not set.");
      
      const client = new MercadoPagoConfig({ accessToken: mercadoPagoAccessToken });
      const preapproval = new PreApproval(client);

      const subscriptionDetails = await preapproval.get({ preApprovalId });
      console.log('Subscription Details from MP:', JSON.stringify(subscriptionDetails, null, 2));

      const userId = subscriptionDetails.external_reference;
      const status = subscriptionDetails.status;

      if (!userId) {
        console.error("Webhook received without user ID (external_reference).", subscriptionDetails);
        return new Response('Webhook processed, but no user ID found.', { status: 200 });
      }

      if (status === 'authorized') {
        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('expiration_date')
          .eq('id', userId)
          .single();

        let newExpirationDate;
        const now = new Date();
        const currentExpiration = profile?.expiration_date ? new Date(profile.expiration_date) : now;

        if (currentExpiration < now) {
          newExpirationDate = new Date(now.setMonth(now.getMonth() + 1));
        } else {
          newExpirationDate = new Date(currentExpiration.setMonth(currentExpiration.getMonth() + 1));
        }
        
        const { error: updateError } = await supabaseAdmin
          .from('user_profiles')
          .update({ 
            expiration_date: newExpirationDate.toISOString(),
            is_active: true
          })
          .eq('id', userId);

        if (updateError) throw updateError;
        console.log(`User ${userId} license renewed until ${newExpirationDate.toISOString()}`);
      } else if (status === 'cancelled' || status === 'paused') {
        const { error: updateError } = await supabaseAdmin
        .from('user_profiles')
        .update({ is_active: false })
        .eq('id', userId);

        if (updateError) console.error(`Error deactivating user ${userId}:`, updateError);
        else console.log(`User ${userId} subscription is ${status}. Deactivated user.`);
      }
    }

    return new Response('Webhook received', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook Error:', error.message, error.stack);
    return new Response(JSON.stringify({ error: 'Webhook processing failed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

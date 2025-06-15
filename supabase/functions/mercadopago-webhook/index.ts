import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
      
      const mpResponse = await fetch(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${mercadoPagoAccessToken}`
        }
      });
      
      const subscriptionDetails = await mpResponse.json();
      
      if (!mpResponse.ok) {
        console.error(`Mercado Pago API error fetching preapproval ${preapprovalId}:`, subscriptionDetails);
        throw new Error(`Falha ao buscar detalhes da assinatura: ${subscriptionDetails.message || mpResponse.statusText}`);
      }
      
      console.log('Subscription Details from MP:', JSON.stringify(subscriptionDetails, null, 2));
      
      const externalReference = subscriptionDetails.external_reference;
      const status = subscriptionDetails.status;

      if (!externalReference) {
        console.error("Webhook received without external_reference.", subscriptionDetails);
        return new Response('Webhook processed, but no external_reference found.', { status: 200 });
      }

      if (status === 'authorized') {
        let userData;
        try {
          userData = JSON.parse(externalReference);
        } catch (e) {
          userData = null;
        }

        if (userData && userData.email && userData.name) {
          // --- New user signup flow ---
          console.log(`New user signup process started for email: ${userData.email}`);

          const { data: { users }, error: existingUserError } = await supabaseAdmin.auth.admin.listUsers({ email: userData.email });
          if(existingUserError) console.error("Error checking existing user:", existingUserError);

          const existingUser = users.find(u => u.email === userData.email);

          if (existingUser) {
            console.warn(`User with email ${userData.email} already exists. Renewing license instead.`);
            const userId = existingUser.id;
            const { data: profile } = await supabaseAdmin.from('user_profiles').select('expiration_date').eq('id', userId).single();
            const newExpirationDate = profile?.expiration_date ? new Date(profile.expiration_date) : new Date();
            newExpirationDate.setMonth(newExpirationDate.getMonth() + 1);
            
            const { error: updateError } = await supabaseAdmin.from('user_profiles').update({ expiration_date: newExpirationDate.toISOString(), is_active: true }).eq('id', userId);
            if (updateError) throw updateError;
            console.log(`Existing user ${userId} license renewed until ${newExpirationDate.toISOString()}`);
          } else {
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
              email: userData.email,
              email_confirm: false, // User will be created and can login right away
              user_metadata: { name: userData.name },
            });

            if (createError) {
              console.error(`Error creating user for email ${userData.email}:`, createError);
              throw createError;
            }

            console.log(`User created successfully with ID: ${newUser.user.id}`);

            const expirationDate = new Date();
            expirationDate.setMonth(expirationDate.getMonth() + 1);

            const { error: profileError } = await supabaseAdmin.from('user_profiles').insert({
              id: newUser.user.id,
              name: userData.name,
              role: 'user',
              is_active: true,
              expiration_date: expirationDate.toISOString(),
            });

            if (profileError) {
              console.error(`Error creating profile for user ${newUser.user.id}:`, profileError);
              await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
              throw profileError;
            }
            // Send invitation to set password
            const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(userData.email);
            if(inviteError) {
              console.error('Error sending invite', inviteError);
            } else {
              console.log(`Profile created and invitation sent to user ${newUser.user.id}. License valid until ${expirationDate.toISOString()}`);
            }
          }
        } else {
          // --- Existing user renewal flow ---
          const userId = externalReference;
          console.log(`Renewing license for user ID: ${userId}`);

          const { data: profile } = await supabaseAdmin.from('user_profiles').select('expiration_date').eq('id', userId).single();
          let newExpirationDate;
          const now = new Date();
          const currentExpiration = profile?.expiration_date ? new Date(profile.expiration_date) : now;

          if (currentExpiration < now) {
            newExpirationDate = new Date(now.setMonth(now.getMonth() + 1));
          } else {
            newExpirationDate = new Date(currentExpiration.setMonth(currentExpiration.getMonth() + 1));
          }
          
          const { error: updateError } = await supabaseAdmin.from('user_profiles').update({ expiration_date: newExpirationDate.toISOString(), is_active: true }).eq('id', userId);
          if (updateError) throw updateError;
          console.log(`User ${userId} license renewed until ${newExpirationDate.toISOString()}`);
        }
      } else if (status === 'cancelled' || status === 'paused') {
        let isJson = false;
        try { JSON.parse(externalReference); isJson = true; } catch(e) {}
        
        if (!isJson) {
          const userId = externalReference;
          const { error: updateError } = await supabaseAdmin.from('user_profiles').update({ is_active: false }).eq('id', userId);
          if (updateError) console.error(`Error deactivating user ${userId}:`, updateError);
          else console.log(`User ${userId} subscription is ${status}. Deactivated user.`);
        } else {
          console.log(`A new user signup was ${status}. No action taken.`);
        }
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

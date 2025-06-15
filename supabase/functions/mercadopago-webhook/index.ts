import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// Helper function to process subscription updates (creation or renewal)
async function processSubscriptionUpdate(userId: string, mercadoPagoPaymentId: string | undefined) {
  console.log(`Processing subscription update for user ID: ${userId}`);

  const { data: profile } = await supabaseAdmin.from('user_profiles').select('expiration_date').eq('id', userId).single();
  
  if (!profile) {
    console.warn(`User profile not found for user ID: ${userId}. A new profile will be created with the subscription.`);
  }

  let newExpirationDate;
  const now = new Date();
  const currentExpiration = profile?.expiration_date ? new Date(profile.expiration_date) : now;

  if (currentExpiration < now) {
    const newNow = new Date();
    newExpirationDate = new Date(newNow.setMonth(newNow.getMonth() + 1));
  } else {
    const newCurrentExpiration = new Date(currentExpiration);
    newExpirationDate = new Date(newCurrentExpiration.setMonth(newCurrentExpiration.getMonth() + 1));
  }

  // Upsert user profile to handle both new and existing users, ensuring it is active
  await supabaseAdmin.from('user_profiles').upsert({
    id: userId,
    expiration_date: newExpirationDate.toISOString(),
    is_active: true
  }, { onConflict: 'id' });

  await supabaseAdmin.from('subscriptions').upsert({
    user_id: userId,
    status: 'active',
    mercado_pago_subscription_id: mercadoPagoPaymentId,
    current_period_end: newExpirationDate.toISOString(),
    plan_id: 'monthly_brl_40'
  }, { onConflict: 'user_id' });

  console.log(`User ${userId} license processed. New expiration: ${newExpirationDate.toISOString()}`);
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const body = await req.json();
  console.log('Mercado Pago Webhook Received:', JSON.stringify(body, null, 2));

  let paymentId;
  const eventType = body.type || body.topic;

  if (eventType === 'payment') {
    if (body.data && body.data.id) {
      paymentId = body.data.id;
      console.log(`Payment event received via 'type'. Payment ID: ${paymentId}`);
    } else if (body.resource) {
      // For notifications with a 'topic', the resource can be a URL or just the ID.
      // We extract the last part, which should be the ID.
      const resourceString = body.resource.toString();
      const parts = resourceString.split('/');
      paymentId = parts[parts.length - 1];
      console.log(`Payment event received via 'topic'. Extracted Payment ID from resource: ${paymentId}`);
    }
  }

  if (!paymentId) {
    console.log(`Unhandled event type: '${eventType}'. Body: ${JSON.stringify(body)}`);
    return new Response('Webhook received, but it is not a recognized payment event.', { status: 200 });
  }

  try {
    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
    if (!accessToken) {
        console.error('MERCADO_PAGO_ACCESS_TOKEN is not set.');
        throw new Error('Internal server configuration error.');
    }

    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!paymentResponse.ok) {
        const errorBody = await paymentResponse.text();
        console.error(`Mercado Pago API error fetching payment ${paymentId}:`, errorBody);
        try {
          const jsonError = JSON.parse(errorBody);
          throw new Error(`Error from Mercado Pago: ${jsonError.message || paymentResponse.statusText}`);
        } catch(e) {
          throw new Error(`Error from Mercado Pago: ${paymentResponse.statusText} - ${errorBody}`);
        }
    }

    const paymentInfo = await paymentResponse.json();
    
    console.log(`Processing payment ${paymentId} with status ${paymentInfo.status}`);

    if (paymentInfo.status === 'approved') {
      const externalReference = paymentInfo.external_reference;
      if (!externalReference) {
        throw new Error(`Payment ${paymentId} has no external_reference.`);
      }

      const metadata = JSON.parse(externalReference);
      const mercadoPagoPaymentId = paymentInfo.id?.toString();

      if (metadata.supabase_user_id) {
        // Case 1: Renewal for a logged-in user
        console.log(`Renewing license for user ID: ${metadata.supabase_user_id}`);
        await processSubscriptionUpdate(metadata.supabase_user_id, mercadoPagoPaymentId);
        console.log(`Renewal for user ${metadata.supabase_user_id} complete.`);

      } else if (metadata.user_name && metadata.user_email) {
        // Case 2: New signup or renewal from signup page
        const { user_name: name, user_email: email } = metadata;
        console.log(`New user signup or renewal process started for email: ${email}`);

        const { data: { users: existingUsers } } = await supabaseAdmin.auth.admin.listUsers({ email });
        
        if (existingUsers && existingUsers.length > 0) {
          // Sub-case 2.1: User already exists, treat as renewal
          const userId = existingUsers[0].id;
          console.warn(`User with email ${email} already exists (ID: ${userId}). Treating as renewal.`);
          await processSubscriptionUpdate(userId, mercadoPagoPaymentId);
          console.log(`Renewal for existing user ${email} complete.`);

        } else {
          // Sub-case 2.2: Brand new user creation using Supabase Invite
          console.log(`Inviting new user for email: ${email}`);
          
          const { data: { user }, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
            email,
            { data: { name } } // Pass user's name in metadata
          );

          if (inviteError) {
              console.error('Error inviting user:', inviteError);
              throw inviteError;
          }

          if (!user) {
            throw new Error(`User invitation for ${email} did not return a user object.`);
          }
          
          const userId = user.id;
          console.log(`User invited successfully with ID: ${userId}. An invitation email will be sent by Supabase.`);
          
          // Set up subscription for the new user
          await processSubscriptionUpdate(userId, mercadoPagoPaymentId);
          
          console.log(`New user ${email} signup process complete.`);
        }
      }
    } else if (['cancelled', 'refunded', 'charged_back'].includes(paymentInfo.status ?? '')) {
      const externalReference = paymentInfo.external_reference;
      if (!externalReference) {
        console.error(`Cancelled/refunded payment ${paymentInfo.id} has no external_reference.`);
        return new Response('Webhook processed, no action needed.', { status: 200 });
      }
      const metadata = JSON.parse(externalReference);
      const userId = metadata.supabase_user_id;

      if(userId) {
        await supabaseAdmin.from('user_profiles').update({ is_active: false }).eq('id', userId);
        await supabaseAdmin.from('subscriptions').update({ status: 'cancelled' }).eq('user_id', userId);
        console.log(`User ${userId} subscription is cancelled due to payment status: ${paymentInfo.status}. Deactivated user.`);
      }
    } else {
      console.log(`Payment status is "${paymentInfo.status}", no action taken.`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    console.error('Webhook Error:', error.message, error.stack);
    return new Response(JSON.stringify({ error: 'Webhook processing failed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

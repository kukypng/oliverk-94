
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@3.4.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import React from 'npm:react@18.3.1'
import { InvitationEmail } from './_templates/invitation-email.tsx'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const body = await req.json();
  console.log('Mercado Pago Webhook Received:', body);

  if (body.type !== 'payment') {
      console.log(`Unhandled event type ${body.type}`);
      return new Response('Webhook received, but event type is not "payment".', { status: 200 });
  }

  try {
    const paymentId = body.data.id;
    
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
      const mercadoPagoSubscriptionId = paymentInfo.id?.toString();

      if (metadata.supabase_user_id) {
        const userId = metadata.supabase_user_id;
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
        
        await supabaseAdmin.from('user_profiles').update({ expiration_date: newExpirationDate.toISOString(), is_active: true }).eq('id', userId);
        
        await supabaseAdmin.from('subscriptions').upsert({
            user_id: userId,
            status: 'active',
            mercado_pago_subscription_id: mercadoPagoSubscriptionId,
            current_period_end: newExpirationDate.toISOString(),
            plan_id: 'monthly_brl_40'
        }, { onConflict: 'user_id' });
        
        console.log(`User ${userId} license renewed until ${newExpirationDate.toISOString()}`);
      } else if (metadata.user_name && metadata.user_email) {
        const { user_name: name, user_email: email } = metadata;
        console.log(`New user signup process started for email: ${email}`);

        const { data: { users: existingUsers } } = await supabaseAdmin.auth.admin.listUsers({ email });
        if (existingUsers?.length > 0) {
          console.warn(`User with email ${email} already exists. This should have been a renewal. Aborting new user creation.`);
          return new Response('Webhook processed: User already exists.', { status: 200 });
        }

        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            email_confirm: true, // We will confirm via our custom email
            user_metadata: { name: name },
        });

        if (createError) throw createError;
        
        const userId = newUser.user.id;
        console.log(`User created successfully with ID: ${userId}`);
        
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1);

        await supabaseAdmin.from('user_profiles').insert({ id: userId, name: name, role: 'user', is_active: true, expiration_date: expirationDate.toISOString() });
        await supabaseAdmin.from('subscriptions').insert({ user_id: userId, status: 'active', mercado_pago_subscription_id: mercadoPagoSubscriptionId, current_period_end: expirationDate.toISOString(), plan_id: 'monthly_brl_40' });
        
        // Generate invitation link
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'invite',
          email: email,
        });
        if (linkError) throw linkError;

        const invitationLink = linkData.properties.action_link;

        // Render Email
        const emailHtml = await renderAsync(
          React.createElement(InvitationEmail, {
            userName: name,
            invitationLink: invitationLink,
          })
        );
        
        // Send Email with Resend
        const resendApiKey = Deno.env.get('RESEND_API_KEY');
        if (!resendApiKey) {
            console.error('RESEND_API_KEY is not set.');
            throw new Error('Internal server configuration error for email.');
        }
        const resend = new Resend(resendApiKey);

        await resend.emails.send({
          from: 'Oliver <onboarding@resend.dev>',
          to: [email],
          subject: 'Bem-vindo ao Oliver! Complete seu cadastro',
          html: emailHtml,
        });

        console.log(`Profile created and custom invitation sent to user ${userId}. License valid until ${expirationDate.toISOString()}`);
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

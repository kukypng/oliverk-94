import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@3.5.0'
import React from 'npm:react@18.3.1'
import { render } from 'npm:@react-email/render@0.0.13'
import InvitationEmail from './_templates/invitation-email.tsx'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const resend = new Resend(Deno.env.get('RESEND_API_KEY') ?? '');

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

        // Create user with a random password that will be immediately reset by the user
        const randomPassword = crypto.randomUUID();
        
        const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: randomPassword,
            email_confirm: true, // Auto-confirm email since payment is done
            user_metadata: { name }
        });

        if (userError) {
            console.error('Error creating user:', userError);
            throw userError;
        }
        
        const userId = user.id;
        console.log(`User created successfully with ID: ${userId}`);
        
        // Generate password reset link for the new user to set their password
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: email,
        });

        if (linkError) {
            console.error(`Error generating password recovery link for ${email}:`, linkError);
            // Non-fatal, user can use "Forgot Password" flow.
        }

        if (linkData?.properties?.action_link) {
            const confirmationUrl = linkData.properties.action_link;
            const emailHtml = render(
                React.createElement(InvitationEmail, {
                    name: name,
                    confirmationUrl: confirmationUrl,
                })
            );

            console.log(`Attempting to send welcome email to ${email} from oliver@oliverr.kuky.pro`);
            try {
                const { data: emailData, error: emailError } = await resend.emails.send({
                    from: 'Oliver <oliver@oliverr.kuky.pro>',
                    to: [email],
                    subject: 'Bem-vindo ao Oliver! Sua conta está pronta.',
                    html: emailHtml,
                });

                if (emailError) {
                  // Log the error but don't block the process.
                  // The outer catch will not receive this, but it will be logged.
                  console.error(`Resend API error for ${email}:`, JSON.stringify(emailError));
                } else {
                  console.log(`Welcome email sent successfully to ${email}. Response:`, JSON.stringify(emailData));
                }
            } catch (emailError) {
                console.error(`Failed to send welcome email to ${email}:`, emailError);
                // Not throwing error, as payment is processed and user is created.
            }
        } else {
            console.error(`Could not get action_link for user ${email}. Welcome email not sent.`);
        }
        
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1);

        // O trigger on_auth_user_created já cria o perfil. Aqui, atualizamos com os dados corretos da assinatura.
        await supabaseAdmin.from('user_profiles').update({
            expiration_date: expirationDate.toISOString(), 
            is_active: true
        }).eq('id', userId);
        
        await supabaseAdmin.from('subscriptions').insert({ 
            user_id: userId, 
            status: 'active', 
            mercado_pago_subscription_id: mercadoPagoSubscriptionId, 
            current_period_end: expirationDate.toISOString(), 
            plan_id: 'monthly_brl_40' 
        });
        
        console.log(`Profile updated and subscription created for user ${userId}. License valid until ${expirationDate.toISOString()}`);
        console.log(`Welcome email sent to user. They will set their own password.`);
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

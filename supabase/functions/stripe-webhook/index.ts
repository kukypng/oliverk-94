
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
});

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) {
      throw new Error("Missing Stripe signature or webhook secret.");
    }
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return new Response(err.message, { status: 400 })
  }

  console.log('Stripe Webhook Received:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;
        const stripeCustomerId = session.customer as string;
        const stripeSubscriptionId = session.subscription as string;

        if (metadata?.supabase_user_id) {
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
          await supabaseAdmin.from('subscriptions').update({ status: 'active', stripe_customer_id: stripeCustomerId, stripe_subscription_id: stripeSubscriptionId, current_period_end: newExpirationDate.toISOString() }).eq('user_id', userId);
          console.log(`User ${userId} license renewed until ${newExpirationDate.toISOString()}`);

        } else if (metadata?.user_name && metadata?.user_email) {
            const { user_name: name, user_email: email } = metadata;
            console.log(`New user signup process started for email: ${email}`);

            const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers({ email });
            if (existingUser?.users?.length > 0) {
              console.warn(`User with email ${email} already exists. This should be a renewal. Aborting new user creation.`);
              return new Response('Webhook processed: User already exists.', { status: 200 });
            }

            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: email,
                email_confirm: false,
                user_metadata: { name: name },
            });
            if (createError) throw createError;
            console.log(`User created successfully with ID: ${newUser.user.id}`);
            const userId = newUser.user.id;
            
            const expirationDate = new Date();
            expirationDate.setMonth(expirationDate.getMonth() + 1);

            await supabaseAdmin.from('user_profiles').insert({ id: userId, name: name, role: 'user', is_active: true, expiration_date: expirationDate.toISOString() });
            await supabaseAdmin.from('subscriptions').insert({ user_id: userId, status: 'active', stripe_customer_id: stripeCustomerId, stripe_subscription_id: stripeSubscriptionId, current_period_end: expirationDate.toISOString(), plan_id: 'monthly_brl_40' });
            
            await supabaseAdmin.auth.admin.inviteUserByEmail(email);
            console.log(`Profile created and invitation sent to user ${userId}. License valid until ${expirationDate.toISOString()}`);
        }
        break;
      }
      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        if (subscription.status === 'canceled' || subscription.cancel_at_period_end) {
          const stripeSubscriptionId = subscription.id;
          const { data: subData } = await supabaseAdmin.from('subscriptions').select('user_id').eq('stripe_subscription_id', stripeSubscriptionId).single();
          if (!subData) {
            console.error(`Could not find user for Stripe subscription ${stripeSubscriptionId}`);
            break;
          }
          const userId = subData.user_id;
          await supabaseAdmin.from('user_profiles').update({ is_active: false }).eq('id', userId);
          await supabaseAdmin.from('subscriptions').update({ status: 'cancelled' }).eq('stripe_subscription_id', stripeSubscriptionId);
          console.log(`User ${userId} subscription is cancelled. Deactivated user.`);
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
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


import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { origin, name, email } = await req.json();

    if (!origin) {
        return new Response(JSON.stringify({ error: 'Origin (URL base do site) é necessária.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }

    const { data: { user } } = await supabaseClient.auth.getUser()

    let customerEmail: string | undefined;
    let successUrl = `${origin}/dashboard`;
    let cancelUrl = `${origin}/planos`;
    let metadata = {};

    if (user) {
      // User is authenticated (renewal flow)
      console.log(`Renewal flow for user: ${user.id}`);
      customerEmail = user.email;
      metadata = { supabase_user_id: user.id };
    } else if (name && email) {
      // New user signup flow
      console.log(`New signup flow for email: ${email}`);
      customerEmail = email;
      successUrl = `${origin}/auth?signup_complete=true`;
      metadata = { user_name: name, user_email: email };
    } else {
       return new Response(JSON.stringify({ error: 'Usuário não autenticado e dados de cadastro incompletos.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    let customer;
    const { data: customers } = await stripe.customers.list({ email: customerEmail, limit: 1 });
    if (customers && customers.length > 0) {
        customer = customers[0];
        console.log(`Found existing Stripe customer: ${customer.id}`);
    } else {
        customer = await stripe.customers.create({ email: customerEmail, name: name });
        console.log(`Created new Stripe customer: ${customer.id}`);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Assinatura Oliver Mensal',
              description: 'Acesso completo à plataforma Oliver',
            },
            unit_amount: 4000, // R$40.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    if (!session.url) {
      console.error("Failed to get checkout session URL from Stripe", session);
      return new Response(JSON.stringify({ error: "Falha ao criar o link de pagamento." }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
      });
    }

    console.log("Successfully created Stripe checkout session, url:", session.url);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("Error creating subscription:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

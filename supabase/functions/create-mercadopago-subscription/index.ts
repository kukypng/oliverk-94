import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    let payer;
    let external_reference;
    let successUrl = `${origin}/dashboard`;
    let backUrls = {
      success: successUrl,
      failure: `${origin}/planos`,
      pending: `${origin}/planos`,
    };

    if (user) {
      console.log(`Renewal flow for user: ${user.id}`);
      payer = { email: user.email };
      external_reference = JSON.stringify({ supabase_user_id: user.id });
    } else if (name && email) {
      console.log(`New signup flow for email: ${email}`);
      payer = { name, email };
      external_reference = JSON.stringify({ user_name: name, user_email: email });
      backUrls.success = `${origin}/auth?signup_complete=true`;
    } else {
       return new Response(JSON.stringify({ error: 'Usuário não autenticado e dados de cadastro incompletos.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }
    
    const webhookUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/mercadopago-webhook`

    const preferenceData = {
      items: [
        {
          id: 'oliver-mensal',
          title: 'Assinatura Oliver Mensal',
          description: 'Acesso completo à plataforma Oliver',
          quantity: 1,
          unit_price: 4.00,
          currency_id: 'BRL',
        },
      ],
      payer,
      back_urls: backUrls,
      auto_return: 'approved',
      external_reference,
      notification_url: webhookUrl,
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 1,
      },
    };

    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
    if (!accessToken) {
      console.error('MERCADO_PAGO_ACCESS_TOKEN is not set.');
      return new Response(JSON.stringify({ error: 'Internal server configuration error.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log("Creating Mercado Pago preference with data:", JSON.stringify(preferenceData, null, 2));

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preferenceData),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Mercado Pago API error response:', errorBody);
      try {
        const jsonError = JSON.parse(errorBody);
        throw new Error(`Error from Mercado Pago: ${jsonError.message || response.statusText}`);
      } catch (e) {
        throw new Error(`Error from Mercado Pago: ${response.statusText} - ${errorBody}`);
      }
    }

    const createdPreference = await response.json();
    
    if (!createdPreference.init_point) {
        console.error("Failed to get checkout session URL from Mercado Pago", createdPreference);
        return new Response(JSON.stringify({ error: "Falha ao criar o link de pagamento." }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }

    console.log("Successfully created Mercado Pago preference, url:", createdPreference.init_point);

    return new Response(JSON.stringify({ url: createdPreference.init_point }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("Error creating preference:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

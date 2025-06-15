
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { MercadoPagoConfig, PreApproval } from 'https://esm.sh/mercadopago@2.0.9'

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

    const { data: { user } } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(JSON.stringify({ error: 'Usuário não autenticado.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }
    
    const { origin } = await req.json();
    if (!origin) {
        return new Response(JSON.stringify({ error: 'Origin (URL base do site) é necessária.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }

    const mercadoPagoAccessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')
    if (!mercadoPagoAccessToken) {
        console.error("MERCADO_PAGO_ACCESS_TOKEN is not set.")
        return new Response(JSON.stringify({ error: "Configuração do servidor de pagamento incompleta." }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }

    const client = new MercadoPagoConfig({ accessToken: mercadoPagoAccessToken });
    const preapproval = new PreApproval(client);

    const subscriptionData = {
      reason: 'Assinatura Oliver Mensal',
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: 40,
        currency_id: 'BRL',
      },
      back_url: `${origin}/dashboard?subscription=success`,
      payer_email: user.email,
      external_reference: user.id,
      notification_url: `https://oghjlypdnmqecaavekyr.supabase.co/functions/v1/mercadopago-webhook`,
    };

    const result = await preapproval.create({ body: subscriptionData });
    
    if (!result.init_point) {
        console.error("Failed to get init_point from Mercado Pago", result);
        return new Response(JSON.stringify({ error: "Falha ao comunicar com o serviço de pagamento." }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }

    return new Response(JSON.stringify({ init_point: result.init_point }), {
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

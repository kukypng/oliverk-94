
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

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { payment_id } = await req.json();

    if (!payment_id) {
      return new Response(JSON.stringify({ error: 'payment_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Retrieve the credentials
    const { data, error } = await supabaseAdmin
      .from('temporary_credentials')
      .select('email, password')
      .eq('payment_id', payment_id)
      .single();

    if (error || !data) {
      console.error('Error retrieving credentials:', error);
      return new Response(JSON.stringify({ error: 'Credentials not found or already retrieved.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Delete the credentials after retrieving them to ensure they are only shown once
    const { error: deleteError } = await supabaseAdmin
      .from('temporary_credentials')
      .delete()
      .eq('payment_id', payment_id);

    if (deleteError) {
      // Log the error but still return the credentials to the user
      console.error('Error deleting temporary credentials:', deleteError);
    }
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Credential retrieval error:', error.message);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

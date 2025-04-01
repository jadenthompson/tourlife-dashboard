// supabase/functions/ai-assistant/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://deno.land/x/openai@1.2.0/mod.ts'

serve(async (req) => {
  const { prompt } = await req.json()

  if (!prompt) {
    return new Response('Missing prompt', { status: 400 })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const openai = new OpenAI({
    apiKey: Deno.env.get('OPENAI_API_KEY') ?? ''
  })

  try {
    const chatCompletion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant for touring musicians and their teams.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const response = chatCompletion.choices[0].message.content
    return new Response(JSON.stringify({ response }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.error('OpenAI error:', error)
    return new Response(JSON.stringify({ error: 'Failed to get response from OpenAI' }), {
      status: 500
    })
  }
})

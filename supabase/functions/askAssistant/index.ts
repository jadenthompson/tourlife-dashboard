import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  try {
    const { query, contextData } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant for a touring artist." },
          { role: "user", content: `${contextData}\n\n${query}` },
        ],
        temperature: 0.7,
      }),
    });

    const result = await response.json();

    return new Response(JSON.stringify({ reply: result.choices[0].message.content }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // 💥 THIS IS WHAT FIXES IT
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
});

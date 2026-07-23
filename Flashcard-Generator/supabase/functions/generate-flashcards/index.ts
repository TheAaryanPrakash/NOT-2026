import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const RATE_LIMIT = 10; // generations per hour per user
const RATE_WINDOW_MS = 60 * 60 * 1000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing authorization" }, 401);

    // Client bound to the caller's JWT so auth.uid() / getUser() resolve
    // to the actual signed-in user, not the service role.
    const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) return json({ error: "Not authenticated" }, 401);

    const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
    const { count, error: countError } = await supabase
      .from("ai_generation_log")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", since);

    if (countError) throw countError;
    if ((count ?? 0) >= RATE_LIMIT) {
      return json(
        { error: `Rate limit reached: ${RATE_LIMIT} generations per hour. Try again later.` },
        429
      );
    }

    const { text } = await req.json();
    if (!text || text.trim().length < 20) {
      return json(
        { error: "Provide more notes to generate flashcards from." },
        400
      );
    }

    const wordCount = text.trim().split(/\s+/).length;

    const prompt = `You are a study assistant. Read the notes below and produce flashcards.
Return ONLY valid JSON, no markdown fences, matching exactly this shape:
{"group": "short 2-6 word title for this set", "terms": [{"term": "a question or concept, 10-200 characters", "definition": "a clear explanation, at least 100 characters and at most 2000 characters"}]}

The number of terms must scale with how much material is actually in the
notes — do not default to a fixed number. Roughly one term per 100-150
words of notes, with a hard minimum of 3 and a hard maximum of 12. These
notes are about ${wordCount} words, so aim for approximately
${Math.max(3, Math.min(12, Math.round(wordCount / 125)))} terms, adjusted
up or down based on how many distinct concepts are actually covered.
Do not invent facts that aren't supported by the notes.

Notes:
"""${text.slice(0, 12000)}"""`;

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a study assistant that outputs only valid JSON.",
            },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      throw new Error(`Groq API error: ${errText}`);
    }

    const groqData = await groqRes.json();
    const rawText = groqData.choices?.[0]?.message?.content;
    if (!rawText) throw new Error("Empty response from Groq");

    const parsed = JSON.parse(rawText);

    await supabase.from("ai_generation_log").insert({ user_id: user.id });

    return json(parsed, 200);
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      500
    );
  }
});

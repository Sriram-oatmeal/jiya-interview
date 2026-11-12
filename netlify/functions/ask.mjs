// Netlify Function: forwards the interview prompts to the Anthropic API.
// Set ANTHROPIC_API_KEY in Netlify: Site configuration → Environment variables.
// Optional: QUICK_MODEL / DEFAULT_MODEL to change models.

const MODELS = {
  quick: process.env.QUICK_MODEL || "claude-haiku-5-5",
  default: process.env.DEFAULT_MODEL || "claude-sonnet-5-5",
  complex: process.env.DEFAULT_MODEL || "claude-sonnet-5-5",
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export default async (req) => {
  const key = process.env.ANTHROPIC_API_KEY;
  if (req.method === "GET") return json({ ready: !!key });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!key) return json({ error: "ANTHROPIC_API_KEY is not set" }, 503);

  let body;
  try { body = await req.json(); } catch { return json({ error: "Bad JSON" }, 400); }
  const prompt = String(body.prompt || "").slice(0, 60000);
  if (!prompt) return json({ error: "Empty prompt" }, 400);
  const model = MODELS[body.tier] || MODELS.default;

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) return json({ error: data?.error?.message || "Upstream error" }, r.status === 429 ? 429 : 502);
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
  return json({ text });
};

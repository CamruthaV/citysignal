/**
 * Vercel serverless function: ranks already-ingested Hyderabad events.
 * Keep OPENAI_API_KEY server-side; it must never be exposed to the browser.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "AI search is not configured." });

  const { query, events } = req.body || {};
  if (typeof query !== "string" || !Array.isArray(events) || events.length === 0) {
    return res.status(400).json({ error: "Expected a query and a non-empty event list." });
  }
  const safeEvents = events.slice(0, 40).map(({ id, title, date, time, venue, area, source, format, topics, price, summary }) =>
    ({ id, title, date, time, venue, area, source, format, topics, price, summary })
  );
  const schema = {
    type: "object", additionalProperties: false,
    properties: {
      ranked_ids: { type: "array", items: { type: "number" } },
      insight: { type: "string" }
    }, required: ["ranked_ids", "insight"]
  };
  const instructions = "You are CitySignal's event relevance engine. Rank only the provided Hyderabad developer events for the user's request. Prefer the requested topic, date intent, price, format, and Hyderabad locality. Return every id exactly once; do not invent events or facts. The insight must be one short factual sentence and must not claim that registrations are open unless supplied in the event data.";

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        instructions,
        input: JSON.stringify({ query, events: safeEvents }),
        text: { format: { type: "json_schema", name: "event_ranking", strict: true, schema } }
      })
    });
    if (!response.ok) throw new Error(`OpenAI returned ${response.status}`);
    const payload = await response.json();
    const parsed = JSON.parse(payload.output_text);
    const validIds = new Set(safeEvents.map(event => event.id));
    const ranked_ids = parsed.ranked_ids.filter(id => validIds.has(id));
    const missing = safeEvents.map(event => event.id).filter(id => !ranked_ids.includes(id));
    return res.status(200).json({ ranked_ids: [...ranked_ids, ...missing], insight: parsed.insight, provider: "openai" });
  } catch (error) {
    return res.status(502).json({ error: "AI ranking is temporarily unavailable.", detail: error.message });
  }
}

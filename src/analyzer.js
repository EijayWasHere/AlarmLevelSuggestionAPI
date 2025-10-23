import OpenAI from "openai";

const SYSTEM_PROMPT = `You are an expert Fire Alarm escalation classifier.
You will receive a responder message describing the extent of a fire.
Determine the appropriate alarm level based on the mapping below, and return ONLY a strict JSON object with fields: alarm_level, reason.

Fire Alarm Mapping:
- First Alarm: 2–3 houses
- Second Alarm: 4–5 houses
- Third Alarm: 6–7 houses OR high-rise affected
- Fourth Alarm: 8–9 houses OR high-rise affected
- Fifth Alarm: 10–11 houses OR high-rise affected
- Task Force Alpha: ~12 houses
- Task Force Bravo: ~15 houses
- Task Force Charlie: fire affecting significant part of area
- Task Force Delta Echo Hotel India: fire affecting significant part of area
- General Alarm: fire affecting major part of area

Rules:
1) Choose the single best-matching alarm level.
2) Provide a concise reason that quotes or paraphrases the message evidence.
3) Output JSON only, no extra text.
`;

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return new OpenAI({ apiKey });
}

export async function analyzeMessageWithOpenAI(messageText) {
  const client = getClient();

  // Use Chat Completions for broad compatibility
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    // Use model defaults (some models only support default temperature)
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Message: ${messageText}\n\nReturn only JSON with keys: alarm_level, reason.`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("Empty response from OpenAI");
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    throw new Error("Failed to parse OpenAI JSON response");
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("OpenAI response is not a JSON object");
  }

  const alarmLevel = typeof parsed.alarm_level === "string" ? parsed.alarm_level : undefined;
  const reason = typeof parsed.reason === "string" ? parsed.reason : undefined;

  if (!alarmLevel || !reason) {
    throw new Error("OpenAI response missing required fields");
  }

  return { alarm_level: alarmLevel, reason };
}



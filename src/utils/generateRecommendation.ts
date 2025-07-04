export async function generateRecommendation(preference: any, properties: any[]) {
  const prompt = `
You are a helpful real estate assistant.

A tenant has the following preferences:
${JSON.stringify(preference, null, 2)}

You have found the following matching properties:
${JSON.stringify(properties.slice(0, 5), null, 2)}

1. Review all the properties and pick the one that **best fits** the tenant's preferences.
2. Write a short, natural-sounding recommendation explaining why this property is the best match.
3. If multiple properties are equally good, briefly mention that and suggest the most appealing one.
4. DO NOT include code or JSON, just a plain text message.
  `;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        { role: "system", content: prompt },
      ],
    }),
  });

  const data: any = await response.json();
  const message = data.choices?.[0]?.message?.content?.trim();
  return message;
}

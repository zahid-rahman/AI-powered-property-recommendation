export async function generateRecommendation(
  preference: any,
  properties: any[]
) {
  const simplifiedProps = properties
    .slice(0, 5)
    .map(
      ({
        id,
        title,
        price,
        location,
        bedrooms,
        bathrooms,
        amenities,
        availableFrom,
      }) => ({
        id,
        title,
        price,
        location,
        bedrooms,
        bathrooms,
        amenities,
        availableFrom,
      })
    );

  const prompt = `
You are a real estate assistant helping match tenants with the most suitable rental property.

Tenant preferences:
${JSON.stringify(preference, null, 2)}

Matching properties:
${JSON.stringify(simplifiedProps, null, 2)}

Your task:
1. Choose the single best property that fits the preferences.
2. Return a valid JSON object with:
   - "recommended_property_id": the id of the best match
   - "reason": a natural language message explaining why it's the best fit

Important:
- ONLY return a valid JSON object.
- Do NOT include markdown, explanations, or extra text.
`;

let content = null;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          response_format: "json",
          messages: [{ role: "system", content: prompt }],
        }),
      }
    );

    const data: any = await response.json();
    content = data.choices?.[0]?.message?.content?.trim();
    return JSON.parse(content); 
  } catch (error) {
    console.error("Failed to parse AI output:", content);
    throw new Error("Invalid LLM response");
  }
}

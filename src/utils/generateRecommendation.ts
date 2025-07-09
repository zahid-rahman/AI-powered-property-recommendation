// export async function generateRecommendation(preference: any, properties: any[]) {
//   const prompt = `
// You are a helpful real estate assistant.

// A tenant has the following preferences:
// ${JSON.stringify(preference, null, 2)}

// You have found the following matching properties:
// ${JSON.stringify(properties.slice(0, 5), null, 2)}

// 1. Review all the properties and pick the one that **best fits** the tenant's preferences.
// 2. Write a short, natural-sounding recommendation explaining why this property is the best match.
// 3. If multiple properties are equally good, briefly mention that and suggest the most appealing one.
// 4. DO NOT include code or JSON, just a plain text message.
//   `;

//   const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: "mistralai/mistral-7b-instruct",
//       messages: [
//         { role: "system", content: prompt },
//       ],
//     }),
//   });

//   const data: any = await response.json();
//   const message = data.choices?.[0]?.message?.content?.trim();
//   return message;
// }


export async function generateRecommendation(preference: any, properties: any[]) {
  const simplifiedProps = properties.slice(0, 5).map(({ id, title, price, location, bedrooms, bathrooms, amenities, availableFrom }) => ({
    id, title, price, location, bedrooms, bathrooms, amenities, availableFrom
  }));

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

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      response_format: "json",
      messages: [
        { role: "system", content: prompt }
      ],
    }),
  });

  const data: any = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();

  try {
    return JSON.parse(content); // returns { recommended_property_id, reason }
  } catch (error) {
    console.error("Failed to parse AI output:", content);
    throw new Error("Invalid LLM response");
  }
}

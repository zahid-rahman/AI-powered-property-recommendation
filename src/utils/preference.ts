export async function extractPreference(message: string) {
  const SYSTEM_PROMPT = `
    You are an expert assistant helping extract rental preferences from tenant messages. Your job is to return only a valid JSON object with the following fields:
    - location (string)
    - budget (number, without $ sign)
    - bedrooms (number)
    - bathrooms (number)
    - amenities (array of strings, selected from the list below)
    - move_in_date (formatted as YYYY-MM-DD)
    - type (string)

    Important:
    1. Extract amenities from user-friendly or vague language, and match them to this fixed list:
    ["parking", "gym", "pool", "pet-friendly", "furnished", "balcony", "garden", "air-conditioning", "heating", "wifi"]

    2. Examples:
    - "well furnished" → "furnished"
    - "proper parking spot" or "secure car parking" → "parking"
    - "great WiFi" → "wifi"
    - "has a nice backyard" → "garden"
    - Type should be one of: "apartment", "house", "condo", "studio", "loft", "townhouse" etc.

    3. Only return a **valid JSON** object, without markdown, code block, or explanation. Do not add extra commentary.

    4. If any field is not found, leave it as null (or an empty array in case of amenities).

    5. Do not include any notes, keywords, or summaries outside the JSON. 

    6. Do not include any default preference just return the extracted preferences as they are after pre processing.

    `;
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "post",
      headers: {
        Authorization:
          `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        response_format: "json",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    }
  );

  const data: any = await response.json();
  const content = data.choices?.[0]?.message?.content;

  try {
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to parse LLM output:", content);
    throw new Error("LLM response format error");
  }
}

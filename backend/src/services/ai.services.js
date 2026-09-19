const { GoogleGenAI, Type } = require("@google/genai");
const { OpenAI } = require("openai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });



// Groq Client Setup (OpenAI SDK)
const fallbackAI = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const generateWithFallback = async (prompt) => {
  console.log("⚠️ Falling back to Groq AI...");

  const completion = await fallbackAI.chat.completions.create({
    model: "openai/gpt-oss-20b", 
    messages: [
      {
        role: "system",
        content: 'You are an AI for LinkUp chat. Return JSON with key "suggestions" containing array of 3 short strings.',
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  

  const content = completion.choices[0].message.content;
  const parsed = JSON.parse(content);
  return parsed.suggestions;
};

const generateChatSuggestionsService = async (
  userA,
  userB,
  chatHistory = [],
) => {

  const formattedHistory = chatHistory
      .slice(-5)
      .map(
        (msg) =>
          `${msg.sender?.toString() === userA._id.toString() ? "User A" : "User B"}: "${msg.text || msg.message}"`,
      )
      .join("\n");

  const prompt = `You are an AI for LinkUp chat.
          User A Bio: "${userA?.bio?.slice(0, 60) || ""}"
          User B Bio: "${userB?.bio?.slice(0, 60) || ""}"
          Chat: ${formattedHistory || ""}
          Generate 3 concise, friendly reply suggestions for User A.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3 short suggested messages",
            },
          },
          required: ["suggestions"],
        },
      },
    });

    const parsed = JSON.parse(response.text);
    return parsed.suggestions;
  } catch (primaryError) {
    console.error("❌ Primary AI (Gemini) failed:", primaryError.message);

    // 2. Groq fallback function 
    try {
      return await generateWithFallback(prompt);
    } catch (fallbackError) {
      console.error(
        "❌ Fallback AI (groq) also failed:",
        fallbackError.message,
      );
      throw new Error("Both AI services are currently unavailable.");
    }
  }
};

module.exports = {
  generateChatSuggestionsService,
};

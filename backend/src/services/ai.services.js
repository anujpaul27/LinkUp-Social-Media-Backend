const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateChatSuggestionsService = async (userA, userB, chatHistory = []) => {
  try {
    const formattedHistory = chatHistory
      .slice(-5)
      .map(
        (msg) =>
          `${msg.sender?.toString() === userA._id.toString() ? "User A" : "User B"}: "${msg.text || msg.message}"`,
      )
      .join("\n");

    const prompt = `
      You are an AI conversation assistant for LinkUp social media.
      User A Profile: Bio: "${userA?.bio || "No bio"}", Interests: [${userA?.interests?.join(", ") || "None"}]
      User B Profile: Bio: "${userB?.bio || "No bio"}", Interests: [${userB?.interests?.join(", ") || "None"}]

      Recent Chat History:
      ${formattedHistory || "No previous messages yet."}

      Generate 3 short, natural, and friendly message/reply suggestions for User A to send next.
    `;

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
  } catch (error) {
    console.error("AI Suggestion Error:", error);
    throw new Error("Failed to generate suggestions");
  }
}

module.exports = {
  generateChatSuggestionsService,
};

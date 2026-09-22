const { GoogleGenAI, Type } = require("@google/genai");
const { OpenAI } = require("openai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Groq Client Setup (OpenAI SDK)
const fallbackAI = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Groq calling
const generateWithFallback = async (prompt) => {
  console.log("⚠️ Falling back to Groq AI...");

  const completion = await fallbackAI.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content:
          'You are an AI for LinkUp chat. Return JSON with key "suggestions" containing array of 3 short strings.',
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

// ==========================================
// 1. Text Rewrite or Polishing with AI
// ==========================================
const generatePolishedPost = async (text) => {
  const prompt = `Rewrite and polish the following social media post to make it more engaging, well-written, and attractive, while keeping its original meaning intact: "${text}"`;

  try {
    // Primary Provider: Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            polishedText: {
              type: Type.STRING,
              description:
                "The rewritten and polished version of the social media post.",
            },
          },
          required: ["polishedText"],
        },
      },
    });

    const tokenUsage = response.usageMetadata;
    console.log(`[Gemini] Prompt Tokens: ${tokenUsage?.promptTokenCount}`);
    console.log(
      `[Gemini] Candidates Tokens: ${tokenUsage?.candidatesTokenCount}`,
    );
    console.log(`[Gemini] Total Tokens: ${tokenUsage?.totalTokenCount}`);

    const parsedData = JSON.parse(response.text);
    return parsedData.polishedText;
  } catch (error) {
    console.warn(
      "⚠️ Gemini AI failed for polishing post. Switching to Groq fallback...",
      error.message,
    );

    // Fallback Provider: Groq (Llama 3.3)
    try {
      const completion = await fallbackAI.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content:
              'You are an expert content editor. Return JSON with key "polishedText" containing the rewritten version.',
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      });

      console.log(`[Groq] Total Tokens: ${completion.usage?.total_tokens}`);

      const content = completion.choices[0].message.content;
      const parsedData = JSON.parse(content);
      return parsedData.polishedText;
    } catch (fallbackError) {
      console.error(
        "❌ Both Gemini and Groq AI failed:",
        fallbackError.message,
      );
      throw new Error("Unable to polish post right now.");
    }
  }
};

// ==========================================
// 2. Create Caption Built on Uploaded Image
// ==========================================
const generateCaptionFromImage = async (
  base64Image,
  mimeType = "image/jpeg",
) => {
  const prompt =
    "Analyze this image and write a catchy, short social media caption for it with a few relevant hashtags.";

  try {
    // Primary Provider: Gemini (Vision)
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: {
              type: Type.STRING,
              description:
                "The generated short social media caption with hashtags.",
            },
          },
          required: ["caption"],
        },
      },
    });

    const tokenUsage = response.usageMetadata;
    console.log(`[Gemini] Prompt Tokens: ${tokenUsage?.promptTokenCount}`);
    console.log(
      `[Gemini] Candidates Tokens: ${tokenUsage?.candidatesTokenCount}`,
    );
    console.log(
      `[Gemini] Total Tokens From image: ${tokenUsage?.totalTokenCount}`,
    );

    const parsedData = JSON.parse(response.text);
    return parsedData.caption;
  } catch (error) {
    console.warn(
      "⚠️ Gemini Vision AI failed. Switching to Groq text fallback...",
      error.message,
    );

    // Fallback Provider: Groq (Text Context/Generic Caption Fallback)
    try {
      const fallbackPrompt =
        "Generate a general engaging, creative social media caption with trending hashtags for a lifestyle photo.";

      const completion = await fallbackAI.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content:
              'You are a social media manager. Return JSON with key "caption" containing a catchy caption and hashtags.',
          },
          { role: "user", content: fallbackPrompt },
        ],
        response_format: { type: "json_object" },
      });

      console.log(`[Groq] Total Tokens: ${completion.usage?.total_tokens}`);

      const content = completion.choices[0].message.content;
      const parsedData = JSON.parse(content);
      return parsedData.caption;
    } catch (fallbackError) {
      console.error(
        "❌ Both Gemini and Groq AI failed:",
        fallbackError.message,
      );
      throw new Error("Unable to generate caption right now.");
    }
  }
};

module.exports = {
  generateChatSuggestionsService,
  generatePolishedPost,
  generateCaptionFromImage,
};

import type { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";
import OpenAI from "openai/index.mjs";
import Sentiment from "sentiment";

dotenv.config();
const sentiment = new Sentiment();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Valid message is required" });
    }

    // Basic check to block code-related requests
    const forbiddenKeywords = [
      "code",
      "javascript",
      "python",
      "html",
      "generate",
      "build",
      "script",
    ];
    if (forbiddenKeywords.some((kw) => message.toLowerCase().includes(kw))) {
      return res.status(400).json({
        error:
          "This chatbot is for emotional support only. Technical requests are not allowed.",
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const sentimentResult = sentiment.analyze(message);
    const tone =
      sentimentResult.score > 0
        ? "positive"
        : sentimentResult.score < 0
        ? "negative"
        : "neutral";

    const systemMessage = {
      role: "system",
      content: `
        You are TheraBot, a compassionate, supportive AI therapist. 
        Your role is to provide emotional support, active listening, and mental health guidance.
        Do not generate code, answer technical questions, or discuss topics outside emotional well-being.
        If a message asks for anything outside mental support, kindly redirect or decline respectfully.`,
    };

    const userMessage = {
      role: "user",
      content: `Tone: ${tone}. Message: ${message}`,
    };
    

    const moderationRes = await openai.moderations.create({ input: message });
    const [results] = moderationRes.results;

    if (results.flagged) {
      return res.status(400).json({
        error:
          "Your message was flagged as inappropriate or unsafe. Please rephrase it.",
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        systemMessage,
        ...history,
        { role: "user", content: `Tone: ${tone}. Message: ${message}` },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    res.status(200).json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

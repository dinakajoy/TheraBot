// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";
import OpenAI from "openai";
import Sentiment from "sentiment";

dotenv.config();
const sentiment = new Sentiment();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    // OpenAI Setup
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Extract data from request body
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const sentimentResult = sentiment.analyze(message);
    const tone = sentimentResult.score > 0 ? "positive" : sentimentResult.score < 0 ? "negative" : "neutral";
    // Send message to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: `Tone: ${tone}. Message: ${message}` }],
    });

    // Send back OpenAI response
    res.status(200).json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

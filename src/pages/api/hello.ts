// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";
import OpenAI from "openai";
import mongoose from "mongoose";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  // Connect to MongoDB
  mongoose.connect(process.env.MONGO_URI);

  // OpenAI Setup
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  res.status(200).json({ name: "John Doe" });
}

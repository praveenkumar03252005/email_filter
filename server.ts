import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  const groqApiKey = process.env.GROQ_API_KEY;
  let groq: Groq | null = null;

  if (groqApiKey) {
    groq = new Groq({ apiKey: groqApiKey });
  }

  // API routes
  app.post("/api/classify", async (req, res) => {
    try {
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: "Email content is required" });
      }

      if (!groq) {
        return res.status(500).json({ 
          error: "Groq API key not configured. Please add GROQ_API_KEY to your environment variables." 
        });
      }

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert email classifier. Your task is to analyze the provided email content and classify it as either 'SPAM' or 'NOT SPAM'. Provide a brief reason for your classification. Return the result in JSON format: { \"classification\": \"SPAM\" | \"NOT SPAM\", \"reason\": \"...\", \"confidence\": 0.0-1.0 }"
          },
          {
            role: "user",
            content: `Classify this email:\n\n${content}`
          }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");
      res.json(result);
    } catch (error) {
      console.error("Classification error:", error);
      res.status(500).json({ error: "Failed to classify email" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

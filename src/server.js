import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { analyzeMessageWithOpenAI } from "./analyzer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (_req, res) => {
  res.json({ service: "AI Alarm Analyzer Service", status: "ok" });
});

app.post("/analyze-message", async (req, res) => {
  try {
    const { message } = req.body || {};
    if (typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "'message' is required in JSON body" });
    }

    const result = await analyzeMessageWithOpenAI(message.trim());
    return res.status(200).json(result);
  } catch (error) {
    const isAuthError =
      error && typeof error.message === "string" && error.message.includes("OPENAI_API_KEY");
    const status = isAuthError ? 500 : 502;
    return res.status(status).json({ error: "Failed to analyze message", details: error.message });
  }
});

// Serve test UI at /ui
app.get("/ui", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use((err, _req, res, _next) => {
  // Fallback error handler
  const message = err?.message || "Internal Server Error";
  res.status(500).json({ error: message });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`AI Alarm Analyzer Service listening on port ${port}`);
  if (!process.env.OPENAI_API_KEY) {
    // eslint-disable-next-line no-console
    console.warn("Warning: OPENAI_API_KEY is not set. Requests will fail.");
  }
});



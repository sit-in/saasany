import { openai } from "@ai-sdk/openai";

const modelName = process.env.AI_MODEL ?? "gpt-4o-mini";

export const aiModel = openai(modelName);

export const systemPrompt =
  process.env.AI_SYSTEM_PROMPT ??
  "You are a helpful assistant. Be concise and clear in your responses.";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { aiModel, systemPrompt } from "@/lib/ai";
import { generateText } from "ai";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let prompt: string;
  try {
    const body = await req.json();
    prompt = body.prompt;
    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "prompt is required" }, { status: 400 });
    }
  } catch {
    return Response.json({ error: "Bad Request" }, { status: 400 });
  }

  try {
    const result = await generateText({
      model: aiModel,
      system: systemPrompt,
      prompt,
    });

    return Response.json({ text: result.text });
  } catch (err) {
    console.error("[generate] error:", err);
    return Response.json({ error: "Generation failed" }, { status: 500 });
  }
}

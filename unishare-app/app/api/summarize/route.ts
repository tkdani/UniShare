import { streamText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfParse from "pdf-parse";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { content, fileName, fileType } = await req.json();

  let actualContent = content;
  if (content.startsWith("http")) {
    const res = await fetch(content);
    actualContent = await res.text();
  }

  const result = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: `You are a helpful assistant that summarizes files. 
Provide a clear, concise summary in 2-3 sentences explaining what the file contains and its purpose.
If it's code, explain what the code does.
If it's an image description, describe what's shown.
Respond in the same language as the content if possible.`,
    prompt: `Summarize this ${fileType} file named "${fileName}":\n\n${actualContent}`,
  });

  return result.toUIMessageStreamResponse();
}

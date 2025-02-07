import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"
import type { Message } from "./types"
import type { LanguageOption } from "./LanguageSelector"

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  dangerouslyAllowBrowser: true
})

export async function fetchStreamingResponse(
  content: string,
  history: Message[],
  language: LanguageOption,
): Promise<Response> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are a helpful AI assistant. Please communicate in ${language.nativeName} (${language.label}). If the user switches languages, adapt and respond in the new language.`,
      },
      ...history.map((msg) => ({
        role: msg.sender.toLowerCase() === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      { role: "user", content },
    ],
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}


import type { Message } from "./types"

const API_URL = "https://your-api-endpoint.com/chat"

// Function to get the value of a cookie by name
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null
  return null
}

export async function fetchStreamingResponse(content: string, history: Message[]): Promise<Message> {
  // Get the sessionid cookie
  const sessionId = getCookie("sessionid")

  if (!sessionId) {
    throw new Error("No session ID found. Please log in.")
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionId}`,
      },
      body: JSON.stringify({ content, history }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body!.getReader()
    let responseContent = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      responseContent += new TextDecoder().decode(value)
    }

    return {
      content: responseContent,
      sender: "AI",
      timestamp: Date.now(),
    }
  } catch (error) {
    console.error("Error fetching streaming response:", error)
    throw error
  }
}


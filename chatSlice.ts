"use client"

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Message } from "./types"

interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
}

const initialState: ChatState = {
  messages: [
    {
      content: "Hello! How can I help you today?",
      sender: "AI",
      timestamp: Date.now() - 50000,
    },
  ],
  isLoading: false,
  error: null,
}

// Mock responses for demonstration
const mockResponses = [
  "I understand your question. Let me help you with that.",
  "That's an interesting point. Here's what I think:\n\n- Point 1\n- Point 2\n- Point 3",
  "Based on the information you've provided, I would suggest checking out [this resource](https://example.com).",
  "I'm processing your request. Here's what I found:\n\n```\nSome code example\n```",
]

const mockErrors = [
  "Error: Connection timeout. Please try again.",
  "Error 429: Too many requests. Please wait a moment before trying again.",
  "Error: Unable to process your request at this time.",
]

export const sendMessage = createAsyncThunk("chat/sendMessage", async (content: string) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Randomly decide whether to simulate an error (1 in 5 chance)
  if (Math.random() < 0.2) {
    throw new Error(mockErrors[Math.floor(Math.random() * mockErrors.length)])
  }

  const response = mockResponses[Math.floor(Math.random() * mockResponses.length)]

  // Simulate streaming by breaking the response into chunks
  const words = response.split(" ")
  let fullResponse = ""

  for (const word of words) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    fullResponse += word + " "
  }

  return {
    userMessage: {
      content,
      sender: "User",
      timestamp: Date.now(),
    },
    aiMessage: {
      content: fullResponse.trim(),
      sender: "AI",
      timestamp: Date.now() + 1000,
    },
  }
})

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearHistory: (state) => {
      state.messages = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false
        state.messages.push(action.payload.userMessage)
        state.messages.push(action.payload.aiMessage)
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "An error occurred"
        state.messages.push({
          content: state.error,
          sender: "System",
          timestamp: Date.now(),
        })
      })
  },
})


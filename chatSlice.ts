import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Message } from "./types"
import { fetchStreamingResponse } from "./api"
import type { LanguageOption } from "./LanguageSelector"

interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  currentStreamingMessage: Message | null
  language: LanguageOption
}

const initialState: ChatState = {
  messages: [
    {
      content: "Hello! How can I help you today?",
      sender: "Assistant",
      timestamp: Date.now() - 50000,
    },
  ],
  isLoading: false,
  error: null,
  currentStreamingMessage: null,
  language: { value: "en", label: "English", nativeName: "English" },
}

export const sendMessage = createAsyncThunk("chat/sendMessage", async (content: string, { getState, dispatch }) => {
  const state = getState() as { chat: ChatState }
  const { messages, language } = state.chat

  const userMessage: Message = {
    content,
    sender: "User",
    timestamp: Date.now(),
  }

  dispatch(chatSlice.actions.addMessage(userMessage))

  const response = await fetchStreamingResponse(content, messages, language)
  const reader = response.body?.getReader()

  if (reader) {
    dispatch(
      chatSlice.actions.startStreaming({
        content: "",
        sender: "Assistant",
        timestamp: Date.now(),
      }),
    )

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = new TextDecoder().decode(value)
      dispatch(chatSlice.actions.appendToStreamingMessage(chunk))
    }

    dispatch(chatSlice.actions.finishStreaming())
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
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload)
    },
    startStreaming: (state, action: PayloadAction<Message>) => {
      state.currentStreamingMessage = action.payload
    },
    appendToStreamingMessage: (state, action: PayloadAction<string>) => {
      if (state.currentStreamingMessage) {
        state.currentStreamingMessage.content += action.payload
      }
    },
    finishStreaming: (state) => {
      if (state.currentStreamingMessage) {
        state.messages.push(state.currentStreamingMessage)
        state.currentStreamingMessage = null
      }
    },
    setLanguage: (state, action: PayloadAction<LanguageOption>) => {
      state.language = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.isLoading = false
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

export const { clearHistory, addMessage, startStreaming, appendToStreamingMessage, finishStreaming, setLanguage } =
  chatSlice.actions


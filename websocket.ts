import { store } from "./store"
import { chatSlice } from "./chatSlice"

let socket: WebSocket | null = null

export function initializeWebSocket() {
  socket = new WebSocket("wss://your-real-chatbot-websocket-endpoint.com")

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data)
    store.dispatch(chatSlice.actions.addMessage(message))
  }

  socket.onclose = () => {
    console.log("WebSocket connection closed")
    // Implement reconnection logic here
  }

  socket.onerror = (error) => {
    console.error("WebSocket error:", error)
  }
}

export function sendWebSocketMessage(message: string) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ message }))
  } else {
    console.error("WebSocket is not connected")
  }
}


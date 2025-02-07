export interface Message {
  content: string
  sender: "User" | "Assistant" | "System"
  timestamp: number
}


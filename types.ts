export interface Message {
  content: string
  sender: "User" | "AI" | "System"
  timestamp: number
}


import type React from "react"
import styled from "@emotion/styled"
import type { Message } from "./types"
import ReactMarkdown from "react-markdown"

const StyledMessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
`

const MessageItem = styled.div<{ $isUser: boolean }>`
  margin-bottom: 20px;
  text-align: ${(props) => (props.$isUser ? "right" : "left")};
`

const SenderName = styled.div`
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
`

const MessageContent = styled.div<{ $isUser: boolean; $isError: boolean }>`
  display: inline-block;
  background-color: ${(props) => (props.$isError ? "white" : props.$isUser ? "#E2E8F0" : "#FFF3E0")};
  color: ${(props) => (props.$isError ? "#DC2626" : "#1F2937")};
  padding: 8px 12px;
  border-radius: 10px;
  max-width: 70%;
  border: ${(props) => (props.$isError ? "1px solid #DC2626" : "none")};
`

const MessageText = styled.div`
  margin-bottom: 4px;
`

const Timestamp = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.8;
  text-align: right;
`

interface MessageListProps {
  messages: Message[]
  streamingMessage: Message | null
}

export const MessageList: React.FC<MessageListProps> = ({ messages, streamingMessage }) => {
  return (
    <StyledMessageList aria-live="polite" aria-relevant="additions">
      {messages.map((message, index) => (
        <MessageItem key={index} $isUser={message.sender === "User"}>
          <SenderName>{message.sender === "AI" ? "Addison" : message.sender}</SenderName>
          <MessageContent $isUser={message.sender === "User"} $isError={message.sender === "System"}>
            <MessageText>
              {message.sender === "User" ? message.content : <ReactMarkdown>{message.content}</ReactMarkdown>}
            </MessageText>
            <Timestamp>{new Date(message.timestamp).toLocaleString()}</Timestamp>
          </MessageContent>
        </MessageItem>
      ))}
      {streamingMessage && (
        <MessageItem $isUser={false}>
          <SenderName>Addison</SenderName>
          <MessageContent $isUser={false} $isError={false}>
            <MessageText>
              <ReactMarkdown>{streamingMessage.content}</ReactMarkdown>
            </MessageText>
            <Timestamp>{new Date(streamingMessage.timestamp).toLocaleString()}</Timestamp>
          </MessageContent>
        </MessageItem>
      )}
    </StyledMessageList>
  )
}


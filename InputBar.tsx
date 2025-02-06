"use client"

import type React from "react"
import { useState } from "react"
import styled from "styled-components"
import { useSelector } from "react-redux"
import type { RootState } from "./store"
import { Loader2 } from "lucide-react"

const StyledInputBar = styled.form`
  display: flex;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.background};
`

const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  height: 36px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary};
  }
`

const SendButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 36px;
  margin-left: 8px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  
  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const LoadingSpinner = styled(Loader2)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

interface InputBarProps {
  onSendMessage: (content: string) => void
}

export const InputBar: React.FC<InputBarProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState("")
  const isLoading = useSelector((state: RootState) => state.chat.isLoading)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput("")
    }
  }

  return (
    <StyledInputBar onSubmit={handleSubmit}>
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        maxLength={256}
        aria-label="Message input"
        disabled={isLoading}
      />
      <SendButton type="submit" disabled={isLoading}>
        {isLoading ? <LoadingSpinner size={24} /> : "Send"}
      </SendButton>
    </StyledInputBar>
  )
}


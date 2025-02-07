"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "@emotion/styled"
import { MessageList } from "./MessageList"
import { InputBar } from "./InputBar"
import { LanguageSelector, type LanguageOption } from "./LanguageSelector"
import { sendMessage, setLanguage } from "./chatSlice"
import type { RootState } from "./store"
import { Maximize2, Minimize2, X, Download, Globe } from "lucide-react"
import { ThemeProvider } from "@emotion/react"
import { theme } from "./theme"

const StyledChatWindow = styled.div<{ isResizing: boolean }>`
  position: fixed;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
  min-width: 300px;
  min-height: 400px;
  width: 350px;
  height: 500px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  resize: both;
  ${({ isResizing }) =>
    isResizing &&
    `
    user-select: none;
    pointer-events: none;
  `}
`

const ChatHeader = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
`

const HeaderTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
`

const HeaderButtons = styled.div`
  display: flex;
  gap: 4px;
`

const HeaderButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
  }
`

const ChatContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const LanguageWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: 8px;
`

const SaveButton = styled(HeaderButton)`
  color: ${({ theme }) => theme.colors.primary};
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  margin: 0 10px 10px 10px;
  &:hover {
    background-color: rgba(138, 43, 226, 0.1);
  }
`

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
`

interface ChatWindowProps {
  onClose: () => void
  position: "top-right" | "bottom-right" | "bottom-left" | "top-left"
  windowPosition: { top?: number; right?: number; bottom?: number; left?: number }
  setWindowPosition: React.Dispatch<
    React.SetStateAction<{ top?: number; right?: number; bottom?: number; left?: number }>
  >
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onClose, position, windowPosition, setWindowPosition }) => {
  const dispatch = useDispatch()
  const messages = useSelector((state: RootState) => state.chat.messages)
  const currentStreamingMessage = useSelector((state: RootState) => state.chat.currentStreamingMessage)
  const language = useSelector((state: RootState) => state.chat.language)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const chatWindowRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startX: number; startY: number; startTop: number; startLeft: number } | null>(null)
  const resizeRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number } | null>(null)

  const handleSendMessage = (content: string) => {
    dispatch(sendMessage(content))
  }

  const handleExpandChat = () => {
    setIsExpanded(!isExpanded)
  }

  const handleSaveChat = () => {
    const chatHistory = messages
      .map((msg) => `${msg.sender} (${new Date(msg.timestamp).toLocaleString()}): ${msg.content}`)
      .join("\n")
    const blob = new Blob([chatHistory], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "chat_history.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleLanguageChange = (selectedLanguage: LanguageOption) => {
    dispatch(setLanguage(selectedLanguage))
  }

  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, []) //Corrected useEffect dependency

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    const rect = chatWindowRef.current?.getBoundingClientRect()
    if (!rect) return

    dragRef.current = {
      startX: e.pageX,
      startY: e.pageY,
      startTop: rect.top,
      startLeft: rect.left,
    }
    document.addEventListener("mousemove", handleDragMove)
    document.addEventListener("mouseup", handleDragEnd)
  }

  const handleDragMove = (e: MouseEvent) => {
    if (!dragRef.current || !chatWindowRef.current) return
    const dx = e.pageX - dragRef.current.startX
    const dy = e.pageY - dragRef.current.startY

    const rect = chatWindowRef.current.getBoundingClientRect()
    const newTop = Math.max(0, Math.min(window.innerHeight - rect.height, dragRef.current.startTop + dy))
    const newLeft = Math.max(0, Math.min(window.innerWidth - rect.width, dragRef.current.startLeft + dx))

    setWindowPosition({
      top: newTop,
      left: newLeft,
      bottom: undefined,
      right: undefined,
    })
  }

  const handleDragEnd = () => {
    dragRef.current = null
    document.removeEventListener("mousemove", handleDragMove)
    document.removeEventListener("mouseup", handleDragEnd)
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    const rect = chatWindowRef.current?.getBoundingClientRect()
    if (!rect) return

    resizeRef.current = {
      startX: e.pageX,
      startY: e.pageY,
      startWidth: rect.width,
      startHeight: rect.height,
    }
    setIsResizing(true)
    document.addEventListener("mousemove", handleResizeMove)
    document.addEventListener("mouseup", handleResizeEnd)
  }

  const handleResizeMove = (e: MouseEvent) => {
    if (!resizeRef.current || !chatWindowRef.current) return
    const dx = e.pageX - resizeRef.current.startX
    const dy = e.pageY - resizeRef.current.startY

    const newWidth = Math.max(300, resizeRef.current.startWidth + dx)
    const newHeight = Math.max(400, resizeRef.current.startHeight + dy)

    chatWindowRef.current.style.width = `${newWidth}px`
    chatWindowRef.current.style.height = `${newHeight}px`
  }

  const handleResizeEnd = () => {
    resizeRef.current = null
    setIsResizing(false)
    document.removeEventListener("mousemove", handleResizeMove)
    document.removeEventListener("mouseup", handleResizeEnd)
  }

  return (
    <ThemeProvider theme={theme}>
      <StyledChatWindow
        role="dialog"
        aria-label="Chat window"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={chatWindowRef}
        style={{
          ...windowPosition,
        }}
        isResizing={isResizing}
      >
        <ChatHeader onMouseDown={handleDragStart}>
          <HeaderTitle>Chat with AI</HeaderTitle>
          <HeaderButtons>
            <HeaderButton onClick={handleExpandChat} aria-label={isExpanded ? "Collapse chat" : "Expand chat"}>
              {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </HeaderButton>
            <HeaderButton onClick={onClose} aria-label="Close chat">
              <X size={18} />
            </HeaderButton>
          </HeaderButtons>
        </ChatHeader>
        <LanguageWrapper>
          <Globe size={18} />
          <LanguageSelector language={language.value} onLanguageChange={handleLanguageChange} />
        </LanguageWrapper>
        <ChatContent ref={contentRef}>
          <MessageList messages={messages} streamingMessage={currentStreamingMessage} />
        </ChatContent>
        <BottomSection>
          <InputBar onSendMessage={handleSendMessage} />
          <SaveButton onClick={handleSaveChat} aria-label="Save chat history">
            <Download size={18} />
          </SaveButton>
        </BottomSection>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "10px",
            height: "10px",
            cursor: "se-resize",
          }}
          onMouseDown={handleResizeStart}
        />
      </StyledChatWindow>
    </ThemeProvider>
  )
}


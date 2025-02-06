"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import styled from "styled-components"
import { ChatWindow } from "./ChatWindow"
import { ChatButton } from "./ChatButton"
import { chatSlice } from "./chatSlice"
import { ThemeProvider } from "styled-components"
import { theme } from "./theme"

const StyledChatInterface = styled.div`
  font-family: Arial, sans-serif;
`

interface ChatInterfaceProps {
  position: "top-right" | "bottom-right" | "bottom-left" | "top-left"
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ position }) => {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [windowPosition, setWindowPosition] = useState(() => {
    switch (position) {
      case "top-right":
        return { top: 20, right: 20 }
      case "bottom-right":
        return { bottom: 20, right: 20 }
      case "bottom-left":
        return { bottom: 20, left: 20 }
      case "top-left":
        return { top: 20, left: 20 }
    }
  })
  const chatRef = useRef<HTMLDivElement>(null)
  const originalPosition = windowPosition

  const toggleChat = () => {
    if (isOpen) {
      dispatch(chatSlice.actions.clearHistory())
    }
    setIsOpen(!isOpen)
  }

  const handleButtonClick = () => {
    setIsOpen(!isOpen)
  }

  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <StyledChatInterface ref={chatRef}>
        {isOpen && <ChatWindow onClose={toggleChat} position={position} windowPosition={windowPosition} />}
        <ChatButton onOpen={handleButtonClick}  position={position} isOpen={isOpen} />
      </StyledChatInterface>
    </ThemeProvider>
  )
}


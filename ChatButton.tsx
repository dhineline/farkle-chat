"use client"

import type React from "react"
import styled from "@emotion/styled"

const StyledChatButton = styled.button<{
  position: "top-right" | "bottom-right" | "bottom-left" | "top-left"
  isOpen: boolean
}>`
  position: fixed;
  ${({ position }) => {
    switch (position) {
      case "top-right":
        return "top: 20px; right: 20px;"
      case "bottom-right":
        return "bottom: 20px; right: 20px;"
      case "bottom-left":
        return "bottom: 20px; left: 20px;"
      case "top-left":
        return "top: 20px; left: 20px;"
    }
  }}
  background-color: ${({ isOpen }) => (isOpen ? "#808080" : "hsl(210, 100%, 50%)")};
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 999;
  width: ${({ isOpen }) => (isOpen ? "30px" : "60px")};
  height: ${({ isOpen }) => (isOpen ? "30px" : "60px")};
  font-size: ${({ isOpen }) => (isOpen ? "12px" : "24px")};

  &:hover {
    transform: scale(1.05);
    background-color: hsl(210, 100%, 50%);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.5);
  }
`

interface ChatButtonProps {
  onOpen?: () => void
  position: "top-right" | "bottom-right" | "bottom-left" | "top-left"
  isOpen: boolean
}

export const ChatButton: React.FC<ChatButtonProps> = ({ onOpen, position, isOpen }) => {
  const handleClick = () => {
    if (onOpen) {
      onOpen()
    }
  }

  return (
    <StyledChatButton
      onClick={handleClick}
      position={position}
      isOpen={isOpen}
      aria-label={isOpen ? "Reposition chat" : "Open chat"}
    >
      💬
    </StyledChatButton>
  )
}


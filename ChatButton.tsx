"use client"

import type React from "react"
import styled from "styled-components"

const StyledChatButton = styled.button<{ position: string; $isOpen: boolean }>`
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
  background-color: ${({ theme, $isOpen }) => ($isOpen ? "#808080" : theme.colors.primary)};
  color: white;
  border: none;
  border-radius: 50%;
  width: ${({ $isOpen }) => ($isOpen ? "30px" : "60px")};
  height: ${({ $isOpen }) => ($isOpen ? "30px" : "60px")};
  font-size: ${({ $isOpen }) => ($isOpen ? "12px" : "24px")};
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 999;

  &:hover {
    transform: ${({ $isOpen }) => ($isOpen ? "scale(1.1)" : "scale(1.05)")};
    background-color: ${({ theme, $isOpen }) => ($isOpen ? "#808080" : theme.colors.primary)};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.5);
  }
`

/**
 * ChatButton component
 * @param {Object} props - Component props
 * @param {() => void} [props.onOpen] - Optional function to call when the button is clicked and chat is closed
 * @param {"top-right" | "bottom-right" | "bottom-left" | "top-left"} props.position - Position of the button
 * @param {boolean} props.isOpen - Whether the chat is open
 */
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
      $isOpen={isOpen}
      aria-label={isOpen ? "Reposition chat" : "Open chat"}
    >
      💬
    </StyledChatButton>
  )
}


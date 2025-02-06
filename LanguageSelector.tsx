"use client"

import type React from "react"
import styled from "styled-components"

const StyledSelect = styled.select`
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: white;
  flex: 1;
  font-family: Arial, sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary};
  }
`

interface LanguageSelectorProps {
  language: string
  onLanguageChange: (language: string) => void
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onLanguageChange }) => {
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "de", name: "Deutsch" },
    { code: "fr", name: "Français" },
    { code: "pt", name: "Português" },
    { code: "it", name: "Italiano" },
    { code: "el", name: "Ελληνικά" },
  ]

  return (
    <StyledSelect value={language} onChange={(e) => onLanguageChange(e.target.value)} aria-label="Select language">
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </StyledSelect>
  )
}


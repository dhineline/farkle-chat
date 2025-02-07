"use client"

import type React from "react"
import Select from "react-select"
import styled from "@emotion/styled"

const StyledSelect = styled(Select)`
  width: 100%;
  font-size: 14px;
  .react-select__control {
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    background-color: white;
    min-height: 36px;
  }
  .react-select__value-container {
    padding: 2px 8px;
  }
  .react-select__input-container {
    margin: 0;
    padding: 0;
  }
  .react-select__single-value {
    color: ${({ theme }) => theme.colors.text};
  }
  .react-select__menu {
    z-index: 1000;
  }
`

export interface LanguageOption {
  value: string
  label: string
  nativeName: string
}

interface LanguageSelectorProps {
  language: string
  onLanguageChange: (language: LanguageOption) => void
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onLanguageChange }) => {
  const languages: LanguageOption[] = [
    { value: "en", label: "English", nativeName: "English" },
    { value: "es", label: "Spanish", nativeName: "Español" },
    { value: "de", label: "German", nativeName: "Deutsch" },
    { value: "fr", label: "French", nativeName: "Français" },
    { value: "pt", label: "Portuguese", nativeName: "Português" },
    { value: "it", label: "Italian", nativeName: "Italiano" },
    { value: "el", label: "Greek", nativeName: "Ελληνικά" },
  ]

  const handleChange = (selectedOption: LanguageOption | null) => {
    if (selectedOption) {
      onLanguageChange(selectedOption)
    }
  }

  return (
    <StyledSelect
      options={languages}
      value={languages.find((lang) => lang.value === language)}
      onChange={handleChange}
      aria-label="Select language"
      classNamePrefix="react-select"
    />
  )
}


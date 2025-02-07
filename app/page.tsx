"use client"
import { Provider } from "react-redux"
import { store } from "../store"
import { ChatInterface } from "../ChatInterface"
import styled from "@emotion/styled"

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
`

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
`

const Description = styled.p`
  color: #666;
  max-width: 600px;
  text-align: center;
  line-height: 1.6;
`

export default function Home() {
  return (
    <Provider store={store}>
      <PageContainer>
        <Title>Welcome to Our Chat Interface Demo</Title>
        <Description>
          This page demonstrates our chat interface component. You can see a chat button in the bottom-right corner of
          the screen. Click on it to open the chat window and interact with our AI assistant. The chat interface is
          fully responsive and accessible.
        </Description>
        <ChatInterface position="bottom-right" />
      </PageContainer>
    </Provider>
  )
}


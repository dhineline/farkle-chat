import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { store } from "./store"
import { ChatInterface } from "./ChatInterface"

export function initChatInterface(
  containerId: string,
  position: "top-right" | "bottom-right" | "bottom-left" | "top-left" = "bottom-right",
) {
  const container = document.getElementById(containerId)
  if (!container) {
    console.error(`Container with id "${containerId}" not found.`)
    return
  }

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <ChatInterface position={position} />
      </Provider>
    </React.StrictMode>,
    container,
  )
}
// For use in non-React projects
;(window as any).initChatInterface = initChatInterface


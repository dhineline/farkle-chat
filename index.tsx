import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { createStore } from "redux"
import { rootReducer } from "./reducers"
import { ChatInterface } from "./ChatInterface"

const store = createStore(rootReducer)

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


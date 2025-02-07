import { combineReducers } from "redux"
import { chatSlice } from "./chatSlice"

export const rootReducer = combineReducers({
  chat: chatSlice.reducer,
})


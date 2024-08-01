import { configureStore } from "@reduxjs/toolkit"
import { rootReducer } from "./rootStore"
import looger from "redux-logger"

export const store=configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(looger),
    devTools: process.env.NODE_ENV !== 'production',
})

export type AppDispatch=typeof store.dispatch
export type RootState=ReturnType<typeof store.getState>
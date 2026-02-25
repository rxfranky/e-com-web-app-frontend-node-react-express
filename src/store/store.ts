import { configureStore } from "@reduxjs/toolkit"
import authStateChangeReducer from "./auth/auth-slice"
import showStateChangeReducer from './show/show-slice'

const store = configureStore({
    reducer: {
        authStateChanger: authStateChangeReducer,
        showStateChanger: showStateChangeReducer
    }
})

export default store
import { configureStore } from "@reduxjs/toolkit"
import authStateChangeReducer from "./auth/auth-slice"

const store = configureStore({
    reducer: {
        authStateChanger: authStateChangeReducer
    }
})

export default store
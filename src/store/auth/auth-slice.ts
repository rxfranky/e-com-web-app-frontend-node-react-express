import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        authState: { isLoading: true }
    },
    reducers: {
        login: (state, action) => {
            state.authState = { ...action.payload, isLoading: false }
        },
        logout(state, action) {
            state.authState = { ...action.payload, isLoading: false }
        },
        authStateAction: (state, action) => {
            state.authState = { ...action.payload, isLoading: false }
        }
    }
})

export const { login, logout, authStateAction } = authSlice.actions
export default authSlice.reducer
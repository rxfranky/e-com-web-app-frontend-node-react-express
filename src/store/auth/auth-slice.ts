import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: localStorage.getItem('authToken') ? true : false,
        email: localStorage.getItem('email'),
        name: localStorage.getItem('name')
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true
            state.email = action.payload.email
            state.name = action.payload.name
        },
        logout(state) {
            state.isLoggedIn = false
            state.email = null
            state.name = null
        }
    }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
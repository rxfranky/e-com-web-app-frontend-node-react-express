import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: { isLoggedIn: localStorage.getItem('authToken') ? true : false, email: localStorage.getItem('email') },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true
            state.email = action.payload
        },
        logout(state) {
            state.isLoggedIn = false
            state.email = null
        }
    }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
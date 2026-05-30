import { createSlice } from "@reduxjs/toolkit";
import { getAuthState } from "../../utils/http-requests";


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        authState: localStorage.getItem('authToken') ? await getAuthState() : { isLoggedIn: false }
    },
    reducers: {
        login: (state, action) => {
            state.authState = {
                userData: {
                    name: action.payload.name,
                    email: action.payload.email
                },
                isLoggedIn: true
            }
        },
        logout(state) {
            state.authState = { isLoggedIn: false }
        }
    }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
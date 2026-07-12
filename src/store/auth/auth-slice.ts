import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        authState: localStorage.getItem('authToken') ? {
            isLoading: true,
            isLoggedIn: false,
            userData: {
                name: null,
                email: null
            },
            msg: null
        } : {
            isLoading: false,
            isLoggedIn: false,
            userData: {
                name: null,
                email: null
            },
            msg: null
        }
    },
    reducers: {
        login: (state, action) => {
            state.authState = {
                userData: {
                    name: action.payload.name,
                    email: action.payload.email
                },
                isLoggedIn: true,
                isLoading: false,
                msg: null
            }
        },
        logout(state) {
            state.authState = {
                isLoggedIn: false,
                userData: {
                    name: null,
                    email: null
                },
                isLoading: false,
                msg: null
            }
        },
        authStateAction: (state, action) => {
            state.authState = { ...action.payload, isLoading: false }
        }
    }
})

export const { login, logout, authStateAction } = authSlice.actions
export default authSlice.reducer
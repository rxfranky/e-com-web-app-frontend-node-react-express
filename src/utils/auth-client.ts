import { createAuthClient } from "better-auth/react"

export async function getoAuthToken() {
    const { data } = await createAuthClient({
        baseURL: import.meta.env.VITE_BACKEND_URL
    }).getSession()

    return data?.session.token;
}

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    fetchOptions: {
        headers: {
            authToken: 'Bearer ' + localStorage.getItem('authToken'),
            oAuthToken: 'Bearer ' + await getoAuthToken()
        }
    }
})

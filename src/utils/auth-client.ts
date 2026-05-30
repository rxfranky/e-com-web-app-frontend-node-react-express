import { createAuthClient } from "better-auth/react"

async function getToken() {
    const { data } = await createAuthClient({
        baseURL: 'https://e-com-practice-backend.onrender.com'
    }).getSession()

    return data?.session.token;
}

export const authClient = createAuthClient({
    baseURL: 'https://e-com-practice-backend.onrender.com',
    fetchOptions: {
        headers: {
            authToken: 'Bearer ' + localStorage.getItem('authToken'),
            oAuthToken: 'Bearer ' + await getToken()
        }
    }
})

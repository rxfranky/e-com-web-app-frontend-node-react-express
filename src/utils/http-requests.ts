export async function signup(userData: any) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
    if (!response.ok) {
        const err = new Error(data.msg || 'response is not ok for signup!') as Error & { statusCode: number }
        err.statusCode = response.status
        throw err
    }

    return data
}

export async function login(loginData: any) {
    const authToken: string | null = localStorage.getItem('authToken')
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        body: JSON.stringify({ email: loginData.email, password: loginData.password }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authToken: 'Bearer ' + authToken,
            oAuthToken: 'Bearer ' + loginData.oAuthToken
        }
    })
    const data = await response.json()
    if (!response.ok) {
        const err = new Error(data.msg || 'response is not ok for login') as Error & { statusCode: number }
        err.statusCode = response.status;
        throw err
    }
    return data;
}


export async function changePassword(data: any) {
    const authToken: string | null = localStorage.getItem('authToken')

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/changePassword`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            authToken: 'Bearer ' + authToken,
        }
    })
    const resData = await response.json()
    if (!response.ok) {
        const err = new Error(resData.msg || 'res is not ok for change password') as Error & { statusCode: number }
        err.statusCode = response.status
        throw err
    }
    return resData
}


export async function resetPassword(data: any) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/resetPassword`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const resData = await response.json()
    if (!response.ok) {
        const err = new Error(resData.msg || 'res is not ok for reset password!') as Error & { statusCode: number }
        err.statusCode = response.status
        throw err
    }
    return resData
}


export async function newPassword(data: any) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/newPassword`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const resData = await response.json()
    if (!response.ok) {
        const err = new Error(resData.msg || 'res is not ok for new password') as Error & { statusCode: number }
        err.statusCode = response.status
        throw err
    }
    return resData;
}

export async function addProduct(data: any) {
    const authToken: string | null = localStorage.getItem('authToken');

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/addProduct${data.product_id ? '?product_id=' + data.product_id : ''}`, {
        method: 'POST',
        body: data.formData,
        headers: {
            authToken: 'Bearer ' + authToken,
            oAuthToken: 'Bearer ' + data.oAuthToken
        }
    })
    const resData = await response.json()
    if (!response.ok) {
        const err = new Error(resData.msg || 'res is not ok for add product') as Error & { statusCode: number }
        err.statusCode = response.status
        throw err;
    }
    return resData;
}

export async function fetchProducts(signal: any, data?: { isAdmin: boolean; page: string | boolean; oAuthToken: string | undefined }) {
    const authToken: string | null = localStorage.getItem('authToken');
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/consumer/products?page=${data?.page}&isAdmin=${data?.isAdmin}`, {
        signal,
        headers: {
            authToken: 'Bearer ' + authToken,
            oAuthToken: 'Bearer ' + data?.oAuthToken
        }
    })
    const resData = await response.json()
    if (!response.ok) {
        const err = new Error(resData.msg || 'res is not ok for fetch products') as Error & { statusCode: number }
        err.statusCode = response.status
        throw err;
    }
    return resData
}

export async function addToCart({ id, quantity, oAuthToken }: { id: number; quantity?: number, oAuthToken: string | undefined }) {
    const authToken: string | null = localStorage.getItem('authToken')

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/consumer/addToCart/${id}/?quantity=${quantity}`, {
        headers: {
            authToken: 'Bearer ' + authToken,
            oAuthToken: 'Bearer ' + oAuthToken
        }
    })
    const resData = await response.json()
    if (!response.ok) {
        const err = new Error(resData.msg || 'res is not ok for add to cart') as Error & { statusCode: number }
        err.statusCode = response.status
        throw err;
    }
    return resData
}


export async function fetchCart(oAuthToken: string | undefined) {
    const authToken = localStorage.getItem('authToken')
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/consumer/fetchCart`, {
        headers: {
            authToken: 'Bearer ' + authToken,
            oAuthToken: 'Bearer ' + oAuthToken
        }
    })
    const data = await response.json()
    if (!response.ok) {
        const err = new Error(data.msg || 'res is not ok for fetch cart') as Error & { statusCode: number }
        err.statusCode = response.status
        throw err
    }
    return data;
}


export async function quantityControl({ id, action }: { id: number; action: string }) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/consumer/quantityControl/${id}?action=${action}`)
    const data = await response.json()
    if (!response.ok) {
        const err = new Error(data.msg || 'res is not ok for quntity control') as Error & { statusCode: number }
        err.statusCode = response.status
        throw err
    }
    return data;
}

export async function checkout(data: any) {
    const authToken: string | null = localStorage.getItem('authToken')

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/consumer/checkout`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": 'application/json',
            authToken: 'Bearer ' + authToken,
            oAuthToken: 'Bearer ' + data.oAuthToken
        }
    })
    const resData = await response.json()
    if (!response.ok) {
        const err = new Error(resData.msg || 'res is not for checkout') as Error & { statusCode: number }
        err.statusCode = response.status
        throw err;
    }
    return resData;
}


export async function fetchOrders(oAuthToken: string | undefined) {
    const authToken: string | null = localStorage.getItem('authToken')
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/consumer/fetchOrders`, {
        headers: {
            authToken: 'Bearer ' + authToken,
            oAuthToken: 'Bearer ' + oAuthToken
        }
    })
    const data = await response.json()
    if (!response.ok) {
        const err = new Error(data.msg || 'res is not ok for fetch orders') as Error & { statusCode: number }
        err.statusCode = response.status
        throw err;
    }
    return data
}

export async function deleteProduct({ id, oAuthToken }: { id: number; oAuthToken: string | undefined }) {
    const authToken: string | null = localStorage.getItem('authToken')
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/deleteProduct/${id}`, {
        method: 'DELETE',
        headers: {
            authToken: 'Bearer ' + authToken,
            oAuthToken: 'Bearer ' + oAuthToken
        }
    })
    const data = await response.json()
    if (!response.ok) {
        const err = new Error(data.msg || 'res is not ok for delete product') as Error & { statusCode: number }
        err.statusCode = response.status
        throw err;
    }
    return data;
}

export async function subscribe(email: string) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/consumer/subscribe`, {
        body: JSON.stringify({ email }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()

    if (!response.ok) {
        const err = new Error(data.msg || 'res is not ok for subscribe') as Error & {
            statusCode: number
        }
        err.statusCode = response.status
        throw err;
    }
    return data;
}

export async function getAuthState(): Promise<{ userData?: { name: string; email: string; }; msg?: string; isLoggedIn: boolean }> {
    const authToken = localStorage.getItem('authToken');
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/getAuthState`, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + authToken
        }
    })
    const data = await response.json();

    if (!response.ok) {
        const err = new Error(data.msg || 'res is not ok for getAuthState') as Error & {
            statusCode: number
        }
        err.statusCode = response.status
        throw err;
    }
    return data;
}

export async function logout(authToken: string | null) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + authToken
        }
    })
    const data = await response.json();

    if (!response.ok) {
        const err = new Error(data.msg || 'res is not ok for logout') as Error & { statusCode: number }
        err.statusCode = response.status
        throw err;
    }
    return data;
}


export async function getSearchedProduct(formData: { search?: string }) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/consumer/getSearchedProduct/?searchText=${formData.search}`)

    const data = await response.json()

    if (!response.ok) {
        const err = new Error(data.msg || 'response is not for get product') as Error & {
            statusCode: number
        }
        err.statusCode = response.status
        throw err
    }
    return data;
}


export async function addToWishlist({ id, action, oAuthToken }: { id: number; action: string; oAuthToken: string | undefined }) {
    const authToken: string | null = localStorage.getItem('authToken')
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/consumer/addToWishlist/${id}/?action=${action}`, {
        method: 'POST',
        headers: {
            authToken: 'Bearer ' + authToken,
            oAuthToken: 'Bearer ' + oAuthToken
        }
    })
    const data = await response.json()
    if (!response.ok) {
        const err = new Error(data.msg || 'res is not ok for addToWishlist!') as Error & {
            statusCode: number
        }
        err.statusCode = response.status;
        throw err;
    }
    return data;
}


export async function isInWishlist(id: number, isLoggedIn: boolean, oAuthToken: string | undefined) {
    if (!isLoggedIn) {
        return { isLoggedIn: false }
    }
    const authToken: null | string = localStorage.getItem('authToken')
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/consumer/isInWishlist/${id}`, {
        method: 'GET',
        headers: {
            authToken: 'Bearer ' + authToken,
            oAuthToken: 'Bearer ' + oAuthToken
        }
    })
    const data = await response.json();
    if (!response.ok) {
        const err = new Error(data.msg || 'res is not for isInWishlist!') as Error & {
            statusCode: number
        }
        err.statusCode = response.status;
        throw err;
    }
    return data;
}


export async function getWishlist(page: string, oAuthToken: string | undefined) {
    const authToken: null | string = localStorage.getItem('authToken')
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/consumer/getWishlist?page=${page}`, {
        method: 'GET',
        headers: {
            authToken: 'Bearer ' + authToken,
            oAuthToken: 'Bearer ' + oAuthToken
        }
    })
    const data = await response.json()
    if (!response.ok) {
        const err = new Error(data.msg || 'res is not for getWishlist!') as Error & {
            statusCode: number
        }
        err.statusCode = response.status;
        throw err;
    }
    return data;
}
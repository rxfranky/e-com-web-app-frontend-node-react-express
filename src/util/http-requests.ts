export async function signup(userData: any) {
    const response = await fetch('https://e-com-practice-backend.onrender.com/auth/signup', {
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
    const response = await fetch('https://e-com-practice-backend.onrender.com/auth/login', {
        body: JSON.stringify(loginData),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authToken: 'Bearer ' + authToken
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

    const response = await fetch('https://e-com-practice-backend.onrender.com/auth/changePassword', {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            authToken: 'Bearer ' + authToken
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
    const response = await fetch('https://e-com-practice-backend.onrender.com/auth/resetPassword', {
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
    const response = await fetch('https://e-com-practice-backend.onrender.com/auth/newPassword', {
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

    const response = await fetch(`https://e-com-practice-backend.onrender.com/admin/addProduct${data.product_id ? '?product_id=' + data.product_id : ''}`, {
        method: 'POST',
        body: data.formData,
        headers: {
            authToken: 'Bearer ' + authToken
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

export async function fetchProducts(signal: any, queryParam?: string, isAdmin?: boolean) {
    const authToken: string | null = localStorage.getItem('authToken');

    const response = await fetch(`https://e-com-practice-backend.onrender.com/consumer/products?page=${queryParam??null}&isAdmin=${isAdmin ?? false}`, {
        signal,
        headers: {
            authToken: 'Bearer ' + authToken
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

export async function addToCart(id: number) {
    const authToken: string | null = localStorage.getItem('authToken')

    const response = await fetch(`https://e-com-practice-backend.onrender.com/consumer/addToCart/${id}`, {
        headers: {
            authToken: 'Bearer ' + authToken
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


export async function fetchCart({ signal }: { signal: any }) {
    const authToken = localStorage.getItem('authToken')
    const response = await fetch('https://e-com-practice-backend.onrender.com/consumer/fetchCart', {
        signal,
        headers: {
            authToken: 'Bearer ' + authToken
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
    const response = await fetch(`https://e-com-practice-backend.onrender.com/consumer/quantityControl/${id}?action=${action}`)
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
    const response = await fetch('https://e-com-practice-backend.onrender.com/consumer/checkout', {
        headers: {
            authToken: 'Bearer ' + authToken,
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(data),
        method: 'POST'
    })
    const resData = await response.json()
    if (!response.ok) {
        const err = new Error(resData.msg || 'res is not for checkout') as Error & { statusCode: number }
        err.statusCode = response.status
        throw err;
    }
    return resData;
}


export async function fetchOrders({ signal }: { signal: any }) {
    const authToken: string | null = localStorage.getItem('authToken')
    const response = await fetch('https://e-com-practice-backend.onrender.com/consumer/fetchOrders', {
        signal,
        headers: {
            authToken: 'Bearer ' + authToken
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

export async function deleteProduct(id: number) {
    const authToken: string | null = localStorage.getItem('authToken')
    const response = await fetch(`https://e-com-practice-backend.onrender.com/admin/deleteProduct/${id}`, {
        method: 'DELETE',
        headers: {
            authToken: 'Bearer ' + authToken
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
import { Outlet } from "react-router";
import Header from "./header";
import Footer from "./footer"
import { getAuthState } from "@/utils/http-requests";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authStateAction } from "@/store/auth/auth-slice";
import { authClient } from "@/utils/auth-client";
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import Error from "@/pages/error";
import { logout } from '@/utils/http-requests'


interface queryRes {
    data: any;
    isError: boolean;
    error: any;
    isPending: boolean
}


export default function RootComponent() {
    const { data, isError, error, isPending }: queryRes = useQuery({
        queryFn: getAuthState,
        queryKey: ['get-authState']
    })

    const { mutate } = useMutation({
        mutationFn: logout,
        mutationKey: ['logout'],
        onSuccess: (data: { logoutSuccess: boolean }) => {
            if (data.logoutSuccess) {
                localStorage.removeItem('authToken')
            }
        }
    })
    const dispatch = useDispatch()
    const { data: oAuthData, isPending: oIsPending, error: oAuthError } = authClient.useSession()

    useEffect(() => {
        if (oAuthData) {
            dispatch(authStateAction({ userData: { name: oAuthData?.user.name, email: oAuthData?.user.email, image: oAuthData?.user.image }, isLoggedIn: true, oAuth: true, oAuthToken: oAuthData.session.token }))
        } else if (isError && error.invalidToken && !oIsPending) {
            toast.info(error.message, { position: 'top-center' })
            dispatch(authStateAction({ msg: error.message, invalidToken: error.invalidToken }))
        } else if (!isPending && !oIsPending) {
            dispatch(authStateAction(data))
        }
        if (oAuthData && data?.isLoggedIn) {
            mutate(localStorage.getItem('authToken'))
        }
    }, [oAuthData, isError, isPending, oIsPending])

    if ((isError || oAuthError) && !error?.invalidToken) {
        return (
            <Error StatusCode={error?.statusCode || oAuthError?.status} msg={error?.message || oAuthError?.message} />
        )
    }

    return (
        <>
            <Header />
            <main>
                <Outlet />
                <Toaster />
            </main>
            <Footer />
        </>
    )
}
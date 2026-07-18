import { Outlet } from "react-router";
import Header from "./header";
import Footer from "./footer"
import { getAuthState } from "@/utils/http-requests";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authStateAction } from "@/store/auth/auth-slice";
import { authClient } from "@/utils/auth-client";


export default function RootComponent() {
    const { data } = useQuery({
        queryFn: getAuthState,
        queryKey: ['get-authState']
    })
    const dispatch = useDispatch()
    const { data: oAuthData, isPending: oIsPending } = authClient.useSession()

    useEffect(() => {
        if (oAuthData) {
            dispatch(authStateAction({ userData: { name: oAuthData?.user.name, email: oAuthData?.user.email, image: oAuthData?.user.image }, isLoggedIn: true, oAuth: true, oAuthToken: oAuthData.session.token }))
        }
        if (data && data.isLoggedIn) {
            dispatch(authStateAction(data))
        }
        if (data?.isLoggedIn === false && !oAuthData && !oIsPending) {
            dispatch(authStateAction(data))
        }
    }, [oAuthData, data, oIsPending])

    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}
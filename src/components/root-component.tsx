import { Outlet } from "react-router";
import Header from "./header";
import Footer from "./footer"
import { getAuthState } from "@/utils/http-requests";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authStateAction } from "@/store/auth/auth-slice";


export default function RootComponent() {
    const { data } = useQuery({
        queryFn: getAuthState,
        queryKey: ['get-authState']
    })
    const dispatch = useDispatch()

    useEffect(() => {
        if (localStorage.getItem('authToken') && data) {
            dispatch(authStateAction(data))
        }
    }, [data])

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
import { Outlet } from "react-router";
import Navbar from "./navbar";
import { useSelector } from "react-redux"


export default function RootComponent() {
    const authState = useSelector((state: any) => state.authStateChanger)
    return (
        <>
            <Navbar />
            <p className="text-center mt-5 tracking-wide font-semibold text-xl">Logged in as-{authState.isLoggedIn ? <span className="bg-black text-white rounded-md pl-1.5 pr-1.5">{authState.email}</span> : 'Not Logged in yet!'}</p>
            <main>
                <Outlet />
            </main>
        </>
    )
}
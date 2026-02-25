import { Outlet } from "react-router";
import Header from "./header";
import Footer from "./footer";


export default function RootComponent() {
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
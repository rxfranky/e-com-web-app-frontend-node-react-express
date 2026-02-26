import { useEffect } from "react";
import Cart from '../pages/cart'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { NavLink } from "react-router";
import { useDispatch } from 'react-redux'
import { logout as logoutAction } from "../store/auth/auth-slice"
import { useSelector } from "react-redux"
import { handleShowProfile as handleShowProfileAction } from "../store/show/show-slice";



export default function Profile({ onClose }: { onClose: (action: boolean) => void }) {
    const authState = useSelector((state: any) => state.authStateChanger)
    const [showCart, setShowCart] = useState<boolean>(false)
    const dispatch = useDispatch()

    function logout() {
        localStorage.removeItem('authToken')
        localStorage.removeItem('email')
        localStorage.removeItem('name')
        dispatch(logoutAction())
        dispatch(handleShowProfileAction(false))
    }

    useEffect(() => {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        const isBodyOverflowing = document.body.scrollHeight > window.innerHeight ||
            document.body.scrollWidth > window.innerWidth;

        if (isBodyOverflowing) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
        document.body.classList.add("overflow-hidden")

        return () => {
            document.body.style.paddingRight = "";
            document.body.classList.remove("overflow-hidden")
        }
    }, [])

    function handleShowCart() {
        setShowCart(val => !val)
    }

    return (
        <>
            <AnimatePresence>
                <motion.div
                    id="cart"
                    className="w-75 text-white h-[90vh] bg-bStoreCol absolute right-0 rounded-l-xl z-20"
                    initial={{ x: 50 }}
                    animate={{ x: 0 }}
                >
                    <section id="top" className="flex justify-center mt-4">
                        <div className="w-65">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5">
                                    <svg className="cursor-pointer mt-1.5" data-bbox="0 0 50 50" data-type="shape" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 50 50"><g><path fill="white" d="M25 48.077c-5.924 0-11.31-2.252-15.396-5.921 2.254-5.362 7.492-8.267 15.373-8.267 7.889 0 13.139 3.044 15.408 8.418-4.084 3.659-9.471 5.77-15.385 5.77m.278-35.3c4.927 0 8.611 3.812 8.611 8.878 0 5.21-3.875 9.456-8.611 9.456s-8.611-4.246-8.611-9.456c0-5.066 3.684-8.878 8.611-8.878M25 0C11.193 0 0 11.193 0 25c0 .915.056 1.816.152 2.705.032.295.091.581.133.873.085.589.173 1.176.298 1.751.073.338.169.665.256.997.135.515.273 1.027.439 1.529.114.342.243.675.37 1.01.18.476.369.945.577 1.406.149.331.308.657.472.98.225.446.463.883.714 1.313.182.312.365.619.56.922.272.423.56.832.856 1.237.207.284.41.568.629.841.325.408.671.796 1.02 1.182.22.244.432.494.662.728.405.415.833.801 1.265 1.186.173.154.329.325.507.475l.004-.011A24.886 24.886 0 0 0 25 50a24.881 24.881 0 0 0 16.069-5.861.126.126 0 0 1 .003.01c.172-.144.324-.309.49-.458.442-.392.88-.787 1.293-1.209.228-.232.437-.479.655-.72.352-.389.701-.78 1.028-1.191.218-.272.421-.556.627-.838.297-.405.587-.816.859-1.24a26.104 26.104 0 0 0 1.748-3.216c.208-.461.398-.93.579-1.406.127-.336.256-.669.369-1.012.167-.502.305-1.014.44-1.53.087-.332.183-.659.256-.996.126-.576.214-1.164.299-1.754.042-.292.101-.577.133-.872.095-.89.152-1.791.152-2.707C50 11.193 38.807 0 25 0"></path></g></svg>
                                    <p className="flex flex-col">
                                        <span className="text-lg font-semibold">{authState.name}</span>
                                        <span className="text-sm text-gray-300/60">
                                            {authState.email}
                                        </span>
                                    </p>
                                </div>
                                <span onClick={() => onClose(false)} className="cursor-pointer">
                                    <svg viewBox="0 0 24 24" fill="white" width="24" height="24" className="sOnyBDt"><path fill-rule="evenodd" d="M19.2928932,3.99989322 L20,4.707 L12.7068932,11.9998932 L20,19.2928932 L19.2928932,20 L11.9998932,12.7068932 L4.707,20 L3.99989322,19.2928932 L11.2928932,11.9998932 L3.99989322,4.707 L4.707,3.99989322 L11.9998932,11.2928932 L19.2928932,3.99989322 Z"></path></svg>
                                </span>
                            </div>
                            <div id="partition" className="w-65 h-[0.5px] bg-gray-300 mt-2">
                            </div>
                        </div>
                    </section>

                    <section id="mid" className=" mt-4">
                        <motion.p
                            onClick={handleShowCart}
                            className="py-1 pl-5.5 hover:bg-gray-300/10 cursor-pointer"
                            whileTap={{ backgroundColor: '#d1d5dc30' }}
                            transition={{ duration: 0.4 }}
                        >
                            Cart
                        </motion.p>
                        <NavLink
                            to={'orders'}
                        >
                            <motion.p
                                className="py-1 pl-5.5 hover:bg-gray-300/10"
                                whileTap={{ backgroundColor: '#d1d5dc30' }}
                                transition={{ duration: 0.4 }}
                            >
                                Orders
                            </motion.p>
                        </NavLink>
                        <NavLink
                            to={'add-product'}
                        >
                            <motion.p
                                className="py-1 pl-5.5 hover:bg-gray-300/10"
                                whileTap={{ backgroundColor: '#d1d5dc30' }}
                                transition={{ duration: 0.4 }}
                            >
                                Add Product
                            </motion.p>
                        </NavLink>
                        <NavLink
                            to={'adminProducts?page=1'}
                        >
                            <motion.p

                                className="py-1 pl-5.5 hover:bg-gray-300/10"
                                whileTap={{ backgroundColor: '#d1d5dc30' }}
                                transition={{ duration: 0.4 }}
                            >
                                Admin Products
                            </motion.p>
                        </NavLink>
                        <div className="flex justify-center">
                            <div id="partition" className="w-65 h-[0.5px] bg-gray-300 mt-2">
                            </div>
                        </div>
                    </section>

                    <section id="btm" className="absolute bottom-9 w-full">
                        <div className="flex justify-center">
                            <div id="partition" className="w-65 h-[0.5px] bg-gray-300 mb-2">
                            </div>
                        </div>
                        <NavLink
                            to={'login/changePassword'}
                        >
                            <motion.p
                                className="py-1 pl-5.5 hover:bg-gray-300/10 cursor-pointer"
                                whileTap={{ backgroundColor: '#d1d5dc30' }}
                                transition={{ duration: 0.4 }}
                            >
                                Change Password</motion.p>
                        </NavLink>
                        <motion.p
                            onClick={logout}
                            className="py-1 pl-5.5 hover:bg-gray-300/10 cursor-pointer"
                            whileTap={{ backgroundColor: '#d1d5dc30' }}
                            transition={{ duration: 0.4 }}
                        >
                            Logout
                        </motion.p>
                        <div className="flex justify-center">
                            <div id="partition" className="w-65 h-[0.5px] bg-gray-300 mt-2.5">
                            </div>
                        </div>
                    </section>
                </motion.div>
            </AnimatePresence>
            {showCart && (
                createPortal(
                    <div id="overlay" className="h-screen w-screen bg-black/25 z-10 absolute top-0">
                        <Cart onClose={handleShowCart} />
                    </div>,
                    document.getElementById('modal')!
                )
            )}
        </>
    )
}
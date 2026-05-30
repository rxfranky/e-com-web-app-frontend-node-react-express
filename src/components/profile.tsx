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
import ProfileIcon from "./profile-icon";
import { authClient } from "../utils/auth-client";
import { useMutation } from '@tanstack/react-query'
import { logout as getLogout } from "../utils/http-requests";
import type { UseMutationResult } from '@tanstack/react-query'
import Error from "../pages/error";


export default function Profile({ onClose }: { onClose: (action: boolean) => void }) {
    const authState = useSelector((state: any) => state.authStateChanger.authState)
    const [showCart, setShowCart] = useState<boolean>(false)
    const dispatch = useDispatch()
    const { data } = authClient.useSession()

    const { mutate,
        isError,
        error,
        isPending
    }: UseMutationResult<any, any, any, any> = useMutation({
        mutationFn: getLogout,
        mutationKey: ['logout'],
        onSuccess: (data: { logoutSuccess?: boolean; isLoggedIn?: boolean }) => {
            if (data.logoutSuccess) {
                localStorage.removeItem('authToken')
                dispatch(logoutAction())
                dispatch(handleShowProfileAction(false))
            }
        }
    })


    async function logout() {
        if (data) {
            await authClient.signOut()
        } else {
            mutate(localStorage.getItem('authToken'))
        }
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
            if (isBodyOverflowing) {
                document.body.style.paddingRight = "";
            }
            document.body.classList.remove("overflow-hidden")
        }
    }, [])

    function handleShowCart() {
        setShowCart(val => !val)
    }

    if (isError) {
        return <Error StatusCode={error?.statusCode} msg={error?.msg} />
    }
    
    return (
        <>
            <AnimatePresence>
                <motion.div
                    id="profile"
                    className="w-75 text-white h-[90vh] bg-bStoreCol absolute right-0 rounded-l-xl z-10"
                    initial={{ x: 50 }}
                    animate={{ x: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <section id="top" className="flex justify-center mt-4">
                        <div className="w-65">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5">
                                    {data?.user.image ? (<div
                                        className='size-6.5 rounded-full cursor-pointer'
                                    >
                                        <img src={data.user.image} height={100} width={100} className='object-cover rounded-full' alt="profile pic" />
                                    </div>) : <ProfileIcon color="white" />}
                                    <div className="flex flex-col">
                                        <span className="text-lg font-semibold">
                                            {authState.userData?.name || data?.user.name || authState.msg}
                                        </span>
                                        <span className="text-sm text-gray-300/60">
                                            {authState.userData?.email || data?.user.email || authState.msg}
                                        </span>
                                    </div>
                                </div>
                                <span onClick={() => onClose(false)} className="cursor-pointer">
                                    <svg viewBox="0 0 24 24" fill="white" width="24" height="24" className="sOnyBDt"><path fillRule="evenodd" d="M19.2928932,3.99989322 L20,4.707 L12.7068932,11.9998932 L20,19.2928932 L19.2928932,20 L11.9998932,12.7068932 L4.707,20 L3.99989322,19.2928932 L11.2928932,11.9998932 L3.99989322,4.707 L4.707,3.99989322 L11.9998932,11.2928932 L19.2928932,3.99989322 Z"></path></svg>
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
                            to={'auth/changePassword'}
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
                            {isPending ? 'Logging out...' : 'Logout'}
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
                    <div id="overlay" onClick={handleShowCart} className="h-screen cursor-pointer w-screen bg-black/25 z-10 absolute top-0">
                        <Cart onClose={handleShowCart} />
                    </div>,
                    document.getElementById('modal')!
                )
            )}
        </>
    )
}
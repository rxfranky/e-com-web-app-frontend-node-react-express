import CartItem from "../components/cart-item"
import { motion, AnimatePresence } from 'motion/react'
import type { JSX } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchCart } from "../util/http-requests"
import Error from "./error"
import { useMutation } from "@tanstack/react-query"
import { checkout } from "../util/http-requests"
import { useSelector, useDispatch } from "react-redux"


type queRes = {
    data: any;
    isError: boolean;
    isPending: boolean;
    error: any
}
type mutationRes = {
    isError: boolean;
    isPending: boolean;
    error: any;
    mutate: any
}

export default function Cart({ onClose, }: { onClose: () => void }): JSX.Element {
    const isLoggedIn = useSelector((state: any) => state.authStateChanger.isLoggedIn)

    const { data, error, isError, isPending }: queRes = useQuery(
        {
            queryFn: fetchCart,
            queryKey: ['fetch-cart', isLoggedIn]
        }
    )

    const { mutate, isError: mIsError, error: mError, isPending: mIsPending }: mutationRes = useMutation(
        {
            mutationFn: checkout,
            mutationKey: ['checkout'],
            onError: (err) => {
                console.log('err in checkout mutation-', err)
            },
            onSuccess: (data) => {
                window.open(data.checkoutPage, '_blank')
            }
        }
    )

    let totalPrice = 0;
    let totalQuan = 0;
    if (data && data.cart) {
        data.cart.forEach((element: any) => {
            totalPrice = totalPrice + ((+element.price) * element.quantity)
            totalQuan += element.quantity
        });
    }

    function handleCheckout() {
        mutate({ cart: data.cart })
    }

    return (
        <>
            <AnimatePresence>
                <motion.div
                    id="cart"
                    className="w-96 h-[90vh] bg-white absolute right-0 rounded-l-xl"
                    initial={{ x: 50 }}
                    animate={{ x: 0 }}
                >
                    <div className="flex justify-center my-5">
                        <div id="top">
                            <div id="txt" className="flex justify-between items-center w-[345.5px]">
                                <div>
                                    <span className="font-semibold text-xl mr-1">Cart</span>
                                    <span>{totalQuan}</span>
                                </div>
                                <span onClick={onClose} className="cursor-pointer">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" className="sOnyBDt"><path fill-rule="evenodd" d="M19.2928932,3.99989322 L20,4.707 L12.7068932,11.9998932 L20,19.2928932 L19.2928932,20 L11.9998932,12.7068932 L4.707,20 L3.99989322,19.2928932 L11.2928932,11.9998932 L3.99989322,4.707 L4.707,3.99989322 L11.9998932,11.2928932 L19.2928932,3.99989322 Z"></path></svg>
                                </span>
                            </div>
                            <div id="partition" className="w-[345.5px] h-[0.5px] bg-black mt-4">
                            </div>
                        </div>
                    </div>

                    <section id="cartItems" className="overflow-y-scroll ml-3 h-[52vh] flex flex-col items-center gap-4">
                        {isPending && (
                            <p className="text-xl text-center mt-12 tracking-wide">Loading...</p>
                        )}
                        {(data && data.cartIsEmpty) && (
                            <p className="text-xl text-center mt-12 tracking-wide">{data.msg}</p>
                        )}
                        {(data && data.cart) && (
                            data.cart.map((cartItem: any) => (
                                <CartItem key={cartItem.id} id={cartItem.id} quantity={cartItem.quantity} imgSrc={cartItem.image_src} price={cartItem.price} title={cartItem.title} />
                            ))
                        )}
                        {(isError || mIsError) && (
                            <Error StatusCode={isError ? error.statusCode : mError.statusCode} msg={isError ? error.message : mError.message} />)
                        }
                    </section>
                    <section id="bottom" className="flex justify-center">
                        <div className="w-[345.5px]">
                            <div className="flex flex-col gap-3">
                                <div id="partition" className="h-[0.5px] bg-black mt-4">
                                </div>
                                <p className="flex justify-between">
                                    <span className="text-xl">Estimated total</span>
                                    <span className="tracking-wider text-xl">${totalPrice}</span>
                                </p>
                                <span className="text-gray-400 text-sm">Taxes and shipping are calculated at checkout.</span>
                            </div>
                            <div className="flex flex-col gap-3 mt-3">
                                <button
                                    disabled={!data || !data.cart}
                                    onClick={handleCheckout} className="disabled:bg-bStoreCol/50 bg-bStoreCol text-white py-2 w-full cursor-pointer"
                                >
                                    {mIsPending ? 'Checking out...' : 'Checkout'}
                                </button>
                                <button
                                    disabled
                                    className="disabled:bg-gray-300/30 text-bStoreCol border border-bStoreCol py-2 w-full cursor-pointer">View Cart</button>
                                <div className="flex gap-2 items-center justify-center">
                                    <span>
                                        <svg width="11" height="14" viewBox="0 0 11 14" xmlns="http://www.w3.org/2000/svg" className="QXycij" data-hook="SecureCheckoutDataHook.lock"><g fill="currentColor" fill-rule="evenodd"><path d="M0 12.79c0 .558.445 1.01.996 1.01h9.008A1 1 0 0 0 11 12.79V6.01c0-.558-.445-1.01-.996-1.01H.996A1 1 0 0 0 0 6.01v6.78Z"></path><path d="M9.5 5v-.924C9.5 2.086 7.696.5 5.5.5c-2.196 0-4 1.586-4 3.576V5h1v-.924c0-1.407 1.33-2.576 3-2.576s3 1.17 3 2.576V5h1Z" fill-rule="nonzero"></path></g></svg>
                                    </span>
                                    <span className="text-sm">Secure Checkout</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </motion.div>
            </AnimatePresence>
        </>
    )
}
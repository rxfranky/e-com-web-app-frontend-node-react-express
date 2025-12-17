import type { JSX } from "react"
import Button from "../components/button"
import captain_america from '../assets/captain-america.jpeg'
import CartItem from "../components/cart-item"
import iron_man from '../assets/iron-man.jpeg'
import { useQuery } from "@tanstack/react-query"
import { fetchCart } from "../util/http-requests"
import Error from "./error"
import { useSelector } from "react-redux"
import { useMutation } from "@tanstack/react-query"
import { checkout } from "../util/http-requests"


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

export default function Cart(): JSX.Element {
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

    if (isError || mIsError) {
        return <Error StatusCode={isError ? error.statusCode : mError.statusCode} msg={isError ? error.message : mError.message} />
    }

    let totalPrice = 0;
    if (data && data.cart) {
        data.cart.forEach((element: any) => {
            totalPrice = totalPrice + ((+element.price) * element.quantity)
        });
    }

    function handleCheckout() {
        mutate({ cart: data.cart })
    }

    return (
        <>
            <div className="parent m-auto mt-2 mb-5 w-[80vw]">
                <div className="text-6xl font-bold tracking-wide">Shopping Bag</div>
                <div className="h-0.5 bg-amber-400 mt-3 mb-9 w-[80vw]"></div>

                <div className="header w-[80vw] justify-between bg-amber-100 mb-3 flex border-2 border-amber-400 p-1 rounded-md">
                    <div className="flex gap-12 ml-11">
                        <span className="font-semibold">Image</span>
                        <span className="font-semibold">Product</span>
                    </div>
                    <span className="font-semibold inline-block mr-4">Price</span>
                </div>
                <div className="items w-[80vw]">
                    {isPending && (
                        <p className="text-4xl text-center mt-12 tracking-wide">Loading...</p>
                    )}
                    {(data && data.cartIsEmpty) && (
                        <p className="text-4xl text-center mt-12 tracking-wide">{data.msg}</p>
                    )}
                    {(data && data.cart) && (
                        data.cart.map((cartItem: any) => (
                            <CartItem key={cartItem.id} id={cartItem.id} quantity={cartItem.quantity} imgSrc={cartItem.image_src} price={cartItem.price} title={cartItem.title} />
                        ))
                    )}
                </div>
                {(data && data.cart) && (
                    <div className="checkout flex justify-end mb-7">
                        <div>
                            <span className="font-bold mr-3">{totalPrice}$</span>
                            <Button onClick={handleCheckout} className="p-1 h-fit cursor-pointer rounded-sm border-2 border-amber-400 bg-amber-100">{mIsPending ? 'checking out...' : 'Checkout'}</Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
import type { JSX } from "react"
import CartItem from "../components/cart-item"
import captain_america from '../assets/captain-america.jpeg'
import iron_man from '../assets/iron-man.jpeg'

export default function OrderDetail(): JSX.Element {
    return (
        <>
            <div className="parent m-auto mt-10 w-[80vw]">
                <div className="text-6xl font-bold tracking-wide">Order Details</div>
                <div className="h-0.5 bg-amber-400 mt-3 mb-9 w-[80vw]"></div>

                <div className="header w-[80vw] justify-between bg-amber-100 mb-3 flex border-2 border-amber-400 p-1 rounded-md">
                    <div className="flex gap-12 ml-11">
                        <span className="font-semibold">Image</span>
                        <span className="font-semibold">Product</span>
                    </div>
                    <span className="font-semibold inline-block mr-4">Price</span>
                </div>
                <div className="items w-[80vw]">
                    <CartItem isForOrderDetailPage={true} imgSrc={captain_america} price="199" title="Captain America" />
                    <CartItem isForOrderDetailPage={true} imgSrc={iron_man} price="399" title="Iron Man" />
                </div>
                <div className="checkout flex justify-end">
                    <div>
                        <span className="font-bold mr-3">1899$</span>
                    </div>
                </div>
            </div>
        </>
    )
}
import type { JSX } from "react"
import { NavLink } from "react-router"
import { motion } from 'motion/react'
import { useQuery } from "@tanstack/react-query"
import { fetchOrders } from "../util/http-requests"
import Error from "./error"
import { useSelector } from "react-redux"


interface queRes {
    data: any;
    isError: boolean;
    isPending: boolean;
    error: any
}

export default function Orders(): JSX.Element {
    const isLoggedIn = useSelector((state: any) => state.authStateChanger.isLoggedIn)

    const { data, isPending, error, isError }: queRes = useQuery(
        {
            queryFn: fetchOrders,
            queryKey: ['fetch-orders', isLoggedIn]
        }
    )
    if (isError) {
        return <Error StatusCode={error.statusCode} msg={error.message} />
    }
    return (
        <>
            <div className="parent m-auto mt-2 mb-5 w-[80vw]">
                <div className="text-6xl font-bold tracking-wide">Your Orders</div>
                <div className="h-0.5 bg-amber-400 mt-3 mb-9 w-[80vw]"></div>
                {isPending && (
                    <p className="text-4xl text-center mt-12 tracking-wide">Loading...</p>
                )}
                {(data && data.noOrders) && (
                    <p className="text-4xl text-center mt-12 tracking-wide">{data.msg}</p>
                )}
                {(data && data.orders) && (
                    data.orders.map((orderItem: any) => (
                        <div key={orderItem.order_id} className="order-item w-[80vw] justify-between mb-3 flex border-2 border-amber-400 p-1 rounded-md">
                            <div className="flex gap-3 ml-11">
                                <span className="font-semibold">Order id-</span>
                                <span className="font-semibold lg:w-[571px] md:w-[250px] w-[120px] overflow-clip">{orderItem.order_id}</span>
                            </div>
                            <NavLink to={`https://e-com-practice-backend.onrender.com/consumer/downloadInvoice/${orderItem.order_id}`}>
                                <motion.span
                                    className="font-semibold inline-block mr-3 ml-3"
                                    variants={{ ini: { scale: 1 }, ani: { scale: 1.05 } }}
                                    initial='ini'
                                    whileHover='ani'
                                    whileTap={'ini'}
                                >
                                    Download Invoice
                                </motion.span>
                            </NavLink>
                        </div>
                    ))
                )}
            </div>
        </>
    )
}
import { useState } from "react";
import { AnimatePresence, motion } from 'motion/react'
import type { JSX } from "react";
import { useMutation } from "@tanstack/react-query";
import { addToCart, checkout, deleteProduct } from "../util/http-requests";
import Error from "../pages/error";
import Modal from "../components/modal"
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";
import { useEffect } from "react";

interface Props {
    imageSrc: string;
    title: string;
    price: number;
    btnTitle_1: string;
    btnTitle_2?: string;
    id: number;
    forProductsPage?: boolean;
    initial?: { x?: number; y?: number };
    animate?: { x?: number; y?: number }
}

interface mutationRes {
    mutate: any;
    error: any;
    isError: boolean;
    isPending: boolean;
    data?: any
}

export default function Product({ forProductsPage, imageSrc, title, price, btnTitle_1, btnTitle_2, id, initial = { y: -30 }, animate = { y: 0 } }: Props): JSX.Element {
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const [showbtn, setShowBtn] = useState(false)

    const { mutate, data, error, isError, isPending }: mutationRes = useMutation(
        {
            mutationFn: addToCart,
            mutationKey: ['addToCart'],
            onSuccess: (data) => {
                if (data.addedToCart || data.quantityInc) {
                    setShowDialog(true)
                    setTimeout(() => {
                        setShowDialog(false)
                    }, 3000);
                }
            }
        }
    )
    const { mutate: bMutate, error: bError, isError: bIsError, isPending: bIsPending }: mutationRes = useMutation(
        {
            mutationFn: checkout,
            mutationKey: ['buy-now'],
            onSuccess: (data) => {
                window.open(data.checkoutPage, '_blank')
            }
        }
    )

    const { mutate: dMutate, data: dData, isError: dIsError, error: dError, isPending: dIspending }: mutationRes = useMutation(
        {
            mutationFn: deleteProduct,
            mutationKey: ['delete'],
            onSuccess: (data) => {
                if (data.productDeleted) {
                    setTimeout(() => {
                        navigate('/products?page=1', { viewTransition: true })
                    }, 3000);
                    setShowDialog(true)
                }
            }
        }
    )

    useEffect(() => {
        if (pathname === '/products') {
            setShowDialog(false)
        }
    }, [pathname])

    if (isError || bIsError || dIsError) {
        return <Error StatusCode={isError ? error.statusCode : dIsError ? dError.statusCode : bError.statusCode} msg={isError ? error.message : dIsError ? dError.message : bError.message} />
    }

    function handleAddToCart() {
        mutate(id)
    }

    function handleBuy() {
        bMutate({ product: { id, price } })
    }

    function handleEdit() {
        navigate(`/add-product?product_id=${id}&title=${title}&price=${price}`)
    }

    function handleDelete() {
        dMutate(id)
    }

    function handleShowDatailBtn() {
        setShowBtn((val) => !val)
    }

    return (
        <>
            <AnimatePresence>
                <motion.div
                    id="product"
                    onMouseEnter={handleShowDatailBtn}
                    onMouseLeave={handleShowDatailBtn}
                    className={`w-42 h-73 ${forProductsPage && "w-65 h-94"} max-sm:w-69 max-sm:h-110`}
                    initial={{ ...initial, opacity: 0 }}
                    animate={{ ...animate, opacity: 1 }}
                    exit={{ ...initial, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={`h-44 ${forProductsPage && "h-65"} bg-gray-100 flex items-center justify-center relative max-sm:h-71`}>
                        <motion.img
                            src={imageSrc}
                            alt={`image of ${title}`}
                            className={`h-36 object-cover w-28 ${forProductsPage && "h-55 w-45"} max-sm:w-55 max-sm:h-63`}
                        />

                        <AnimatePresence>
                            {showbtn && <motion.span
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                className="absolute w-full py-3 text-center bottom-0 bg-white/80 text-black"
                            >Quick View</motion.span>}
                        </AnimatePresence>
                    </div>

                    <div className="flex flex-col items-center max-sm:gap-2 my-3 max-sm:my-5 max-sm:text-xl text-white">
                        <span className={`${forProductsPage && "text-[#414141]"} text-center w-[120px] overflow-hidden text-nowrap`}>{title}</span>
                        <span className={`${forProductsPage && "text-[#999997]"} text-center w-20 overflow-clip text-nowrap`}>${price}</span>
                    </div>
                    <AnimatePresence>
                        {(showbtn || window.outerWidth <= 640) && <motion.div
                            className="flex justify-between"
                            exit={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            initial={{ opacity: 0 }}
                        >
                            <button
                                className={`bg-bStoreCol py-2 max-sm:py-4 ${!forProductsPage ? "border-2 border-white w-full" : "w-[102px]"} text-white cursor-pointer`}
                                onClick={btnTitle_1?.trim().toLowerCase() === 'edit' ? handleEdit : handleAddToCart}
                            >
                                {isPending ? 'Adding...' : btnTitle_1}
                            </button>
                            {forProductsPage &&
                                <button
                                    className={`bg-bStoreCol cursor-pointer w-[102px] py-2 max-sm:py-4 ${!forProductsPage && "border-2 border-white"} text-white`}
                                    onClick={btnTitle_2?.trim().toLowerCase() === 'delete' ? handleDelete : handleBuy}
                                >
                                    {bIsPending ? 'Checking...' : dIspending ? 'Deleting...' : btnTitle_2}
                                </button>
                            }
                        </motion.div>
                        }
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
            {showDialog && (
                createPortal(
                    <Modal showDialog={showDialog}>{data ? data.msg : dData.msg}</Modal>,
                    document.getElementById('modal')!
                )
            )}
        </>
    )
}
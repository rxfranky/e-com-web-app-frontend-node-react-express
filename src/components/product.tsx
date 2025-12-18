import type { JSX } from "react";
import Button from "./button";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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
    btnTitle_2: string;
    id?: number,
}

interface mutationRes {
    mutate: any;
    error: any;
    isError: boolean;
    isPending: boolean;
    data?: any
}

export default function Product({ imageSrc, title, price, btnTitle_1, btnTitle_2, id }: Props): JSX.Element {
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [showPrice, setShowPrice] = useState<boolean>(false)
    const [isWishlisted, setIsWishlisted] = useState<boolean>(false)
    const { pathname } = useLocation()

    const navigate = useNavigate()

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

    let heartSvgContent = (
        <svg className={`cursor-pointer absolute right-0 ${showPrice ? 'top-0' : ''}`} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="25px" height="25px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" id="Stock_cut" version="1.1" xmlSpace="preserve"><desc /><path d="M28.343,17.48L16,29  L3.657,17.48C1.962,15.898,1,13.684,1,11.365v0C1,6.745,4.745,3,9.365,3h0.17c2.219,0,4.346,0.881,5.915,2.45L16,6l0.55-0.55  C18.119,3.881,20.246,3,22.465,3h0.17C27.255,3,31,6.745,31,11.365v0C31,13.684,30.038,15.898,28.343,17.48z" fill="none" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" /></svg>
    )
    if (isWishlisted) {
        heartSvgContent = (
            <svg className={`cursor-pointer absolute right-0 ${showPrice ? 'top-0' : ''}`} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000" version="1.1" id="Capa_1" width="25px" height="25px" viewBox="0 0 544.582 544.582" xmlSpace="preserve">
                <g>
                    <path d="M448.069,57.839c-72.675-23.562-150.781,15.759-175.721,87.898C247.41,73.522,169.303,34.277,96.628,57.839   C23.111,81.784-16.975,160.885,6.894,234.708c22.95,70.38,235.773,258.876,263.006,258.876   c27.234,0,244.801-188.267,267.751-258.876C561.595,160.732,521.509,81.631,448.069,57.839z" />
                </g>
            </svg>
        )
    }
    function toggleContentOfHeartSvg() {
        setIsWishlisted((val) => !val)
    }

    let transitionVal = {};
    let yVal = -50
    let opacityVal = 0
    if (title.toLowerCase().trim().includes('iron man') || title.toLowerCase().trim().includes('captain america')) {
        transitionVal = { stiffness: 0, duration: 2 }
        opacityVal = 1
        yVal = -160
    }

    return (
        <>
            <div className="product  border-2 border-amber-400 w-[250px] h-[400px] rounded-md flex flex-col justify-center items-center gap-3">

                <div
                    onMouseLeave={() => setShowPrice(false)}
                    onMouseEnter={() => setShowPrice(true)}
                    className={`image  w-[200px] h-[260px] ${showPrice ? 'flex items-center justify-center' : ''} relative`}
                >
                    <span onClick={toggleContentOfHeartSvg} className="heart-svg">
                        {heartSvgContent}
                    </span>
                    <AnimatePresence>
                        {
                            showPrice ? (
                                <motion.span
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 50 }}
                                    className="font-semibold text-xl tracking-wide"
                                >
                                    {price}$
                                </motion.span>
                            ) : (
                                <motion.img
                                    initial={{ opacity: opacityVal, y: yVal }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={transitionVal}
                                    exit={{ opacity: opacityVal, y: yVal }}
                                    className="object-cover w-full h-full"
                                    src={imageSrc}
                                    alt={`image of ${title}`}
                                />
                            )
                        }
                    </AnimatePresence>
                </div>

                <span className="title w-[200px] text-center overflow-clip text-nowrap  font-semibold">{title}</span>

                <div className="action  flex gap-7">
                    <Button onClick={btnTitle_1.trim().toLowerCase() === 'edit' ? handleEdit : handleAddToCart} className="p-1 h-fit cursor-pointer rounded-sm border-2 border-amber-400 bg-amber-100">{isPending ? 'adding...' : btnTitle_1}</Button>
                    <Button onClick={btnTitle_2.trim().toLowerCase() === 'delete' ? handleDelete : handleBuy} className="p-1 h-fit cursor-pointer rounded-sm border-2 border-amber-400 bg-amber-100">{bIsPending ? 'checking...' : dIspending ? 'deleting...' : btnTitle_2}</Button>
                </div>
            </div>
            {showDialog && (
                createPortal(
                    <Modal showDialog={showDialog}>{data ? data.msg : dData.msg}</Modal>,
                    document.getElementById('modal')!
                )
            )}
        </>
    )
}
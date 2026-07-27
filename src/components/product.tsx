import { useState, useEffect } from "react";
import { AnimatePresence, motion } from 'motion/react'
import type { JSX } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addToCart, checkout, deleteProduct, addToWishlist, isInWishlist } from "../utils/http-requests";
import Error from "../pages/error";
import Modal from "../components/modal";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router";
import { Spinner } from '@/components/ui/spinner';
import redHeartIcon from '@/assets/icons8-heart-pink.png'
import grayHeartIcon from '@/assets/icons8-heart-gray.png'
import { useSelector } from "react-redux";


interface Props {
    imageSrc: string;
    title: string;
    desc: string;
    price: number;
    btnTitle_1: string;
    btnTitle_2?: string;
    id: number;
    forProductsPage?: boolean;
}

type queryRes = {
    data: { inWishlist?: boolean; msg?: string } | undefined;
    isError: boolean;
    error: any
}

interface mutationRes {
    mutate: any;
    error: any;
    isError: boolean;
    isPending: boolean;
    data?: any
}

export default function Product({ forProductsPage, imageSrc, title, desc, price, btnTitle_1, btnTitle_2, id }: Props): JSX.Element {
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const [showbtn, setShowBtn] = useState(false)

    const authState = useSelector((state: any) => state.authStateChanger.authState)

    const { data: wData, isError: wgIsError, error: wgError }: queryRes = useQuery({
        queryFn: () => isInWishlist(id, authState.isLoggedIn, authState.oAuthToken),
        queryKey: ['get-wishlist', id]
    })
    const [inWishlistState, setInWishlistState] = useState<boolean | undefined>(wData?.inWishlist)

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

    const { mutate: wMutate, isError: wIsError, error: wError }: mutationRes = useMutation({
        mutationFn: addToWishlist,
        mutationKey: ['wishlist'],
        onSuccess: (data: { removed?: boolean, added?: boolean }) => {
            if (data?.added) {
                setInWishlistState(true)
            }
            if (data?.removed) {
                setInWishlistState(false)
            }
        }
    })

    useEffect(() => {
        if (pathname === '/products') {
            setShowDialog(false)
        }
        if (wData?.inWishlist) {
            setInWishlistState(true)
        }
    }, [pathname, wData])

    if (isError || bIsError || dIsError || wIsError || wgIsError) {
        return (
            <Error
                StatusCode={
                    isError ? error.statusCode :
                        dIsError ? dError.statusCode :
                            wIsError ? wError.statusCode :
                                wgIsError ? wgError.statusCode :
                                    bError.statusCode
                }
                msg={
                    isError ? error.message :
                        dIsError ? dError.message :
                            wIsError ? wError.message :
                                wgIsError ? wgError.message :
                                    bError.message
                }
            />
        )
    }

    function handleAddtoWishlist(action: string) {
        wMutate({ id, action, oAuthToken: authState.oAuthToken })
    }

    function handleAddToCart() {
        mutate({ id, oAuthToken: authState.oAuthToken })
    }

    function handleBuy() {
        bMutate({ product: { id, price }, oAuthToken: authState.oAuthToken })
    }

    function handleEdit() {
        navigate(`/add-product?product_id=${id}&title=${title}&price=${price}&desc=${desc}`)
    }

    function handleDelete() {
        dMutate({ id, oAuthToken: authState.oAuthToken })
    }

    function handleShowDatailBtn() {
        setShowBtn((val) => !val)
    }

    return (
        <>
            <motion.div
                id="product"
                onMouseEnter={handleShowDatailBtn}
                onMouseLeave={handleShowDatailBtn}
                className={`w-42 h-73 ${forProductsPage && "w-65 h-94"} max-sm:w-69 max-sm:h-112`}
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className={`h-44 ${forProductsPage && "h-65"} bg-gray-100 flex items-center justify-center relative max-sm:h-71`}>
                    <img
                        src={imageSrc}
                        alt={`image of ${title}`}
                        className={`h-36 object-cover w-28 ${forProductsPage && "h-55 w-45"} max-sm:w-55 max-sm:h-63`}
                    />

                    <div onClick={() => handleAddtoWishlist(inWishlistState ? 'remove' : 'add')} className={`p-px rounded-sm bg-white cursor-pointer absolute ${forProductsPage ? 'h-6 w-6 top-2 right-2' : 'h-5 w-5 top-1 right-1'}`}>
                        <img className="" src={inWishlistState ? redHeartIcon : grayHeartIcon} alt="heart icon" />
                    </div>

                    <AnimatePresence>
                        {showbtn && <motion.span
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="absolute w-full py-3 text-center bottom-0 bg-white/80 text-black cursor-pointer"
                            onClick={() => navigate('/products/productDetail/' + id + `?title=${title}&imageSrc=${imageSrc}&price=${price}&desc=${desc}`)}
                        >
                            Quick View
                        </motion.span>}
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
                            className={`bg-bStoreCol py-2 max-sm:py-4 ${!forProductsPage ? "border-2 border-white w-full gap-2" : "w-[102px] gap-1.5"} text-white cursor-pointer flex items-center justify-center `}
                            onClick={btnTitle_1?.trim().toLowerCase() === 'edit' ? handleEdit : handleAddToCart}
                        >
                            {isPending ? (<>
                                <Spinner data-icon='inline-start' className={`${forProductsPage ? 'size-5' : 'size-5'}`} />
                                Adding...
                            </>) : btnTitle_1}
                        </button>
                        {forProductsPage &&
                            <button
                                className={`bg-bStoreCol cursor-pointer w-[102px] py-2 max-sm:py-4 ${!forProductsPage && "border-2 border-white"} gap-1.5 text-white flex items-center justify-center`}
                                onClick={btnTitle_2?.trim().toLowerCase() === 'delete' ? handleDelete : handleBuy}
                            >
                                {bIsPending ? (<>
                                    <Spinner data-icon='inline-start' className="size-5" />
                                    Checking...
                                </>) : dIspending ? (<>
                                    <Spinner data-icon='inline-start' className="size-5" />
                                    Deleting...
                                </>) : btnTitle_2}
                            </button>
                        }
                    </motion.div>
                    }
                </AnimatePresence>
            </motion.div>
            {showDialog && (
                createPortal(
                    <Modal showDialog={showDialog}>{data ? data.msg : dData.msg}</Modal>,
                    document.getElementById('modal')!
                )
            )}
        </>
    )
}
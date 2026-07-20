import { useParams, useSearchParams } from 'react-router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { checkout } from "../utils/http-requests"
import { useMutation } from "@tanstack/react-query"
import Error from './error'
import { Spinner } from '@/components/ui/spinner'
import { addToCart } from '../utils/http-requests'
import { createPortal } from "react-dom";
import Modal from '@/components/modal'
import { useSelector } from 'react-redux'


type mutationRes = {
    isError: boolean;
    isPending: boolean;
    error: any;
    mutate: any;
    data?: any
}


export default function ProductDetail() {
    const { productId } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const [quantity, setQuantity] = useState<number>(1)
    const [showProductInfo, setShowProductInfo] = useState<boolean>(false)
    const [showRRP, setShowRRP] = useState<boolean>(false)
    const [showShippingInfo, setShowShippingInfo] = useState<boolean>(false)
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const oAuthToken = useSelector((state: any) => state.authStateChanger.authState.oAuthToken)

    const { mutate: mMutate, isError: mIsError, error: mError, isPending: mIsPending }: mutationRes = useMutation(
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

    function handleBuy() {
        mMutate({ data: { productId, quantity, price: searchParams.get('price') }, oAuthToken })
    }

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

    function handleAddToCart() {
        mutate({ id: productId, quantity, oAuthToken })
    }

    function handleShow(action: string) {
        if (action === 'RRP') {
            if (showProductInfo) {
                setShowProductInfo(false)
            }
            if (showShippingInfo) {
                setShowShippingInfo(false)
            }
            setShowRRP(val => !val)
        }
        if (action === 'productInfo') {
            if (showRRP) {
                setShowRRP(false)
            }
            if (showShippingInfo) {
                setShowShippingInfo(false)
            }
            setShowProductInfo(val => !val)
        }
        if (action === 'shippingInfo') {
            if (showProductInfo) {
                setShowProductInfo(false)
            }
            if (showRRP) {
                setShowRRP(false)
            }
            setShowShippingInfo(val => !val)
        }
    }

    if (mIsError || isError) {
        return <Error StatusCode={mError?.statusCode || error.statusCode} msg={mError?.message || error.message} />
    }

    return (
        <>
            <div className='min-h-screen w-screen flex justify-center items-center' id="parent">
                <main className='h-[75vh] max-sm:h-fit w-[78vw] max-sm:w-fit flex gap-9 max-sm:flex-col'>
                    <div id="left">
                        <div id="image" className='w-[499px] max-sm:w-[335px] h-[499px] max-sm:h-[335px] bg-gray-100/70 flex justify-center items-center'>
                            <div className='h-105 max-sm:h-70 w-75 max-sm:w-[220px]'>
                                <img src={searchParams.get('imageSrc')!} alt="" className='object-cover h-full w-full' />
                            </div>
                        </div>
                        {window.outerWidth > 640 && (
                            <p className='w-[499px] max-sm:w-[335px] max-h-24 max-sm:max-h-[190px] mt-5 overflow-clip font-light' id='desc'>{searchParams.get('desc')}</p>
                        )}
                    </div>
                    <div id="right">
                        <div className='flex flex-col gap-5'>
                            <span className='text-3xl w-[354px] max-sm:w-[335px] h-9 overflow-clip tracking-wide font-light'>{searchParams.get('title')}</span>
                            <span className='font-light'>${searchParams.get('price')}.00</span>
                            <div>
                                <span className='font-light'>Quantity</span>
                                <div className='border border-gray-400 flex gap-1.5 p-0.75 mt-1 w-fit'>
                                    <span onClick={() => { (quantity > 1 && setQuantity(val => val - 1)) }} className="cursor-pointer">
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" className="sZxd73l"><path fillRule="evenodd" d="M20,12 L20,13 L5,13 L5,12 L20,12 Z"></path></svg>
                                    </span>
                                    <span className='font-light'>{quantity}</span>
                                    <span onClick={() => setQuantity(val => val + 1)} className="cursor-pointer">
                                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" className="sZxd73l"><path fillRule="evenodd" d="M13,5 L13,12 L20,12 L20,13 L13,13 L13,20 L12,20 L11.999,13 L5,13 L5,12 L12,12 L12,5 L13,5 Z"></path></svg>
                                    </span>
                                </div>
                            </div>
                            <div className='mt-3 flex'>
                                <button onClick={handleAddToCart} className='w-[165px] max-sm:w-[155px] flex items-center justify-center gap-1.5 mr-6 py-2 px-4 bg-bStoreCol text-white cursor-pointer'>
                                    {isPending ? (<>
                                        <Spinner data-icon='inline-start' className="size-5" />
                                        Adding...
                                    </>) : 'Add to Cart'}
                                </button>

                                <button onClick={handleBuy} className='w-[165px] max-sm:w-[155px] flex justify-center items-center gap-1.5 py-2 px-4 bg-bStoreCol text-white cursor-pointer'>
                                    {mIsPending ? (<>
                                        <Spinner data-icon='inline-start' className="size-5" />
                                        Checking...
                                    </>) : 'Buy Now'}
                                </button>
                            </div>
                            {window.outerWidth <= 640 && (
                                <p className='w-[499px] max-sm:w-[335px] max-h-24 max-sm:max-h-[190px] mt-5 overflow-clip font-light' id='desc'>{searchParams.get('desc')}</p>
                            )}
                        </div>
                        <div className='mt-9 w-[354px] max-sm:w-[335px] flex flex-col gap-3'>
                            <div>
                                <div onClick={() => handleShow('productInfo')} className='flex justify-between items-center cursor-pointer'>
                                    <span className='font-light'>PRODUCT INFO</span>
                                    <motion.span animate={{ rotate: showProductInfo ? 45 : 0 }} className='text-2xl font-extralight'>+</motion.span>
                                </div>
                                <AnimatePresence>
                                    {showProductInfo && (
                                        <motion.p
                                            initial={{ opacity: 0, maxHeight: 0 }}
                                            animate={{ opacity: 1, maxHeight: 144 }}
                                            exit={{ opacity: 0, maxHeight: 0 }}
                                            className='font-light overflow-clip'
                                        >
                                            {searchParams.get('desc')}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                            <p id='partition' className='bg-gray-400 h-[0.5px]'></p>
                            <div>
                                <div onClick={() => handleShow('RRP')} className='flex justify-between items-center cursor-pointer'>
                                    <span className='font-light'>RETURN & REFUND POLICY</span>
                                    <motion.span animate={{ rotate: showRRP ? 45 : 0 }} className='text-2xl font-extralight'>+</motion.span>
                                </div>
                                <AnimatePresence>
                                    {showRRP && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 144 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className='font-light overflow-clip'
                                        >
                                            I’m a Return and Refund policy. I’m a great place to let your customers know what to do in case they are dissatisfied with their purchase. Having a straightforward refund or exchange policy is a great way to build trust and reassure your customers that they can buy with confidence.
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                            <p id='partition' className='bg-gray-400 h-[0.5px]'></p>
                            <div>
                                <div onClick={() => handleShow('shippingInfo')} className='flex justify-between items-center cursor-pointer'>
                                    <span className='font-light'>SHIPPING INFO</span>
                                    <motion.span animate={{ rotate: showShippingInfo ? 45 : 0 }} className='text-2xl font-extralight'>+</motion.span>
                                </div>
                                <AnimatePresence>
                                    {showShippingInfo && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 144 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className='font-light overflow-clip'
                                        >
                                            I'm a shipping policy. I'm a great place to add more information about your shipping methods, packaging and cost. Providing straightforward information about your shipping policy is a great way to build trust and reassure your customers that they can buy from you with confidence.
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {showDialog && (
                createPortal(
                    <Modal showDialog={showDialog}>{data?.msg}</Modal>,
                    document.getElementById('modal')!
                )
            )}
        </>
    )
}
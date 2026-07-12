import { createPortal } from 'react-dom'
import Profile from './profile'
import Hamberger from './hamburger'
import { motion } from 'motion/react'
import { NavLink, useLocation } from "react-router"
import { useSelector, useDispatch } from "react-redux"
import { handleShowHamberger as handleShowHambergerAction } from '../store/show/show-slice'
import { handleShowProfile as handleShowProfileAction } from '../store/show/show-slice'
import ProfileIcon from './profile-icon'
import { authClient } from '../utils/auth-client'
import { SearchIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'motion/react'
import { useMutation } from '@tanstack/react-query'
import { getSearchedProduct } from '@/utils/http-requests'
import { useActionState } from 'react'
import { Toaster } from './ui/sonner'
import { toast } from 'sonner'
import { Spinner } from './ui/spinner'
import Error from '@/pages/error'
import SearchItem from './search-item'


type mutationRes = {
    mutate: any;
    isPending: boolean;
    isError: boolean;
    error: any;
    data: any
}


export default function Header() {
    const isLoggedIn = useSelector((state: any) => state.authStateChanger.authState.isLoggedIn)
    const isAuthLoading = useSelector((state: any) => state.authStateChanger.authState.isLoading)
    const show = useSelector((state: any) => state.showStateChanger)
    const dispatch = useDispatch()
    const { data } = authClient.useSession()
    const [showSearchInp, setShowSearchInp] = useState<boolean>(false)
    const [formState, formAction, isFormSubmitting] = useActionState(handleFormSubmit, null)
    const [showSearchContent, setShowSearchedContent] = useState<boolean>(false)
    const { pathname } = useLocation()

    const { mutate, isPending, isError, error, data: searchedData }: mutationRes = useMutation({
        mutationFn: getSearchedProduct,
        mutationKey: ['fetch-product'],
        onSuccess: (data: {
            getProducts?: boolean;
            products?: any[];
            msg: string;
            invalidInputs?: boolean;
            valiErrors: any[]
        }) => {
            if (data.invalidInputs || !data.getProducts) {
                toast.info((data.invalidInputs && data.valiErrors[0].msg) || data.msg, { position: 'top-center' })
            }
            if (data.getProducts) {
                setShowSearchedContent(true)
            }
        }
    })

    useEffect(() => {
        if (showSearchContent) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            const isBodyOverflowing = document.body.scrollHeight > window.innerHeight ||
                document.body.scrollWidth > window.innerWidth;

            if (isBodyOverflowing) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
                document.body.classList.add("overflow-hidden")
            }
        } else {
            document.body.style.paddingRight = "";
            document.body.classList.remove("overflow-hidden")
        }
        if (pathname.includes('/products/productDetail')) {
            setShowSearchedContent(false)
            setShowSearchInp(false)
        }

    }, [showSearchContent, pathname])

    let searchContent;
    if (searchedData?.getProducts && showSearchContent) {
        searchContent = (<div
            id="products"
            onClick={(e) => e.stopPropagation()}
            className='bg-white shadow-2xl absolute left-[47.35vw] max-sm:left-[5vw] top-20 w-[15.5vw] max-sm:w-[60vw] rounded-sm'
        >
            <div className='p-4 flex flex-col gap-2'>
                {searchedData.products?.map((product: {
                    id: number;
                    image_src: string; price: number;
                    title: string;
                    description: string
                }) => (<SearchItem
                    key={product.id}
                    id={product.id}
                    imageSrc={product.image_src}
                    price={product.price}
                    title={product.title}
                    desc={product.description}
                />))}
            </div>
        </div>)
    }

    function handleFormSubmit(initialState: any, formData: FormData) {
        const formDataInObj = Object.fromEntries(formData)
        mutate(formDataInObj)
    }

    function handleShowSearchInp() {
        setShowSearchInp(val => !val)
    }

    function handleShowHamberger(action: boolean) {
        dispatch(handleShowHambergerAction(action))
    }

    function handleShowProfile(action: boolean) {
        dispatch(handleShowProfileAction(action))
    }

    if (isError) {
        return <Error StatusCode={error.statusCode} msg={error.message} />
    }

    return (
        <>
            <header className="h-[109.542px] flex items-center justify-center relative">
                <nav className="flex justify-between w-[90vw] items-center relative">
                    <NavLink to={'/'}>
                        <div className='cursor-pointer'>
                            <span className="bg-bStoreCol text-white text-xl font-bold px-2 tracking-widest py-1">BINK.</span>
                            <motion.span
                                className="text-bStoreCol text-xl px-5 font-light py-0.5 border-2 border-bStoreCol tracking-widest"
                                whileHover={{
                                    backgroundColor: "rgb(14, 52, 90)",
                                    color: "white"
                                }}
                                transition={{ duration: 0.4 }}
                            >PUBLISHERS</motion.span>
                        </div>
                    </NavLink>
                    {window.outerWidth >= 640 ? (
                        <ul className="flex gap-5 items-center max-md:gap-2">
                            <li>
                                <form action={formAction} className='relative'>
                                    <input type="text" name="search" className='w-56 py-1 rounded-sm bg-black/5 pl-3 pr-7 outline-none' placeholder='search product' />
                                    <button className='absolute right-2 top-2'>
                                        {isPending ? (<Spinner className='size-4 text-bStoreCol' />) : (
                                            <SearchIcon className='text-bStoreCol size-4.5 cursor-pointer' />
                                        )}
                                    </button>
                                </form>
                            </li>

                            <NavLink to={'products?page=1'} className={({ isActive }) => isActive ? 'underline decoration-bStoreCol' : ''}><motion.li className="text-bStoreCol text-lg" whileTap={{ scale: 1 }} whileHover={{ scale: 1.05 }}>Products</motion.li></NavLink>

                            <li className="text-bStoreCol text-lg">Events</li>
                            <li className="text-bStoreCol text-lg">About</li>
                            <li className="text-bStoreCol text-lg">Contact</li>
                            <div className="flex items-center">
                                <li className='text-bStoreCol w-[111.26px] flex justify-center'>
                                    {(isLoggedIn || data) ? (
                                        data?.user.image ? (<div
                                            className='size-6.5 rounded-full cursor-pointer'
                                            onClick={() => handleShowProfile(true)}
                                        >
                                            <img src={data.user.image} height={100} width={100} className='object-cover rounded-full' alt="profile pic" />
                                        </div>) : <ProfileIcon handleShowProfile={handleShowProfile} color='rgb(14, 52, 90)' />
                                    ) : isAuthLoading ? 'Loading...' : (
                                        <NavLink
                                            to={'auth'}
                                            className={({ isActive }) => isActive ? 'underline' : ''}
                                        >
                                            <motion.span
                                                className="text-bStoreCol text-nowrap"
                                                whileTap={{ scale: 1 }}
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                Signup or Login
                                            </motion.span>
                                        </NavLink>
                                    )}
                                </li>
                            </div>
                        </ul>)
                        : (<>
                            <div className='flex items-center gap-3'>
                                <SearchIcon onClick={handleShowSearchInp} className='text-bStoreCol size-8 cursor-pointer' />
                                <AnimatePresence>
                                    {showSearchInp && (
                                        <motion.form
                                            action={formAction}
                                            className='absolute -left-1'
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <input
                                                type="text"
                                                name="search"
                                                className='w-72 py-1.5 rounded-sm px-3 outline-none bg-gray-100'
                                                placeholder='search product'
                                            />
                                            <button className='absolute right-2 top-2'>
                                                {isPending ? (<Spinner className='size-4.5 text-bStoreCol' />) : (
                                                    <SearchIcon className='text-bStoreCol size-5 cursor-pointer' />
                                                )}
                                            </button>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                                <div onClick={() => handleShowHamberger(true)} id='hamburger' className='w-7.5 h-6.5 flex flex-col justify-between cursor-pointer'>
                                    <p className='h-0.5 bg-bStoreCol'></p>
                                    <p className='h-0.5 bg-bStoreCol'></p>
                                    <p className='h-0.5 bg-bStoreCol'></p>
                                </div>
                            </div>
                            {show.showHamberger && (
                                createPortal(
                                    <Hamberger
                                        isLoggedIn={isLoggedIn}
                                        onClose={handleShowHamberger}
                                        handleShowProfile={handleShowProfile}
                                        oAuthData={data}
                                    />,
                                    document.getElementById('modal')!
                                )
                            )}
                        </>)
                    }
                </nav>
            </header>
            {(show.showProfile && (isLoggedIn || data)) && (
                createPortal(
                    <div id="overlay" onClick={() => handleShowProfile(false)} className="h-screen w-screen bg-black/25 max-sm:absolute cursor-pointer max-sm:top-0">
                        <Profile onClose={handleShowProfile} />
                    </div>,
                    document.getElementById('modal')!
                )
            )}
            {(searchedData?.getProducts && showSearchContent) && (
                createPortal((<div id="overlay" onClick={() => setShowSearchedContent(val => !val)} className='h-screen relative w-screen cursor-pointer'>
                    {searchContent}
                </div>), document.getElementById('modal')!)
            )}
            <Toaster />
        </>
    )
}
import discordLogo from '../assets/icons8-discord.svg'
import googleLogo from '../assets/icons8-google-logo.svg'
import githubLogo from '../assets/icons8-github-logo.svg'
import nameIcon from '../assets/icons8-name-48.png'
import emailIcon from '../assets/icons8-email-48.png'
import passwordIcon from '../assets/icons8-password-48.png'
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMutation } from "@tanstack/react-query"
import { signup } from "../utils/http-requests"
import type { JSX } from "react"
import { type UseMutationResult } from '@tanstack/react-query'
import { NavLink } from "react-router"
import { login } from "../utils/http-requests"
import { useNavigate, useLocation } from "react-router"
import Error from "./error"
import Modal from "../components/modal"
import { useActionState } from "react"
import { createPortal } from "react-dom"
import { login as loginAction } from "../store/auth/auth-slice"
import { useSelector, useDispatch } from 'react-redux'
import { handleShowHamberger as handleShowHambergerAction } from '../store/show/show-slice'
import { authClient } from '../utils/auth-client'


export default function Auth(): JSX.Element {
    const [isSignupMode, setIsSignupMode] = useState<boolean>(true)
    const navigate = useNavigate()
    const [showDialogState, setShowDialogState] = useState(false)
    const [formState, formAction, isFormSubmitting] = useActionState(handleFormSubmit, null)
    const { pathname } = useLocation()
    const show = useSelector((state: any) => state.showStateChanger)
    const dispatch = useDispatch()

    const { mutate: lMutate,
        isError: lIsError,
        error: lError,
        isPending: lIsPending,
        data: lData
    }: UseMutationResult<any, any> = useMutation({
        mutationFn: login,
        mutationKey: ['login'],
        onSuccess: (data) => {
            if (data.authToken) {
                setTimeout(() => {
                    navigate('/', { viewTransition: true })
                }, 3000);
                setShowDialogState(true)
            }
        }
    }
    )

    const { mutate,
        isError,
        error,
        data,
        isPending
    }: UseMutationResult<any, any> = useMutation({
        mutationFn: signup,
        mutationKey: ['signup'],
        onSuccess: (data) => {
            if (data.signedUp) {
                setShowDialogState(true)
                setTimeout(() => {
                    setShowDialogState(false)
                }, 3000);
            }
        }
    })

    useEffect(() => {
        if (pathname === '/') {
            setShowDialogState(false)
        }
        if (lData && lData.authToken) {
            localStorage.setItem('authToken', lData.authToken)
            dispatch(loginAction(lData))
        }
        if (show.showHamberger) {
            dispatch(handleShowHambergerAction(false))
        }
    }, [pathname, lData])

    function handleFormSubmit(prevState: any, formData: any) {
        const formDataObj = Object.fromEntries(formData)
        isSignupMode ? mutate(formDataObj) : lMutate(formDataObj)
    }

    if (isError || lIsError) {
        return (
            <>
                <Error StatusCode={error?.statusCode ?? lError?.statusCode ?? 504} msg={error?.message ?? lError?.message ?? 'something went worg with server!'} />
            </>
        )
    }

    async function signIn(provider: string) {
        const res = await authClient.signIn.social({
            provider: provider === 'google' ? 'google' : provider === 'discord' ? 'discord' : "github",
            callbackURL: 'https://e-com-web-app-frontend-node-react-e.vercel.app'
        })

        if (res.error) {
            return <Error StatusCode={res.error.status} msg={res.error.message} />
        }
    }

    return (
        <>
            <div className="min-h-screen min-w-screen">
                <motion.div
                    id="parent"
                    className="w-[65vw] max-sm:w-[72vw] h-[70vh] flex m-auto mt-9 shadow-2xl rounded-xl max-sm:flex-col max-sm:items-center"
                >
                    <motion.div
                        id="LEFT or TOP"
                        className={`bg-bStoreCol text-white w-[35%] h-full max-sm:w-full max-sm:h-[41%] flex flex-col items-center justify-center gap-7 max-sm:gap-3 ${isSignupMode ? "lg:rounded-l-xl max-sm:rounded-t-xl order-1" : "lg:rounded-r-xl max-sm:rounded-b-xl 2 order-2"}`}
                        layout
                        transition={{ ease: 'easeInOut', duration: 0.6 }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={isSignupMode ? "welcome" : "hello"}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="text-4xl max-sm:text-3xl tracking-wide font-bold"
                            >
                                {!isSignupMode ? "Hello, Friend!" : "Welcome Back!"}
                            </motion.h1>
                        </AnimatePresence>
                        <p className="tracking-wide font-light text-center w-60 max-sm:w-60">
                            {!isSignupMode ? "Enter your personal details and start journey with us" : "To keep connected with us please login with your personal info"}
                        </p>
                        <button onClick={() => setIsSignupMode(prev => !prev)} className="border border-white px-16 max-sm:px-8 py-3 max-sm:py-2 rounded-full tracking-wide cursor-pointer">{!isSignupMode ? "SIGN UP" : "SIGN IN"}</button>
                    </motion.div>

                    <motion.div
                        id="RIGHT or BTM"
                        className={`w-[65%] flex items-center justify-center h-full ${isSignupMode ? 'order-2' : 'order-1'}`}
                        layout
                        transition={{ ease: 'easeInOut', duration: 0.6 }}
                    >
                        <div className="flex flex-col items-center">
                            <h1 className="text-4xl max-sm:text-3xl font-extrabold text-bStoreCol tracking-wide">{!isSignupMode ? "Sign in to Store" : "Create Account"}</h1>
                            <div id="logos" className="flex gap-2 my-5 max-sm:my-2.5">
                                <div onClick={() => signIn('discord')} className="p-1.5 border border-black/30 rounded-full cursor-pointer">
                                    <img src={discordLogo} alt="discord" />
                                </div>
                                <div onClick={() => signIn('google')} className="p-1.5 cursor-pointer border border-black/30 rounded-full">
                                    <img src={googleLogo} alt="google" />
                                </div>
                                <div onClick={() => signIn('github')} className="p-1.5 cursor-pointer border border-black/30 rounded-full">
                                    <img src={githubLogo} alt="github" />
                                </div>
                            </div>
                            <span className="tracking-wide font-light mb-3 text-nowrap text-clip">{!isSignupMode ? "or use your email account:" : "or use your email for registration:"}</span>
                            <form action={formAction} className="flex flex-col items-center gap-6 max-sm:gap-5">
                                <div className="flex flex-col gap-2.5">
                                    <AnimatePresence>
                                        {isSignupMode && (
                                            <motion.div className="relative"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <img src={nameIcon} alt="" height={18} width={18} className="absolute top-4 left-2" />
                                                <input type="text" name="name" placeholder="Name" autoComplete='name' className="py-3 px-8 w-[378.5px] max-sm:w-[260px] bg-black/10" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <div className="relative">
                                        <img src={emailIcon} alt="" height={18} width={18} className="absolute top-4 left-2" />
                                        <input type="text" name="email" placeholder="Email" autoComplete='email' className="py-3 px-8 w-[378.5px] max-sm:w-[260px] bg-black/10" />
                                    </div>
                                    <div className="relative">
                                        <img src={passwordIcon} alt="" height={18} width={18} className="absolute top-4 left-2" />
                                        <input type="text" name="password" placeholder="Password" autoComplete={`${isSignupMode ? 'new-password' : 'current-password'}`} className="py-3 px-8 w-[378.5px] max-sm:w-[260px] bg-black/10" />
                                    </div>
                                    <AnimatePresence>
                                        {isSignupMode && (
                                            <motion.div
                                                className="relative"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <img src={passwordIcon} alt="" height={18} width={18} className="absolute top-4 left-2" />
                                                <input type="text" name="confirmPassword" placeholder="Confirm password" autoComplete='new-password' className="py-3 px-8 w-[378.5px] max-sm:w-[260px] bg-black/10" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                {!isSignupMode && (
                                    <NavLink to={'resetPassword'}>
                                        <div>
                                            <span>Forget your password?</span>
                                            <div className='h-px mt-0.5 bg-black/10'></div>
                                        </div>
                                    </NavLink>
                                )}
                                <motion.button layout className="py-3.5 max-sm:py-2.5 px-16 max-sm:px-8 cursor-pointer tracking-wide rounded-full bg-bStoreCol text-white">
                                    {isPending ? "Signing up..." : lIsPending ? 'Logging in...' : isFormSubmitting ? 'Submitting...' : !isSignupMode ? "SIGN IN" : "SIGN UP"}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
                {showDialogState && (createPortal(
                    <Modal showDialog={showDialogState}>
                        {data?.msg || lData?.msg}
                    </Modal>,
                    document.getElementById('modal')!
                ))}

                {((data && data.isAlreadySignedUp) ||
                    (lData && lData.isAlreadyLoggedIn)) &&
                    (<ul className="m-auto w-[60vw] mt-5"><li className="bg-red-300 p-2 rounded-md mb-2">{data?.msg || lData?.msg}</li></ul>)
                }

                {((data && data.invalidInputs) || (lData && lData.invalidInputs)) && (
                    <ul className="m-auto w-[60vw] mt-5">
                        {(data || lData).valiErrors.map((err: any) => <li className="bg-red-300 p-2 rounded-md mb-2">{err.msg}</li>)}
                    </ul>
                )}
            </div>
        </>
    )
}
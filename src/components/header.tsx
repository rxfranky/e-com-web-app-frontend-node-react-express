import { createPortal } from 'react-dom'
import Profile from './profile'
import Hamberger from './hamburger'
import { motion } from 'motion/react'
import { NavLink } from "react-router"
import { useSelector, useDispatch } from "react-redux"
import { handleShowHamberger as handleShowHambergerAction } from '../store/show/show-slice'
import { handleShowProfile as handleShowProfileAction } from '../store/show/show-slice'
import ProfileIcon from './profile-icon'
import { authClient } from '../utils/auth-client'


export default function Header() {
    const isLoggedIn = useSelector((state: any) => state.authStateChanger.authState.isLoggedIn)
    const show = useSelector((state: any) => state.showStateChanger)
    const dispatch = useDispatch()
    const { data } = authClient.useSession()

    function handleShowHamberger(action: boolean) {
        dispatch(handleShowHambergerAction(action))
    }

    function handleShowProfile(action: boolean) {
        dispatch(handleShowProfileAction(action))
    }

    return (
        <>
            <header className="h-[109.542px] flex items-center justify-center">
                <nav className="flex justify-between w-[90vw] items-center">
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
                                    ) : (
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
                        : (
                            <>
                                <div onClick={() => handleShowHamberger(true)} id='hamburger' className='w-7.5 h-6.5 flex flex-col justify-between cursor-pointer'>
                                    <p className='h-0.5 bg-bStoreCol'></p>
                                    <p className='h-0.5 bg-bStoreCol'></p>
                                    <p className='h-0.5 bg-bStoreCol'></p>
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
                            </>
                        )
                    }
                </nav>
            </header>
            {(show.showProfile && (isLoggedIn || data)) && (
                createPortal(
                    <div id="overlay" onClick={() => handleShowProfile(false)} className="h-screen w-screen bg-black/25 z-0 absolute top-0 cursor-pointer">
                        <Profile onClose={handleShowProfile} />
                    </div>,
                    document.getElementById('modal')!
                )
            )}
        </>
    )
}
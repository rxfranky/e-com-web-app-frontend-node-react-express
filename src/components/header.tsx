import { createPortal } from 'react-dom'
import Profile from './profile'
import Hamberger from './hamburger'
import { motion } from 'motion/react'
import { NavLink } from "react-router"
import { useSelector, useDispatch } from "react-redux"
import { handleShowHamberger as handleShowHambergerAction } from '../store/show/show-slice'
import { handleShowProfile as handleShowProfileAction } from '../store/show/show-slice'


export default function Header() {
    const isLoggedIn = useSelector((state: any) => state.authStateChanger.isLoggedIn)
    const show = useSelector((state: any) => state.showStateChanger)
    const dispatch = useDispatch()

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
                                whileHover={{ backgroundColor: "rgb(14, 52, 90)", color: "white" }}
                                transition={{ duration: 0.4 }}
                            >PUBLISHERS</motion.span>
                        </div>
                    </NavLink>
                    {window.outerWidth >= 640 ? (
                        <ul className="flex gap-5 items-center">
                            <NavLink to={'products?page=1'} className={({ isActive }) => isActive ? 'underline decoration-bStoreCol' : ''}><motion.li className="text-bStoreCol text-lg" whileTap={{ scale: 1 }} whileHover={{ scale: 1.05 }}>Products</motion.li></NavLink>
                            <li className="text-bStoreCol text-lg">Events</li>
                            <li className="text-bStoreCol text-lg">About</li>
                            <li className="text-bStoreCol text-lg">Contact</li>
                            <div className="flex gap-2 items-center">
                                <NavLink to={'signup'} className={({ isActive }) => isActive ? 'underline' : ''}><motion.li className="text-bStoreCol" whileTap={{ scale: 1 }} whileHover={{ scale: 1.05 }}>Signup</motion.li></NavLink>
                                <li className='text-bStoreCol w-[39.26px]'>
                                    {isLoggedIn ? (
                                        <svg onClick={() => handleShowProfile(true)} className='m-auto cursor-pointer' data-bbox="0 0 50 50" data-type="shape" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 50 50">
                                            <g>
                                                <path fill="rgb(14, 52, 90)" d="M25 48.077c-5.924 0-11.31-2.252-15.396-5.921 2.254-5.362 7.492-8.267 15.373-8.267 7.889 0 13.139 3.044 15.408 8.418-4.084 3.659-9.471 5.77-15.385 5.77m.278-35.3c4.927 0 8.611 3.812 8.611 8.878 0 5.21-3.875 9.456-8.611 9.456s-8.611-4.246-8.611-9.456c0-5.066 3.684-8.878 8.611-8.878M25 0C11.193 0 0 11.193 0 25c0 .915.056 1.816.152 2.705.032.295.091.581.133.873.085.589.173 1.176.298 1.751.073.338.169.665.256.997.135.515.273 1.027.439 1.529.114.342.243.675.37 1.01.18.476.369.945.577 1.406.149.331.308.657.472.98.225.446.463.883.714 1.313.182.312.365.619.56.922.272.423.56.832.856 1.237.207.284.41.568.629.841.325.408.671.796 1.02 1.182.22.244.432.494.662.728.405.415.833.801 1.265 1.186.173.154.329.325.507.475l.004-.011A24.886 24.886 0 0 0 25 50a24.881 24.881 0 0 0 16.069-5.861.126.126 0 0 1 .003.01c.172-.144.324-.309.49-.458.442-.392.88-.787 1.293-1.209.228-.232.437-.479.655-.72.352-.389.701-.78 1.028-1.191.218-.272.421-.556.627-.838.297-.405.587-.816.859-1.24a26.104 26.104 0 0 0 1.748-3.216c.208-.461.398-.93.579-1.406.127-.336.256-.669.369-1.012.167-.502.305-1.014.44-1.53.087-.332.183-.659.256-.996.126-.576.214-1.164.299-1.754.042-.292.101-.577.133-.872.095-.89.152-1.791.152-2.707C50 11.193 38.807 0 25 0"
                                                >
                                                </path>
                                            </g>
                                        </svg>
                                    ) : <NavLink to={'login'} className={({ isActive }) => isActive ? 'underline' : ''}><motion.span whileTap={{ scale: 1 }} whileHover={{ scale: 1.05 }}>login</motion.span></NavLink>}
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
                                        />,
                                        document.getElementById('modal')!
                                    )
                                )}
                            </>
                        )
                    }
                </nav>
            </header>
            {(show.showProfile && isLoggedIn) && (
                createPortal(
                    <div id="overlay" className="h-screen w-screen bg-black/25 z-10 absolute top-0">
                        <Profile onClose={handleShowProfile} />
                    </div>,
                    document.getElementById('modal')!
                )
            )}
        </>
    )
}
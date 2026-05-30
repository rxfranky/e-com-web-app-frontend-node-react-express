import { useEffect } from "react";
import { motion, AnimatePresence } from 'motion/react'
import { NavLink } from "react-router"
import ProfileIcon from "./profile-icon";


export default function Hamberger(
    {
        isLoggedIn,
        onClose,
        handleShowProfile,
        oAuthData
    }: {
        isLoggedIn: boolean;
        onClose: (action: boolean) => void;
        handleShowProfile: (action: boolean) => void;
        oAuthData: any
    }
) {

    useEffect(() => {
        document.body.classList.add("overflow-hidden")
        return () => {
            document.body.classList.remove("overflow-hidden")
        }
    })

    return (
        <>
            <AnimatePresence>
                <motion.div
                    id='hamberger'
                    className='min-h-screen min-w-screen bg-white'
                    initial={{ x: 50 }}
                    animate={{ x: 0 }}
                >
                    <div className="flex justify-center">
                        <div className="flex justify-between w-67.5 items-center mt-12">
                            <div className="flex items-center gap-2 text-lg text-bStoreCol">
                                {(isLoggedIn || oAuthData) ? (oAuthData?.user.image ? (<div
                                    className='size-6.5 rounded-full cursor-pointer'
                                    onClick={() => handleShowProfile(true)}
                                >
                                    <img src={oAuthData.user.image} height={100} width={100} className='object-cover rounded-full' alt="profile pic" />
                                </div>) : <ProfileIcon
                                    handleShowProfile={handleShowProfile}
                                    color="rgb(14, 52, 90)"
                                />
                                ) : (<NavLink
                                    to={'auth'}
                                    className={({ isActive }) => isActive ? 'underline' : ''}
                                >
                                    <motion.span whileTap={{ scale: 1 }} whileHover={{ scale: 1.05 }}>Signup or Login</motion.span>
                                </NavLink>)
                                }
                            </div>
                            <span onClick={() => onClose(false)} className="cursor-pointer">
                                <svg viewBox="0 0 24 24" fill="rgb(14, 52, 90)" width="24" height="24" className="sOnyBDt"><path fillRule="evenodd" d="M19.2928932,3.99989322 L20,4.707 L12.7068932,11.9998932 L20,19.2928932 L19.2928932,20 L11.9998932,12.7068932 L4.707,20 L3.99989322,19.2928932 L11.2928932,11.9998932 L3.99989322,4.707 L4.707,3.99989322 L11.9998932,11.2928932 L19.2928932,3.99989322 Z"></path></svg>
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 text-3xl font-bold text-bStoreCol items-center mt-10">
                        <NavLink to={'products?page=1'} className={({ isActive }) => isActive ? 'underline' : ''}><motion.span whileTap={{ scale: 1 }} whileHover={{ scale: 1.05 }}>Products</motion.span></NavLink>
                        <span>Events</span>
                        <span>About</span>
                        <span>Contact</span>
                    </div>
                </motion.div>
            </AnimatePresence>
        </>
    )
}
import { NavLink } from "react-router"
import { motion } from 'motion/react'
import { useSelector, useDispatch } from "react-redux"
import { logout as logoutAction } from "../store/auth/auth-slice"

export default function Navbar() {
    const isLoggedIn = useSelector((state: any) => state.authStateChanger.isLoggedIn)
    const dispatch = useDispatch()

    function logout() {
        localStorage.removeItem('authToken')
        localStorage.removeItem('email')
        dispatch(logoutAction())
    }

    return (
        <>
            <nav className="lg:flex lg:flex-row lg:justify-around lg:items-center flex flex-col p-3 h-fit lg:h-14 rounded-full bg-yellow-500 font-semibold w-[80vw] m-auto mt-7">
                <motion.div className="h-fit m-auto lg:m-0" whileTap={{ scale: 1 }} whileHover={{ scale: 1.05 }}>
                    <NavLink to={'/'} className={({ isActive }) => isActive ? 'underline' : ''}><span>Homepage</span></NavLink>
                </motion.div>
                <div>
                    <ul className="flex flex-wrap justify-center items-center lg:gap-3 gap-2">
                        <NavLink to={'products?page=1'} className={({ isActive }) => isActive ? 'underline' : ''}><motion.li whileTap={{ scale: 1 }} whileHover={{ scale: 1.05 }}>Products</motion.li></NavLink>
                        {isLoggedIn && (
                            <>
                                <NavLink to={'adminProducts?page=1'} className={({ isActive }) => isActive ? 'underline' : ''}><motion.li whileTap={{ scale: 1 }} whileHover={{ scale: 1.05 }}>Admin Products</motion.li></NavLink>
                                <NavLink to={'add-product'} className={({ isActive }) => isActive ? 'underline' : ''}><motion.li whileTap={{ scale: 1 }} whileHover={{ scale: 1.05 }}>Add Product</motion.li></NavLink>
                                <NavLink to={'cart'} className={({ isActive }) => isActive ? 'underline' : ''}><motion.li whileTap={{ scale: 1 }} whileHover={{ scale: 1.05 }}>Cart</motion.li></NavLink>
                                <NavLink to={'orders'} className={({ isActive }) => isActive ? 'underline' : ''}><motion.li whileTap={{ scale: 1 }} whileHover={{ scale: 1.05 }}>Orders</motion.li></NavLink>
                            </>
                        )}
                        <NavLink to={'signup'} className={({ isActive }) => isActive ? 'underline' : ''}><motion.li whileTap={{ scale: 1 }} whileHover={{ scale: 1.05 }}>Signup</motion.li></NavLink>

                        {isLoggedIn ? (
                            <>
                                <NavLink to={'login/changePassword'} className={({ isActive }) => isActive ? 'underline' : ''}><motion.li whileTap={{ scale: 1 }} whileHover={{ scale: 1.05 }}>Change Password</motion.li></NavLink>
                                <motion.button
                                    className="cursor-pointer bg-black text-white rounded-md pl-1 pr-1"
                                    initial={{ scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 1 }}
                                    onClick={logout}
                                >
                                    logout
                                </motion.button>
                            </>
                        ) : (
                            <NavLink to={'login'} className={({ isActive }) => isActive ? 'underline' : ''}><motion.li whileTap={{ scale: 1 }} whileHover={{ scale: 1.05 }}>login</motion.li></NavLink>
                        )}
                    </ul>
                </div>
            </nav>
        </>
    )
}
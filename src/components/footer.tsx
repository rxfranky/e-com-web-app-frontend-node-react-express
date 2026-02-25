import { motion } from 'motion/react'

export default function Footer() {
    return (
        <>
            <footer className="mt-20 mb-7 max-sm:h-fit max-sm:mb-5">
                <div className="grid grid-cols-12 max-sm:grid-cols-1 max-md:grid-cols-3 max-md:grid-rows-2">
                    <div id="col1" className="text-bStoreCol col-span-3 flex justify-end max-sm:justify-center max-md:col-span-1">
                        <div className="flex flex-col gap-2">
                            <span className="mb-8">BINK. Publishers</span>
                            <span>500 Terry Francine St.</span>
                            <span>San Francisco, CA 94158</span>
                            <span>123-456-7890</span>
                            <span>info@my-domain.com</span>
                        </div>
                    </div>
                    {(window.outerWidth > 640 && window.outerWidth > 768) && (
                        <div></div>
                    )}

                    <div id="col2" className="col-span-2 max-md:col-span-1 max-sm:col-span-3 flex justify-center">
                        <div className="flex flex-col gap-2 text-bStoreCol">
                            <span className="mb-8">Shop</span>
                            <span>FAQ</span>
                            <span>Shipping & Return</span>
                            <span>Store Policy</span>
                            <span>Payment Methods</span>
                        </div>
                    </div>
                    {(window.outerWidth > 640 && window.outerWidth > 768) && (
                        <div></div>
                    )}

                    <div id="col3" className="flex max-md:col-span-1 justify-start max-sm:justify-center">
                        <div className="flex flex-col gap-2 text-bStoreCol">
                            <span className="mb-8">Socials</span>
                            <span>Facebook</span>
                            <span>Twitter</span>
                            <span>Instagram</span>
                            <span>Pinterest</span>
                        </div>
                    </div>
                    {(window.outerWidth > 640 && window.outerWidth > 768) && (
                        <div></div>
                    )}

                    <div id="col4" className="col-span-3 max-md:col-span-3 max-md:items-center max-sm:items-center flex flex-col gap-2">
                        <span className="mb-8 text-bStoreCol">Be the First to Know</span>
                        <span className="text-bStoreCol">Signup for our Newsletter</span>
                        <div className="max-sm:flex max-sm:flex-col max-md:flex max-md:flex-col">
                            <label htmlFor="email" className="text-bStoreCol">Enter your email here*</label>
                            <input type="text" id="email" className="py-2 px-2  border-2 border-bStoreCol mt-2 w-64 max-lg:w-50 outline-none" placeholder="Enter email" />
                            {/* <div className="flex gap-1 items-center mt-1">
                                <svg viewBox="0 0 20 20" fill="red" width="20" height="20" className="sZDaT7l" aria-hidden="true"><path fill-rule="evenodd" d="M9.5,3 C13.084,3 16,5.916 16,9.5 C16,13.084 13.084,16 9.5,16 C5.916,16 3,13.084 3,9.5 C3,5.916 5.916,3 9.5,3 Z M9.5,4 C6.467,4 4,6.467 4,9.5 C4,12.533 6.467,15 9.5,15 C12.533,15 15,12.533 15,9.5 C15,6.467 12.533,4 9.5,4 Z M10,11 L10,12 L9,12 L9,11 L10,11 Z M10,7 L10,10 L9,10 L9,7 L10,7 Z"></path></svg>
                                <span className="text-red-600">Enter an email address</span>
                            </div> */}
                        </div>
                        <div>
                            <div className="flex justify-between w-64 mb-1">
                                <div className="flex gap-1 items-center">
                                    <input type="checkbox" name="" id="" className="accent-bStoreCol" />
                                    <p className="w-27.75 h-17.25 overflow-hidden text-bStoreCol">Yes, subscribe to your newsletter.</p>
                                </div>
                                <motion.button
                                    className="py-2 h-fit max-lg:mr-4 px-6 bg-bStoreCol text-white"
                                    whileHover={{
                                        backgroundColor: 'white',
                                        color: 'rgb(14, 52, 90)'
                                    }}
                                    transition={{ duration: 0.4 }}
                                >Subscribe</motion.button>
                            </div>
                            {/* <div className="flex gap-1 items-center">
                                <svg viewBox="0 0 20 20" fill="red" width="20" height="20" className="sZDaT7l" aria-hidden="true"><path fill-rule="evenodd" d="M9.5,3 C13.084,3 16,5.916 16,9.5 C16,13.084 13.084,16 9.5,16 C5.916,16 3,13.084 3,9.5 C3,5.916 5.916,3 9.5,3 Z M9.5,4 C6.467,4 4,6.467 4,9.5 C4,12.533 6.467,15 9.5,15 C12.533,15 15,12.533 15,9.5 C15,6.467 12.533,4 9.5,4 Z M10,11 L10,12 L9,12 L9,11 L10,11 Z M10,7 L10,10 L9,10 L9,7 L10,7 Z"></path></svg>
                                <span className="text-red-600">Check the box to continue.</span>
                            </div> */}
                        </div>
                    </div>
                </div>

                <div className="w-[75vw] flex justify-between mt-5 m-auto items-center">
                    <span className="text-bStoreCol">© 2035 by BINK. Publishers. Powered and secured by Rx</span>
                    <span className="mt-1">
                        <svg height="15" width="15" preserveAspectRatio="none" data-bbox="6.443 47.497 187.114 105.008" xmlns="http://www.w3.org/2000/svg" viewBox="6.443 47.497 187.114 105.008" role="presentation" aria-hidden="true">
                            <g>
                                <path fill="rgb(14, 52, 90)" d="M174.476 51.261l-74.704 74.193L25.578 50.75c-4.287-4.316-11.566-4.341-15.882-.054s-4.341 11.565-.055 15.882l82.107 82.673c4.287 4.316 11.566 4.341 15.882.055l82.673-82.107c4.316-4.287 4.341-11.566.055-15.882s-11.235-4.342-15.882-.056z"></path>
                            </g>
                        </svg>
                    </span>
                </div>
            </footer>
        </>
    )
}
import BookSection from "../components/book-section"
import { motion } from 'motion/react'


export default function Homepage() {
    return (
        <>
            <section id="hero" className="flex justify-center">
                <main className="w-[90vw] max-sm:h-80 max-sm:w-full h-135 relative flex items-center">
                    <div className="absolute text-bStoreCol text-[115px] ml-12 font-bold flex flex-col max-sm:text-4xl">
                        <span className="leading-none">A SOFA,</span>
                        <span className="leading-none">A GOOD</span>
                        <span className="leading-none">BOOK,</span>
                        <span className="leading-none">AND YOU.</span>
                    </div>
                    <img src={"https://res.cloudinary.com/dtgh4iqul/image/upload/v1772035166/bg-image_jayfki.avif"} alt="" className="object-cover h-full w-full" />
                </main>
            </section>

            <section id="main" className="mt-16 max-sm:mt-6">
                <div className="txt text-center mb-36 max-sm:mb-4">
                    <span className="text-2xl text-bStoreCol font-semibold">BINK. Publishers</span><br />
                    <span className="text-5xl text-bStoreCol tracking-widest font-bold">BESTSELLERS </span>
                </div>
                <div className="flex justify-center relative">
                    <BookSection atTop={true} />
                    <div id="blue" className="bg-bStoreCol w-[90vw] max-sm:w-full">
                        <div className="txt bg-red- mt-64 max-sm:mt-130 flex flex-col gap-7 items-center mb-14">
                            <div className="w-7.5 h-px bg-white/60"></div>
                            <div className="text-center">
                                <span className="text-white font-semibold text-2xl">This Month's</span><br />
                                <span className="text-5xl tracking-widest font-bold text-white max-sm:text-4xl">RECOMMENDED BOOKS</span>
                            </div>
                            <div className="w-7.5 h-px bg-white/60"></div>
                        </div>
                        <div className="flex justify-center mb-19 max-sm:mb-15">
                            <BookSection />
                        </div>
                        <div className="txt flex flex-col items-center gap-7 mb-12 max-sm:mb-10">
                            <div className="w-7.5 h-px bg-white/60"></div>
                            <p className="text-8xl max-sm:text-5xl font-bold text-white text-center">
                                THERE'S NO <br />
                                SUCH THING AS TOO <br />
                                MANY BOOKS
                            </p>
                            <motion.button
                                whileHover={{
                                    backgroundColor: 'white',
                                    color: 'rgb(14, 52, 90)'
                                }}
                                transition={{ duration: 0.6 }}
                                className="py-2 max-sm:py-4 text-white px-4 max-sm:px-6 border-2 border-white"

                            >Read Our Story</motion.button>
                            <div className="w-7.5 h-px bg-white/60"></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
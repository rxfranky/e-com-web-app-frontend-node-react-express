import { useNavigate } from "react-router"
import * as React from 'react'

type props = {
    id: number;
    title: string;
    price: number;
    imageSrc: string;
    desc: string
}

export default function SearchItem({ title, imageSrc, price, desc, id }: props) {
    const navigate = useNavigate()

    React.useEffect(() => {
        // const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        // const isBodyOverflowing = document.body.scrollHeight > window.innerHeight || document.body.scrollWidth > window.innerWidth;

        // if (isBodyOverflowing) {
        //     document.body.style.paddingRight = `${scrollbarWidth}px`;
        // }
        document.body.classList.add("overflow-hidden")
        return () => {
            // if (isBodyOverflowing) {
            //     document.body.style.paddingRight = "";
            // }
            document.body.classList.remove("overflow-hidden")
        }
    }, [])

    return (
        <>
            <div id="product" onClick={() => navigate('/products/productDetail/' + id + `?title=${title}&imageSrc=${imageSrc}&price=${price}&desc=${desc}`)} className='bg-black/7 p-2 flex gap-15 rounded-sm cursor-pointer'>
                <div id="image" className='h-12 w-9 flex justify-center items-center'>
                    <img className='h-full w-full object-cover' src={imageSrc} alt="" />
                </div>
                <div className='flex flex-col h-fit'>
                    <span id="title" className='text-sm w-[70px] text-nowrap overflow-clip'>{title}</span>
                    <span id="price" className='text-sm w-[70px] text-nowrap overflow-clip'>${price}</span>
                </div>
            </div>
        </>
    )
}
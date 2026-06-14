import { useNavigate } from "react-router"

type props = {
    id: number;
    title: string;
    price: number;
    imageSrc: string;
    desc: string
}

export default function SearchItem({ title, imageSrc, price, desc, id }: props) {
    const navigate = useNavigate()

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
import type { JSX } from "react";
import { useMutation } from "@tanstack/react-query";
import { quantityControl } from "../util/http-requests";
import Error from "../pages/error";
import { queryClient } from "../main";


interface Props {
    title: string;
    price: string;
    imgSrc: string,
    isForOrderDetailPage?: boolean;
    quantity?: number,
    id?: number
}

interface resMutation {
    mutate: any;
    isError: boolean;
    error: any
}


export default function CartItem({ title, imgSrc, price, isForOrderDetailPage, quantity, id }: Props): JSX.Element {
    const { error, isError, mutate }: resMutation = useMutation(
        {
            mutationFn: quantityControl,
            mutationKey: ['quantity'],
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['fetch-cart'] })
            }
        }
    )
    function handleQuantity(action: string) {
        mutate({ id, action })
    }
    if (isError) {
        return <Error StatusCode={error.statusCode} msg={error.message} />
    }

    return (
        <>
            <div id="cartItem">
                <div id='item' className="flex gap-2 w-fit">
                    <div id="image" className='h-18.75 w-18.75 bg-gray-100 flex justify-center items-center'>
                        <img src={imgSrc} className='object-cover h-16 w-13' alt={'image of ' + title} />
                    </div>
                    <div id="mid">
                        <div id='txt'>
                            <p className='mb-2 w-[150px] overflow-clip'>{title}</p>
                            <p className='mb-2 w-20 overflow-clip'>${price}</p>
                        </div>
                        <div id='quan&Price' className='flex gap-30 items-center'>
                            <div className='border border-gray-400 flex gap-1.5 p-0.75'>
                                <span onClick={() => { handleQuantity(quantity === 1 ? 'delete' : 'dec') }} className="cursor-pointer">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" className="sZxd73l"><path fill-rule="evenodd" d="M20,12 L20,13 L5,13 L5,12 L20,12 Z"></path></svg>
                                </span>
                                <span>{quantity}</span>
                                <span onClick={() => { handleQuantity('inc') }} className="cursor-pointer">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" className="sZxd73l"><path fill-rule="evenodd" d="M13,5 L13,12 L20,12 L20,13 L13,13 L13,20 L12,20 L11.999,13 L5,13 L5,12 L12,12 L12,5 L13,5 Z"></path></svg>
                                </span>
                            </div>
                            <span>${quantity! * (+price)}</span>
                        </div>
                    </div>
                    <span id='deleteBtn' onClick={() => handleQuantity('delete')} className="cursor-pointer">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path fill-rule="evenodd" d="M13.5,3 C14.327,3 15,3.673 15,4.5 L15,4.5 L15,5 L19,5 L19,6 L18,6 L18,17.5 C18,18.879 16.878,20 15.5,20 L15.5,20 L7.5,20 C6.122,20 5,18.879 5,17.5 L5,17.5 L5,6 L4,6 L4,5 L8,5 L8,4.5 C8,3.673 8.673,3 9.5,3 L9.5,3 Z M17,6 L6,6 L6,17.5 C6,18.327 6.673,19 7.5,19 L7.5,19 L15.5,19 C16.327,19 17,18.327 17,17.5 L17,17.5 L17,6 Z M10,9 L10,16 L9,16 L9,9 L10,9 Z M14,9 L14,16 L13,16 L13,9 L14,9 Z M13.5,4 L9.5,4 C9.224,4 9,4.225 9,4.5 L9,4.5 L9,5 L14,5 L14,4.5 C14,4.225 13.776,4 13.5,4 L13.5,4 Z"></path></svg>
                    </span>
                </div>
                <div id="partition" className="w-[357.5px] h-[0.5px] bg-gray-300 mt-4">
                </div>
            </div>
        </>
    )
}
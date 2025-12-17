import type { JSX } from "react";
import { useMutation } from "@tanstack/react-query";
import { quantityControl } from "../util/http-requests";
import Button from "./button";
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
            <div className="item p-5 border-2 rounded-md border-amber-400 mb-5 flex justify-between">
                <div className="flex gap-4">
                    <div className="img w-[100px] h-40">
                        <img className="w-full h-full object-cover" src={imgSrc} alt="image of captain america" />
                    </div>
                    <div>
                        <span className="font-bold mb-2 mt-2 block">{title}</span>
                        {!isForOrderDetailPage && (
                            <div className="quantity-controller">
                                <Button
                                    onClick={() => { handleQuantity(quantity === 1 ? 'delete' : 'dec') }}
                                    className="pl-2 pr-2 disabled:bg-gray-200 cursor-pointer border border-amber-400"
                                >
                                    {quantity === 1 ? 'delete' : '-'}
                                </Button>
                                <span className="p-2">{quantity}</span>
                                <Button onClick={() => { handleQuantity('inc') }} className="pl-2 pr-2 cursor-pointer border border-amber-400">+</Button>
                            </div>
                        )}
                        <span className='font-semibold inline-block mt-2'>{price}$</span>
                    </div>
                </div>
                <span>{quantity! * (+price)}$</span>
            </div>
        </>
    )
}
import { type JSX } from "react"
import Button from "../components/button"
import FormComponent from "../components/form-component"
import { useMutation } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { useLocation } from "react-router"
import { useActionState } from "react"
import Error from "./error"
import { addProduct } from "../util/http-requests"
import { useNavigate } from "react-router"
import { createPortal } from "react-dom"
import Modal from "../components/modal"
import { useSearchParams } from "react-router"


interface mutationRes {
    data: any;
    error: any;
    isError: boolean;
    isPending: boolean,
    mutate: any
}

export default function AddProduct(): JSX.Element {
    const [formState, formAction, isFormSubmitting] = useActionState(handleFormSubmit, null)
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [searchParams, setSearchParams] = useSearchParams()
    const product_id = searchParams.get('product_id')
    const title = searchParams.get('title')
    const price = searchParams.get('price')

    const { mutate, data, isError, error, isPending }: mutationRes = useMutation(
        {
            mutationFn: addProduct,
            mutationKey: ['add-product'],
            onSuccess: (data) => {
                if (data.productAdded || data.productEdited) {
                    setTimeout(() => {
                        navigate('/products?page=1', { viewTransition: true })
                    }, 3000);
                    setShowDialog(true)
                }
            }
        }
    )

    useEffect(() => {
        if (pathname === '/products') {
            setShowDialog(false)
        }
    }, [pathname])

    function handleFormSubmit(prevState: any, formData: FormData) {
        // const dataObj = Object.fromEntries(formData) // lose actual file data
        if (product_id) {
            mutate({ formData, product_id })
        } else {
            mutate({ formData })
        }
    }

    if (isError) {
        return <Error msg={error.message} StatusCode={error.statusCode} />
    }

    return (
        <>
            <div className="m-auto mt-5 mb-5 parent w-[60vw] bg-amber-100 rounded-md flex justify-center">
                <form className="flex flex-col gap-3 pt-9 pb-9" action={formAction}>
                    <FormComponent value={title!} label="Title" name="title" />
                    <FormComponent label="Description" name="description" />
                    <FormComponent value={price!} label="Price" name="price" />
                    <div>
                        <label className="block font-semibold" htmlFor="image">Upload Image</label>
                        <input className="p-1 pl-3 w-[50vw] border border-amber-400 rounded-md" type="file" name="image" id="image" />
                    </div>
                    <div className="flex justify-end">
                        <Button className="p-1 h-fit cursor-pointer rounded-sm border-2 border-amber-400 bg-amber-100">{isFormSubmitting ? 'submitting...' : isPending ? 'adding product...' : 'Add Product'}</Button>
                    </div>
                </form>
            </div>
            {showDialog && (
                createPortal(
                    <Modal showDialog={showDialog}>{data.msg} redirecting...</Modal>,
                    document.getElementById('modal')!
                )
            )}
            {(data && data.invalidInputs) && (
                <ul className="m-auto w-[60vw]">
                    {data.valiErrors.map((err: any) => <li className="bg-red-300 p-2 rounded-md mb-2">{err.msg}</li>)}
                </ul>
            )}
        </>
    )
}
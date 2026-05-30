import type { JSX } from "react"
import FormComponent from "../components/form-component"
import { useMutation } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router"
import Error from "./error"
import Modal from "../components/modal"
import { useActionState } from "react"
import { createPortal } from "react-dom"
import { newPassword } from "../utils/http-requests"
import { useSearchParams } from "react-router"
import { Spinner } from "@/components/ui/spinner"
import { motion } from 'motion/react'


interface resMutation {
    mutate: any;
    isError: boolean;
    error: any,
    isPending: boolean,
    data: any;
}

export default function NewPassword(): JSX.Element {
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const [formState, formAction, isFormSubmitting] = useActionState(handleFormSubmit, null)
    const [searchParams, setSearchParams] = useSearchParams()

    const resetToken = searchParams.get('token')

    const { mutate, isError, error, isPending, data }: resMutation = useMutation(
        {
            mutationFn: newPassword,
            mutationKey: ['new-password'],
            onSuccess: (data) => {
                if (data.newPassword) {
                    setTimeout(() => {
                        navigate('/auth')
                    }, 3000);
                    setShowDialog(true)
                }
            }
        }
    )
    useEffect(() => {
        if (pathname === '/login') {
            setShowDialog(false)
        }
    }, [pathname])


    if (isError) {
        return <Error StatusCode={error.statusCode} msg={error.message} />
    }

    function handleFormSubmit(prevState: any, formData: FormData) {
        const dataObj = Object.fromEntries(formData)
        mutate({ ...dataObj, resetToken })
    }

    return (
        <>

            <div className="m-auto mt-5 mb-5 parent w-[60vw] max-sm:w-[73vw] bg-bStoreCol rounded-md flex justify-center">
                <form className="flex flex-col gap-3 pt-9 pb-9" action={formAction}>
                    <FormComponent label="New Password" name="newPassword" />
                    <FormComponent label="New Confirm Password" name="newConfirmPassword" />
                    <div className="flex justify-end gap-3 items-center">
                        <motion.button
                            className="py-1.5 flex justify-center text-nowrap items-center gap-2 rounded-sm px-2 cursor-pointer bg-white text-bStoreCol"
                            layout
                        >
                            {isPending ? (<>
                                <Spinner data-icon='inline-start' className="size-5" />
                                Password Resetting...
                            </>) : isFormSubmitting ? 'Submitting...' : 'Reset'}
                        </motion.button>
                    </div>
                </form>
            </div>
            {showDialog && (
                createPortal(<Modal showDialog={showDialog}>{data.msg} redirecting...</Modal>,
                    document.querySelector('#modal')!))
            }
            {(data && data.invalidInputs) && (
                <ul className="m-auto w-[60vw]">
                    {data.valiErrors.map((err: any) => <li className="bg-red-300 p-2 rounded-md mb-2">{err.msg}</li>)}
                </ul>
            )}
        </>
    )
}
import type { JSX } from "react"
import FormComponent from "../components/form-component"
import Button from "../components/button"
import { useActionState } from "react"
import { useMutation } from "@tanstack/react-query"
import { signup } from "../util/http-requests"
import Error from "./error"
import Modal from "../components/modal"
import { createPortal } from "react-dom"
import { useNavigate } from "react-router"
import { useState } from "react"
import { useLocation } from "react-router"
import { useEffect } from "react"


export default function Signup(): JSX.Element {
    const navigate = useNavigate()
    const [showDialogState, setShowDialogState] = useState(false)
    const [formState, formAction, formSubmitting] = useActionState(handleFormSubmit, null)
    const { pathname } = useLocation()

    const { mutate, isError, error, data, isPending, isSuccess }: { mutate: any; isError: boolean; error: any; data: any; isPending: boolean; isSuccess: boolean } = useMutation(
        {
            mutationFn: signup,
            mutationKey: ['signup'],
            onSuccess: (data) => {
                if (data.signedUp) {
                    setTimeout(() => {
                        navigate('/login')
                    }, 3000)
                    setShowDialogState(true)
                }
            }
        }
    )

    useEffect(() => {
        if (pathname === '/login') {
            setShowDialogState(false)
        }
    }, [pathname])

    function handleFormSubmit(prevState: any, formData: any) {
        const formDataObj = Object.fromEntries(formData)
        mutate(formDataObj)
    }

    if (isError) {
        return (
            <>
                <Error StatusCode={error.StatusCode ?? 504} msg={error.message ?? 'something went worg with server!'} />
            </>
        )
    }

    if (isPending) {
        return <p className="text-4xl text-center mt-12 tracking-wide">Signing up...</p>
    }

    return (
        <>
            <div className="m-auto mt-5 mb-5 parent w-[60vw] bg-amber-100 rounded-md flex justify-center">
                <form className="flex flex-col gap-3 pt-9 pb-9" action={formAction}>
                    <FormComponent label="Name" name="name" />
                    <FormComponent label="Email" name="email" />
                    <FormComponent label="Password" name="password" />
                    <FormComponent label="Confirm Password" name="confirmPassword" />
                    <div className="flex justify-end">
                        <Button className="p-1 h-fit cursor-pointer rounded-sm border-2 border-amber-400 bg-amber-100">Signup</Button>
                    </div>
                </form>
            </div>
            {showDialogState && (createPortal(
                <Modal showDialog={showDialogState}>
                    {data.msg} redirecting...
                </Modal>,
                document.getElementById('modal')!
            ))
            }
            {(data && data.isAlreadySignedUp) && <ul className="m-auto w-[60vw]"><li className="bg-red-300 p-2 rounded-md mb-2">{data.msg}</li></ul>}

            {(data && data.invalidInputs) && (
                <ul className="m-auto w-[60vw]">
                    {data.valiErrors.map((err: any) => <li className="bg-red-300 p-2 rounded-md mb-2">{err.msg}</li>)}
                </ul>
            )}
        </>
    )
}
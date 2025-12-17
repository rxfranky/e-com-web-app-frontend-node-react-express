import type { JSX } from "react"
import Button from "../components/button"
import FormComponent from "../components/form-component"
import { NavLink } from "react-router"
import { useMutation } from "@tanstack/react-query"
import { login } from "../util/http-requests"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router"
import Error from "./error"
import Modal from "../components/modal"
import { useActionState } from "react"
import { createPortal } from "react-dom"
import { useDispatch } from 'react-redux'
import { login as loginAction } from "../store/auth/auth-slice"


interface resMutation {
    mutate: any;
    isError: boolean;
    error: any,
    isPending: boolean,
    data: any;
}

export default function Login(): JSX.Element {
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const [formState, formAction, isFormSubmitting] = useActionState(handleFormSubmit, null)
    const dispatch = useDispatch()

    const { mutate, isError, error, isPending, data }: resMutation = useMutation(
        {
            mutationFn: login,
            mutationKey: ['login'],
            onSuccess: (data) => {
                if (data.authToken) {
                    setTimeout(() => {
                        navigate('/', { viewTransition: true })
                    }, 3000);
                    setShowDialog(true)
                }
            }
        }
    )
    useEffect(() => {
        if (pathname === '/') {
            setShowDialog(false)
        }
    }, [pathname])

    useEffect(() => {
        if (data && data.authToken) {
            localStorage.setItem('authToken', data.authToken)
            localStorage.setItem('email', data.email)
            dispatch(loginAction(data.email))
        }
    }, [data])

    let content;
    if (isError) {
        content = <Error StatusCode={error.statusCode} msg={error.message} />
    }

    function handleFormSubmit(prevState: any, formData: FormData) {
        const dataObj = Object.fromEntries(formData)
        mutate(dataObj)
    }

    return (
        <>
            {content ?? (
                <>
                    <div className="m-auto mt-5 mb-5 parent w-[60vw] bg-amber-100 rounded-md flex justify-center">
                        <form className="flex flex-col gap-3 pt-9 pb-9" action={formAction}>
                            <FormComponent label="Email" name="email" />
                            <FormComponent label="Password" name="password" />
                            <div className="flex justify-end gap-3 items-center">
                                <NavLink to={'resetPassword'}><span className="cursor-pointer">Reset Password</span></NavLink>
                                <Button className="p-1 h-fit cursor-pointer rounded-sm border-2 border-amber-400 bg-amber-100">
                                    {isPending ? 'Logging in...' : isFormSubmitting ? 'Submitting...' : 'Login'}
                                </Button>
                            </div>
                        </form>
                    </div>
                    {showDialog && (
                        createPortal(<Modal showDialog={showDialog}>{data.msg} redirecting...</Modal>,
                            document.querySelector('#modal')!))
                    }
                    {((data && !data.authToken && !data.invalidInputs)) && (
                        <ul className="m-auto w-[60vw]"><li className="bg-red-300 p-2 rounded-md mb-2">{data.msg}</li></ul>
                    )}
                    {(data && data.invalidInputs) && (
                        <ul className="m-auto w-[60vw]">
                            {data.valiErrors.map((err: any) => <li className="bg-red-300 p-2 rounded-md mb-2">{err.msg}</li>)}
                        </ul>
                    )}
                </>
            )}
        </>
    )
}
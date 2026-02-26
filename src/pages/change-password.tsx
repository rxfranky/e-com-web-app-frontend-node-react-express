import FormComponent from "../components/form-component";
import { useActionState } from "react";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../util/http-requests";
import Error from "./error";
import { useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Modal from "../components/modal";
import { useSelector, useDispatch } from "react-redux"
import { handleShowProfile as handleShowProfileAction } from '../store/show/show-slice'
import { handleShowHamberger as handleShowHambergerAction } from '../store/show/show-slice'


type mutationRes = {
    mutate: any,
    data: any,
    isPending: boolean,
    error: any,
    isError: boolean
}

export default function ChangePassword() {
    const isLoggedIn = useSelector((state: any) => state.authStateChanger.isLoggedIn)
    const [formState, formAction, isFormSubmitting] = useActionState(handleFormSubmit, null)
    const navigate = useNavigate()
    const location = useLocation()
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const dispatch = useDispatch()
    const show = useSelector((state: any) => state.showStateChanger)

    useEffect(() => {
        if (show.showHamberger) {
            dispatch(handleShowHambergerAction(false))
        }
        dispatch(handleShowProfileAction(false))
    }, [])

    const { mutate, data, isError, error, isPending }: mutationRes = useMutation({
        mutationFn: changePassword,
        mutationKey: ['change-password'],
        onSuccess: (data) => {
            if (data.passwordChanged) {
                setTimeout(() => {
                    navigate('/login')
                }, 3000)
                setShowDialog(true)
            }
        }
    })

    useEffect(() => {
        if (location.pathname === '/login') {
            setShowDialog(false)
        }
    }, [location.pathname])

    function handleFormSubmit(prevState: any, formData: FormData) {
        const dataObj = Object.fromEntries(formData)
        mutate(dataObj)
    }

    if (!isLoggedIn) {
        return (
            <>
                <p className="text-3xl text-center mt-5">Please Login first!</p>
            </>
        )
    }

    if (isError) {
        return <Error StatusCode={error.statusCode} msg={error.message}></Error>
    }

    return (
        <>
            <div className="m-auto mt-5 mb-5 parent w-[60vw] max-sm:w-[73vw] bg-bStoreCol rounded-md flex justify-center">
                <form className="flex flex-col gap-3 pt-9 pb-9" action={formAction}>
                    <FormComponent label="Old Password" name="oldPassword" />
                    <FormComponent label="New Password" name="newPassword" />
                    <FormComponent label="New Confirm Password" name="newConfirmPassword" />
                    <div className="flex justify-end">
                        <button className="py-1.5 w-[140px] text-nowrap overflow-clip px-2 h-fit cursor-pointer bg-white text-bStoreCol">{isPending ? 'Changing password...' : isFormSubmitting ? 'Submitting...' : 'Change Password'}</button>
                    </div>
                </form>
            </div>
            {showDialog && (
                createPortal(<Modal showDialog={showDialog}>{data.msg} redirecting...</Modal>, document.getElementById('modal')!)
            )}
            {(data && data.invalidInputs) && (
                <ul className="m-auto w-[60vw]">
                    {data.valiErrors.map((err: any) => <li className="bg-red-300 p-2 rounded-md mb-2">{err.msg}</li>)}
                </ul>
            )}
            {(data && !data.passwordChanged && !data.invalidInputs) && (
                <ul className="m-auto w-[60vw]"><li className="bg-red-300 p-2 rounded-md mb-2">{data.msg}</li></ul>
            )}
        </>
    )
}
import FormComponent from "../components/form-component";
import { useActionState } from "react";
import { useMutation } from "@tanstack/react-query";
import Error from "./error";
import { resetPassword } from "../utils/http-requests";
import { Spinner } from "@/components/ui/spinner";
import { motion } from 'motion/react'


type mutationRes = {
    mutate: any,
    data: any,
    isPending: boolean,
    error: any,
    isError: boolean
}

export default function ResetPassword() {
    const [formState, formAction, isFormSubmitting] = useActionState(handleFormSubmit, null)

    const { mutate, data, isError, error, isPending }: mutationRes = useMutation({
        mutationFn: resetPassword,
        mutationKey: ['reset-password']
    })

    function handleFormSubmit(prevState: any, formData: FormData) {
        const dataObj = Object.fromEntries(formData)
        mutate(dataObj)
    }

    if (isError) {
        return <Error StatusCode={error.statusCode} msg={error.message}></Error>
    }

    return (
        <>
            <div className="m-auto mt-5 mb-5 parent w-[60vw] max-sm:w-[73vw] bg-bStoreCol rounded-md flex justify-center">
                <form className="flex flex-col gap-3 pt-9 pb-9" action={formAction}>
                    <FormComponent label="Email" name="email" />
                    <div className="flex justify-end">
                        <motion.button
                            className="py-1.5 px-2 rounded-sm flex justify-center text-nowrap items-center cursor-pointer bg-white text-bStoreCol gap-2"
                            layout
                        >
                            {isFormSubmitting ? 'Submitting form...' : isPending ? (<>
                                <Spinner data-icon='inline-start' className="size-5" />
                                Sending email...
                            </>) : 'Reset Password'}
                        </motion.button>
                    </div>
                </form>
            </div>
            {(data && data.invalidInputs) && (
                <ul className="m-auto w-[60vw]">
                    {data.valiErrors.map((err: any) => <li className="bg-red-300 p-2 rounded-md mb-2">{err.msg}</li>)}
                </ul>
            )}
            {(data && data.notSignedUp) && (
                <ul className="m-auto w-[60vw]"><li className="bg-red-300 p-2 rounded-md mb-2">{data.msg}</li></ul>
            )}
            {(data && data.sentEmail) && (
                <ul className="m-auto w-[60vw]"><li className="bg-green-300 p-2 rounded-md mb-2">{data.msg}</li></ul>
            )}
        </>
    )
}
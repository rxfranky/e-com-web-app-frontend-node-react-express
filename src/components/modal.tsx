import type { ReactNode } from "react";
import { useRef, memo, useEffect } from "react";

export default memo(function Modal({ children, showDialog }: { children: ReactNode; showDialog: boolean }) {
    const dialogRef = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        if (showDialog) {
            dialogRef.current?.showModal()
        } else {
            dialogRef.current?.close()
        }
    }, [showDialog])
    return (
        <>
            <dialog ref={dialogRef} className="">
                <div className="w-[50vw] h-[50vh] rounded-md border border-black flex items-center justify-center">
                    <p className="font-semibold text-xl text-center">{children}</p>
                </div>
            </dialog>
        </>
    )
})

// parent w-full h-full flex justify-center items-center bg-white/75  opacity-100
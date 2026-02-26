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
            <dialog ref={dialogRef}>
                <div className="w-[50vw] max-sm:w-[70vw] h-[50vh] max-sm:h-[32vh] rounded-md border border-bStoreCol flex items-center justify-center">
                    <p className="font-semibold text-xl text-center text-bStoreCol">{children}</p>
                </div>
            </dialog>
        </>
    )
})

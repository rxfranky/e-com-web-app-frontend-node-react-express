import { useRouteError } from "react-router"

export default function Error({ StatusCode, msg }: { StatusCode?: number; msg?: string }) {
    const err: any = useRouteError()
    return (
        <>
            <div>
                <p>Status Code- {err ? err.StatusCode : StatusCode}</p>
                <p>Message- {err ? err.message : msg}</p>
            </div>
        </>
    )
}
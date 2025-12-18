import type { JSX } from "react"
import Product from "../components/product"
import { useQuery } from "@tanstack/react-query"
import { fetchProducts } from "../util/http-requests"
import Error from "./error"
import { useSearchParams } from "react-router"
import Button from "../components/button"


type queRes = {
    data: any;
    error: any;
    isError: boolean;
    isPending: boolean
}

export default function Products(): JSX.Element {
    const [searchParams, setSearchParams] = useSearchParams()

    const { data, error, isPending, isError }: queRes = useQuery(
        {
            queryFn: ({ signal, queryKey }) => { return fetchProducts(signal, queryKey[0]) },
            queryKey: [searchParams.get('page')!]
        }
    )
    if (isError) {
        return <Error StatusCode={error.statusCode} msg={error.message} />
    }
    let content;
    if (isPending) {
        content = <p className="text-4xl text-center mt-12 tracking-wide">Loading...</p>
    }
    if (data && data.products) {
        content = (
            <>
                <div className="parent border-2 border-amber-400 w-fit lg:w-[85vw] m-auto mt-5 mb-7 rounded-md">
                    <span className="text-6xl font-semibold tracking-wide mt-7 inline-block ml-7">Products</span>
                    <div className="products p-7 lg:flex lg:flex-row flex flex-col md:grid md:grid-cols-2 items-center m-auto gap-4 justify-center">
                        {data.products.length === 0 && <p className="text-4xl text-center tracking-wide">Store is Empty</p>}
                        {data.products.map((product: any) => (
                            <Product key={product.id} id={product.id} price={product.price} imageSrc={product.image_src} title={product.title} btnTitle_1='Add to Cart' btnTitle_2="Buy Now" />
                        ))}
                    </div>
                    {data.products.length !== 0 && (
                        <div className="pagination  mb-5">
                            <div className="m-auto w-fit">
                                <Button
                                    disabled={searchParams.get('page') === '1'}
                                    onClick={() => {
                                        let cp = +searchParams.get('page')!
                                        cp--
                                        setSearchParams((val: any) => {
                                            val.set("page", `${cp}`)
                                            return val
                                        })
                                    }}
                                    className=" disabled:bg-gray-300 inline-block pl-2 pr-2 border border-amber-400 cursor-pointer"
                                >
                                    Prev
                                </Button>
                                <span className="p-2 underline">{data.isLastPage ? 'last page' : searchParams.get('page')}</span>
                                <Button
                                    disabled={data.isLastPage}
                                    onClick={() => {
                                        let cp = +searchParams.get('page')!
                                        cp++
                                        setSearchParams((val: any) => {
                                            val.set("page", `${cp}`)
                                            return val
                                        })
                                    }}
                                    className="disabled:bg-gray-300 inline-block pl-2 pr-2 border border-amber-400 cursor-pointer"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </>
        )
    }
    return (
        <>
            {content}
        </>
    )
}
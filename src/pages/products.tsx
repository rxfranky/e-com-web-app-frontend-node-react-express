import Product from "../components/product"
import type { JSX } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchProducts } from "../util/http-requests"
import Error from "./error"
import { useSearchParams } from "react-router"
import { useSelector, useDispatch } from 'react-redux'
import { handleShowHamberger as handleShowHambergerAction } from '../store/show/show-slice'
import { useEffect } from "react"


type queRes = {
    data: any;
    error: any;
    isError: boolean;
    isPending: boolean
}

export default function Products(): JSX.Element {
    const [searchParams, setSearchParams] = useSearchParams()
    const show = useSelector((state: any) => state.showStateChanger)
    const dispatch = useDispatch()

    useEffect(() => {
        if (show.showHamberger) {
            dispatch(handleShowHambergerAction(false))
        }
    }, [])

    const { data, error, isPending, isError }: queRes = useQuery(
        {
            queryFn: ({ signal, queryKey }) => { return fetchProducts(signal, queryKey[0]) },
            queryKey: [searchParams.get('page')!]
        }
    )

    let content;
    content = (
        <>
            <div id="parent" className="mt-10">
                <section id="txt">
                    <p className="text-2xl text-bStoreCol mb-3 text-center font-semibold">Our</p>
                    <p className="text-5xl max-sm:text-4xl tracking-wider text-bStoreCol text-center font-bold">BOOKSTORE</p>
                </section>
                <section id="main" className="mt-12">
                    <span className="text-2xl font-semibold ml-33 max-sm:ml-5 text-bStoreCol">All Products</span>
                    <div className="flex justify-center mt-8">
                        {data?.products.length === 0 ? (
                            <p className="text-4xl tracking-wide text-bStoreCol">Store is Empty</p>
                        ) : isPending ? (
                            <p className="text-4xl text-center tracking-wide text-bStoreCol">Loading...</p>
                        ) : isError ? (
                            <Error StatusCode={error.statusCode} msg={error.message} />
                        ) : (
                            <section
                                id="products"
                                className="grid grid-cols-4 max-sm:grid-cols-1 grid-rows-2 gap-10 max-md:grid-cols-2 max-lg:grid-cols-3"
                            >
                                {data?.products.map((product: any) => (
                                    <Product
                                        key={product.id}
                                        forProductsPage={true}
                                        id={product.id}
                                        price={product.price}
                                        imageSrc={product.image_src}
                                        title={product.title}
                                        btnTitle_1='Add to Cart' btnTitle_2="Buy Now"
                                    />
                                ))}
                            </section>)
                        }
                    </div>
                    {(data?.products.length !== 0 && !isPending && !isError) && (
                        <section id="pagination" className="flex justify-center items-center mt-6 text-bStoreCol">
                            <button
                                disabled={searchParams.get('page') === '1'}
                                onClick={() => {
                                    let cp = +searchParams.get('page')!
                                    cp--
                                    setSearchParams((val: any) => {
                                        val.set("page", `${cp}`)
                                        return val
                                    })
                                }}
                                className=" disabled:bg-bStoreCol/10 px-2 py-0.5 leading-none border border-bStoreCol cursor-pointer"
                            >
                                Prev
                            </button>
                            <span className="p-2 underline decoration-bStoreCol">{data?.isLastPage ? 'last page' : searchParams.get('page')}</span>
                            <button
                                disabled={data?.isLastPage}
                                onClick={() => {
                                    let cp = +searchParams.get('page')!
                                    cp++
                                    setSearchParams((val: any) => {
                                        val.set("page", `${cp}`)
                                        return val
                                    })
                                }}
                                className="disabled:bg-bStoreCol/10 px-2 py-0.5 leading-none border border-bStoreCol cursor-pointer"
                            >
                                Next
                            </button>
                        </section>
                    )}
                </section>
            </div>
        </>
    )
    return (
        <>
            {content}
        </>
    )
}
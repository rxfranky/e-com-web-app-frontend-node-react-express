import Product from "./product"
import { useQuery } from "@tanstack/react-query"
import { fetchProducts } from "../util/http-requests"
import Error from "../pages/error"
import { useState } from "react"

type queryRes = {
    data?: { isLastPage: boolean, products: any[] };
    isError: boolean;
    isPending: boolean;
    error: any
}

export default function BookSection({ atTop }: { atTop?: Boolean }) {
    const [sliceStart, setSliceStart] = useState<number>(0)
    const [sliceEnd, setSliceEnd] = useState<number>(initialSliceEnd)
    const [initial, setInitial] = useState<{ x?: number; y?: number; }>({ y: -30 })
    const [animate, setAnimate] = useState<{ x?: number; y?: number; }>({ y: 0 })

    const { data, isError, isPending, error }: queryRes = useQuery(
        {
            queryFn: ({ signal }) => fetchProducts(signal),
            queryKey: ['fetch-products']
        }
    )

    function initialSliceEnd(): number {
        console.log('is this running')
        if (window.outerWidth > 640 && window.outerWidth <= 768) {
            return 3
        }
        if (window.outerWidth > 768 && window.outerWidth <= 1024) {
            return 4
        }
        if (window.outerWidth > 1024 && window.outerWidth <= 1400) {
            return 5
        }
        if (window.outerWidth > 1400) {
            return 6
        }
        return 1
    }

    function handleLeftArrow() {
        if (sliceStart > 0) {
            setSliceStart(val => val - 1)
            setSliceEnd(val => val - 1)
            setInitial({ x: -25 })
            setAnimate({ x: 0 })
        }
    }

    function handleRightArrow() {
        if (sliceEnd < data!.products.length) {
            setSliceEnd(val => val + 1)
            setSliceStart(val => val + 1)
            setInitial({ x: 25 })
            setAnimate({ x: 0 })
        }
    }

    let content;
    content = (
        <>
            {
                data?.products.slice(sliceStart, sliceEnd).map((product) => (
                    <Product
                        btnTitle_1="Add to Cart"
                        id={product.id}
                        imageSrc={product.image_src}
                        price={product.price}
                        key={product.id}
                        title={product.title}
                        initial={initial}
                        animate={animate}
                    />)
                )
            }
        </>
    )
    return (
        <div id="bookSection" className={`flex gap-5 max-sm:gap-2 ${atTop && "absolute -top-23 max-sm:top-10"} `}>
            <span onClick={handleLeftArrow} className="mt-18 max-sm:mt-27 cursor-pointer">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" className="rN6xZT"><path fillRule="evenodd" d="M15.0729595,5 L15.7800663,5.70710678 L9.41020654,12.074 L15.7800663,18.4363861 L15.0729595,19.1434929 L7.99920654,12.077895 L8.00220654,12.074 L8,12.0717464 L15.0729595,5 Z"></path></svg>
            </span>
            <div id="products" className="flex gap-5">
                {isError ? (
                    <Error StatusCode={error.statusCode} msg={error.messge} />
                ) : isPending ? (
                    <p className="text-xl text-center tracking-wide">Loading...</p>
                ) : data?.products.length === 0 ? (
                    <p className="text-4xl tracking-wide">Store is Empty</p>
                ) :
                    content
                }
            </div>
            <span onClick={handleRightArrow} className="mt-18 max-sm:mt-27 cursor-pointer">
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" className="rN6xZT"><path fillRule="evenodd" d="M8.70710678,4.99810828 L15.068,11.3651083 L15.0722115,11.3620693 L15.7793183,12.0691761 L15.776,12.0721083 L15.7782433,12.0758831 L15.0711365,12.7829899 L15.069,12.7801083 L8.70710678,19.1434929 L8,18.4363861 L14.361,12.0721083 L8,5.70521506 L8.70710678,4.99810828 Z"></path></svg>
            </span>
        </div>
    )
}
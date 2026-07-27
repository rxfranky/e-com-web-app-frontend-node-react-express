import Product from "./product"
import { useQuery } from "@tanstack/react-query"
import { fetchProducts } from "../utils/http-requests"
import Error from "../pages/error"
import { Spinner } from "./ui/spinner"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'


type queryRes = {
    data?: { isLastPage: boolean, products: any[] };
    isError: boolean;
    isPending: boolean;
    error: any
}

export default function BookSection({ atTop }: { atTop?: Boolean }) {
    const { data, isError, isPending, error }: queryRes = useQuery(
        {
            queryFn: ({ signal }) => fetchProducts(signal),
            queryKey: ['fetch-products']
        }
    )

    let content;
    content = (data?.products.map((product) => (
        <CarouselItem key={product.id} className="basis-1/6 max-md:basis-1/3 max-sm:basis-11/12 max-sm:pl-8">
            <Product
                btnTitle_1="Add to Cart"
                id={product.id}
                imageSrc={product.image_src}
                price={product.price}
                key={product.id}
                title={product.title}
                desc={product.description}
            />
        </CarouselItem>)
    ))

    return (
        <div id="bookSection" className={`${atTop && "absolute -top-23 max-sm:top-10"} `}>
            <div id="products">
                {isError ? (
                    <Error StatusCode={error.statusCode} msg={error.message} />
                ) : isPending ? (
                    <Spinner className={`size-10 ${atTop ? 'text-bStoreCol max-sm:text-white' : 'text-white'}`} />
                ) : data?.products.length === 0 ? (
                    <p className={`text-4xl tracking-wide ${atTop ? 'text-bStoreCol' : 'text-white'}`}>Store is Empty</p>
                ) :
                    <Carousel className="max-w-277 w-full max-sm:max-w-75.5 max-md:max-w-136 max-sm:ml-6">
                        <CarouselContent className="max-sm:-ml-8">
                            {content}
                        </CarouselContent>
                        <CarouselPrevious className={`mt-18 text-bStoreCol max-sm:mt-27 cursor-pointer ${(atTop && window.outerWidth > 640) && 'bg-bStoreCol text-white'}`} />
                        <CarouselNext className={`mt-18 text-bStoreCol max-sm:mt-27 cursor-pointer ${(atTop && window.outerWidth > 640) && 'bg-bStoreCol text-white'} max-sm:mr-6.5`} />
                    </Carousel>
                }
            </div>
        </div>
    )
}
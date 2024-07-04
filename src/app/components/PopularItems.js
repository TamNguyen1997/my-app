"use client"

import { Spinner } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 10
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2
  }
}

const getPrice = (product) => {
  if (!product.saleDetails?.length) return <></>

  if (product.saleDetails.length === 1) return <>{product.saleDetails[0].price.toLocaleString()}</>

  return <>{product.saleDetails[0].price.toLocaleString()} - {product.saleDetails[product.saleDetails.length - 1].price.toLocaleString()} </>
}

export default function PopularItems() {

  const [products, setProducts] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/most-bought").then(res => res.json()).then(setProducts).then(() => setIsLoading(false))
  }, [])

  if (isLoading) return <Spinner className="m-auto" />

  if (!products.length) return <></>

  return (
    <div className="flex flex-col gap-11">
      <div>
        <ProductCard category="SẢN PHẨM NỔI BẬT" products={products} />
      </div>

      <div className="flex flex-col gap-3">
        <img src="/gallery/banner/Rubbermaid-banner.jpg" />
        <ProductCard category="RUBBERMAID" products={products} />
      </div>

      <div className="flex flex-col gap-3">
        <img src="/gallery/banner/Rubbermaid-banner-2.jpg" />
        <ProductCard category="MOERMAN" products={products} />
      </div>

      <div className="flex flex-col gap-3">
        <img src="/gallery/banner/Rubbermaid-banner-3.jpg" />
        <ProductCard category="MAPA" products={products} />
      </div>

      <div className="flex flex-col gap-3">
        <img src="/gallery/banner/Rubbermaid-banner-4.jpg" />
        <ProductCard category="GHIBLI & WIRBEL" products={products} />
      </div>

      <div className="flex flex-col gap-3">
        <img src="/gallery/banner/Rubbermaid-banner-5.jpg" />
        <ProductCard category="KIMBERLY" products={products} />
      </div>
    </div>
  );
}

const ProductCard = ({ category, products, redirect }) => {
  return (
    <div>
      <section className="rounded-tr-[50px] rounded-tl-[50px]">
        <div className="bg-[#ffd300] rounded-tr-[50px] rounded-bl-[50px] flex items-center w-1/3 h-[50px] m-auto shadow-md">
          <div className="m-auto text-black font-bold text-xl">
            {category}
          </div>
          {
            redirect ? <div className="bg-black text-white rounded-tr-[42px] rounded-bl-[42px] text-md font-bold italic flex items-center w-[15%] min-w-[100px]">
              <Link href={redirect} className="m-auto">Xem thêm</Link>
            </div> : <></>
          }

        </div>
        <div className="mx-auto lg:max-w-full">
          <ProductCarousel products={products} responsive={responsive}></ProductCarousel>
        </div>
      </section>
    </div>
  )
}

const ProductCarousel = ({ products, responsive }) => {
  return (<>
    <Carousel responsive={responsive} infinite>
      {
        products.map((product) => {
          return <div key={product.id} className="p-2">
            <div className="rounded-md border h-[400px] object-cover object-center group-hover:opacity-50 p-2 hover:-translate-y-2.5 hover:scale-[1.02] shadow-[0px_2px_10px_rgba(0,0,0,0.15)] hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15)]">
              <Link href={`/san-pham/${product.slug}`}>
                <div className="h-2/3">
                  <div className="aspect-h-1 aspect-w-1 w-full h-full overflow-hidden rounded-lg  xl:aspect-h-8 xl:aspect-w-7">
                    <img
                      width={500}
                      height={400}
                      src={`${process.env.NEXT_PUBLIC_FILE_PATH + product.image?.path}`}
                      alt={product.imageAlt}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-gray-700 font-semibold text-center">
                    {product.name}
                  </p>
                </div>
                <div className="absolute inset-x-0 bottom-3">
                  <p className="text-center text-red-500 font-bold text-xl pt-3">
                    {
                      getPrice(product)
                    }
                  </p>
                  <p className="text-center text-md line-through text-gray-500">
                    {
                      getPrice(product)
                    }
                  </p>
                </div>
              </Link>
            </div>
          </div>
        })
      }
    </Carousel>
  </>)
}

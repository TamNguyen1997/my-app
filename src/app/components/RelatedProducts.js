"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const RelatedProducts = ({ productId }) => {
  if (!productId) return <></>

  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch(`/api/products/${productId}/related`).then(res => res.json()).then(json => setProducts(json))
  }, [])

  return (<>
    <div className="pt-6">
      <div className="mx-auto">
        <div className="mx-auto lg:max-w-full">
          <div className=" grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6">
            {
              products.map((product) => {
                return <Link key={product.id} href={`/products/${product.id}`} className="group">
                  <div className="aspect-h-1 aspect-w-1 w-full  md:h-5/6 overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                    <Image
                      width={500}
                      height={400}
                      src={`${product.image ? product.image?.path : ""}`}
                      alt={product.imageAlt}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700">
                    {product.name}
                  </h3>
                </Link>
              })
            }
          </div>
        </div>
      </div>
    </div>
  </>)
}

export default RelatedProducts

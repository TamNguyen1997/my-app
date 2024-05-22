"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PopularItems() {

  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch("/api/popular-products").then(res => res.json()).then(setProducts)
  }, [])

  if (!products.length) return <></>
  
  return (
    <div>
      <div className="text-2xl font-bold text-center mt-10 mb-10">
        Sản phẩm bán chạy
      </div>
      <div className="bg-white mx-auto w-6/12">
        <div className="mx-auto lg:max-w-full">
          <div className=" grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6">
            {
              products.map((product) => {
                return <Link key={product.id} href={`/products/${product.id}`} className="group">
                  <div className="aspect-h-1 aspect-w-1 w-full  md:h-5/6 overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                    <Image
                      width={500}
                      height={400}
                      src={product.imageUrl}
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
  );
}

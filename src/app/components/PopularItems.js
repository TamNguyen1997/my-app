"use client"

import { Button } from "@nextui-org/react";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PopularItems() {

  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch("/api/most-bought").then(res => res.json()).then(setProducts)
  }, [])

  if (!products.length) return <></>

  return (
    <div>
      <div className="text-2xl font-bold text-center mt-10 mb-10">
        Sản phẩm bán chạy
      </div>
      <div className="bg-white mx-auto w-[60%]">
        <div className="mx-auto lg:max-w-full">
          <div className=" grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6">
            {
              products.map((product) => {
                return <div key={product.id} className="rounded-md border">
                  <div className="p-2 flex flex-col items-center justify-center">
                    <div className="min-h-[350px]">
                      <Link href={`/products/${product.id}`} className="group">
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
                    </div>
                    <div className="flex pb-3 inset-x-0 bottom-0">
                      <div className="pr-3 min-w-1/2">
                        <Button color="primary" fullWidth radius="full">Mua ngay</Button>
                      </div>
                      <div className="min-w-1/2">
                        <Button color="primary" fullWidth radius="full">Giỏ hàng</Button>
                      </div>
                    </div>
                  </div>
                </div>

              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}

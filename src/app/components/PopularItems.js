"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import "./PopularItems.css"

export default function PopularItems() {

  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch("/api/most-bought").then(res => res.json()).then(setProducts)
  }, [])

  if (!products.length) return <></>
  console.log(products)
  return (
    <div>
      <div className="text-2xl font-bold text-center mt-10 mb-5">
        Sản phẩm bán chạy
      </div>
      <ProductCard category="RUBBERMAID" products={products} redirect="/category/Rubbermaid" />
      <ProductCard category="GHIBLI" products={products} redirect="/category/Ghibli" />
      <ProductCard category="MOERMAN" products={products} redirect="/category/Moerman" />
      <ProductCard category="MAPA" products={products} redirect="/category/Mapa" />
      <ProductCard category="BÁN CHẠY" products={products} redirect="/" />
    </div>
  );
}

const ProductCard = ({ category, products, redirect }) => {
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

  return (
    <div className="p-3">
      <div>
        <section className="mx-auto w-[70%] border rounded-sm saoviet-section-header bg-white">
          <div className="bg-black h-[60px] saoviet-section-header flex flex-row">
            <div className="text-xl text-white p-3 pt-4 pl-10 font-extrabold w-[85%]">
              {category}
            </div>
            <div className="bg-[#ffd300] saoviet-btn text-md font-bold italic flex items-center w-[15%] min-w-[100px]">
              <Link href={redirect} className="m-auto">Xem thêm</Link>
            </div>
          </div>
          <div className="mx-auto lg:max-w-full p-3">
            <Carousel responsive={responsive}>
              {
                products.map((product) => {
                  return <div key={product.id} className="p-1 h-">
                    <div className="rounded-md border h-[350px]">
                      <div className="p-2 flex flex-col items-center justify-center">
                        <div className="min-h-[200px]">
                          <Link href={`/products/${product.id}`} className="group">
                            <div className="aspect-h-1 aspect-w-1 w-full  md:h-5/6 overflow-hidden rounded-lg  xl:aspect-h-8 xl:aspect-w-7">
                              <Image
                                width={500}
                                height={400}
                                src={product.imageUrl}
                                alt={product.imageAlt}
                                className="h-full w-full object-cover object-center group-hover:opacity-75"
                              />
                            </div>
                            <p className="mt-4 text-sm text-gray-700 font-semibold text-center">
                              {product.name}
                            </p>
                            <p className="text-center text-red-500 font-bold text-xl pt-3">
                              {
                                (Math.random() * 1000000).toLocaleString()
                              }
                            </p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                })
              }
            </Carousel>
          </div>
        </section>
      </div>
    </div>
  )
}

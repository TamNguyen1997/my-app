"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@nextui-org/react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const RelatedProducts = ({ productId }) => {
  if (!productId) return <></>

  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch(`/api/products/${productId}/related`).then(res => res.json()).then(json => setProducts(json))
  }, [])

  return (<>
    {/* <div className="pt-6">
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
                      src={`/gallery/${product.imageUrl}`}
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
    </div> */}
    <div className="relative">
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        centerMode={false}
        className=""
        containerClass={`
          [&>button]:invert [&>button]:rounded-none pb-10
          [&_li]:pr-[30px]
        `}
        dotListClass={`
          [&_li]:px-0.5
          [&_li]:flex
          [&_li]:items-center
          [&_button]:w-3
          [&_button]:h-3
          [&_button]:min-w-3
          [&_button]:min-h-3  
          [&_button]:!border-black
          [&_button]:!border-[1px]
          [&>.react-multi-carousel-dot--active>button]:w-4
          [&>.react-multi-carousel-dot--active>button]:h-4
          [&>.react-multi-carousel-dot--active>button]:min-w-4
          [&>.react-multi-carousel-dot--active>button]:min-h-4
          transition
        `}
        draggable={false}
        focusOnSelect={false}
        infinite={false}
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={{
          desktop: {
            breakpoint: {
              max: 3000,
              min: 1024
            },
            items: 4,
            partialVisibilityGutter: 40
          },
          mobile: {
            breakpoint: {
              max: 464,
              min: 0
            },
            items: 1,
            partialVisibilityGutter: 30
          },
          tablet: {
            breakpoint: {
              max: 1024,
              min: 464
            },
            items: 2,
            partialVisibilityGutter: 30
          }
        }}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        {
          products.map((product) => {
            return <Link key={product.id} href={`/products/${product.id}`} className="group p-4">
              <div className="relative pb-[100%] mb-3">
                <img src="/gallery/3.jpg" className="absolute inset-0 w-full h-full object-cover group-hover:opacity-75 transition" />
                <Heart size="24" className="absolute top-4 left-4" />
              </div>
              <p className="text-sm">Chăm sóc và vệ sinh xe</p>
              <h3 className="text-sm font-bold mb-4">
                {product.name}
              </h3>
              <p className="text-xs font-medium line-through mb-4">160.000 ₫</p>
              <p className="text-xs font-medium text-[#b61a2d] mb-4">160.000 ₫</p>
              <Button className="text-sm font-bold uppercase bg-gradient-to-b from-[#ffed00] to-[#fff466] rounded-none w-full h-[45px] border border-[#e3e3e3] mb-2.5">
                <ShoppingCart size="20" className="mr-1" />
                Thêm vào giỏ hàng
              </Button>
            </Link>
          })
        }
      </Carousel>
    </div>
  </>)
}

export default RelatedProducts

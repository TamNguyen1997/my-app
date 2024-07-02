"use client"

import { Button, Spinner } from "@nextui-org/react";
import Image from "next/image";
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

const brandDescription = {
  "KIMMBERLY": {
    logo: "/brand/Logo-Kimberly-Clark.png",
    description: "KIMMBERLY"
  },
  "RUBBERMAID": {
    logo: "/brand/Rubbermaid.png",
    description: "Với đội ngũ nhân viên tư vấn nhiệt tình, nhanh nhẹn, được đào tạo bài bản; sản phẩm nhập khẩu chất lượng cao, chế độ hậu mãi, bảo hành uy tín cùng với bề dày kinh nghiệm hoạt động lâu năm trong lĩnh vực vệ sinh công nghiệp."
  },
  "MAPA": {
    logo: "/brand/Logo-Mapa.png",
    description: "MAPA"
  },
  "MOERMAN": {
    logo: "/brand/Logo-Moerman.png",
    description: "MOERMAN"
  },
  "GHIBLI & WIRBEL": {
    logo: "/brand/Logo-Ghibli.png",
    description: "GHIBLI & WIRBEL"
  }
}

export default function PopularItems() {

  const [products, setProducts] = useState([])
  const [selectedBrand, setSelectedBrand] = useState("RUBBERMAID")

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/most-bought").then(res => res.json()).then(setProducts).then(() => setIsLoading(false))
  }, [])

  if (isLoading) return <Spinner className="m-auto" />

  if (!products.length) return <></>

  const getSelectedColor = (value) => {
    return selectedBrand === value ? "bg-slate-700" : "bg-black"
  }
  return (
    <div>
      <div className="pt-[35px]">
        <ProductCard category="SẢN PHẨM BÁN CHẠY" products={products} redirect="/category/Rubbermaid" />
      </div>
      <div className="pt-[35px]">
        <ProductCard category="SẢN PHẨM MỚI NHẤT" products={products} redirect="/category/Ghibli" />
      </div>

      <div className="pt-[60px]">
        <div className="bg-[#ffd300] rounded-tr-[50px] rounded-bl-[50px] flex items-center w-1/3 h-[50px] m-auto shadow-md">
          <span className="m-auto text-black font-bold text-xl">THƯƠNG HIỆU NỔI BẬT</span>
        </div>
      </div>

      <div className="pt-2">
        <div className="bg-black grid grid-cols-5">
          <Button radius="none"
            onClick={() => setSelectedBrand("RUBBERMAID")}
            className={`${getSelectedColor("RUBBERMAID")} text-white text-medium font-bold hover:bg-slate-800`}>
            RUBBERMAID
          </Button>
          <Button radius="none"
            onClick={() => setSelectedBrand("MOERMAN")}
            className={`${getSelectedColor("MOERMAN")} text-white text-medium font-bold hover:bg-slate-800`}>
            MOERMAN
          </Button>
          <Button radius="none"
            onClick={() => setSelectedBrand("MAPA")}
            className={`${getSelectedColor("MAPA")} text-white text-medium font-bold hover:bg-slate-800`}>
            MAPA
          </Button>
          <Button radius="none"
            onClick={() => setSelectedBrand("GHIBLI & WIRBEL")}
            className={`${getSelectedColor("GHIBLI & WIRBEL")} text-white text-medium font-bold hover:bg-slate-800`}>
            GHIBLI & WIRBEL
          </Button>
          <Button radius="none"
            onClick={() => setSelectedBrand("KIMMBERLY")}
            className={`${getSelectedColor("KIMMBERLY")} text-white text-medium font-bold hover:bg-slate-800`}>
            KIMMBERLY
          </Button>
        </div>

        <PopularBrandCard products={products} selectedBrand={selectedBrand}></PopularBrandCard>

        <Link
          href="/"
          className="flex items-center w-1/3 h-[50px] m-auto rounded-large border-medium border-slate-950 hover:opacity-30">
          <span className="m-auto text-black">
            Xem tất cả sản phẩm
          </span>
        </Link>
      </div>
    </div>
  );
}

const ProductCard = ({ category, products, redirect }) => {
  return (
    <div>
      <section className="rounded-tr-[50px] rounded-tl-[50px]">
        <div className="bg-[#ffd300] h-[60px] rounded-tr-[50px] rounded-tl-[50px] flex flex-row shadow-md">
          <div className="text-xl text-black p-3 pl-10 font-extrabold w-[85%]">
            {category}
          </div>
          <div className="bg-black text-white rounded-tr-[42px] rounded-bl-[42px] text-md font-bold italic flex items-center w-[15%] min-w-[100px]">
            <Link href={redirect} className="m-auto">Xem thêm</Link>
          </div>
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
            <div className="rounded-md border h-[400px] shadow-md p-2">
              <Link href={`/products/${product.id}`}>
                <div className="h-2/3">
                  <div className="aspect-h-1 aspect-w-1 w-full h-full overflow-hidden rounded-lg  xl:aspect-h-8 xl:aspect-w-7">
                    <Image
                      width={500}
                      height={400}
                      src={`${product.image?.path}`}
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
                      (10000000).toLocaleString()
                    }
                  </p>
                  <p className="text-center text-md line-through text-gray-500">
                    {
                      (10000000).toLocaleString()
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

const PopularBrandCard = ({ products, selectedBrand }) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
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

  return (<>
    <div className="grid grid-cols-6">
      <div className="p-2 col-span-2">
        <div className="bg-[#ffd300] shadow-lg rounded-md h-full pt-9">
          <div className="flex items-center w-2/3 m-auto h-[80px]">
            <div className="text-black font-bold text-xl">
              {
                brandDescription[selectedBrand] && brandDescription[selectedBrand].logo ?
                  <Image
                    width={400}
                    height={400}
                    src={brandDescription[selectedBrand].logo}
                  >
                  </Image> : null
              }
            </div>
          </div>

          <div className="text-black p-10 font-bold text-justify h-1/2">
            {
              brandDescription[selectedBrand] && brandDescription[selectedBrand].description
            }
          </div>
        </div>
      </div>
      <div className="col-span-4">
        <ProductCarousel products={products} responsive={responsive}></ProductCarousel>
      </div>
    </div>
  </>
  )
}

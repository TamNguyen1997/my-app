"use client"

import { Button, Spinner } from "@nextui-org/react";
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

const getPrice = (product) => {
  if (!product.saleDetails?.length) return <></>

  if (product.saleDetails.length === 1) return <>{product.saleDetails[0].price?.toLocaleString()}</>

  if (!product.saleDetails[0].price) return <>{product.saleDetails[product.saleDetails.length - 1].price.toLocaleString()}</>

  return <>{product.saleDetails[0].price?.toLocaleString()} - {product.saleDetails[product.saleDetails.length - 1].price?.toLocaleString()} </>
}

export default function PopularItems() {

  const [products, setProducts] = useState([])
  const [rubberMaidProducts, setRubberMaidProducts] = useState([])
  const [moermanProducts, setMoermanProducts] = useState([])
  const [mapaProducts, setMapaProducts] = useState([])
  const [ghibliProducts, setGhibleProducts] = useState([])
  const [selectedBrand, setSelectedBrand] = useState("RUBBERMAID")

  const [brandProducts, setBrandProducts] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/?size=${10}&page=${1}&highlight=true`).then(res => res.json()).then((value) => setProducts(value.result)).then(() => setIsLoading(false)),
      fetch(`/api/categories/rubbermaid/products/`).then(res => res.json()),
      fetch(`/api/categories/moerman/products/`).then(res => res.json()),
      fetch(`/api/categories/mapa/products/`).then(res => res.json()),
      fetch(`/api/categories/ghibli/products/`).then(res => res.json()),
    ]).then(values => {
      setRubberMaidProducts(values[1].products)
      setMoermanProducts(values[2].products)
      setMapaProducts(values[3].products)
      setGhibleProducts(values[4].products)
      setBrandProducts(values[1].products)
    })
  }, [])

  if (isLoading) return <Spinner className="m-auto" />

  const getSelectedColor = (value) => {
    return selectedBrand === value ? "bg-slate-700" : "bg-black"
  }

  return (
    <div className="flex flex-col gap-11">
      <div>
        <ProductCard category="SẢN PHẨM NỔI BẬT" products={products} />
      </div>

      <div>
        <div className="bg-black grid grid-cols-4">
          <Button radius="none"
            onClick={() => {
              setSelectedBrand("RUBBERMAID")
              setBrandProducts(rubberMaidProducts)
            }}
            className={`${getSelectedColor("RUBBERMAID")} text-white text-medium font-bold hover:bg-slate-800`}>
            RUBBERMAID
          </Button>
          <Button radius="none"
            onClick={() => {
              setSelectedBrand("MOERMAN")
              setBrandProducts(moermanProducts)
            }}
            className={`${getSelectedColor("MOERMAN")} text-white text-medium font-bold hover:bg-slate-800`}>
            MOERMAN
          </Button>
          <Button radius="none"
            onClick={() => {
              setSelectedBrand("MAPA")
              setBrandProducts(mapaProducts)
            }}
            className={`${getSelectedColor("MAPA")} text-white text-medium font-bold hover:bg-slate-800`}>
            MAPA
          </Button>
          <Button radius="none"
            onClick={() => {
              setSelectedBrand("GHIBLI & WIRBEL")
              setBrandProducts(ghibliProducts)
            }}
            className={`${getSelectedColor("GHIBLI & WIRBEL")} text-white text-medium font-bold hover:bg-slate-800`}>
            GHIBLI & WIRBEL
          </Button>
        </div>

        <PopularBrandCard
          products={brandProducts}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand} />
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
                <div className="inset-x-0 bottom-3">
                  <p className="text-center text-red-500 font-bold text-xl pt-3">
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
                  <img
                    width={400}
                    height={400}
                    src={brandDescription[selectedBrand].logo}
                  /> : null
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

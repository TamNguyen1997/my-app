"use client"

import { Button, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import ProductCard from "@/components/product/ProductCard";

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
    items: 1
  }
}

const brandDescription = {
  "RUBBERMAID": {
    logo: "/brand/Rubbermaid.png",
    slug: "thuong-hieu-rubbermaid",
    description: `Rubbermaid (Newell Brands) thành lập năm 1920 tại Hoa Kỳ, đi đầu trong các sản phẩm gia dụng và công nghiệp làm từ nhựa, dụng cụ vệ sinh gia đình và công nghiệp chất lượng cao.`
  },
  "MAPA": {
    logo: "/brand/Logo-Mapa.png",
    slug: "thuong-hieu-mapa",
    description: "MAPA là nhà sản xuất găng tay bảo hộ. Định hướng tầm nhìn & sứ mệnh của nhà sản xuất là đảm bảo chất lượng, luôn đổi mới thay công nghệ để sản phẩm đạt hiệu quả sử dụng tốt nhất."
  },
  "MOERMAN": {
    logo: "/brand/Logo-Moerman.png",
    slug: "thuong-hieu-moerman",
    description: `Moerman thành lập từ năm 1885 tại Bỉ - 
    một trong bốn hãng sản xuất lưỡi gạt cao su chất lượng nhất thế giới.
    Chuyên cung cấp các dụng cụ vệ sinh kính chuyên dụng, được đánh giá cao về chất lượng, hiệu quả và tính an toàn, 
    được tin tưởng sử dụng rộng rãi tại nhiều quốc gia.`
  },
  "GHIBLI & WIRBEL": {
    logo: "/brand/Logo-Ghibli.png",
    slug: "thuong-hieu-ghibli",
    description: `Ghibli & Wirbel - thành lập năm 1968, chuyên cung cấp máy móc, thiết bị làm sạch tiên tiến từ Italy. 
    Đa dạng các dòng máy hiện đại, đáp ứng mọi không gian, từ gia đình đến nhà máy, xưởng sản xuất. 
    Sở hữu các công nghệ và tính năng độc quyền, nâng cấp không gian tại doanh nghiệp.
    Gồm các loại máy: hút bụi, chà sàn, đánh bóng, quét rác, giặt thảm.`

  }
}

export default function PopularItems() {

  const [products, setProducts] = useState([])
  const [rubberMaidProducts, setRubberMaidProducts] = useState([])
  const [moermanProducts, setMoermanProducts] = useState([])
  const [mapaProducts, setMapaProducts] = useState([])
  const [ghibliProducts, setGhibliProducts] = useState([])
  const [selectedBrand, setSelectedBrand] = useState("RUBBERMAID")

  const [brandProducts, setBrandProducts] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [highlightCates, setHighlightCates] = useState([])

  const [highlightProductsFromCates, setHighlightProductsFromCates] = useState({})

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/?size=${10}&page=${1}&highlight=true&active=true&productType=PRODUCT&includeCate=true`).then(res => res.json()).then((value) => setProducts(value.result)),
      fetch(`/api/brands/thuong-hieu-rubbermaid/products/?active=true`).then(res => res.json()).then(json => {
        setRubberMaidProducts(json.products)
        setBrandProducts(json.products)
      }),
      fetch(`/api/brands/thuong-hieu-moerman/products/?active=true`).then(res => res.json()).then(json => setMoermanProducts(json.products)),
      fetch(`/api/brands/thuong-hieu-mapa/products/?active=true`).then(res => res.json()).then(json => setMapaProducts(json.products)),
      fetch(`/api/brands/thuong-hieu-ghibli/products/?active=true`).then(res => res.json()).then(json => setGhibliProducts(json.products)),
      fetch(`/api/categories/?highlight=true&size=3&page=1&includeImage=true`).then(res => res.json()).then(json => setHighlightCates(json.result)),
    ]).then(() => {
      setIsLoading(false)
    })
  }, [])
  useEffect(() => {
    Promise.all(
      highlightCates
        .map(cate => fetch(`/api/products/?size=${10}&page=${1}&categoryId=${cate.id}&active=true&productType=PRODUCT&includeCate=true`)
          .then(res => res.json())
          .then(json => json.result))
    ).then(value => {
      setHighlightProductsFromCates(Object.groupBy(value.flat(), item => item.category.slug))
    })
  }, [highlightCates])

  if (isLoading) return <Spinner className="m-auto" />

  const getSelectedColor = (value) => {
    return selectedBrand === value ? "bg-slate-700" : "bg-black"
  }

  return (
    <div className="flex flex-col gap-11">
      <div>
        <ProductCards category="SẢN PHẨM NỔI BẬT" products={products} />
      </div>

      <div>
        <div className="bg-black grid grid-cols-4">
          <Button radius="none"
            onClick={() => {
              setSelectedBrand("RUBBERMAID")
              setBrandProducts(rubberMaidProducts)
            }}
            className={`${getSelectedColor("RUBBERMAID")} text-white text-medium font-bold hover:bg-slate-800 border-r border-white`}>
            RUBBERMAID
          </Button>
          <Button radius="none"
            onClick={() => {
              setSelectedBrand("MOERMAN")
              setBrandProducts(moermanProducts)
            }}
            className={`${getSelectedColor("MOERMAN")} text-white text-medium font-bold hover:bg-slate-800 border-r border-white`}>
            MOERMAN
          </Button>
          <Button radius="none"
            onClick={() => {
              setSelectedBrand("MAPA")
              setBrandProducts(mapaProducts)
            }}
            className={`${getSelectedColor("MAPA")} text-white text-medium font-bold hover:bg-slate-800 border-r border-white`}>
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

      {
        Object.keys(highlightProductsFromCates).length ? highlightCates.filter(cate => highlightProductsFromCates[cate.slug]).map((cate, i) => {
          return <div key={i}>
            <ProductCards banner={cate.image?.path} products={highlightProductsFromCates[cate.slug]} />
            <div className="w-full flex flex-row min-w-screen justify-center items-center">
              <Link href={`/${cate.slug}`} className="font-bold underline">Xem thêm</Link>
            </div>
          </div>
        }
        ) : <></>
      }

    </div>
  );
}


const ProductCards = ({ category, products, redirect, banner }) => {
  const CategoryDisplay = () => (<>
    <div className="bg-[#ffd300] rounded-tr-[50px] rounded-bl-[50px] flex items-center w-1/3 h-[50px] m-auto shadow-md">
      <div className="m-auto text-black font-bold text-xl">
        {category || products[0].category?.name}
      </div>
      {
        redirect ?
          <div className="bg-black text-white rounded-tr-[42px] rounded-bl-[42px] text-md font-bold italic flex items-center w-[15%] min-w-[100px]">
            <Link href={redirect} className="m-auto">Xem thêm</Link>
          </div> : ""
      }
    </div>
  </>)

  const BannerDisplay = () => (<div className="w-full">
    <img style={{ maxWidth: "100%", width: "100%" }} src={`${process.env.NEXT_PUBLIC_FILE_PATH + banner}`} alt="Banner" />
  </div>)
  return (
    <div>
      <section className="rounded-tr-[50px] rounded-tl-[50px]">
        {
          banner ?
            <BannerDisplay /> :
            <CategoryDisplay />
        }
        <div className="mx-auto lg:max-w-full">
          <ProductCarousel products={products} responsive={responsive}></ProductCarousel>
        </div>
      </section>
    </div>
  )
}

const ProductCarousel = ({ products, responsive }) => {
  return (<>
    <Carousel responsive={responsive} infinite
      className="[&_.react-multi-carousel-track]:pt-2"
    >
      {
        products.map((product) => {
          return <div key={product.id} className="h-full p-2 hover:opacity-75">
            <ProductCard product={product} />
          </div>
        })
      }
    </Carousel>
  </>)
}

const PopularBrandCard = ({ products, selectedBrand }) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1281 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1281, min: 464 },
      items: 3
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2
    }
  }

  return (<>
    <div className="lg:grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-6">
      <div className="p-2 col-span-2">
        <div className="bg-[#ffd300] shadow-lg rounded-md pt-9 min-h-[300px]">
          <div className="flex items-center mx-auto md:max-w-[340px] md:h-[120px] lg:max-w-2/3 lg:h-[120px] p-5 pt-0">
            {
              brandDescription[selectedBrand] && brandDescription[selectedBrand].logo ?
                <img
                  className="mx-auto max-h-full"
                  src={brandDescription[selectedBrand].logo}
                /> : null
            }
          </div>

          <div className="px-10 font-bold text-justify h-[100px] overflow-auto">
            {
              brandDescription[selectedBrand] && brandDescription[selectedBrand].description
            }
          </div>
          <div className="flex justify-center items-center">
            <Link
              href={`/${brandDescription[selectedBrand].slug}`}
              className="border border-black font-bold hover:bg-[#FFAC0A] hover:text-white hover:border-transparent transition rounded-full px-3 py-1 my-2.5"
            >
              Xem thêm
            </Link>
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

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
    description: `Newell Rubbermaid, thành lập năm 1903 tại Thành phố Atlanta, tiểu bang Georgia, Hoa Kỳ. Thương hiệu Rubbermaid Commercial Products, 
    tiên phong trong các giải pháp vệ sinh, tạo ra các sản phẩm ưu việt, được người dùng tin tưởng lựa chọn.`
  },
  "MAPA": {
    logo: "/brand/Logo-Mapa.png",
    slug: "thuong-hieu-mapa",
    description: `Từ khi chiếc găng tay nhung đầu tiên được sản xuất năm 1957, 
    lịch sử của Mapa Professional luôn định hướng với một tầm nhìn: bảo vệ sức khỏe nhân viên, đảm bảo môi trường làm việc sạch sẽ, an toàn & lành mạnh.`
  },
  "KLEEN-TEX": {
    logo: "/brand/Logo-Mapa.png",
    slug: "thuong-hieu-kleen-tex",
    description: `Hơn 50 năm phát triển, Kleen-Tex cung cấp loạt giải pháp về thảm, mang đến trải nghiệm tuyệt vời trong từng bước chân. 
    Thảm trải lối ra vào, logo nhiều màu, chống mỏi hay bất kỳ loại thảm cho ngành công nghiệp.`
  },
  "MOERMAN": {
    logo: "/brand/Logo-Moerman.png",
    slug: "thuong-hieu-moerman",
    description: `Được thành lập năm 1885 - suốt chiều dài lịch sử - đến nay dụng cụ vệ sinh sàn, 
    kính Moerman vẫn được duy trì như thương hiệu nổi tiếng vốn có của nó. 
    Moerman, dụng cụ vệ sinh kính nổi tiếng toàn cầu.`
  },
  "KIMBERLY-CLARK PROFESSIONAL": {
    logo: "/brand/Logo-Moerman.png",
    slug: "thuong-hieu-kimberly-clark",
    description: `Kimberly-Clark Corporation - tập đoàn chuyên sản xuất hàng hóa tiêu dùng, đặc biệt là các sản phẩm về Giấy. 
    Thành lập năm 1872 với hơn 140 năm hoạt động, khăn giấy cao cấp Kimberly-Clark luôn là tiện ích cho mọi gia đình.`
  },
  "GHIBLI & WIRBEL": {
    logo: "/brand/Logo-Ghibli.png",
    slug: "thuong-hieu-ghibli",
    description: `Ghibli & Wirbel, nhà sản xuất thiết bị làm sạch thành lập năm 1968 tại Ý. 
    Với hơn 50 năm kinh nghiệm, Ghibli & Wirbel giờ đây đã là Công ty hàng đầu trong lĩnh vực máy móc làm vệ sinh tại Châu Âu.`

  }
}

export default function PopularItems() {

  const [products, setProducts] = useState([])
  const [rubberMaidProducts, setRubberMaidProducts] = useState([])
  const [moermanProducts, setMoermanProducts] = useState([])
  const [mapaProducts, setMapaProducts] = useState([])
  const [ghibliProducts, setGhibliProducts] = useState([])
  const [kleenTexProducts, setKleenTexProducts] = useState([])
  const [kimberlyProducts, setKimberlyProducts] = useState([])
  const [selectedBrand, setSelectedBrand] = useState("GHIBLI & WIRBEL")

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
      fetch(`/api/brands/thuong-hieu-kimberly-clark/products/?active=true`).then(res => res.json()).then(json => setKimberlyProducts(json.products)),
      fetch(`/api/brands/thuong-hieu-kleen-tex/products/?active=true`).then(res => res.json()).then(json => setKleenTexProducts(json.products)),
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
      <ProductCards category="SẢN PHẨM NỔI BẬT" products={products} />

      <div>
        <div className="bg-black grid lg:grid-cols-6 sm:grid-cols-3">
          <Button radius="none"
            onClick={() => {
              setSelectedBrand("GHIBLI & WIRBEL")
              setBrandProducts(ghibliProducts)
            }}
            className={`${getSelectedColor("GHIBLI & WIRBEL")} text-white text-medium font-bold border-r hover:bg-slate-800`}>
            GHIBLI & WIRBEL
          </Button>
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
              setSelectedBrand("KIMBERLY-CLARK PROFESSIONAL")
              setBrandProducts(kimberlyProducts)
            }}
            className={`${getSelectedColor("KIMBERLY-CLARK PROFESSIONAL")} text-white text-medium font-bold hover:bg-slate-800 border-r border-white`}>
            KIMBERLY-CLARK
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
              setSelectedBrand("KLEEN-TEX")
              setBrandProducts(kleenTexProducts)
            }}
            className={`${getSelectedColor("KLEEN-TEX")} text-white text-medium font-bold hover:bg-slate-800 border-r border-white`}>
            KLEEN-TEX
          </Button>
          <Button radius="none"
            onClick={() => {
              setSelectedBrand("MAPA")
              setBrandProducts(mapaProducts)
            }}
            className={`${getSelectedColor("MAPA")} text-white text-medium font-bold hover:bg-slate-800 border-r border-white`}>
            MAPA
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
            <Link
              href={`/${cate.slug}`}
              className="flex justify-center items-center text-[#153f17] font-semibold w-[181px] 
              h-[43px] rounded-[30px] border border-[#FFD400] hover:bg-[#ccefdc] transition mx-auto"
              onClick={() => setPage(page + 1)}
            >
              Xem thêm
            </Link>
          </div>
        }
        ) : <></>
      }

    </div>
  );
}


const ProductCards = ({ category, products, redirect, banner }) => {
  const CategoryDisplay = () => (<>
    <div className="bg-[#FFD400] rounded-tr-[50px] rounded-bl-[50px] flex items-center w-2/3 md:w-1/3 h-[50px] m-auto shadow-md">
      <div className="m-auto text-black font-bold md:text-xl">
        {category || products[0].category?.name}
      </div>
      {
        redirect ?
          <Link
            href={redirect}
            className="flex justify-center items-center text-[#153f17] font-semibold w-[181px] 
              h-[43px] rounded-[30px] border border-[#FFD400] hover:bg-[#ccefdc] transition mx-auto"
            onClick={() => setPage(page + 1)}
          >
            Xem thêm
          </Link>
          : ""
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
      <div className="pt-2 col-span-2">
        <div className="bg-[#FFD400] shadow-lg rounded-md">
          <div className="flex mx-auto">
            {
              brandDescription[selectedBrand] && brandDescription[selectedBrand].logo ?
                <img
                  width={220}
                  className="mx-auto max-h-full"
                  src={brandDescription[selectedBrand].logo}
                /> : null
            }
          </div>

          <div className="px-5 text-justify h-[100px] overflow-auto scrollbar-hide">
            {
              brandDescription[selectedBrand] && brandDescription[selectedBrand].description
            }
          </div>
          <div className="flex justify-center items-center">
            <Link
              href={`/${brandDescription[selectedBrand].slug}`}
              className="flex justify-center items-center text-[#153f17] font-semibold w-[181px] 
              h-[43px] rounded-[30px] border border-[#FFD400] hover:bg-[#ccefdc] transition mx-auto"
              onClick={() => setPage(page + 1)}
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

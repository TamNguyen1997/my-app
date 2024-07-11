"use client"

import { Menu, Phone, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar"

const Header = () => {
  const [showSubHeader, setShowSubHeader] = useState(false)

  const [subCate, setSubCate] = useState([])
  const [hoveredCate, setHoveredCate] = useState({})

  return (
    <nav className="bg-black border-gray-200 dark:bg-gray-900 h-[140px]">
      <div className="w-full h-full">
        <div className="flex w-full h-full">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <Link href="/">
              <Image
                src="/favicon.svg"
                alt="favicon"
                width="78"
                height="30"
                className="bg-black h-[81px] w-[200px]"
              />
            </Link>
          </div>

          <div className="bg-[#ffd300] w-[75%] rounded-tl-[50px] rounded-bl-[50px] font-raleway">
            <div className="pl-[50px] h-full">
              <div className="h-1/2 p-3 flex gap-7">
                <div className="w-[1/4] flex items-center gap-5">
                  <SearchBar />
                  <div className="bg-[#FFAC0A] w-[150px] h-[40px] items-center text-center relative flex gap-2 rounded-md shadow-md">
                    <span className="pl-1">
                      <ShoppingCart size={24} strokeWidth={2}></ShoppingCart>
                    </span>
                    <span className="text-sm">
                      Giỏ hàng
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <div className="flex gap-10">
                    <div className="flex items-center gap-10">
                      <Link href="/tin-tuc">Tin tức</Link>
                      <Link href="/blog">Kiến thức hay</Link>
                    </div>
                    <div className="flex items-center gap-10">
                      <Link href="/">Liên hệ</Link>
                      <Link href="/">
                        <div className="flex gap-3 items-center">
                          <div>
                            <Phone></Phone>
                          </div>
                          <div className="text-lg font-bold">
                            090 380 2979
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-1/2 flex items-center gap-5 pt-6"
                onMouseOver={() => setShowSubHeader(true)}
                onMouseOut={() => { setShowSubHeader(false) }}>
                <div className="h-1/2 flex items-center gap-5">
                  <HeaderItems
                    onHover={() => setShowSubHeader(true)}
                    onMouseOut={() => {
                      setShowSubHeader(false)
                    }}
                    setSubCate={setSubCate}
                    setHoveredCate={setHoveredCate}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          showSubHeader && subCate.length ?
            <div
              onMouseOver={() => setShowSubHeader(true)}
              onMouseOut={() => setShowSubHeader(false)}
              className="z-10 bg-white fixed w-screen shadow-lg flex flex-row min-w-screen justify-center items-center py-4 gap-3">
              {
                subCate.map((subcate, i) =>
                  <Link
                    key={i}
                    href={
                      hoveredCate.slug ?
                        `/${hoveredCate.slug}/${subcate.slug}` :
                        `/${subcate.slug}`
                    }>
                    <span className="flex flex-col justify-center items-center hover:opacity-35 hover:shadow-lg" key={subcate.name}>
                      <div className="flex items-center w-2/3 m-auto h-[80px]">
                        {
                          subcate.imageUrl ? <img src={`${process.env.NEXT_PUBLIC_FILE_PATH + subcate.imageUrl}`} width="150" height="150" alt={i} /> : ""
                        }
                      </div>
                      {subcate.name}
                    </span>
                  </Link>
                )
              }
            </div> : ""
        }
      </div>
    </nav>
  )
};

const BRANDS = [
  {
    slug: "thuong-hieu-mapa",
    name: "Mapa",
    imageUrl: "/brand/Logo-Mapa.png"
  },
  {
    slug: "thuong-hieu-rubbermaid",
    name: "Rubbermaid",
    imageUrl: "/brand/Rubbermaid.png"
  },
  {
    slug: "thuong-hieu-moerman",
    name: "Moerman",
    imageUrl: "/brand/Logo-Moerman.png"
  },
  {
    slug: "thuong-hieu-ghibli",
    name: "Ghibli",
    imageUrl: "/brand/Logo-Ghibli.png"
  }
]

const HeaderItems = ({ onHover, onMouseOut, setSubCate, setHoveredCate }) => {
  // const [windowSize, setWindowSize] = useState({
  //   width: undefined,
  //   height: undefined,
  // })

  // useEffect(() => {
  //   function handleResize() {
  //     setWindowSize({
  //       width: window.innerWidth,
  //       height: window.innerHeight,
  //     })
  //   }
  //   window.addEventListener("resize", handleResize)
  //   handleResize()
  //   return () => window.removeEventListener("resize", handleResize)
  // }, [])

  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('/api/categories/?includeSubCate=true&size=7').then(res => res.json()).then(json => setCategories(json.result))
  }, [])

  // if (windowSize.width <= 1024) {

  // }

  return (<>
    <div className="flex gap-6 text-sm items-center">
      <Link href=""
        onMouseOver={() => {
          setSubCate(BRANDS)
          setHoveredCate({})
        }}
        onMouseOut={() => {
        }}>
        Thương hiệu
      </Link>
      {
        categories.map((category) =>
          <Link href={`/${category.slug}`}
            key={category.id}
            onMouseOver={() => {
              setSubCate(category.sub_category)
              onHover()
              setHoveredCate(category)
            }}
            onMouseOut={onMouseOut}>
            {category.name}
          </Link>)
      }
    </div>
  </>)
}

export default Header;

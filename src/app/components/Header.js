"use client"

import { Menu, Phone, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";

const Header = () => {
  return (
    <nav className="bg-black border-gray-200 dark:bg-gray-900 h-[140px]">
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
                <Input
                  isClearable
                  radius="lg"
                  placeholder="Tìm sản phẩm..."
                  aria-label="Search"
                  startContent={
                    <Search className="hover:opacity-hover" strokeWidth={3}></Search>
                  }
                />
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
                    <Link href="/">Tin tức</Link>
                    <Link href="/blog">Blog</Link>
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
            <div className="h-1/2 flex items-center gap-5">
              <div className="flex gap-1 rounded-lg shadow-md w-[121px] h-[45px] items-center text-center font-bold">
                <span className="pl-1">
                  <Menu />
                </span>
                <Button
                  variant="light">
                  Danh mục
                </Button>
              </div>
              <HeaderItems />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
};

const HeaderItems = () => {
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
    fetch('/api/categories/?type=CATEGORY').then(res => res.json()).then(setCategories)
  })

  // if (windowSize.width <= 1024) {

  // }

  return (<>
    <div className="flex gap-6 text-sm items-center">
      {
        categories.map((category) => <Link href={`/${category.slug}`}>{category.name}</Link>)
      }
    </div>
  </>)
}

export default Header;

"use client"
import { Menu, Phone, Search, ShoppingCart, Facebook, Youtube, Instagram } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";

const Header = () => {
  const [asideVisible, setAsideVisible] = useState(false);
  // const categories = [...Array(5)].map((_, index) => ({ id: index, slug: `category-${index}`, name: `Category ${index}` }));
  const [categories, setCategories] = useState([])
  useEffect(() => {
    fetch('/api/categories/?type=CATEGORY').then(res => res.json()).then(setCategories)
  }, [])

  return (
    <>
      <div>
        <div className="bg-[#f8f8f8] py-1">
          <div className="container flex items-center flex-wrap">
            <Link href="/">
              <Facebook size="16" color="#999" className="mr-2.5" />
            </Link>
            <Link href="/">
              <Youtube size="16" color="#999" className="mr-2.5" />
            </Link>
            <Link href="/">
              <Instagram size="16" color="#999" />
            </Link>
            <div className="w-[1px] h-[30px] bg-[#dfdfdf] mx-4"></div>
            <Link href="/" className="text-xs font-bold text-[#6b6b6b] mr-2.5">TIN TỨC</Link>
            <Link href="/" className="text-xs font-bold text-[#6b6b6b] mr-2.5">BLOG</Link>
            <Link href="/" className="text-xs font-bold text-[#6b6b6b] mr-2.5">LIÊN HỆ</Link>
            <Link href="/" className="flex items-center ml-auto">
              <Phone size="16" color="#999" className="mr-2.5" />
              <span className="text-sm font-bold text-[#6b6b6b]">090 380 2979</span>
            </Link>
          </div>
        </div>

        <div className="sm:bg-white bg-[#212020] py-5">
          <div className="w-full relative container flex sm:flex-row flex-col items-center flex-wrap">
            <Menu className="absolute top-2.5 left-2 cursor-pointer sm:hidden block" color="white" onClick={() => setAsideVisible(true)} />
            <Link href="/" className="mr-4">
              <Image
                src="/favicon.svg"
                alt="favicon"
                width="190"
                height="45"
                className="sm:max-w-[190px] max-w-[90px] sm:mb-0 mb-5"
              />
            </Link>
            <div className="w-full sm:w-auto flex items-center ml-auto">
              <Input
                placeholder="Search..."
                variant="underlined"
                endContent={
                  <Search className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                }
                className={`
                  sm:w-[395px]
                  sm:max-w-[395px]
                  ml-auto
                  sm:rounded-0
                  rounded-lg
                  [&_[data-slot='input-wrapper']]:min-h-[30px]
                  [&_[data-slot='input-wrapper']]:h-[30px]
                  sm:[&_[data-slot='input-wrapper']]:border-b
                  sm:[&_[data-slot='input-wrapper']]:shadow-none
                  [&_[data-slot='input-wrapper']]:bg-white
                  [&_[data-slot='inner-wrapper']]:!pb-0
                  [&_[data-slot='inner-wrapper']]:px-2
                  [&_svg]:max-w-5
                  overflow-hidden
                `}
              />
              <Link href="/" className="sm:block hidden ml-4">
                <ShoppingCart color="#6b6b6b" />
              </Link>
            </div>
          </div>
        </div>

      </div>
      <nav className="sticky top-0 sm:block hidden">
        <HeaderItems categories={categories} />
      </nav>

      <aside className={`
        fixed top-0 left-0 w-full h-screen flex translate-x-[-100%] transition sm:hidden
        ${asideVisible ? 'translate-x-0': 'translate-x-[-100%]'}
      `}>
        <div className="w-3/4 h-full flex flex-col bg-white shadow overflow-auto py-5">
            {
              categories.map((category) => {
                return (<Link
                  href={`/${category.slug}`} key={category.id}
                  className="border-b py-3 px-5"
                  onClick={() => setAsideVisible(false)}
                >
                  {category.name}
                </Link>)
              })
            }
        </div>
        <div className="w-1/4 h-full cursor-pointer" onClick={() => setAsideVisible(false)}></div>
      </aside>
    </>
  )
};

const HeaderItems = ({ categories }) => {
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

  // if (windowSize.width <= 1024) {

  // }

  return (
    <div className="bg-gradient-to-b from-[rgba(183,31,45,0.97)] to-[#761019]">
      <div className="relative container flex text-sm items-center">
        {
          categories.map((category) => (
            <Link
              href={`/${category.slug}`} key={category.id}
              className={`
                font-bold
                text-white
                border-l border-[#8F261B]
                first:border-l-0
                text-center
                break-words
                grow
                hover:bg-[#ec1c24]
                transition
                group p-5
              `}
            >
              {category.name}
              <div
                className={`
                  absolute top-[100%] left-0 container bg-white border p-5
                  opacity-0
                  max-h-0
                  group-hover:opacity-100
                  group-hover:max-h-[unset]
                  overflow-hidden
                  transition
                  menu
                `}
              >
                <h2 className="text-lg font-bold text-black text-left border-b pb-1">HORECA Equipment</h2>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
                  {
                    [...Array(7)].map((_, index) => {
                      return (
                        <Link href="/" className="flex flex-col items-center hover:opacity-75 transition pt-5" key={index}>
                          <Image
                            src="/gallery/3.jpg"
                            alt=""
                            width="120"
                            height="120"
                            className="mb-5"
                          />
                          <p className="text-center font-bold text-[#b11b29]">Dụng cụ pha cafe</p>
                        </Link>
                      )
                    })
                  }
                </div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 text-left">
                  {
                    [...Array(14)].map((_, index) => {
                      return (
                        <div key={index}>
                          <Link href="/" className="block text-xs text-[#6B6B6B] hover:text-[#b11b29] mb-2 mt-7">
                            Bếp công nghiệp
                          </Link>

                          <ul className="list-disc ">
                            <li>
                              <Link href="/" className="text-xs text-[#6B6B6B] hover:text-[#b11b29] font-normal">
                                Lò nướng
                              </Link>
                            </li>
                            <li>
                              <Link href="/" className="text-xs text-[#6B6B6B] hover:text-[#b11b29] font-normal">
                                Nồi chiên công nghiệp
                              </Link>
                            </li>
                            <li>
                              <Link href="/" className="text-xs text-[#6B6B6B] hover:text-[#b11b29] font-normal">
                                Tủ ủ bột công nghiệp
                              </Link>
                            </li>
                          </ul>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default Header;

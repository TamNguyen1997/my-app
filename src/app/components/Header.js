"use client";

import { Phone, ShoppingCart, Menu, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useContext, useRef } from "react";
import SearchBar from "@/components/SearchBar";
import { CartContext } from "@/context/CartProvider";
import "./Header.css";

const Header = () => {
  const [hoveredCate, setHoveredCate] = useState(null)
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories/?includeSubCate=true&size=7&showOnHeader=true').then(res => res.json()).then(json => setCategories(json.result))
  }, []);

  const { cartdetails } = useContext(CartContext);

  return (
    <nav className="bg-black border-gray-200 dark:bg-gray-900 header">
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
          <div className={`
            w-[80%] rounded-tl-[50px] rounded-bl-[50px]
            bg-gradient-to-b from-[#ffd300] from-0% via-[#ffd300] via-50% to-[#FFAC0A] to-100%
          `}>
            <div className="pl-9">
              <div className="p-3 flex gap-7">
                <div className="flex items-center gap-5">
                  <SearchBar />
                  <Link
                    href="/gio-hang"
                    className="bg-[#FFAC0A] w-[150px] h-[40px] items-center text-center relative flex gap-2 rounded-md shadow-md">
                    <span className="pl-1">
                      <ShoppingCart size={24} strokeWidth={2}></ShoppingCart>
                    </span>
                    <span className="text-sm">Giỏ hàng</span>
                    {cartdetails?.length ? (
                      <div className="rounded-full w-3 h-3 bg-red-600 text-white text-center  text-[10px]">
                        <span className="animate-ping absolute inline-flex w-3 h-3 rounded-full bg-red-600 opacity-75"></span>
                        {cartdetails.length}
                      </div>
                    ) : (
                      ""
                    )}
                  </Link>
                </div>
                <div className="flex items-center text-sm">
                  <div className="flex gap-10">
                    <div className="flex items-center gap-10">
                      <Link href="/tin-tuc">Tin tức</Link>
                      <Link href="/kien-thuc-hay">Kiến thức hay</Link>
                    </div>
                    <div className="flex items-center gap-10">
                      <Link href="/lien-he">Liên hệ</Link>
                      <Link href="/">
                        <div className="flex gap-3 items-center">
                          <div>
                            <Phone></Phone>
                          </div>
                          <div className="text-lg font-bold">090 380 2979</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div
                onMouseOver={() => setShowSubHeader(true)}
                onMouseOut={() => {
                  setShowSubHeader(false);
                }}
              >
                <HeaderItems
                  setHoveredCate={setHoveredCate}
                  menuRef={menuRef}
                  setMenuVisible={setMenuVisible}
                  categories={categories}
                  menuVisible={menuVisible}
                />
              </div>
            </div>
          </div>
        </div>
        {menuVisible ? (
          <div
            onMouseOver={() => setMenuVisible(true)}
            onMouseOut={() => setMenuVisible(false)}
            className="z-10 fixed w-full container subcate-menu"
            ref={menuRef}
          >
            <div className="text-sm flex">
              <div className="bg-white shadow-lg w-[200px]">
                {
                  categories?.map(category => (
                    <Link
                      key={category.id}
                      href={`/${category.slug}`}
                      onMouseOver={() => setHoveredCate(category)}
                      className={`
                        flex items-center border-b hover:font-bold transition p-1.5
                        ${hoveredCate?.id === category.id && 'font-bold'}
                      `}
                    >
                      <img src="https://cdn.tgdd.vn/content/Hot-73x72-1.png" alt="" title="" className="max-w-6 mr-2" />
                      <span className="mr-2">{category.name}</span>
                      <ChevronRight size="15" className="ml-auto" />
                    </Link>
                  ))
                }
              </div>
              {
                hoveredCate && (
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] bg-white shadow-lg grow">
                    {
                      hoveredCate.subcates?.map((subcate, i) => (
                        <div className="px-2.5 py-1">
                          <h2 className="flex items-center font-bold text-black text-left border-b p-1">
                            {subcate.name}
                            <Link href="" className="flex items-center text-xs text-primary ml-3">
                              Xem tất cả
                              <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[5px] border-l-primary border-b-[4px] border-b-transparent ml-1"></div>
                            </Link>
                          </h2>
                          <div className="p-1">
                            <p className="mb-1.5">Product 1</p>
                            <p className="mb-1.5">Product 2</p>
                            <p className="mb-1.5">Product 3</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )
              }
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </nav>
  );
};

const BRANDS = [
  {
    id: 1,
    slug: "thuong-hieu-mapa",
    name: "Mapa",
    imageUrl: "/brand/Logo-Mapa.png",
  },
  {
    id: 2,
    slug: "thuong-hieu-rubbermaid",
    name: "Rubbermaid",
    imageUrl: "/brand/Rubbermaid.png",
  },
  {
    id: 3,
    slug: "thuong-hieu-moerman",
    name: "Moerman",
    imageUrl: "/brand/Logo-Moerman.png",
  },
  {
    id: 4,
    slug: "thuong-hieu-ghibli",
    name: "Ghibli",
    imageUrl: "/brand/Logo-Ghibli.png",
  },
];

const HeaderItems = ({ categories, setHoveredCate, menuRef, setMenuVisible, menuVisible }) => {
  // const [categories, setCategories] = useState([]);

  // useEffect(() => {
  //   fetch('/api/categories/?includeSubCate=true&size=7&showOnHeader=true').then(res => res.json()).then(json => setCategories(json.result))
  // }, [])

  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    setSubCategories(
      (categories || []).reduce((acc, category) => [...acc, ...(category?.subcates || [])], [])?.filter((item, index, arr) => arr.findIndex(_i => _i.id === item.id) === index)
    )
  }, [categories]);

  const headerItemsRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (!headerItemsRef?.current) return;
      const parentNode = headerItemsRef.current.parentNode;
      const nav = headerItemsRef.current.closest("nav");
      const menuButton = headerItemsRef.current.querySelector(".menu-button");
      let menuHeight = 0;

      if (parentNode.getBoundingClientRect().bottom <= 0) {
        headerItemsRef.current.classList.add("fixed-header");
        parentNode.classList.add("container");
        menuHeight = headerItemsRef.current.getBoundingClientRect().height || 0;
      } else {
        menuHeight = nav?.getBoundingClientRect().height || 0;
        headerItemsRef.current.classList.remove("fixed-header");
        parentNode.classList.remove("container");
      }

      if (menuRef.current) {
        menuRef.current.style.top = menuHeight + "px";
        menuRef.current.style.opacity = 1;
        let menuLeft = Math.max(menuButton?.getBoundingClientRect().left - 8, 0);
        menuRef.current.style.left = menuLeft + "px";
        menuRef.current.style.width = `calc(100% - ${menuLeft}px)`;
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (<>
    <div className="w-full" ref={headerItemsRef}>
      <div className="flex text-sm container">
        {/* <Link href=""
          onMouseOver={() => {
            setSubCate(BRANDS)
            setHoveredCate({})
          }}
          onMouseOut={onMouseOut}
          className={`
            hover:bg-[#FFAC0A] transition p-3
          `}
        >
          Thương hiệu
        </Link> */}
        <Link href=""
          className={`
            hover:bg-[#FFAC0A] transition p-3 menu-button
            ${menuVisible && 'bg-[#FFAC0A]'}
          `}
          onMouseOver={() => {
            setMenuVisible(true)
            setHoveredCate(null)
          }}
          onMouseOut={() => setMenuVisible(false)}
        >
          <Menu size="20" className="inline-block mr-2" />
          Tất cả danh mục
        </Link>
        {
          subCategories.map((subcate) =>
            <Link href={`/${subcate.slug}`}
              key={subcate.id}
              className={`
                hover:bg-[#FFAC0A] transition p-3
                border-l border-[#FFAC0A]
                text-center
              `}
            >
              {subcate.name}
            </Link>
          )}
      </div>
    </div>
  </>
  );
};

export default Header;

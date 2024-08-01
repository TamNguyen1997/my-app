"use client";

import { Phone, ShoppingCart, Menu, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useContext, useRef } from "react";
import SearchBar from "@/components/SearchBar";
import { CartContext } from "@/context/CartProvider";
import "./Header.css";

const Header = () => {
  const [hoveredCate, setHoveredCate] = useState(null)
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef();
  const brandCategory = {
    id: "-1",
    slug: "thuong-hieu",
    name: "Thương hiệu",
    subcates: BRANDS
  };
  const [categories, setCategories] = useState([
    // brandCategory,
    // ...[...Array(6)].map((_, index) => ({
    //   id: index,
    //   slug: `category-${index}`,
    //   name: `Category ${index}`,
    //   subcates: BRANDS
    // }))
  ]);

  useEffect(() => {
    fetch('/api/categories/?includeSubCate=true&size=7&showOnHeader=true').then(res => res.json()).then(json => setCategories([brandCategory, ...json.result]));
  }, []);

  const { cartdetails } = useContext(CartContext);

  return (
    <nav className="bg-black border-gray-200 dark:bg-gray-900 header">
      <div className="w-full h-full">
        <div className="flex w-full h-full">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto pl-10">
            <Link href="/">
              <img
                src="/saoviet.png"
                alt="favicon"
                height={63}
                width={165}
                className="bg-black"
              />
            </Link>
          </div>
          <div className={`
            w-[80%] rounded-tl-[50px] rounded-bl-[50px]
            bg-[#ffd300]
          `}>
            <div className="pl-9">
              <div className="p-3 flex gap-7">
                <div className="flex items-center gap-3">
                  <SearchBar />
                  <Link
                    href="/gio-hang"
                    className="bg-[#FFAC0A] h-[35px] items-center text-center relative flex rounded-md shadow-md">
                    <span className="px-1">
                      <ShoppingCart size={24} strokeWidth={2}></ShoppingCart>
                    </span>
                    <span className="text-sm px-1">Giỏ hàng</span>
                    {cartdetails?.length ? (
                      <div className="rounded-full w-3 h-3 bg-red-600 text-white text-center text-[10px]">
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
              <div>
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
            className="z-10 fixed w-full subcate-menu"
            ref={menuRef}
          >
            <div className="text-sm flex">
              <div className="bg-white shadow-lg w-[200px] border rounded-bl-lg">
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
                  <div className="bg-white shadow-lg grow border rounded-br-lg">
                    <div className="p-2 grid grid-rows-7 grid-flow-col">
                      {
                        hoveredCate.subcates?.map((subcate, i) => (
                          <Link key={i} className="p-1 hover:text-blue-500" href={`/${subcate.slug}`}>{subcate.name}</Link>
                        ))
                      }
                    </div>
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
    slug: "thuong-hieu-ghibli",
    name: "Ghibli",
    image: {
      path: "/brand/Logo-Ghibli.png"
    },
  },
  {
    id: 2,
    slug: "thuong-hieu-rubbermaid",
    name: "Rubbermaid",
    image: {
      path: "/brand/Rubbermaid.png"
    },
  },
  {
    id: 3,
    slug: "thuong-hieu-kimberly-clark",
    name: "Kimberly-Clark",
    image: {
      path: "/brand/Logo-Kimberly-Clark.png"
    },
  },
  {
    id: 4,
    slug: "thuong-hieu-moerman",
    name: "Moerman",
    image: {
      path: "/brand/Logo-Moerman.png"
    }
  },
  {
    id: 5,
    slug: "thuong-hieu-kleen-tex",
    name: "Kleen-tex",
    image: {
      path: "/brand/KLEEN-TEX.png"
    },
  },
  {
    id: 6,
    slug: "thuong-hieu-mapa",
    name: "Mapa",
    image: {
      path: "/brand/Logo-Mapa.png"
    },
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
      (categories || []).filter(category => category.id !== "-1").reduce((acc, category) => [...acc, ...(category?.subcates || [])], [])?.filter((item, index, arr) => arr.findIndex(_i => _i.id === item.id) === index)
    )
  }, [categories]);

  const headerItemsRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (!headerItemsRef?.current) return;
      const parentNode = headerItemsRef.current.parentNode;
      // const nav = headerItemsRef.current.closest("nav");
      const menuButton = headerItemsRef.current.querySelector(".menu-button");
      let menuHeight = 0;

      if (parentNode.getBoundingClientRect().bottom <= 0) {
        headerItemsRef.current.classList.add("fixed-header");
        headerItemsRef.current.childNodes?.[0]?.classList.remove("container");
        menuRef.current?.classList.remove("container");
        menuHeight = headerItemsRef.current.getBoundingClientRect().height || 0;
      } else {
        // menuHeight = nav?.getBoundingClientRect().height || 0;
        menuHeight = menuButton?.getBoundingClientRect().bottom || 0;
        headerItemsRef.current.classList.remove("fixed-header");
        menuRef.current?.classList.add("container");
        headerItemsRef.current.childNodes?.[0]?.classList.add("container");
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
    <div className="w-full font-bold header-items" ref={headerItemsRef}>
      <div className="ml-0 w-full flex text-sm">
        <Link href=""
          className={`
            hover:bg-[#FFAC0A] transition py-4 menu-button
            ${menuVisible && 'bg-[#FFAC0A]'}
          `}
          onMouseOver={() => {
            setMenuVisible(true)
            setHoveredCate(null)
          }}
          onMouseOut={() => setMenuVisible(false)}
        >
          <div className="flex">
            <Menu size="20" className="inline-block mr-2" />
            <p>
              Danh mục
            </p>
          </div>
        </Link>
        <span className="pl-2"></span>
        {
          subCategories.map((subcate) =>
            <>
              <span className="pl-2"></span>
              <Link href={`/${subcate.slug}`}
                key={subcate.id}
                className={`
                hover:bg-[#FFAC0A] transition py-4 sm:hidden md:block
                text-center
              `}
              >
                {subcate.name}
              </Link>
            </>
          )}
      </div>
    </div>
  </>
  );
};

export default Header;

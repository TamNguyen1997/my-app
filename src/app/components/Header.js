"use client";

import { ShoppingCart, Menu, ChevronRight } from "lucide-react";
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
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories/headers').then(res => res.json()).then(json => setCategories([brandCategory, ...json.result,
      {
        id: "1000",
        slug: "tin-tuc",
        name: "Tin tức",
        class: "flex md:hidden",
        subcates: []
      },
      {
        id: "1001",
        slug: "kien-thuc-hay",
        name: "Kiến thức hay",
        class: "flex md:hidden",
        subcates: [
          {
            id: "1",
            slug: "kien-thuc-hay/tu-dien-thuat-ngu",
            name: "Từ điển thuật ngữ"
          },
          {
            id: "2",
            slug: "kien-thuc-hay/tu-van-chon-mua",
            name: "Tư vấn chọn mua"
          },
          {
            id: "3",
            slug: "kien-thuc-hay/huong-dan-su-dung",
            name: "Hướng dẫn sử dụng"
          }
        ]
      }
    ]));
  }, []);

  const { cartdetails } = useContext(CartContext);
  const getQuantity = (details) => {
    let total = 0;
    details.forEach(item => {
      total += parseInt(item.quantity)
    });
    return total
  }

  return (
    <nav className="bg-black border-gray-200 dark:bg-gray-900 header">
      <div className="w-full h-full">
        <div className="flex w-full h-full">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto sm:pl-10 pl-4">
            <Link href="/" className="pr-4">
              <img
                src="/saoviet.png"
                alt="favicon"
                height={80}
                width={200}
                className="bg-black sm:w-[200px] w-[120px]"
              />
            </Link>
          </div>
          <div className={`
            w-[80%] rounded-tl-[50px] rounded-bl-[50px]
            bg-[#FFD400]
          `}>
            <div className="pl-9">
              <div className="p-3 flex gap-7 pl-0">
                <div className="w-full max-w-[397px] flex items-center gap-3 [&>div]:grow">
                  <SearchBar />
                  <Link
                    id="header-cart-btn"
                    href="/gio-hang"
                    className="bg-[#FFAC0A] h-[35px] min-w-[100px] items-center justify-center text-center relative flex rounded-md shadow-md">
                    <span className="px-1">
                      <ShoppingCart size={24} strokeWidth={2}></ShoppingCart>
                    </span>
                    <span className="text-sm whitespace-nowrap pl-1 pr-1.5 sm:block hidden">Giỏ hàng</span>
                    {cartdetails?.length ? (
                      <div className="absolute -top-1 -right-1 flex items-center justify-center rounded-full w-3 h-3 bg-red-600 text-white text-center text-[10px]">
                        <span className="animate-ping absolute inline-flex w-3 h-3 rounded-full bg-red-600 opacity-75"></span>
                        {getQuantity(cartdetails)}
                      </div>
                    ) : (
                      ""
                    )}
                  </Link>
                </div>
                <div className="items-center text-sm hidden md:flex">
                  <div className="flex gap-10">
                    <div className="flex items-center gap-10 uppercase">
                      <Link href="/tin-tuc">Tin tức</Link>
                      <Link href="/kien-thuc-hay">Kiến thức hay</Link>
                    </div>
                    <div className="items-center gap-10 hidden md:block">
                      <Link href="tel:0903802979">
                        <div className="flex items-center font-bold">
                          Hotline: 090 380 2979
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pr-10">
                <HeaderItems
                  setHoveredCate={setHoveredCate}
                  menuRef={menuRef}
                  setMenuVisible={setMenuVisible}
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
            className="fixed w-full subcate-menu z-[10000]"
            ref={menuRef}
          >
            <div className="text-sm flex">
              <div className="bg-white shadow-lg w-[240px] border rounded-bl-lg">
                {
                  categories?.map(category => (
                    <Link
                      key={category.id}
                      href={`/${category.slug}`}
                      onMouseOver={() => setHoveredCate(category)}
                      className={`
                        items-center border-b hover:font-bold transition p-1.5 
                        ${category.slug !== "kien-thuc-hay" && category.slug !== "tin-tuc" ? "flex" : category.class} 
                        ${hoveredCate?.id === category.id && 'font-bold'}
                      `}
                    >
                      {
                        category.slug !== "kien-thuc-hay" && category.slug !== "tin-tuc" ?
                          <img src={`/icon/header/${category.slug}.svg`} alt="" title="" className="max-w-6 mr-2" /> : ""
                      }

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
    slug: "thuong-hieu-rubbermaid",
    name: "Rubbermaid",
    image: {
      path: "/brand/Rubbermaid.png"
    },
  },
  {
    id: 2,
    slug: "thuong-hieu-ghibli",
    name: "Ghibli",
    image: {
      path: "/brand/Logo-Ghibli.png"
    },
  },
  {
    id: 3,
    slug: "thuong-hieu-moerman",
    name: "Moerman",
    image: {
      path: "/brand/Logo-Moerman.png"
    }
  },
  {
    id: 4,
    slug: "thuong-hieu-kimberly-clark",
    name: "Kimberly-Clark",
    image: {
      path: "/brand/Logo-Kimberly-Clark.png"
    },
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

const HeaderItems = ({ setHoveredCate, menuRef, setMenuVisible, menuVisible }) => {
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
        // headerItemsRef.current.childNodes?.[0]?.classList.remove("container");
        // menuRef.current?.classList.remove("container");
        menuHeight = headerItemsRef.current.getBoundingClientRect().height || 0;
      } else {
        // menuHeight = nav?.getBoundingClientRect().height || 0;
        menuHeight = menuButton?.getBoundingClientRect().bottom || 0;
        headerItemsRef.current.classList.remove("fixed-header");
        // menuRef.current?.classList.add("container");
        // headerItemsRef.current.childNodes?.[0]?.classList.add("container");
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
      <div className="w-full ml-0 flex text-sm overflow-auto">
        <Link href=""
          className={`
            hover:bg-[#FFAC0A] transition pb-4 sm:pt-4 pt-2 menu-button w-28 mr-auto
            ${menuVisible && 'bg-[#FFAC0A]'}
          `}
          onMouseOver={() => {
            setMenuVisible(true)
            setHoveredCate(null)
          }}
          onMouseOut={() => setMenuVisible(false)}
        >
          <div className="flex">
            <Menu size="20" className="inline-block mr-2 min-w-5" />
            DANH MỤC
          </div>
        </Link>
        <Link href={`/dung-cu-ve-sinh`}
          className={`
                hover:bg-[#FFAC0A] transition py-4 px-3 hidden md:block
                text-center capitalize
              `}
        >
          DỤNG CỤ VỆ SINH
        </Link>
        <Link href={`/xe-lam-ve-sinh`}
          className={`
                hover:bg-[#FFAC0A] transition py-4 px-3 hidden md:block
                text-center capitalize
              `}
        >
          XE LÀM VỆ SINH
        </Link>
        <Link href={`/thung-dung-do-da-nang`}
          className={`
                hover:bg-[#FFAC0A] transition py-4 px-3 hidden md:block
                text-center capitalize
              `}
        >
          THÙNG ĐỰNG ĐỒ ĐA NĂNG
        </Link>
        <Link href={`/may-ve-sinh-cong-nghiep`}
          className={`
                hover:bg-[#FFAC0A] transition py-4 px-3 hidden md:block
                text-center capitalize
              `}
        >
          MÁY VỆ SINH CỘNG NGHIỆP
        </Link>
        <Link href={`/dung-cu-ve-sinh-kinh`}
          className={`
                hover:bg-[#FFAC0A] transition py-4 px-3 hidden md:block
                text-center capitalize
              `}
        >
          DỤNG CỤ VỆ SINH KÍNH
        </Link>
        <Link href={`/gang-tay-bao-ho`}
          className={`
                hover:bg-[#FFAC0A] transition py-4 px-3 hidden md:block
                text-center capitalize
              `}
        >
          GĂNG TAY BẢO HỘ
        </Link>
        <Link href={`/tham-trai-san`}
          className={`
                hover:bg-[#FFAC0A] transition py-4 px-3 hidden md:block
                text-center capitalize
              `}
        >
          THẢM TRẢI SÀN
        </Link>
        <Link href={`/khan-giay-giay-ve-sinh`}
          className={`
                hover:bg-[#FFAC0A] transition py-4 px-3 hidden md:block
                text-center capitalize
              `}
        >
          KHĂN GIẤY/GIẤY VỆ SINH
        </Link>
        <Link href={`/dich-vu`}
          className={`
                hover:bg-[#FFAC0A] transition py-4 px-3 hidden md:block
                text-center capitalize
              `}
        >
          DỊCH VỤ
        </Link>
      </div>
    </div>
  </>
  );
};

export default Header;

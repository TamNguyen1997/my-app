"use client";

import { ShoppingCart, Menu, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useContext, useRef, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import { CartContext } from "@/context/CartProvider";
import "./Header.css";
import Image from "next/image";

const Header = ({ headers }) => {
  const [hoveredCate, setHoveredCate] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef();
  const { cartdetails } = useContext(CartContext);

  const cartCount = useMemo(() => cartdetails?.reduce((total, item) => total + parseInt(item.quantity), 0), [cartdetails]);

  return (
    <nav className="bg-black border-gray-200 dark:bg-gray-900 header">
      <div className="w-full h-full flex">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto sm:pl-10 pl-4">
          <Link href="/" className="pr-4">
            <Image
              src="/saoviet.webp"
              alt="favicon"
              height={80}
              width={200}
              priority="true"
              sizes="(max-width: 640px) 120px, (max-width: 1024px) 150px, 200px"
              className="bg-black sm:w-[200px] w-[120px]"
              srcSet="/saoviet.webp 200w,/saoviet.webp 400w,/saoviet.webp 800w"
            />
          </Link>
        </div>
        <div className="w-[80%] rounded-tl-[50px] rounded-bl-[50px] bg-[#FFD400]">
          <div className="pl-9 p-3 flex gap-7">
            <div className="w-full max-w-[397px] flex items-center gap-3">
              <SearchBar />
              <Link id="header-cart-btn" href="/gio-hang" className="bg-[#FFAC0A] h-[35px] min-w-[100px] flex items-center justify-center relative rounded-md shadow-md">
                <ShoppingCart size={32} strokeWidth={2} className="px-1" />
                <span className="text-sm whitespace-nowrap pl-1 pr-1.5 sm:block hidden">Giỏ hàng</span>
                {cartCount && (
                  <div className="absolute -top-1 -right-1 flex items-center justify-center rounded-full w-3 h-3 bg-red-600 text-white text-[10px]">
                    <span className="animate-ping absolute inline-flex w-3 h-3 rounded-full bg-red-600 opacity-75"></span>
                    {cartCount}
                  </div>
                )}
              </Link>
            </div>
            <div className="hidden md:flex items-center text-sm gap-10 uppercase">
              <Link href="/tin-tuc">Tin tức</Link>
              <Link href="/kien-thuc-hay">Kiến thức hay</Link>
              <Link href="tel:0902802979" className="font-bold">Hotline: 090 280 2979</Link>
            </div>
          </div>
          <div className="pl-9">
            <HeaderItems setHoveredCate={setHoveredCate} menuRef={menuRef} setMenuVisible={setMenuVisible} menuVisible={menuVisible} />
          </div>
        </div>
      </div>
      <div className={`fixed w-full subcate-menu z-[10000] ${menuVisible ? 'visible' : 'invisible'}`} ref={menuRef} onMouseOver={() => setMenuVisible(true)} onMouseOut={() => setMenuVisible(false)}>
        <div className="text-sm flex">
          <div className="bg-white shadow-lg w-[240px] border rounded-bl-lg">
            {headers?.map(category => (
              <Link key={category.id} href={category.slug ? `/${category.slug}` : '#'}
                onMouseOver={() => setHoveredCate(category)}
                className={`items-center border-b hover:font-bold transition p-1.5 flex ${hoveredCate?.id === category.id && 'font-bold'}`}>
                {category.slug && <img src={`/icon/header/${category.slug}.svg`} alt="" className="max-w-6 mr-2" />}
                <span className="mr-2">{category.name}</span>
                <ChevronRight size="15" className="ml-auto" />
              </Link>
            ))}
          </div>
          {hoveredCate && hoveredCate.subcates?.length > 0 && (
            <div className="bg-white shadow-lg grow border rounded-br-lg p-2 grid grid-rows-8 grid-flow-col">
              {hoveredCate.subcates.map((subcate, i) => (
                <Link key={i} className="p-1 hover:text-blue-500" href={`/${subcate.slug}`}>{subcate.name}</Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const HeaderItems = ({ setHoveredCate, menuRef, setMenuVisible, menuVisible }) => {
  const headerItemsRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (!headerItemsRef?.current) return;
      const parentNode = headerItemsRef.current.parentNode;
      const menuButton = headerItemsRef.current.querySelector(".menu-button");
      let menuHeight = 0;

      if (parentNode.getBoundingClientRect().bottom <= 0) {
        headerItemsRef.current.classList.add("fixed-header");
        menuHeight = headerItemsRef.current.getBoundingClientRect().height || 0;
      } else {
        menuHeight = menuButton?.getBoundingClientRect().bottom || 0;
        headerItemsRef.current.classList.remove("fixed-header");
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
  const menuItems = [
    { href: "/dung-cu-ve-sinh", label: "DỤNG CỤ VỆ SINH" },
    { href: "/xe-lam-ve-sinh", label: "XE LÀM VỆ SINH" },
    { href: "/hop-thung-dung-do-da-nang", label: "THÙNG ĐỰNG ĐỒ ĐA NĂNG" },
    { href: "/may-ve-sinh-cong-nghiep", label: "MÁY VỆ SINH CÔNG NGHIỆP" },
    { href: "/dung-cu-ve-sinh-kinh", label: "DỤNG CỤ VỆ SINH KÍNH" },
    { href: "/gang-tay-bao-ho", label: "GĂNG TAY BẢO HỘ" },
    { href: "/tham", label: "THẢM TRẢI SÀN" },
    { href: "/khan-giay", label: "KHĂN GIẤY/GIẤY VỆ SINH" },
  ];

  return (<div className="w-full font-bold header-items" ref={headerItemsRef}>
    <div className="w-full flex text-sm overflow-auto">
      <Link
        href=""
        className={`hover:bg-[#FFAC0A] transition pb-4 sm:pt-4 pt-2 menu-button w-28 ${menuVisible ? 'bg-[#FFAC0A]' : ''}`}
        onMouseOver={() => {
          setMenuVisible(true);
          setHoveredCate(null);
        }}
        onMouseOut={() => setMenuVisible(false)}
      >
        <Menu size="20" className="inline-block mr-2 min-w-5" />
        DANH MỤC
      </Link>
      {menuItems.map(({ href, label }) => (
        <Link key={href} href={href} className="hover:bg-[#FFAC0A] transition py-4 px-3 hidden md:block text-center capitalize">
          {label}
        </Link>
      ))}
    </div>
  </div>
  );
};

export default Header;

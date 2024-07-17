"use client";

import { Phone, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useContext, useRef } from "react";
import SearchBar from "@/components/SearchBar";
import { CartContext } from "@/context/CartProvider";
import "./Header.css";

const Header = () => {
  const [showSubHeader, setShowSubHeader] = useState(false);

  const [subCate, setSubCate] = useState()
  const [hoveredCate, setHoveredCate] = useState(null)
  const subCateMenuRef = useRef();

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
                      <Link href="/blog">Kiến thức hay</Link>
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
                  onHover={() => setShowSubHeader(true)}
                  onMouseOut={() => {
                    setShowSubHeader(false);
                  }}
                  setSubCate={setSubCate}
                  setHoveredCate={setHoveredCate}
                  subCateMenuRef={subCateMenuRef}
                  hoveredCate={hoveredCate}
                  showSubHeader={showSubHeader}
                />
              </div>
            </div>
          </div>
        </div>
        {showSubHeader && subCate?.length ? (
          <div
            onMouseOver={() => setShowSubHeader(true)}
            onMouseOut={() => setShowSubHeader(false)}
            className="z-10 fixed w-full bg-white shadow-lg p-4 subcate-menu"
            ref={subCateMenuRef}
          >
            <div className="container">
              <h2 className="text-lg font-bold text-black text-left border-b pb-1">
                {hoveredCate.name || "Thương hiệu"}
              </h2>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
                {subCate.map((subcate, i) => (
                  <Link
                    key={i}
                    href={
                      hoveredCate.slug
                        ? `/${hoveredCate.slug}/${subcate.slug}`
                        : `/${subcate.slug}`
                    }
                  >
                    <span
                      className="flex flex-col justify-center items-center hover:opacity-35 hover:shadow-lg py-4"
                      key={subcate.name}
                    >
                      <div className="flex items-center w-2/3 m-auto h-[80px]">
                        {subcate.imageUrl ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_FILE_PATH +
                              subcate.imageUrl
                              }`}
                            width="150"
                            height="150"
                            alt={i}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                      {subcate.name}
                    </span>
                  </Link>
                ))}
              </div>
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
    slug: "thuong-hieu-mapa",
    name: "Mapa",
    imageUrl: "/brand/Logo-Mapa.png",
  },
  {
    slug: "thuong-hieu-rubbermaid",
    name: "Rubbermaid",
    imageUrl: "/brand/Rubbermaid.png",
  },
  {
    slug: "thuong-hieu-moerman",
    name: "Moerman",
    imageUrl: "/brand/Logo-Moerman.png",
  },
  {
    slug: "thuong-hieu-ghibli",
    name: "Ghibli",
    imageUrl: "/brand/Logo-Ghibli.png",
  },
];

const HeaderItems = ({ onHover, onMouseOut, setSubCate, setHoveredCate, subCateMenuRef, hoveredCate, showSubHeader }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories/?includeSubCate=true&size=7&showOnHeader=true').then(res => res.json()).then(json => setCategories(json.result))
  }, [])

  const headerItemsRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      if (!headerItemsRef?.current) return;
      const parentNode = headerItemsRef.current.parentNode;
      const nav = headerItemsRef.current.closest("nav");
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

      if (subCateMenuRef.current) {
        subCateMenuRef.current.style.top = menuHeight + "px";
        subCateMenuRef.current.style.opacity = 1;
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (<>
    <div className="w-full" ref={headerItemsRef}>
      <div className="pl-2 flex text-sm">
        <Link href=""
          onMouseOver={() => {
            setSubCate(BRANDS)
            setHoveredCate({})
          }}
          onMouseOut={onMouseOut}
          className={`
            ${hoveredCate && !Object.keys(hoveredCate)?.length && showSubHeader ? 'bg-[#FFAC0A]' : ''}
            hover:bg-[#FFAC0A] transition p-3
          `}
        >
          Thương hiệu
        </Link>
        {
          categories.map((category) =>
            <Link href={`/${category.slug}`}
              key={category.id}
              onMouseOver={() => {
                setSubCate(category.sub_category);
                onHover();
                setHoveredCate(category);
              }}
              onMouseOut={onMouseOut}
              className={`
                ${hoveredCate?.id === category.id && showSubHeader ? 'bg-[#FFAC0A]' : ''}
                hover:bg-[#FFAC0A] transition p-3
                border-l border-[#FFAC0A]
              `}
            >
              {category.name}
            </Link>
          )}
      </div>
    </div>
  </>
  );
};

export default Header;

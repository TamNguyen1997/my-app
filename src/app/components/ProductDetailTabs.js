"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from '@nextui-org/react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import RelatedProducts from "@/components/RelatedProducts";
import TechnicalDetail from './TechnicalDetail';
import parse from 'html-react-parser'
import "./ProductDetailTabs.css"
import "./blog/BlogDetail.css"
import { getRecentlyView } from "@/lib/product";
import Link from "next/link";
import Image from "next/image";

const ID = {
  RECENTLY_VIEW: "RECENTLY_VIEW",
  DESCRIPTION: "DESCRIPTION",
  FEATURES: "FEATURES",
  SPECIFICATIONS: "SPECIFICATIONS",
  VIDEOS: "VIDEOS",
  COMPONENT_PARTS: "COMPONENT_PARTS",
  RELATED_ITEMS: "RELATED_ITEMS"
};

const TabContent = ({ id, product, description, relatedProducts, technicalDetailForSaleDetail = [] }) => {

  const [recentlyView, setRecentlyView] = useState([])

  useEffect(() => {
    setRecentlyView(getRecentlyView())
  }, [])


  const getImageUrl = useCallback((url) => {
    if (url) {    
      let url = "https://dungcuvesinhsaoviet.com/wordpress-prod/wp-content/uploads/gallery/product/ban-chai-cha-roan-gach-fg9b5600bla-1png.png";
      let newUrl = url.substring(url.indexOf('/gallery'));
      return `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-content/uploads/${newUrl}`;
    }
    return "/default-featured-image.webp";
  }, [])

  switch (id) {
    case ID.DESCRIPTION:
      return (
        <div className={`
          [&_img]:mx-auto
          [&_a]:text-primary
          [&_h2]:mt-[1.25em]
          [&_p]:my-[1.125em]
          max-w-full
          prose
          mb-9 product-description
        `}>
          {description ? parse(description) : ""}
        </div>
      )
    case ID.FEATURES:
      return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[30px] mb-9">
          {
            [...Array(3)].map((_, index) => {
              return (
                <div className="text-sm" key={index}>
                  <div className="relative pb-[100%]">
                    <img src={product?.imageUrl} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <p className="font-bold my-1.5">Ứng dụng Home & Garden</p>
                  <p>Ứng dụng Kärcher Home & Garden giúp bạn trở thành một chuyên gia làm sạch. Tận dụng kiến ​thức sâu rộng về Kärcher của chúng tôi để có kết quả làm sạch hoàn hảo. Dịch vụ toàn diện tiện lợi - tất cả thông tin trên thiết bị, ứng dụng và cổng Dịch vụ của chúng tôi.</p>
                </div>
              )
            })
          }
        </div>
      )
    case ID.SPECIFICATIONS:
      return (
        <div className="mb-9 items-center">
          <div>
            {
              <TechnicalDetail data={product.technical_detail || []}></TechnicalDetail>
            }
          </div>
        </div>
      )
    case ID.VIDEOS:
      return (
        <div className="mb-9">
          <div className="relative aspect-[16/9] max-w-[295px]">
            <iframe width="100%" height="100%" className="absolute inset-0" src="https://www.youtube.com/embed/bk-7487l1OQ" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
          </div>
        </div>
      )
    case ID.RELATED_ITEMS:
      return (
        <div className="mb-9">
          <RelatedProducts relatedProducts={relatedProducts} />
        </div>
      )
    case ID.COMPONENT_PARTS:
      return (
        <div className="mb-9">
          <RelatedProducts query={`/?size=10&page=1&productType=COMPONENT_PART&productId=${product.id}`} />
        </div>
      )
    case ID.RECENTLY_VIEW:
      return (
        <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
          {recentlyView.map((item, index) => (
            <Link href={`/${item.subCate?.slug}/${item.slug}`} className="hover:opacity-50" key={index}>
              <div className="flex gap-3 items-center">
                <Image
                  width={200}
                  height={200}
                  src={`${getImageUrl(item.imageUrl)|| "/default-featured-image.webp"}`}
                  alt={item.imageAlt || "Dụng cụ vệ sinh Sao Việt"}
                  className="w-16 h-16"
                />
                <p>{item.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )
    default:
      return <></>
  }
}

export default ({ product, description, relatedProducts }) => {
  const tabs = [
    { id: ID.RECENTLY_VIEW, title: "Sản phẩm vừa xem" },
    { id: ID.DESCRIPTION, title: "Mô tả" },
    { id: ID.SPECIFICATIONS, title: "Thông số kỹ thuật" },
    { id: ID.RELATED_ITEMS, title: "Sản phẩm liên quan" },
  ];

  const [currentTab, setCurrentTab] = useState("");
  const [titles, setTitles] = useState([]);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [leftChevron, setLeftChevron] = useState(false);
  const [rightChevron, setRightChevron] = useState(false);

  useEffect(() => {
    const titleList = document.querySelectorAll(".tab-title");
    const titleArray = Array.from(titleList);
    setTitles(titleArray);
  }, []);

  useEffect(() => {
    const headerItems = document.querySelector(".header-items");
    if (headerItems) {
      setHeaderHeight(headerItems.getBoundingClientRect()?.height);
    }
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 1) {
            setCurrentTab(entry.target?.dataset.id);
          }
        });
      },
      {
        rootMargin: "0% 0% -50% 0%",
        threshold: 1
      }
    );

    if (titles.length) {
      titles.forEach(title => {
        observer.observe(title);
      });
    }
    return () => {
      observer.disconnect();
    }
  }, [titles.length]);

  useEffect(() => {
    const tabHeader = document.querySelector(".tab-header");
    const tabHeaderContent = document.querySelector(".tab-header-content");
    const handleScroll = () => {
      const tabHeaderLeft = tabHeader?.getBoundingClientRect()?.left || 0;
      const tabHeaderRight = tabHeader?.getBoundingClientRect()?.right || 0;
      const tabHeaderContentLeft = tabHeaderContent?.firstChild?.getBoundingClientRect()?.left || 0;
      const tabHeaderContentRight = tabHeaderContent?.lastChild?.getBoundingClientRect()?.right || 0;

      setLeftChevron(Math.trunc(tabHeaderContentLeft) - Math.trunc(tabHeaderLeft) < 0);
      setRightChevron(Math.trunc(tabHeaderRight) - Math.trunc(tabHeaderContentRight) < 0);
    }

    tabHeaderContent?.addEventListener("scroll", handleScroll);
    return () => tabHeaderContent?.removeEventListener("scroll", handleScroll);
  });

  const scrollToLeft = () => {
    const tabHeaderContent = document.querySelector(".tab-header-content");
    if (!tabHeaderContent) return;
    tabHeaderContent.scrollLeft -= 70;
  }

  const scrollToRight = () => {
    const tabHeaderContent = document.querySelector(".tab-header-content");
    if (!tabHeaderContent) return;
    tabHeaderContent.scrollLeft += 70;
  }

  return (
    <>
      <div
        className="sticky top-0 z-10"
        style={{ top: `${headerHeight}px` }}
      >
        <div className="relative bg-white tab-header">
          <div className="flex items-center w-full overflow-auto tab-header-content flex-wrap">
            {
              tabs.map((tab, index) => {
                return (
                  <Button
                    className={`
                                uppercase font-bold  h-[39px] rounded-none shrink-0 px-5 py-3 mr-0.5 last:mr-0 transition tab
                                ${currentTab == tab.id ? 'text-[#ffed00] bg-[#333]' : 'text-[#2b2b2b] bg-[#f8f8f8]'}
                            `}
                    key={index}
                    data-id={tab.id}
                    onClick={() => {
                      window.scrollTo({
                        top: titles[index].getBoundingClientRect().top + window.scrollY - 60,
                        behavior: "smooth"
                      });
                    }}
                  >
                    {tab.title}
                  </Button>
                )
              })
            }
          </div>
          {
            leftChevron && <ChevronLeft size="20" className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-[rgba(255,255,255,0.4)] z-1000 cursor-pointer" onClick={scrollToLeft} />
          }
          {
            rightChevron && <ChevronRight size="20" className="absolute top-1/2 -translate-y-1/2 right-0 w-7 h-7 bg-[rgba(255,255,255,0.4)] z-1000 cursor-pointer" onClick={scrollToRight} />
          }
        </div>
      </div>
      <div>
        {
          tabs.map((tab, index) => {
            return (
              <div key={index}>
                <div
                  className="uppercase font-bold text-[#2b2b2b] pb-3 mt-4 mb-7 mr-0.5 last:mr-0 border-b border-[#e3e3e3] tab-title"
                  data-id={tab.id}
                >
                  {tab.title}
                </div>

                <TabContent id={tab.id} product={product} description={description} relatedProducts={relatedProducts} />
              </div>
            )
          })
        }
      </div>
    </>
  )
}
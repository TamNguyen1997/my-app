"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import RelatedProducts from "@/components/RelatedProducts";
import CompactRelatedProducts from "@/components/CompactRelatedProducts";
import TechnicalDetail from './TechnicalDetail';
import parse from 'html-react-parser'
import "./ProductDetailTabs.css"
import "./blog/BlogDetail.css"
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { getRecentlyView } from "@/lib/product";
import Link from "next/link";
import Image from "next/image";

const TAB_IDS = {
  BUNDLE: "BUNDLE",
  DESCRIPTION: "DESCRIPTION",
  SPECIFICATIONS: "SPECIFICATIONS",
  RECENTLY_VIEW: "RECENTLY_VIEW",
  RELATED_ITEMS: "RELATED_ITEMS"
};

const TabContent = ({ id, product, description, relatedProducts, productsInBundle = [] }) => {
  const [recentlyView, setRecentlyView] = useState([]);

  useEffect(() => {
    setRecentlyView(getRecentlyView());
  }, []);

  useEffect(() => {
    const carousels = document.querySelectorAll(".wp-block-cb-carousel-v2 .swiper");
    carousels.forEach((el) => {
      if (el.swiper) return;
      const container = el.closest(".wp-block-cb-carousel-v2");
      new Swiper(el, {
        modules: [Navigation, Pagination],
        slidesPerView: 1,
        spaceBetween: 15,
        pagination: {
          el: container.querySelector(".cb-pagination"),
          clickable: true,
        },
        breakpoints: {
          768: { slidesPerView: 3, slidesPerGroup: 1 },
        },
      });
    });
  }, [description]);

  const getImageUrl = useCallback((url) => {
    if (!url) return "/default-featured-image.webp";
    const newUrl = url.substring(url.indexOf('/gallery'));
    return newUrl.includes('wp-content/uploads') ? newUrl : `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-content/uploads/${newUrl}`;
  }, []);

  const tabMap = {
    [TAB_IDS.DESCRIPTION]: (
      <div className={`
        [&_img]:mx-auto
        [&_a]:text-primary
        [&_h2]:mt-[1.25em]
        [&_p]:my-[1.125em]
        max-w-full
        prose
        mb-9 product-description blog-content
      `}>
        {description ? parse(description) : ""}
      </div>
    ),
    [TAB_IDS.SPECIFICATIONS]: (
      <div className="mb-9">
        <TechnicalDetail data={product.technical_detail || []} />
      </div>
    ),
    [TAB_IDS.RELATED_ITEMS]: (
      <div className="mb-9">
        <RelatedProducts relatedProducts={relatedProducts} />
      </div>
    ),
    [TAB_IDS.BUNDLE]: (
      <div className="mb-9">
        <CompactRelatedProducts relatedProducts={productsInBundle.map(item => item.product)} />
      </div>
    ),
    [TAB_IDS.RECENTLY_VIEW]: (
      <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
        {recentlyView.map((item, index) => (
          <Link href={`/${item.subCate?.slug}/${item.slug}`} className="hover:opacity-50" key={index}>
            <div className="flex gap-3 items-center">
              <Image
                width={200}
                height={200}
                src={getImageUrl(item.imageUrl)}
                alt={item.imageAlt || "Dụng cụ vệ sinh Sao Việt"}
                className="w-16 h-16"
              />
              <p>{item.name}</p>
            </div>
          </Link>
        ))}
      </div>
    ),
  };

  return tabMap[id] || null;
};

const ProductDetailTabs = ({ product, description, relatedProducts, productsInBundle = [] }) => {
  const tabs = [
    { id: TAB_IDS.BUNDLE, title: "Sản phẩm đi kèm" },
    { id: TAB_IDS.DESCRIPTION, title: "Mô tả" },
    { id: TAB_IDS.SPECIFICATIONS, title: "Thông số kỹ thuật" },
    { id: TAB_IDS.RECENTLY_VIEW, title: "Sản phẩm vừa xem" },
    { id: TAB_IDS.RELATED_ITEMS, title: "Sản phẩm liên quan" },
  ];

  const [currentTab, setCurrentTab] = useState("");
  const [titles, setTitles] = useState([]);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(false);

  useEffect(() => {
    setTitles(Array.from(document.querySelectorAll(".tab-title")));
  }, []);

  // Dynamically compute the offset so the tab header sits just below the page header
  useEffect(() => {
    const computeOffset = () => {
      const headerEl = document.querySelector('.header');
      const headerItemsEl = document.querySelector('.header-items');
      const offset = headerItemsEl?.classList.contains('fixed-header')
        ? headerItemsEl.getBoundingClientRect().height || 0
        : headerEl?.getBoundingClientRect().height || headerItemsEl?.getBoundingClientRect().height || 0;
      setHeaderHeight(offset);
    };

    computeOffset();
    const handleResize = () => computeOffset();
    window.addEventListener('scroll', handleResize, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 1) {
            setCurrentTab(entry.target?.dataset.id);
          }
        });
      },
      { rootMargin: "0% 0% -50% 0%", threshold: 1 }
    );

    titles.forEach(title => observer.observe(title));
    return () => observer.disconnect();
  }, [titles]);

  useEffect(() => {
    const handleScroll = () => {
      const tabHeader = document.querySelector(".tab-header");
      const content = document.querySelector(".tab-header-content");
      if (!tabHeader || !content) return;

      const headerLeft = tabHeader.getBoundingClientRect().left;
      const contentLeft = content.firstChild?.getBoundingClientRect().left || 0;
      const contentRight = content.lastChild?.getBoundingClientRect().right || 0;
      const headerRight = tabHeader.getBoundingClientRect().right;

      setShowLeftChevron(Math.trunc(contentLeft) - Math.trunc(headerLeft) < 0);
      setShowRightChevron(Math.trunc(headerRight) - Math.trunc(contentRight) < 0);
    };

    const content = document.querySelector(".tab-header-content");
    content?.addEventListener("scroll", handleScroll);
    return () => content?.removeEventListener("scroll", handleScroll);
  });

  const scroll = (direction) => {
    const content = document.querySelector(".tab-header-content");
    if (!content) return;
    content.scrollLeft += direction === 'left' ? -70 : 70;
  };

  return (
    <>
      <div className="product-tabs-sticky" style={{ top: `${headerHeight}px` }}>
        <div className="relative bg-white tab-header">
          <div className="flex items-center w-full overflow-auto tab-header-content flex-wrap">
            {tabs.map((tab, index) => (
              <Button
                key={index}
                data-id={tab.id}
                className={`uppercase font-bold h-[39px] rounded-none shrink-0 px-5 py-3 mr-0.5 last:mr-0 transition tab
                  ${currentTab === tab.id ? 'text-[#ffed00] bg-[#333]' : 'text-[#2b2b2b] bg-[#f8f8f8]'}`}
                onPress={() => {
                  window.scrollTo({
                    top: titles[index].getBoundingClientRect().top + window.scrollY - 60,
                    behavior: "smooth"
                  });
                }}
              >
                {tab.title}
              </Button>
            ))}
          </div>
          {showLeftChevron && (
            <ChevronLeft
              size="20"
              className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-[rgba(255,255,255,0.4)] z-1000 cursor-pointer"
              onClick={() => scroll('left')}
            />
          )}
          {showRightChevron && (
            <ChevronRight
              size="20"
              className="absolute top-1/2 -translate-y-1/2 right-0 w-7 h-7 bg-[rgba(255,255,255,0.4)] z-1000 cursor-pointer"
              onClick={() => scroll('right')}
            />
          )}
        </div>
      </div>
      <div>
        {tabs.map((tab, index) => (
          <div key={index}>
            <div
              className="uppercase font-bold text-[#2b2b2b] pb-3 mt-4 mb-7 mr-0.5 last:mr-0 border-b border-[#e3e3e3] tab-title"
              data-id={tab.id}
            >
              {tab.title}
            </div>
            <TabContent
              id={tab.id}
              product={product}
              description={description}
              relatedProducts={relatedProducts}
              productsInBundle={productsInBundle}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default ProductDetailTabs;
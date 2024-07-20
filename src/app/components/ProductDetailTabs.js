"use client";
import { useState, useEffect } from "react";
import { Button } from '@nextui-org/react';
import RelatedProducts from "@/components/RelatedProducts";
import TechnicalDetail from './TechnicalDetail';
import parse from 'html-react-parser'
import "./ProductDetailTabs.css"

const ID = {
  DESCRIPTION: "DESCRIPTION",
  FEATURES: "FEATURES",
  SPECIFICATIONS: "SPECIFICATIONS",
  VIDEOS: "VIDEOS",
  COMPONENT_PARTS: "COMPONENT_PARTS",
  RELATED_ITEMS: "RELATED_ITEMS"
};

const TabContent = ({ id, product }) => {
  switch (id) {
    case ID.DESCRIPTION:
      return (
        <div className="text-sm whitespace-pre-wrap mb-9 product-description">
          {product.description ? parse(product.description) : ""}
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
                    <img src={process.env.NEXT_PUBLIC_FILE_PATH + product?.image?.path} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <p className="font-bold my-1.5">Ứng dụng Home & Garden</p>
                  <p>Ứng dụng Kärcher Home & Garden giúp bạn trở thành một chuyên gia làm sạch. Tận dụng kiến ​​thức sâu rộng về Kärcher của chúng tôi để có kết quả làm sạch hoàn hảo. Dịch vụ toàn diện tiện lợi - tất cả thông tin trên thiết bị, ứng dụng và cổng Dịch vụ của chúng tôi.</p>
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
              <TechnicalDetail data={product.technical_detail}></TechnicalDetail>
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
          <RelatedProducts query={`?size=10&page=1&productType=PRODUCT&categoryId=${product.categoryId}`} />
        </div>
      )
    case ID.COMPONENT_PARTS:
      return (
        <div className="mb-9">
          <RelatedProducts query={`/?size=10&page=1&productType=COMPONENT_PART&productId=${product.id}`} />
        </div>
      )
    default:
      return <></>
  }
}

export default ({ product }) => {
  const tabs = [
    { id: ID.DESCRIPTION, title: "Mô tả" },
    // { id: ID.FEATURES, title: "Tính năng và ưu điểm" },
    { id: ID.SPECIFICATIONS, title: "Thông số kỹ thuật" },
    { id: ID.COMPONENT_PARTS, title: "Phụ kiện" },
    { id: ID.RELATED_ITEMS, title: "Sản phẩm liên quan" },
  ];

  const [currentTab, setCurrentTab] = useState("");
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    const titleList = document.querySelectorAll(".tab-title");
    const titleArray = Array.from(titleList);
    setTitles(titleArray);
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

  return (
    <div>
      <div className="sticky top-0 flex items-center w-full bg-white z-10">
        {
          tabs.map((tab, index) => {
            return (
              <Button
                className={`
                              uppercase font-bold  h-[39px] rounded-none px-5 py-3 mr-0.5 last:mr-0 transition tab
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

                <TabContent id={tab.id} product={product} />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
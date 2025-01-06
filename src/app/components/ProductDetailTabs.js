"use client";
import { useState, useEffect } from "react";
import { Button } from '@nextui-org/react';
import { ChevronLeft, ChevronRight } from "lucide-react";
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
        <div className={`
          [&_img]:max-w-[75%]
          [&_img]:mx-auto
          [&_a]:text-primary
          [&_h2]:mt-[1.25em]
          [&_p]:my-[1.125em]
          max-w-full
          prose
          mb-9 product-description
        `}>
          {product.description ? parse(`<h3><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif"><strong>Xe vắt nước lau sàn 42L màu vàng, tay ép giữa (SKU: FG757688YEL)</strong></span></h3><h4><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif"><strong>Tổng quan sản phẩm:</strong></span></h4><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif">Xe vắt nước lau sàn 42L màu vàng Rubbermaid WaveBrake® được thiết kế để tối ưu hóa hiệu suất vệ sinh, giảm thiểu nguy cơ tai nạn và tăng cường năng suất làm việc. Với công nghệ WaveBrake® tiên tiến, sản phẩm giúp giảm bắn nước đến 80%, đồng thời đảm bảo độ bền và hiệu quả vượt trội. Đây là lựa chọn lý tưởng cho các không gian như trường học, văn phòng, nhà hàng, bệnh viện, hoặc bất kỳ cơ sở nào yêu cầu vệ sinh chuyên nghiệp.</span></p><h4><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif"><strong>Ưu điểm nổi bật:</strong></span></h4><ol class="list-decimal"><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif"><strong>Giảm bắn nước đến 80%</strong>:</span></p><ul class="list-disc"><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif">Công nghệ WaveBrake® độc quyền với các tấm chắn baffle giúp giảm thiểu tối đa tình trạng bắn nước khi di chuyển, giữ cho môi trường làm việc an toàn và sạch sẽ.</span></p></li></ul></li><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif"><strong>Dễ dàng đổ nước bẩn</strong>:</span></p><ul class="list-disc"><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif">Thiết kế xả nước bằng bàn đạp chân giúp thoát nước nhanh chóng mà không cần nâng thùng, giảm áp lực cho người sử dụng.</span></p></li><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif">Gờ dẫn nước và vòi rót tích hợp giúp kiểm soát dòng chảy, tránh làm đổ nước ra sàn.</span></p></li></ul></li><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif"><strong>Tay ép giữa bền bỉ</strong>:</span></p><ul class="list-disc"><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif">Tay ép được làm từ thép ống và có tay cầm thoải mái, cho phép điều chỉnh độ ẩm của cây lau phù hợp với từng bề mặt làm sạch. Được kiểm nghiệm lên đến 200.000 chu kỳ ép.</span></p></li></ul></li><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif"><strong>Di chuyển mượt mà, không gây trầy xước</strong>:</span></p><ul class="list-disc"><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif">Bánh xe không để lại vết giúp bảo vệ bề mặt sàn và dễ dàng di chuyển trên mọi loại sàn.</span></p></li></ul></li><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif"><strong>Tích hợp tay cầm và thiết kế tiện dụng</strong>:</span></p><ul class="list-disc"><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif">Tay cầm tích hợp và thiết kế gờ đặt tại bồn rửa giúp việc nâng và đổ nước trở nên dễ dàng, ổn định và an toàn hơn.</span></p></li></ul></li><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif"><strong>Khả năng chứa nước lớn</strong>:</span></p><ul class="list-disc"><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif">Dung tích 42L đáp ứng tốt nhu cầu làm sạch các khu vực có diện tích lớn, giảm số lần thay nước, tiết kiệm thời gian và công sức.</span></p></li></ul></li><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif"><strong>Tuổi thọ cao</strong>:</span></p><ul class="list-disc"><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif">Thùng và tay ép được thiết kế từ nhựa đúc và thép cao cấp, đảm bảo độ bền vượt trội. Tay ép đi kèm bảo hành lên đến 5 năm.</span></p></li></ul></li></ol><h4><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif"><strong>Công dụng:</strong></span></h4><ul class="list-disc"><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif"><strong>Làm sạch sàn hiệu quả</strong>: Giảm bắn nước, tăng hiệu quả vệ sinh và giữ môi trường an toàn.</span></p></li><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif"><strong>Tiết kiệm thời gian và công sức</strong>: Thiết kế tiện dụng giúp nhân viên vệ sinh hoàn thành công việc nhanh chóng và dễ dàng hơn.</span></p></li><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif"><strong>Ngăn ngừa lây nhiễm chéo</strong>: Thùng nước bẩn (bán riêng) giúp tách biệt nước bẩn và dung dịch lau sàn, giữ sạch dung dịch vệ sinh.</span></p></li></ul><h4><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif"><strong>Khu vực sử dụng:</strong></span></h4><ul class="list-disc"><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif"><strong>Trường học và văn phòng</strong>: Đáp ứng nhu cầu vệ sinh không gian lớn, nhiều người qua lại.</span></p></li><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif"><strong>Nhà hàng và khách sạn</strong>: Giữ không gian sạch sẽ, tạo ấn tượng chuyên nghiệp.</span></p></li><li><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif"><strong>Bệnh viện và cơ sở y tế</strong>: Đảm bảo tiêu chuẩn vệ sinh cao nhất, ngăn ngừa lây nhiễm.</span></p></li></ul><p><span style="color: rgb(0, 0, 0); font-family: Arial, sans-serif">Sao Việt là nhà phân phối Xe vắt nước lau sàn 42L màu vàng, tay ép giữa (SKU: FG757688YELchính hãng tại Việt Nam, đảm bảo chất lượng, hiệu quả sử dụng cao và độ bền lâu dài. Mua hàng tại Sao Việt để trải nghiệm dịch vụ tư vấn &amp; chăm sóc khách hàng tận tình, chính sách đổi trả linh hoạt và nhiều ưu đãi hấp dẫn khác. Để biết thêm thông tin sản phẩm cũng như những đặc quyền mua hàng dành riêng cho bạn/doanh nghiệp bạn - liên hệ ngay HOTLINE 090 380 29 79</span></p>`) : ""}
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
    if(headerItems) {
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
    if(!tabHeaderContent) return;
    tabHeaderContent.scrollLeft -= 70;
  }
  
  const scrollToRight = () => {
    const tabHeaderContent = document.querySelector(".tab-header-content");
    if(!tabHeaderContent) return;
    tabHeaderContent.scrollLeft += 70;
  }

  return (
    <div>
      <div
        className="sticky top-0 z-10"
        style={{ top: `${headerHeight}px` }}
      >
        <div className="relative bg-white tab-header">
          <div className="flex items-center w-full overflow-auto tab-header-content">
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

                <TabContent id={tab.id} product={product} />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
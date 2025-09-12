"use client";

import { Image, Link } from "@heroui/react";
import ProductCarousel from "@/components/product/ProductCarousel";

const brandDescription = {
  RUBBERMAID: {
    logo: "/brand/Rubbermaid.webp",
    slug: "thuong-hieu-rubbermaid",
    description: `Newell Rubbermaid, thành lập năm 1903 tại Thành phố Atlanta, tiểu bang Georgia, Hoa Kỳ. Thương hiệu Rubbermaid Commercial Products, 
    tiên phong trong các giải pháp vệ sinh, tạo ra các sản phẩm ưu việt, được người dùng tin tưởng lựa chọn.`,
  },
  MAPA: {
    logo: "/brand/Logo-Mapa.webp",
    slug: "thuong-hieu-mapa",
    description: `Từ khi chiếc găng tay nhung đầu tiên được sản xuất năm 1957, 
    lịch sử của Mapa Professional luôn định hướng với một tầm nhìn: bảo vệ sức khỏe nhân viên, đảm bảo môi trường làm việc sạch sẽ, an toàn & lành mạnh.`,
  },
  "KLEEN-TEX": {
    logo: "/brand/KLEEN-TEX.webp",
    slug: "thuong-hieu-kleen-tex",
    description: `Hơn 50 năm phát triển, Kleen-Tex cung cấp loạt giải pháp về thảm, mang đến trải nghiệm tuyệt vời trong từng bước chân. 
    Thảm trải lối ra vào, logo nhiều màu, chống mỏi hay bất kỳ loại thảm cho ngành công nghiệp.`,
  },
  MOERMAN: {
    logo: "/brand/Logo-Moerman.webp",
    slug: "thuong-hieu-moerman",
    description: `Được thành lập năm 1885 - suốt chiều dài lịch sử - đến nay dụng cụ vệ sinh sàn, 
    kính Moerman vẫn được duy trì như thương hiệu nổi tiếng vốn có của nó. 
    Moerman, dụng cụ vệ sinh kính nổi tiếng toàn cầu.`,
  },
  "KIMBERLY-CLARK PROFESSIONAL": {
    logo: "/brand/Logo-Kimberly-Clark.webp",
    slug: "thuong-hieu-kimberly-clark",
    description: `Kimberly-Clark Corporation - tập đoàn chuyên sản xuất hàng hóa tiêu dùng, đặc biệt là các sản phẩm về Giấy. 
    Thành lập năm 1872 với hơn 140 năm hoạt động, khăn giấy cao cấp Kimberly-Clark luôn là tiện ích cho mọi gia đình.`,
  },
  "GHIBLI": {
    logo: "/brand/Logo-Ghibli.svg",
    slug: "thuong-hieu-ghibli",
    description: `Ghibli, nhà sản xuất thiết bị làm sạch thành lập năm 1968 tại Ý. 
    Với hơn 50 năm kinh nghiệm, Ghibli giờ đây đã là Công ty hàng đầu trong lĩnh vực máy móc làm vệ sinh tại Châu Âu.`,
  },
};

const PopularBrandCard = ({ products, selectedBrand }) => {
  const responsive = {
    largeDesktop: {
      breakpoint: { max: 3000, min: 1281 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 1281, min: 464 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="lg:grid xl:grid-cols-6 grid-cols-1">
      <div className="pt-2 col-span-2 bg-yellow-400 shadow-lg rounded-md w-full xl:h-[370px] h-[270px]">
        <div className="flex justify-center">
          {brandDescription[selectedBrand]?.logo && (
            <Link href={`/${brandDescription[selectedBrand].slug}`} className="mx-auto max-h-full">
              <Image width={220} src={brandDescription[selectedBrand].logo} alt={brandDescription[selectedBrand].slug || "Dụng cụ vệ sinh Sao Việt"} />
            </Link>
          )}
        </div>

        <div className="px-5 text-justify overflow-auto scrollbar-hide">
          {brandDescription[selectedBrand]?.description}
        </div>
      </div>

      <div className="col-span-4 py-2 pl-2">
        <ProductCarousel products={products} responsive={responsive} />
      </div>
    </div>

  );
};

export default PopularBrandCard
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BreadcrumbItem, Breadcrumbs, Button } from "@nextui-org/react";
import { ShoppingCart } from "lucide-react";
import TechnicalDetail from "@/components/TechnicalDetail";
import Skeleton from "@/components/Skeleton";
import SaleDetail from "@/components/SaleDetail";
import RelatedProducts from "@/components/RelatedProducts";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import ProductDetailTabs from "@/components/ProductDetailTabs";
import { motion } from "framer-motion";

const Product = () => {
  const [product, setProduct] = useState({});
  const { _id } = useParams();
  useEffect(() => {
    fetch(`/api/products/${_id}?includeTechnical=true&includeSale=true`).then((res) => res.json()).then(json => setProduct(json))
  }, [_id])
  if (!product.id) {
    return <Skeleton />
  }
  // return (
  //   <div>
  //     <section className="overflow-hidden bg-white py-11 font-poppins">
  //       <div className="max-w-6xl px-4 py-4 mx-auto lg:py-8 md:px-6">
  //         <div className="flex flex-wrap -mx-4">
  //           <div className="w-full px-4 md:w-1/2 ">
  //             <div className="sticky top-0 z-30 overflow-hidden pb-6">
  //               <div className="relative mb-6 lg:mb-10 lg:h-2/4 ">
  //                 <Image
  //                   width={400}
  //                   height={400}
  //                   src={`${process.env.NEXT_PUBLIC_FILE_PATH + product.image?.path}`}
  //                   alt={`${product.image?.imageAlt}`}
  //                   className="object-cover w-full lg:h-full "
  //                 />
  //               </div>
  //             </div>
  //             <div>
  //               <div className="font-semibold">Mô tả sản phẩm</div>
  //               <div className="text-justify">
  //                 {
  //                   product.description
  //                 }
  //               </div>
  //             </div>
  //           </div>
  //           <div className="w-full px-4 md:w-1/2 ">
  //             <div>
  //               <h2 className="max-w-xl mt-2 mb-6 text-2xl font-bold  md:text-4xl">
  //                 {product?.name}
  //               </h2>
  //             </div>
  //             <SaleDetail data={product.saleDetails}></SaleDetail>
  //             <TechnicalDetail data={product.technicalDetails}></TechnicalDetail>

  //             <RelatedProducts productId={_id}></RelatedProducts>
  //           </div>
  //         </div>
  //       </div>
  //     </section>
  //   </div>
  // );

  return (
    <div>
      <div className="bg-[#ffed00] py-2.5">
        <div className="container">
          <Breadcrumbs
            variant="light"
            className="font-semibold mt-[15px]"
            itemClasses={{
              base: "[&>span]:text-black"
            }}
          >
            <BreadcrumbItem>Trang chủ</BreadcrumbItem>
            <BreadcrumbItem>Hàng gia dụng</BreadcrumbItem>
            <BreadcrumbItem>Máy phun rửa áp lực cao</BreadcrumbItem>
            <BreadcrumbItem>K 2 Power Control Car & Home 16736070</BreadcrumbItem>
          </Breadcrumbs>

          <h1 className="text-[30px] font-extrabold m-[10px_0_18px]">{product.name}</h1>
          <p className="text-sm truncate mb-2.5">{product.description}</p>
        </div>
      </div>

      <div className="container py-[30px]">
        <div className="text-sm text-white bg-[#b61a2d] p-4 pt-2.5 mb-4">
          <p>Lưu ý: Máy không bao gồm bộ dây cấp nước.</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
        </div>

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-start bg-[#f8f8f8] mb-5"
        >
          <div className="relative sm:w-7/12 md:w-8/12 w-full bg-white border border-[3px] border-[#f8f8f8]">
            <ProductImageCarousel />
          </div>

          <div className="sm:w-5/12 md:w-4/12 w-full">
            <div className="p-5 border-white border-b-[3px] bg-[#f8f8f8]">
              <p className="text-[25px] line-through">5.095.637 ₫</p>
              <p className="text-[25px] text-[#b61a2d]">Giảm 15%</p>
              <p className="text-[32px] font-medium text-[#b61a2d] mb-2.5">4.330.000 ₫</p>
              <p className="text-sm mb-[30px]">Đã bao gồm VAT, chưa bao gồm phí giao hàng</p>
              <p className="text-sm mb-2.5">Giao hàng trong vòng 1-3 ngày</p>
              <p className="text-sm mb-2.5">Mã sản phẩm: 1.673-607.0</p>
              <Button className="text-sm font-bold uppercase bg-gradient-to-b from-[#ffed00] to-[#fff466] rounded-none w-full h-[45px] border border-[#e3e3e3] mb-2.5">
                <ShoppingCart size="20" className="mr-1" />
                Thêm vào giỏ hàng
              </Button>
            </div>
            <div className="text-sm p-5 bg-[#f8f8f8]">
              <p className="mb-2.5">Bạn cần trợ giúp?</p>
              <p className="font-bold mb-2.5">Đường dây nóng: 1900 5715 99</p>
              <Button className="text-sm font-bold uppercase bg-gradient-to-b from-[#ffed00] to-[#fff466] rounded-none w-full h-[45px] border border-[#e3e3e3] mb-2.5">
                Liên hệ
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <ProductDetailTabs product={product} />
        </motion.div>
      </div>
    </div>
  );
};

export default Product;

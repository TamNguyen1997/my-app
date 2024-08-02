"use client";

import { useEffect, useState } from "react";
import { BreadcrumbItem, Breadcrumbs, Button, Link } from "@nextui-org/react";
import Skeleton from "@/components/Skeleton";
import SaleDetail from "@/components/SaleDetail";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import ProductDetailTabs from "@/components/ProductDetailTabs";
import { motion } from "framer-motion";

export default ({ id }) => {
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  useEffect(() => {
    fetch(`/api/products/${id}?includeTechnical=true&includeSale=true`).then((res) => res.json()).then(product => {
      setProduct(product)
      if (product.id) {
        fetch(`/api/products/${product.id}/images`).then((res) => res.json()).then((json) => {
          setImages(json.map(item => process.env.NEXT_PUBLIC_FILE_PATH + item.image.path))
        })
      }
    })

  }, [id])
  if (!product?.id) {
    return <Skeleton />
  }

  return (
    <div>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/${product.subCate?.slug}/${id}`} />
      <div className="bg-[#ffed00] py-2.5">
        <div className="container">
          <Breadcrumbs
            variant="light"
            className="font-semibold mt-[15px]"
            itemClasses={{
              base: "[&>span]:text-black [&>span]:whitespace-normal"
            }}
          >
            {
              product.category ?
                <BreadcrumbItem href={`/${product.category.slug}`}>{product.category.name}</BreadcrumbItem> : ""
            }
            {
              product.subCate ?
                <BreadcrumbItem href={`/${product.subCate ? product.subCate.slug : "san-pham"}`}>{product.subCate.name}</BreadcrumbItem> : ""
            }
            <BreadcrumbItem>{product.name}</BreadcrumbItem>
          </Breadcrumbs>
        </div>
      </div>

      <div className="container py-[30px]">

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-start bg-[#f8f8f8] mb-5"
        >
          <div className="relative sm:w-7/12 md:w-8/12 w-full bg-white border-[3px] border-[#f8f8f8]">
            <ProductImageCarousel items={images} />
          </div>

          <div className="sm:w-5/12 md:w-4/12 w-full">
            <div className="p-5 border-white border-b-[3px] bg-[#f8f8f8]">
              <SaleDetail saleDetails={product.saleDetails} product={product} />
            </div>
            <div className="text-sm p-5 bg-[#f8f8f8]">
              <p className="mb-2.5">Bạn cần trợ giúp?</p>
              <p className="font-bold mb-2.5">Đường dây nóng: 1900 5715 99</p>
              <Button className="text-sm font-bold uppercase bg-gradient-to-b from-[#ffed00] to-[#fff466] rounded-none w-full h-[45px] border border-[#e3e3e3] mb-2.5">
                <Link isExternal href="https://zalo.me/0902405225" className="text-black">
                  Liên hệ
                </Link>
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

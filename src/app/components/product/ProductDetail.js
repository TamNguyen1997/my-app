"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { BreadcrumbItem, Breadcrumbs, Button, Link } from "@heroui/react";
import SaleDetail from "@/components/SaleDetail";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import ProductDetailTabs from "@/components/ProductDetailTabs";
import { motion } from "framer-motion";
import { addRecentlyView } from "@/lib/product";

export const ProductDetailContext = createContext();

const ProductDetail = ({ product = {}, description, relatedProducts = [], productsInBundle = [] }) => {
  const [selectedSaleDetail, setSelectedSaleDetail] = useState({});
  useEffect(() => {
    addRecentlyView(product)
  }, [product])

  const getImages = useCallback(() => {
    return product.product_on_image.map(item => item.imageUrl) || [product.imageUrl].filter(item => item)
  }, [product])

  const [mainImage, setMainImage] = useState(getImages()[0])

  const getMainImage = useCallback(() => {
    if (!mainImage) {
      return getImages()[0]
    }
    return mainImage
  }, [getImages, mainImage])

  return (
    <>
      <ProductDetailContext.Provider value={{
        selectedSaleDetail, setSelectedSaleDetail
      }}>
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

        <div className="md:container w-full xl:min-w-[65%] lg:min-w-[80%] py-[30px] grid md:grid-cols-5 grid-cols-1 gap-2">
          <div className="md:col-span-3">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="flex flex-wrap items-start bg-[#f8f8f8] mb-5"
            >
              <div className="relative bg-white border-[3px] border-[#f8f8f8] w-full">
                <ProductImageCarousel items={getImages()} mainImage={getMainImage() || product.imageUrl || ""}
                  selectedSaleDetailImage={selectedSaleDetail?.sale_detail_on_image ?
                    selectedSaleDetail?.sale_detail_on_image[0]?.imageUrl : null} />
                <div className="md:hidden bg-white">
                  <div className="p-5 border-white border-b-[3px] bg-[#f8f8f8]">
                    <SaleDetail saleDetails={product.saleDetails || []} product={product} />
                  </div>
                  <div className="text-sm px-5 pt-2 bg-[#f8f8f8]">
                    <p className="mb-2.5">Bạn cần trợ giúp? <span className="font-bold mb-2.5">Đường dây nóng: 090 380 2979</span></p>
                    <Link isExternal href="https://zalo.me/0903802979" className="text-black w-full h-[45px]">
                      <Button className="text-sm font-bold uppercase bg-gradient-to-b from-[#ffed00] to-[#fff466] rounded-none w-full border border-[#e3e3e3] mb-2.5">
                        Liên hệ
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="hidden md:block md:col-span-2"
          >
            <div className="p-5 border-white border-b-[3px] bg-[#f8f8f8]">
              <SaleDetail saleDetails={product.saleDetails || []} product={product} setImage={setMainImage} />
            </div>
            <div className="text-sm px-5 pt-2 bg-[#f8f8f8]">
              <p className="mb-2.5">Bạn cần trợ giúp? <span className="font-bold mb-2.5">Đường dây nóng: 090 380 2979</span></p>
              <Link isExternal href="https://zalo.me/0903802979" className="text-black w-full h-[45px]">
                <Button className="text-sm font-bold uppercase bg-gradient-to-b from-[#ffed00] to-[#fff466] rounded-none w-full border border-[#e3e3e3] mb-2.5">
                  Liên hệ
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="md:container w-full xl:min-w-[65%] lg:min-w-[80%] py-[30px]"
        >
          <ProductDetailTabs
            product={product}
            description={description}
            relatedProducts={relatedProducts}
            productsInBundle={productsInBundle}
          />
        </motion.div>
      </ProductDetailContext.Provider>
    </>
  );
};

export default ProductDetail
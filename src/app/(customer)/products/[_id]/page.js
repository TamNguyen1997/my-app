"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TechnicalDetail from "@/components/TechnicalDetail";
import Skeleton from "@/components/Skeleton";
import SaleDetail from "@/components/SaleDetail";
import RelatedProducts from "@/components/RelatedProducts";

const Product = () => {
  const [product, setProduct] = useState({});
  const { _id } = useParams();
  useEffect(() => {
    fetch(`/api/products/${_id}?includeTechnical=true&includeSale=true`).then((res) => res.json()).then(json => setProduct(json))
  }, [_id])
  if (!product.id) {
    return <Skeleton />
  }
  return (
    <div>
      <section className="overflow-hidden bg-white py-11 font-poppins">
        <div className="max-w-6xl px-4 py-4 mx-auto lg:py-8 md:px-6">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4 md:w-1/2 ">
              <div className="sticky top-0 z-30 overflow-hidden pb-6">
                <div className="relative mb-6 lg:mb-10 lg:h-2/4 ">
                  <Image
                    width={400}
                    height={400}
                    src={`${process.env.NEXT_PUBLIC_FILE_PATH + product.image?.path}`}
                    alt={`${product.image?.imageAlt}`}
                    className="object-cover w-full lg:h-full "
                  />
                </div>
              </div>
              <div>
                <div className="font-semibold">Mô tả sản phẩm</div>
                <div className="text-justify">
                  {
                    product.description
                  }
                </div>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/2 ">
              <div>
                <h2 className="max-w-xl mt-2 mb-6 text-2xl font-bold  md:text-4xl">
                  {product?.name}
                </h2>
              </div>
              <SaleDetail data={product.saleDetails}></SaleDetail>
              <TechnicalDetail data={product.technical_detail}></TechnicalDetail>

              <RelatedProducts productId={_id}></RelatedProducts>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product;

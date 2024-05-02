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
    const fetchProduct = () => {
      fetch(`/api/products/${_id}`).then((res) => res.json()).then(json => setProduct(json))
    };

    fetchProduct()
  }, [_id]);
  if (!product.id) {
    return <Skeleton />
  }
  return (
    <div>
      <section className="overflow-hidden bg-white py-11 font-poppins ">
        <div className="max-w-6xl px-4 py-4 mx-auto lg:py-8 md:px-6">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4 md:w-1/2 ">
              <div className="sticky top-0 z-30 overflow-hidden pb-6">
                <div className="relative mb-6 lg:mb-10 lg:h-2/4 ">
                  <Image
                    width={400}
                    height={400}
                    src={
                      product?.imageUrl ? (
                        product.imageUrl
                      ) : (
                        <div className="flex items-center justify-center lg:w-1/2  h-96 bg-gray-300 rounded  ">
                          <svg
                            className="w-10 h-10 text-gray-200 "
                            ariaHidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 18"
                          >
                            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                          </svg>
                        </div>
                      )
                    }
                    alt="product"
                    className="object-cover w-full lg:h-full "
                  />
                </div>
              </div>
              <div>
                <div className="font-semibold">Mô tả sản phẩm</div>
                <div> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc sed augue lacus viverra vitae congue. Scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam. Elementum eu facilisis sed odio morbi quis commodo. Proin fermentum leo vel orci porta. Sit amet justo donec enim diam vulputate ut pharetra sit. Nec ultrices dui sapien eget mi proin sed libero. Porta nibh venenatis cras sed felis eget velit. Tempus quam pellentesque nec nam aliquam sem. Eu lobortis elementum nibh tellus molestie nunc non blandit. Neque viverra justo nec ultrices dui sapien eget. Metus vulputate eu scelerisque felis imperdiet proin. Risus feugiat in ante metus dictum at tempor. Ullamcorper velit sed ullamcorper morbi. Morbi tincidunt ornare massa eget egestas purus viverra accumsan. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor aliquam. Mauris commodo quis imperdiet massa. Turpis egestas sed tempus urna et. Nunc consequat interdum varius sit amet. Rhoncus dolor purus non enim. Urna molestie at elementum eu. Orci ac auctor augue mauris augue neque. Neque volutpat ac tincidunt vitae. Elit sed vulputate mi sit amet mauris commodo. Et malesuada fames ac turpis egestas sed tempus urna. Venenatis urna cursus eget nunc scelerisque viverra mauris in aliquam. Malesuada fames ac turpis egestas integer eget aliquet. Orci nulla pellentesque dignissim enim sit amet venenatis urna. Orci porta non pulvinar neque laoreet. Rutrum quisque non tellus orci ac auctor augue. Dui id ornare arcu odio ut sem nulla pharetra diam. Nunc scelerisque viverra mauris in aliquam sem fringilla ut. Nullam eget felis eget nunc lobortis mattis aliquam. Vehicula ipsum a arcu cursus vitae congue mauris. Tellus in metus vulputate eu scelerisque felis.</div>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/2 ">
              <div>
                <h2 className="max-w-xl mt-2 mb-6 text-2xl font-bold  md:text-4xl">
                  {product?.name}
                </h2>
              </div>
              <SaleDetail productId={_id}></SaleDetail>
              <TechnicalDetail data={product.technicalDetails}></TechnicalDetail>

              <RelatedProducts productId={_id}></RelatedProducts>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product;

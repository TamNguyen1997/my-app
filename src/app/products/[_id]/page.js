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
      <section className="overflow-hidden bg-white py-11 font-poppins">
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
                        <div className="flex items-center justify-center lg:w-1/2  h-96 bg-gray-300 rounded">
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
                <p>Ghibli & Wirbel V 10: Máy hút bụi tiện lợi cho gia đình</p>
                <p>Máy hút bụi là thiết bị gia dụng nên trang bị cho gia đình. Chúng giúp quá trình làm sạch nhà cửa trở nên nhanh chóng, dễ dàng và hiệu quả hơn.</p>
                <p>Máy hút bụi V 10 là một lựa chọn tuyệt vời cho các gia đình cần một chiếc máy hút bụi nhỏ gọn nhưng sở hữu nhiều tính năng và lực hút mạnh mẽ.</p>
                <p>Vậy, V 10 có gì đặc biệt mà rất phù hợp để sử dụng tại gia đình?</p>
                <p>Thiết kế nhỏ gọn, tiện lợi</p>
                <p>Máy hút bụi V 10 có thiết kế nhỏ gọn, trọng lượng chỉ 4,5 kg, nên rất dễ để di chuyển và cất giữ tại gia đình. Kích thước nhỏ gọn giúp máy hút bụi dễ dàng len lỏi vào những ngóc ngách trong nhà, hút sạch bụi bẩn ở mọi nơi.</p>
                <p>Máy hút bụi V 10 được trang bị động cơ mạnh mẽ, tạo ra lực hút lên đến 150 mbar, giúp hút sạch hầu hết các loại bụi bẩn có trong căn nhà. Lực hút mạnh sẽ đẩy nhanh quá trình làm sạch nhà cửa, trả lại không gian sạch thoáng.</p>
                <p>Độ ồn thấp</p>
                <p>Máy hút bụi V 10 có độ ồn thấp, chỉ 76 dB(A), không quá ồn khi sử dụng. Độ ồn thấp nên máy không ảnh hưởng đến sinh hoạt của gia đình.</p>
                <p>Xuất xứ Italy, công nghệ châu Âu</p>
                <p>Máy hút bụi V 10 được trang bị các công nghệ tiên tiến của Ghibli&Wirbel, đảm bảo chất lượng và độ bền cao. Máy hút bụi được làm từ chất liệu cao cấp, có khả năng chịu lực, chịu nhiệt tốt.</p>
                <p>Với những ưu điểm trên, máy hút bụi Ghibli&Wirbel V 10 là một lựa chọn tốt cho những gia đình đang tìm kiếm một chiếc máy hút bụi nhỏ gọn nhưng có lực hút mạnh mẽ, mà giá cả lại rất phải chăng.</p>
                <br></br>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/2 ">
              <div>
                <h2 className="max-w-xl mt-2 mb-6 text-2xl font-bold  md:text-4xl">
                  {product?.name}
                </h2>
              </div>
              <SaleDetail data={product.saleDetails}></SaleDetail>
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

import { Button } from "@heroui/react"
import { getPrice, getOriginalPrice } from "@/lib/product"
import Image from "next/image"
import Link from "next/link"

const ProductCard = ({ product, compact = false }) => {
  return (
    <div className={`group-hover:opacity-50 hover:shadow-md transition bg-white
    ${compact ? "max-w-[150px] hover:-translate-y-1" : "max-w-[300px] hover:-translate-y-2 border"} flex flex-col h-full`}>
      <Link
        href={`/${product.subCate ? product.subCate.slug : "san-pham"}/${product.slug}`}>
        <Image
          width={compact ? 100 : 200}
          height={compact ? 100 : 200}
          srcSet={`${product.imageUrl}?w=400 400w, ${product.imageUrl}?w=800 800w`}
          src={product.imageUrl || "/default-featured-image.webp"}
          alt={product.imageAlt || "Dụng cụ vệ sinh Sao Việt"}
          className={`flex flex-col ${compact ? "lg:h-[125px] h-[100px]" : "lg:h-[250px] h-[200px]"}  rounded-md overflow-hidden mx-auto`}
          loading="eager"
          priority="true"
        />
        <div className={`${compact ? "py-2 w-full h-10" : "py-3 w-full h-20"}`}>
          <p
            className={`px-2 grow mx-auto sm:text-base ${compact ? "text-small" : "text-lg"} text-gray-700 line-clamp-2 font-roboto text-center`}>
            {product.name}
          </p>
        </div>

        {getPrice(product) ? (
          <div className={`py-3 ${compact ? "h-10" : "h-14"} w-full`}>
            <p className="text-red-500 font-bold text-center">{getPrice(product)} đ</p>
            {getOriginalPrice(product) && (
              <span className="line-through text-red-500 opacity-60 text-small">
                <p className="font-bold text-center">{getOriginalPrice(product)} đ</p>
              </span>
            )}
          </div>
        ) : ""}
      </Link>

      {!getPrice(product) ? <Button
        className="flex font-bold uppercase bg-gradient-to-b from-[#ffed00] to-[#fff466] rounded-3xl w-[90%] h-8 m-auto"
        onPress={() => window.open("https://zalo.me/0902366617", "_blank")}>
        Liên hệ
      </Button> : ""}
    </div>

  )
}

export default ProductCard
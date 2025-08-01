import { Button } from "@heroui/react"
import { getPrice, getOriginalPrice } from "@/lib/product"
import Image from "next/image"
import Link from "next/link"

const ProductCard = ({ product }) => {
  return (
    <div className="group-hover:opacity-50 border hover:-translate-y-3 hover:shadow-md transition bg-white max-w-[300px] flex flex-col h-full max-h-[350px]">
    <Link
      href={`/${product.subCate ? product.subCate.slug : "san-pham"}/${product.slug}`}>
      <Image
        width={200}
        height={200}
        srcSet={`${product.imageUrl}?w=400 400w, ${product.imageUrl}?w=800 800w`}
        src={product.imageUrl || "/default-featured-image.webp"}
        alt={product.imageAlt || "Dụng cụ vệ sinh Sao Việt"}
        className="flex flex-col lg:h-[250px] h-[200px] rounded-md overflow-hidden mx-auto"
        loading="eager"
        priority="true"
      />
      <div className="py-3 border-b w-full h-20">
        <p
          className="px-2 grow mx-auto sm:text-base text-lg text-gray-700 line-clamp-2 font-roboto text-center">
          {product.name}
        </p>
      </div>
      
      {getPrice(product) ? (
        <div className="py-2 h-16 w-full">
          <p className="text-red-500 font-bold text-center">{getPrice(product)} đ</p>
          {getOriginalPrice(product) && (
            <span className="line-through text-red-500 opacity-60">
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
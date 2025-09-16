import { Button } from "@heroui/react"
import { getPrice, getOriginalPrice } from "@/lib/product"
import Image from "next/image"
import Link from "next/link"

const ProductCard = ({ product, compact = false }) => {
  const hasPromo = Array.isArray(product?.saleDetails)
    && product.saleDetails.some(sd => sd?.showPrice && (sd?.promotionalPrice ?? 0) > 0)

  const sizes = compact
    ? "(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 150px"
    : "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"

  return (
    <div className={`group transition bg-white rounded-xl border shadow-sm hover:shadow-md ${compact ? "max-w-[170px] hover:-translate-y-1" : "max-w-[300px] hover:-translate-y-2"} flex flex-col h-full duration-200`}>
      <Link href={`/${product.subCate ? product.subCate.slug : "san-pham"}/${product.slug}`}>
        <div className={`relative ${compact ? "aspect-[1/1]" : "aspect-[4/3]"} w-full overflow-hidden rounded-t-xl bg-white`}>
          {hasPromo && (
            <div className="absolute left-2 top-2 z-10 rounded-md bg-red-500/90 px-2 py-0.5 text-white text-[11px] font-semibold">
              Sale
            </div>
          )}
          <Image
            fill
            sizes={sizes}
            src={product.imageUrl || "/default-featured-image.webp"}
            alt={product.imageAlt || "Dụng cụ vệ sinh Sao Việt"}
            className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            priority={!compact}
            loading={compact ? "lazy" : "eager"}
          />
        </div>
        <div className="px-2 py-3 w-full min-h-20">
          <p className={`grow mx-auto sm:text-base ${compact ? "text-small" : "text-[15px] md:text-[16px]"} text-gray-800 line-clamp-2 font-roboto text-center`}>
            {product.name}
          </p>
        </div>

        {getPrice(product) ? (
          <div className={`pb-3 ${compact ? "h-10" : "h-14"} w-full`}>
            <p className="text-red-600 font-bold text-center">{getPrice(product)} đ</p>
            {getOriginalPrice(product) && (
              <span className="block leading-none text-center">
                <span className="line-through text-red-500/70 text-small font-semibold">{getOriginalPrice(product)} đ</span>
              </span>
            )}
          </div>
        ) : ""}
      </Link>

      {!getPrice(product) ? (
        <Button
          className="mb-3 mt-auto font-bold uppercase bg-gradient-to-b from-[#ffed00] to-[#fff466] rounded-3xl w-[90%] h-8 mx-auto"
          onPress={() => window.open("https://zalo.me/0903802979", "_blank")}
        >
          Liên hệ
        </Button>
      ) : ""}
    </div>
  )
}

export default ProductCard
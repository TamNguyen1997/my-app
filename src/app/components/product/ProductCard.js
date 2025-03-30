import { Button, Link } from "@nextui-org/react"
import { getPrice, getOriginalPrice } from "@/lib/product"
import Image from "next/image"

const ProductCard = ({ product }) => {
  return (
    <div className="group-hover:opacity-50 border hover:-translate-y-3 hover:shadow-md transition bg-white max-w-[300px] flex flex-col">
      <Link href={`/${product.subCate?.slug ?? 'san-pham'}/${product.slug}`} className="flex flex-col h-[250px] rounded-md overflow-hidden mx-auto">
        <Image
          width={200}
          height={200}
          src={product.imageUrl || "/default-featured-image.webp"}
          alt={product.imageAlt}
        />
      </Link>
      <Link href={`/${product.subCate ? product.subCate.slug : "san-pham"}/${product.slug}`} className="text-black w-full grow">
        <div className="mx-auto border-b py-3">
          <p className="sm:text-base text-lg text-gray-700 line-clamp-3 font-roboto text-center">{product.name}</p>
        </div>
      </Link>
      <div className="py-2 h-16">
        {getPrice(product) ? (
          <>
            <p className="text-red-500 font-bold text-center">{getPrice(product)} đ</p>
            {getOriginalPrice(product) && (
              <span className="line-through text-red-500 opacity-60">
                <p className="font-bold text-center">{getOriginalPrice(product)} đ</p>
              </span>
            )}
          </>
        ) : (
          <Link href="https://zalo.me/0902366617" className="text-black w-full">
            <Button className="flex font-bold uppercase bg-gradient-to-b from-[#ffed00] to-[#fff466] rounded-3xl w-[90%] h-8 m-auto">
              Liên hệ
            </Button>
          </Link>
        )}
      </div>
    </div>

  )
}

export default ProductCard
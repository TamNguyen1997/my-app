import { Button, Link } from "@nextui-org/react"
import { getPrice } from "@/lib/product"
import Image from "next/image"

const ProductCard = ({ product }) => {
  return (
    <div className="group-hover:opacity-50 border hover:-translate-y-3 hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15) 
      transition bg-white max-w-[300px] h-full flex flex-col">
      <Link href={`/${product.subCate?.slug}/${product.slug}`}
        className="flex flex-col sm:h-[250px] h-[150px] rounded-md object-cover object-center overflow-hidden mx-auto">
        <Image
          width={200}
          height={200}
          src={`${product.image?.path && process.env.NEXT_PUBLIC_FILE_PATH ?
            process.env.NEXT_PUBLIC_FILE_PATH + product.image?.path :
            "/default-featured-image.webp"}`}
          alt={product.imageAlt}
        />
      </Link>
      <Link href={`/${product.subCate ? product.subCate.slug : "san-pham"}/${product.slug}`}
        className="text-black border-gray-400 w-full grow">
        <div className="mx-auto border-b-medium w-[90%] py-3 h-full">
          <p className="sm:text-base text-[18px] text-gray-700 line-clamp-3 font-roboto relative text-center [word-spacing:1.2px] sm:min-h-14">
            {product.name}
          </p>
        </div>
      </Link>
      <div className="py-2">
        {
          getPrice(product) ?
            <p className="text-red-500 font-bold w-full relative text-center items-center h-8 sm:text-[18px] text-base">{getPrice(product)} đ</p> :
            <Link isExternal href="https://zalo.me/0902366617" className="text-black sm:text-base text-xs w-full">
              <Button className="flex font-bold uppercase bg-gradient-to-b from-[#ffed00] to-[#fff466] rounded-3xl w-[90%] h-8 m-auto">
                Liên hệ
              </Button>
            </Link>
        }
      </div>
    </div>
  )
}

export default ProductCard
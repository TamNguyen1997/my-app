import { Link } from "@nextui-org/react"
import { getPrice } from "@/lib/product"

const ProductCard = ({ product }) => {
  return (
    <div className="group-hover:opacity-50 hover:-translate-y-3 hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15) transition bg-white">
      <div className="rounded-md border object-cover object-center 
            shadow-[0px_2px_10px_rgba(0,0,0,0.15)] overflow-hidden mx-auto">
        <Link href={`/${product.subCate ? product.subCate.slug : "san-pham"}/${product.slug}`} className="flex flex-col h-[250px]">
          <div className="w-3/4 h-3/4 overflow-hidden">
            <img
              width={200}
              height={200}
              src={`${product.image?.path}`}
              alt={product.imageAlt}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </Link>
      </div>
      <Link href={`/${product.subCate ? product.subCate.slug : "san-pham"}/${product.slug}`}
        className="text-black border-gray-400  w-full">
        <div className="mx-auto border-b-medium w-[90%]">
          <p className="text-sm text-gray-700 line-clamp-2 font-roboto relative text-center items-center [word-spacing:3px] min-h-10">
            {product.name}
          </p>
        </div>
      </Link>
      {
        getPrice(product) ? <p className="text-red-500 font-bold w-full relative text-center items-center">{getPrice(product)} đ</p> : <p></p>
      }
    </div>
  )
}

export default ProductCard
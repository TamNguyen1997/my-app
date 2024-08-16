import { Link } from "@nextui-org/react"
import { getPrice } from "@/lib/product"

const ProductCard = ({ product }) => {
  return (
    <div className="group-hover:opacity-50 hover:-translate-y-3 hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15) transition bg-white rounded-md">
      <div className="rounded-md border object-cover object-center 
            shadow-[0px_2px_10px_rgba(0,0,0,0.15)] overflow-hidden mx-auto">
        <Link href={`/${product.subCate ? product.subCate.slug : "san-pham"}/${product.slug}`} className="flex flex-col h-[250px]">
          <div className="overflow-hidden">
            <img
              width={200}
              height={200}
              src={`/gallery/product/as-590-ik-cbn-scaledjpg.jpeg`}
              alt={product.imageAlt}
              className=" object-cover object-center"
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
        getPrice(product) ?
          <p className="text-red-500 font-bold w-full relative text-center items-center h-8">{getPrice(product)} đ</p> :
          <p className="h-8"></p>
      }
    </div>
  )
}

export default ProductCard
import { Button, Link } from "@nextui-org/react"
import { getPrice } from "@/lib/product"

const ProductCard = ({ product }) => {
  return (
    <div className="group-hover:opacity-50 border hover:-translate-y-3 hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15) transition bg-white max-w-[300px]">
      <div className="rounded-md object-cover object-center 
            overflow-hidden mx-auto">
        <Link href={`/${product.subCate ? product.subCate.slug : "san-pham"}/${product.slug}`} className="flex flex-col h-[250px]">
          <div className="overflow-hidden">
            <img
              width={200}
              height={200}
              src={`${product.image?.path}`}
              alt={product.imageAlt}
              className=" object-cover object-center"
            />
          </div>
        </Link>
      </div>
      <Link href={`/${product.subCate ? product.subCate.slug : "san-pham"}/${product.slug}`}
        className="text-black border-gray-400  w-full">
        <div className="mx-auto border-b-medium w-[90%] py-3">
          <p className="text-sm text-gray-700 line-clamp-3 font-roboto relative text-justify [word-spacing:3px] min-h-14">
            {product.name}
          </p>
        </div>
      </Link>
      <div className="py-2">
        {
          getPrice(product) ?
            <p className="text-red-500 font-bold w-full relative text-center items-center h-8 text-[22px]">{getPrice(product)} đ</p> :
            <Button className="flex text-sm font-bold uppercase bg-gradient-to-b from-[#ffed00] to-[#fff466] rounded-lg w-[90%] h-8 m-auto">
              <Link isExternal href="https://zalo.me/0902366617" className="text-black">
                Liên hệ
              </Link>
            </Button>
        }
      </div>
    </div>
  )
}

export default ProductCard
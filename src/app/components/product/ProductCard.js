import { Link } from "@nextui-org/react"
import { getPrice } from "@/lib/product"

const ProductCard = ({ product }) => {
  return (
    <div>
      <div className="rounded-md border object-cover object-center group-hover:opacity-50
            hover:-translate-y-2.5 hover:scale-[1.02] shadow-[0px_2px_10px_rgba(0,0,0,0.15)]
            hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15)] overflow-hidden transition">
        <Link href={`/${product.subCate.slug}/${product.slug}`} className="flex flex-col h-full">
          <div className="h-2/3">
            <div className="aspect-h-1 aspect-w-1 w-full h-full overflow-hidden xl:aspect-h-8 xl:aspect-w-7">
              <img
                width={500}
                height={400}
                src={`${process.env.NEXT_PUBLIC_FILE_PATH + product.image?.path}`}
                alt={product.imageAlt}
                className="h-full w-full object-cover object-center group-hover:opacity-75 hover:scale-110 transition"
              />
            </div>
          </div>
        </Link>
      </div>
      <Link href={`/${product.subCate.slug}/${product.slug}`} className="text-black">
        <div className="grow pt-2">
          <p className="text-sm text-gray-700 line-clamp-2">
            {product.name}
          </p>
        </div>
      </Link>
      <p className="text-red-500 font-bold pb-12">
        {
          getPrice(product)
        }
      </p>
    </div>
  )
}

export default ProductCard
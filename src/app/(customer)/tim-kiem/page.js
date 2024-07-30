"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getTotalPages } from "@/lib/pagination"
import { Link, Pagination } from "@nextui-org/react";
import { getPrice } from "@/lib/product";

const rowsPerPage = 20

const Search = () => {
  const [data, setData] = useState([])
  const searchParams = useSearchParams()
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"))


  useEffect(() => {
    getProduct()
  }, []);

  const pages = useMemo(() => {
    return getTotalPages(total, rowsPerPage)
  }, [total, rowsPerPage]);

  const getProduct = () => {
    fetch(`/api/products/?size=${rowsPerPage}&page=${page}&slug=${searchParams.get("key")}&active=true&includeCate=true`).then(async res => {
      if (res.ok) {
        const body = await res.json()
        setData(body.result)
        setTotal(body.total)
      }
    })
  }

  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/tim-kiem`} />
      {/* <div
        className="flex flex-col items-center 
        bg-[image:var(--image-url)] bg-no-repeat bg-center bg-cover
        justify-center min-w-screen h-72 md:h-52 sm:h-32"
        style={{
          '--image-url': `url(${category.image ? process.env.NEXT_PUBLIC_FILE_PATH + category.image.path : ""})`,
          backgroundSize: "100% 100%"
        }} >
      </div> */}
      <div className="w-9/12 mx-auto pt-5">
        <p className="font-bold p-2">
          Tìm thấy {total} kết quả.
        </p>
        <div className="w-full my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-2">
          {data.map((product) => (
            <Link
              href={`/ ${product.subCate.slug} / ${product.slug}`}
              key={product.id}
              className="group border rounded overflow-clip">
              <img
                src={`${process.env.NEXT_PUBLIC_FILE_PATH + product?.image?.path}`}
                alt={product?.imageAlt}
                className="object-cover object-center group-hover:opacity-50 p-2 hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15)]" />
              <p className="mt-4 text-sm text-gray-700 font-semibold text-center">
                {product.name}
              </p>

              <p className="text-center text-red-500 font-bold text-xl pt-3 border-t-medium">
                {
                  getPrice(product)
                }
              </p>
            </Link>
          ))}
        </div>
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </>
  );
};


export default Search;

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getTotalPages } from "@/lib/pagination"
import { Pagination } from "@nextui-org/react";
import { Suspense } from 'react'
import ProductCard from "@/components/product/ProductCard"

const rowsPerPage = 20

const SearchBar = () => {
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

      <div className="w-9/12 mx-auto pt-5">
        <p className="font-bold p-2">
          Tìm thấy {total} kết quả.
        </p>
        {
          data?.length ? <>

            <div className="w-full my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-2">
              {data.map((product) => (
                <div key={product.id} className="h-full p-2 hover:opacity-75">
                  <ProductCard product={product} />
                </div>
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
          </> : ""
        }
      </div>
    </>
  );
};

function Search() {
  return <Suspense fallback={<SearchBarFallback />}>
    <SearchBar />
  </Suspense>
}

function SearchBarFallback() {
  return <></>
}

export default Search;

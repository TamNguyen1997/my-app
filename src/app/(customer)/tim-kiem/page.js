"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getTotalPages } from "@/lib/pagination"
import { Link, Pagination, Tab, Tabs } from "@nextui-org/react";
import { Suspense } from 'react'
import ProductCard from "@/components/product/ProductCard"
import BlogItem from "@/app/components/blog/BlogItem";

const SearchProductBar = () => {
  const rowsPerPage = 20
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
      {
        total === 0 ? <NotFound key={searchParams.get("key")} /> : <>
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
        </>
      }
    </>
  );
};

const SearchBlog = () => {
  const rowsPerPage = 10
  const [data, setData] = useState([])
  const searchParams = useSearchParams()
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"))

  useEffect(() => {
    getCate()
  }, []);

  const pages = useMemo(() => {
    return getTotalPages(total, rowsPerPage)
  }, [total, rowsPerPage]);

  const getCate = () => {
    fetch(`/api/blogs/?excludeSupport=true&size=${rowsPerPage}&page=${page}&slug=${searchParams.get("key")}`).then(async res => {
      if (res.ok) {
        const body = await res.json()
        setData(body.result)
        setTotal(body.total)
      }
    })
  }

  return (
    <>
      {
        total === 0 ? <NotFound key={searchParams.get("key")} /> :
          <>
            <p className="font-bold p-2">
              Tìm thấy {total} kết quả.
            </p>
            {
              data?.length ? <>
                <div className="space-y-4 mb-2">
                  {
                    data.map(item => {
                      return (
                        <BlogItem item={item} key={item.id} containerClass="lg:grid-cols-[192px_auto] pb-5" />
                      )
                    })
                  }
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
          </>
      }
    </>
  );
};

const NotFound = ({ key }) => {
  return <>
    <p className="p-2">
      Rất tiếc, Sao Việt không tìm thấy kết quả nào phù hợp với từ khóa {key}
    </p>
    <div className="flex pt-20">
      <div className="m-auto flex flex-col gap-2">
        <p className="font-bold">Để tìm được kết quả chính xác hơn, bạn vui lòng:</p>
        <ul className="list-disc">
          <li>
            Kiểm tra lỗi chính tả của từ khóa đã nhập
          </li>
          <li>
            Thử lại bằng từ khóa khác
          </li>
          <li>
            Thử lại bằng những từ khóa tổng quát hơn
          </li>
          <li>
            Thử lại bằng những từ khóa ngắn gọn hơn
          </li>
        </ul>
        <Link href="/" className="underline m-auto pt-10">Quay về trang chủ</Link>
      </div>
    </div>
  </>
}

function Search() {
  return <Suspense fallback={<SearchBarFallback />}>
    <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/tim-kiem`} />
    <div className="w-9/12 mx-auto pt-5">
      <Tabs>
        <Tab key="product" title="Sản phẩm">
          <SearchProductBar />
        </Tab>
        <Tab key="blog" title="Bài viết">
          <SearchBlog />
        </Tab>
      </Tabs>
    </div>
  </Suspense>
}

function SearchBarFallback() {
  return <></>
}

export default Search;

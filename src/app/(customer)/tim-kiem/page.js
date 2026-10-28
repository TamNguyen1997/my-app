"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getTotalPages } from "@/lib/pagination"
import { Button, Link, Pagination, Tab, Tabs } from "@heroui/react";
import { Suspense } from 'react'
import ProductCard from "@/components/product/ProductCard"
import BlogItem from "@/app/components/blog/BlogItem";
import { navigate } from "@/lib/utils";

const SearchProductBar = () => {
  const rowsPerPage = 20
  const [data, setData] = useState([])
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get("q") || searchParams.get("key") || "";
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"))

  const pages = useMemo(() => {
    return getTotalPages(total, rowsPerPage)
  }, [total, rowsPerPage]);

  const getProduct = useCallback(() => {
    fetch(`/api/products/search/?size=${rowsPerPage}&page=${page}&searchTerm=${encodeURIComponent(searchTerm)}&active=true&includeCate=true`).then(async res => {
      if (res.ok) {
        const body = await res.json()
        setData(body.result)
        setTotal(body.total)
      }
    })
  }, [page, searchTerm]);

  useEffect(() => {
    getProduct()
  }, [getProduct]);

  return (
    <>
      {
        total === 0 ? <NotFound searchTerm={searchTerm} /> : <>
          <p className="font-bold p-2">
            Tìm thấy {total} kết quả.
          </p>
          {
            data?.length ? <>

              <div className="w-full my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-2">
                {data.map((product) => (
                  <div key={product.id} className="h-full pr-1 hover:opacity-75">
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
                  onChange={(page) => {
                    setPage(page)
                    navigate(`/tim-kiem?key=${searchParams.get("key")}&q=${encodeURIComponent(searchParams.get("q") || "")}&page=${page}`)
                  }}
                />
              </div>
            </> : ""
          }
        </>
      }
    </>
  );
};

const SearchBlog = ({ category, searchTerm }) => {
  const rowsPerPage = 10
  const [data, setData] = useState([])
  const categoryId = category === "news"
    ? process.env.NEXT_PUBLIC_WORDPRESS_POST_NEWS_ID
    : process.env.NEXT_PUBLIC_WORDPRESS_POST_INFORMATION_ID;
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isCurrent = true;

    const getBlog = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        if (!categoryId) throw new Error("Missing WordPress category ID for blog search");

        const params = new URLSearchParams({
          _embed: "",
          search: searchTerm,
          categories: categoryId,
          per_page: String(rowsPerPage),
          page: String(page),
          status: "publish",
        });
        const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts/?${params}`);
        if (!res.ok) throw new Error(`Blog search failed with status ${res.status}`);

        const blogs = await res.json();
        if (!Array.isArray(blogs)) throw new Error("Blog search returned an invalid response");

        if (isCurrent) {
          setData(previous => page === 1 ? blogs : [...previous, ...blogs]);
          setTotal(Number(res.headers.get("x-wp-total") || 0));
        }
      } catch (error) {
        console.error(error);
        if (isCurrent) setHasError(true);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    getBlog();
    return () => {
      isCurrent = false;
    };
  }, [categoryId, page, searchTerm]);

  return (
    <>
      {
        hasError ? <p className="p-2">Đã xảy ra lỗi khi tìm kiếm bài viết. Vui lòng thử lại.</p> :
        data.length === 0 && isLoading ? <p className="p-2">Đang tìm kiếm bài viết...</p> :
        data.length === 0 ? <NotFound searchTerm={searchTerm} /> :
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
                        <BlogItem
                          item={item}
                          key={item.id}
                          category={category === "news" ? "NEWS" : "INFORMATION"}
                          containerClass="lg:grid-cols-[192px_auto] pb-5"
                        />
                      )
                    })
                  }
                </div>
                {total > data.length && <Button
                  className="flex justify-center items-center font-semibold w-[181px] h-[43px] rounded-[30px] text-black bg-white
                border border-black hover:bg-[#FFD400] transition mx-auto text-large"
                  isLoading={isLoading}
                  onPress={() => setPage(page + 1)}
                >
                  Xem thêm
                </Button>}
              </> : ""
            }
          </>
      }
    </>
  );
};

const NotFound = ({ searchTerm }) => {
  return <>
    <p className="p-2">
      Rất tiếc, Sao Việt không tìm thấy kết quả nào phù hợp với từ khóa {searchTerm}
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
    <SearchContent />
  </Suspense>
}

function SearchContent() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q") || searchParams.get("key") || "";

  return <>
    <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/tim-kiem`} />
    <div className="w-9/12 mx-auto pt-5">
      <Tabs defaultSelectedKey="information">
        <Tab key="product" title="Sản phẩm">
          <SearchProductBar />
        </Tab>
        <Tab key="information" title="Kiến thức hay">
          <SearchBlog key={`information-${searchTerm}`} category="information" searchTerm={searchTerm} />
        </Tab>
        <Tab key="news" title="Tin tức">
          <SearchBlog key={`news-${searchTerm}`} category="news" searchTerm={searchTerm} />
        </Tab>
      </Tabs>
    </div>
  </>
}

function SearchBarFallback() {
  return <></>
}

export default Search;

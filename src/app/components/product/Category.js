"use client"

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination, Select, SelectItem, Slider, Spinner } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/product/ProductCard"
import { getTotalPages } from "@/lib/pagination"
import { useSearchParams } from "next/navigation";

const rowsPerPage = 20;

const Category = ({ params, productFilter }) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [category, setCategory] = useState({ name: "" })
  const [value, setValue] = useState([0, 100000000])
  const searchParams = useSearchParams()
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"))
  const [filters, setFilters] = useState([])

  const [filterIds, setFilterIds] = useState([])

  useEffect(() => {
    getProduct()
    fetch(`/api/filters/?categoryId=${params}&active=true`).then((res) => res.json()).then(json => {
      setFilters(json.result.filter(item => item.filterValue.length))
    })
  }, [params, productFilter]);

  const pages = useMemo(() => {
    return getTotalPages(total, rowsPerPage)
  }, [total, rowsPerPage]);

  const getProduct = () => {
    setIsLoading(true)
    const hash = window.location.hash?.split('#')
    const getData = async () => {
      await fetch(`/api/categories/${params}/products/?active=true&${window.location.hash ? hash[1] : `filterId=${productFilter || ""}`}`).then(async res => {
        if (res.ok) {
          const body = await res.json()
          setCategory(body.category)
          setData(body.products)
          setTotal(body.total)
        }
      })
      setIsLoading(false)
    }
    getData()
  }

  const filter = () => {
    let range = ""
    if (JSON.stringify(value) !== JSON.stringify([0, 100000000])) {
      range += `range=${value.join('-')}`
    } else {
      if (!filterIds.length) {
        window.location.replace(`/${category.slug}`)
        getProduct()
        return
      }
      if (filterIds.length === 1) {
        window.location.replace(`/${category.slug}#${filterIds[0]}`)
        getProduct()
        return
      }
    }

    let query = []
    if (range) {
      query.push(range)
    }
    if (filterIds.length) {
      query.push(`filterId=${filterIds.join("&filterId=")}`)
    }
    window.location.replace(`/${params}#${query.join("&")}`)
    getProduct()
  }


  if (isLoading) return <Spinner className="w-full h-full m-auto p-12" />
  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/${params}`} />
      <div
        className="flex flex-col items-center 
        bg-[image:var(--image-url)] bg-no-repeat bg-center bg-cover
        justify-center min-w-screen h-72 md:h-52 sm:h-32"
        style={{
          '--image-url': `url(${category.image ? process.env.NEXT_PUBLIC_FILE_PATH + category.image.path : ""})`,
          backgroundSize: "100% 100%"
        }} >
      </div>
      <div className="w-9/12 mx-auto pt-5">
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          {
            filters.map((filter, index) =>
              <Select key={index}
                label={filter.name}
                className="max-w-[200px]"
                selectionMode="multiple"
                labelPlacement="outside"
                defaultSelectedKeys={new Set([
                  filter.filterValue.find(item => window.location.hash.includes(item.slug) || item.slug === productFilter)?.id])}
                onSelectionChange={(value) => {
                  const newValues = Array.from(value).filter(item => item)
                  if (!newValues.length) {
                    const temp = filterIds.filter(item => !filter.filterValue.map(item => item.id).includes(item))
                    setFilterIds(temp)
                  } else {
                    const temp = filterIds.filter(item => !newValues.includes(item))
                    setFilterIds([...newValues, ...temp])
                  }
                }}
              >
                {
                  filter.filterValue.filter(item => item.slug).map((item, i) =>
                    <SelectItem key={item.slug}>{item.value}</SelectItem>
                  )
                }
              </Select>
            )
          }
          <div className="items-end flex min-h-full gap-4">
            <Dropdown >
              <DropdownTrigger>
                <Button variant="bordered">
                  Giá
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Example with disabled actions" variant="light" closeOnSelect={false}>
                <DropdownItem textValue="item">
                  <>
                    <div className="p-4 flex flex-col gap-2 items-center">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="ghost" onClick={() => setValue([0, 2000000])}>
                            Dưới 2 triệu
                          </Button>
                          <Button variant="ghost" onClick={() => setValue([2000000, 3000000])}>
                            Từ 2 - 3 triệu
                          </Button>
                          <Button variant="ghost" onClick={() => setValue([3000000, 4000000])}>
                            Từ 3 - 4 triệu
                          </Button>
                          <Button variant="ghost" onClick={() => setValue([4000000, 100000000])}>
                            Trên 4 triệu
                          </Button>
                        </div>
                        <div>
                          <Slider
                            label="Mức giá"
                            step={50}
                            minValue={0}
                            maxValue={100000000}
                            value={value}
                            onChange={setValue}
                            formatOptions={{ style: "currency", currency: "VND" }}
                            className="max-w-md m-auto p-3"
                          />
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button color="primary" onClick={filter}>Tìm</Button>
                        <Button variant="ghost" color="danger" onClick={() => setValue([0, 100000000])}>Bỏ chọn</Button>
                      </div>
                    </div>
                  </>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" onClick={filter}>Tìm</Button>
          </div>
        </div>

        {
          !isLoading && !data.length ?
            <p className="m-auto pt-4 text-lg opacity-55">Không tìm thấy sản phẩm nào.</p> :
            <>
              <div className="w-full my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-2">
                {data.map((product) => (
                  <div key={product.id} className="h-full hover:opacity-75">
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
            </>
        }
      </div>
    </>
  );
};

export default Category
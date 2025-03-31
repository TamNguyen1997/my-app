"use client"

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Select, SelectItem, Slider, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard"
import { useSearchParams } from "next/navigation";
import ErrorBoundary from "@/components/ErrorBoundary";
import { navigate } from "@/lib/utils";

const rowsPerPage = 20;

const SubCategory = ({ params, productFilter }) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [category, setCategory] = useState({ name: "" })
  const [value, setValue] = useState([0, 100000000])
  const [orderByPrice, setOrderByPrice] = useState("")
  const searchParams = useSearchParams()
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"))
  const [filters, setFilters] = useState([])
  const [endContent, setEndContent] = useState(false)

  const [filterIds, setFilterIds] = useState([])

  useEffect(() => {
    getProduct()
    fetch(`/api/filters/?categoryId=${params}&active=true`).then((res) => res.json()).then(json => {
      setFilters(json.result.filter(item => item.filterValue.length))
    })
  }, [params, productFilter, page]);

  const getProduct = (reload = false) => {
    setIsLoading(true)
    const hash = window.location.hash?.split('#')
    const getData = async () => {
      await fetch(`/api/categories/${params}/products/?active=true&page=${page}&${window.location.hash ? hash[1] : `filterId=${productFilter || ""}`}&${orderByPrice && `orderByPrice=${orderByPrice}`}`).then(async res => {
        if (res.ok) {
          const body = await res.json()
          setCategory(body.category)
          if (reload) {
            setData([...body.products])
          } else {
            setData([...data, ...body.products])
          }
          setEndContent(body.products.length != rowsPerPage)
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
        getProduct(true)
        navigate(`/${category.slug}`)
        return
      }
      if (filterIds.length === 1) {
        getProduct(true)
        navigate(`/${category.slug}#${filterIds[0]}`)
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
    getProduct(true)
    navigate(`/${params}#${query.join("&")}`)
  }


  if (isLoading) return <Spinner className="w-full h-full m-auto p-12" />
  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/${params}`} />
      <ErrorBoundary>
        <div
          className="flex flex-col items-center 
        bg-[image:var(--image-url)] bg-no-repeat bg-center bg-cover
        justify-center xl:h-96 lg:h-72 md:h-60 h-32"
          style={{
            '--image-url': `url(${category.imageUrl || ""})`,
            backgroundSize: "100% 100%"
          }} >
        </div>
        <div className="w-9/12 mx-auto pt-5">
          <div className="flex flex-wrap gap-4">
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
              <Select label="Sắp xếp"
                className="w-40"
                labelPlacement="outside"
                defaultSelectedKeys={[orderByPrice]}
                onSelectionChange={value => setOrderByPrice(value.values().next().value)}>
                <SelectItem key="asc">Giá thấp đến cao</SelectItem>
                <SelectItem key="desc">Giá cao đến thấp</SelectItem>
              </Select>
              <Button color="primary" onClick={() => filter()}>Tìm</Button>
            </div>
          </div>

          {
            !isLoading && !data.length ?
              <p className="m-auto text-lg opacity-55 py-4">Không tìm thấy sản phẩm nào.</p> :
              <>
                <div className="w-full my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-2">
                  {data.map((product) => (
                    <div key={product.id} className="h-full hover:opacity-75">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
                {!endContent && <Button
                  className="flex justify-center items-center font-semibold w-[181px] h-[43px] rounded-[30px] text-black bg-white
                border border-black hover:bg-[#FFD400] transition mx-auto text-large"
                  onClick={() => setPage(page + 1)}
                >
                  Xem thêm
                </Button>}

              </>
          }
        </div>
      </ErrorBoundary>
    </>
  );
};

export default SubCategory
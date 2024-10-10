"use client";

import { useEffect, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Select, SelectItem, Slider, Spinner } from "@nextui-org/react";
import { FILTER_TYPE } from "@/lib/filter";
import ProductCard from "@/components/product/ProductCard";

const Brand = ({ params, productFilter }) => {
  const [data, setData] = useState([])
  const [brand, setBrand] = useState({ name: "" })
  const [isLoading, setIsLoading] = useState(true)

  const [value, setValue] = useState([0, 100000000])

  const [groupedData, setGroupData] = useState({})
  const [filters, setFilters] = useState([])

  const [filterIds, setFilterIds] = useState([])

  useEffect(() => {
    getProduct()
    fetch(`/api/filters/?categoryId=${params}&active=true`).then((res) => res.json()).then(json => {
      setFilters(json.result)
    })
  }, [params, productFilter]);

  const getProduct = async () => {
    const hash = window.location.hash?.split('#')

    fetch(`/api/brands/${params}`).then(res => res.json()).then(setBrand)
    await fetch(`/api/products/?active=true&page=1&size=100&includeCate=true&brandId=${params}&${window.location.hash ? hash[1] : `filterId=${productFilter || ""}`}`).then(async res => {
      if (res.ok) {
        const body = await res.json()
        setData(body.result)
        setGroupData(Object.groupBy(body.result, (item) => item.categoryId))
      }
    })
    setIsLoading(false)
  }

  const filter = () => {
    let range = ""
    if (JSON.stringify(value) !== JSON.stringify([0, 100000000])) {
      range += `range=${value.join('-')}`
    } else {
      if (!filterIds.length) {
        window.location.replace(`/${brand.slug}`)
        getProduct()
        return
      }

      if (filterIds.length === 1) {
        window.location.replace(`/${brand.slug}_${filterIds[0]}`)
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

  console.log(filterIds)
  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/${brand.slug}`} />
      <div className="sm:w-9/12 mx-auto ">
        <div className="flex gap-2 pt-5 px-2">
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            {
              filters.map((filter, index) =>
                <Select key={index}
                  label={filter.name}
                  className="max-w-[200px]"
                  selectionMode="multiple"
                  labelPlacement="outside"
                  defaultSelectedKeys={new Set([filter.filterValue.find(item => window.location.hash.includes(item.slug) || item.slug === productFilter)?.slug])}
                  onSelectionChange={(value) => {
                    setFilterIds(Array.from(value))
                  }}
                >
                  {
                    filter.filterValue.map((item, i) =>
                      <SelectItem key={item.id}>{item.value}</SelectItem>
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
        </div>
        {
          !isLoading && !data.length ?
            <p className="m-auto pt-4 text-lg opacity-55">Không tìm thấy sản phẩm nào.</p> :
            <div className="w-full my-5 flex flex-col gap-4 p-2">
              {
                Object.keys(groupedData).map(key => <BrandSection products={groupedData[key]} key={key} />)
              }
            </div>
        }
      </div>
    </>
  );
};

const BrandSection = ({ products }) => {
  return (
    <div>
      <div className="bg-[#FFD400] rounded-tr-[50px] rounded-bl-[50px] flex items-center w-2/3 md:w-1/3 h-[50px] m-auto shadow-md">
        <div className="m-auto text-black font-bold md:text-xl">
          {products[0].category?.name}
        </div>
      </div>

      {
        products.length ? <>
          <div className="w-full my-5 grid grid-cols-[repeat(auto-fill,minmax(222px,1fr))] gap-4 p-2">
            {products.map((product) => (
              <div key={product.id} className="h-full hover:opacity-75 [&>div]:mx-auto">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <Link isExternal
            href={`/${products[0].category?.slug}`}
            className="flex justify-center items-center font-semibold w-[181px] text-black
              h-[43px] rounded-[30px] border border-black hover:bg-[#FFD400] transition mx-auto"
          >
            Xem thêm
          </Link>

        </> : ""
      }
    </div>
  )
}

export default Brand;

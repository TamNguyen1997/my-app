"use client";

import { useEffect, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Select, SelectItem, Slider, Spinner } from "@nextui-org/react";
import { FILTER_TYPE } from "@/lib/filter";
import ProductCard from "@/components/product/ProductCard";

const comparePriceDesc = (product1, product2) => {
  return product1.saleDetails[0]?.price - product2.saleDetails[0]?.price
}

const comparePriceAsc = (product1, product2) => {
  return product2.saleDetails[0]?.price - product1.saleDetails[0]?.price
}

const FILTER = {
  "highlight": {
    id: "highlight",
    name: "Nổi bật",
    filter: (products) => {
      return products.filter(item => item.highlight)
    }
  },
  "priceAsc": {
    id: "priceAsc",
    name: "Giá tăng",
    filter: (products) => {
      return products
        .filter(product => product.saleDetails && product.saleDetails.length && product.saleDetails.filter(detail => detail.price).length)
        .sort(comparePriceAsc)
    }
  },
  "priceDesc": {
    id: "priceDesc",
    name: "Giá giảm",
    filter: (products) => {
      return products
        .filter(product => product.saleDetails && product.saleDetails.length && product.saleDetails.filter(detail => detail.price).length)
        .sort(comparePriceDesc)
    }
  },

}


const Brand = ({ params, productFilter }) => {
  const [data, setData] = useState([])
  const [selectedFilters, setSelectedFilters] = useState(new Set([]))
  const [brand, setBrand] = useState({ name: "" })
  const [isLoading, setIsLoading] = useState(true)

  const [value, setValue] = useState([0, 100000000])

  const [groupedData, setGroupData] = useState({})
  const [filters, setFilters] = useState({})

  const [filterIds, setFilterIds] = useState({})

  useEffect(() => {
    getProduct()
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

    // await fetch(`/api/filters/?brandId=${params}`).then((res) => res.json()).then(json => {
    //   setFilters(Object.groupBy(json.result, (item) => item.filterType))

    //   let temp = {}

    //   if (productFilter) {
    //     json.result.forEach(item => {
    //       if (item.slug === productFilter) {
    //         temp[item.filterType] = [productFilter]
    //         return
    //       }
    //     })
    //   } else {
    //     json.result.forEach(item => {
    //       if (window.location.hash?.includes(item.slug)) {
    //         if (temp[item.filterType]) {
    //           temp[item.filterType].push(item.slug)
    //         } else {
    //           temp[item.filterType] = [item.slug]
    //         }
    //       }
    //     })

    //   }

    //   setFilterIds(temp)
    // })
    setIsLoading(false)
  }

  const onFilterSelect = (value) => {
    setSelectedFilters(value)

    if (!value.size) {
      window.location.replace(`/${brand.slug}`)
      return
    }

    const productFilter = FILTER[value.values().next().value]
    if (!productFilter) return

    setGroupData(Object.groupBy(productFilter.filter(data), (item) => item.subCategoryId))
  }

  const filter = () => {
    let range = ""
    if (JSON.stringify(value) !== JSON.stringify([0, 100000000])) {
      range += `range=${value.join('-')}`
    } else {
      if (!Object.keys(filterIds).length) {
        window.location.replace(`/${brand.slug}`)
        getProduct()
        return
      }
      const ids = Object.values(filterIds).flat()
      if (ids?.length === 1) {
        window.location.replace(`/${brand.slug}_${ids[0]}`)
        getProduct()
        return
      }
    }
    let slugs = []
    Object.keys(filterIds).forEach(key => {
      if (filterIds[key]) slugs.push(...filterIds[key])
    })
    let params = []
    if (range) {
      params.push(range)
    }
    if (slugs.length) {
      params.push(`filterId=${slugs.join("&filterId=")}`)
    }
    window.location.replace(`/${brand.slug}#${params.join("&")}`)
    getProduct()
  }

  if (isLoading) return <Spinner className="w-full h-full m-auto p-12" />

  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/${brand.slug}`} />
      <div className="sm:w-9/12 mx-auto ">
        <div className="flex gap-2 pt-5 px-2">
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            {
              Object.keys(filters || {}).map((key, index) =>
                <Select key={index}
                  label={FILTER_TYPE.find(item => item.id === key).label}
                  className="max-w-[200px]"
                  selectionMode="multiple"
                  labelPlacement="outside"
                  defaultSelectedKeys={new Set([filters[key].find(item => window.location.hash.includes(item.slug) || item.slug === productFilter)?.slug])}
                  onSelectionChange={(value) => {
                    let obj = {}
                    obj[key] = [...value].filter(item => item)
                    setFilterIds(Object.assign({}, filterIds, obj))
                  }}
                >
                  {
                    filters[key].map((item, i) =>
                      <SelectItem key={item.slug}>{item.name}</SelectItem>
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
        <div className="pt-3 px-2">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered">
                {
                  selectedFilters.size ? FILTER[selectedFilters.values().next().value].name : "Sắp xếp"
                }
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Example with disabled actions"
              variant="light"
              selectionMode="single"
              selectedKeys={selectedFilters}
              onSelectionChange={onFilterSelect}>
              {
                Object.keys(FILTER).map(key =>
                  <DropdownItem textValue="item" key={key}>
                    {
                      FILTER[key].name
                    }
                  </DropdownItem>
                )
              }
            </DropdownMenu>
          </Dropdown>
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

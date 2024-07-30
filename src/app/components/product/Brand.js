"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Select, SelectItem, Slider } from "@nextui-org/react";
import { getPrice } from "@/lib/product";
import { FILTER_TYPE } from "@/lib/filter";

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

  const [value, setValue] = useState([0, 100000000])
  const [selectedCategories, setSelectedCategories] = useState([])

  const [groupedData, setGroupData] = useState({})
  const [filters, setFilters] = useState({})

  const [filterIds, setFilterIds] = useState({})

  useEffect(() => {
    getProduct()
  }, [params, productFilter]);

  const getProduct = () => {
    const hash = window.location.hash?.split('#')
    fetch(`/api/brands/${params}/products/?&active=true&${window.location.hash ? hash[1] : `filterId=${productFilter || ""}`}`).then(async res => {
      if (res.ok) {
        const body = await res.json()
        setBrand(body.brand)
        setData(body.products)
        setGroupData(Object.groupBy(body.products, (item) => item.subCategoryId))
      }
    })
    fetch(`/api/filters/?brandId=${params}`).then((res) => res.json()).then(json => {
      setFilters(Object.groupBy(json.result, (item) => item.filterType))
    })
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
    let range = "range="
    if (JSON.stringify(value) !== JSON.stringify([0, 100000000])) {
      range += `${value.join('-')}`
    } else {
      if (!Object.keys(filterIds).length) {
        window.location.replace(`/${brand.slug}`)
        getProduct()
        return
      }
      if (Object.keys(filterIds).length == 1 && filterIds[Object.keys(filterIds)[0]].length === 1) {
        window.location.replace(`/${brand.slug}_${filterIds[Object.keys(filterIds)[0]][0]}`)
        getProduct()
        return
      }
    }
    let slugs = []
    Object.keys(filterIds).forEach(key => {
      slugs.push(...filterIds[key])
    })
    window.location.replace(`/${brand.slug}#${range}&filterId=${slugs.join("&filterId=")}`)
    getProduct()
  }

  const getVariant = (id) => {
    return selectedCategories.includes(id) ? 'solid' : 'ghost'
  }

  const getColor = (id) => {
    return selectedCategories.includes(id) ? 'default' : ''
  }

  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/${brand.slug}`} />
      <div className="flex flex-col items-center justify-center w-full h-60 bg-cover bg-center bg-no-repeat">
        <div className="flex flex-col items-center justify-center w-full h-full bg-no-repeat bg-cover bg-banner1">
        </div>
      </div>
      <div className="w-9/12 mx-auto ">
        <div className="flex gap-2 pt-5">


          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            {
              Object.keys(filters || {}).map((key, index) =>
                <Select key={index}
                  label={FILTER_TYPE.find(item => item.id === key).label}
                  className="max-w-[200px]"
                  selectionMode="multiple"
                  labelPlacement="outside"
                  defaultSelectedKeys={new Set(filters[key].find(item => item.slug === productFilter) ? [productFilter] : [])}
                  onSelectionChange={(value) => {
                    let obj = {}
                    obj[key] = [...value]
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
        <div className="float-right">
          <Dropdown className="float-right">
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
        <div className="w-full my-5 flex flex-col gap-4 p-2">
          {
            Object.keys(groupedData).map(key => <BrandSection products={groupedData[key]} key={key} />)
          }
        </div>
      </div>
    </>
  );
};

const BrandSection = ({ products }) => {

  return (
    <div>
      <div className="text-black font-bold text-4xl text-center items-center">
        {products[0].subCategory?.name}
      </div>

      <div className="w-full my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-2">
        {products.filter(product => product.subCateId && product.categoryId).map((product) => (
          <Link
            href={`/${product.subCate.slug}/${product.slug}`}
            key={product.id}
            className="group border rounded overflow-clip hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15)]">
            <img
              src={`${process.env.NEXT_PUBLIC_FILE_PATH + product?.image?.path}`}
              alt={product?.imageAlt}
              className="object-cover object-center group-hover:opacity-50 p-2" />
            <p className="mt-4 text-sm text-gray-700 font-semibold text-center">
              {product.name}
            </p>

            <p className="text-center text-red-500 font-bold text-xl pt-3">
              {
                getPrice(product)
              }
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Brand;

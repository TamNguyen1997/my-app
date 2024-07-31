import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Pagination, Select, SelectItem, Slider, Spinner } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/product/ProductCard"
import { getTotalPages } from "@/lib/pagination"
import { useSearchParams } from "next/navigation";
import { FILTER_TYPE } from "@/lib/filter";

const rowsPerPage = 20;

const Category = ({ params, productFilter }) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [category, setCategory] = useState({ name: "" })
  const [value, setValue] = useState([0, 100000000])
  const [selectedFilters, setSelectedFilters] = useState(new Set([]))
  const searchParams = useSearchParams()
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"))
  const [filters, setFilters] = useState({})

  const [filterIds, setFilterIds] = useState({})

  useEffect(() => {
    getProduct()
  }, [params, productFilter]);

  const pages = useMemo(() => {
    return getTotalPages(total, rowsPerPage)
  }, [total, rowsPerPage]);

  const getProduct = () => {
    setIsLoading(true)
    const hash = window.location.hash?.split('#')
    const getData = async () => {
      await fetch(`/api/filters/?categoryId=${params}`).then((res) => res.json()).then(json => {
        setFilters(Object.groupBy(json.result, (item) => item.filterType))
        let temp = {}

        if (productFilter) {
          json.result.forEach(item => {
            if (item.slug === productFilter) {
              temp[item.filterType] = [productFilter]
              return
            }
          })
        } else {
          json.result.forEach(item => {
            if (window.location.hash?.includes(item.slug)) {
              if (temp[item.filterType]) {
                temp[item.filterType].push(item.slug)
              } else {
                temp[item.filterType] = [item.slug]
              }
            }
          })

        }

        setFilterIds(temp)
      })
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
      if (!Object.keys(filterIds).length) {
        window.location.replace(`/${category.slug}`)
        getProduct()
        return
      }
      const ids = Object.values(filterIds).flat()
      if (ids?.length === 1) {
        window.location.replace(`/${category.slug}_${ids[0]}`)
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
    window.location.replace(`/${category.slug}#${params.join("&")}`)
    getProduct()
  }

  const onFilterSelect = (value) => {
    setSelectedFilters(value)
    if (!value.size) {
      filter()
      return
    }

    const productFilter = FILTER_TYPE[value.values().next().value]
    if (!filter) return

    setData(productFilter.filter(data))
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

        <div className="pt-4">
          <Dropdown className="pt-4">
            <DropdownTrigger>
              <Button
                variant="bordered">
                {
                  selectedFilters.size ? FILTER_TYPE[selectedFilters.values().next().value].name : "Sắp xếp"
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
                Object.keys(FILTER_TYPE).map(key =>
                  <DropdownItem textValue="item" key={key}>
                    {
                      FILTER_TYPE[key].name
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
            <>
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
            </>
        }
      </div>
    </>
  );
};

export default Category
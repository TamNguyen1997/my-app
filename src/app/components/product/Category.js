import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Pagination, Select, SelectItem, Slider } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { getPrice } from "@/lib/product"
import { getTotalPages } from "@/lib/pagination"
import { useSearchParams } from "next/navigation";
import { FILTER_TYPE } from "@/lib/filter";

const rowsPerPage = 20;

const Category = ({ params, productFilter }) => {
  const [data, setData] = useState([])
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
    const hash = window.location.hash?.split('#')
    fetch(`/api/categories/${params}/products/?active=true&${window.location.hash ? hash[1] : `filterId=${productFilter || ""}`}`).then(async res => {
      if (res.ok) {
        const body = await res.json()
        setCategory(body.category)
        setData(body.products)
        setTotal(body.total)
      }
    })
    fetch(`/api/filters/?categoryId=${params}`).then((res) => res.json()).then(json => {
      setFilters(Object.groupBy(json.result, (item) => item.filterType))
    })
  }

  const filter = () => {
    let range = "range="
    if (JSON.stringify(value) !== JSON.stringify([0, 100000000])) {
      range += `${value.join('-')}`
    } else {
      if (!Object.keys(filterIds).length) {
        window.location.replace(`/${category.slug}`)
        getProduct()
        return
      }
      if (Object.keys(filterIds).length == 1 && filterIds[Object.keys(filterIds)[0]].length === 1) {
        window.location.replace(`/${category.slug}_${filterIds[Object.keys(filterIds)[0]][0]}`)
        getProduct()
        return
      }
    }
    let slugs = []
    Object.keys(filterIds).forEach(key => {
      slugs.push(...filterIds[key])
    })
    window.location.replace(`/${category.slug}#${range}&filterId=${slugs.join("&filterId=")}`)
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

  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN} / ${params}`} />
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

        <div className="float-right">
        </div>
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

export default Category
"use client"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination, Select, SelectItem, Slider, Input } from "@heroui/react";
import { useState } from "react";
import ProductCard from "@/components/product/ProductCard"
import Link from "next/link";
import { getRangeForUrl } from "@/lib/product";

const SubCategory = ({ products, filters = [], category = {}, page = 1, selectedFilterIds = [], defaultOrderBy, totalPage = 1, priceBreakpoints = [], defaultRange = [0, 100000000] }) => {
  const [data] = useState(products || [])
  const [value, setValue] = useState(Array.isArray(defaultRange) && defaultRange.length === 2 ? defaultRange : [0, 100000000])
  const [orderBy, setOrderBy] = useState(defaultOrderBy)
  const [filterIds, setFilterIds] = useState([])
  const [dynamicRanges, setDynamicRanges] = useState([])

  const currency = (v) =>
    (v || v === 0)
      ? v.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 })
      : "";

  // Build dynamic range presets based on all products in category (breakpoints passed from server)
  if (dynamicRanges.length === 0) {
    const [q1, q2, q3] = priceBreakpoints.length === 3 ? priceBreakpoints : [500000, 1000000, 2000000]
    setDynamicRanges([
      { label: `Dưới ${currency(q1)}`, range: [0, q1] },
      { label: `${currency(q1)} - ${currency(q2)}`, range: [q1, q2] },
      { label: `${currency(q2)} - ${currency(q3)}`, range: [q2, q3] },
      { label: `Trên ${currency(q3)}`, range: [q3, 100000000] }
    ])
  }

  return (
    <>
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
          {filters.map((filter, index) => (
            <Select key={index}
              label={filter.name}
              className="max-w-[200px]"
              selectionMode="multiple"
              labelPlacement="outside"
              defaultSelectedKeys={selectedFilterIds}
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
              {filter.filterValue.map((item, i) => (
                <SelectItem key={i}>{item.value}</SelectItem>
              ))}
            </Select>
          ))}
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
                          {dynamicRanges.map((r, idx) => (
                            <Button key={idx} variant="ghost" onPress={() => setValue(r.range)}>
                              {r.label}
                            </Button>
                          ))}
                        </div>
                        <div>
                          <Slider
                            label="Mức giá"
                            step={50000}
                            minValue={0}
                            maxValue={100000000}
                            value={value}
                            onChange={setValue}
                            formatOptions={{ style: "currency", currency: "VND" }}
                            className="max-w-md m-auto p-3"
                          />
                          <div className="flex gap-3 justify-center">
                            <Input
                              type="number"
                              label="Tối thiểu"
                              labelPlacement="outside"
                              className="max-w-[180px]"
                              value={`${value[0]}`}
                              onChange={(e) => {
                                const next = Math.max(0, Math.min(100000000, Number(e.target.value || 0)));
                                setValue([Math.min(next, value[1]), value[1]]);
                              }}
                            />
                            <Input
                              type="number"
                              label="Tối đa"
                              labelPlacement="outside"
                              className="max-w-[180px]"
                              value={`${value[1]}`}
                              onChange={(e) => {
                                const next = Math.max(0, Math.min(100000000, Number(e.target.value || 0)));
                                setValue([value[0], Math.max(next, value[0])]);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Link href={`/${category.slug}?filterId=${filterIds.join(",")}&orderBy=${orderBy}&${getRangeForUrl(value)}`}>
                          <Button color="primary">Tìm</Button>
                        </Link>
                        <Button variant="ghost" color="danger" onPress={() => setValue([0, 100000000])}>Bỏ chọn</Button>
                      </div>
                    </div>
                  </>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Select label="Sắp xếp"
              className="w-40"
              labelPlacement="outside"
              defaultSelectedKeys={[orderBy]}
              onSelectionChange={value => setOrderBy(value.values().next().value)}>
              <SelectItem key="createdAt:desc">Sản phẩm mới</SelectItem>
              <SelectItem key="price:asc">Giá thấp đến cao</SelectItem>
              <SelectItem key="price:desc">Giá cao đến thấp</SelectItem>
            </Select>
            <Link href={`/${category.slug}?filterId=${filterIds.join(",")}&orderBy=${orderBy}&${getRangeForUrl(value)}`}>
              <Button color="primary">Tìm</Button>
            </Link>
          </div>
        </div>

        {!data.length ? (
          <p className="m-auto text-lg opacity-55 py-4">Không tìm thấy sản phẩm nào.</p>
        ) : (
          <>
            <div className="w-full my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-2">
              {data.map((product, i) => (
                <div key={i} className="h-full hover:opacity-75">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <Pagination className="w-full mx-auto"
              initialPage={parseInt(page || "1")}
              total={parseInt(totalPage || "1")}
              onChange={(newPage) => {
                const params = new URLSearchParams()
                if (filterIds.length) params.set('filterId', filterIds.join(','))
                if (orderBy) params.set('orderBy', orderBy)
                if (Array.isArray(value) && value.length === 2) {
                  const [min, max] = value
                  params.set('range', `${Math.max(0, min)}-${Math.max(min, max)}`)
                }
                params.set('page', String(newPage))
                window.location.href = `/${category.slug}?${params.toString()}`
              }} />
          </>
        )}
      </div>
    </>
  );
};

export default SubCategory;

"use client"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination, Select, SelectItem, Slider, Input } from "@heroui/react";
import { useState } from "react";
import ProductCard from "@/components/product/ProductCard"
import Link from "next/link";
import { getRangeForUrl } from "@/lib/product";

const SubCategory = ({ products, filters = [], category = {}, page = 1, selectedFilterIds = [], defaultOrderBy, totalPage = 1 }) => {
  const [data] = useState(products || [])
  const [value, setValue] = useState([0, 100000000])
  const [orderBy, setOrderBy] = useState(defaultOrderBy)
  const [filterIds, setFilterIds] = useState([])
  const [dynamicRanges, setDynamicRanges] = useState([])

  const currency = (v) =>
    (v || v === 0)
      ? v.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 })
      : "";

  const getEffectiveMinPrice = (product) => {
    if (!product?.saleDetails?.length) return null;
    const visible = product.saleDetails
      .filter(d => d.showPrice === true && (((d.promotionalPrice ?? 0) > 0) || ((d.price ?? 0) > 0)) )
      .map(d => (d.promotionalPrice && d.promotionalPrice > 0) ? d.promotionalPrice : (d.price || 0));
    if (!visible.length) return null;
    return Math.min(...visible);
  };

  // Build dynamic range presets based on current products' effective prices
  if (dynamicRanges.length === 0) {
    const prices = (data || [])
      .map(p => getEffectiveMinPrice(p))
      .filter(p => typeof p === "number" && p > 0)
      .sort((a, b) => a - b);

    if (prices.length < 4) {
      setDynamicRanges([
        { label: "Dưới 2 triệu", range: [0, 2000000] },
        { label: "2 - 3 triệu", range: [2000000, 3000000] },
        { label: "3 - 4 triệu", range: [3000000, 4000000] },
        { label: "Trên 4 triệu", range: [4000000, 100000000] }
      ])
    } else {
      const q = (pct) => prices[Math.min(prices.length - 1, Math.max(0, Math.floor(pct * (prices.length - 1))))];
      const q1 = q(0.25);
      const q2 = q(0.5);
      const q3 = q(0.75);
      setDynamicRanges([
        { label: `Dưới ${currency(q1)}`, range: [0, Math.round(q1)] },
        { label: `${currency(q1)} - ${currency(q2)}`, range: [Math.round(q1), Math.round(q2)] },
        { label: `${currency(q2)} - ${currency(q3)}`, range: [Math.round(q2), Math.round(q3)] },
        { label: `Trên ${currency(q3)}`, range: [Math.round(q3), 100000000] }
      ])
    }
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
              {filter.filterValue.map(item => (
                <SelectItem key={item.displayId}>{item.value}</SelectItem>
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
            <Pagination className="w-full mx-auto" initialPage={parseInt(page || "1")} total={parseInt(totalPage || "1")} onChange={(newPage) => {
              window.location.href = `/${category.slug}?filterId=${filterIds.join(",")}&orderBy=${orderBy}&page=${newPage}&${getRangeForUrl(value)}`;
            }} />
          </>
        )}
      </div>
    </>
  );
};

export default SubCategory;

"use client"

import { useEffect, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Select, SelectItem, Slider, Spinner, Input } from "@heroui/react";
import ProductCard from "@/components/product/ProductCard";
import { buildQueryParams, getRangeForUrl } from "@/lib/product";

const Category = ({ category, subcates, filters = [], products = [], filterIds = [], defaultOrderBy, priceBreakpoints = [], defaultRange = [0, 100000000] }) => {
  const [value, setValue] = useState(Array.isArray(defaultRange) && defaultRange.length === 2 ? defaultRange : [0, 100000000]);
  const [orderBy, setOrderBy] = useState(defaultOrderBy);
  const [groupedData, setGroupData] = useState({});
  const [selectedFilterValues, setSelectedFilterValues] = useState(filterIds);
  const [showAllSubCates, setShowAllSubCates] = useState(false);
  const [dynamicRanges, setDynamicRanges] = useState([]);

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

  useEffect(() => {
    const groupData = subcates.reduce((acc, subcate) => {
      acc[subcate.id] = products.filter(product => product.subCate && (product.subCate.id === subcate.id));
      return acc;
    }, {});
    setGroupData(groupData);
  }, [products, subcates]);

  useEffect(() => {
    if (priceBreakpoints.length === 3) {
      const [q1, q2, q3] = priceBreakpoints
      setDynamicRanges([
        { label: `Dưới ${currency(q1)}`, range: [0, q1] },
        { label: `${currency(q1)} - ${currency(q2)}`, range: [q1, q2] },
        { label: `${currency(q2)} - ${currency(q3)}`, range: [q2, q3] },
        { label: `Trên ${currency(q3)}`, range: [q3, 100000000] }
      ])
      return
    }
    // Fallback if breakpoints missing: derive from current products
    const prices = products
      .map(p => getEffectiveMinPrice(p))
      .filter(p => typeof p === "number" && p > 0)
      .sort((a, b) => a - b);
    if (prices.length === 0) {
      setDynamicRanges([
        { label: "Dưới 2 triệu", range: [0, 2000000] },
        { label: "2 - 3 triệu", range: [2000000, 3000000] },
        { label: "3 - 4 triệu", range: [3000000, 4000000] },
        { label: "Trên 4 triệu", range: [4000000, 100000000] }
      ]);
      return
    }
    const q = (pct) => prices[Math.min(prices.length - 1, Math.max(0, Math.floor(pct * (prices.length - 1))))];
    const q1 = Math.round(q(0.25));
    const q2 = Math.round(q(0.5));
    const q3 = Math.round(q(0.75));
    setDynamicRanges([
      { label: `Dưới ${currency(q1)}`, range: [0, q1] },
      { label: `${currency(q1)} - ${currency(q2)}`, range: [q1, q2] },
      { label: `${currency(q2)} - ${currency(q3)}`, range: [q2, q3] },
      { label: `Trên ${currency(q3)}`, range: [q3, 100000000] }
    ])
  }, [products, priceBreakpoints])

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
      <div className="sm:w-9/12 mx-auto">
        <div className="flex flex-wrap gap-2 p-3">
          {
            [...subcates].splice(0, showAllSubCates ? subcates.length : 10).map((subcate, i) => <Link key={i} href={`/${subcate.slug}`}><Button variant="ghost" color="default">{subcate.name}</Button></Link>)
          }
          {
            subcates.length > 10 && (showAllSubCates ?
              <Button variant="ghost" color="danger" onPress={() => setShowAllSubCates(false)}>Ẩn bớt</Button> :
              <Button variant="ghost" color="primary" onPress={() => setShowAllSubCates(true)}>Xem thêm</Button>)
          }
        </div>
        <div className="flex flex-wrap gap-2 p-3">
          {
            filters.map((filter, index) =>
              <Select key={index}
                label={filter.name}
                className="max-w-[200px]"
                selectionMode="multiple"
                defaultSelectedKeys={selectedFilterValues}
                labelPlacement="outside"
                onSelectionChange={(value) => {
                  setSelectedFilterValues([...value]);
                }}>
                {
                  filter.filterValue.filter(item => item.id).map((item, i) =>
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
                        <Link href={`/${category.slug}?${buildQueryParams({ filterIds: selectedFilterValues.filter(Boolean), orderBy, range: value })}`}>
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
            <Link href={`/${category.slug}?${buildQueryParams({ filterIds: selectedFilterValues.filter(Boolean), orderBy, range: value })}`}>
              <Button color="primary">Tìm</Button>
            </Link>
          </div>
        </div>
        {
          !products.length ?
            <p className="m-auto pt-4 text-lg opacity-55">Không tìm thấy sản phẩm nào.</p> :
            <div className="w-full my-5 flex flex-col gap-4 p-2">
              {
                [...Object.keys(groupedData)]
                  .splice(0, showAllSubCates ? Object.keys(groupedData).length : 10)
                  .map(key => <CategorySection products={groupedData[key].slice(0, 10)} key={key} />)
              }
            </div>
        }
      </div>
    </>
  );
};

const CategorySection = ({ products }) => {
  return products.length > 0 && (
    <div>
      <div className="bg-[#FFD400] rounded-tr-[50px] rounded-bl-[50px] flex items-center w-2/3 md:w-1/3 h-[50px] m-auto shadow-md">
        <div className="m-auto text-black font-bold md:text-xl">
          {products[0].subCate?.name}
        </div>
      </div>

      {
        products.length ? <>
          <div className="w-full my-5 grid grid-cols-[repeat(auto-fill,minmax(222px,1fr))] gap-4 p-2">
            {[...products].splice(0, 20).map((product, i) => (
              <div key={i} className="h-full hover:opacity-75 [&>div]:mx-auto">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <Link isExternal
            href={`/${products[0].subCate?.slug}`}
            className="flex justify-center items-center font-semibold w-[181px] text-black
              h-[43px] rounded-[30px] border border-black hover:bg-[#FFD400] transition mx-auto"
          >
            Xem thêm
          </Link>

        </> : ""
      }
    </div>
  );
};

export default Category;
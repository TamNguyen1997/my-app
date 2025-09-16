"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Select, SelectItem, Slider, Spinner, Input } from "@heroui/react";
import ProductCard from "@/components/product/ProductCard";
import { getRangeForUrl } from "@/lib/product";

const Brand = ({ brandSlug, products = [], filters = [], defaultOrderBy = "createdAt:desc", defaultRange = [0, 100000000], defaultFilterIds = [] }) => {
  const [orderBy, setOrderBy] = useState(defaultOrderBy);
  const [value, setValue] = useState(defaultRange);
  const [selectedFilterValues, setSelectedFilterValues] = useState(defaultFilterIds);
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

  const groupedData = useMemo(() => {
    return products.reduce((acc, item) => {
      const key = item.categoryId || "";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [products]);

  const categories = useMemo(() => {
    return Object.keys(groupedData).map(key => groupedData[key][0]?.category).filter(Boolean);
  }, [groupedData]);

  useEffect(() => {
    const prices = products
      .map(p => getEffectiveMinPrice(p))
      .filter(p => typeof p === "number" && p > 0)
      .sort((a, b) => a - b);

    if (prices.length < 4) {
      setDynamicRanges([
        { label: "Dưới 2 triệu", range: [0, 2000000] },
        { label: "2 - 3 triệu", range: [2000000, 3000000] },
        { label: "3 - 4 triệu", range: [3000000, 4000000] },
        { label: "Trên 4 triệu", range: [4000000, 100000000] }
      ]);
      return;
    }

    const q = (pct) => prices[Math.min(prices.length - 1, Math.max(0, Math.floor(pct * (prices.length - 1))))];
    const q1 = q(0.25);
    const q2 = q(0.5);
    const q3 = q(0.75);

    const presets = [
      { label: `Dưới ${currency(q1)}`, range: [Math.max(0, Math.round(q1 * 0)) , Math.round(q1)] },
      { label: `${currency(q1)} - ${currency(q2)}`, range: [Math.round(q1), Math.round(q2)] },
      { label: `${currency(q2)} - ${currency(q3)}`, range: [Math.round(q2), Math.round(q3)] },
      { label: `Trên ${currency(q3)}`, range: [Math.round(q3), 100000000] }
    ];
    setDynamicRanges(presets);
  }, [products]);

  const buildUrl = () => {
    const params = [];
    const rangeParam = getRangeForUrl(value);
    if (rangeParam) params.push(rangeParam);
    if (selectedFilterValues.length) params.push(`filterId=${selectedFilterValues.join(",")}`);
    if (orderBy) params.push(`orderBy=${orderBy}`);
    return `/${brandSlug}?${params.join("&")}`;
  };

  return (
    <>
      <div className="sm:w-9/12 mx-auto ">
        <div className="flex flex-wrap gap-2 p-3">
          {categories.map(category => (
            <Link key={category.id} href={`/${category.slug}`}>
              <Button variant="ghost" color="default">{category.name}</Button>
            </Link>
          ))}
        </div>
        <div className="flex gap-2 pt-5 px-2">
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            {filters.map((filter, index) => (
              <Select
                key={index}
                label={filter.name}
                className="max-w-[200px]"
                selectionMode="multiple"
                labelPlacement="outside"
                defaultSelectedKeys={selectedFilterValues}
                onSelectionChange={(value) => {
                  setSelectedFilterValues([...value]);
                }}
              >
                {filter.filterValue.filter(item => item.displayId).map((item, i) => (
                  <SelectItem key={item.displayId}>{item.value}</SelectItem>
                ))}
              </Select>
            ))}
            <div className="items-end flex min-h-full gap-4">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">Giá</Button>
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
                          <Link href={buildUrl()}>
                            <Button color="primary">Tìm</Button>
                          </Link>
                          <Button variant="ghost" color="danger" onClick={() => setValue([0, 100000000])}>Bỏ chọn</Button>
                        </div>
                      </div>
                    </>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Select
                label="Sắp xếp"
                className="w-40"
                labelPlacement="outside"
                defaultSelectedKeys={[orderBy]}
                onSelectionChange={value => setOrderBy(value.values().next().value)}
              >
                <SelectItem key="createdAt:desc">Sản phẩm mới</SelectItem>
                <SelectItem key="price:asc">Giá thấp đến cao</SelectItem>
                <SelectItem key="price:desc">Giá cao đến thấp</SelectItem>
              </Select>
              <Link href={buildUrl()}>
                <Button color="primary">Tìm</Button>
              </Link>
            </div>
          </div>
        </div>
        {!products.length ? (
          <p className="m-auto pt-4 text-lg opacity-55">Không tìm thấy sản phẩm nào.</p>
        ) : (
          <div className="w-full my-5 flex flex-col gap-4 p-2">
            {Object.keys(groupedData).map(key => (
              <BrandSection products={[...groupedData[key]].slice(0, 30)} key={key} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const BrandSection = ({ products }) => {
  return (
    <div>
      <div className="bg-[#FFD400] rounded-tr-[50px] rounded-bl-[50px] flex items-center w-2/3 lg:w-1/3 h-[50px] m-auto shadow-md">
        <div className="m-auto text-black font-bold md:text-xl">
          {products[0].category?.name}
        </div>
      </div>

      {products.length ? (
        <>
          <div className="w-full my-5 grid grid-cols-[repeat(auto-fill,minmax(222px,1fr))] gap-4 p-2">
            {products.map((product) => (
              <div key={product.id} className="h-full hover:opacity-75 [&>div]:mx-auto">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <Link
            isExternal
            href={`/${products[0].category?.slug}`}
            className="flex justify-center items-center font-semibold w-[181px] text-black h-[43px] rounded-[30px] border border-black hover:bg-[#FFD400] transition mx-auto"
          >
            Xem thêm
          </Link>
        </>
      ) : null}
    </div>
  );
};

export default Brand;

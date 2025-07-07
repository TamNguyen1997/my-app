"use client"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination, Select, SelectItem, Slider } from "@heroui/react";
import { useState } from "react";
import ProductCard from "@/components/product/ProductCard"
import Link from "next/link";

const SubCategory = ({ products, filters = [], category = {}, page = 1, selectedFilterIds = [], defaultOrderBy, totalPage = 1 }) => {
  const [data] = useState(products || [])
  const [value, setValue] = useState([0, 100000000])
  const [orderBy, setOrderBy] = useState(defaultOrderBy)
  const [filterIds, setFilterIds] = useState([])

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
                          <Button variant="ghost" onPress={() => setValue([0, 2000000])}>
                            Dưới 2 triệu
                          </Button>
                          <Button variant="ghost" onPress={() => setValue([2000000, 3000000])}>
                            Từ 2 - 3 triệu
                          </Button>
                          <Button variant="ghost" onPress={() => setValue([3000000, 4000000])}>
                            Từ 3 - 4 triệu
                          </Button>
                          <Button variant="ghost" onPress={() => setValue([4000000, 100000000])}>
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
                        <Link href={`/${category.slug}?filterId=${filterIds.join(",")}&range=${value[0]}-${value[1]}&orderBy=${orderBy}`}>
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
            <Link href={`/${category.slug}?filterId=${filterIds.join(",")}&orderBy=${orderBy}&${getRangeForUrl(value.join("-"))}`}>
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
            }}/>
          </>
        )}
      </div>
    </>
  );
};

const getRangeForUrl = (range) => {
  if (!range || range.length === 0) return "";
  const [min, max] = [...range];
  if (isNaN(min) || isNaN(max)) return "";
  if (min === 0 && max ===  100000000) return "";
  return `range=${min}-${max}`;
};

export default SubCategory;

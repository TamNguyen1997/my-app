"use client"

import { useEffect, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Select, SelectItem, Slider, Spinner } from "@heroui/react";
import ProductCard from "@/components/product/ProductCard";
import { getRangeForUrl } from "@/lib/product";

const Category = ({ category, subcates, filters = [], products = [], filterIds = [], defaultOrderBy }) => {
  const [value, setValue] = useState([0, 100000000]);
  const [orderBy, setOrderBy] = useState(defaultOrderBy);
  const [groupedData, setGroupData] = useState({});
  const [selectedFilterValues, setSelectedFilterValues] = useState(filterIds);
  const [showAllSubCates, setShowAllSubCates] = useState(false);

  console.log(selectedFilterValues)
  console.log(filterIds)
  useEffect(() => {
    const groupData = subcates.reduce((acc, subcate) => {
      acc[subcate.id] = products.filter(product => product.subCate && (product.subCate.id === subcate.id));
      return acc;
    }, {});
    setGroupData(groupData);
  }, [products, subcates]);

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
                  filter.filterValue.filter(item => item.displayId).map((item, i) =>
                    <SelectItem key={item.displayId}>{item.value}</SelectItem>
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
                      <Link href={`/${category.slug}?filterId=${selectedFilterValues.filter(item => item).join(",")}&orderBy=${orderBy}&${getRangeForUrl(value.join("-"))}`}>
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
            <Link href={`/${category.slug}?filterId=${selectedFilterValues.join(",")}&orderBy=${orderBy}&${getRangeForUrl(value.join("-"))}`}>
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
            {[...products].splice(0, 20).map((product,i ) => (
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
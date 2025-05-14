"use client"

import { useEffect, useState, useCallback } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Select, SelectItem, Slider, Spinner } from "@nextui-org/react";
import ProductCard from "@/components/product/ProductCard";

const Category = ({ category, productFilter, subcates }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState([0, 100000000]);
  const [orderBy, setOrderBy] = useState("");
  const [groupedData, setGroupData] = useState({});
  const [filters, setFilters] = useState([]);
  const [selectedFilterValues, setSelectedFilterValues] = useState({});
  const [showAllSubCates, setShowAllSubCates] = useState(false);

  const getProduct = async () => {
    const hash = window.location.hash?.split('#');
    const res = await fetch(`/api/products/?active=true&page=1&size=10000&includeCate=true&categoryId=${category.id}&${hash && hash[1]?.includes("=") ? hash[1] : `filterId=${productFilter || hash[1] || ""}`}&${orderBy && `orderBy=${orderBy}`}`);
    if (res.ok) {
      const body = await res.json();
      const groupData = subcates.reduce((acc, subcate) => {
        acc[subcate.id] = body.result.filter(product => product.subCate && (product.subCate.id === subcate.id));
        return acc;
      }, {});
      const [minPrice, maxPrice] = value;
      let result = body.result.filter(item => item.saleDetails.find(sd => sd.showPrice && sd.price >= minPrice & sd.price <= maxPrice));

      setData(result);
      setGroupData(groupData);
    }
    setIsLoading(false);
  };

  const fetchFilters = async () => {
    const res = await fetch(`/api/filters/?categoryId=${category.id}&active=true`);
    const json = await res.json();
    const result = json.result.filter(item => item.filterValue.length);
    let temp = {};
    result.forEach(item => {
      temp[item.id] = [];
    });
    setSelectedFilterValues(temp);
    setFilters(result);
  };

  useEffect(() => {
    getProduct();
    fetchFilters();
  }, [category.slug, productFilter, orderBy, value]);

  const filter = useCallback(() => {
    let range = "";
    let filterIds = Object.values(selectedFilterValues).flat();

    if (JSON.stringify(value) !== JSON.stringify([0, 100000000])) {
      range += `range=${value.join('-')}`;
    }
    let query = [];
    if (range) {
      query.push(range);
    } else if (filterIds.length === 1) {
      window.location.replace(`/${category.slug}#${filterIds[0]}`);
      getProduct();
      return;
    }
    if (filterIds.length) {
      query.push(`filterId=${filterIds.join("&filterId=")}`);
    }
    window.location.replace(`/${category.slug}#${query.join("&")}`);
  }, [category, selectedFilterValues, value]);

  if (isLoading) return <Spinner className="w-full h-full m-auto p-12" />;

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
            [...subcates].splice(0, showAllSubCates ? subcates.length : 10).map(subcate => <Link key={subcate.id} href={`/${subcate.slug}`}><Button variant="ghost" color="default">{subcate.name}</Button></Link>)
          }
          {
            subcates.length > 10 && (showAllSubCates ?
              <Button variant="ghost" color="danger" onClick={() => setShowAllSubCates(false)}>Ẩn bớt</Button> :
              <Button variant="ghost" color="primary" onClick={() => setShowAllSubCates(true)}>Xem thêm</Button>)
          }
        </div>
        <div className="flex flex-wrap gap-2 p-3">
          {
            filters.map((filter, index) =>
              <Select key={index}
                label={filter.name}
                className="max-w-[200px]"
                selectionMode="multiple"
                defaultSelectedKeys={new Set([
                  filter.filterValue.find(item => window.location.hash.includes(item.slug) || item.slug === productFilter)?.slug])}
                onSelectionChange={(value) => {
                  setSelectedFilterValues(prevValues => ({ ...prevValues, [filter.id]: Array.from(value).filter(item => item) }));
                }}
              >
                {
                  filter.filterValue.filter(item => item.slug).map((item, i) =>
                    <SelectItem key={item.slug}>{item.value}</SelectItem>
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
            <Select label="Sắp xếp"
              className="w-40"
              labelPlacement="outside"
              defaultSelectedKeys={[orderBy]}
              onSelectionChange={value => setOrderBy(value.values().next().value)}>
              <SelectItem key="createdAt:desc">Sản phẩm mới</SelectItem>
              <SelectItem key="price:asc">Giá thấp đến cao</SelectItem>
              <SelectItem key="price:desc">Giá cao đến thấp</SelectItem>
            </Select>
            <Button color="primary" onClick={filter}>Tìm</Button>
          </div>
        </div>
        {
          !isLoading && !data.length ?
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
            {[...products].splice(0, 20).map((product) => (
              <div key={product.id} className="h-full hover:opacity-75 [&>div]:mx-auto">
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
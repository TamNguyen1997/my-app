"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Slider } from "@nextui-org/react";
import Image from "next/image";
import ProductDetail from "@/app/components/product/ProductDetail";

const BRANDS = {
  "Kimberly": {
    id: "Kimberly",
    image: "/brand/Logo-Kimberly-Clark.png",
    name: "Kimberly"
  },
  "Rubbermaid": {
    id: "Rubbermaid",
    image: "/brand/Rubbermaid.png",
    name: "Rubbermaid"
  },
  "Ghibli": {
    id: "Ghibli",
    image: "/brand/Logo-Ghibli.png",
    name: "Ghibli"
  },
  "Mappa": {
    id: "Mappa",
    image: "/brand/Logo-Mapa.png",
    name: "Mappa"
  },
  "Moerman": {
    id: "Moerman",
    image: "/brand/Logo-Moerman.png",
    name: "Moerman"
  },
}

const getPrice = (product) => {
  if (!product.saleDetails?.length) return <></>

  if (product.saleDetails.length === 1) return <>{product.saleDetails[0].price?.toLocaleString()}</>

  if (!product.saleDetails[0].price) return <>{product.saleDetails[product.saleDetails.length - 1].price?.toLocaleString()}</>

  return <>{product.saleDetails[0].price?.toLocaleString()} - {product.saleDetails[product.saleDetails.length - 1].price?.toLocaleString()} </>
}

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

const Cate = () => {
  const params = useParams();
  if (params.slug.length === 1) {
    if (params.slug[0].startsWith('thuong-hieu')) {
      return <Brand params={params.slug[0]} />
    }
    return <Category params={params.slug[0]} />
  }
  return <ProductDetail id={params.slug[1]} />
};

const Category = ({ params }) => {
  const [data, setData] = useState([])
  const [category, setCategory] = useState({ name: "" })
  const [value, setValue] = useState([0, 100000000])
  const [brands, setBrands] = useState([])
  const [selectedFilters, setSelectedFilters] = useState(new Set([]))

  useEffect(() => {
    getProduct()
  }, [params]);

  const getProduct = () => {
    const hash = window.location.hash?.split('#')
    fetch(`/api/categories/${params}/products/?active=true&${hash.length == 2 ? hash[1] : ""}`).then(async res => {
      if (res.ok) {
        const body = await res.json()
        setCategory(body.category)
        setData(body.products)
      }
    })
  }

  const addBrand = (brand) => {
    if (brands.includes(brand.id)) {
      setBrands([...brands].filter(item => item != brand.id))
    } else {
      setBrands([...brands, brand.id])
    }
  }

  const filter = () => {
    let range = `range=${value.join('-')}`
    window.location.replace(`/${category.slug}#brand=${brands.join(',')}&${range}`)
    getProduct()
  }

  const getVariant = (id) => {
    return brands.includes(id) ? 'solid' : 'ghost'
  }

  const getColor = (id) => {
    return brands.includes(id) ? 'default' : ''
  }

  const onFilterSelect = (value) => {
    setSelectedFilters(value)
    if (!value.size) {
      filter()
      return
    }

    const productFilter = FILTER[value.values().next().value]
    if (!filter) return

    setData(productFilter.filter(data))
  }

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
        <div className="flex gap-2">
          <Dropdown >
            <DropdownTrigger>
              <Button
                variant="bordered">
                Nhãn hàng
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Example with disabled actions" variant="light" closeOnSelect={false}>
              <DropdownItem textValue="item">
                <div>
                  <div className="p-4 flex flex-col gap-2 items-center">
                    <div className="flex flex-wrap gap-2">
                      {
                        Object.keys(BRANDS).map(key =>
                          <Button
                            variant={getVariant(BRANDS[key].id)}
                            color={getColor(BRANDS[key].id)}
                            key={BRANDS[key].id}
                            onClick={() => addBrand(BRANDS[key])}>
                            <Image src={BRANDS[key].image} width="100" height="100" alt={BRANDS[key].name} />
                          </Button>
                        )
                      }
                    </div>
                    <div className="flex gap-1">
                      <Button color="primary" onClick={filter}>Tìm</Button>
                      <Button variant="ghost" color="danger" onClick={() => setBrands([])}>Bỏ chọn</Button>
                    </div>
                  </div>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

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
        <div className="w-full my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-2">
          {data.map((product) => (
            <Link
              href={`/${product.subCate.slug}/${product.slug}`}
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
      </div>
    </>
  );
};

const Brand = ({ params }) => {
  const [data, setData] = useState([])
  const [selectedFilters, setSelectedFilters] = useState(new Set([]))
  const [brand, setBrand] = useState({ name: "" })

  const [value, setValue] = useState([0, 100000000])
  const [selectedCategories, setSelectedCategories] = useState([])

  const [groupedData, setGroupData] = useState({})
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getProduct()
  }, [params]);

  const getProduct = () => {
    const hash = window.location.hash?.split('#')
    fetch(`/api/categories/`).then(res => res.json()).then(json => setCategories(json.result))
    fetch(`/api/brands/${params}/products/?&active=true&${hash.length == 2 ? hash[1] : ""}`).then(async res => {
      if (res.ok) {
        const body = await res.json()
        setBrand(body.brand)
        setData(body.products)
        setGroupData(Object.groupBy(body.products, (item) => item.subCategoryId))
      }
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

  const addCategory = (category) => {
    if (selectedCategories.includes(category.slug)) {
      setSelectedCategories([...selectedCategories].filter(item => item != category.slug))
    } else {
      setSelectedCategories([...selectedCategories, category.slug])
    }
  }

  const filter = () => {
    let range = `range=${value.join('-')}`
    window.location.replace(`/${brand.slug}#category=${selectedCategories.join(',')}&${range}`)
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
          <Dropdown >
            <DropdownTrigger>
              <Button
                variant="bordered">
                Category
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Example with disabled actions" variant="light" closeOnSelect={false}>
              <DropdownItem textValue="item">
                <div>
                  <div className="p-4 flex flex-col gap-2 items-center">
                    <div className="flex flex-wrap gap-2">
                      {
                        categories.map(category =>
                          <Button
                            variant={getVariant(category.slug)}
                            color={getColor(category.slug)}
                            key={category.slug}
                            onClick={() => addCategory(category)}>
                            {
                              category.name
                            }
                          </Button>
                        )
                      }
                    </div>
                    <div className="flex gap-1">
                      <Button color="primary" onClick={filter}>Tìm</Button>
                      <Button variant="ghost" color="danger" onClick={() => setSelectedCategories([])}>Bỏ chọn</Button>
                    </div>
                  </div>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

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

export default Cate;

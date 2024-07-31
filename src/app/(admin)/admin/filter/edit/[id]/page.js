"use client"

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Button,
  Input,
  Select,
  SelectItem
} from "@nextui-org/react"
import FilterProduct from "@/app/components/admin/ui/filter/FilterProduct";
import { useParams } from "next/navigation";
import { v4 } from "uuid";
import slugify from "slugify";

const FILTER_TYPE = [
  {
    id: "BRAND",
    name: "Thương hiệu",
  },
  {
    id: "TYPE",
    name: "Loại",
  },
  {
    id: "DIMENSION",
    name: "Kích thước",
  },
  {
    id: "EFFIENCY",
    name: "Hiệu suất",
  },
  {
    id: "WATTAGE",
    name: "Công suất tiêu thụ",
  },
  {
    id: "COLOR",
    name: "Màu sắc",
  },
  {
    id: "BATTERY",
    name: "Thời lượng pin",
  },
]

const Filter = () => {
  const [filter, setFilter] = useState({})

  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [brands, setBrands] = useState([])

  const { id } = useParams()
  useEffect(() => {
    fetch('/api/categories?type=CATE').then(res => res.json()).then(json => setCategories(json.result))
    fetch('/api/brands').then(res => res.json()).then(setBrands)
    fetch('/api/categories?type=SUB_CATE').then(res => res.json()).then(json => setSubCategories(json.result))

    if (id && id !== 'new') {
      fetch(`/api/filters/${id}`).then(res => res.json()).then(setFilter)
    }
  }, [])

  const onSave = async () => {
    const res = filter.id ?
      await fetch(`/api/filters/${filter.id}`, { method: "PUT", body: JSON.stringify(filter) }) :
      await fetch('/api/filters', { method: "POST", body: JSON.stringify(filter) })
    if (res.ok) {
      toast.success("Đã lưu filter")
      if (id === "new") {
        window.location.replace(`/admin/filter/edit/${(await res.json()).id}`)
      }
    } else {
      toast.error("Không thể lưu filter")
    }
  }

  const getTargetSelect = () => {
    switch (filter.targetType) {
      case "SUB_CATEGORY":
        return (<>
          <Select
            label="Target"
            labelPlacement="outside"
            selectedKeys={new Set([filter.categoryId])}
            onSelectionChange={(value) =>
              setFilter(Object.assign({}, filter, { categoryId: value.values().next().value }))}
          >
            {
              subCategories.map((category) => <SelectItem key={category.id}>
                {category.name}
              </SelectItem>)
            }
          </Select>
        </>)
      case "BRAND":
        return (<>
          <Select
            label="Target"
            labelPlacement="outside"
            selectedKeys={new Set([filter.brandId])}
            onSelectionChange={(value) =>
              setFilter(Object.assign({}, filter, { brandId: value.values().next().value }))}
          >
            {
              brands.map((brand) => <SelectItem key={brand.id}>
                {brand.name}
              </SelectItem>)
            }
          </Select>
        </>)
      case "CATEGORY":
      default:
        return (<>
          <Select
            label="Target"
            labelPlacement="outside"
            selectedKeys={new Set([filter.categoryId])}
            onSelectionChange={(value) =>
              setFilter(Object.assign({}, filter, { categoryId: value.values().next().value }))}
          >
            {
              categories.map((category) => <SelectItem key={category.id}>
                {category.name}
              </SelectItem>)
            }
          </Select>
        </>)
    }

  }

  if (id !== "new" && !filter.id) return <></>
  return (
    <>
      <ToastContainer />
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Input
            type="text"
            label="Tên"
            value={filter.name}
            onValueChange={(value) => setFilter(Object.assign({}, filter, { name: value }))}
            labelPlacement="outside" isRequired />
          <Input
            type="text"
            label="Slug"
            value={id === "new" ? v4() : filter.slug}
            onValueChange={(value) => setFilter(Object.assign({}, filter, { slug: slugify(value, { locale: 'vi' }) }))}
            labelPlacement="outside" isRequired />
          <Select
            label="Đối tượng filter"
            labelPlacement="outside"
            selectedKeys={new Set([filter.targetType || "CATEGORY"])}
            onSelectionChange={(value) =>
              setFilter(Object.assign({}, filter, { targetType: value.values().next().value }))}
          >
            <SelectItem key="BRAND">
              Nhãn hàng
            </SelectItem>
            <SelectItem key="CATEGORY">
              Category
            </SelectItem>
            <SelectItem key="SUB_CATEGORY">
              Sub category
            </SelectItem>
          </Select>
          {getTargetSelect()}
          <Select
            label="Loại filter"
            labelPlacement="outside"
            selectedKeys={new Set([filter.filterType || "BRAND"])}
            onSelectionChange={(value) =>
              setFilter(Object.assign({}, filter, { filterType: value.values().next().value }))}>
            {
              FILTER_TYPE.map(item => <SelectItem key={item.id}>
                {item.name}
              </SelectItem>)
            }
          </Select>
          <div className="items-end flex min-h-full">
            <Button onClick={onSave} color="primary">Lưu</Button>
          </div>
        </div>
        {
          filter.id ?
            <div className="border rounded-lg shadow-lg p-3">
              <p className="font-bold pt-3">
                Sản phẩm có trong filter
              </p>
              <FilterProduct filterId={filter.id} categories={categories} subCategories={subCategories} brands={brands} />
            </div> : ""
        }
      </div>
    </>
  )
}

export default Filter
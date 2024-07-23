"use client"

import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {

  Button,
  Input,
  Select,
  SelectItem
} from "@nextui-org/react"
import FilterProduct from "@/app/components/admin/ui/filter/FilterProduct";
import { useParams } from "next/navigation";

const Filter = () => {
  const [filter, setFilter] = useState({ filterOnProduct: [] })

  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [brands, setBrands] = useState([])

  const { id } = useParams()
  useEffect(() => {
    fetch('/api/categories?type=CATE').then(res => res.json()).then(json => setCategories(json.result))
    fetch('/api/brands').then(res => res.json()).then(setBrands)
    fetch('/api/categories?type=SUB_CATE').then(res => res.json()).then(json => setSubCategories(json.result))

    if (id) {
      fetch(`/api/filters/${id}`).then(res => res.json()).then(setFilter)
    }
  }, [])

  const onSave = async () => {
    const res = await fetch('/api/filters', { method: "POST", body: JSON.stringify(filter) })
    if (res.ok) {
      toast.success("Đã lưu filter")
      setFilter({})
    } else {
      toast.error("Không thể lưu filter")
    }
  }

  const getTargetSelect = useCallback(() => {
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

  }, [filter])

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
            value={filter.slug}
            labelPlacement="outside" isDisabled />
          <Select
            label="Loại"
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
          <div className="items-end flex min-h-full">
            <Button onClick={onSave} color="primary">Lưu</Button>
          </div>
        </div>
        <div>
          {
            filter.id ?
              <FilterProduct filterId={filter.id} categories={categories} subCategories={subCategories} brands={brands} /> : ""
          }
        </div>
      </div>
    </>
  )
}

export default Filter
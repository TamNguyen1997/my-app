"use client"

import {
  Spinner, Table,
  TableCell, TableColumn,
  TableHeader, TableRow,
  TableBody,
  Input,
  Link,
  Switch,
  Select, SelectItem,
  Button
} from "@nextui-org/react"
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { v4 } from "uuid";

const FilterProduct = ({ categories, brands, subCategories, filter, setFilter, filterId }) => {

  const [isSaving, setIsSaving] = useState(false)
  const selectionList = {
    categories: categories,
    subCategories: subCategories,
    brands: brands
  }
  const tableHeaders = [
    {
      key: "displayId",
      title: "ID giá trị filter",
      required: true
    },
    {
      key: "value",
      title: "Tên tiếng Việt",
      required: true
    },
    {
      key: "slug",
      title: "Slug"
    },
    {
      key: "brands",
      title: "ID thương hiệu",
      required: true
    },
    {
      key: "categories",
      title: "ID cate",
      required: true
    },
    {
      key: "subCategories",
      title: "ID sub-cate",
      required: true
    },
    {
      key: "active",
      title: "active"
    },
    {
      key: "actions",
      title: ""
    }
  ];

  const onCellValueChange = (valueId, value) => {
    let filterToUpdate = { ...filter }
    filterToUpdate.filterValue?.forEach(filterValue => filterValue.id === valueId ? Object.assign(filterValue, value) : filterValue)
    setFilter(filterToUpdate)
  }

  const onSave = async () => {
    setIsSaving(true)
    let res

    let filterValues = filter.filterValue ? filter.filterValue.map(item => {
      return {
        ...item,
        brands: item.brands ? item.brands.map(b => ({ brandId: b.id, filterValueId: item.id })) : [],
        categories: item.categories ? item.categories.map(cate => ({ categoryId: cate.id, filterValueId: item.id })) : [],
        subCategories: item.subCategories ? item.subCategories.map(subcate => ({ categoryId: subcate.id, filterValueId: item.id })) : [],
      }
    }) : []

    if (!filter.createdAt) {
      toast.promise(fetch(`/api/filters/`, {
        method: "POST",
        body: JSON.stringify({
          ...filter,
          filterValue: filterValues
        })
      }), {
        pending: "Đang tạo filter...",
        success: {
          async render({ data }) {
            const body = await data.json()
            window.location.replace(`/admin/filter/edit/${body.id}`)
            return `Tạo filter thành công với ID`;
          }
        },
        error: "Không thể tạo filter"
      }, { containerId: "FilterProduct" })
    } else {
      toast.promise(
        fetch(`/api/filters/${filterId}`, {
          method: "PUT",
          body: JSON.stringify({
            displayId: filter.displayId,
            active: filter.active,
            name: filter.name,
          })
        }).then(() => toast.promise(
          fetch(`/api/filters/${filterId}/filter-values`, {
            method: "PUT",
            body: JSON.stringify({
              filterValues: filterValues
            })
          }),
          {
            pending: "Đang cập nhật giá trị filter...",
            success: "Cập nhật giá trị filter thành công",
            error: "Không thể cập nhật giá trị filter"
          },
          { containerId: "FilterProduct" }
        )),
        {
          pending: "Đang cập nhật filter...",
          success: "Cập nhật filter thành công",
          error: "Không thể cập nhật filter"
        },
        { containerId: "FilterProduct" }
      )
    }
    setIsSaving(false)
  }

  const addNewFilterValue = () => {
    setFilter({
      ...filter,
      filterValue: [
        ...structuredClone(filter.filterValue || []),
        {
          id: v4(),
          value: "",
          slug: "",
          brands: [],
          categories: [],
          subCategories: [],
          filterId: filter.id,
          active: false
        }
      ]
    });
  }

  const removeFilterValue = async (valueId) => {
    if (!confirm("Bạn có chắc muốn xóa không?")) return
    const filterToDelete = filter.filterValue?.find(item => item.id === valueId);
    setFilter({
      ...filter,
      filterValue: structuredClone(filter.filterValue || [])?.filter?.(filterValue => filterValue.id !== valueId)
    });

    if (!filterToDelete.createdAt) {
      return
    }
    toast.promise(
      fetch(`/api/filter-value/${valueId}`, { method: "DELETE" }).then(async (res) => {
        if (!res.ok) {
          throw new Error((await res.json()).message || "Không thể xóa giá trị filter");
        }
      }),
      {
        pending: "Đang xóa...",
        success: "Đã xóa",
        error: "Không thể xóa"
      },
      { containerId: "FilterProduct" }
    )
  }


  return (
    <>
      <ToastContainer containerId="FilterProduct" />
      <div className="flex flex-col gap-2 min-h-full">
        <div className="px-1 py-2 border-default-200">
          <div class="relative overflow-x-auto">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {
                    tableHeaders.map((col, i) =>
                      <th scope="col" key={i} className={`max-w-[150px] whitespace-normal text-center last:w-[50px] [&:nth-last-child(2)]:w-[90px]
                      ${col.required && "after:content-['*'] after:text-[#f31260]"} px-6 py-3`}>
                        {col.title}
                      </th>
                    )
                  }
                </tr>
              </thead>
              <tbody>
                {
                  filter.filterValue?.map((item, i) => (
                    <tr key={i}>
                      <td scope="row" class="px-2 py-2 min-w-[80px]">
                        <Input
                          defaultValue={item?.displayId}
                          onValueChange={(value) => onCellValueChange(item?.id, { displayId: value })}
                          className="min-w-[80px]"
                        />
                      </td>
                      <td class="px-2 py-2">
                        <Input
                          defaultValue={item?.value}
                          onValueChange={(value) => onCellValueChange(item?.id, { value: value })}
                          className="min-w-[80px]"
                        />
                      </td>
                      <td class="px-2 py-2">
                        <Input
                          defaultValue={item?.slug}
                          onValueChange={(value) => onCellValueChange(item?.id, { slug: value })}
                          className="min-w-[80px]"
                        />
                      </td>
                      <td class="px-2 py-2">
                        <Select
                          selectionMode="multiple"
                          labelPlacement="outside"
                          isMultiline
                          onSelectionChange={(value) => {
                            if (Array.from(value)?.includes("all")) return;
                            onCellValueChange(item?.id, { brands: Array.from(value).map(item => ({ id: item })) })
                          }}
                          selectedKeys={
                            (item.brands ? item.brands.map(v => v.id) : [])
                          }
                          className={`w-[220px]`}
                        >
                          <SelectItem
                            textValue="All"
                            key="all"
                            onClick={() => {
                              const allIds = selectionList.brands?.map(item => ({ id: item.id })) || [];
                              const selectedIds = item.brands || [];
                              if (selectedIds.length === allIds.length) {
                                onCellValueChange(item?.id, { brands: [] });
                              } else {
                                onCellValueChange(item?.id, { brands: allIds });
                              }
                            }}
                          >
                            <div className="font-bold w-full flex justify-between">
                              All
                              {
                                selectionList.brands?.length === item.brands?.length ?
                                  <span className="absolute top-1/2 -translate-y-1/2 right-2 text-inherit w-3 h-3 flex-shrink-0">
                                    <svg viewBox="0 0 17 18">
                                      <polyline fill="none" points="1 9 7 14 15 4" stroke="currentColor" strokeDasharray="22" strokeDashoffset="44" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" style={{ transition: "stroke-dashoffset 200ms" }}></polyline>
                                    </svg>
                                  </span>
                                  : ""
                              }
                            </div>
                          </SelectItem>
                          {
                            selectionList.brands.map((item) =>
                              <SelectItem textValue={item.name} title={item.name} key={item.id}>
                                {item.name}
                              </SelectItem>
                            )
                          }
                        </Select>
                      </td>
                      <td class="px-2 py-2">
                        <Select
                          selectionMode="multiple"
                          labelPlacement="outside"
                          isMultiline
                          onSelectionChange={(value) => {
                            // Prevent direct selection of "all" via keyboard/mouse
                            if (Array.from(value)?.includes("all")) return;
                            onCellValueChange(item?.id, { categories: Array.from(value).map(item => ({ id: item })) })
                          }}
                          selectedKeys={
                            (item.categories ? item.categories.map(v => v.id) : [])
                          }
                          className="w-[220px]"
                        >
                          <SelectItem
                            textValue="All"
                            key="all"
                            onClick={() => {
                              const allIds = selectionList.categories?.map(item => ({ id: item.id })) || [];
                              const selectedIds = item.categories || [];
                              if (selectedIds.length === allIds.length) {
                                onCellValueChange(item?.id, { categories: [] });
                              } else {
                                onCellValueChange(item?.id, { categories: allIds });
                              }
                            }}
                          >
                            <div className="font-bold w-full flex justify-between">
                              All
                              {
                                selectionList.categories?.length === item.categories?.length ?
                                  <span className="absolute top-1/2 -translate-y-1/2 right-2 text-inherit w-3 h-3 flex-shrink-0">
                                    <svg viewBox="0 0 17 18">
                                      <polyline fill="none" points="1 9 7 14 15 4" stroke="currentColor" strokeDasharray="22" strokeDashoffset="44" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" style={{ transition: "stroke-dashoffset 200ms" }}></polyline>
                                    </svg>
                                  </span>
                                  : ""
                              }
                            </div>
                          </SelectItem>
                          {
                            selectionList.categories.map((item) =>
                              <SelectItem textValue={item.name} title={item.name} key={item.id}>
                                {item.name}
                              </SelectItem>
                            )
                          }
                        </Select>
                      </td>
                      <td class="px-2 py-2">
                        <Select
                          selectionMode="multiple"
                          labelPlacement="outside"
                          isMultiline
                          onSelectionChange={(value) => {
                            // Prevent direct selection of "all" via keyboard/mouse
                            if (Array.from(value)?.includes("all")) return;
                            onCellValueChange(item?.id, { subCategories: Array.from(value).map(item => ({ id: item })) })
                          }}
                          selectedKeys={
                            (item.subCategories ? item.subCategories.map(v => v.id) : [])
                          }
                          className="w-[220px]"
                        >
                          <SelectItem
                            textValue="All"
                            key="all"
                            onClick={() => {
                              const allIds = selectionList.subCategories?.map(item => ({ id: item.id })) || [];
                              const selectedIds = item.subCategories || [];
                              if (selectedIds.length === allIds.length) {
                                onCellValueChange(item?.id, { subCategories: [] });
                              } else {
                                onCellValueChange(item?.id, { subCategories: allIds });
                              }
                            }}
                          >
                            <div className="font-bold w-full flex justify-between">
                              All
                              {
                                selectionList.subCategories?.length === item.subCategories?.length ?
                                  <span className="absolute top-1/2 -translate-y-1/2 right-2 text-inherit w-3 h-3 flex-shrink-0">
                                    <svg viewBox="0 0 17 18">
                                      <polyline fill="none" points="1 9 7 14 15 4" stroke="currentColor" strokeDasharray="22" strokeDashoffset="44" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" style={{ transition: "stroke-dashoffset 200ms" }}></polyline>
                                    </svg>
                                  </span>
                                  : ""
                              }
                            </div>
                          </SelectItem>
                          {
                            selectionList.subCategories.map((item) =>
                              <SelectItem textValue={item.name} title={item.name} key={item.id}>
                                {item.name}
                              </SelectItem>
                            )
                          }
                        </Select>
                      </td>
                      <td className="px-2 py-2 justify-center">
                        <Switch
                          defaultSelected={item?.active}
                          onValueChange={(value) => onCellValueChange(item?.id, { active: value })}
                          className="[&>span:last-of-type]:m-0"
                        />
                      </td>
                      <td className="justify-center text-danger">
                        <Trash2 onClick={() => removeFilterValue(item?.id)} className="cursor-pointer" />
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            <Button color="default" variant="ghost" onClick={() => addNewFilterValue()} className="w-full mt-2">
              Thêm giá trị filter
            </Button>
          </div>
        </div>

        <div>
          <div className="flex gap-5">
            <Link href="/admin/filter">Quay về</Link>
            <Link href="/admin/filter/edit/new">Thêm filter</Link>
            <Button color="primary" className="ml-auto" onClick={onSave} isDisabled={isSaving}>Lưu</Button>
            <Button color="danger" variant="ghost" className="">Xoá</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterProduct
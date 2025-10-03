"use client"

import {
  Input,
  Link,
  Switch,
  Select, SelectItem,
  Button
} from "@heroui/react"
import { Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { v4 } from "uuid";
import { memo, useCallback, useMemo, useState, useEffect } from "react";

const FilterProduct = ({ categories, brands, subCategories, filter, setFilter, filterId }) => {
  const selectionList = useMemo(() => ({
    categories: categories,
    subCategories: subCategories,
    brands: brands
  }), [categories, subCategories, brands])
  const tableHeaders = [
    {
      key: "id",
      title: "ID giá trị filter",
      required: false
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

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const totalItems = filter.filterValue?.length || 0
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [totalPages, page])

  const pagedItems = useMemo(() => {
    const items = filter.filterValue || []
    const start = (page - 1) * rowsPerPage
    return items.slice(start, start + rowsPerPage)
  }, [filter.filterValue, page, rowsPerPage])

  const onCellValueChange = useCallback((valueId, value) => {
    setFilter(prev => ({
      ...prev,
      filterValue: (prev.filterValue || []).map(filterValue =>
        filterValue.id === valueId ? { ...filterValue, ...value } : filterValue
      )
    }))
  }, [setFilter])

  const onSave = async () => {

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
  }

  const addNewFilterValue = useCallback(() => {
    setFilter(prev => ({
      ...prev,
      filterValue: [
        ...((prev.filterValue) || []),
        {
          id: v4(),
          value: "",
          slug: "",
          brands: [],
          categories: [],
          subCategories: [],
          filterId: prev.id,
          active: false
        }
      ]
    }))
  }, [setFilter])

  const deleteFilter = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa filter này không?")) return

    toast.promise(
      fetch(`/api/filters/${filter.id}`, { method: "DELETE" }).then(async (res) => {
        if (!res.ok) {
          throw new Error((await res.json()).message || "Không thể xóa giá trị filter");
        }
      }),
      {
        pending: "Đang xóa...",
        success: {
          render() {
            window.location.replace("/admin/filter")
            return "Đã xóa filter thành công";
          }
        },
        error: "Không thể xóa"
      },
      { containerId: "FilterProduct" }
    )
  }

  const removeFilterValue = async (valueId) => {
    if (!confirm("Bạn có chắc muốn xóa không?")) return
    const filterToDelete = filter.filterValue?.find(item => item.id === valueId);
    setFilter(prev => ({
      ...prev,
      filterValue: (prev.filterValue || []).filter(filterValue => filterValue.id !== valueId)
    }));

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
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                  pagedItems.map((item) => (
                    <FilterRow
                      key={item.id}
                      item={item}
                      selectionList={selectionList}
                      onCellValueChange={onCellValueChange}
                      removeFilterValue={removeFilterValue}
                    />
                  ))
                }
              </tbody>
            </table>
            <div className="flex items-center justify-between mt-2 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">Dòng trên trang</span>
                <Select
                  selectedKeys={[String(rowsPerPage)]}
                  onSelectionChange={(keys) => {
                    const k = Array.from(keys)[0]
                    const next = Number(k)
                    if (!Number.isNaN(next) && next > 0) {
                      setRowsPerPage(next)
                      setPage(1)
                    }
                  }}
                  className="w-[100px]"
                >
                  {[10, 20, 50, 100].map(n => (
                    <SelectItem key={String(n)} textValue={String(n)}>{n}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className="text-sm">
                Trang {page} / {totalPages} · {totalItems} giá trị filter
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  isDisabled={page <= 1}
                  onPress={() => setPage(p => Math.max(1, p - 1))}
                >
                  Trang trước
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  isDisabled={page >= totalPages}
                  onPress={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  Trang sau
                </Button>
              </div>
            </div>
            <Button color="default" variant="ghost" onClick={() => addNewFilterValue()} className="w-full mt-2">
              Thêm giá trị filter
            </Button>
          </div>
        </div>

        <div>
          <div className="flex gap-5">
            <Link href="/admin/filter">Quay về</Link>
            <Link href="/admin/filter/edit/new">Thêm filter</Link>
            <Button color="primary" className="ml-auto" onClick={onSave}>Lưu</Button>
            <Button color="danger" variant="ghost" onClick={deleteFilter}>Xoá</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterProduct

const FilterRow = memo(function FilterRow({ item, selectionList, onCellValueChange, removeFilterValue }) {
  const handleValueChange = useCallback((value) => onCellValueChange(item.id, { value }), [item.id, onCellValueChange])
  const handleSlugChange = useCallback((value) => onCellValueChange(item.id, { slug: value }), [item.id, onCellValueChange])
  const handleBrandsChange = useCallback((value) => {
    if (Array.from(value)?.includes("all")) return
    onCellValueChange(item.id, { brands: Array.from(value).map(v => ({ id: v })) })
  }, [item.id, onCellValueChange])
  const handleCategoriesChange = useCallback((value) => {
    if (Array.from(value)?.includes("all")) return
    onCellValueChange(item.id, { categories: Array.from(value).map(v => ({ id: v })) })
  }, [item.id, onCellValueChange])
  const handleSubCategoriesChange = useCallback((value) => {
    if (Array.from(value)?.includes("all")) return
    onCellValueChange(item.id, { subCategories: Array.from(value).map(v => ({ id: v })) })
  }, [item.id, onCellValueChange])
  const toggleAllBrands = useCallback(() => {
    const allIds = selectionList.brands?.map(opt => ({ id: opt.id })) || []
    const selectedIds = item.brands || []
    if (selectedIds.length === allIds.length) {
      onCellValueChange(item.id, { brands: [] })
    } else {
      onCellValueChange(item.id, { brands: allIds })
    }
  }, [selectionList.brands, item.brands, item.id, onCellValueChange])
  const toggleAllCategories = useCallback(() => {
    const allIds = selectionList.categories?.map(opt => ({ id: opt.id })) || []
    const selectedIds = item.categories || []
    if (selectedIds.length === allIds.length) {
      onCellValueChange(item.id, { categories: [] })
    } else {
      onCellValueChange(item.id, { categories: allIds })
    }
  }, [selectionList.categories, item.categories, item.id, onCellValueChange])
  const toggleAllSubCategories = useCallback(() => {
    const allIds = selectionList.subCategories?.map(opt => ({ id: opt.id })) || []
    const selectedIds = item.subCategories || []
    if (selectedIds.length === allIds.length) {
      onCellValueChange(item.id, { subCategories: [] })
    } else {
      onCellValueChange(item.id, { subCategories: allIds })
    }
  }, [selectionList.subCategories, item.subCategories, item.id, onCellValueChange])

  return (
    <tr>
      <td scope="row" className="px-2 py-2 min-w-[80px]">
        <Input
          value={item?.id}
          readOnly
          className="min-w-[80px]"
        />
      </td>
      <td className="px-2 py-2">
        <Input
          value={item?.value || ""}
          onValueChange={handleValueChange}
          className="min-w-[80px]"
        />
      </td>
      <td className="px-2 py-2">
        <Input
          value={item?.slug || ""}
          onValueChange={handleSlugChange}
          className="min-w-[80px]"
        />
      </td>
      <td className="px-2 py-2">
        <Select
          selectionMode="multiple"
          labelPlacement="outside"
          isMultiline
          onSelectionChange={handleBrandsChange}
          selectedKeys={(item.brands ? item.brands.map(v => v.id) : [])}
          className={`w-[220px]`}
        >
          <SelectItem
            textValue="All"
            key="all"
            onClick={toggleAllBrands}
          >
            <div className="font-bold w-full flex justify-between">
              Tất cả
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
            selectionList.brands.map((opt) =>
              <SelectItem textValue={opt.name} title={opt.name} key={opt.id}>
                {opt.name}
              </SelectItem>
            )
          }
        </Select>
      </td>
      <td className="px-2 py-2">
        <Select
          selectionMode="multiple"
          labelPlacement="outside"
          isMultiline
          onSelectionChange={handleCategoriesChange}
          selectedKeys={(item.categories ? item.categories.map(v => v.id) : [])}
          className="w-[220px]"
        >
          <SelectItem
            textValue="All"
            key="all"
            onClick={toggleAllCategories}
          >
            <div className="font-bold w-full flex justify-between">
              Tất cả
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
            selectionList.categories.map((opt) =>
              <SelectItem textValue={opt.name} title={opt.name} key={opt.id}>
                {opt.name}
              </SelectItem>
            )
          }
        </Select>
      </td>
      <td className="px-2 py-2">
        <Select
          selectionMode="multiple"
          labelPlacement="outside"
          isMultiline
          onSelectionChange={handleSubCategoriesChange}
          selectedKeys={(item.subCategories ? item.subCategories.map(v => v.id) : [])}
          className="w-[220px]"
        >
          <SelectItem
            textValue="All"
            key="all"
            onClick={toggleAllSubCategories}
          >
            <div className="font-bold w-full flex justify-between">
              Tất cả
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
            selectionList.subCategories.map((opt) =>
              <SelectItem textValue={opt.name} title={opt.name} key={opt.id}>
                {opt.name}
              </SelectItem>
            )
          }
        </Select>
      </td>
      <td className="px-2 py-2 justify-center">
        <Switch
          isSelected={!!item?.active}
          onValueChange={(value) => onCellValueChange(item?.id, { active: value })}
          className="[&>span:last-of-type]:m-0"
        />
      </td>
      <td className="justify-center text-danger">
        <Trash2 onClick={() => removeFilterValue(item?.id)} className="cursor-pointer" />
      </td>
    </tr>
  )
})
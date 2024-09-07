"use client"

import { useCallback } from "react";
import {
  Spinner, Table,
  TableCell, TableColumn,
  TableHeader, TableRow,
  TableBody,
  Input,
  Link,
  Switch,
  Select, SelectItem,
  Chip,
  Button
} from "@nextui-org/react"

import { toast, ToastContainer } from "react-toastify";
import { v4 } from "uuid";

const FilterProduct = ({ categories, brands, subCategories, filter, setFilter }) => {

  const tableHeaders = [
    {
      key: "id",
      title: "ID thuộc tính"
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
      key: "translatedValue",
      title: "Tên tiếng Anh"
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
      title: "Trạng thái active"
    }
  ];

  const onCellValueChange = (valueId, value) => {
    if (!valueId) return;
    let filterToUpdate = { ...filter }
    filterToUpdate.filterValue?.map(filterValue => filterValue.id === valueId ? Object.assign(filterValue, value) : filterValue)
    setFilter(filterToUpdate)
  }

  const onSave = async () => {
    let res

    let filterValues = filter.filterValue ? filter.filterValue.map(item => {
      return {
        ...item,
        brands: item.brands ? item.brands.map(b => b.id) : [],
        categories: item.categories ? item.categories.map(cate => cate.id) : [],
        subCategories: item.subCategories ? item.subCategories.map(subcate => subcate.id) : [],
      }
    }) : []

    if (!filter.createdAt) {
      res = await fetch(`/api/filters/`, {
        method: "POST",
        body: JSON.stringify({
          ...filter,
          filterValue: filterValues
        })
      })
    } else {
      res = await fetch(`/api/filters/${filter.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...filter,
          filterValue: filterValues
        })
      })

    }

    if (res.ok) {
      toast.success("Đã cập nhật")
    } else {
      toast.error("Không thể cập nhật")
    }
  }

  const addNewFilterValue = () => {
    setFilter({
      ...filter,
      filterValue: [
        ...filter.filterValue,
        {
          id: v4(),
          value: "",
          slug: "",
          translatedValue: "",
          brands: [],
          categories: [],
          subCategories: [],
          active: false
        }
      ]
    });
  }

  const renderCell = useCallback((filterValue, columnKey) => {
    const cellValue = filterValue[columnKey]
    const selectionList = {
      categories: categories,
      subCategories: subCategories,
      brands: brands
    }
    switch (columnKey) {
      case "active":
        return (
          <div className="flex justify-center">
            <Switch
              aria-label={columnKey}
              defaultSelected={cellValue}
              onValueChange={(value) => onCellValueChange(filterValue?.id, { [columnKey]: value })}
              className="[&>span:last-of-type]:m-0"
            />
          </div>
        )
      case "categories":
      case "subCategories":
      case "brands":
        return (
          <Select
            aria-label={columnKey}
            selectionMode="multiple"
            labelPlacement="outside"
            value={cellValue}
            onSelectionChange={(value) => onCellValueChange(filterValue?.id, { [columnKey]: Array.from(value) })}
            selectedKeys={new Set(filterValue[columnKey].map(v => v.id))}
            classNames={{
              base: "min-w-[120px] max-w-[240px]",
              innerWrapper: "pr-6 !w-full",
              trigger: "h-auto gap-2 py-2",
              value: "whitespace-normal"
            }}
            renderValue={(items) => {
              return (
                <div className="flex flex-wrap gap-2">
                  {
                    items?.map(item => <Chip key={item.key}>{item.textValue}</Chip>)
                  }
                </div>
              );
            }}
          >
            {
              selectionList[columnKey].map((item) =>
                <SelectItem key={item.id}>
                  {item.name}
                </SelectItem>
              )
            }
          </Select>
        )
      default:
        return (
          <Input
            aria-label={columnKey}
            defaultValue={cellValue}
            onValueChange={(value) => onCellValueChange(filterValue?.id, { [columnKey]: value })}
          />
        );
    }
  }, [])

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col gap-2 min-h-full">

        <div className="px-1 py-2 border-default-200">
          <Table
            // loadingState={loadingState}
            aria-label="Tất cả sản phẩm"
            // bottomContent={
            //   loadingState === "loading" ? null :
            //     <div className="flex w-full justify-center">
            //       <Pagination
            //         isCompact
            //         showControls
            //         showShadow
            //         page={page}
            //         total={pages}
            //         onChange={(page) => setPage(page)}
            //       />
            //     </div>
            // }
            bottomContent={
              <Button color="default" variant="ghost" onClick={() => addNewFilterValue()}>
                Thêm thuộc tính
              </Button>
            }
          >
            <TableHeader>
              {
                tableHeaders.map(col =>
                  <TableColumn
                    key={col.key}
                    text-value={col.title}
                    aria-label={col.title}
                    className={`
                      max-w-[150px] whitespace-normal text-center last:w-[100px]
                      ${col.required && "after:content-['*'] after:text-[#f31260]"}
                    `}
                  >
                    {col.title}
                  </TableColumn>
                )
              }
            </TableHeader>
            <TableBody
              items={filter.filterValue || []}
              // isLoading={loadingState === "loading"}
              emptyContent={"Không có giá trị filter nào"}
              loadingContent={<Spinner label="Loading..." />}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => <TableCell className="max-w-8">{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div>
          <div className="flex gap-5">
            <Link href="/admin/filter">Quay về</Link>
            <Link href="/admin/filter/edit/new">Thêm filter</Link>
            <Button color="primary" className="ml-auto" onClick={onSave}>Lưu</Button>
            <Button color="default" variant="ghost" className="">Xoá</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterProduct
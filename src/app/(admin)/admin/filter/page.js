"use client"

import { Button, Input, Link, Pagination, Select, SelectItem, Spinner, Switch, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { EditIcon, Trash2, Search, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const rowsPerPage = 10;

const Filter = () => {
  const [filters, setFilters] = useState([])
  const [loadingState, setLoadingState] = useState("loading")
  const [condition, setCondition] = useState({})

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0)

  const tableHeaders = [
    {
      key: "id",
      title: "ID"
    },
    {
      key: "name",
      title: "Tên filter"
    },
    {
      key: "categoryCount",
      title: "Số lượng cate"
    },
    {
      key: "subCategoryCount",
      title: "Số lượng sub-cate"
    },
    {
      key: "brandCount",
      title: "Số lượng thương hiệu"
    },
    {
      key: "active",
      title: "Trạng thái filter"
    },
    {
      key: "actions",
      title: ""
    }
  ];

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);

  useEffect(() => {
    getFilter()
  }, [page])

  const getFilter = async () => {
    setLoadingState("loading")
    let filteredCondition = { ...condition }
    Object.keys(filteredCondition).forEach(key => filteredCondition[key] === undefined && delete filteredCondition[key])
    const queryString = new URLSearchParams(filteredCondition).toString()

    await fetch(`/api/filters/?size=${rowsPerPage}&page=${page}&${queryString}`).then(res => res.json()).then(json => {
      setFilters(json.result)
      setTotal(json.total)
      if (Math.ceil(json.total / rowsPerPage) < page) {
        setPage(Math.ceil(json.total / rowsPerPage))
      }
    })
    setLoadingState("idle")
  }

  const deleteFilter = async (id) => {
    await fetch(`/api/filters/${id}`, { method: "DELETE" })
    getFilter()
  }

  const updateFilter = async (id, active) => {
    await fetch(`/api/filters/${id}/active`, { method: "PUT", body: JSON.stringify({ active: active }) })
  }

  const onConditionChange = (value) => {
    setCondition(Object.assign({}, condition, value))
  }

  const renderCell = useCallback((filter, columnKey) => {
    const cellValue = filter[columnKey]
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Link href={`/admin/filter/edit/${filter.id}`}>
              <span className="text-lg cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Link>
            <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
              <Trash2 onClick={() => deleteFilter(filter.id)} />
            </span>
          </div>
        )
      case "active":
        return (
          <div className="flex justify-center">
            <Switch onClick={() => updateFilter(filter.id, !filter.active)} defaultSelected={filter.active} />
          </div>
        );
      default:
        return cellValue
    }
  }, [])

  return (
    <>
      <div className="flex flex-col space-y-4 min-h-full p-2">
        <div className="flex gap-3">
          <Input label="Tên filter" aria-label="Tên filter" labelPlacement="outside" defaultValue={condition.name}
            isClearable
            onValueChange={(value) => {
              if (value.length > 2 || value.length === 0) onConditionChange({ name: value })
            }}
          />

          <Input label="Tên giá trị filter" aria-label="Tên giá trị filter" labelPlacement="outside" defaultValue={condition.attrName}
            isClearable
            onValueChange={(value) => {
              if (value.length > 2 || value.length === 0) onConditionChange({ attrName: value })
            }}
          />

          <Input label="ID filter" aria-label="ID filter" labelPlacement="outside" defaultValue={condition.id}
            isClearable
            onValueChange={(value) => {
              if (value.length > 2 || value.length === 0) onConditionChange({ id: value })
            }}
          />

          <Input label="ID giá trị filter" aria-label="ID giá trị filter" labelPlacement="outside" defaultValue={condition.attrId}
            isClearable
            onValueChange={(value) => {
              if (value.length > 2 || value.length === 0) onConditionChange({ attrId: value })
            }}
          />

          <Select
            label="Active"
            labelPlacement="outside"
            onSelectionChange={(value) => onConditionChange({ active: value.values().next().value })}>
            <SelectItem key="true">
              Active
            </SelectItem>
            <SelectItem key="false">
              Inactive
            </SelectItem>
          </Select>

          <Button onClick={getFilter} color="primary" title="Tìm kiếm" className="mt-auto">
            <Search />
          </Button>

          <Link href="/admin/filter/edit/new" className="mt-auto">
            <Button color="primary" title="Thêm mới">
              <Plus />
            </Button>
          </Link>
        </div>

        <Table
          aria-label="Tất cả filter"
          loadingState={loadingState}
          bottomContent={
            loadingState === "loading" ? null :
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
          }>
          <TableHeader>
            {
              tableHeaders.map(col =>
                <TableColumn
                  key={col.key}
                  text-value={col.title}
                  aria-label={col.title}
                  className="max-w-[150px] whitespace-normal text-center last:w-[100px]"
                >
                  {col.title}
                </TableColumn>
              )
            }
          </TableHeader>
          <TableBody
            items={filters}
            emptyContent={"Không có filter nào"}
            isLoading={loadingState === "loading"}
            loadingContent={<Spinner label="Loading..." />}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => <TableCell className="text-center">{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default Filter
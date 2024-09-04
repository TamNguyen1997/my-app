"use client"

import { Button, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Select, SelectItem, Spinner, Switch, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import { EditIcon, Trash2, Search, Plus } from "lucide-react";
import { title } from "process";
import { useCallback, useEffect, useMemo, useState } from "react";

const rowsPerPage = 10;

const Filter = () => {
  const [filters, setFilters] = useState([])
  const [loadingState, setLoadingState] = useState("loading")
  const [selectedFilter, setSelectedFilter] = useState({})
  const [condition, setCondition] = useState({})

  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const tableHeaders = [
    {
      key: "id",
      title: "ID thuộc tính"
    },
    {
      key: "name",
      title: "Tên thuộc tính"
    },
    {
      key: "attrId",
      title: "ID giá trị thuộc tính"
    },
    {
      key: "attrName",
      title: "Tên giá trị thuộc tính tiếng Việt"
    },
    {
      key: "subCateCount",
      title: "Số lượng sub-cate"
    },
    {
      key: "brandCount",
      title: "Số lượng thương hiệu"
    },
    {
      key: "active",
      title: "Trạng thái thuộc tính active"
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
    fetch('/api/categories?type=CATE').then(res => res.json()).then(json => setCategories(json.result))
    fetch('/api/brands').then(res => res.json()).then(setBrands)
    fetch('/api/categories?type=SUB_CATE').then(res => res.json()).then(json => setSubCategories(json.result))
    getFilter()
  }, [])

  const getFilter = async () => {
    setLoadingState("loading")
    let filteredCondition = { ...condition }
    Object.keys(filteredCondition).forEach(key => filteredCondition[key] === undefined && delete filteredCondition[key])
    const queryString = new URLSearchParams(filteredCondition).toString()

    await fetch(`/api/filters/?size=${rowsPerPage}&page=${page}&${queryString}`).then(res => res.json()).then(json => {
      setFilters(json.result)
      setTotal(json.count)
    })
    setLoadingState("idle")
  }

  const deleteFilter = async (id) => {
    await fetch(`/api/filters/${id}`, { method: "DELETE" })
    getFilter()
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
            <Switch />
          </div>
        );
      default:
        return cellValue
    }
  }, [])

  // const getTargetSelect = useCallback(() => {
  //   switch (selectedFilter.targetType) {
  //     case "SUB_CATEGORY":
  //       return (<>
  //         <Select
  //           label="Target"
  //           labelPlacement="outside"
  //           selectedKeys={new Set([selectedFilter.categoryId])}
  //           onSelectionChange={(value) =>
  //             setSelectedFilter(Object.assign({}, selectedFilter, { categoryId: value.values().next().value }))}
  //         >
  //           {
  //             subCategories.map((category) => <SelectItem key={category.id}>
  //               {category.name}
  //             </SelectItem>)
  //           }
  //         </Select>
  //       </>)
  //     case "BRAND":
  //       return (<>
  //         <Select
  //           label="Target"
  //           labelPlacement="outside"
  //           selectedKeys={new Set([selectedFilter.brandId])}
  //           onSelectionChange={(value) =>
  //             setSelectedFilter(Object.assign({}, selectedFilter, { brandId: value.values().next().value }))}
  //         >
  //           {
  //             brands.map((brand) => <SelectItem key={brand.id}>
  //               {brand.name}
  //             </SelectItem>)
  //           }
  //         </Select>
  //       </>)
  //     case "CATEGORY":
  //     default:
  //       return (<>
  //         <Select
  //           label="Target"
  //           labelPlacement="outside"
  //           selectedKeys={new Set([selectedFilter.categoryId])}
  //           onSelectionChange={(value) =>
  //             setSelectedFilter(Object.assign({}, selectedFilter, { categoryId: value.values().next().value }))}
  //         >
  //           {
  //             categories.map((category) => <SelectItem key={category.id}>
  //               {category.name}
  //             </SelectItem>)
  //           }
  //         </Select>
  //       </>)
  //   }

  // }, [selectedFilter])

  return (
    <>
      <div className="flex flex-col space-y-4 min-h-full p-2">
        <div className="flex gap-3">
          <Input label="Tên thuộc tính" aria-label="Tên thuộc tính" labelPlacement="outside" defaultValue={condition.name}
            isClearable
            onValueChange={(value) => {
              if (value.length > 2 || value.length === 0) onConditionChange({ name: value })
            }}
          />

          <Input label="Tên giá trị thuộc tính" aria-label="Tên giá trị thuộc tính" labelPlacement="outside" defaultValue={condition.attrName}
            isClearable
            onValueChange={(value) => {
              if (value.length > 2 || value.length === 0) onConditionChange({ attrName: value })
            }}
          />

          <Input label="ID thuộc tính" aria-label="ID thuộc tính" labelPlacement="outside" defaultValue={condition.id}
            isClearable
            onValueChange={(value) => {
              if (value.length > 2 || value.length === 0) onConditionChange({ id: value })
            }}
          />

          <Input label="ID giá trị thuộc tính" aria-label="ID giá trị thuộc tính" labelPlacement="outside" defaultValue={condition.attrId}
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
            {/* <TableColumn key="name" textValue="Tên filter" aria-label="Tên filter">Tên filter</TableColumn>
            <TableColumn key="slug" textValue="slug" aria-label="slug">Slug</TableColumn>
            <TableColumn key="active" textValue="active" aria-label="active">Active</TableColumn>
            <TableColumn key="actions" textValue="actions" width="100"></TableColumn> */}
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
      {/* <div className="pt-3">
        <Link href="/admin/filter/edit/new" className="float-right">Thêm filter</Link>
      </div>
      <Modal scrollBehavior="inside" size="5xl"
        isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Chi tiết filter</ModalHeader>
              <ModalBody>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    label="Tên"
                    value={selectedFilter.name}
                    onValueChange={(value) => setSelectedFilter(Object.assign({}, selectedFilter, { name: value }))}
                    labelPlacement="outside" isRequired />
                  <Input
                    type="text"
                    label="Slug"
                    value={selectedFilter.slug}
                    labelPlacement="outside" isDisabled />
                  <Select
                    label="Loại"
                    labelPlacement="outside"
                    selectedKeys={new Set([selectedFilter.targetType || "CATEGORY"])}
                    onSelectionChange={(value) =>
                      setSelectedFilter(Object.assign({}, selectedFilter, { targetType: value.values().next().value }))}
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
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" type="submit" onPress={onSave}>
                  Lưu
                </Button>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal> */}
    </>
  )
}

export default Filter
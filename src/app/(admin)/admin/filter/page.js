"use client"

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Select, SelectItem, Spinner, Switch, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import { EditIcon, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const rowsPerPage = 10;

const Filter = ({ query }) => {
  const [filters, setFilters] = useState([])
  const [loadingState, setLoadingState] = useState("loading")
  const [selectedFilter, setSelectedFilter] = useState({})

  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const newFilter = () => {
    setSelectedFilter({})
    onOpen()
  }

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);

  useEffect(() => {
    fetch('/api/categories?type=CATE').then(res => res.json()).then(json => setCategories(json.result))
    fetch('/api/brands').then(res => res.json()).then(setBrands)
    fetch('/api/categories?type=SUB_CATE').then(res => res.json()).then(json => setSubCategories(json.result))
    getFilter()
  }, [query])

  const getFilter = async () => {
    setLoadingState("loading")
    await fetch(`/api/filters/`).then(res => res.json()).then(json => {
      setFilters(json.result)
      setTotal(json.count)
    })
    setLoadingState("idle")
  }

  const deleteProduct = async (id) => {
    const res = await fetch(`/api/filters/${id}`, { method: "DELETE" }).then(() => getFilter())
    if (res.ok) {
      toast.success("Đã xóa filter")
    } else {
      toast.error("Không thể xóa filter")
    }
  }

  const renderCell = useCallback((filter, columnKey) => {
    const cellValue = filter[columnKey]
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon onClick={() => openModal(filter)} />
            </span>
            <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
              <Trash2 onClick={() => deleteProduct(filter.id)} />
            </span>
          </div>
        )
      case "active":
        return (
          <div className="relative flex items-center gap-2">
            <Switch defaultSelected={product.active} onValueChange={(value) => { }}></Switch>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  const onSave = () => {

  }

  const getTargetSelect = useCallback(() => {
    switch (selectedFilter.targetType) {
      case "SUB_CATEGORY":
        return (<>
          <Select
            label="Target"
            labelPlacement="outside"
            selectedKeys={new Set([selectedFilter.categoryId])}
            onSelectionChange={(value) =>
              setSelectedFilter(Object.assign({}, selectedFilter, { categoryId: value.values().next().value }))}
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
            selectedKeys={new Set([selectedFilter.brandId])}
            onSelectionChange={(value) =>
              setSelectedFilter(Object.assign({}, selectedFilter, { brandId: value.values().next().value }))}
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
            selectedKeys={new Set([selectedFilter.categoryId])}
            onSelectionChange={(value) =>
              setSelectedFilter(Object.assign({}, selectedFilter, { categoryId: value.values().next().value }))}
          >
            {
              categories.map((category) => <SelectItem key={category.id}>
                {category.name}
              </SelectItem>)
            }
          </Select>
        </>)
    }

  }, [selectedFilter])

  return (
    <>
      <ToastContainer />
      <div>
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
            <TableColumn key="name" textValue="Tên filter" aria-label="Tên filter">Tên filter</TableColumn>
            <TableColumn key="slug" textValue="slug" aria-label="slug">Slug</TableColumn>
            <TableColumn key="active" textValue="active" aria-label="active">Active</TableColumn>
            <TableColumn key="actions" textValue="actions" width="100"></TableColumn>
          </TableHeader>
          <TableBody
            items={filters}
            emptyContent={"Không có filter nào"}
            isLoading={loadingState === "loading"}
            loadingContent={<Spinner label="Loading..." />}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="pt-3">
        <Button color="primary" onClick={newFilter} className="w-24 float-right">Thêm filter</Button>
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
                <div>
                  {
                    (selectedFilter.filterValues || []).map(filterValue => {

                    })
                  }
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" type="submit" onPress={onSave}>
                  Lưu
                </Button>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default Filter
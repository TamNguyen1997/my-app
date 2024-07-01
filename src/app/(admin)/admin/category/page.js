"use client"

import {
  Button, Input,
  Modal, ModalBody,
  ModalContent, ModalFooter,
  ModalHeader, Select, SelectItem, Spinner,
  Table, TableBody,
  TableCell, TableColumn,
  TableHeader, TableRow,
  useDisclosure
} from "@nextui-org/react";
import { EditIcon, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const categoryTypes = [
  {
    key: "BRAND",
    label: "Nhãn hàng"
  },
  {
    key: "CATEGORY",
    label: "Category"
  }
]


const Category = () => {
  const [categories, setCategories] = useState([])
  const [selectedCate, setSelectedCate] = useState({})

  const [isLoading, setIsLoading] = useState(true)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [reload, setReload] = useState(false)
  const [categoryType, setCategoryType] = useState(new Set(["CATEGORY"]))

  if (reload) {
    redirect("/admin/category")
  }

  useEffect(() => {
    const getCategories = () => {
      fetch('/api/categories/').then(async res => {
        setCategories(await res.json())
        setIsLoading(false)
      })
    }

    getCategories()
  }, [])

  const onSubmit = () => {
    const cate = Object.assign(selectedCate, { type: categoryType.values().next().value })
    if (selectedCate.id) {
      fetch(`/api/categories/${selectedCate.id}`, { method: "PUT", body: JSON.stringify(cate) })
    } else {
      fetch('/api/categories/', { method: "POST", body: JSON.stringify(cate) })
    }
  }

  const openModal = (category) => {
    setSelectedCate(category)
    onOpen()
  }

  const deleteCate = (id) => [
    fetch(`/api/categories/${id}`, { method: "DELETE" }).then(() => setReload(true))
  ]

  const renderCell = useCallback((category, columnKey) => {
    const cellValue = category[columnKey]

    switch (columnKey) {
      case "type":
        return categoryTypes.find(item => item.key === cellValue).label
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon onClick={() => openModal(category)} />
            </span>
            <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
              <Trash2 onClick={() => { deleteCate(category.id) }} />
            </span>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  const newCate = () => {
    setSelectedCate({})
    onOpen()
  }

  const onValueChange = (value) => {
    setSelectedCate(Object.assign(
      {},
      selectedCate,
      { name: value, slug: convertToSlug(value) }))
  }

  return (
    <div>
      <div className="flex flex-col gap-2 border-r min-h-full p-2">
        <div className="px-1 py-2 border-default-200">
          <Table
            aria-label="Tất cả sản phẩm">
            <TableHeader>
              <TableColumn key="name" textValue="name">Tên</TableColumn>
              <TableColumn key="slug" textValue="slug">Slug</TableColumn>
              <TableColumn key="type" textValue="type">Loại</TableColumn>
              <TableColumn key="actions" textValue="actions"></TableColumn>
            </TableHeader>
            <TableBody
              items={categories}
              isLoading={isLoading}
              emptyContent={"Không có category nào"}
              loadingContent={<Spinner label="Loading..." />}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="p-3">
        <Button color="primary" onClick={newCate}>Thêm category</Button>
      </div>
      <div>
        <Modal
          scrollBehavior="inside"
          isOpen={isOpen} onOpenChange={onOpenChange}>
          <form onSubmit={onSubmit}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Chi tiết category</ModalHeader>
                  <ModalBody>
                    <Input
                      type="text"
                      label="Category"
                      defaultValue={selectedCate.name}
                      onValueChange={onValueChange}
                      labelPlacement="outside" isRequired />
                    <Input
                      type="text"
                      label="Slug"
                      value={selectedCate.slug}
                      labelPlacement="outside" isRequired disabled />
                    <Select
                      label="Phân loại"
                      labelPlacement="outside"
                      defaultSelectedKeys={categoryType}
                      onSelectionChange={setCategoryType}
                    >
                      {
                        categoryTypes.map((type) => (
                          <SelectItem key={type.key}>
                            {type.label}
                          </SelectItem>
                        ))
                      }
                    </Select>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" type="submit">
                      Lưu
                    </Button>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </form>
        </Modal>
      </div>
    </div>
  );
};

function convertToSlug(text) {
  return text.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

export default Category;

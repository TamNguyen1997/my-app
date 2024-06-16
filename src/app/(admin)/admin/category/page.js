"use client"

import {
  Autocomplete, AutocompleteItem,
  Button, Input,
  Modal, ModalBody,
  ModalContent, ModalFooter,
  ModalHeader, Spinner,
  Table, TableBody,
  TableCell, TableColumn,
  TableHeader, TableRow,
  useDisclosure
} from "@nextui-org/react";
import { EditIcon, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const Category = () => {
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedSubCate, setSelectedSubCate] = useState({})

  useEffect(() => {
    const getCategories = () => {
      fetch('/api/categories/').then(async res => {
        setCategories(await res.json())
        setIsLoading(false)
      })
    }
    const getSubCategories = () => {
      fetch('/api/sub-categories/').then(async res => {
        setSubCategories(await res.json())
        setIsLoading(false)
      })
    }
    getCategories()
    getSubCategories()
  }, [])

  const onSubmit = () => {
    if (selectedSubCate.id) {
      fetch(`/api/sub-categories/${selectedSubCate.id}`, { method: "PUT", body: JSON.stringify(selectedSubCate) })
    } else {
      fetch('/api/sub-categories/', { method: "POST", body: JSON.stringify(selectedSubCate) })
    }
  }

  const openModal = (subCategory) => {
    setSelectedSubCate(subCategory)
    onOpen()
  }

  const deleteSubCate = (id) => [
    fetch(`/api/sub-categories/${id}`, { method: "DELETE" }).then(() => window.location.reload())
  ]

  const renderCell = useCallback((subCategory, columnKey) => {
    const cellValue = subCategory[columnKey]

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon onClick={() => openModal(subCategory)} />
            </span>
            <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
              <Trash2 onClick={() => { deleteSubCate(subCategory.id) }} />
            </span>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  const newSubCate = () => {
    setSelectedSubCate({})
    onOpen()
  }

  return (
    <div>
      <div className="flex flex-col gap-2 border-r min-h-full p-2">
        <div className="px-1 py-2 border-default-200">
          <Table
            aria-label="Tất cả sản phẩm">
            <TableHeader>
              <TableColumn key="id" textValue="Mã sản phẩm">ID category</TableColumn>
              <TableColumn key="name" textValue="name">Category</TableColumn>
            </TableHeader>
            <TableBody
              items={categories}
              isLoading={isLoading}
              emptyContent={"Không có category nào"}
              loadingContent={<Spinner label="Loading..." />}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="pt-3">
            <Table
              aria-label="Tất cả sản phẩm">
              <TableHeader>
                <TableColumn key="id" textValue="Mã sản phẩm">ID sub-category</TableColumn>
                <TableColumn key="name" textValue="name">Sub-category</TableColumn>
                <TableColumn key="categoryId" textValue="categoryId">Category</TableColumn>
                <TableColumn key="actions" textValue="actions"></TableColumn>
              </TableHeader>
              <TableBody
                items={subCategories}
                isLoading={isLoading}
                emptyContent={"Không có sub-category nào"}
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
      </div>
      <div className="p-3">
        <Button color="primary" onClick={newSubCate}>Thêm sub-category</Button>
      </div>
      <div>
        <Modal
          size="5xl" scrollBehavior="inside"
          isOpen={isOpen} onOpenChange={onOpenChange}>
          <form onSubmit={onSubmit}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Chi tiết sub-category</ModalHeader>
                  <ModalBody>
                    <Input
                      type="text"
                      label="Sub category"
                      defaultValue={selectedSubCate.name}
                      onValueChange={(value) => setSelectedSubCate(Object.assign({}, selectedSubCate, { name: value }))}
                      labelPlacement="outside" isRequired></Input>
                    <Autocomplete
                      label="Category"
                      variant="bordered"
                      aria-label="Category"
                      defaultItems={categories}
                      selectedKey={selectedSubCate.categoryId}
                      className="max-w-xs p-3"
                      onSelectionChange={value => setSelectedSubCate(Object.assign({}, selectedSubCate, { categoryId: value }))}
                      isRequired>
                      {(category) => <AutocompleteItem key={category.id}>{category.name}</AutocompleteItem>}
                    </Autocomplete>
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

export default Category;

"use client"

import ImagePicker from "@/app/components/admin/ui/ImagePicker";
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
import slugify from "slugify"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const categoryTypes = [
  {
    key: "CATEGORY",
    label: "Category"
  },
  {
    key: "BRAND",
    label: "Nhãn hàng"
  }
]


const Category = () => {
  const [categories, setCategories] = useState([])
  const [selectedCate, setSelectedCate] = useState({})

  const [isLoading, setIsLoading] = useState(true)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [categoryType, setCategoryType] = useState(new Set(["CATEGORY"]))

  const getCategories = () => {
    setIsLoading(true)
    fetch('/api/categories/').then(async res => {
      setCategories((await res.json()).result)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    getCategories()
  }, [])


  const onSubmit = (e) => {
    e.preventDefault()
    const cate = Object.assign(selectedCate, { type: categoryType.values().next().value })
    if (selectedCate.id) {
      toast.promise(
        fetch(`/api/categories/${selectedCate.id}`, { method: "PUT", body: JSON.stringify(cate) }).then(async (res) => {
          getCategories()
          if (!res.ok) {
            throw new Error((await res.json()).message)
          }
        }),
        {
          pending: 'Đang chỉnh sửa category',
          success: 'Đã chỉnh sửa category',
          error: {
            render({ data }) {
              return data.message
            }
          }
        }
      )
    } else {
      toast.promise(
        fetch('/api/categories/', { method: "POST", body: JSON.stringify(cate) }).then(async (res) => {
          getCategories()
          if (!res.ok) {
            throw new Error((await res.json()).message)
          }
        }),
        {
          pending: 'Đang tạo category',
          success: 'Đã tạo category',
          error: {
            render({ data }) {
              return data.message
            }
          }
        }
      )
    }
  }

  const openModal = (category) => {
    setSelectedCate(category)
    onOpen()
  }

  const deleteCate = (id) => {
    toast.promise(
      fetch(`/api/categories/${id}`, { method: "DELETE" }).then(async (res) => {
        getCategories()
        if (!res.ok) {
          throw new Error((await res.json()).message)
        }
      }),
      {
        pending: 'Đang xóa category',
        success: 'Đã xóa category',
        error: {
          render({ data }) {
            return data.message
          }
        }
      }
    )
  }

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
      { name: value, slug: slugify(value, { locale: 'vi' }).toLowerCase() }))
  }

  return (
    <div className="flex flex-col gap-10">
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

      <SubCategory categories={categories} />

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
                    <Button color="primary" type="submit" onPress={onClose}>
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
      <ToastContainer />
    </div>
  );
};

const SubCategory = ({ categories }) => {
  const [subCategories, setSubCategories] = useState([])
  const [selectedSubCate, setSelectedSubCate] = useState({})

  const [isLoading, setIsLoading] = useState(true)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const imageModal = useDisclosure();

  const [reload, setReload] = useState(false)

  if (reload) {
    redirect("/admin/category")
  }

  useEffect(() => {
    getSubCate()
  }, [])

  const getSubCate = () => {
    setIsLoading(true)
    fetch('/api/sub-categories/').then(async res => {
      setSubCategories(await res.json())
      setIsLoading(false)
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (selectedSubCate.id) {
      toast.promise(
        fetch(`/api/sub-categories/${selectedSubCate.id}`, { method: "PUT", body: JSON.stringify(selectedSubCate) }).then(async (res) => {
          getSubCate()
          if (!res.ok) {
            throw new Error((await res.json()).message)
          }
        }),
        {
          pending: 'Đang chỉnh sửa sub category',
          success: 'Đã chỉnh sửa sub category',
          error: {
            render({ data }) {
              return data.message
            }
          }
        }
      )
    } else {
      toast.promise(
        fetch('/api/sub-categories/', { method: "POST", body: JSON.stringify(selectedSubCate) }).then(async (res) => {
          getSubCate()
          if (!res.ok) {
            throw new Error((await res.json()).message)
          }
        }),
        {
          pending: 'Đang thêm category',
          success: 'Đã thêm category',
          error: {
            render({ data }) {
              return data.message
            }
          }
        }
      )
    }
  }

  const openModal = (subCategory) => {
    setSelectedSubCate(subCategory)
    onOpen()
  }

  const deleteSubCate = (id) => {
    toast.promise(
      fetch(`/api/sub-categories/${id}`, { method: "DELETE" }).then(async (res) => {
        getSubCate()
        if (!res.ok) {
          throw new Error((await res.json()).message)
        }
      }),
      {
        pending: 'Đang xóa category',
        success: 'Đã xóa category',
        error: {
          render({ data }) {
            return data.message
          }
        }
      }
    )
  }

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

  const onValueChange = (value) => {
    setSelectedSubCate(Object.assign(
      {},
      selectedSubCate,
      { name: value, slug: slugify(value, { locale: 'vi' }).toLowerCase() }))
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
              <TableColumn key="actions" textValue="actions"></TableColumn>
            </TableHeader>
            <TableBody
              items={subCategories}
              isLoading={isLoading}
              emptyContent={"Không có sub category nào"}
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
        <Button color="primary" onClick={newSubCate}>Thêm sub category</Button>
      </div>
      <div>
        <Modal
          scrollBehavior="inside"
          isOpen={isOpen} onOpenChange={onOpenChange}>
          <form onSubmit={onSubmit}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Chi tiết sub category</ModalHeader>
                  <ModalBody>
                    <Input
                      type="text"
                      label="Sub category"
                      defaultValue={selectedSubCate.name}
                      onValueChange={onValueChange}
                      labelPlacement="outside" isRequired />
                    <Input
                      type="text"
                      label="Slug"
                      value={selectedSubCate.slug}
                      labelPlacement="outside" isRequired disabled />
                    <div className='flex gap-3'>
                      <Input label="Hình ảnh" aria-label="Hình ảnh" value={selectedSubCate?.imageUrl} disabled></Input>
                      <div className='pt-2'>
                        <Button onClick={imageModal.onOpen} className=''>Chọn ảnh</Button>
                      </div>
                    </div>
                    <Select
                      label="Phân loại"
                      labelPlacement="outside"
                      defaultSelectedKeys={new Set([selectedSubCate.categoryId])}
                      onSelectionChange={(value) =>
                        setSelectedSubCate(Object.assign({}, selectedSubCate, { categoryId: value.values().next().value }))}
                    >
                      {
                        categories.map((category) => (
                          <SelectItem key={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      }
                    </Select>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" type="submit" onPress={onClose}>
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

        <Modal isOpen={imageModal.isOpen} onOpenChange={imageModal.onOpenChange} size="5xl" scrollBehavior="inside">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Chèn hình</ModalHeader>
                <ModalBody>
                  <ImagePicker disableAdd onImageClick={(image) => {
                    setSelectedSubCate(Object.assign({}, selectedSubCate, { imageUrl: image.path }))
                    onClose()
                  }} disableDelete></ImagePicker>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Đóng
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Category;

"use client"

import ImagePicker from "@/app/components/admin/ui/ImagePicker";
import {
  Button, Input,
  Modal, ModalBody,
  ModalContent, ModalFooter,
  ModalHeader, Pagination, Select, SelectItem, Spinner,
  Switch,
  Table, TableBody,
  TableCell, TableColumn,
  TableHeader, TableRow,
  useDisclosure
} from "@nextui-org/react";
import { EditIcon, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import slugify from "slugify"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const rowsPerPage = 10;

const Category = () => {
  const [categories, setCategories] = useState([])
  const [selectedCate, setSelectedCate] = useState({})
  const [condition, setCondition] = useState({})
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const imageModal = useDisclosure()

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0)
  const [loadingState, setLoadingState] = useState("loading")

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);

  const getCategories = () => {
    setLoadingState("loading")
    let filteredCondition = { ...condition }
    Object.keys(filteredCondition).forEach(key => filteredCondition[key] === undefined && delete filteredCondition[key])
    const queryString = new URLSearchParams(filteredCondition).toString()
    fetch(`/api/categories/?size=${10}&page=${page}&${queryString}&type=CATE&includeImage=true`).then(async res => {
      const data = await res.json()
      setCategories(data.result)
      setTotal(data.total)
      setLoadingState("idle")
    })
  }

  useEffect(() => {
    getCategories()
  }, [page, condition])


  const onSubmit = (e) => {
    e.preventDefault()
    if (selectedCate.id) {
      toast.promise(
        fetch(`/api/categories/${selectedCate.id}`, { method: "PUT", body: JSON.stringify(selectedCate) }).then(async (res) => {
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
        fetch('/api/categories/', { method: "POST", body: JSON.stringify(selectedCate) }).then(async (res) => {
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

  const quickUpdate = async (category, value) => {
    const categoryToUpdate = Object.assign({}, category, value)
    await fetch(`/api/categories/${categoryToUpdate.id}`, { method: "PUT", body: JSON.stringify(categoryToUpdate) })
  }

  const renderCell = useCallback((category, columnKey) => {
    const cellValue = category[columnKey]

    switch (columnKey) {
      case "highlight":
        return <div className="relative flex items-center">
          <Switch defaultSelected={category.highlight} onValueChange={(value) => quickUpdate(category, { highlight: value })}></Switch>
        </div>
      case "showOnHeader":
        return <div className="relative flex items-center">
          <Switch defaultSelected={category.showOnHeader} onValueChange={(value) => quickUpdate(category, { showOnHeader: value })}></Switch>
        </div>
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

  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-3 w-1/2">
        <Input label="Tên category" aria-label="Tên category" labelPlacement="outside" defaultValue={condition.name}
          onValueChange={(value) => {
            if (value.length > 2 || !value.length) setCondition(Object.assign({}, condition, { name: value }))
          }}
        />
        <Input label="Slug" aria-label="slug" labelPlacement="outside" value={condition.slug}
          onValueChange={(value) => {
            if (value.length > 2 || !value.length) setCondition(Object.assign({}, condition, { slug: value }))
          }}
        />

        <div className="items-end flex min-h-full">
          <Button onClick={getCategories} color="primary"><Search /></Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="border-default-200">
          <Table
            aria-label="Tất cả sản phẩm"
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
              <TableColumn key="name" textValue="name">Tên</TableColumn>
              <TableColumn key="slug" textValue="slug">Slug</TableColumn>
              <TableColumn key="highlight" textValue="highlight">Nổi bật</TableColumn>
              <TableColumn key="showOnHeader" textValue="showOnHeader">Hiện trên header</TableColumn>
              <TableColumn key="actions" textValue="actions"></TableColumn>
            </TableHeader>
            <TableBody
              items={categories}
              isLoading={loadingState === 'loading'}
              emptyContent={"Không có category nào"}
              loadingState={loadingState}
              loadingContent={<Spinner label="Loading..." />}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div>
          <Button color="primary" onClick={newCate}>Thêm category</Button>
        </div>
      </div>

      <SubCategory categories={categories} />

      <div>
        <Modal
          scrollBehavior="inside"
          size="lg"
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
                      onValueChange={(value) => setSelectedCate(Object.assign(
                        {},
                        selectedCate,
                        { name: value, slug: slugify(value, { locale: 'vi' }).toLowerCase() }))}
                      labelPlacement="outside" isRequired />
                    <Input
                      type="text"
                      label="Slug"
                      value={selectedCate.slug}
                      labelPlacement="outside" isRequired disabled />
                    <div className="grid grid-cols-2">
                      <Switch defaultSelected={selectedCate.highlight} onValueChange={(value) => setSelectedCate(Object.assign(
                        {},
                        selectedCate,
                        { highlight: value }))}>Nổi bật</Switch>
                      <Switch defaultSelected={selectedCate.showOnHeader}
                        onValueChange={(value) => setSelectedCate(Object.assign(
                          {},
                          selectedCate,
                          { showOnHeader: value }))}>Hiện trên header</Switch>
                    </div>
                    <div>
                      <Button color="primary" onClick={imageModal.onOpen}>Chọn hình</Button>
                    </div>
                    <div className="m-auto w-2/3">
                      {
                        selectedCate.imageId ?
                          <img
                            className="w-full h-full"
                            src={`${process.env.NEXT_PUBLIC_FILE_PATH + selectedCate?.image.path}`}
                          />
                          : <></>
                      }
                    </div>
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
      <Modal
        scrollBehavior="inside"
        size="5xl"
        isOpen={imageModal.isOpen} onOpenChange={imageModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chọn hình</ModalHeader>
              <ModalBody>
                <ImagePicker disableDelete onImageClick={image => {
                  setSelectedCate(Object.assign({}, selectedCate, { imageId: image.id, image: image }))
                  onClose()
                }} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ToastContainer />
    </div>
  );
};

const SubCategory = ({ categories }) => {
  const [subCategories, setSubCategories] = useState([])
  const [selectedSubCate, setSelectedSubCate] = useState({ type: "SUB_CATE" })
  const [condition, setCondition] = useState({})
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const imageModal = useDisclosure();

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0)
  const [loadingState, setLoadingState] = useState("loading")

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);

  useEffect(() => {
    getSubCate()
  }, [page, condition])

  const getSubCate = () => {
    setLoadingState('loading')
    let filteredCondition = { ...condition }
    Object.keys(filteredCondition).forEach(key => filteredCondition[key] === undefined && delete filteredCondition[key])
    const queryString = new URLSearchParams(filteredCondition).toString()
    fetch(`/api/categories/?size=${10}&page=${page}&${queryString}&type=SUB_CATE&includeImage=true`).then(async res => {
      const data = await res.json()
      setSubCategories(data.result)
      setTotal(data.total)
      setPage(1)
      setLoadingState("idle")
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (selectedSubCate.id) {
      toast.promise(
        fetch(`/api/categories/${selectedSubCate.id}`, { method: "PUT", body: JSON.stringify(selectedSubCate) }).then(async (res) => {
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
        fetch('/api/categories/', { method: "POST", body: JSON.stringify(Object.assign(selectedSubCate, { type: "SUB_CATE" })) }).then(async (res) => {
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
      fetch(`/api/categories/${id}`, { method: "DELETE" }).then(async (res) => {
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
      <div className="flex flex-col gap-2">
        <div className="flex gap-3 w-1/2">
          <Input label="Tên sub-category" aria-label="Tên sub-category" labelPlacement="outside" defaultValue={condition.name}
            isClearable
            onValueChange={(value) => {
              if (value.length > 2 || !value.length) setCondition(Object.assign({}, condition, { name: value }))
            }}
          />
          <Input label="Slug" aria-label="slug" labelPlacement="outside" defaultValue={condition.slug}
            isClearable
            onValueChange={(value) => {
              if (value.length > 2 || !value.length) setCondition(Object.assign({}, condition, { slug: value }))
            }}
          />
          <div className="items-end flex min-h-full">
            <Button onClick={getSubCate} color="primary"><Search /></Button>
          </div>
        </div>
        <div className="border-default-200">
          <Table
            aria-label="Tất cả sản phẩm"
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
              <TableColumn key="name" textValue="name">Tên</TableColumn>
              <TableColumn key="slug" textValue="slug">Slug</TableColumn>
              <TableColumn key="actions" textValue="actions"></TableColumn>
            </TableHeader>
            <TableBody
              items={subCategories}
              isLoading={loadingState === 'loading'}
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
        <div>
          <Button color="primary" onClick={newSubCate}>Thêm sub category</Button>
        </div>
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
                    <Select
                      label="Category"
                      labelPlacement="outside"
                      defaultSelectedKeys={new Set([selectedSubCate.cateId])}
                      onSelectionChange={(value) =>
                        setSelectedSubCate(Object.assign({}, selectedSubCate, { cateId: value.values().next().value }))}
                    >
                      {
                        categories.map((category) => (
                          <SelectItem key={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      }
                    </Select>
                    <div className='pt-2'>
                      <Button onClick={imageModal.onOpen} color="primary">Chọn ảnh</Button>
                    </div>
                    <div className="m-auto w-2/3">
                      {
                        selectedSubCate.imageId ?
                          <img
                            className="w-full h-full"
                            src={`${process.env.NEXT_PUBLIC_FILE_PATH + selectedSubCate?.image.path}`}
                          />
                          : <></>
                      }
                    </div>
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
                    setSelectedSubCate(Object.assign({}, selectedSubCate, { image: image, imageId: image.id }))
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
    </div>
  );
};

export default Category;

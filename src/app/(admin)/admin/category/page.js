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

const rowsPerPage = 15;

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
    fetch(`/api/categories/?size=${rowsPerPage}&page=${page}&${queryString}&includeImage=true`).then(async res => {
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
        fetch(`/api/categories/${selectedCate.id}`, {
          method: "PUT", body: JSON.stringify({
            highlight: selectedCate.highlight,
            showOnHeader: selectedCate.showOnHeader,
            name: selectedCate.name,
            slug: selectedCate.slug,
            imageId: selectedCate.imageId
          })
        }).then(async (res) => {
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
    const res = await fetch(`/api/categories/${category.id}`, { method: "PUT", body: JSON.stringify(value) })
    if (res.ok) {
      toast.success("Đã cập nhật")
    } else {
      toast.error("Không thể cập nhật")
    }
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
              <TableColumn key="type" textValue="type">Loại</TableColumn>
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

      <div>
        <Modal
          scrollBehavior="inside"
          size="2xl"
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
                      onValueChange={(value) => setSelectedCate(Object.assign(
                        {},
                        selectedCate,
                        { slug: slugify(value, { locale: 'vi' }).toLowerCase() }))}
                      labelPlacement="outside" isRequired />
                    <div className="grid grid-cols-3">
                      <Switch defaultSelected={selectedCate.highlight} onValueChange={(value) => setSelectedCate(Object.assign(
                        {},
                        selectedCate,
                        { highlight: value }))}>Nổi bật</Switch>
                      {/* <Switch defaultSelected={selectedCate.showOnHeader}
                        onValueChange={(value) => setSelectedCate(Object.assign(
                          {},
                          selectedCate,
                          { showOnHeader: value }))}>Hiện trên header</Switch> */}
                      <Input type="number" lable="Thứ tự trên header" value={selectedCate.headerOrder || 0}
                        onValueChange={(value) => setSelectedCate(Object.assign(
                          {},
                          selectedCate,
                          { headerOrder: parseInt(value) }))} />
                    </div>
                    <Select label="Loại"
                      defaultSelectedKeys={new Set([selectedCate.type || "CATE"])}
                      onSelectionChange={(value) =>
                        setSelectedCate(Object.assign({}, selectedCate, { type: value.values().next().value }))}>
                      <SelectItem key="CATE">
                        Category
                      </SelectItem>
                      <SelectItem key="SUB_CATE">
                        Sub category
                      </SelectItem>
                    </Select>
                    {
                      selectedCate.type === "SUB_CATE" ?
                        <Select
                          label="Category"
                          labelPlacement="outside"
                          defaultSelectedKeys={new Set([selectedCate.cateId])}
                          onSelectionChange={(value) =>
                            setSelectedCate(Object.assign({}, selectedCate, { cateId: value.values().next().value }))}
                        >
                          {
                            categories.map((category) => (
                              <SelectItem key={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          }
                        </Select> :

                        ""
                    }
                    <div>
                      <Button color="primary" onClick={imageModal.onOpen}>Chọn hình</Button>
                    </div>
                    <div className="m-auto w-2/3">
                      {
                        selectedCate.imageId ?
                          <img
                            className="w-full h-full"
                            src={`${process.env.NEXT_PUBLIC_FILE_PATH + selectedCate?.image?.path}`}
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
                      Đóng
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
                  Đóng
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
export default Category;

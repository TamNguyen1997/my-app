"use client"

import ImageCms from "@/app/components/admin/ui/ImageCms";
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

const quickUpdate = async (category, value, setCategory) => {
  const res = await fetch(`/api/categories/${category.id}`, { method: "PUT", body: JSON.stringify(value) })
  if (res.ok) {
    toast.success("Đã cập nhật")
    if (setCategory) {
      setCategory(await res.json())
    }
  } else {
    toast.error(`Không thể cập nhật: ${(await res.json()).message}`)
  }
}

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
            type: selectedCate.type,
            cateId: selectedCate.cateId,
            imageId: selectedCate.imageId,
            metaDescription: selectedCate.metaDescription,
            metaTitle: selectedCate.metaTitle,
            active: selectedCate.active
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
              return `Không thể cập nhật: ${data.message}`
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
              return `Không thể cập nhật: ${data.message}`
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
      case "highlight":
        return <div className="relative flex items-center">
          <CustomSwitch category={category} />
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
      <div className="flex gap-3 w-2/3">
        <Input label="Tên category" className="pt-2"
          aria-label="Tên category" labelPlacement="outside" defaultValue={condition.name}
          onValueChange={(value) => {
            if (value.length > 2 || !value.length) setCondition(Object.assign({}, condition, { name: value }))
          }}
        />
        <Input label="Slug" aria-label="slug" labelPlacement="outside" value={condition.slug} className="pt-2"
          onValueChange={(value) => {
            if (value.length > 2 || !value.length) setCondition(Object.assign({}, condition, { slug: value }))
          }}
        />
        <Select
          label="Loại"
          labelPlacement="outside"
          onSelectionChange={(value) =>
            setCondition(Object.assign({}, condition, { type: value.values().next().value }))}
        >
          <SelectItem key="CATE">
            CATE
          </SelectItem>
          <SelectItem key="SUB_CATE">
            SUB_CATE
          </SelectItem>
        </Select>

        <Switch className="pt-6  w-full"
          onValueChange={(value) => setCondition(Object.assign({}, condition, { active: value }))}>Active</Switch>
        <Switch className="pt-6 w-full"
          onValueChange={(value) => setCondition(Object.assign({}, condition, { highlight: value }))}>
          Nổi bật
        </Switch>
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
              <TableColumn key="type" textValue="type">Loại</TableColumn>
              <TableColumn key="highlight" textValue="highlight">Nổi bật</TableColumn>
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

      <Modal
        scrollBehavior="inside"
        size="5xl"
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
                  <Input
                    type="text"
                    label="Meta title"
                    value={selectedCate.metaTitle || ""}
                    onValueChange={(value) => setSelectedCate(Object.assign(
                      {},
                      selectedCate,
                      { metaTitle: value }))}
                    labelPlacement="outside"
                  />
                  <Input
                    type="text"
                    label="Meta description"
                    value={selectedCate.metaDescription || ""}
                    onValueChange={(value) => setSelectedCate(Object.assign(
                      {},
                      selectedCate,
                      { metaDescription: value }))}
                    labelPlacement="outside"
                  />
                  <div className="flex gap-5">

                    <Switch defaultSelected={selectedCate.highlight} onValueChange={(value) => setSelectedCate(Object.assign(
                      {},
                      selectedCate,
                      { highlight: value }))}>Nổi bật</Switch>
                    <Switch defaultSelected={selectedCate.active} onValueChange={(value) => setSelectedCate(Object.assign(
                      {},
                      selectedCate,
                      { active: value }))}>Active</Switch>
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
                  <Button color="primary" type="submit">
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

      <Modal
        scrollBehavior="inside"
        size="full"
        isOpen={imageModal.isOpen} onOpenChange={imageModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chọn hình</ModalHeader>
              <ModalBody>
                <ImageCms disableDelete onImageClick={image => {
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

const CustomSwitch = ({ category }) => {

  const [cate, setCate] = useState(category)
  return <Switch isSelected={cate.highlight} onValueChange={(value) => quickUpdate(cate, { highlight: value }, setCate)}></Switch>
}
export default Category;

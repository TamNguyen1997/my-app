"use client"

import ImageCms from "@/app/components/admin/ui/ImageCms";
import {
  Button, Input,
  Link,
  Modal, ModalBody,
  ModalContent, ModalFooter,
  ModalHeader, Select, SelectItem, Spinner,
  Switch,
  Table, TableBody,
  TableCell, TableColumn,
  TableHeader, TableRow,
  Tooltip,
  useDisclosure,
  Accordion, AccordionItem
} from "@nextui-org/react";
import { EditIcon, Search, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import slugify from "slugify"
import PaginationWithTotal from "@/app/components/PaginationWithTotal";

import { ToastContainer, toast } from 'react-toastify';
import { v4 } from "uuid";
import Image from "next/image";

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
  const [categoryId, setCategoryId] = useState(selectedCate.id)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [popularSearches, setPopularSearches] = useState([])
  const imageModal = useDisclosure()

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0)
  const [loadingState, setLoadingState] = useState("loading")

  const [allCategories, setAllCategories] = useState([])

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);

  const getCategories = (p = page) => {
    setLoadingState("loading")
    let filteredCondition = { ...condition }
    Object.keys(filteredCondition).forEach(key => filteredCondition[key] === undefined && delete filteredCondition[key])
    const queryString = new URLSearchParams(filteredCondition).toString()
    Promise.all([
      fetch("/api/popular-searches").then(res => res.json()).then(json => setPopularSearches(json.result)),
      fetch(`/api/categories/?size=${rowsPerPage}&page=${p}&${queryString}&includeImage=true&includeParentCategory=true`)
        .then(async res => {
          const data = await res.json()
          setCategories(data.result)
          setTotal(data.total)
        })
    ]).then(() => {
      setLoadingState("idle")
    })
    Promise.all([
      fetch("/api/popular-searches").then(res => res.json()).then(json => setPopularSearches(json.result)),
      fetch(`/api/categories/?size=${rowsPerPage}&page=${p}&${queryString}&includeImage=true&includeParentCategory=true`)
        .then(async res => {
          const data = await res.json()
          setCategories(data.result)
          setTotal(data.total)
        })
    ]).then(() => {
      setLoadingState("idle")
    })
  }
  useEffect(() => {
    fetch(`/api/categories/?size=10000&page=1&type=CATE`).then(async res => {
      const data = await res.json()
      setAllCategories(data.result)
    })
  }, [])
  useEffect(() => {
    getCategories()
  }, [page, rowsPerPage])

  useEffect(() => {
    setPage(1)
    getCategories(1)
  }, [condition])
  const onSubmit = (e) => {
    e.preventDefault()
    if (selectedCate.id) {
      toast.promise(
        fetch(`/api/categories/${selectedCate.id}`, {
          method: "PUT", body: JSON.stringify({
            id: categoryId || v4(),
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
        fetch('/api/categories/', { method: "POST", body: JSON.stringify(Object.assign(selectedCate, { id: categoryId || v4() })) }).then(async (res) => {
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
    setCategoryId(category.id)
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

  const addPopularSearch = (data) => {
    toast.promise(
      fetch(`/api/popular-searches/`, { method: "POST", body: JSON.stringify(data) }).then(async (res) => {
        getCategories()
        if (!res.ok) {
          throw new Error((await res.json()).message)
        }
      }),
      {
        pending: 'Đang thêm',
        success: 'Đã thêm vào Tìm kiếm phổ biến',
        error: {
          render({ data }) {
            return data.message
          }
        }
      }
    )
  }
  const deletePopularSearch = (id) => {
    toast.promise(
      fetch(`/api/popular-searches/${id}`, { method: "DELETE" }).then(async (res) => {
        getCategories()
        if (!res.ok) {
          throw new Error((await res.json()).message)
        }
      }),
      {
        pending: 'Đang xóa',
        success: 'Đã xóa Tìm kiếm phổ biến',
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
      case "active":
        return <div className="relative flex items-center">
          <CustomSwitch category={category} columnKey={columnKey} />
        </div>
      case "cate":
        return category[columnKey]?.name
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon onClick={() => openModal(category)} />
            </span>
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <Trash2 onClick={() => { deleteCate(category.id) }} />
              </span>
            </span>
            <span className="text-lg text-green-500 cursor-pointer active:opacity-50">
              <Tooltip content="Thêm vào Tìm kiếm phổ biến">
                <Search onClick={() => addPopularSearch({ categoryId: category.id, keyword: category.name })} />
              </Tooltip>
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
      <div className="w-1/2 shadow-md rounded-lg">
        <Accordion isCompact={true}>
          <AccordionItem key="1" aria-label="Tìm kiếm phổ biến" title="Tìm kiếm phổ biến">
            <div className="flex flex-wrap">
              {popularSearches.map((item, index) => (
                <div className="group" key={index}>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium 
                me-2 px-2.5 py-0.5 rounded-3xl dark:bg-gray-700 dark:text-gray-300 flex">
                    <Link href="#">
                      {item.category?.name}
                    </Link>
                    <span
                      className="hidden group-hover:block animate-vote text-red-500 rounded-full hover:bg-white"
                      onClick={() => deletePopularSearch(item.id)}><X /></span>
                  </span>
                </div>
              ))}
            </div>
          </AccordionItem>
        </Accordion>

      </div>
      <div className="flex gap-3">
        <Input label="ID/Tên category/Slug" className="pt-2"
          aria-label="ID/Tên category/Slug" labelPlacement="outside" defaultValue={condition.name}
          onValueChange={(value) => {
            if (value.length > 2 || !value.length) setCondition(Object.assign({}, condition, { id_name_slug: value }))
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
        <Select
          label="Tìm kiếm phổ biến"
          labelPlacement="outside"
          onSelectionChange={(value) =>
            setCondition(Object.assign({}, condition, { excludePopularSearch: value.values().next().value }))}
        >
          <SelectItem key="true">
            Tìm kiếm phổ biến
          </SelectItem>
          <SelectItem key="false">
            Không thuộc tìm kiếm phổ biến
          </SelectItem>
        </Select>
        <Select
          label="Tìm kiếm phổ biến"
          labelPlacement="outside"
          onSelectionChange={(value) =>
            setCondition(Object.assign({}, condition, { excludePopularSearch: value.values().next().value }))}
        >
          <SelectItem key="true">
            Tìm kiếm phổ biến
          </SelectItem>
          <SelectItem key="false">
            Không thuộc tìm kiếm phổ biến
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
            aria-label="Tất cả Category"
            bottomContent={
              loadingState === "loading" ? null :
                <div className="w-full flex">
                  <PaginationWithTotal
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    page={page}
                    setPage={setPage}
                    pages={pages}
                    total={total}
                  />
                </div>
            }>
            <TableHeader>
              <TableColumn key="name" textValue="name">Tên</TableColumn>
              <TableColumn key="slug" textValue="slug">Slug</TableColumn>
              <TableColumn key="type" textValue="type">Loại</TableColumn>
              <TableColumn key="cate" textValue="cate">Category</TableColumn>
              <TableColumn key="active" textValue="active">Active</TableColumn>
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
                    label="ID Category"
                    defaultValue={categoryId}
                    onValueChange={(value) => setCategoryId(value)}
                    labelPlacement="outside" />
                  <Input
                    type="text"
                    label="Category"
                    defaultValue={selectedCate.name}
                    onValueChange={(value) => setSelectedCate(Object.assign(
                      {},
                      selectedCate,
                      { name: value, slug: slugify(value, { locale: 'vi' }).replaceAll("(", "").replaceAll(")", "").toLowerCase() }))}
                    labelPlacement="outside" isRequired />
                  <Input
                    type="text"
                    label="Slug"
                    value={selectedCate.slug}
                    onValueChange={(value) => setSelectedCate(Object.assign(
                      {},
                      selectedCate,
                      { slug: slugify(value, { locale: 'vi' }).replaceAll("(", "").replaceAll(")", "").toLowerCase() }))}
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
                          allCategories.map((category) => (
                            <SelectItem key={category.id}>
                              {category.name}
                            </SelectItem>
                          ))
                        }
                      </Select> :
                      ""
                  }
                  <div>
                    <Button color="primary" onPress={imageModal.onOpen}>Chọn hình</Button>
                  </div>
                  <div className="m-auto w-2/3">
                    {
                      selectedCate.imageUrl &&
                      <Image
                        className="w-full h-full"
                        width={1280}
                        height={500}
                        alt={`${selectedCate?.imageUrl}`}
                        src={`${selectedCate?.imageUrl}`}
                      />
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
                  console.log(image)
                  setSelectedCate(Object.assign({}, selectedCate, { imageUrl: image.source_url }))
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

const CustomSwitch = ({ category, columnKey }) => {
  const [cate, setCate] = useState(category)
  if (columnKey === "highlight" && category.type === "SUB_CATE") {
    return ""
  }
  return <Switch defaultSelected={cate[columnKey]} onValueChange={(value) => quickUpdate(cate, { [columnKey]: value }, setCate)}></Switch>
}
export default Category;

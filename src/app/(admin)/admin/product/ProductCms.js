"use client"

import {
  Spinner,
  Table,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TableBody,
  Button,
  Switch,
  Input,
  Select,
  SelectItem,
  Link,
  Snippet,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { EditIcon, FileImage, Fingerprint, Plus, Search, Trash2 } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import DeleteConfirmation from "@/components/admin/ui/DeleteConfirmation"
import PaginationWithTotal from "@/components/PaginationWithTotal"

const quickUpdateProduct = async (product, value) => {
  await fetch(`/api/products/${product.id}`, {
    method: "PUT",
    body: JSON.stringify(value),
  })
}

const ProductCms = () => {
  const [loadingState, setLoadingState] = useState("loading")

  const [condition, setCondition] = useState({})
  const [total, setTotal] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedKeys, setSelectedKeys] = useState([])

  const [page, setPage] = useState(1)
  const [products, setProducts] = useState([])
  const [productIdToDelete, setProductIdToDelete] = useState()

  const deleteConfirmationDisclosure = useDisclosure()
  const deleteManyConfirmationDisclosure = useDisclosure()

  useEffect(() => {
    getProduct()
  }, [page, rowsPerPage])

  const getProduct = async () => {
    setLoadingState("loading")
    let filteredCondition = { ...condition }
    Object.keys(filteredCondition).forEach(
      (key) =>
        filteredCondition[key] === undefined && delete filteredCondition[key]
    )
    const queryString = new URLSearchParams(filteredCondition).toString()

    await fetch(
      `/api/products/?size=${rowsPerPage}&page=${page}&${queryString}`
    ).then(async (res) => {
      const data = await res.json()
      setProducts(data.result)
      setTotal(data.total)
      setLoadingState("idle")
    })
  }

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0
  }, [total, rowsPerPage])

  const deleteMany = async () => {
    const productsToDelete = selectedKeys === 'all' ? products.map(item => item.id) : [...selectedKeys]

    await Promise
      .all(productsToDelete.map(id => fetch(`/api/products/${id}`, { method: "DELETE" })))
      .then(response => {
        response.forEach(async res => {
          if (res.ok) {
            toast.success(`Đã xóa sản phẩm`)
          } else {
            const body = await res.json()
            toast.error(`${body.message}`)
          }
        })
      })

    setSelectedKeys([])
    deleteManyConfirmationDisclosure.onClose()
    getProduct()
  }

  const deleteProduct = async () => {
    if (!productIdToDelete) return
    const res = await fetch(`/api/products/${productIdToDelete}`, { method: "DELETE" })
    if (res.ok) {
      getProduct()
      deleteConfirmationDisclosure.onClose()
      toast.success("Đã xóa sản phẩm")
    } else {
      const body = await res.json()
      toast.error(body.message)
    }
    setProductIdToDelete()
  }

  const renderCell = useCallback((product, columnKey) => {
    const cellValue = product[columnKey]
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50 pt-2">
              <Link href={`/admin/product/edit/${product.id}`}>
                <EditIcon />
              </Link>
            </span>
            <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-2">
              <Trash2 onClick={() => {
                deleteConfirmationDisclosure.onOpen()
                setProductIdToDelete(product.id)
              }} />
            </span>
            <span className="text-lg cursor-pointer text-green-400">
              {product.imageId && <Tooltip showArrow content="Có thumbnail">
                <FileImage />
              </Tooltip>}
            </span>
          </div>
        )
      case "active":
        return (
          <div className="relative flex items-center gap-2">
            <Switch
              defaultSelected={product.active}
              onValueChange={(value) =>
                quickUpdateProduct(product, { active: value })
              }
            ></Switch>
          </div>
        )
      case "highlight":
        return (
          <div className="relative flex items-center gap-2">
            <Switch
              defaultSelected={product.highlight}
              onValueChange={(value) =>
                quickUpdateProduct(product, { highlight: value })
              }
            ></Switch>
          </div>
        )
      case "cate":
        return product.category?.name
      case "subcate":
        return product.subCate?.name
      case "id":
        return (<Snippet color="default" symbol="" className="!font-open_san !bg-white"><p className="!font-open_san">{cellValue}</p></Snippet>)
      default:
        return cellValue
    }
  }, [])

  const onConditionChange = (value) => {
    setCondition(Object.assign({}, condition, value))
  }

  return (
    <>
      <ToastContainer />
      <DeleteConfirmation disclosure={deleteConfirmationDisclosure} onDelete={deleteProduct} />
      <DeleteConfirmation disclosure={deleteManyConfirmationDisclosure} onDelete={deleteMany} />
      <div className="flex flex-col gap-2 border-r min-h-full p-2">
        <div className="flex gap-3 w-1/2">
          <Input
            label="ID/Tên"
            aria-label="ID/Tên"
            labelPlacement="outside"
            value={condition.id_name}
            onValueChange={(value) => {
              onConditionChange({ id_name: value })
              if (value.length > 2) getProduct()
            }}
          />

          <Select
            label="Nổi bật"
            labelPlacement="outside"
            onSelectionChange={(value) =>
              onConditionChange({ highlight: value.values().next().value })
            }
          >
            <SelectItem key="true">Nổi bật</SelectItem>
            <SelectItem key="false">Không nổi bật</SelectItem>
          </Select>
          <Select
            label="Active"
            labelPlacement="outside"
            onSelectionChange={(value) =>
              onConditionChange({ active: value.values().next().value })
            }
          >
            <SelectItem key="true">Active</SelectItem>
            <SelectItem key="false">Inactive</SelectItem>
          </Select>
          <Select
            label="Thumbnail"
            labelPlacement="outside"
            onSelectionChange={(value) =>
              onConditionChange({ thumbnail: value.values().next().value })
            }
          >
            <SelectItem key="true">Có thumbnail</SelectItem>
            <SelectItem key="false">Không có thumbnail</SelectItem>
          </Select>
          <div className="items-end flex min-h-full gap-2">
            <Button onClick={getProduct} color="primary">
              <Search />
            </Button>

            <Link href="/admin/product/edit/new" >
              <Button color="primary">
                <Plus />
              </Button>
            </Link>

            <Button color="danger" isDisabled={![...selectedKeys].length && selectedKeys !== 'all'} onClick={deleteManyConfirmationDisclosure.onOpen}>
              <Trash2 />
            </Button>
          </div>
        </div>
        <div className="px-1 py-2 border-default-200">
          <Table
            aria-label="Tất cả sản phẩm"
            loadingState={loadingState}
            selectionMode="multiple"
            onSelectionChange={setSelectedKeys}
            selectedKeys={selectedKeys}
            bottomContent={
              loadingState === "loading" ? null : (
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
              )
            }
          >
            <TableHeader>
              <TableColumn
                key="id"
                textValue="ID sản phẩm"
                aria-label="ID sản phẩm"
              >
                ID
              </TableColumn>
              <TableColumn
                key="name"
                textValue="Tên sản phẩm"
                aria-label="Tên sản phẩm"
              >
                Tên sản phẩm
              </TableColumn>
              <TableColumn key="slug" textValue="slug" aria-label="slug">
                Slug
              </TableColumn>
              <TableColumn
                key="productType"
                textValue="productType"
                aria-label="productType"
              >
                Loại
              </TableColumn>
              <TableColumn key="cate" textValue="cate" aria-label="cate">
                Category
              </TableColumn>
              <TableColumn
                key="subcate"
                textValue="subcate"
                aria-label="subcate"
              >
                Sub-category
              </TableColumn>
              <TableColumn
                key="highlight"
                textValue="highlight"
                aria-label="active"
              >
                Nổi bật
              </TableColumn>
              <TableColumn key="active" textValue="active" aria-label="active">
                Active
              </TableColumn>
              <TableColumn
                key="actions"
                textValue="actions"
                width="100"
              ></TableColumn>
            </TableHeader>
            <TableBody
              items={products}
              emptyContent={"Không có sản phẩm nào"}
              isLoading={loadingState === "loading"}
              loadingContent={<Spinner label="Loading..." />}
            >
              {(item) => (
                <TableRow key={item.id} data-selected="false">
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="pt-3">
          <Link href="/admin/product/edit/new" className="float-right">
            Thêm sản phẩm
          </Link>
        </div>
      </div>
    </>
  )
}

export default ProductCms

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
  Pagination,
  Input,
  Select,
  SelectItem,
  Link,
} from "@nextui-org/react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { EditIcon, Search, Trash2 } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"

const rowsPerPage = 10

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

  const [page, setPage] = useState(1)
  const [products, setProducts] = useState([])

  useEffect(() => {
    getProduct()
  }, [page])

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

  const deleteProduct = async (id) => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
    if (res.ok) {
      getProduct()
    } else {
      const body = await res.json()
      toast.error(body.message)
    }
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
            <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
              <Trash2 onClick={() => deleteProduct(product.id)} />
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
      <div className="flex flex-col gap-2 border-r min-h-full p-2">
        <div className="flex gap-3 w-1/2">
          <Input
            label="Slug"
            aria-label="slug"
            labelPlacement="outside"
            value={condition.slug}
            onValueChange={(value) => {
              onConditionChange({ slug: value })
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
          <div className="items-end flex min-h-full">
            <Button onClick={getProduct} color="primary">
              <Search />
            </Button>
          </div>
        </div>
        <div className="px-1 py-2 border-default-200">
          <Table
            aria-label="Tất cả sản phẩm"
            loadingState={loadingState}
            bottomContent={
              loadingState === "loading" ? null : (
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
              )
            }
          >
            <TableHeader>
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
                <TableRow key={item.id}>
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

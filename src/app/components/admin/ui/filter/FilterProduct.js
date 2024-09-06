"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Spinner, Table,
  TableCell, TableColumn,
  TableHeader, TableRow,
  TableBody, useDisclosure,
  Pagination,
  Input,
  Link,
  Switch,
  Select, SelectItem,
  Chip,
  Button
} from "@nextui-org/react"

import { toast, ToastContainer } from "react-toastify";

const rowsPerPage = 10;

const FilterProduct = ({ filterId, categories, brands, subCategories, filter }) => {

  const addProduct = useDisclosure()
  const [loadingState, setLoadingState] = useState("loading")

  const [total, setTotal] = useState(100)

  const [page, setPage] = useState(1)

  const [selectedKeys, setSelectedKeys] = useState(new Set([]));

  const [products, setProduct] = useState([...Array(5)].map((_, i) => ({
    id: i + 1,
    attrId: "M0102",
    attrViName: "Đen",
    slug: "den",
    attrEnName: "Black",
    brand: [],
    category: [],
    subcate: [],
    active: i % 2 == 0
  })))

  const tableHeaders = [
    {
      key: "attrId",
      title: "ID giá trị thuộc tính"
    },
    {
      key: "attrViName",
      title: "Tên giá trị thuộc tính tiếng Việt",
      required: true
    },
    {
      key: "slug",
      title: "Slug"
    },
    {
      key: "attrEnName",
      title: "Tên giá trị thuộc tính tiếng Anh"
    },
    {
      key: "brand",
      title: "ID thương hiệu",
      required: true
    },
    {
      key: "category",
      title: "ID cate",
      required: true
    },
    {
      key: "subcate",
      title: "ID sub-cate",
      required: true
    },
    {
      key: "active",
      title: "Trạng thái active"
    }
  ];

  useEffect(() => {
    getProduct()
  }, [page])

  const getProduct = useCallback(() => {
    // setLoadingState("loading")
    // fetch(`/api/filters/${filterId}/products?page=${page}&size=${rowsPerPage}`).then(res => res.json()).then(json => {
    //   setProduct(json.result)
    //   setTotal(json.total)
    setLoadingState("idle")
    // })
  }, [page])

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);

  const onSave = async () => {
    const ids = new Set([...products.map(product => product.id), ...selectedKeys])
    const res = await fetch(`/api/filters/${filterId}/products`, { method: "POST", body: JSON.stringify({ productIds: [...ids] }) })

    if (res.ok) {
      addProduct.onClose()
      toast.success("Đã thêm sản phẩm vào filter")
      getProduct()
    } else {
      toast.error("Không thể thêm sản phẩm vào filter")
    }
  }

  const onCellValueChange = (productId, value) => {
    if (!productId) return;
    setProduct(products.map(product => product.id === productId ? Object.assign(product, value) : product));
  }

  const renderCell = useCallback((product, columnKey) => {
    const cellValue = product[columnKey]
    const selectionList = {
      category: categories,
      subcate: subCategories,
      brand: brands
    }
    switch (columnKey) {
      case "active":
        return (
          <div className="flex justify-center">
            <Switch
              aria-label={columnKey}
              defaultSelected={cellValue}
              onValueChange={(value) => onCellValueChange(product?.id, { [columnKey]: value })}
              className="[&>span:last-of-type]:m-0"
            />
          </div>
        )
      case "category":
      case "subcate":
      case "brand":
        return (
          <Select
            aria-label={columnKey}
            selectionMode="multiple"
            labelPlacement="outside"
            value={cellValue}
            onSelectionChange={(value) => onCellValueChange(product?.id, { [columnKey]: Array.from(value) })}
            classNames={{
              base: "min-w-[120px]",
              innerWrapper: "pr-6 !w-full",
              trigger: "h-auto gap-2 py-2",
              value: "whitespace-normal"
            }}
            renderValue={(items) => {
              return (
                <div className="flex flex-wrap gap-2">
                  {
                    items?.map(item => <Chip key={item.key}>{item.textValue}</Chip>)
                  }
                </div>
              );
            }}
          >
            {
              selectionList[columnKey].map((item) =>
                <SelectItem key={item.id}>
                  {item.name}
                </SelectItem>
              )
            }
          </Select>
        )
      default:
        // return cellValue
        return (
          <Input
            aria-label={columnKey}
            defaultValue={cellValue}
            onValueChange={(value) => onCellValueChange(product?.id, { [columnKey]: value })}
            className="min-w-[100px]"
          />
        );
    }
  }, [])

  return (
    <>
      <ToastContainer containerId={"FilterProduct"} />
      <div className="flex flex-col gap-2 min-h-full">

        <div className="px-1 py-2 border-default-200">
          <Table
            loadingState={loadingState}
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
              {
                tableHeaders.map(col =>
                  <TableColumn
                    key={col.key}
                    text-value={col.title}
                    aria-label={col.title}
                    className={`
                      max-w-[150px] whitespace-normal text-center last:w-[100px]
                      ${col.required && "after:content-['*'] after:text-[#f31260]"}
                    `}
                  >
                    {col.title}
                  </TableColumn>
                )
              }
            </TableHeader>
            <TableBody
              items={products}
              isLoading={loadingState === "loading"}
              emptyContent={"Không có sản phẩm nào"}
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
          <div className="flex gap-5">
            <Link href="/admin/filter">Quay về</Link>
            <Link href="/admin/filter/edit/new">Thêm filter</Link>
            <Button color="primary" className="ml-auto" onClick={() => console.log({ filter, products })}>Lưu</Button>
            <Button color="default" variant="ghost" className="">Xoá</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterProduct
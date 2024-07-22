"use client"

import {
  Spinner, Table,
  TableCell, TableColumn,
  TableHeader, TableRow,
  TableBody, useDisclosure,
  Modal, ModalHeader,
  ModalBody, ModalFooter,
  Button, ModalContent,
  Switch,
  Pagination,
  Card, CardBody, Tab, Tabs,
  Input,
  Select,
  SelectItem
} from "@nextui-org/react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { EditIcon, Search, Trash2 } from "lucide-react"
import { redirect } from "next/navigation";
import SaleDetails from "@/app/components/admin/ui/product/SaleDetails";
import TechnicalDetails from "@/app/components/admin/ui/product/TechnicalDetails";
import ProductDetail from "@/app/components/admin/ui/product/ProductDetail";
import ComponentPartDetails from "@/app/components/admin/ui/product/ComponentPartDetails";
import ProductImage from "@/app/components/admin/ui/product/ProductImage";
import ProductDescription from "@/app/components/admin/ui/product/ProductDescription";

const rowsPerPage = 10;

const updateProductActive = async (product, active) => {
  product.active = active
  await fetch(`/api/products/${product.id}`, { method: "PUT", body: JSON.stringify(product) })
}

const updateProductHighlight = async (product, active) => {
  product.highlight = active
  await fetch(`/api/products/${product.id}`, { method: "PUT", body: JSON.stringify(product) })
}

const ProductCms = () => {
  const [loadingState, setLoadingState] = useState("loading")
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedProduct, setSelectedProduct] = useState({})
  const [condition, setCondition] = useState({})

  const [reload, setReload] = useState(false)
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [brands, setBrands] = useState([])

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);

  const [technicalRows, setTechnicalRows] = useState([])
  const [technicalColumns, setTechnicalColumns] = useState([])

  const [saleDetails, setSaleDetails] = useState([])

  useEffect(() => {
    getProduct()
  }, [page])

  const getProduct = async () => {
    setLoadingState("loading")
    let filteredCondition = { ...condition }
    Object.keys(filteredCondition).forEach(key => filteredCondition[key] === undefined && delete filteredCondition[key])
    const queryString = new URLSearchParams(filteredCondition).toString()

    await fetch(`/api/products/?size=${rowsPerPage}&page=${page}&${queryString}&productType=PRODUCT`).then(async (res) => {
      const data = await res.json()
      setProducts(data.result)
      setTotal(data.total)
      setLoadingState("idle")
    })
  }

  useEffect(() => {
    fetch('/api/categories?type=CATE').then(res => res.json()).then(json => setCategories(json.result))
    fetch('/api/brands').then(res => res.json()).then(setBrands)
    fetch('/api/categories?type=SUB_CATE').then(res => res.json()).then(json => setSubCategories(json.result))
  }, [])

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);

  const deleteProduct = (id) => {
    fetch(`/api/products/${id}`, { method: "DELETE" }).then(() => setReload(true))
  }

  const openModal = async (product) => {
    Promise.all([
      fetch(`/api/products/${product.id}`).then(res => res.json()).then((json) => {
        setSelectedProduct(json)
      }),
      fetch(`/api/products/${product.id}/technical-details`).then(res => res.json()).then(technical => {
        setTechnicalColumns(technical ? JSON.parse(technical.column) : [])
        setTechnicalRows(technical ? JSON.parse(technical.row) : [])
      }),
      fetch(`/api/products/${product.id}/sale-details`).then(res => res.json()).then(setSaleDetails),
    ]).then(() => onOpen())
  }

  const newProduct = () => {
    setSelectedProduct({})
    onOpen()
  }

  const renderCell = useCallback((product, columnKey) => {
    const cellValue = product[columnKey]
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon onClick={() => openModal(product)} />
            </span>
            <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
              <Trash2 onClick={() => deleteProduct(product.id)} />
            </span>
          </div>
        )
      case "active":
        return (
          <div className="relative flex items-center gap-2">
            <Switch defaultSelected={product.active} onValueChange={(value) => updateProductActive(product, value)}></Switch>
          </div>
        )
      case "highlight":
        return (
          <div className="relative flex items-center gap-2">
            <Switch defaultSelected={product.highlight} onValueChange={(value) => updateProductHighlight(product, value)}></Switch>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  if (reload) {
    redirect("/admin/product")
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    delete productToUpdate.image
    delete productToUpdate.subCategory
    delete productToUpdate.brand
    delete productToUpdate.category

    if (productToUpdate.id) {
      await fetch(`/api/products/${productToUpdate.id}`, {
        method: "PUT",
        body: JSON.stringify(productToUpdate)
      })
    } else {
      productToUpdate = await fetch(`/api/products/`, {
        method: "POST",
        body: JSON.stringify(productToUpdate)
      }).then(res => res.json())
    }
    if (saleDetails.length) {
      let saleDetailToUpdate = [...saleDetails]
      let secondarySaleDetails = []
      saleDetailToUpdate.forEach(detail => {
        if (secondarySaleDetails) {
          secondarySaleDetails.push(...detail.secondarySaleDetails)
        }
        delete detail.secondarySaleDetails
      })

      await fetch(`/api/products/${productToUpdate.id}/sale-details`, {
        method: "POST",
        body: JSON.stringify({ saleDetails: saleDetailToUpdate, secondarySaleDetails: secondarySaleDetails })
      })
    }

    await fetch(`/api/products/${productToUpdate.id}/technical-details`, {
      method: "POST",
      body: JSON.stringify({
        row: JSON.stringify(technicalRows),
        column: JSON.stringify(technicalColumns),
        productId: productToUpdate.id
      })
    })
    setReload(true)
  }

  const onConditionChange = (value) => {
    setCondition(Object.assign({}, condition, value))
  }

  return (
    <>
      <div className="flex flex-col gap-2 border-r min-h-full p-2">
        <div className="flex gap-3 w-1/2">
          <Input label="Tên sản phẩm" aria-label="Tên sản phẩm" labelPlacement="outside" value={condition.name}
            onValueChange={(value) => {
              onConditionChange({ name: value })
              if (value.length > 2) getProduct()
            }}
          />
          <Input label="Slug" aria-label="slug" labelPlacement="outside" value={condition.slug}
            onValueChange={(value) => {
              onConditionChange({ slug: value })
              if (value.length > 2) getProduct()
            }}
          />

          <Select
            label="Nổi bật"
            labelPlacement="outside"
            onSelectionChange={(value) => onConditionChange({ highlight: value.values().next().value })}>
            <SelectItem key="true">
              Nổi bật
            </SelectItem>
            <SelectItem key="false">
              Không nổi bật
            </SelectItem>
          </Select>
          <Select
            label="Active"
            labelPlacement="outside"
            onSelectionChange={(value) => onConditionChange({ active: value.values().next().value })}>
            <SelectItem key="true">
              Active
            </SelectItem>
            <SelectItem key="false">
              Inactive
            </SelectItem>
          </Select>
          <div className="items-end flex min-h-full">
            <Button onClick={getProduct} color="primary"><Search /></Button>
          </div>
        </div>
        <div className="px-1 py-2 border-default-200">
          <Table
            aria-label="Tất cả sản phẩm"
            loadingState={loadingState}
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
              <TableColumn key="name" textValue="Tên sản phẩm" aria-label="Tên sản phẩm">Tên sản phẩm</TableColumn>
              <TableColumn key="slug" textValue="slug" aria-label="slug">Slug</TableColumn>
              <TableColumn key="highlight" textValue="highlight" aria-label="active">Nổi bật</TableColumn>
              <TableColumn key="active" textValue="active" aria-label="active">Active</TableColumn>
              <TableColumn key="actions" textValue="actions" width="100"></TableColumn>
            </TableHeader>
            <TableBody
              items={products}
              emptyContent={"Không có sản phẩm nào"}
              isLoading={loadingState === "loading"}
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
        <Button color="primary" onClick={newProduct}>Thêm sản phẩm</Button>
      </div>

      <Modal
        size="5xl" scrollBehavior="inside"
        isOpen={isOpen} onOpenChange={onOpenChange}>
        <form onSubmit={onSubmit}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Chi tiết sản phẩm</ModalHeader>
                <ModalBody>
                  <Tabs disabledKeys={selectedProduct.id ? [] : ["description", "image", "technical", "component", "sale"]}>
                    <Tab title="Thông tin chung">
                      <Card>
                        <CardBody>
                          <ProductDetail
                            categories={categories}
                            product={selectedProduct}
                            setProduct={setSelectedProduct}
                            brands={brands}
                            subCategories={subCategories}
                          />
                        </CardBody>
                      </Card>
                    </Tab>
                    <Tab title="Mô tả" key="description">
                      <Card>
                        <CardBody>
                          <ProductDescription product={selectedProduct} />
                        </CardBody>
                      </Card>
                    </Tab>
                    <Tab title="Hình ảnh" key="image">
                      <Card>
                        <CardBody>
                          <ProductImage product={selectedProduct} />
                        </CardBody>
                      </Card>
                    </Tab>
                    <Tab title="Phụ kiện" key="component">
                      <Card>
                        <CardBody>
                          <ComponentPartDetails productId={selectedProduct.id} categories={categories} subCategories={subCategories} />
                        </CardBody>
                      </Card>
                    </Tab>
                    <Tab title="Thông số kĩ thuật" key="technical">
                      <Card>
                        <CardBody>
                          <TechnicalDetails product={selectedProduct} />
                        </CardBody>
                      </Card>
                    </Tab>
                    <Tab title="Thông số bán hàng" key="sale">
                      <Card>
                        <CardBody>
                          <SaleDetails saleDetails={saleDetails} setSaleDetails={setSaleDetails} productId={selectedProduct.id} />
                        </CardBody>
                      </Card>
                    </Tab>
                  </Tabs>
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
    </>
  )
}

export default ProductCms

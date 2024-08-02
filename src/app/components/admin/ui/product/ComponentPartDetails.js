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
import { useEditor } from "@tiptap/react";
import SaleDetails from "@/app/components/admin/ui/product/SaleDetails";
import TechnicalDetails from "@/app/components/admin/ui/product/TechnicalDetails";
import ProductDetail from "@/app/components/admin/ui/product/ProductDetail";
import ProductImage from "@/app/components/admin/ui/product/ProductImage";
import ProductDescription from "@/app/components/admin/ui/product/ProductDescription";
import { editorConfig } from "@/lib/editor"

const rowsPerPage = 10;

const updateProductActive = async (product, active) => {
  product.active = active
  await fetch(`/api/products/${product.id}`, { method: "PUT", body: JSON.stringify(product) })
}

const updateProductHighlight = async (product, active) => {
  product.highlight = active
  await fetch(`/api/products/${product.id}`, { method: "PUT", body: JSON.stringify(product) })
}

const ComponentPartDetails = ({ productId, categories, subCategories }) => {
  const [loadingState, setLoadingState] = useState("loading")
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedProduct, setSelectedProduct] = useState({})
  const [condition, setCondition] = useState({})

  const [reload, setReload] = useState(false)
  const [total, setTotal] = useState(0)
  const [brands, setBrands] = useState([])

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);

  const [technicalRows, setTechnicalRows] = useState([])
  const [technicalColumns, setTechnicalColumns] = useState([])

  const [saleDetails, setSaleDetails] = useState([])

  const editor = useEditor(editorConfig(selectedProduct.description))

  useEffect(() => {
    getProduct()
  }, [page, productId])

  const getProduct = async () => {
    setLoadingState("loading")
    let filteredCondition = { ...condition }
    Object.keys(filteredCondition).forEach(key => filteredCondition[key] === undefined && delete filteredCondition[key])
    const queryString = new URLSearchParams(filteredCondition).toString()

    await fetch(`/api/products/?size=${rowsPerPage}&page=${page}&${queryString}&productType=COMPONENT_PART&productId=${productId}&includeCate=true`)
      .then(async (res) => {
        const data = await res.json()
        setProducts(data.result)
        setTotal(data.total)
        setLoadingState("idle")
      })
  }

  useEffect(() => {
    fetch('/api/brands').then(res => res.json()).then(setBrands)
  }, [])

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);

  const deleteProduct = (id) => {
    fetch(`/api/products/${id}`, { method: "DELETE" }).then(() => setReload(true))
  }

  const openModal = async (product, editor) => {
    Promise.all([
      fetch(`/api/products/${product.id}`).then(res => res.json()).then((json) => {
        setSelectedProduct(json)
        editor.commands.setContent(json.description)
      }),
      fetch(`/api/products/${product.id}/technical-details`).then(res => res.json()).then(technical => {
        setTechnicalColumns(technical ? JSON.parse(technical.column) : [])
        setTechnicalRows(technical ? JSON.parse(technical.row) : [])
      }),
      fetch(`/api/products/${product.id}/sale-details`).then(res => res.json()).then(setSaleDetails),
    ]).then(() => onOpen())
  }

  const newComponentPart = () => {
    setSelectedProduct({ productId: productId, productType: "COMPONENT_PART" })
    editor.commands.setContent()
    onOpen()
  }

  const renderCell = useCallback((product, columnKey, editor) => {
    const cellValue = product[columnKey]
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon onClick={() => openModal(product, editor)} />
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

    let productToUpdate = Object.assign({}, selectedProduct, { description: editor.getHTML() })

    delete productToUpdate.image
    delete productToUpdate.subCategory
    delete productToUpdate.brand
    delete productToUpdate.category

    productToUpdate.description = editor.getHTML()
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
        <div className="flex gap-3 w-2/3">
          <Input label="Tên phụ kiện" aria-label="Tên phụ kiện" labelPlacement="outside" value={condition.name}
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
            aria-label="Tất cả phụ kiện"
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
              <TableColumn key="name" textValue="Tên phụ kiện" aria-label="Tên phụ kiện">Tên phụ kiện</TableColumn>
              <TableColumn key="slug" textValue="slug" aria-label="slug">Slug</TableColumn>
              <TableColumn key="highlight" textValue="highlight" aria-label="active">Nổi bật</TableColumn>
              <TableColumn key="active" textValue="active" aria-label="active">Active</TableColumn>
              <TableColumn key="actions" textValue="actions" width="100"></TableColumn>
            </TableHeader>
            <TableBody
              items={products}
              emptyContent={"Không có phụ kiện nào"}
              isLoading={loadingState === "loading"}
              loadingContent={<Spinner label="Loading..." />}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey, editor)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="p-3">
        <Button color="primary" onClick={newComponentPart}>Thêm phụ kiện</Button>
      </div>

      <Modal
        size="5xl" scrollBehavior="inside"
        isOpen={isOpen} onOpenChange={onOpenChange}>
        <form onSubmit={onSubmit}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Chi tiết phụ kiện</ModalHeader>
                <ModalBody>
                  <Tabs>
                    <Tab title="Thông tin chung">
                      <Card>
                        <CardBody>
                          <ProductDetail
                            categories={categories}
                            product={selectedProduct}
                            setProduct={setSelectedProduct}
                            brands={brands}
                            editor={editor}
                            subCategories={subCategories}
                          />
                        </CardBody>
                      </Card>
                    </Tab>
                    <Tab title="Mô tả">
                      <Card>
                        <CardBody>
                          <ProductDescription
                            editor={editor}
                          />
                        </CardBody>
                      </Card>
                    </Tab>
                    <Tab title="Hình ảnh">
                      <Card>
                        <CardBody>
                          <ProductImage product={selectedProduct} />
                        </CardBody>
                      </Card>
                    </Tab>
                    <Tab title="Thông số kĩ thuật">
                      <Card>
                        <CardBody>
                          <TechnicalDetails product={selectedProduct} />
                        </CardBody>
                      </Card>
                    </Tab>
                    <Tab title="Thông số bán hàng">
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
                    Đóng
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

export default ComponentPartDetails

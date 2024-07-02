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
  Textarea,
  Select,
  SelectItem
} from "@nextui-org/react"
import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { EditIcon, Trash2 } from "lucide-react"
import TechnicalDetailForm from "@/components/admin/ui/TechnicalDetailForm";
import SaleDetailForm from "@/components/admin/ui/SaleDetailForm";
import { redirect } from "next/navigation";
import ImagePicker from "@/components/admin/ui/ImagePicker";
import Image from "next/image";
import slugify from "slugify"

export const ProductContext = createContext()

const rowsPerPage = 10;

const updateProductActive = async (product, active) => {
  product.active = active
  await fetch(`/api/products/${product.id}`, { method: "PUT", body: JSON.stringify(product) })
}

const ProductCms = () => {
  const [loadingState, setLoadingState] = useState("loading")
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedProduct, setSelectedProduct] = useState({})
  const [technicalDetailRows, setTechnicalDetailRows] = useState([])
  const [technicalDetailColumns, setTechnicalDetailColumns] = useState([])
  const value = [selectedProduct, setSelectedProduct, technicalDetailColumns, setTechnicalDetailColumns, technicalDetailRows, setTechnicalDetailRows]
  const [reload, setReload] = useState(false)
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState([])

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`/api/products/?size=${10}&page=${page}`).then(async (res) => {
      let data = await res.json()
      setProducts(data.result)
      setTotal(data.total)
      setLoadingState("idle")
    })
    fetch('/api/categories').then(res => res.json()).then(json => setCategories(json))
  }, [page])

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);

  const deleteProduct = (id) => {
    fetch(`/api/products/${id}`, { method: "DELETE" }).then(() => setReload(true))
  }

  const openModal = async (product) => {
    let res = await fetch(`/api/products/${product.id}`)
    setSelectedProduct(await res.json())
    onOpen()
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
      default:
        return cellValue
    }
  }, [])

  if (reload) {
    redirect("/admin/product")
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    let productToUpdate = selectedProduct
    // const technicalDetails = technicalDetails
    // const saleDetails = productToUpdate.saleDetails
    // delete productToUpdate.saleDetails

    if (productToUpdate.id) {
      await fetch(`/api/products/${productToUpdate.id}`, {
        method: "PUT",
        body: JSON.stringify(productToUpdate)
      })
    } else {
      await fetch(`/api/products/`, {
        method: "POST",
        body: JSON.stringify(productToUpdate)
      })
    }
    // if (saleDetails.length) {
    //   await fetch(`/api/products/${productToUpdate.id}/sale-details`, {
    //     method: "POST",
    //     body: JSON.stringify(saleDetails)
    //   })
    // }
    // if (technicalDetails.length) {
    //   await fetch(`/api/products/${productToUpdate.id}/technical-details`, {
    //     method: "POST",
    //     body: JSON.stringify(technicalDetails)
    //   })
    // }
    setReload(true)
  }

  return (
    <>
      <div className="flex flex-col gap-2 border-r min-h-full p-2">
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
            }
          >
            <TableHeader>
              <TableColumn key="name" textValue="Tên sản phẩm" aria-label="Tên sản phẩm">Tên sản phẩm</TableColumn>
              <TableColumn key="slug" textValue="slug" aria-label="slug">Slug</TableColumn>
              <TableColumn key="active" textValue="active" aria-label="active"></TableColumn>
              <TableColumn key="actions" textValue="actions" width="100"></TableColumn>
            </TableHeader>
            <TableBody
              items={products}
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
      </div>
      <div className="p-3">
        <Button color="primary" onClick={newProduct}>Thêm sản phẩm</Button>
      </div>

      <ProductContext.Provider value={value}>
        <Modal
          size="5xl" scrollBehavior="inside"
          isOpen={isOpen} onOpenChange={onOpenChange}>
          <form onSubmit={onSubmit}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Chi tiết sản phẩm</ModalHeader>
                  <ModalBody>
                    <Tabs>
                      <Tab title="Thông tin chung">
                        <Card>
                          <CardBody>
                            <ProductDetailForm categories={categories} product={selectedProduct} setProduct={setSelectedProduct} />
                          </CardBody>
                        </Card>
                      </Tab>
                      <Tab title="Thông số kĩ thuật">
                        <Card>
                          <CardBody>
                            <TechnicalDetailForm />
                          </CardBody>
                        </Card>
                      </Tab>
                      <Tab title="Thông số bán hàng">
                        <Card>
                          <CardBody>
                            <SaleDetailForm />
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
      </ProductContext.Provider>
    </>
  )
}

const ProductDetailForm = ({ categories, product, setProduct }) => {
  const [selectedImage, setSelectedImage] = useState(null)

  const [selectedCategory, setSelectedCategory] = useState(new Set([""]))

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const selectImage = (value) => {
    setProduct(Object.assign({}, product, { imageId: value.id }))
    setSelectedImage(value)
    onOpenChange()
  }

  const selectCategory = (value) => {
    setSelectedCategory(value)
    setProduct(Object.assign({}, product, { categoryId: value.values().next().value }))
  }

  useEffect(() => {
    fetch(`/api/category-to-product?productId=${product.id}`).then(res => res.json()).then(json => {
      if (json.length) {
        setSelectedCategory(new Set(json.map(item => item.categoryId)))
      }
    })
  }, [])

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Input
            type="text"
            label="Tên sản phẩm"
            labelPlacement="outside"
            aria-label="Tên sản phẩm"
            defaultValue={product.name}
            isRequired
            onValueChange={(value) => setProduct(Object.assign({}, product, { name: value, slug: slugify(value, { locale: "vi" }) }))}
          />
          <Input
            type="text"
            label="Slug"
            labelPlacement="outside"
            aria-label="Slug"
            value={product.slug}
            isRequired
            disabled
          />
        </div>
        <Select
          label="Phân loại"
          aria-label="Phân loại"
          selectedKeys={selectedCategory}
          onSelectionChange={selectCategory}
          isRequired
        >
          {categories.map(category => <SelectItem key={category.id}>{category.name}</SelectItem>)}
        </Select>
        <div className='grid grid-cols-2 gap-3'>
          <div className="flex flex-col gap-3">
            <Input type="text"
              aria-label="Hình ảnh"
              label="Hình ảnh"
              value={selectedImage?.name} isDisabled />
            <Input type="text"
              aria-label="Alt"
              label="Alt"
              onValueChange={(value) => setProduct(Object.assign({}, product, { imageAlt: value }))}
              defaultValue={product?.imageAlt} />
            <div>
              <Button color="primary" onClick={onOpen} className="w-24 float-right">Chọn ảnh</Button>
            </div>
          </div>

          <div>
            {
              selectedImage ?
                <Image
                  src={`${selectedImage?.path}`}
                  alt={`${product.imageAlt}`}
                  width="300"
                  height="300"
                  className="float-right"
                /> : null
            }
          </div>
          <Textarea
            labelPlacement="outside"
            placeholder="Mô tả sản phẩm"
            value={product.description ? product.description : ""}
            onValueChange={(value) => setProduct(Object.assign({}, product, { description: value }))}
          />
        </div>
      </div>

      <Modal
        size="5xl" scrollBehavior="inside"
        isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chọn hình ảnh</ModalHeader>
              <ModalBody>
                <ImagePicker disableAdd={true} onImageClick={selectImage} disableDelete={true}></ImagePicker>
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
    </>
  )
}

export default ProductCms

"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Spinner, Table,
  TableCell, TableColumn,
  TableHeader, TableRow,
  TableBody, useDisclosure,
  Modal, ModalHeader,
  ModalBody,
  Button, ModalContent,
  Pagination,
  Card, CardBody, Tab, Tabs,
  Input,
} from "@nextui-org/react"
import { EditIcon, Search } from "lucide-react"
import SaleDetails from "@/app/components/admin/ui/product/SaleDetails";
import TechnicalDetails from "@/app/components/admin/ui/product/TechnicalDetails";
import ProductDetail from "@/app/components/admin/ui/product/ProductDetail";
import ComponentPartDetails from "@/app/components/admin/ui/product/ComponentPartDetails";
import ProductImage from "@/app/components/admin/ui/product/ProductImage";
import ProductDescription from "@/app/components/admin/ui/product/ProductDescription";

const rowsPerPage = 10;

const AvailableProduct = ({ filterId, categories, brands, subCategories, selectedKeys, setSelectedKeys }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedProduct, setSelectedProduct] = useState({})
  const [condition, setCondition] = useState({})
  const [loadingState, setLoadingState] = useState("loading")

  const [total, setTotal] = useState(0)

  const [page, setPage] = useState(1)

  const [products, setProduct] = useState([])

  useEffect(() => {
    getProduct()
  }, [page])

  const getProduct = useCallback(() => {
    setLoadingState("loading")
    console.log(page)
    fetch(`/api/filters/${filterId}/available-products?page=${page}&size=${rowsPerPage}`).then(res => res.json()).then(json => {
      setProduct(json.result)
      setTotal(json.total)
      setLoadingState("idle")
    })
  }, [page])

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);

  const openModal = async (product) => {
    setSelectedProduct(product)
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
          </div>
        )
      case "category":
        return product.category?.name
      case "subcate":
        return product.subCate?.name
      case "brand":
        return product.brand?.name
      default:
        return cellValue
    }
  }, [])

  const onConditionChange = (value) => {
    setCondition(Object.assign({}, condition, value))
  }

  return (
    <>
      <div className="flex flex-col gap-2 min-h-full">
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
          <div className="items-end flex min-h-full">
            <Button onClick={getProduct} color="primary"><Search /></Button>
          </div>
        </div>
        <div className="px-1 py-2 border-default-200">
          <Table
            loadingState={loadingState}
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={(value) => {
              if (value === 'all') {
                setSelectedKeys(new Set([...products.map(item => item.id)]))
              } else {
                setSelectedKeys(value)
              }
            }}
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
              <TableColumn key="name" textValue="Tên sản phẩm" aria-label="Tên sản phẩm">Tên sản phẩm</TableColumn>
              <TableColumn key="slug" textValue="slug" aria-label="slug">Slug</TableColumn>
              <TableColumn key="category" textValue="category" aria-label="slug">Category</TableColumn>
              <TableColumn key="subcate" textValue="subcate" aria-label="slug">Sub category</TableColumn>
              <TableColumn key="brand" textValue="brand" aria-label="slug">Nhãn hiệu</TableColumn>
              <TableColumn key="actions" textValue="actions" width="100"></TableColumn>
            </TableHeader>
            <TableBody
              isLoading={loadingState === "loading"}
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

      <Modal
        size="5xl" scrollBehavior="inside"
        isOpen={isOpen} onOpenChange={onOpenChange}>
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
                        <SaleDetails product={selectedProduct} />
                      </CardBody>
                    </Card>
                  </Tab>
                </Tabs>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default AvailableProduct
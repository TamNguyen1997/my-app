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
  Pagination
} from "@nextui-org/react"
import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { EditIcon, Trash2 } from "lucide-react"
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import TechnicalDetailForm from "@/components/admin/ui/TechnicalDetailForm";
import ProductDetailForm from "@/components/admin/ui/ProductDetailForm";
import SaleDetailForm from "@/components/admin/ui/SaleDetailForm";
import { redirect } from "next/navigation";

export const ProductContext = createContext()

const ProductCms = () => {
  const [loadingState, setLoadingState] = useState("loading")
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedProduct, setSelectedProduct] = useState({})
  const value = [selectedProduct, setSelectedProduct]
  const [reload, setReload] = useState(false)
  const [total, setTotal] = useState(0)

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`/api/products/?size=${10}&page=${page}`).then(async (res) => {
      let data = await res.json()
      setProducts(data.result)
      setTotal(data.total)
      setLoadingState("idle")
    })
  }, [page])

  const rowsPerPage = 10;

  const pages = useMemo(() => {
    return total ? Math.ceil(total / rowsPerPage) : 0;
  }, [total, rowsPerPage]);

  const openModal = async (product) => {
    let res = await fetch(`/api/products/${product.id}`)
    setSelectedProduct(await res.json())
    onOpen()
  }

  const newProduct = () => {
    setSelectedProduct({})
    onOpen()
  }

  const updateProductActive = async (product, active) => {
    product.active = active
    await fetch(`/api/products/${product.id}`, { method: "PUT", body: JSON.stringify(product) })
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
              <Trash2 />
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
    const technicalDetails = productToUpdate.technicalDetails
    const saleDetails = productToUpdate.saleDetails
    delete productToUpdate.technicalDetails
    delete productToUpdate.saleDetails

    await fetch(`/api/products/${productToUpdate.id}`, {
      method: "PUT",
      body: JSON.stringify(productToUpdate)
    })
    if (saleDetails.length) {
      await fetch(`/api/products/${productToUpdate.id}/sale-details`, {
        method: "POST",
        body: JSON.stringify(saleDetails)
      })
    }
    if (technicalDetails.length) {
      await fetch(`/api/products/${productToUpdate.id}/technical-details`, {
        method: "POST",
        body: JSON.stringify(technicalDetails)
      })
    }
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
              <TableColumn key="id" textValue="Mã sản phẩm" aria-label="Mã sản phẩm">Mã sản phẩm</TableColumn>
              <TableColumn key="name" textValue="Tên sản phẩm" aria-label="Tên sản phẩm">Tên sản phẩm</TableColumn>
              <TableColumn key="categoryId" textValue="Category" aria-label="Category">Category</TableColumn>
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
                            <ProductDetailForm></ProductDetailForm>
                          </CardBody>
                        </Card>
                      </Tab>
                      <Tab title="Thông số kĩ thuật">
                        <Card>
                          <CardBody>
                            <TechnicalDetailForm></TechnicalDetailForm>
                          </CardBody>
                        </Card>
                      </Tab>
                      <Tab title="Thông số bán hàng">
                        <Card>
                          <CardBody>
                            <SaleDetailForm></SaleDetailForm>
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

export default ProductCms

import { useAsyncList } from "@react-stately/data"
import {
  Spinner, Table,
  TableCell, TableColumn,
  TableHeader, TableRow,
  TableBody, useDisclosure,
  Modal, ModalHeader,
  ModalBody, ModalFooter,
  Button, ModalContent
} from "@nextui-org/react"
import { createContext, useCallback, useState } from "react"
import { EditIcon, Trash2 } from "lucide-react"
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import TechnicalDetailForm from "@/components/admin/ui/TechnicalDetailForm";
import ProductDetailForm from "@/components/admin/ui/ProductDetailForm";
import SaleDetailForm from "@/components/admin/ui/SaleDetailForm";

export const ProductContext = createContext()

const ProductCms = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedProduct, setSelectedProduct] = useState({})
  const value = [selectedProduct, setSelectedProduct]

  let list = useAsyncList({
    async load() {
      let res = await fetch('/api/products/')
      let json = await res.json()
      setIsLoading(false)

      return {
        items: json,
      }
    }
  })

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
              <Trash2 />
            </span>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  const onSubmit = async () => {
    let productToUpdate = selectedProduct
    const technicalDetails = productToUpdate.technicalDetails
    const saleDetails = productToUpdate.saleDetails
    delete productToUpdate.technicalDetails
    delete productToUpdate.saleDetails

    fetch(`/api/products/${productToUpdate.id}`, {
      method: "PUT",
      body: JSON.stringify(productToUpdate)
    }).then(() => {
      fetch(`/api/products/${productToUpdate.id}/sale-details`, {
        method: "POST",
        body: JSON.stringify(saleDetails)
      })
      fetch(`/api/products/${productToUpdate.id}/technical-details`, {
        method: "POST",
        body: JSON.stringify(technicalDetails)
      })
    })
  }

  return (
    <>
      <div className="flex flex-col gap-2 border-r min-h-full p-2">
        <div className="px-1 py-2 border-default-200">
          <Table
            aria-label="Tất cả sản phẩm">
            <TableHeader>
              <TableColumn key="id" textValue="Mã sản phẩm">Mã sản phẩm</TableColumn>
              <TableColumn key="name" textValue="Tên sản phẩm">Tên sản phẩm</TableColumn>
              <TableColumn key="categoryId" textValue="Category">Category</TableColumn>
              <TableColumn key="actions" textValue="actions" width="100"></TableColumn>
            </TableHeader>
            <TableBody
              items={list.items}
              isLoading={isLoading}
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

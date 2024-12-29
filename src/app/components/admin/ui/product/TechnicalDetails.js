import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner, useDisclosure } from "@nextui-org/react"
import { Trash2 } from "lucide-react"
import { useContext, useState } from "react"
import { v4 } from "uuid"
import NewFilter from "./NewFilter"
import { FilterValueSelect } from "./NewFilterValue"
import { ProductContext } from "@/app/(admin)/admin/product/edit/[id]/page"

const TechnicalDetails = () => {
  let { product, filters, setFilters, setProduct } = useContext(ProductContext)
  const [technicalDetails, setTechnicalDetails] = useState(product.technical_detail || [])

  const addDetail = () => {
    const detail = {
      id: v4(),
      productId: product.id
    }
    const newTechnicalDetails = [...technicalDetails, detail]
    setTechnicalDetails(newTechnicalDetails)
    setProduct({ ...product, technical_detail: newTechnicalDetails })
  }

  const onSelectionChange = (value, technicalId) => {
    let updateDetails = [...technicalDetails]
    updateDetails.forEach(detail => {
      if (detail.id === technicalId) {
        detail = Object.assign(detail, value)
      }
    })
    setTechnicalDetails([...updateDetails])
    setProduct({ ...product, technical_detail: [...updateDetails] })
  }

  const deleteDetail = (id) => {
    setTechnicalDetails(technicalDetails.filter(item => item.id !== id))
    setProduct({ ...product, technical_detail: technicalDetails })
  }

  const newFilterModal = useDisclosure()

  return (
    <>
      <div>
        <Button color="default" variant="ghost" size="sm" className="float-right" onPress={addDetail}> Thêm thông số </Button>
      </div>
      {
        (!product.categoryId || !product.brandId || !product.subCateId) &&
        <p className="text-red-600 text-small">Sản phẩm phải có category, sub-category và thương hiệu mới có thể có giá trị filter</p>
      }
      <div>
        {
          technicalDetails.map((item, i) => <div className="flex gap-2 pt-3" key={i}>
            <Input
              label="Filter ID"
              value={item.filterId}
              readOnly
            />
            <Select label="Filter"
              selectedKeys={[item.filterId]}
              onSelectionChange={(value) => {
                if (value.values().next().value !== "new") {
                  onSelectionChange({ filterId: value.values().next().value }, item.id)
                }
              }}
            >
              <SelectItem textValue="Thêm filter" key="new" onClick={() => {
                newFilterModal.onOpen()
              }}>
                <div className="font-bold w-full flex justify-between">
                  Thêm filter
                </div>
              </SelectItem>

              {
                filters.map(item => <SelectItem key={item.id}>{item.name}</SelectItem>)
              }
            </Select>
            <Modal
              scrollBehavior="inside"
              size="xl"
              isOpen={newFilterModal.isOpen} onOpenChange={newFilterModal.onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">Filter mới</ModalHeader>
                    <ModalBody>
                      <NewFilter filters={filters}
                        setFilters={setFilters}
                        callback={(value) => {
                          onSelectionChange({ filterId: value }, item.id)
                          onClose()
                        }} />
                      <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                          Đóng
                        </Button>
                      </ModalFooter>
                    </ModalBody>
                  </>
                )}
              </ModalContent>
            </Modal>
            <FilterValueSelect
              detail={item} getFilter={() =>
                filters.find(filter => filter.id === technicalDetails.find(detail => detail.id === item.id).filterId)
              }
              brandId={product.brandId}
              categoryId={product.categoryId}
              subCategoryId={product.subCateId}
              setFilters={setFilters}
              filters={filters}
              onSelectionChange={onSelectionChange} />
            <div className="relative flex items-center pt-5">
              <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
                <Trash2 onClick={() => deleteDetail(item.id)} />
              </span>
            </div>
          </div>
          )
        }
      </div>
    </>
  )
}

export default TechnicalDetails
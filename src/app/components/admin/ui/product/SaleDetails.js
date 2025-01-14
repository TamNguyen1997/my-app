import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@nextui-org/react"
import { Trash2 } from "lucide-react"
import { useContext } from "react"
import { v4 } from "uuid"
import NewFilter from "@/components/admin/ui/product/NewFilter"
import { FilterValueSelect } from "./NewFilterValue"
import { ProductContext } from "../../../../(admin)/admin/product/edit/[id]/page"

const removeItem = (id, product, setProduct) => {
  setProduct({ ...product, saleDetails: product.saleDetails.filter(item => item.id !== id) })
}

const handleDetailChange = (id, value, product, setProduct) => {
  const newDetails = product.saleDetails.map(detail =>
    detail.id === id ? { ...detail, ...value } : detail
  );
  setProduct({ ...product, saleDetails: newDetails })
}

const SecondarySaleDetails = ({ saleDetail }) => {
  const newFilterModal = useDisclosure()
  const { product, filters, setFilters, setProduct } = useContext(ProductContext)

  return (
    <>
      <div className="flex flex-col gap-2">
        {
          product.saleDetails?.filter(item => item.saleDetailId === saleDetail.id).map(detail => {
            return <div className="flex" key={detail.id}>
              <div className="w-11/12">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    label="SKU"
                    defaultValue={detail.sku}
                    aria-label="SKU"
                    isRequired
                    onValueChange={value => {
                      handleDetailChange(detail.id, { sku: value }, product, setProduct)
                    }}
                  />
                  <Select label="Filter"
                    isRequired
                    selectedKeys={[detail.filterId]}
                    onSelectionChange={(value) => {
                      if (value.values().next().value !== "new") {
                        handleDetailChange(detail.id, { filterId: value.values().next().value }, product, setProduct)
                      }
                    }}>
                    <SelectItem textValue="Thêm filter" key="new" onClick={() => {
                      newFilterModal.onOpen()
                    }}>
                      <div className="font-bold w-full flex justify-between">
                        Thêm filter
                      </div>
                    </SelectItem>
                    {
                      filters?.map(item => <SelectItem key={item.id}>{item.name}</SelectItem>)
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
                                handleDetailChange(detail.id, { filterId: value }, product, setProduct)
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
                    detail={detail} getFilter={() =>
                      filters.find(filter => filter.id === product.saleDetails?.find(sale => detail.id === sale.id).filterId)
                    }
                    filters={filters}
                    brandId={product.brandId}
                    categoryId={product.categoryId}
                    subCategoryId={product.subCateId}
                    onSelectionChange={(value, detailId) => handleDetailChange(detailId, { filterValueId: value.filterValueId }, product, setProduct)} />
                  <Input type="number"
                    label="Giá"
                    defaultValue={detail.price}
                    aria-label="Giá"
                    min={0}
                    max={999999999}
                    isRequired
                    onValueChange={(value) => handleDetailChange(detail.id, { price: parseInt(value) }, product, setProduct)}
                  />
                  <Input type="number"
                    label="Giá giảm"
                    defaultValue={detail.promotionalPrice}
                    aria-label="Giá"
                    min={0}
                    max={999999999}
                    onValueChange={(value) => handleDetailChange(detail.id, { promotionalPrice: parseInt(value) }, product, setProduct)}
                  />
                  <Input type="number"
                    label="Tồn kho"
                    defaultValue={detail.inStock}
                    aria-label="Giá"
                    min={0}
                    max={999999999}
                    onValueChange={(value) => handleDetailChange(detail.id, { inStock: parseInt(value) }, product, setProduct)}
                  />
                  <Checkbox className="w-full"
                    isSelected={detail.showPrice}
                    onValueChange={value => handleDetailChange(detail.id, { showPrice: value }, product, setProduct)}>
                    Hiện giá
                  </Checkbox>
                </div>
              </div>

              <div className="pt-3 pl-3">
                <div className="text-lg text-danger cursor-pointer active:opacity-50 pl-5 float-right">
                  <Trash2 onClick={() => removeItem(detail.id, product, setProduct)} />
                </div>
              </div>
            </div>
          })
        }
      </div>
    </>
  )

}

const SaleDetails = () => {
  const { product, filters, setFilters, setProduct } = useContext(ProductContext)

  const newFilterModal = useDisclosure()

  const addEmptySaleDetail = () => {
    const newSaleDetails = [...product.saleDetails, { id: v4(), productId: product.id, type: "TEXT" }]
    setProduct({ ...product, saleDetails: newSaleDetails })
  }

  return (
    <>
      {(!product.categoryId || !product.subCateId || !product.brandId) && <div>
        <ul className="list-disc text-red-400 list-inside">
          <li>
            Sản phẩm phải có category và subcategory mới có thể thêm mới giá trị filter
          </li>
          <li>
            Sản phẩm phải có thương hiệu mới có thể thêm mới giá trị filter
          </li>
        </ul>
      </div>}
      <div className="p-2">
        <Button color="default" variant="ghost" size="sm" className="float-right" onPress={addEmptySaleDetail}>Thêm thông số</Button>
      </div>
      <div className="flex flex-col gap-2 p-2">
        {
          product.saleDetails?.filter(item => !item.saleDetailId).map(detail => {
            return <div key={detail.id}>
              <div className="flex" >
                <div className="w-full">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      label="SKU"
                      defaultValue={detail.sku}
                      aria-label="SKU"
                      isRequired
                      onValueChange={value => handleDetailChange(detail.id, { sku: value }, product, setProduct)}
                    />
                    <Select label="Filter"
                      selectedKeys={[detail.filterId]}
                      isRequired
                      onSelectionChange={(value) => {
                        if (value.values().next().value !== "new") {
                          handleDetailChange(detail.id, { filterId: value.values().next().value }, product, setProduct)
                        }
                      }
                      }>
                      <SelectItem textValue="Thêm filter" key="new" onClick={() => {
                        newFilterModal.onOpen()
                      }}>
                        <div className="font-bold w-full flex justify-between">
                          Thêm filter
                        </div>
                      </SelectItem>
                      {
                        filters?.map(item => <SelectItem key={item.id}>{item.name}</SelectItem>)
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
                                  handleDetailChange(detail.id, { filterId: value }, product, setProduct)
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
                      detail={detail} getFilter={() =>
                        filters.find(filter => filter.id === product.saleDetails.find(sale => detail.id === sale.id).filterId)
                      }
                      brandId={product.brandId}
                      categoryId={product.categoryId}
                      subCategoryId={product.subCateId}
                      product={product}
                      setProduct={setProduct}
                      onSelectionChange={(value, detailId) => handleDetailChange(detailId, { filterValueId: value.filterValueId }, product, setProduct)}
                      filters={filters}
                      setFilters={setFilters}
                      details={product.saleDetails} />
                    <Input type="number"
                      isRequired
                      label="Giá"
                      defaultValue={detail.price}
                      aria-label="Giá"
                      min={0}
                      max={999999999}
                      onValueChange={(value) => handleDetailChange(detail.id, { price: parseInt(value) }, product, setProduct)}
                    />
                    <Input type="number"
                      label="Giá giảm"
                      defaultValue={detail.promotionalPrice}
                      aria-label="Giá"
                      min={0}
                      max={999999999}
                      onValueChange={(value) => handleDetailChange(detail.id, { promotionalPrice: parseInt(value) }, product, setProduct)}
                    />
                    <Input type="number"
                      label="Tồn kho"
                      defaultValue={detail.inStock}
                      aria-label="Giá"
                      min={0}
                      max={999999999}
                      onValueChange={(value) => handleDetailChange(detail.id, { inStock: parseInt(value) }, product, setProduct)}
                    />
                    <Checkbox isSelected={detail.showPrice}
                      className="w-full"
                      onValueChange={value => handleDetailChange(detail.id, { showPrice: value }, product, setProduct)}>
                      Hiện giá
                    </Checkbox>
                    <div className="flex text-center items-center">
                      <Button onClick={() => {
                        const newSaleDetails = [...product.saleDetails, { id: v4(), type: "TEXT", saleDetailId: detail.id, productId: product.id }]
                        setProduct({ ...product, saleDetails: newSaleDetails })
                      }}>
                        Thêm
                      </Button>
                      <div className="text-lg text-danger cursor-pointer active:opacity-50 pl-5 float-right">
                        <Trash2 onClick={() => removeItem(detail.id, product, setProduct)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-1">
                <SecondarySaleDetails saleDetail={detail} />
              </div>
            </div>
          })
        }
      </div>
    </>
  )
}

export default SaleDetails
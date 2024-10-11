import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner, useDisclosure } from "@nextui-org/react"
import { Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { v4 } from "uuid"
import NewFilter from "@/components/admin/ui/product/NewFilter"
import NewFilterValue from "@/components/admin/ui/product/NewFilterValue"

const removeItem = (id, details) => {
  return details.filter(item => item.id != id).filter(item => item.saleDetailId !== id)
}

const handleDetailChange = (saleDetails, id, value) => {
  let updateDetails = saleDetails
  updateDetails.forEach(detail => {
    if (detail.id === id) {
      detail = Object.assign(detail, value)
    }
  })
  return [...updateDetails]
}

const SecondarySaleDetails = ({ saleDetails, setSaleDetails, saleDetail, filters, setFilters, product }) => {
  const newFilterModal = useDisclosure()

  return (
    <>
      <div className="flex flex-col gap-2">
        {
          saleDetails.filter(item => item.saleDetailId === saleDetail.id).map(detail => {
            return <div className="flex" key={detail.id}>
              <div className="w-11/12">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    label="SKU"
                    defaultValue={detail.sku}
                    aria-label="SKU"
                    isRequired
                    onValueChange={value => setSaleDetails(handleDetailChange(saleDetails, detail.id, { sku: value }))}
                  />
                  <Select label="Filter"
                    isRequired
                    selectedKeys={[detail.filterId]}
                    onSelectionChange={(value) => {
                      if (value.values().next().value !== "new") {
                        setSaleDetails(handleDetailChange(saleDetails, detail.id, { filterId: value.values().next().value }))
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
                                setSaleDetails(handleDetailChange(saleDetails, detail.id, { filterId: value }))
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
                      filters.find(filter => filter.id === saleDetails.find(sale => detail.id === sale.id).filterId)
                    }
                    brandId={product.brandId}
                    categoryId={product.categoryId}
                    subCategoryId={product.subCateId}
                    setDetail={setSaleDetails}
                    onSelectionChange={handleDetailChange} details={saleDetails} />

                  <Input type="number"
                    label="Giá"
                    defaultValue={detail.price}
                    aria-label="Giá"
                    min={0}
                    max={999999999}
                    isRequired
                    onValueChange={(value) => setSaleDetails(handleDetailChange(saleDetails, detail.id, { price: parseInt(value) }))}
                  />
                  <Input type="number"
                    label="Giá giảm"
                    defaultValue={detail.promotionalPrice}
                    aria-label="Giá"
                    min={0}
                    max={999999999}
                    onValueChange={(value) => setSaleDetails(handleDetailChange(saleDetails, detail.id, { promotionalPrice: parseInt(value) }))}
                  />
                  <Input type="number"
                    label="Tồn kho"
                    defaultValue={detail.inStock}
                    aria-label="Giá"
                    min={0}
                    max={999999999}
                    onValueChange={(value) => setSaleDetails(handleDetailChange(saleDetails, detail.id, { inStock: parseInt(value) }))}
                  />
                  <Checkbox className="w-full"
                    isSelected={detail.showPrice}
                    onValueChange={value => setSaleDetails(handleDetailChange(saleDetails, detail.id, { showPrice: value }))}>
                    Hiện giá
                  </Checkbox>
                </div>
              </div>

              <div className="pt-3 pl-3">
                <div className="text-lg text-danger cursor-pointer active:opacity-50 pl-5 float-right">
                  <Trash2 onClick={() => setSaleDetails(removeItem(detail.id, saleDetails))} />
                </div>
              </div>
            </div>
          })
        }
      </div>
    </>
  )

}

const SaleDetails = ({ product }) => {
  const [saleDetails, setSaleDetails] = useState([])
  const [filters, setFilters] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetch(`/api/products/${product.id}/sale-details`).then(res => res.json()).then(setSaleDetails),
    fetch(`/api/filters/?active=true&availableOnly=true&categoryIds=${product.categoryId}&categoryIds=${product.subCateId}
      &brandId=${product.brandId}&activeValue=true`)
      .then(res => res.json())
      .then(json => setFilters(json.result))
    ]).then(() => setIsLoading(false))
  }, [product])

  const newFilterModal = useDisclosure()

  const addEmptySaleDetail = () => {
    setSaleDetails([...saleDetails, { id: v4(), productId: product.id, type: "TEXT" }])
  }

  const onSave = async () => {
    const res = await fetch(`/api/products/${product.id}/sale-details`, {
      method: "POST",
      body: JSON.stringify({ saleDetails: saleDetails })
    })

    if (res.ok) {
      toast.success("Đã lưu thông số bán hàng")
    } else {
      toast.error("Không thể lưu thông số bán hàng")
    }
  }

  if (isLoading) return <Spinner className="w-full h-full m-auto p-12" />
  return (
    <>
      <ToastContainer />
      <div className="p-2">
        <Button color="default" variant="ghost" size="sm" className="float-right" onPress={addEmptySaleDetail}>Thêm thông số</Button>
      </div>
      <div className="flex flex-col gap-2 p-2">
        {
          saleDetails.filter(item => !item.saleDetailId).map(detail => {
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
                      onValueChange={value => setSaleDetails(handleDetailChange(saleDetails, detail.id, { sku: value }))}
                    />
                    <Select label="Filter"
                      selectedKeys={[detail.filterId]}
                      isRequired
                      onSelectionChange={(value) => {
                        if (value.values().next().value !== "new") {
                          setSaleDetails(handleDetailChange(saleDetails, detail.id, { filterId: value.values().next().value }))
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
                                  setSaleDetails(handleDetailChange(saleDetails, detail.id, { filterId: value }))
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
                        filters.find(filter => filter.id === saleDetails.find(sale => detail.id === sale.id).filterId)
                      }
                      brandId={product.brandId}
                      categoryId={product.categoryId}
                      subCategoryId={product.subCateId}
                      setDetail={setSaleDetails}
                      onSelectionChange={handleDetailChange}
                      details={saleDetails} />
                    <Input type="number"
                      isRequired
                      label="Giá"
                      defaultValue={detail.price}
                      aria-label="Giá"
                      min={0}
                      max={999999999}
                      onValueChange={(value) => setSaleDetails(handleDetailChange(saleDetails, detail.id, { price: parseInt(value) }))}
                    />
                    <Input type="number"
                      label="Giá giảm"
                      defaultValue={detail.promotionalPrice}
                      aria-label="Giá"
                      min={0}
                      max={999999999}
                      onValueChange={(value) => setSaleDetails(handleDetailChange(saleDetails, detail.id, { promotionalPrice: parseInt(value) }))}
                    />
                    <Input type="number"
                      label="Tồn kho"
                      defaultValue={detail.inStock}
                      aria-label="Giá"
                      min={0}
                      max={999999999}
                      onValueChange={(value) => setSaleDetails(handleDetailChange(saleDetails, detail.id, { inStock: parseInt(value) }))}
                    />
                    <Checkbox isSelected={detail.showPrice}
                      className="w-full"
                      onValueChange={value => setSaleDetails(handleDetailChange(saleDetails, detail.id, { showPrice: value }))}>
                      Hiện giá
                    </Checkbox>
                    <div className="flex text-center items-center">
                      <Button onClick={() => {
                        setSaleDetails([...saleDetails, { id: v4(), type: "TEXT", saleDetailId: detail.id, productId: product.id }])
                      }}>
                        Thêm
                      </Button>
                      <div className="text-lg text-danger cursor-pointer active:opacity-50 pl-5 float-right">
                        <Trash2 onClick={() => setSaleDetails(removeItem(detail.id, saleDetails))} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-1">
                <SecondarySaleDetails
                  product={product}
                  saleDetail={detail}
                  saleDetails={saleDetails}
                  setSaleDetails={setSaleDetails}
                  filters={filters}
                  setFilters={setFilters}
                />
              </div>
            </div>
          })
        }
        <div className="pl-3 pt-1">
          <Button color="primary" onClick={onSave} className="w-24 float-right">Lưu</Button>
        </div>
      </div>
    </>
  )
}

const FilterValueSelect = ({ detail, getFilter, setDetail, onSelectionChange, details, categoryId, subCategoryId, brandId }) => {
  const newFilterValueModal = useDisclosure()

  const [filterValues, setFilterValues] = useState(getFilter()?.filterValue || [])

  return (
    <>
      <Select label="Giá trị filter"
        selectedKeys={[detail.filterValueId]}
        isRequired
        isDisabled={!getFilter() || !getFilter().id}
        onSelectionChange={value => {
          if (value.values().next().value !== "new") {
            setDetail(onSelectionChange(details, detail.id, { filterValueId: value.values().next().value }, detail.id))
          }
        }
        }>
        <SelectItem
          textValue="Thêm mới"
          key="new" onClick={() => {
            newFilterValueModal.onOpen()
          }}>
          <div className="font-bold w-full flex justify-between">
            Thêm
          </div>
        </SelectItem>

        {
          filterValues.map(item => <SelectItem key={item.id}>{item.value}</SelectItem>)
        }
      </Select>
      <Modal
        scrollBehavior="inside"
        size="xl"
        isOpen={newFilterValueModal.isOpen} onOpenChange={newFilterValueModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Filter mới</ModalHeader>
              <ModalBody>
                <NewFilterValue
                  filterId={getFilter().id}
                  filterValues={filterValues}
                  setFilterValues={setFilterValues}
                  categoryId={categoryId}
                  subCategoryId={subCategoryId}
                  brandId={brandId}
                  callback={(value) => {
                    setDetail(onSelectionChange(details, detail.id, { filterValueId: value }, detail.id))
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
    </>
  )
}

export default SaleDetails
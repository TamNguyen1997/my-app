import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner, useDisclosure } from "@nextui-org/react"
import { Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { v4 } from "uuid"
import NewFilter from "./NewFilter"
import NewFilterValue from "./NewFilterValue"

const TechnicalDetails = ({ product }) => {
  const [technicalDetails, setTechnicalDetails] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [filters, setFilters] = useState([])

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${product.id}/technical-details`).then(res => res.json()).then(setTechnicalDetails),
      fetch(`/api/filters/`).then(res => res.json()).then(json => setFilters(json.result))])
      .then(() => setIsLoading(false))
  }, [product])

  const addDetail = () => {
    const detail = {
      id: v4(),
      productId: product.id
    }
    setTechnicalDetails([...technicalDetails, detail])
  }
  const onSave = async () => {
    const res = await fetch(`/api/products/${product.id}/technical-details`, {
      method: "POST",
      body: JSON.stringify({
        details: technicalDetails
      })
    })

    if (res.ok) {
      toast.success("Đã lưu thông số kĩ thuật")
    } else {
      toast.error("Không thể lưu thông số kĩ thuật")
    }
  }

  const onSelectionChange = (value, technicalId) => {
    let updateDetails = [...technicalDetails]
    updateDetails.forEach(detail => {
      if (detail.id === technicalId) {
        detail = Object.assign(detail, value)
      }
    })
    setTechnicalDetails([...updateDetails])
  }

  const deleteDetail = (id) => {
    setTechnicalDetails(technicalDetails.filter(item => item.id !== id))
  }

  const newFilterModal = useDisclosure()

  if (isLoading) return <Spinner className="w-full h-full m-auto p-12" />

  return (
    <>
      <ToastContainer />
      <div>
        <Button color="default" variant="ghost" size="sm" className="float-right" onPress={addDetail}> Thêm thông số </Button>
      </div>
      <div>
        {
          technicalDetails.map((item, i) => <div className="flex gap-2" key={i}>
            <Input
              labelPlacement="outside"
              label="Filter ID"
              value={item.filterId}
              readOnly
            />
            <Select labelPlacement="outside" label="Filter"
              defaultSelectedKeys={[item.filterId]}
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
              technicalDetail={item} getFilter={() =>
                filters.find(filter => filter.id === technicalDetails.find(detail => detail.id === item.id).filterId)
              }
              brandId={product.brandId}
              categoryId={product.categoryId}
              subCategoryId={product.subCateId}
              onSelectionChange={onSelectionChange} />
            <div className="relative flex items-center pt-5">
              <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
                <Trash2 onClick={() => deleteDetail(item.id)} />
              </span>
            </div>
          </div>
          )
        }
        <div className="pt-3">
          <Button color="primary" onClick={onSave} className="w-24 float-right">Lưu</Button>
        </div>
      </div>
    </>
  )
}

const FilterValueSelect = ({
  technicalDetail,
  getFilter,
  onSelectionChange,
  categoryId,
  subCategoryId,
  brandId
}) => {
  const newFilterValueModal = useDisclosure()
  const [filterValues, setFilterValues] = useState(getFilter()?.filterValue || [])

  return (
    <>
      <Input
        labelPlacement="outside"
        label="Giá trị filter ID"
        value={technicalDetail.filterValueId}
        readOnly
      />
      <Select labelPlacement="outside" label="Giá trị filter"
        isDisabled={!getFilter() || !getFilter().id}
        selectedKeys={[technicalDetail.filterValueId]}
        onSelectionChange={value => {
          if (value.values().next().value !== "new") {
            onSelectionChange({ filterValueId: value.values().next().value }, technicalDetail.id)
          }
        }}
      >
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
                    onSelectionChange({ filterValueId: value }, technicalDetail.id)
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

export default TechnicalDetails
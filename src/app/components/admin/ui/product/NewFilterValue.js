import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Switch, useDisclosure } from "@nextui-org/react"
import { useForm } from "react-hook-form"
import { v4 } from "uuid"

const NewFilterValue = ({ filterId, filters, setFilters, categoryId, subCategoryId, brandId, callback }) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSave = async (data) => {
    const res = await fetch(`/api/filters/${filterId}/filter-values`, {
      method: "POST", body: JSON.stringify({
        ...data,
        categories: [categoryId],
        brands: [brandId],
        subCategories: [subCategoryId]
      })
    })
    if (res.ok) {
      if (setFilters) {
        let newFilters = filters
        newFilters.forEach(item => {
          if (item.id === filterId) {
            item.filterValue = [data, ...(item.filterValue || [])]
          }
        })
        setFilters(newFilters)
        callback(data.id)
      }
    } else {
      console.log(res.status)
    }
  }

  return <>
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSave)}>
      <div className="flex flex-col space-y-4 border rounded-2xl shadow-sm max-w-[444px] p-3 pb-5 gap-3">
        <div>
          <Input
            type="text"
            label="ID thuộc tính"
            labelPlacement="outside"
            isRequired
            className="[&_label]:grow"
            {...register("id", { value: v4(), required: true })}
          />
          {errors.id && <span className="text-red-600 text-small">Bạn phải điền ID</span>}
        </div>

        <div>
          <Input
            type="text"
            label="Tên tiếng việt"
            labelPlacement="outside"
            isRequired
            className="[&_label]:grow"
            {...register("value", { required: true })}
          />
          {errors.value && <span className="text-red-600 text-small">Bạn phải điền tên</span>}
        </div>

        <div>
          <Input
            type="text"
            label="Slug"
            labelPlacement="outside"
            isRequired
            className="[&_label]:grow"
            {...register("slug", { required: true })}
          />
          {errors.slug && <span className="text-red-600 text-small">Bạn phải slug</span>}
        </div>
        <Switch
          className="max-w-full flex-row-reverse [&>span]:text-sm [&>span:last-of-type]:grow mr-[160px]"
          {...register("active", { value: true })}
        >
          Trạng thái active
        </Switch>
      </div>
      <Button type="submit" color="primary" className="w-10">Lưu</Button>
    </form>
  </>
}

const FilterValueSelect = ({
  detail,
  getFilter,
  filters,
  setFilters,
  onSelectionChange,
  categoryId,
  subCategoryId,
  brandId,
  product,
  setProduct
}) => {
  const newFilterValueModal = useDisclosure()
  return (
    <>
      <Input
        label="Giá trị filter ID"
        value={detail.filterValueId}
        isDisabled={!getFilter() || !getFilter().id || !categoryId || !brandId || !subCategoryId}
        readOnly
      />
      <Select label="Giá trị filter"
        isDisabled={!getFilter() || !getFilter().id || !categoryId || !brandId || !subCategoryId}
        selectedKeys={[detail.filterValueId]}
        onSelectionChange={value => {
          if (value.values().next().value !== "new") {
            onSelectionChange({ filterValueId: value.values().next().value }, detail.id, product, setProduct)
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
          getFilter()?.filterValue?.map(item => <SelectItem key={item.id}>{item.value}</SelectItem>)
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
                  filters={filters}
                  setFilters={setFilters}
                  categoryId={categoryId}
                  subCategoryId={subCategoryId}
                  brandId={brandId}
                  callback={(value) => {
                    onSelectionChange({ filterValueId: value }, detail.id, product, setProduct)
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

export { FilterValueSelect }
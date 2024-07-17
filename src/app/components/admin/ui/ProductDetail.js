import { Button, Input, Modal, ModalContent, ModalHeader, Select, SelectItem, useDisclosure } from "@nextui-org/react"
import slugify from "slugify"
import ImagePicker from "./ImagePicker"
import RichTextEditor from "./RichTextArea"

const ProductDetail = ({
  categories, product, setProduct,
  brands, editor, subCategories }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const selectImage = (value) => {
    setProduct(Object.assign({}, product, { imageId: value.id, image: value }))
    onOpenChange()
  }

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
            onValueChange={(value) => setProduct(Object.assign({}, product, { name: value, slug: slugify(value, { locale: "vi" }).toLowerCase() }))}
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
          <Input
            type="number"
            label="Số lượng"
            labelPlacement="outside"
            aria-label="Số lượng"
            value={product.quantity}
            min={0}
            max={999}
            isRequired
            onValueChange={(value) => setProduct(Object.assign({}, product, { quantity: parseInt(value) }))}
          />
        </div>
        <div className="flex gap-2">
          <Select
            label="Category"
            aria-label="Category"
            selectedKeys={new Set([product.categoryId || ""])}
            onSelectionChange={(value) =>
              setProduct(Object.assign({}, product, { categoryId: value.values().next().value }))}
          >
            {categories.map(category => <SelectItem key={category.id}>{category.name}</SelectItem>)}
          </Select>
          <Select
            label="Thương hiệu"
            aria-label="Thương hiệu"
            selectedKeys={new Set([product.brandId || ""])}
            onSelectionChange={(value) =>
              setProduct(Object.assign({}, product, { brandId: value.values().next().value }))}
          >
            {brands.map(brand => <SelectItem key={brand.id}>{brand.name}</SelectItem>)}
          </Select>
          <Select
            label="Sub category"
            aria-label="Sub category"
            defaultSelectedKeys={new Set([product.subCategoryId || ""])}
            onSelectionChange={(value) =>
              setProduct(Object.assign({}, product, { subCategoryId: value.values().next().value }))}
          >
            {
              subCategories.map((subCategory) => (
                <SelectItem key={subCategory.id}>
                  {subCategory.name}
                </SelectItem>
              ))

            }
          </Select>
        </div>
        <div className='grid grid-cols-2 gap-3'>
          <div className="flex flex-col gap-3">
            <Input
              type="text"
              label="SKU"
              labelPlacement="outside"
              aria-label="SKU"
              defaultValue={product.sku}
              onValueChange={(value) => setProduct(Object.assign({}, product, { sku: value }))}
            />
            <Input type="text"
              aria-label="Hình ảnh"
              label="Hình ảnh"
              value={product.image?.name} isDisabled />
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
              product.image ?
                <img
                  src={`${process.env.NEXT_PUBLIC_FILE_PATH + product.image?.path}`}
                  alt={`${product.imageAlt}`}
                  width="300"
                  height="200"
                  className="float-right"
                /> : null
            }
          </div>

        </div>
        <RichTextEditor editor={editor} />
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

export default ProductDetail
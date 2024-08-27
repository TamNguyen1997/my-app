import { Button, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@nextui-org/react"
import slugify from "slugify"
import ImageCms from "../ImageCms"
import { useCallback } from "react"
import { ToastContainer, toast } from 'react-toastify';
import { useEditor } from "@tiptap/react";
import { editorConfig } from "@/lib/editor";
import RichTextEditor from "../RichTextArea";

const ProductDetail = ({
  categories, product, setProduct,
  brands, subCategories }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const editor = useEditor(editorConfig(product.description))

  const selectImage = (value) => {
    setProduct(Object.assign({}, product, { imageId: value.id, image: value }))
    onOpenChange()
  }

  const getSubCate = useCallback(() => {
    return product.categoryId ? subCategories.filter(item => item.cateId === product.categoryId) : subCategories
  }, [product])

  const onSave = async () => {
    let productToUpdate = { ...product, description: editor.getHTML() }
    delete productToUpdate.image
    delete productToUpdate.subCategory
    delete productToUpdate.brand
    delete productToUpdate.category
    delete productToUpdate.subCate

    if (!product.id) {
      const createRes = await fetch(`/api/products/`, { method: "POST", body: JSON.stringify(productToUpdate) })
      if (createRes.ok) {
        toast.success("Đã lưu")
        window.location.replace('/admin/product/edit/' + (await createRes.json()).id)
      } else {
        toast.error("Không thể lưu")
      }
    } else {

      const res = await fetch(`/api/products/${product.id}`, { method: "PUT", body: JSON.stringify(productToUpdate) })
      if (res.ok) {
        toast.success("Đã lưu")
      } else {
        toast.error("Không thể lưu")
      }
      setProduct(await res.json())
    }

  }

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Input
            type="text"
            label="Tên sản phẩm"
            labelPlacement="outside"
            aria-label="Tên sản phẩm"
            value={product.name}
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
            onValueChange={(value) => setProduct(Object.assign({}, product, { quantity: parseInt(value) }))}
          />
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            label="Khối lượng (g)"
            labelPlacement="outside"
            aria-label="Khối lượng"
            value={product.weight}
            min={0}
            max={999}
            onValueChange={(value) => setProduct(Object.assign({}, product, { weight: parseInt(value) }))}
          />
          <Input
            type="number"
            label="Chiều dài (cm)"
            labelPlacement="outside"
            aria-label="Chiều dài"
            value={product.length}
            min={0}
            max={999}
            onValueChange={(value) => setProduct(Object.assign({}, product, { length: parseInt(value) }))}
          />
          <Input
            type="number"
            label="Chiều rộng (cm)"
            labelPlacement="outside"
            aria-label="Chiều rộng"
            value={product.width}
            min={0}
            max={999}
            onValueChange={(value) => setProduct(Object.assign({}, product, { width: parseInt(value) }))}
          />
          <Input
            type="number"
            label="Chiều cao (cm)"
            labelPlacement="outside"
            aria-label="Chiều cao"
            value={product.height}
            min={0}
            max={999}
            onValueChange={(value) => setProduct(Object.assign({}, product, { height: parseInt(value) }))}
          />
        </div>
        <div className="flex gap-2">
          <Select
            label="Category"
            aria-label="Category"
            selectedKeys={new Set([product.categoryId || ""])}
            onSelectionChange={(value) =>
              setProduct(Object.assign({}, product, { categoryId: value.size ? value.values().next().value : null, subCateId: null }))}
          >
            {categories.map(category => <SelectItem key={category.id}>{category.name}</SelectItem>)}
          </Select>
          <Select
            label="Sub category"
            aria-label="Sub category"
            isDisabled={getSubCate().length === 0}
            selectedKeys={new Set([product.subCateId || ""])}
            onSelectionChange={(value) =>
              setProduct(Object.assign({}, product, { subCateId: value.size ? value.values().next().value : null }))
            }
          >
            {
              getSubCate().map((subCategory) => (
                <SelectItem key={subCategory.id}>
                  {subCategory.name}
                </SelectItem>
              ))
            }
          </Select>
          <Select
            label="Thương hiệu"
            aria-label="Thương hiệu"
            selectedKeys={new Set([product.brandId || ""])}
            onSelectionChange={(value) =>
              setProduct(Object.assign({}, product, { brandId: value.size ? value.values().next().value : null }))}
          >
            {brands.map(brand => <SelectItem key={brand.id}>{brand.name}</SelectItem>)}
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
              aria-label="Hình ảnh thumbnail"
              label="Hình ảnh thumbnail"
              value={product.image?.name} isDisabled />
            <Input type="text"
              aria-label="Alt"
              label="Alt"
              onValueChange={(value) => setProduct(Object.assign({}, product, { imageAlt: value }))}
              defaultValue={product?.imageAlt} />
            <div>
              <Button color="primary" onClick={onOpen} className="w-24 float-right">Chọn ảnh</Button>
            </div>
            <RichTextEditor editor={editor} />
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
      </div>
      <div className="flex float-right gap-2 px-2 w-full">
        <Link href="/admin/product">Trở về</Link>
        <Button color="primary" onClick={onSave}>Lưu</Button>
      </div>

      <Modal
        size="full" scrollBehavior="inside"
        isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chọn hình ảnh</ModalHeader>
              <ModalBody>
                <ImageCms disableAdd={true} onImageClick={selectImage} disableDelete={true} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
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
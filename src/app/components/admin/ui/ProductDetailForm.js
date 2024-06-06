import { useEffect, useState, useContext } from "react";
import { Autocomplete, AutocompleteItem, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDisclosure } from "@nextui-org/react";
import { ProductContext } from "../ProductCms";
import ImageCms from "@/components/admin/ui/ImageCms";
import Image from "next/image";

const ProductDetailForm = () => {
  const [selectedProduct, setSelectedProduct] = useContext(ProductContext)

  const [categories, setCategories] = useState([])
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(json => setCategories(json))
  }, [])

  const selectedImage = (value) => {
    setSelectedProduct(Object.assign({}, selectedProduct, { imageUrl: value }))
    onOpenChange()
  }
  return (
    <>
      <Input
        type="text"
        label="Mã sản phẩm"
        labelPlacement="outside"
        aria-label="Mã sản phẩm"
        defaultValue={selectedProduct.id}
        isRequired
        className="p-3"
        onValueChange={(value) => setSelectedProduct(Object.assign({}, selectedProduct, { id: value }))}
      />
      <Input
        type="text"
        label="Tên sản phẩm"
        labelPlacement="outside"
        aria-label="Tên sản phẩm"
        defaultValue={selectedProduct.name}
        isRequired
        onValueChange={(value) => setSelectedProduct(Object.assign({}, selectedProduct, { name: value }))}
        className="p-3"
      />
      <Autocomplete
        label="Category"
        variant="bordered"
        aria-label="Category"
        defaultItems={categories}
        className="max-w-xs p-3"
        allowsCustomValue={true}
        selectedKey={selectedProduct.categoryId}
        onSelectionChange={value => setSelectedProduct(Object.assign({}, selectedProduct, { categoryId: value }))}
        isRequired
      >
        {(category) => <AutocompleteItem key={category.id}>{category.name}</AutocompleteItem>}
      </Autocomplete>
      <div className='pl-3 grid grid-cols-2'>
        <div className="flex flex-col gap-3">
          <Input type="text"
            aria-label="Hình ảnh"
            label="Hình ảnh"
            defaultValue={selectedProduct.imageUrl} isDisabled></Input>
          <Input type="text"
            aria-label="Alt sản phẩm"
            label="Alt sản phẩm"
            onValueChange={(value) => setSelectedProduct(Object.assign({}, selectedProduct, { imageAlt: value }))}
            defaultValue={selectedProduct.imageAlt}></Input>
          <div>
            <Button color="primary" onClick={onOpen} className="w-24 float-right">Chọn ảnh</Button>
          </div>
        </div>
        <div>
          {
            selectedProduct.imageUrl ?
              <Image
                src={`/gallery/${selectedProduct.imageUrl}`}
                alt="favicon"
                width="300"
                height="300"
                className="float-right"
              /> : null
          }
        </div>
        <Textarea
          label="Mô tả sản phẩm"
          labelPlacement="outside"
          placeholder="Mô tả sản phẩm"
          value={selectedProduct.description}
          onValueChange={(value) => setSelectedProduct(Object.assign({}, selectedProduct, { description: value }))}
        />
      </div>

      <Modal
        size="5xl" scrollBehavior="inside"
        isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chọn hình ảnh</ModalHeader>
              <ModalBody>
                <ImageCms disableAdd={true} onImageClick={selectedImage} disableDelete={true}></ImageCms>
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

export default ProductDetailForm

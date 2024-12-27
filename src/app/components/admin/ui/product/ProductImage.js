import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import ImageCms from "../ImageCms"
import { useContext, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import { X } from "lucide-react";
import { ProductContext } from "../../../../(admin)/admin/product/edit/[id]/page"

const ProductImage = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { product, setProduct } = useContext(ProductContext)
  const [images, setImages] = useState(product.product_on_image || [])

  const selectImage = (value) => {
    let newImages = product.product_on_image
    if (newImages.length >= 6) {
      toast.error("Không thể thêm hình, đã đạt tối đa 6 hình")
    } else {
      if (newImages.find(item => item.imageId === value.id)) {
        newImages = newImages.filter(item => item.imageId !== value.id)
        toast.warning("Đã loại ảnh này")
      } else {
        newImages = [...newImages, { imageId: value.id, image: value, productId: product.id }]
      }
    }
    let newProduct = { ...product, ...{ product_on_image: newImages } }
    newProduct.product_on_image = newImages
    setImages(newImages)
    setProduct(newProduct)
  }
  return (
    <>
      <ToastContainer />
      <div className="gap-3 p-5">
        <div className="flex flex-wrap gap-2">
          {
            images?.map((item, i) => <ImageItem key={i}
              deleteItem={selectImage}
              onClick={() => { }} img={item.image} />)
          }
        </div>
        <div className="flex flex-row gap-2 px-3 py-4 justify-end">
          <Button color="primary" onClick={onOpen} className="w-24">Chọn ảnh</Button>
        </div>
      </div>

      <Modal
        size="full" scrollBehavior="inside"
        isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Chọn hình ảnh</ModalHeader>
              <ModalBody>
                <ImageCms
                  onImageClick={selectImage}
                  highlights={images} />
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

const ImageItem = ({ img, onClick, deleteItem }) => {
  return <>
    <div className={`
                  w-40 h-40
                  group relative flex flex-col rounded hover:opacity-70 cursor-pointer
                  shadow-[0px_2px_10px_rgba(0,0,0,0.15)] hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15)]
                  hover:scale-[1.02]
                  transition duration-400
                `}>
      <img
        src={`${process.env.NEXT_PUBLIC_FILE_PATH + img?.path}`}
        alt={img?.alt}
        className="aspect-auto object-cover rounded-t shrink-0"
        onClick={() => onClick(img)} />

      <span className="absolute -top-2.5 -right-2.5 hidden group-hover:block 
      animate-vote bg-red-500 rounded-full hover:bg-red-700"
        onClick={() => deleteItem(img)}><X color="#FFFFFF" /></span>
    </div>
  </>
}

export default ProductImage
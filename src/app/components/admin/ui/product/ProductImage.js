import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import ImagePicker from "../ImagePicker"
import ProductImageCarousel from "@/components/ProductImageCarousel"
import { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';

const ProductImage = ({ product }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [images, setImages] = useState([])

  useEffect(() => {
    if (product.id) {
      fetch(`/api/products/${product.id}/images`).then(res => res.json()).then(json => {
        setImages(json.map(item => item.image))
      })
    }
  }, [product])

  const selectImage = (value) => {
    if (images.length >= 6) {
      toast.error("Không thể thêm hình, đã đạt tối đa 6 hình")
    } else {
      if (images.find(item => item.id === value.id)) {
        toast.error("Đã chọn ảnh này")
      } else {
        setImages([...images, value])
        onOpenChange()
      }
    }
  }

  const onSave = async () => {
    const res = await fetch(`/api/products/${product.id}/images`, { method: "POST", body: JSON.stringify({ images: images }) })
    if (res.ok) {
      toast.success("Đã lưu hình ảnh")
    } else {
      toast.error("Không thể lưu hình ảnh")
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col gap-3 w-2/3 h-2/3 m-auto">
        <ProductImageCarousel items={images.map(item => item.path) || []} />
        <div className="flex flex-row gap-2 px-3 py-4 justify-end">
          <Button color="primary" onClick={onOpen} className="w-24">Chọn ảnh</Button>
          <Button color="primary" onClick={onSave} className="w-24">Lưu</Button>
        </div>
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

export default ProductImage
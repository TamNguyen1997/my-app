import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import ImageCms from "../ImageCms"
import { useContext, useState, forwardRef, useRef, useTransition, useCallback, useEffect } from "react"
import { ToastContainer, toast } from 'react-toastify';
import { X } from "lucide-react";
import { ProductContext } from "../../../../(admin)/admin/product/edit/[id]/default"
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import FlipMove from 'react-flip-move';
import { useDrag, useDrop } from "react-dnd";
import { v4 } from "uuid";

const ProductImage = () => {
  const [, startTransition] = useTransition();
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { product, setProduct } = useContext(ProductContext)
  const [images, setImages] = useState(product.product_on_image || [])

  const selectImage = (value) => {
    let newImages = product.product_on_image
    if (newImages.length > 10) {
      toast.error("Không thể thêm hình, đã đạt tối đa 10 hình")
    } else {
      if (newImages.find(item => item.imageUrl === value.source_url)) {
        newImages = newImages.filter(item => item.imageUrl !== value.source_url)
        toast.warning("Đã loại ảnh này")
      } else {
        newImages = [...newImages, { imageId: v4(), imageUrl: value.source_url, productId: product.id }]
      }
    }
    setImages(newImages)
  }

  useEffect(() => {
    setProduct({ ...product, ...{ product_on_image: images.map((item, i) => ({ ...item, order: i })) } })
  }, [images])

  const onUploadSuccess = async (uploads) => {
    let newImages = product.product_on_image
    uploads.forEach(value => {
      if (newImages.length >= 10) {
        toast.error("Không thể thêm hình, đã đạt tối đa 10 hình")
      } else {
        if (newImages.find(item => item.imageId === value.id || item.imageUrl === value.source_url)) {
          newImages = newImages.filter(item => item.imageId !== value.id && item.imageUrl !== value.source_url)
          toast.warning("Đã loại ảnh này")
        } else {
          newImages = [...newImages, { imageUrl: value.source_url, productId: product.id }]
        }
      }
    });
    let newProduct = { ...product, ...{ product_on_image: newImages } }
    newProduct.product_on_image = newImages
    setImages(newImages)
    setProduct(newProduct)
    onOpenChange()
  }

  const moveRow = useCallback((dragIndex, hoverIndex) => {
    startTransition(() => {
      setImages((prevList) =>
        update(prevList, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevList[dragIndex]]
          ]
        })
      );
    });
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="gap-3 p-5">
        <ImageDraggableList images={images} deleteItem={selectImage} moveRow={moveRow} />

        <div className="flex flex-row gap-2 px-3 py-4 justify-end">
          <Button color="primary" onPress={onOpen} className="w-24">Chọn ảnh</Button>
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
                  highlights={images}
                  onUploadSuccess={onUploadSuccess}
                />
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

const ImageItem = ({ img, onClick, deleteItem, index, moveRow }) => {
  const { id } = img;
  const ref = useRef(null);

  const [collectedProps, drop] = useDrop({

    accept: "dnd-image",

    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },

    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  const [collectedDragProps, drag] = useDrag({
    type: "dnd-image",
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  drag(drop(ref));

  return <>
    <div
      ref={ref}
      data-handler-id={collectedProps.handlerId}
      className={`
        w-40 h-40
        group relative flex flex-col rounded hover:opacity-70 cursor-grab
        shadow-[0px_2px_10px_rgba(0,0,0,0.15)] hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15)]
        hover:scale-[1.02]
        transition duration-400
      `}
    >
      <img
        src={`${img?.imageUrl}`}
        alt={img?.imageUrl}
        className="aspect-auto object-cover rounded-t shrink-0"
        onClick={() => onClick(img)} />

      <span className="absolute -top-2.5 -right-2.5 hidden group-hover:block 
      animate-vote bg-red-500 rounded-full hover:bg-red-700"
        onClick={() => deleteItem(img)}><X color="#FFFFFF" /></span>
    </div>
  </>
}

const FunctionalDraggable = forwardRef((props, ref) => (
  <div ref={ref}>
    <ImageItem {...props} />
  </div>
));

const ImageDraggableList = ({ images, deleteItem, moveRow }) => {
  return <>
    <DndProvider backend={HTML5Backend}>
      <FlipMove className="flex flex-wrap gap-2">
        {
          images?.map((item, i) =>
            <FunctionalDraggable
              key={item.imageId}
              index={i}
              deleteItem={deleteItem}
              onClick={() => { }}
              img={item}
              moveRow={moveRow}
            />
          )
        }
      </FlipMove>
    </DndProvider>
  </>
}

export default ProductImage
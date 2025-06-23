"use client"

import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import ImageCms from "../ImageCms";
import { useState, useRef, useCallback, forwardRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { X } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import FlipMove from "react-flip-move";
import { v4 as uuidv4 } from "uuid";

const MAX_IMAGES = 10;

const SaleDetailImages = ({ saleDetail, productId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [images, setImages] = useState(saleDetail.sale_detail_on_image || []);

  const updateProductImages = (newImages) => {
    setImages(newImages);
    sessionStorage.setItem(`${productId}-${saleDetail.id}`, JSON.stringify(newImages));
  };

  useEffect(() => {
    const sessionImages = sessionStorage.getItem(`${productId}-${saleDetail.id}`)
    if (sessionImages?.length > 0) {
      setImages(JSON.parse(sessionImages))
    }
  }, [])

  const handleImageSelection = (value) => {
    const imageExists = images.some((item) => item.imageUrl === value.source_url);

    if (images.length >= MAX_IMAGES && !imageExists) {
      toast.error("Không thể thêm hình, đã đạt tối đa 10 hình", { containerId: `sale-detail-${saleDetail.id}` });
      return;
    }

    const newImages = imageExists
      ? images.filter((item) => item.imageUrl !== value.source_url)
      : [
        ...images,
        { imageId: uuidv4(), imageUrl: value.source_url, saleDetailId: saleDetail.id },
      ];

    toast[imageExists ? "warning" : "success"](
      imageExists ? "Đã loại ảnh này" : "Đã thêm ảnh", { containerId: `sale-detail-${saleDetail.id}` }
    );
    updateProductImages(newImages);
  };

  const deleteImage = (image) => {
    const newImages = images.filter((item) => item.imageUrl !== image.imageUrl);
    updateProductImages(newImages);
    toast.success("Đã xóa ảnh", { containerId: `sale-detail-${saleDetail.id}` });
  };

  const handleUploadSuccess = (uploads) => {
    const newImages = [...images];

    uploads.forEach((upload) => {
      const imageExists = newImages.some(
        (item) =>
          item.imageId === upload.id || item.imageUrl === upload.source_url
      );

      if (newImages.length >= MAX_IMAGES && !imageExists) {
        toast.error("Không thể thêm hình, đã đạt tối đa 10 hình", { containerId: `sale-detail-${saleDetail.id}` });
        return;
      }

      if (!imageExists) {
        newImages.push({
          imageUrl: upload.source_url,
          saleDetailId: saleDetail.id,
        });
      }
    });

    updateProductImages(newImages);
    onOpenChange();
  };

  const moveRow = useCallback((dragIndex, hoverIndex) => {
    setImages((prevList) =>
      update(prevList, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevList[dragIndex]],
        ],
      })
    );
  }, []);

  const onSave = async () => {
    const updatedImages = images.map((item, i) => ({ saleDetailId: item.saleDetailId, imageUrl: item.imageUrl }));
    const res = await fetch(`/api/products/${saleDetail.productId}/sale-details/${saleDetail.id}`, {
      method: "PUT",
      body: JSON.stringify({
        sale_detail_on_image: updatedImages,
      }),
    });

    if (res.ok) {
      toast.success("Cập nhật thành công", { containerId: `sale-detail-${saleDetail.id}` });
    } else {
      toast.error("Không thể cập nhật sản phẩm", { containerId: `sale-detail-${saleDetail.id}` });
    }
  }

  return (
    <>
      <ToastContainer containerId={`sale-detail-${saleDetail.id}`} />
      <div className="gap-3 p-5">
        <ImageDraggableList
          images={images}
          deleteItem={deleteImage}
          moveRow={moveRow}
        />
        <div className="flex flex-row gap-2 px-3 py-4 justify-end">
          <Link href={`/admin/product/edit/${productId}/?tab=sale`}>
            <Button variant="ghost">
              Trở về sản phẩm
            </Button>
          </Link>
          <Button onPress={onOpen} className="w-24">
            Chọn ảnh
          </Button>
          <Button color="primary" onPress={onSave} className="w-24">
            Lưu
          </Button>
        </div>
      </div>
      <Modal
        size="full"
        scrollBehavior="inside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Chọn hình ảnh
              </ModalHeader>
              <ModalBody>
                <ImageCms
                  onImageClick={handleImageSelection}
                  highlights={images}
                  onUploadSuccess={handleUploadSuccess}
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
  );
};

const ImageItem = ({ img, deleteItem, index, moveRow }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: "dnd-image",
    hover(item, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (
        (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
        (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
      ) {
        return;
      }

      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [, drag] = useDrag({
    type: "dnd-image",
    item: { id: img.imageId, index },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className="w-40 h-40 group relative flex flex-col rounded hover:opacity-70 cursor-grab shadow-[0px_2px_10px_rgba(0,0,0,0.15)] hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15)] hover:scale-[1.02] transition duration-400"
    >
      <img
        src={img.imageUrl}
        alt={img.imageUrl}
        className="aspect-auto object-cover rounded-t shrink-0"
      />
      <span
        className="absolute -top-2.5 -right-2.5 hidden group-hover:block animate-vote bg-red-500 rounded-full hover:bg-red-700"
        onClick={() => deleteItem(img)}
      >
        <X color="#FFFFFF" />
      </span>
    </div>
  );
};

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
              key={i}
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

export default SaleDetailImages;

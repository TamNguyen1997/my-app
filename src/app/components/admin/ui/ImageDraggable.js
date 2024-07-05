import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { X } from 'lucide-react';
import { parseDate } from "@internationalized/date";
import { Button, DatePicker, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch, useDisclosure } from '@nextui-org/react';
import ImagePicker from "./ImagePicker";

export function ImageDraggable({ itemData, moveRow, index, deleteImagePos, isScheduled, saveImage, setActiveFrom, setActiveTo, setActive }) {
  const { id } = itemData;
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

  const bgColor = collectedDragProps.isDragging ? "rgba(0,0,0,0.03)" : "";

  drag(drop(ref));

  return (
    <div
      ref={ref}
      data-handler-id={collectedProps.handlerId}
      className="border rounded-2xl select-none p-[24px_12px_12px] cursor-grab h-full"
      style={{ backgroundColor: bgColor }}
    >
      <div className="grid grid-cols-[auto_160px] gap-3 min-h-28">
        <div className="flex flex-wrap items-start">
          {
            itemData.image ?
              <div
                key={itemData.id}
                className="group relative hover:opacity-70 aspect-[16/10] w-[min(160px,100%)] mr-3 mb-3"
              >
                <img src={process.env.NEXT_PUBLIC_FILE_PATH + itemData.image.path} className="w-full h-full object-cover mr-1" />
                <span className="absolute -top-2.5 -right-2.5 hidden group-hover:block animate-vote bg-red-500 rounded-full hover:bg-red-700 cursor-pointer" onClick={() => deleteImagePos(itemData.id)}><X color="#FFFFFF" /></span>
              </div>
              : <AddPicture saveImage={saveImage} />
          }

          {/* {
            itemData.mobileBanner ?
              <div
                key={itemData.id}
                className="group relative hover:opacity-70 aspect-[16/10] w-[min(160px,100%)] mr-3 mb-3"
              >
                <img src={itemData.mobileBanner} className="w-full h-full object-cover mr-1" />
                <span className="absolute -top-2.5 -right-2.5 hidden group-hover:block animate-vote bg-red-500 rounded-full hover:bg-red-700 cursor-pointer" onClick={() => deleteImagePos(itemData.id)}><X color="#FFFFFF" /></span>
              </div>
              : <AddPicture saveImage={saveImage} />
          } */}
        </div>
        {
          isScheduled ? <div className="flex flex-col space-y-2.5 items-end">
            <div className="flex gap-2">
              <DatePicker
                label="Từ ngày"
                onChange={setActiveFrom}
                defaultValue={itemData.activeFrom ? getDateString(itemData.activeFrom) : ""}
                aria-label="Date"
              />
              <DatePicker
                label="Đến ngày"
                onChange={setActiveTo}
                defaultValue={itemData.activeTo ? getDateString(itemData.activeTo) : ""}
                aria-label="Date"
              />
            </div>
            <Switch isSelected={itemData.active} onValueChange={setActive} />

            {
              itemData.active
            }
          </div> : null
        }

      </div>
    </div>
  );
}

const getDateString = (isoDate) => parseDate(new Date(isoDate).toISOString().split('T')[0])

const AddPicture = ({ saveImage }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const onImageClick = (img) => {
    saveImage(img)
  }

  return (
    <>
      <Modal
        size="5xl" scrollBehavior="inside"
        isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <ModalHeader>Chọn hình</ModalHeader>
                <ImagePicker onImageClick={onImageClick} disableDelete />
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
      <div className="aspect-[1/1] w-[min(75px,100%)] text-xl flex items-center justify-center border cursor-pointer hover:bg-[rgba(0,0,0,0.03)] transition" onClick={onOpen}>
        +
      </div>
    </>
  )
}
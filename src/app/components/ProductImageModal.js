"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import Image from "next/image";

const ProductImageModal = forwardRef(function ProductImageModal({ title = "" }, ref) {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const safe = (url) => (typeof url === 'string' && url.trim().length > 0) ? url : "/default-featured-image.webp";
  const imageList = useMemo(() => (Array.isArray(images) ? images : []).filter(i => typeof i === 'string' && i.trim().length > 0), [images]);

  useImperativeHandle(ref, () => ({
    openWith(list, index = 0) {
      setImages(Array.isArray(list) ? list : []);
      setActiveIndex(Math.max(0, Math.min(index || 0, (Array.isArray(list) ? list.length : 1) - 1)));
      setIsOpen(true);
    },
    close() {
      setIsOpen(false);
    }
  }), []);

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen} size="5xl" backdrop="blur" scrollBehavior="outside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody>
              <div className="flex gap-4">
                <div className="flex-[3] min-w-0">
                  <div className="w-full aspect-square bg-white border rounded-md flex items-center justify-center">
                    <Image
                      src={safe(imageList[activeIndex])}
                      alt="Hình ảnh sản phẩm"
                      width={375}
                      height={375}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
                <div className="flex-[2] max-h-[80vh] overflow-auto pr-1">
                  {title ? (
                    <div className="mb-3 font-semibold text-sm md:text-base whitespace-normal break-words" title={title}>{title}</div>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    {imageList.map((src, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveIndex(i)}
                        className={`border rounded-md p-1 focus:outline-none ${i === activeIndex ? 'border-red-500' : 'border-default'}`}
                        aria-label={`Chọn ảnh ${i + 1}`}
                      >
                        <Image
                          src={safe(src)}
                          alt={`Ảnh ${i + 1}`}
                          width={90}
                          height={90}
                          className="object-contain w-[90px] h-[90px]"
                          sizes="90px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

export default ProductImageModal;



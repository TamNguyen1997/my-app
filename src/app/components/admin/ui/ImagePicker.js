"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import "./ImageCms.css";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Spinner,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { EditIcon, Search, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { ProductContext } from "@/app/(admin)/admin/product/edit/[id]/default";
import Image from "next/image";
import parse from "html-react-parser";
import { useForm } from "react-hook-form";

const ImagePicker = ({
  onImageClick,
  disableDelete,
  reload,
  highlights,
  showHighlight = true,
}) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState();
  const [search, setSearch] = useState();
  const [refresh, setRefresh] = useState(false);
  const [size, setSize] = useState(20);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { product } = useContext(ProductContext) || {};

  const pages = useMemo(() => (total ? Math.ceil(total / size) : 0), [total, size]);

  useEffect(() => {
    fetchImages();
  }, [refresh, reload, size, page]);

  const getImages = async () => {
    setIsLoading(true)
    await fetch(`/api/images/wordpress/?search=${search || ""}&size=${size}&page=${page}`).then(async res => {
      const json = await res.json()
      setImages(json.result || [])
      setTotal(json.total)
    })
    setIsLoading(false)
  }
  const deleteImage = async (image) => {
    if (window.confirm("Bạn có chắc muốn xóa hình này không?")) return
    setIsLoading(true)
    const res = await fetch(`/api/images/wordpress/${image.id}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      setRefresh(!refresh)
    } else {
      const json = await res.json()
      toast.error(json.message, { containerId: "image-picker" })
    }
    setIsLoading(false)
  }

  const handleEditImage = async (data) => {
    try {
      const res = await fetch(`/api/images/wordpress/${selectedImage.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setRefresh(!refresh);
        onOpenChange();
        toast.success("Cập nhật thành công", { containerId: "image-picker" });
      } else {
        const json = await res.json();
        toast.error(json.message, { containerId: "image-picker" });
      }
    } catch (error) {
      console.error("Error editing image:", error);
    }
  };

  const renderImageCard = (img) => {
    const isHighlighted = showHighlight && (
      product?.product_on_image?.some(item => item.imageUrl === img.source_url) ||
      highlights?.some(item => item.imageUrl === img.source_url)
    );

    return (
      <div
        key={img.id}
        className={`group relative flex flex-col rounded hover:opacity-70 cursor-pointer shadow-[0px_2px_10px_rgba(0,0,0,0.15)] hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15)] hover:-translate-y-2.5 hover:scale-[1.02] transition duration-400 ${isHighlighted ? "border-green-400 border-large" : ""}`}
      >
        <Image
          src={img.source_url}
          alt={img.title.rendered}
          height={400}
          width={400}
          onClick={() => onImageClick(img)}
        />
        {!disableDelete && (
          <>
            <span
              className="absolute -top-2.5 -right-2.5 hidden group-hover:block animate-vote bg-red-500 rounded-full hover:bg-red-700"
              onClick={() => handleDeleteImage(img)}
            >
              <X color="#FFFFFF" />
            </span>
            <span
              className="absolute -top-2.5 right-5 hidden group-hover:block bg-green-500 rounded-md hover:bg-green-700"
              onClick={() => {
                setSelectedImage(img);
                onOpen();
              }}
            >
              <EditIcon color="#FFFFFF" />
            </span>
          </>
        )}
        <div className="grow bg-white text-center rounded-b p-5">
          <h6 className="text-[17px] font-bold text-[#212529] break-words mb-2">
            {parse(img.title?.rendered || "")}
          </h6>
        </div>
      </div>
    );
  };

  return (
    <div>
      <ToastContainer containerId="image-picker" />
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4 py-5">
        <div className="flex gap-3 w-1/2">
          <Input
            className="w-52"
            type="text"
            aria-label="Images"
            placeholder="Tìm kiếm ảnh"
            isClearable
            onValueChange={(value) => setSearch(value)}
          />
          <Button onPress={fetchImages} color="primary" title="Tìm kiếm" className="mt-auto">
            <Search />
          </Button>
        </div>
      </div>

      <div className="w-full flex pb-3">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">{size}</Button>
          </DropdownTrigger>
          <DropdownMenu onAction={(key) => setSize(key)}>
            {[20, 30, 40, 50, 100].map((value) => (
              <DropdownItem key={value}>{value}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      </div>

      {isLoading ? (
        <Spinner className="flex m-auto pt-10 w-full h-full" />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[30px]">
          {images.map(renderImageCard)}
        </div>
      )}

      <Modal size="lg" isOpen={isOpen} onOpenChange={onOpenChange}>
        <form onSubmit={handleSubmit(handleEditImage)}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Chỉnh sửa hình ảnh</ModalHeader>
                <ModalBody>
                  <Input
                    aria-label="Tên ảnh"
                    label="Tên ảnh"
                    defaultValue={parse(selectedImage?.title?.rendered || "")}
                    {...register("title", { required: "Bạn phải điền tên hình ảnh" })}
                    isRequired
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title.message}</p>
                  )}
                  <Textarea
                    aria-label="Alt"
                    label="Alt"
                    value={selectedImage?.alt_text}
                    {...register("alt_text")}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" type="submit">
                    Lưu
                  </Button>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </div>
  );
};

export default ImagePicker;

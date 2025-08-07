"use client";

import { useState } from "react";
import "./ImageCms.css";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
  Tabs,
  Tab,
  Spinner,
} from "@heroui/react";
import Dropzone, { ErrorCode } from "react-dropzone";
import ImagePicker from "./ImagePicker";
import BannerScheduler from "./BannerScheduler";
import { ToastContainer, toast } from "react-toastify";

const MAX_FILE_SIZE = 10_000_000;

const ImageCms = ({
  onImageClick = () => { },
  highlights,
  onUploadSuccess,
  showHighlight = true,
  maxFiles = 10
}) => {
  const [reload, setReload] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Gallery");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [imageFiles, setImageFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDropRejected = (fileRejections) => {
    if (fileRejections.length > maxFiles) {
      alert("Tối đa 5 file");
      return;
    }

    fileRejections.forEach((rejection, i) => {
      const { code } = rejection.errors[0];
      const index = i + 1;
      if (code === ErrorCode.FileInvalidType) {
        alert(`File ${index} không hợp lệ`);
      } else if (code === ErrorCode.FileTooLarge) {
        alert(`File ${index} quá lớn`);
      }
    });
  };

  const upload = async () => {
    setIsUploading(true);

    const results = await Promise.all(
      imageFiles.map((item) => {
        const formData = new FormData();
        formData.append("file", item.file);
        formData.append("title", item.fileName);
        formData.append("alt_text", item.alt_text || "");

        return fetch("/api/images/upload/wordpress", {
          method: "POST",
          body: formData,
        });
      })
    );

    const successUploads = results.filter((res) => res.ok);
    const failUploads = results.filter((res) => !res.ok);

    if (successUploads.length)
      toast.success(`Đã upload thành công ${successUploads.length} hình`, {
        containerId: "ImageCms",
      });

    if (failUploads.length)
      toast.error(`Upload không thành công ${failUploads.length} hình`, {
        containerId: "ImageCms",
      });

    setIsUploading(false);
    setImageFiles([]);
    setReload(true);
    onOpenChange();

    if (onUploadSuccess) {
      const uploadedData = await Promise.all(
        successUploads.map((res) => res.json())
      );
      onUploadSuccess(uploadedData);
    }
  };

  const updateImages = (index, value) => {
    setImageFiles((prev) =>
      prev.map((img, i) => (i === index ? { ...img, ...value } : img))
    );
  };

  return (
    <div className="border shadow-md p-5">
      <ToastContainer containerId="ImageCms" />
      <Tabs
        aria-label="Gallery"
        selectedKey={selectedTab}
        onSelectionChange={setSelectedTab}
      >
        <Tab key="Gallery" title="Gallery">
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 py-5">
            <Button color="primary" onPress={onOpen}>
              Thêm ảnh
            </Button>
          </div>

          <Modal size="full" scrollBehavior="inside" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  {isUploading ? (
                    <Spinner className="flex m-auto pt-10 w-full h-full" />
                  ) : (
                    <ModalBody>
                      <ModalHeader>Upload ảnh</ModalHeader>
                      <Dropzone
                        maxSize={MAX_FILE_SIZE}
                        maxFiles={maxFiles}
                        multiple
                        accept="image/*"
                        onDropRejected={handleDropRejected}
                        onDropAccepted={(files) =>
                          setImageFiles(
                            files.map((file) => ({
                              file,
                              fileName: file.name
                            }))
                          )
                        }
                      >
                        {({ getRootProps, getInputProps }) => (
                          <section className="container">
                            <div {...getRootProps({ className: "dropzone" })}>
                              <input {...getInputProps()} />
                              <p className="text-center mx-auto">
                                Kéo thả hoặc click để tải hình
                              </p>
                              <em>
                                (Chỉ chấp nhận *.jpeg, *.png, *.jpg, *.svg,
                                *.webp, *.avif)
                              </em>
                            </div>
                          </section>
                        )}
                      </Dropzone>

                      <div>
                        {imageFiles.map((img, i) => (
                          <div
                            className="grid grid-cols-2 gap-5 w-4/5 m-auto py-3 border-b"
                            key={i}
                          >
                            <span>
                              <img
                                className="max-h-60 m-auto"
                                src={URL.createObjectURL(img.file)}
                                alt="preview"
                              />
                            </span>
                            <span className="flex flex-col gap-3">
                              <Input
                                aria-label="Tên ảnh"
                                label="Tên ảnh"
                                defaultValue={img.fileName}
                                onValueChange={(value) =>
                                  updateImages(i, { fileName: value })
                                }
                                isRequired
                              />
                              <Textarea
                                aria-label="Mô tả"
                                label="Mô tả"
                                defaultValue={img.alt_text}
                                onValueChange={(value) =>
                                  updateImages(i, { alt_text: value })
                                }
                              />
                            </span>
                          </div>
                        ))}
                      </div>
                    </ModalBody>
                  )}
                  <ModalFooter>
                    <Button color="primary" onPress={upload}>
                      Lưu
                    </Button>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Đóng
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>

          <ImagePicker
            onImageClick={onImageClick}
            reload={reload}
            highlights={highlights}
            showHighlight={showHighlight}
          />
        </Tab>

        <Tab key="Draggable Gallery" title="Quản lý banner">
          <BannerScheduler />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ImageCms;

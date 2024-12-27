"use client"

import { useState } from 'react'
import "./ImageCms.css"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDisclosure, Tabs, Tab, SelectItem, Select, Spinner } from '@nextui-org/react'
import Dropzone, { ErrorCode } from 'react-dropzone'
import ImagePicker from './ImagePicker'
import BannerScheduler from './BannerScheduler'
import { image_type } from '@prisma/client'
import { ToastContainer, toast } from 'react-toastify';

const ImageCms = ({ onImageClick, highlights, onUploadSuccess }) => {
  const [reload, setReload] = useState(false)

  const [selectedTab, setSelectedTab] = useState("Gallery")

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [imageFiles, setImageFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  const upload = async () => {
    setIsUploading(true)
    const results = await Promise.all(imageFiles.map(item => {
      const formData = new FormData()
      formData.append('file', item.file)
      formData.append('description', item.description)
      formData.append('name', item.fileName)
      formData.append('alt', item.description)
      formData.append('type', item.type)

      return fetch('/api/images/upload', {
        method: 'POST',
        body: formData
      })
    }))
    const successUploads = results.filter(response => response.ok)
    const failUploads = results.filter(response => !response.ok)

    successUploads.length > 0 && toast.success(`Đã upload thành công ${successUploads.length} hình`, { containerId: "ImageCms" })
    failUploads.length > 0 && toast.error(`Upload không thành công ${failUploads.length} hình`, { containerId: "ImageCms" })

    setIsUploading(false)
    setImageFiles([])
    setReload(true)
    if (onUploadSuccess) {
      onUploadSuccess(successUploads)
    }
    onOpenChange()
  }

  const updateImages = (index, value) => {
    let newImages = imageFiles
    newImages[index] = { ...imageFiles[index], ...value }
    setImageFiles(newImages)
  }

  return (
    <div className="border shadow-md p-5">
      <ToastContainer containerId="ImageCms" />
      <Tabs aria-label="Gallery" selectedKey={selectedTab} onSelectionChange={setSelectedTab}>
        <Tab key="Gallery" title="Gallery">
          <div className='flex w-full flex-wrap md:flex-nowrap gap-4 py-5'>
            <Button color="primary" onClick={onOpen}>Thêm ảnh</Button>
          </div>
          <div>
            <Modal
              size="full" scrollBehavior="inside"
              isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    {isUploading ? <Spinner className="flex m-auto pt-10 w-full h-full" /> :
                      <ModalBody>
                        <ModalHeader>Upload ảnh</ModalHeader>
                        <Dropzone
                          maxSize={10000000}
                          maxFiles={5}
                          multiple={true}
                          accept="image/*"
                          onDropRejected={(fileRejections) => {
                            if (fileRejections.length > 5) {
                              alert(`Tối đa 5 file`)
                              return
                            }
                            fileRejections.forEach((rejection, i) => {
                              switch (rejection.errors[0].code) {
                                case ErrorCode.FileInvalidType: {
                                  alert(`File ${i + 1} không hợp lệ thứ`)
                                  break
                                }
                                case ErrorCode.FileTooLarge: {
                                  alert(`File ${i + 1} không quá lớn`)
                                  break
                                }
                              }
                            })
                          }}
                          onDropAccepted={acceptedFiles => setImageFiles(acceptedFiles.map(file => { return { file: file, fileName: file.name, type: image_type.PRODUCT } }))}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <section className="container">
                              <div {...getRootProps({ className: 'dropzone' })}>
                                <input {...getInputProps()} />
                                <p className="text-center mx-auto">Kéo thả hoặc click để tải hình</p>
                                <em>(Chỉ chấp nhận *.jpeg, *.png, *.jpg, *svg)</em>
                              </div>
                            </section>
                          )}
                        </Dropzone>
                        <div>
                          {
                            imageFiles.map((img, i) =>
                              <div className='grid grid-cols-2 gap-5 w-4/5 m-auto py-3 border-b' key={i}>
                                <span>
                                  <img className='max-h-60 m-auto' src={URL.createObjectURL(img.file)} />
                                </span>
                                <span className='flex flex-col gap-3'>
                                  <Input aria-label="Tên ảnh" label="Tên ảnh"
                                    defaultValue={img.fileName}
                                    onValueChange={value => updateImages(i, { fileName: value })}
                                    isRequired />
                                  <Select
                                    label="Loại hình"
                                    defaultSelectedKeys={[img.type]}
                                    onSelectionChange={value => updateImages(i, { type: value.values().next().value })}
                                    isRequired
                                  >
                                    <SelectItem key="PRODUCT">
                                      Sản phẩm
                                    </SelectItem>
                                    <SelectItem key="BLOG">
                                      Blog
                                    </SelectItem>
                                    <SelectItem key="BANNER">
                                      Banner
                                    </SelectItem>

                                  </Select>
                                  <Textarea aria-label="Mô tả" label="Mô tả"
                                    defaultValue={img.description}
                                    onValueChange={value => updateImages(i, { description: value })} />
                                </span>
                              </div>
                            )
                          }
                        </div>
                      </ModalBody>}
                    <ModalFooter>
                      <Button color="primary" variant="solid" onPress={upload}>
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
          </div>

          <ImagePicker onImageClick={onImageClick} reload={reload} highlights={highlights} />
        </Tab>
        <Tab key="Draggable Gallery" title="Quản lý banner">
          <BannerScheduler />
        </Tab>
      </Tabs>
    </div>
  )
}
export default ImageCms;

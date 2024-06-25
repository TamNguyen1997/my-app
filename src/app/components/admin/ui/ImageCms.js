"use client"

import { useState } from 'react'
import "./ImageCms.css"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDisclosure, Tabs, Tab } from '@nextui-org/react'
import Dropzone from 'react-dropzone'
import { redirect } from 'next/navigation'
import ImagePicker from './ImagePicker'
import BannerScheduler from './BannerScheduler'

const ImageCms = ({ disableSearch, disableAdd, onImageClick, disableDelete }) => {
  const [reload, setReload] = useState(false)

  const [selectedTab, setSelectedTab] = useState("Gallery")

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [uploadImage, setUploadImage] = useState()
  const [imageDescription, setImageDescription] = useState("")
  const [imageName, setImageName] = useState("")

  const upload = () => {
    const formData = new FormData()
    formData.append('file', uploadImage)
    formData.append('description', imageDescription)
    formData.append('name', imageName)
    formData.append('alt', "alt")
    fetch('/api/images/gallery', {
      method: 'POST',
      body: formData
    }).then(() => {
      setReload(true)
    })
  }

  const setImage = (files) => {
    const file = files[0]
    setUploadImage(file)
    setImageName(file.name)
  }

  if (reload) {
    redirect('/admin/image')
  }

  return (
    <div className="border shadow-md mx-auto p-5">
      <Tabs aria-label="Gallery" selectedKey={selectedTab} onSelectionChange={setSelectedTab}>
        <Tab key="Gallery" title="Gallery">
          <div className='flex w-full flex-wrap md:flex-nowrap gap-4 py-5'>
            {
              disableAdd ? null : (
                <Button color="primary" onClick={onOpen}>Thêm ảnh</Button>
              )
            }
          </div>
          <div>
            <Modal
              size="3xl" scrollBehavior="inside"
              isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalBody>
                      <ModalHeader>Upload ảnh</ModalHeader>
                      <div className='grid grid-cols-2 gap-5'>
                        <div className='flex flex-col gap-3'>
                          <Input aria-label="Tên ảnh" label="Tên ảnh" value={imageName} onValueChange={setImageName}></Input>
                          <Textarea aria-label="Mô tả" label="Mô tả" value={imageDescription} onValueChange={setImageDescription}></Textarea>
                        </div>
                        <Dropzone
                          maxFiles={1}
                          multiple={false}
                          accept="image/*"
                          onDrop={acceptedFiles => setImage(acceptedFiles)}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <section className="container">
                              <div {...getRootProps({ className: 'dropzone' })}>
                                <input {...getInputProps()} />
                                <p className="text-center mx-auto">Kéo thả hoặc click để tải hình</p>
                                <em>(Chỉ chấp nhận *.jpeg and *.png)</em>
                              </div>
                            </section>
                          )}
                        </Dropzone>
                      </div>
                      <div className='pr-4'>
                        {
                          uploadImage ?

                            <img
                              width="100%"
                              height="100%"
                              src={URL.createObjectURL(uploadImage)}
                            />
                            : null
                        }
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" variant="solid" onPress={upload}>
                        Lưu
                      </Button>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>

          <ImagePicker />
        </Tab>
        <Tab key="Draggable Gallery" title="Draggable Gallery">
          <BannerScheduler />
        </Tab>
      </Tabs>
    </div>
  )
}
export default ImageCms;

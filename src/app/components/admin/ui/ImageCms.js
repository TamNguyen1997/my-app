"use client"
import Image from 'next/image'
import { useEffect, useState } from 'react'
import "./ImageCms.css"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from '@nextui-org/react'
import Dropzone from 'react-dropzone'
import { redirect } from 'next/navigation'
import { X } from 'lucide-react'

const ImageCms = ({ disableSearch, disableAdd, onImageClick, disableDelete }) => {
  const [images, setImages] = useState([])
  const [reload, setReload] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  useEffect(() => {
    fetch('/api/images/gallery').then(async res => {
      setImages(await res.json())
      setIsLoading(false)
    })
  }, [])

  const onSearch = (value) => {
    fetch(`/api/images/gallery?name=${value}`).then(async res => {
      setImages(await res.json())
    })
  }

  const upload = (files) => {
    const file = files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('description', "description")
    formData.append('name', file.name)
    formData.append('alt', "alt")
    fetch('/api/images/gallery', {
      method: 'POST',
      body: formData
    }).then(() => {
      setReload(true)
    })
  }

  const deleteImage = async (image) => {
    await fetch(`/api/images/gallery${image}`, {
      method: 'DELETE'
    }).then(() => {
      setReload(true)
    })
  }

  if (reload) {
    redirect('/admin/image')
  }

  if (isLoading) return <Spinner size="lg" className="p-10" />
  return (
    <div className="border shadow-md w-[70%] mx-auto">
      <div className='p-3 flex w-full flex-wrap md:flex-nowrap gap-4'>
        {
          disableSearch ? null : (
            <Input
              className="w-52"
              type="text"
              aria-label="Images"
              placeholder="Tìm kiếm ảnh"
              onValueChange={(value) => onSearch(value)}
            >
            </Input>
          )
        }
        {
          disableAdd ? null : (
            <Button color="primary" onClick={onOpen}>Thêm ảnh</Button>
          )
        }
      </div>
      <div>
        <Modal
          size="sm" scrollBehavior="inside"
          isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody>
                  <ModalHeader>Upload ảnh</ModalHeader>
                  <Dropzone
                    maxFiles={1}
                    multiple={false}
                    accept="image/*"
                    onDrop={acceptedFiles => upload(acceptedFiles)}
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
      </div>

      <div className=" gallery p-5">
        {
          images.map((img) => (
            <div key={img} className="gallery-item hover:opacity-70 image">
              <div className="image">
                <Image
                  src={`/gallery/${img}`}
                  alt={img}
                  width="300"
                  height="300"
                  layout="responsive"
                  className="border shadow-md"
                  onClick={() => onImageClick(img)}
                />
                {
                  disableDelete ? null : (
                    <span className="delete-image animate-vote bg-red-500 rounded-full hover:bg-red-700 delete-button" onClick={() => deleteImage(img)}><X color="#FFFFFF" /></span>
                  )
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ImageCms;

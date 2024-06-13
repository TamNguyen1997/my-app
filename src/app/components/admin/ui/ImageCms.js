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

  const upload = (file) => {
    const formData = new FormData()
    formData.append('file', file[0])
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

      {/* <div className=" gallery p-5">
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
      </div> */}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[30px] p-5">
        {
          [...Array(10)].map((img = "free-images.jpg") => (
            <div key={img} className={`
              group relative flex flex-col rounded hover:opacity-70 cursor-pointer
              shadow-[0px_2px_10px_rgba(0,0,0,0.15)] hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15)]
              hover:-translate-y-2.5 hover:scale-[1.02]
              transition duration-400
            `}>
              <img
                src={`/gallery/free-images.jpg`}
                alt={img}
                className="aspect-[16/10] object-cover rounded-t shrink-0"
                onClick={() => onImageClick(img)}
              />
              {
                disableDelete ? null : (
                  <span className="absolute -top-2.5 -right-2.5 hidden group-hover:block animate-vote bg-red-500 rounded-full hover:bg-red-700" onClick={() => deleteImage(img)}><X color="#FFFFFF" /></span>
                )
              }
              <div className="grow bg-white text-center rounded-b p-5">
                <h6 className="text-[17px] font-bold text-[#212529] break-words mb-2">Lorem Ipsum</h6>
                <p className="text-[15px] text-[#6c757d] break-words">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc quam urna.</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ImageCms;

"use client"
import Image from 'next/image'
import { useEffect, useState, useTransition, useCallback, forwardRef } from 'react'
import "./ImageCms.css"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Textarea, useDisclosure, Tabs, Tab, DateInput, Switch } from '@nextui-org/react'
import Dropzone from 'react-dropzone'
import { redirect } from 'next/navigation'
import { X } from 'lucide-react'
import { parseDate } from "@internationalized/date";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { ImageDraggable } from "./ImageDraggable";
import FlipMove from 'react-flip-move';

const ImageCms = ({ disableSearch, disableAdd, onImageClick, disableDelete }) => {
  const [images, setImages] = useState([])
  const [reload, setReload] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("Gallery")
  const testImages = ["/gallery/3.jpg", "/gallery/free-images.jpg", "/gallery/image-cropped-8x10.jpg"];
  const [draggableList, setDraggableList] = useState(
    [...Array(10)].map((_, index) => ({
      id: index + 1,
      images: [...Array(Math.round(Math.random() * 3))].map(_ => testImages[Math.round(Math.random() * testImages.length)]),
      date: parseDate("2024-04-04"),
      status: 1
    }))
  );
  const [, startTransition] = useTransition();
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

  const deleteImage = async (image) => {
    await fetch(`/api/images/gallery/${image}`, {
      method: 'DELETE'
    }).then(() => {
      setReload(true)
    })
  }

  const moveRow = useCallback((dragIndex, hoverIndex) => {
    startTransition(() => {
      setDraggableList((prevList) =>
        update(prevList, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevList[dragIndex]]
          ]
        })
      );
    });
  }, []);

  if (reload) {
    redirect('/admin/image')
  }

  const deleteImagePos = (blockIndex, imageIndex) => {
    const newState = [...draggableList];
    if(!newState[blockIndex]?.images?.[imageIndex]) return;
    newState[blockIndex].images.splice(imageIndex, 1);
    setDraggableList(newState);
  }

  const FunctionalDraggable = forwardRef((props, ref) => (
    <div ref={ref}>
      <ImageDraggable {...props} />
    </div>
  ));

  if (isLoading) return <Spinner size="lg" className="p-10" />
  return (
    <div className="border shadow-md w-[70%] mx-auto p-5">
      <Tabs aria-label="Gallery" selectedKey={selectedTab} onSelectionChange={setSelectedTab}>
        <Tab key="Gallery" title="Gallery">
          <div className='flex w-full flex-wrap md:flex-nowrap gap-4 py-5'>
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

          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[30px]">
            {
              images?.map?.((img) => (
                <div key={img} className={`
                  group relative flex flex-col rounded hover:opacity-70 cursor-pointer
                  shadow-[0px_2px_10px_rgba(0,0,0,0.15)] hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15)]
                  hover:-translate-y-2.5 hover:scale-[1.02]
                  transition duration-400
                `}>
                  <img
                    src={`/gallery/${img}`}
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
        </Tab>
        <Tab key="Draggable Gallery" title="Draggable Gallery">
          <DndProvider backend={HTML5Backend}>
            <div>
              <FlipMove className="grid md:grid-cols-2 gap-3">
                {
                  draggableList.map((item, index) => (
                    <FunctionalDraggable
                      index={index}
                      key={item.id}
                      itemData={item}
                      moveRow={moveRow}
                      deleteImagePos={deleteImagePos}
                    />
                  ))
                }
              </FlipMove>
            </div>
          </DndProvider>
          <Button color="primary" className="min-w-[120px] rounded-lg mt-3">Lưu</Button>
        </Tab>
      </Tabs>
    </div>
  )
}

export default ImageCms;

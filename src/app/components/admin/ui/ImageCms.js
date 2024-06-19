"use client"
import Image from 'next/image'
import { useEffect, useState, useTransition } from 'react'
import "./ImageCms.css"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Textarea, useDisclosure, Tabs, Tab, DateInput, Switch } from '@nextui-org/react'
import Dropzone from 'react-dropzone'
import { redirect } from 'next/navigation'
import { X } from 'lucide-react'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

const ImageCms = ({ disableSearch, disableAdd, onImageClick, disableDelete }) => {
  const [images, setImages] = useState([])
  const [reload, setReload] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("Gallery")
  const [draggableList, setDraggableList] = useState([...Array(10)].map((_, index) => ({ id: index + 1, image: index % 3 ? "/gallery/3.jpg" : "/gallery/free-images.jpg" })));
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

  if (reload) {
    redirect('/admin/image')
  }

  const onDragEnd = (result) => {
    const sourceId = result.draggableId;
    const destinationId = draggableList[result.destination?.index]?.id;

    startTransition(() => {
      const state = [...draggableList];
      const newState = [...state];
      const sourceIndex = state.findIndex(item => item.id == sourceId);
      const destinationIndex = state.findIndex(item => item.id == destinationId);
      newState[sourceIndex] = state[destinationIndex];
      newState[destinationIndex] = state[sourceIndex];
      setDraggableList(newState);
    });
  }

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
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable-gallery">
              {(droppableProvided, snapshot) => (
                <div
                  ref={droppableProvided.innerRef}
                  {...droppableProvided.droppableProps}
                  className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-3"
                >
                  {
                    draggableList.map((item, index) =>
                      <Draggable
                        key={item.id}
                        draggableId={String(item.id)}
                        index={index}
                      >
                        {
                          (provided) =>
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="grid grid-cols-[1.5fr_1fr_auto] gap-3 border rounded-2xl select-none p-[24px_12px] cursor-grab"
                            >
                              <div className="group relative hover:opacity-70">
                                <img src={item.image} className="aspect-[16/10] h-full object-cover mr-1" />
                                {
                                  disableDelete ? null : (
                                    <span className="absolute -top-2.5 -right-2.5 hidden group-hover:block animate-vote bg-red-500 rounded-full hover:bg-red-700 cursor-pointer" onClick={() => deleteImage(img)}><X color="#FFFFFF" /></span>
                                  )
                                }
                              </div>
                              <div className="aspect-[1/1] text-xl flex items-center justify-center border cursor-pointer hover:bg-[rgba(0,0,0,0.03)] transition">
                                +
                              </div>
                              <div className="flex flex-col space-y-2.5 items-end">
                                <DateInput
                                  className={`
                                    [&>div]:min-h-7
                                    [&>div]:h-7
                                    [&>div]:rounded
                                  `}
                                />
                                <Switch defaultSelected />
                              </div>
                            </div>
                        }
                      </Draggable>
                    )
                  }
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Button color="primary" className="min-w-[120px] rounded-lg mt-3">Lưu</Button>
        </Tab>
      </Tabs>
    </div>
  )
}

export default ImageCms;

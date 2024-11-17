"use client"

import { useEffect, useMemo, useState } from 'react'
import "./ImageCms.css"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Pagination, Select, SelectItem, Spinner } from '@nextui-org/react'
import { X } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'

const ImagePicker = ({ onImageClick, disableDelete, reload, highlights }) => {
  const [images, setImages] = useState([])
  const [type, setType] = useState(new Set([]))
  const [name, setName] = useState()
  const [refresh, setRefresh] = useState(false)
  const [highlightImages, setHighlightImages] = useState(highlights || [])

  const [size, setSize] = useState(10)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [isLoading, setIsLoading] = useState(true)

  const pages = useMemo(() => {
    return total ? Math.ceil(total / size) : 0
  }, [total, size])

  useEffect(() => {
    setIsLoading(true)
    const typeValue = type.values().next().value
    fetch(`/api/images/?name=${name}&type=${typeValue}&size=${size}&page=${page}`).then(async res => {
      const json = await res.json()
      setImages(json.result || [])
      setTotal(json.total || json.total)
      setIsLoading(false)
    })
  }, [type, name, refresh, reload, size, page])

  const deleteImage = async (image) => {
    const res = await fetch(`/api/images/${image.id}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      setRefresh(true)
    } else {
      const json = await res.json()
      toast.error(json.message, { containerId: "image-picker" })
    }
  }

  if (isLoading) return <Spinner className="flex m-auto pt-10 w-full h-full" />
  return (
    <div>
      <ToastContainer containerId="image-picker" />
      <div className='flex w-full flex-wrap md:flex-nowrap gap-4 py-5'>
        <div className='flex gap-3 w-1/2'>
          <Input
            className="w-52"
            type="text"
            aria-label="Images"
            placeholder="Tìm kiếm ảnh"
            value={name}
            isClearable
            onValueChange={(value) => {
              setName(value)
            }}
          >
          </Input>
          <Select
            aria-label='Loại'
            className="w-52"
            defaultSelectedKeys={type}
            onSelectionChange={(value) => {
              setType(value)
            }}
          >
            <SelectItem key="PRODUCT">
              Sản phẩm
            </SelectItem>
            <SelectItem key="BANNER">
              Banner
            </SelectItem>
            <SelectItem key="BLOG">
              Blog
            </SelectItem>
          </Select>
        </div>
      </div>

      <div className="w-full flex pb-3">
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="bordered"
            >
              {size}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            onAction={(key) => setSize(key)}
          >
            <DropdownItem key="10">10</DropdownItem>
            <DropdownItem key="20">20</DropdownItem>
            <DropdownItem key="50">50</DropdownItem>
            <DropdownItem key="100">100</DropdownItem>
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
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[30px]">
        {
          images?.map((img) => (
            <div key={img.id} className={`
                  group relative flex flex-col rounded hover:opacity-70 cursor-pointer
                  shadow-[0px_2px_10px_rgba(0,0,0,0.15)] hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15)]
                  hover:-translate-y-2.5 hover:scale-[1.02]
                  transition duration-400 ${highlightImages.map(item => item.id).includes(img.id) && "border-green-400 border-large"}
                `}>
              <img
                src={`${process.env.NEXT_PUBLIC_FILE_PATH + img.path}`}
                alt={img.alt}
                className="aspect-[16/10] object-cover rounded-t shrink-0"
                onClick={() => {
                  setHighlightImages([...highlightImages, img])
                  onImageClick(img)
                }}
              />
              {
                disableDelete ? null : (
                  <span className="absolute -top-2.5 -right-2.5 hidden group-hover:block animate-vote bg-red-500 rounded-full hover:bg-red-700" onClick={() => deleteImage(img)}><X color="#FFFFFF" /></span>
                )
              }
              <div className="grow bg-white text-center rounded-b p-5">
                <h6 className="text-[17px] font-bold text-[#212529] break-words mb-2">{img.name}</h6>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ImagePicker;

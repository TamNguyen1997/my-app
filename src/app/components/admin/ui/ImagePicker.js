"use client"

import { useEffect, useState } from 'react'
import "./ImageCms.css"
import { Input, Select, SelectItem } from '@nextui-org/react'
import { X } from 'lucide-react'

const ImagePicker = ({ disableSearch, onImageClick, disableDelete, reload }) => {
  const [images, setImages] = useState([])
  const [type, setType] = useState(new Set([]))
  const [name, setName] = useState()
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    const typeValue = type.values().next().value
    fetch(`/api/images/?name=${name}&type=${typeValue}`).then(async res => {
      setImages(await res.json())
    })
  }, [type, name, refresh, reload])

  const deleteImage = async (image) => {
    await fetch(`/api/images/${image.id}`, {
      method: 'DELETE'
    })
    setRefresh(true)
  }

  return (
    <div>
      <div className='flex w-full flex-wrap md:flex-nowrap gap-4 py-5'>
        {
          disableSearch ? null : (
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
          )
        }
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[30px]">
        {
          images?.map?.((img) => (
            <div key={img.id} className={`
                  group relative flex flex-col rounded hover:opacity-70 cursor-pointer
                  shadow-[0px_2px_10px_rgba(0,0,0,0.15)] hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15)]
                  hover:-translate-y-2.5 hover:scale-[1.02]
                  transition duration-400
                `}>
              <img
                src={`${process.env.NEXT_PUBLIC_FILE_PATH + img.path}`}
                alt={img.alt}
                className="aspect-[16/10] object-cover rounded-t shrink-0"
                onClick={() => onImageClick(img)}
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

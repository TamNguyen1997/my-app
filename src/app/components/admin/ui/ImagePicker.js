"use client"

import { useEffect, useState } from 'react'
import "./ImageCms.css"
import { Input, Spinner } from '@nextui-org/react'
import { X } from 'lucide-react'

const ImagePicker = ({ disableSearch, onImageClick, disableDelete }) => {
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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

  const deleteImage = async (image) => {
    await fetch(`/api/images/gallery/${image}`, {
      method: 'DELETE'
    }).then(() => {
      setReload(true)
    })
  }

  if (isLoading) return <Spinner size="lg" className="p-10" />
  return (
    <div>
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
    </div>
  )
}

export default ImagePicker;

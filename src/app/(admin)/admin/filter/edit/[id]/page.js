"use client"

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Switch
} from "@nextui-org/react"
import FilterProduct from "@/app/components/admin/ui/filter/FilterProduct";
import { useParams } from "next/navigation";
import { v4 } from "uuid";
import slugify from "slugify";

const FILTER_TYPE = [
  {
    id: "BRAND",
    name: "Thương hiệu",
  },
  {
    id: "TYPE",
    name: "Loại",
  },
  {
    id: "DIMENSION",
    name: "Kích thước",
  },
  {
    id: "EFFIENCY",
    name: "Hiệu suất",
  },
  {
    id: "WATTAGE",
    name: "Công suất tiêu thụ",
  },
  {
    id: "COLOR",
    name: "Màu sắc",
  },
  {
    id: "BATTERY",
    name: "Thời lượng pin",
  },
]

const Filter = () => {
  const [filter, setFilter] = useState({
    "id": "c4606149-4552-468e-94b6-78ca8d2f00dc",
    "slug": "1be89299-8889-4320-9585-f033b3abba3b",
    "name": "Kích thước",
    "imageUrl": null,
    "active": true,
    "categoryId": "99b1f86c-f6cc-42f1-9907-1979abb52557",
    "brandId": null,
    "targetType": "CATEGORY",
    "filterType": "DIMENSION",
    "createdAt": "2024-08-27T14:22:51.400Z",
    "updatedAt": "2024-08-27T14:22:51.400Z"
  })

  const [categories, setCategories] = useState([
    {
      "id": "99b1f86c-f6cc-42f1-9907-1979abb52557",
      "name": "Khăn",
      "slug": "khan",
      "highlight": true,
      "showOnHeader": false,
      "createdAt": "2024-08-02T10:22:53.854Z",
      "updatedAt": "2024-08-29T03:48:04.825Z",
      "headerOrder": 0,
      "imageId": "7d229e57-ecbc-4a0f-bfc4-f28e1c798134",
      "type": "CATE",
      "cateId": null,
      "image": {
        "id": "7d229e57-ecbc-4a0f-bfc4-f28e1c798134",
        "path": "/gallery/banner/1280x290-banner-khan-giaypng.png",
        "name": "(1280x290) Banner_Khăn giấy.png",
        "alt": "alt",
        "description": "",
        "createdAt": "2024-08-29T03:46:30.987Z",
        "updatedAt": "2024-08-29T03:46:30.987Z",
        "type": "BANNER",
        "active": true,
        "slug": "1280x290-banner-khan-giaypng"
      }
    },
    {
      "id": "e785c826-8bb5-4750-afa7-62cfab7d91e4",
      "name": "Hộp, thùng đựng đồ đa năng",
      "slug": "hop-thung-dung-do-da-nang",
      "highlight": true,
      "showOnHeader": true,
      "createdAt": "2024-07-05T14:56:54.804Z",
      "updatedAt": "2024-08-20T13:45:37.359Z",
      "headerOrder": 0,
      "imageId": "698702e9-a79b-4cd8-8a8d-31b47eccf356",
      "type": "CATE",
      "cateId": null,
      "image": {
        "id": "698702e9-a79b-4cd8-8a8d-31b47eccf356",
        "path": "/gallery/product/banner-thng-ngpng.png",
        "name": "Banner_Thùng đựng.png",
        "alt": "alt",
        "description": "",
        "createdAt": "2024-08-20T13:42:28.660Z",
        "updatedAt": "2024-08-20T13:42:28.660Z",
        "type": "PRODUCT",
        "active": true,
        "slug": "banner-thng-ngpng"
      }
    },
    {
      "id": "0b5e5f33-910c-4e4a-9833-a418f75f02bf",
      "name": "Xe đẩy phục vụ",
      "slug": "xe-day-phuc-vu",
      "highlight": false,
      "showOnHeader": false,
      "createdAt": "2024-07-05T14:56:03.171Z",
      "updatedAt": "2024-08-02T13:55:53.919Z",
      "headerOrder": 0,
      "imageId": "45a97abb-da38-4d73-8ab8-dac9bb07dadf",
      "type": "CATE",
      "cateId": null,
      "image": {
        "id": "45a97abb-da38-4d73-8ab8-dac9bb07dadf",
        "path": "/gallery/product/3jpg.jpeg",
        "name": "3.jpg",
        "alt": "alt",
        "description": "",
        "createdAt": "2024-07-05T20:23:33.322Z",
        "updatedAt": "2024-07-05T20:23:33.322Z",
        "type": "PRODUCT",
        "active": true,
        "slug": "3jpg"
      }
    },
    {
      "id": "c1098d8a-eca3-4482-b05b-28ddebef15cd",
      "name": "Găng tay chuyên dụng",
      "slug": "gang-tay-chuyen-dung",
      "highlight": false,
      "showOnHeader": false,
      "createdAt": "2024-08-02T10:43:42.754Z",
      "updatedAt": "2024-08-02T10:43:42.754Z",
      "headerOrder": 0,
      "imageId": null,
      "type": "CATE",
      "cateId": null,
      "image": null
    },
    {
      "id": "6ea642dd-6c4b-44de-b8ff-d676cabf834d",
      "name": "Dụng cụ vệ sinh",
      "slug": "dung-cu-ve-sinh",
      "highlight": false,
      "showOnHeader": false,
      "createdAt": "2024-08-02T10:33:38.026Z",
      "updatedAt": "2024-08-02T10:33:38.026Z",
      "headerOrder": 0,
      "imageId": null,
      "type": "CATE",
      "cateId": null,
      "image": null
    },
    {
      "id": "f2b13ff2-46f6-4be6-b9c9-97087a036d32",
      "name": "Các thiết bị khác",
      "slug": "cac-thiet-bi-khac",
      "highlight": false,
      "showOnHeader": false,
      "createdAt": "2024-07-05T14:57:20.743Z",
      "updatedAt": "2024-07-05T14:57:20.743Z",
      "headerOrder": 0,
      "imageId": null,
      "type": "CATE",
      "cateId": null,
      "image": null
    },
    {
      "id": "049664cc-0165-4f73-80a3-eaf96a07924b",
      "name": "Dụng cụ vệ sinh kính",
      "slug": "dung-cu-ve-sinh-kinh",
      "highlight": false,
      "showOnHeader": false,
      "createdAt": "2024-07-05T14:56:25.383Z",
      "updatedAt": "2024-07-05T14:56:25.383Z",
      "headerOrder": 0,
      "imageId": null,
      "type": "CATE",
      "cateId": null,
      "image": null
    },
    {
      "id": "770bffeb-1d33-4e06-9db9-fc0db317416e",
      "name": "Máy vệ sinh công nghiệp",
      "slug": "may-ve-sinh-cong-nghiep",
      "highlight": false,
      "showOnHeader": true,
      "createdAt": "2024-07-05T14:55:52.614Z",
      "updatedAt": "2024-07-05T14:55:52.614Z",
      "headerOrder": 0,
      "imageId": null,
      "type": "CATE",
      "cateId": null,
      "image": null
    }
  ])
  const [subCategories, setSubCategories] = useState([
    {
      "id": "e51b6744-5c19-4c7c-88ed-36b5f835265c",
      "name": "Xe đẩy buồng phòng",
      "slug": "xe-day-buong-phong",
      "highlight": false,
      "showOnHeader": true,
      "createdAt": "2024-07-19T01:29:39.353Z",
      "updatedAt": "2024-08-02T18:31:28.989Z",
      "headerOrder": 0,
      "imageId": "45a97abb-da38-4d73-8ab8-dac9bb07dadf",
      "type": "SUB_CATE",
      "cateId": "0b5e5f33-910c-4e4a-9833-a418f75f02bf",
      "image": {
        "id": "45a97abb-da38-4d73-8ab8-dac9bb07dadf",
        "path": "/gallery/product/3jpg.jpeg",
        "name": "3.jpg",
        "alt": "alt",
        "description": "",
        "createdAt": "2024-07-05T20:23:33.322Z",
        "updatedAt": "2024-07-05T20:23:33.322Z",
        "type": "PRODUCT",
        "active": true,
        "slug": "3jpg"
      }
    },
    {
      "id": "daed9262-893f-423f-a3df-54dd97abfe31",
      "name": "Xe đẩy giặt là",
      "slug": "xe-day-giat-la",
      "highlight": false,
      "showOnHeader": true,
      "createdAt": "2024-08-02T18:01:07.841Z",
      "updatedAt": "2024-08-02T18:03:15.437Z",
      "headerOrder": 0,
      "imageId": null,
      "type": "SUB_CATE",
      "cateId": "0b5e5f33-910c-4e4a-9833-a418f75f02bf",
      "image": null
    },
    {
      "id": "ab7069b2-08aa-42f4-b0b3-ad5e330b9b2e",
      "name": "Xe vắt nước lau sàn",
      "slug": "xe-vat-nuoc-lau-san",
      "highlight": false,
      "showOnHeader": true,
      "createdAt": "2024-08-02T13:51:04.572Z",
      "updatedAt": "2024-08-02T18:03:12.795Z",
      "headerOrder": 0,
      "imageId": null,
      "type": "SUB_CATE",
      "cateId": "6ea642dd-6c4b-44de-b8ff-d676cabf834d",
      "image": null
    },
    {
      "id": "e691f7a8-8d62-4912-8f88-5868115ee37a",
      "name": "Máy hút bụi",
      "slug": "may-hut-bui",
      "highlight": false,
      "showOnHeader": true,
      "createdAt": "2024-08-02T10:11:01.667Z",
      "updatedAt": "2024-08-02T18:03:08.626Z",
      "headerOrder": 0,
      "imageId": null,
      "type": "SUB_CATE",
      "cateId": "770bffeb-1d33-4e06-9db9-fc0db317416e",
      "image": null
    },
    {
      "id": "d08ce76a-41ba-4c02-8a89-f91b8703998a",
      "name": "Thùng nhựa đựng đồ",
      "slug": "thung-nhua-dung-do",
      "highlight": false,
      "showOnHeader": true,
      "createdAt": "2024-08-02T10:54:00.697Z",
      "updatedAt": "2024-08-02T18:03:05.383Z",
      "headerOrder": 0,
      "imageId": "45a97abb-da38-4d73-8ab8-dac9bb07dadf",
      "type": "SUB_CATE",
      "cateId": "e785c826-8bb5-4750-afa7-62cfab7d91e4",
      "image": {
        "id": "45a97abb-da38-4d73-8ab8-dac9bb07dadf",
        "path": "/gallery/product/3jpg.jpeg",
        "name": "3.jpg",
        "alt": "alt",
        "description": "",
        "createdAt": "2024-07-05T20:23:33.322Z",
        "updatedAt": "2024-07-05T20:23:33.322Z",
        "type": "PRODUCT",
        "active": true,
        "slug": "3jpg"
      }
    },
    {
      "id": "fa8b2dfe-0e55-49b1-803d-4f8ef0020167",
      "name": "Thanh gạt kính",
      "slug": "thanh-gat-kinh",
      "highlight": false,
      "showOnHeader": true,
      "createdAt": "2024-07-19T01:26:15.071Z",
      "updatedAt": "2024-08-02T18:03:02.089Z",
      "headerOrder": 0,
      "imageId": null,
      "type": "SUB_CATE",
      "cateId": "049664cc-0165-4f73-80a3-eaf96a07924b",
      "image": null
    },
    {
      "id": "1665f21d-2d2f-4c7e-bb29-cd096c55a14c",
      "name": "Khăn lau sàn",
      "slug": "khan-lau-san",
      "highlight": false,
      "showOnHeader": true,
      "createdAt": "2024-08-02T05:32:31.134Z",
      "updatedAt": "2024-08-02T18:02:58.333Z",
      "headerOrder": 0,
      "imageId": null,
      "type": "SUB_CATE",
      "cateId": "f2b13ff2-46f6-4be6-b9c9-97087a036d32",
      "image": null
    },
    {
      "id": "345684af-ae18-446b-8e30-10c0d7ad70a8",
      "name": "Găng tay bảo hộ",
      "slug": "gang-tay-bao-ho",
      "highlight": false,
      "showOnHeader": true,
      "createdAt": "2024-08-02T10:44:38.831Z",
      "updatedAt": "2024-08-02T18:02:50.581Z",
      "headerOrder": 0,
      "imageId": null,
      "type": "SUB_CATE",
      "cateId": "c1098d8a-eca3-4482-b05b-28ddebef15cd",
      "image": null
    },
    {
      "id": "29c369f3-61d0-4a92-b64c-edf5370713ef",
      "name": "Khăn giấy",
      "slug": "khan-giay",
      "highlight": false,
      "showOnHeader": true,
      "createdAt": "2024-08-02T10:23:45.844Z",
      "updatedAt": "2024-08-02T18:02:41.044Z",
      "headerOrder": 0,
      "imageId": null,
      "type": "SUB_CATE",
      "cateId": "99b1f86c-f6cc-42f1-9907-1979abb52557",
      "image": null
    },
    {
      "id": "09dbe7c0-24e9-4c36-a212-6342ad2ab0c0",
      "name": "Thảm chống trượt",
      "slug": "tham-chong-truot",
      "highlight": false,
      "showOnHeader": false,
      "createdAt": "2024-08-02T11:03:38.801Z",
      "updatedAt": "2024-08-02T11:03:38.801Z",
      "headerOrder": 0,
      "imageId": null,
      "type": "SUB_CATE",
      "cateId": "6ea642dd-6c4b-44de-b8ff-d676cabf834d",
      "image": null
    }
  ])
  const [brands, setBrands] = useState([
    {
      "id": "2f32fed6-2130-4b5c-8c84-4a13e70a0ee8",
      "name": "Kleen-tex",
      "slug": "thuong-hieu-kleen-tex",
      "createdAt": "2024-08-01T08:32:51.585Z",
      "updatedAt": "2024-08-01T08:32:51.585Z"
    },
    {
      "id": "4deaa858-3f0a-4fd7-ba4f-ada4498414cf",
      "name": "Kimberly - Clark",
      "slug": "thuong-hieu-kimberly-clark",
      "createdAt": "2024-08-01T08:32:34.129Z",
      "updatedAt": "2024-08-01T08:32:34.129Z"
    },
    {
      "id": "6380cfcb-f577-4061-b2c6-1c550cde1668",
      "name": "Ghibli",
      "slug": "thuong-hieu-ghibli",
      "createdAt": "2024-07-05T07:15:59.742Z",
      "updatedAt": "2024-07-05T07:15:59.742Z"
    },
    {
      "id": "fdb76668-16cb-4d70-a8a5-489daa3cc622",
      "name": "Moerman",
      "slug": "thuong-hieu-moerman",
      "createdAt": "2024-07-05T07:15:45.709Z",
      "updatedAt": "2024-07-05T07:15:45.709Z"
    },
    {
      "id": "378abc43-a170-4f5b-b6bd-f30eb99e5b2f",
      "name": "Rubbermaid",
      "slug": "thuong-hieu-rubbermaid",
      "createdAt": "2024-07-05T07:15:27.615Z",
      "updatedAt": "2024-07-05T07:15:27.615Z"
    },
    {
      "id": "184788d6-203a-4e9f-bcd6-6c80402b510c",
      "name": "Mapa",
      "slug": "thuong-hieu-mapa",
      "createdAt": "2024-07-05T07:15:04.441Z",
      "updatedAt": "2024-07-05T07:15:04.441Z"
    }
  ])

  const { id } = useParams()
  // useEffect(() => {
  //   fetch('/api/categories?type=CATE').then(res => res.json()).then(json => setCategories(json.result))
  //   fetch('/api/brands').then(res => res.json()).then(setBrands)
  //   fetch('/api/categories?type=SUB_CATE').then(res => res.json()).then(json => setSubCategories(json.result))

  //   if (id && id !== 'new') {
  //     fetch(`/api/filters/${id}`).then(res => res.json()).then(setFilter)
  //   }
  // }, [])

  const onSave = async () => {
    const res = filter.id ?
      await fetch(`/api/filters/${filter.id}`, { method: "PUT", body: JSON.stringify(filter) }) :
      await fetch('/api/filters', { method: "POST", body: JSON.stringify(filter) })
    if (res.ok) {
      toast.success("Đã lưu filter")
      if (id === "new") {
        window.location.replace(`/admin/filter/edit/${(await res.json()).id}`)
      }
    } else {
      toast.error("Không thể lưu filter")
    }
  }

  const getTargetSelect = () => {
    switch (filter.targetType) {
      case "SUB_CATEGORY":
        return (<>
          <Select
            label="Target"
            labelPlacement="outside"
            selectedKeys={new Set([filter.categoryId])}
            onSelectionChange={(value) =>
              setFilter(Object.assign({}, filter, { categoryId: value.values().next().value }))}
          >
            {
              subCategories.map((category) => <SelectItem key={category.id}>
                {category.name}
              </SelectItem>)
            }
          </Select>
        </>)
      case "BRAND":
        return (<>
          <Select
            label="Target"
            labelPlacement="outside"
            selectedKeys={new Set([filter.brandId])}
            onSelectionChange={(value) =>
              setFilter(Object.assign({}, filter, { brandId: value.values().next().value }))}
          >
            {
              brands.map((brand) => <SelectItem key={brand.id}>
                {brand.name}
              </SelectItem>)
            }
          </Select>
        </>)
      case "CATEGORY":
      default:
        return (<>
          <Select
            label="Target"
            labelPlacement="outside"
            selectedKeys={new Set([filter.categoryId])}
            onSelectionChange={(value) =>
              setFilter(Object.assign({}, filter, { categoryId: value.values().next().value }))}
          >
            {
              categories.map((category) => <SelectItem key={category.id}>
                {category.name}
              </SelectItem>)
            }
          </Select>
        </>)
    }

  }

  if (id !== "new" && !filter.id) return <></>
  return (
    <>
      <ToastContainer />
      <div className="flex flex-col gap-3">
        {/* <div className="flex gap-2">
          <Input
            type="text"
            label="Tên"
            value={filter.name}
            onValueChange={(value) => setFilter(Object.assign({}, filter, { name: value }))}
            labelPlacement="outside" isRequired />
          <Input
            type="text"
            label="Slug"
            value={id === "new" ? v4() : filter.slug}
            onValueChange={(value) => setFilter(Object.assign({}, filter, { slug: slugify(value, { locale: 'vi' }) }))}
            labelPlacement="outside" isRequired />
          <Select
            label="Đối tượng filter"
            labelPlacement="outside"
            selectedKeys={new Set([filter.targetType || "CATEGORY"])}
            onSelectionChange={(value) =>
              setFilter(Object.assign({}, filter, { targetType: value.values().next().value }))}
          >
            <SelectItem key="BRAND">
              Nhãn hàng
            </SelectItem>
            <SelectItem key="CATEGORY">
              Category
            </SelectItem>
            <SelectItem key="SUB_CATEGORY">
              Sub category
            </SelectItem>
          </Select>
          {getTargetSelect()}
          <Select
            label="Loại filter"
            labelPlacement="outside"
            selectedKeys={new Set([filter.filterType || "BRAND"])}
            onSelectionChange={(value) =>
              setFilter(Object.assign({}, filter, { filterType: value.values().next().value }))}>
            {
              FILTER_TYPE.map(item => <SelectItem key={item.id}>
                {item.name}
              </SelectItem>)
            }
          </Select>
          <div className="items-end flex min-h-full">
            <Button onClick={onSave} color="primary">Lưu</Button>
          </div>
        </div> */}
        <h2 className="font-bold">THUỘC TÍNH</h2>
        <div className="flex flex-col space-y-4 border rounded-2xl shadow-sm max-w-[444px] p-3 pb-5">
          <Input
            type="text"
            label="ID thuộc tính"
            defaultValue={filter.id}
            labelPlacement="outside-left"
            isRequired
            className="[&_label]:grow"
            onValueChange={(value) => setFilter(Object.assign(filter, { id: value }))}
          />

          <Input
            type="text"
            label="Tên thuộc tính"
            defaultValue={filter.name}
            labelPlacement="outside-left"
            isRequired
            className="[&_label]:grow"
            onValueChange={(value) => setFilter(Object.assign(filter, { name: value }))}
          />

          <Switch
            defaultSelected={filter.active}
            className="max-w-full flex-row-reverse [&>span]:text-sm [&>span:last-of-type]:grow mr-[160px]"
            onValueChange={(value) => setFilter(Object.assign(filter, { active: value }))}
          >
            Trạng thái active
          </Switch> 
        </div>

        <h2 className="font-bold mt-10">GIÁ TRỊ THUỘC TÍNH</h2>
        {
          filter.id ? 
            <div className="-mt-2">
              <FilterProduct filterId={filter.id} categories={categories} subCategories={subCategories} brands={brands} filter={filter} />
            </div> : ""
        }
        {/* {
          filter.id ?
            <div className="border rounded-lg shadow-lg p-3">
              <p className="font-bold pt-3">
                Sản phẩm có trong filter
              </p>
              <FilterProduct filterId={filter.id} categories={categories} subCategories={subCategories} brands={brands} />
            </div> : ""
        } */}
      </div>
    </>
  )
}

export default Filter
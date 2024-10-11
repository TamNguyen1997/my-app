"use client"

import { useEffect, useState } from "react";
import {
  Input,
  Spinner,
  Switch
} from "@nextui-org/react"
import FilterProduct from "@/app/components/admin/ui/filter/FilterProduct";
import { useParams } from "next/navigation";
import { v4 } from "uuid";


const Filter = () => {
  const { id } = useParams()
  const [filter, setFilter] = useState({
    id: v4()
  })

  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {

    const getData = async () => {
      await Promise.all([
        fetch('/api/categories?page=1&size=10000').then(res => res.json()).then(json => setCategories(json.result)),
        fetch('/api/brands').then(res => res.json()).then(setBrands)
      ])

      if (id && id !== 'new') {
        await fetch(`/api/filters/${id}/filter-values`).then(res => res.json()).then(json => {
          setFilter(json)
        })
      }
      setIsLoading(false)
    }
    getData()
  }, [id])

  if (isLoading) return <Spinner className="flex m-auto pt-10 w-full h-full" />
  return (
    <>
      <div className="flex flex-col gap-3">
        <h2 className="font-bold">FILTER</h2>
        <div className="flex flex-col space-y-4 border rounded-2xl shadow-sm max-w-[444px] p-3 pb-5">
          <Input
            type="text"
            label="ID filter"
            value={filter.id}
            labelPlacement="outside-left"
            isRequired
            className="[&_label]:grow"
            onValueChange={(value) => setFilter(Object.assign(filter, { id: value }))}
          />

          <Input
            type="text"
            label="Tên filter"
            value={filter.name}
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

        <h2 className="font-bold mt-10">GIÁ TRỊ FILTER</h2>
        {
          id ?
            <div className="-mt-2">
              <FilterProduct
                filterId={id}
                categories={categories.filter(item => item.type === "CATE")}
                subCategories={categories.filter(item => item.type === "SUB_CATE")}
                brands={brands}
                filter={filter}
                setFilter={setFilter} />
            </div> : ""
        }
      </div>
    </>
  )
}

export default Filter
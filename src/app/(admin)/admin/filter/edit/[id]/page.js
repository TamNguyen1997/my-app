"use client"

import { useEffect, useState } from "react";
import {
  Input,
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

  useEffect(() => {
    Promise.all([
      fetch('/api/categories?page=1&size=10000').then(res => res.json()).then(json => setCategories(json.result)),
      fetch('/api/brands').then(res => res.json()).then(setBrands)
    ])

    if (id && id !== 'new') {
      fetch(`/api/filters/${id}/filter-values`).then(res => res.json()).then(json => {
        setFilter(json)
      })
    }
  }, [id])

  if (id !== "new" && !filter.id) return <></>
  return (
    <>
      <div className="flex flex-col gap-3">
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
          id ?
            <div className="-mt-2">
              <FilterProduct filterId={id} categories={categories} subCategories={categories} brands={brands} filter={filter} setFilter={setFilter} />
            </div> : ""
        }
      </div>
    </>
  )
}

export default Filter
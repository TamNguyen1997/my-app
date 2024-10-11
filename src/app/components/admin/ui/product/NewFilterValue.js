import { Button, Input, Switch } from "@nextui-org/react"
import { useForm } from "react-hook-form"
import { v4 } from "uuid"

const NewFilterValue = ({ filterId, filterValues, setFilterValues, categoryId, subCategoryId, brandId, callback }) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  console.log(filterValues)

  const onSave = async (data) => {
    const res = await fetch(`/api/filters/${filterId}/filter-values`, {
      method: "POST", body: JSON.stringify({
        ...data,
        categories: [categoryId],
        brands: [brandId],
        subCategories: [subCategoryId]
      })
    })
    if (res.ok) {
      if (filterValues && setFilterValues) {
        setFilterValues([...filterValues, data])
        callback(data.id)
      }
    } else {
      console(res.status)
    }
  }

  return <>
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSave)}>
      <div className="flex flex-col space-y-4 border rounded-2xl shadow-sm max-w-[444px] p-3 pb-5 gap-3">
        <div>
          <Input
            type="text"
            label="ID thuộc tính"
            labelPlacement="outside"
            isRequired
            className="[&_label]:grow"
            {...register("id", { value: v4(), required: true })}
          />
          {errors.id && <span className="text-red-600 text-small">Bạn phải điền ID</span>}
        </div>

        <div>
          <Input
            type="text"
            label="Tên tiếng việt"
            labelPlacement="outside"
            isRequired
            className="[&_label]:grow"
            {...register("value", { required: true })}
          />
          {errors.value && <span className="text-red-600 text-small">Bạn phải điền tên</span>}
        </div>

        <div>
          <Input
            type="text"
            label="Slug"
            labelPlacement="outside"
            isRequired
            className="[&_label]:grow"
            {...register("slug", { required: true })}
          />
          {errors.slug && <span className="text-red-600 text-small">Bạn phải slug</span>}
        </div>
        <Switch
          className="max-w-full flex-row-reverse [&>span]:text-sm [&>span:last-of-type]:grow mr-[160px]"
          {...register("active", { value: true })}
        >
          Trạng thái active
        </Switch>
      </div>
      <Button type="submit" color="primary" className="w-10">Lưu</Button>
    </form>
  </>
}

export default NewFilterValue
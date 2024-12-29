import { Button, Input, Switch } from "@nextui-org/react"
import { useForm } from "react-hook-form"
import { toast, ToastContainer } from "react-toastify"
import { v4 } from "uuid"

const NewFilter = ({ filters, setFilters, callback }) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSave = async (data) => {
    const res = await fetch("/api/filters", { method: "POST", body: JSON.stringify(data) })
    if (res.ok) {
      toast.success("Đã thêm filter")
      if (filters && setFilters) {
        setFilters([...filters, data])
        callback(data.id)
      }
    } else {
      toast.error("Không thể thêm filter")
    }
  }

  return <>
    <ToastContainer />
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSave)}>
      <div className="flex flex-col space-y-4 border rounded-2xl shadow-sm max-w-[444px] p-3 pb-5 gap-3">
        <div>
          <Input
            type="text"
            label="ID thuộc tính"
            labelPlacement="outside"
            isRequired
            className="[&_label]:grow"
            {...register("id", { value: v4() })}
          />
          {errors.id && <span className="text-red-600 text-small">Bạn phải điền ID</span>}
        </div>

        <div>
          <Input
            type="text"
            label="Tên thuộc tính"
            labelPlacement="outside"
            isRequired
            className="[&_label]:grow"
            {...register("name")}
          />
          {errors.name && <span className="text-red-600 text-small">Bạn phải điền tên</span>}
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

export default NewFilter
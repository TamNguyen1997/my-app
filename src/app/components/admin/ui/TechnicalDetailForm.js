import { Button, Input } from "@nextui-org/react"
import { Plus, Trash2 } from "lucide-react"
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";

const TechnicalDetailForm = ({ product }) => {
  const {
    handleSubmit
  } = useForm()

  const [technicalDetails, setTechnicalDetails] = useState([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${product.id}/technical-details`).then(res => res.json()).then(json => setTechnicalDetails(json))
  }, [])

  const onValueChange = (value, id) => {
    technicalDetails.forEach(item => {
      if (item.id === id) item.key = value
    })
  }

  const onKeyChange = (value, id) => {
    technicalDetails.forEach(item => {
      if (item.id === id) item.value = value
    })
  }

  const handleTechnicalDetailSubmit = () => {
    fetch(`/api/products/${product.id}/technical-details/`, {
      method: "POST",
      body: JSON.stringify(technicalDetails)
    })
    setRefresh(true)
  }

  const addEmptyTechnicalDetail = () => {
    setTechnicalDetails([...technicalDetails, { id: v4(), productId: product.id }])
  }

  if (refresh) redirect('/admin')

  return (
    <>
      <form onSubmit={handleSubmit(handleTechnicalDetailSubmit)}>
        <div className="flex">
          <div>
            {
              technicalDetails.map(detail => {
                return <div key={detail.id} className="flex">
                  <Input
                    type="text"
                    defaultValue={detail.key}
                    isRequired
                    className="p-3"
                    onValueChange={(value) => onKeyChange(value, detail.id)}
                  />
                  <Input
                    type="text"
                    defaultValue={detail.value}
                    isRequired
                    className="p-3"
                    onValueChange={(value) => onValueChange(value, detail.id)}
                  />
                  <div className="relative flex items-center gap-2">
                    <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
                      <Trash2 onClick={() => setTechnicalDetails(technicalDetails.filter(item => item.id !== detail.id))} />
                    </span>
                  </div>
                </div>
              })
            }
          </div>
          <div className="pl-3 pt-4">
            <Button color="default" variant="ghost" size="sm" onPress={addEmptyTechnicalDetail}> <Plus></Plus> </Button>
          </div>
        </div>
        <div className="p-3">
          <Button color="primary" type="submit">Lưu</Button>
        </div>
      </form>
    </>
  )
}

export default TechnicalDetailForm
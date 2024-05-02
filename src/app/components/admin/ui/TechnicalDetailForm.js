import { Button, Input } from "@nextui-org/react"
import { Plus, Trash2 } from "lucide-react"
import { useContext } from "react";
import { v4 } from "uuid";
import { ProductContext } from "../ProductCms";

const TechnicalDetailForm = () => {
  const [selectedProduct, setSelectedProduct] = useContext(ProductContext)
  if (!selectedProduct.technicalDetails) return <></>
  
  const onChange = (value, id, property) => {
    let technicalDetails = selectedProduct.technicalDetails
    technicalDetails.forEach(item => {
      if (item.id === id) item[property] = value
    })
    setSelectedProduct(
      Object.assign(
        {},
        selectedProduct,
        { technicalDetails: technicalDetails }
      ))
  }

  const addEmptyTechnicalDetail = () => {
    setSelectedProduct(
      Object.assign(
        {},
        selectedProduct,
        { technicalDetails: [...selectedProduct.technicalDetails, { id: v4() }] }
      ))
  }

  const removeTechnicalDetail = (id) => {
    setSelectedProduct(
      Object.assign(
        {},
        selectedProduct,
        { technicalDetails: selectedProduct.technicalDetails.filter(detail => detail.id !== id) }))
  }

  return (
    <>
      <div className="flex">
        <div>
          {
            selectedProduct.technicalDetails.map(detail => {
              return <div key={detail.id} className="flex">
                <Input
                  type="text"
                  label="Định danh"
                  aria-label="Định danh"
                  defaultValue={detail.key}
                  isRequired
                  className="p-3"
                  onValueChange={(value) => onChange(value, detail.id, "key")}
                />
                <Input
                  type="text"
                  label="Giá trị"
                  aria-label="Giá trị"
                  defaultValue={detail.value}
                  isRequired
                  className="p-3"
                  onValueChange={(value) => onChange(value, detail.id, "value")}
                />
                <div className="relative flex items-center gap-2">
                  <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
                    <Trash2 onClick={() => removeTechnicalDetail(detail.id)} />
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
    </>
  )
}

export default TechnicalDetailForm
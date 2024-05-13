import { Button, Input } from "@nextui-org/react"
import { EditIcon, Plus, Trash2 } from "lucide-react"
import { useContext } from "react";
import { v4 } from "uuid";
import { ProductContext } from "../ProductCms";

const TechnicalDetailForm = () => {
  const [selectedProduct, setSelectedProduct] = useContext(ProductContext)
  if (!selectedProduct.saleDetails) return <></>

  const addEmptySaleDetail = () => {
    setSelectedProduct(
      Object.assign(
        {},
        selectedProduct,
        { saleDetails: [...selectedProduct.saleDetails, { id: v4(), productId: selectedProduct.id }] }
      ))
  }

  const addDetail = (parentId) => {
    let updateDetails = selectedProduct.saleDetails
    updateDetails.push({ id: v4(), parentSaleDetailId: parentId, productId: selectedProduct.id })
    setSelectedProduct(Object.assign({}, selectedProduct, { saleDetails: updateDetails }))
  }

  const removeDetail = (id) => {
    let updateDetails = selectedProduct.saleDetails.filter(detail => detail.id !== id)
    setSelectedProduct(Object.assign({}, selectedProduct, { saleDetails: updateDetails }))
  }
  const handleDetailChange = (value, id, key) => {
    let updateDetails = selectedProduct.saleDetails
    updateDetails.forEach(detail => {
      if (detail.id === id) {
        if (detail.id === id) detail[key] = value
      }
    })
    setSelectedProduct(Object.assign({}, selectedProduct, { saleDetails: updateDetails }))
  }

  return (
    <>
      <div>
        <Button color="default" variant="ghost" size="sm" className="float-right" onPress={addEmptySaleDetail}> <Plus></Plus> </Button>
      </div>
      {
        selectedProduct.saleDetails.filter(detail => !detail.parentSaleDetailId).map(detail => {
          return <div className="flex" key={detail.id}>
            <div className="w-11/12">
              <div className="flex">
                <Input
                  type="text"
                  label="Định danh"
                  defaultValue={detail.key}
                  aria-label={detail.key}
                  className="p-3"
                  onValueChange={value => handleDetailChange(value, detail.id, "key")}
                  isRequired
                />
                <Input
                  type="text"
                  label="Giá trị"
                  defaultValue={detail.value}
                  aria-label={detail.value}
                  onValueChange={value => handleDetailChange(value, detail.id, "value")}
                  isRequired
                  className="p-3"
                />
              </div>
              <div className="pl-10">
                <span className="text-lg text-default-500 cursor-pointer active:opacity-50">
                  <Plus onClick={() => addDetail(detail.id)} />
                </span>
                {
                  selectedProduct.saleDetails.filter(sDetail => sDetail.parentSaleDetailId === detail.id).map(sDetail => {
                    return <div key={sDetail.id} className="flex">
                      <Input type="text"
                        label="Định danh"
                        defaultValue={sDetail.key}
                        aria-label="Định danh"
                        className="p-3"
                        isRequired
                        onValueChange={(value) => { handleDetailChange(value, sDetail.id, "key") }}
                      />
                      <Input type="text"
                        defaultValue={sDetail.value}
                        label="Giá trị"
                        aria-label="Giá trị"
                        className="p-3"
                        isRequired
                        onValueChange={(value) => { handleDetailChange(value, sDetail.id, "value") }}
                      />
                      <Input type="number"
                        label="Giá"
                        defaultValue={sDetail.price}
                        aria-label="Giá"
                        className="p-3"
                        onValueChange={(value) => { handleDetailChange(parseInt(value), sDetail.id, "price") }}
                      />

                      <div className="flex items-center gap-2">
                        <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
                          <Trash2 onClick={() => removeDetail(sDetail.id)} />
                        </span>
                      </div>

                    </div>
                  })
                }

              </div>
            </div>

            <div className="pt-3 pl-3">
              <div className="text-lg text-danger cursor-pointer active:opacity-50 pl-5 float-right">
                <Trash2 onClick={() => removeDetail(detail.id)} />
              </div>
            </div>
          </div>
        })
      }
    </>
  )
}

export default TechnicalDetailForm
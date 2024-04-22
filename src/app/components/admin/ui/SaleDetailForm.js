import { Button, Input } from "@nextui-org/react"
import { Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";

const TechnicalDetailForm = ({ product }) => {
  const {
    handleSubmit
  } = useForm()

  const [saleDetails, setSaleDetails] = useState([])

  useEffect(() => {
    fetch(`/api/products/${product.id}/sale-details`).then(res => res.json()).then(json => setSaleDetails(json))
  }, [])

  const addEmptySecondaryDetail = (e) => {
    const id = e.target.getAttribute("value")
    let updateDetails = [...saleDetails]
    updateDetails.forEach(detail => {
      if (detail.id === id) detail.secondary_sale_detail.push({ id: v4(), primarySaleDetailId: id })
    })
    setSaleDetails(updateDetails)
  }

  const removeSecondaryDetail = (primaryId, secondaryId) => {
    let updateDetails = [...saleDetails]
    updateDetails.forEach(detail => {
      if (detail.id === primaryId) {
        detail.secondary_sale_detail = detail.secondary_sale_detail.filter(sDetail => sDetail.id !== secondaryId)
      }
    })
    setSaleDetails(updateDetails)
  }

  const handleSecondaryChange = (value, primaryId, secondaryId, key) => {
    let updateDetails = [...saleDetails]
    updateDetails.forEach(detail => {
      if (detail.id === primaryId) {
        detail.secondary_sale_detail.forEach(sDetail => {
          if (sDetail.id === secondaryId) sDetail[key] = value
        })
      }
    })

    setSaleDetails(updateDetails)
  }

  const submit = async () => {
    await fetch(`/api/products/${product.id}/sale-details/`, { method: "POST", body: JSON.stringify(saleDetails) })
  }

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        {
          saleDetails.map(detail => {
            return <div className="flex" key={detail.id}>
              <div className="w-11/12">
                <div className="rounded shadow-md">
                  <div className="flex">
                    <Input
                      type="text"
                      label="Định danh"
                      defaultValue={detail.key}
                      aria-label={detail.key}
                      className="p-3"
                      isRequired
                    />
                    <Input
                      type="text"
                      label="Giá trị"
                      defaultValue={detail.value}
                      aria-label={detail.value}
                      isRequired
                      className="p-3"
                    />
                  </div>
                  <div className="pl-10">
                    {
                      detail.secondary_sale_detail.map(sDetail => {
                        return <div key={sDetail.id} className="flex">
                          <Input type="text"
                            label="Định danh"
                            defaultValue={sDetail.key}
                            aria-label="Định danh"
                            className="p-3"
                            isRequired
                            onValueChange={(value) => { handleSecondaryChange(value, detail.id, sDetail.id, "key") }}
                          />
                          <Input type="text"
                            label="Giá trị"
                            defaultValue={sDetail.value}
                            aria-label="Giá trị"
                            className="p-3"
                            isRequired
                            onValueChange={(value) => { handleSecondaryChange(value, detail.id, sDetail.id, "value") }}
                          />
                          <Input type="number"
                            label="Giá"
                            defaultValue={sDetail.price}
                            aria-label="Giá"
                            className="p-3"
                            onValueChange={(value) => { handleSecondaryChange(parseInt(value), detail.id, sDetail.id, "price") }}
                          />

                          <div className="flex items-center gap-2">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50 pl-5">
                              <Trash2 onClick={() => removeSecondaryDetail(detail.id, sDetail.id)} />
                            </span>
                          </div>

                        </div>
                      })
                    }

                  </div>
                </div>
              </div>
              <div className="p-3">
                <Button color="default" variant="ghost" size="sm" onPress={addEmptySecondaryDetail} value={detail.id}> <Plus></Plus> </Button>
              </div>
            </div>
          })
        }

        <div className="p-3">
          <Button color="primary" type="submit">Lưu</Button>
        </div>
      </form>
    </>
  )
}

export default TechnicalDetailForm
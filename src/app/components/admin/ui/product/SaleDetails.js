import { Button, Input, Select, SelectItem } from "@nextui-org/react"
import { Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { v4 } from "uuid"

const ColorSelect = ({ detail, setDetails, details }) => {
  return (<>
    <Select
      label="Màu"
      isRequired
      placeholder="Chọn màu cho sản phẩm"
      defaultSelectedKeys={new Set([detail.value])}
      onSelectionChange={(value) => setDetails(handleDetailChange(details, detail.id, { value: value.values().next().value }))}
    >
      <SelectItem key="#ffffff" textValue="Trắng">
        <div className="flex gap-2 items-center">
          <div className="rounded-full bg-white w-8 h-8"></div>
          <p>Trắng</p>
        </div>
      </SelectItem>
      <SelectItem key="#4b5563" textValue="Xám">
        <div className="flex gap-2 items-center">
          <div className="rounded-full bg-gray-600 w-8 h-8"></div>
          <p>Xám</p>
        </div>
      </SelectItem>
      <SelectItem key="#1e3a8a" textValue="Xanh">
        <div className="flex gap-2 items-center">
          <div className="rounded-full bg-blue-900 w-8 h-8"></div>
          <p>Xanh</p>
        </div>
      </SelectItem>
      <SelectItem key="#facc15" textValue="Vàng">
        <div className="flex gap-2 items-center">
          <div className="rounded-full bg-yellow-400 w-8 h-8"></div>
          <p>Vàng</p>
        </div>
      </SelectItem>
      <SelectItem key="#dc2626" textValue="Đỏ">
        <div className="flex gap-2 items-center">
          <div className="rounded-full bg-red-600 w-8 h-8"></div>
          <p>Đỏ</p>
        </div>
      </SelectItem>
      <SelectItem key="#000000" textValue="Đen">
        <div className="flex gap-2 items-center">
          <div className="rounded-full bg-black w-8 h-8"></div>
          <p>Đen</p>
        </div>
      </SelectItem>
    </Select>
  </>)
}

const removeItem = (id, details) => {
  return details.filter(item => item.id != id)
}

const handleDetailChange = (saleDetails, id, value) => {
  let updateDetails = saleDetails
  updateDetails.forEach(detail => {
    if (detail.id === id) {
      detail = Object.assign(detail, value)
    }
  })
  return [...updateDetails]
}

const SecondarySaleDetails = ({ saleDetails, setSaleDetails, saleDetail }) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        {
          saleDetails.filter(item => item.saleDetailId === saleDetail.id).map(detail => {
            return <div className="flex" key={detail.id}>
              <div className="w-11/12">
                <div className="flex gap-2">
                  <Select
                    label="Loại"
                    defaultSelectedKeys={new Set([detail.type])}
                    onSelectionChange={(value) => setSaleDetails(handleDetailChange(saleDetails, detail.id, { type: value.values().next().value }))}
                  >
                    <SelectItem key="COLOR">
                      Màu
                    </SelectItem>
                    <SelectItem key="TEXT">
                      Text
                    </SelectItem>
                  </Select>
                  {
                    detail.type === "TEXT" ?
                      <Input
                        type="text"
                        label="Option"
                        defaultValue={detail.value}
                        aria-label={detail.value}
                        onValueChange={value => setSaleDetails(handleDetailChange(saleDetails, detail.id, { value: value }))}
                        isRequired
                      />
                      : <ColorSelect detail={detail} setDetails={setSaleDetails} details={saleDetails} />
                  }

                  <Input type="number"
                    label="Giá"
                    defaultValue={detail.price}
                    aria-label="Giá"
                    min={0}
                    max={999999999}
                    onValueChange={(value) => setSaleDetails(handleDetailChange(saleDetails, detail.id, { price: parseInt(value) }))}
                  />
                </div>
              </div>

              <div className="pt-3 pl-3">
                <div className="text-lg text-danger cursor-pointer active:opacity-50 pl-5 float-right">
                  <Trash2 onClick={() => setSaleDetails(removeItem(detail.id, saleDetails))} />
                </div>
              </div>
            </div>
          })
        }
      </div>
    </>
  )

}

const SaleDetails = ({ product }) => {
  const [saleDetails, setSaleDetails] = useState([])

  useEffect(() => {
    fetch(`/api/products/${product.id}/sale-details`).then(res => res.json()).then(setSaleDetails)
  }, [product])

  const addEmptySaleDetail = () => {
    setSaleDetails([...saleDetails, { id: v4(), productId: product.id, type: "TEXT" }])
  }

  const onSave = async () => {
    const res = await fetch(`/api/products/${product.id}/sale-details`, {
      method: "POST",
      body: JSON.stringify({ saleDetails: saleDetails })
    })

    if (res.ok) {
      toast.success("Đã lưu thông số kĩ thuật")
    } else {
      toast.error("Không thể lưu thông số kĩ thuật")
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="p-2">
        <Button color="default" variant="ghost" size="sm" className="float-right" onPress={addEmptySaleDetail}>Thêm thông số</Button>
      </div>
      <div className="flex flex-col gap-2 p-2">
        {
          saleDetails.filter(item => !item.saleDetailId).map(detail => {
            return <div key={detail.id}>
              <div className="flex" >
                <div className="w-11/12">
                  <div className="flex gap-2">
                    <Select
                      label="Loại"
                      defaultSelectedKeys={new Set([detail.type])}
                      onSelectionChange={(value) => setSaleDetails(handleDetailChange(saleDetails, detail.id, { type: value.values().next().value }))}
                    >
                      <SelectItem key="COLOR">
                        Màu
                      </SelectItem>
                      <SelectItem key="TEXT">
                        Text
                      </SelectItem>
                    </Select>
                    {
                      detail.type === "TEXT" ?
                        <Input
                          type="text"
                          label="Option"
                          defaultValue={detail.value}
                          aria-label={detail.value}
                          onValueChange={value => setSaleDetails(handleDetailChange(saleDetails, detail.id, { value: value }))}
                          isRequired
                        />
                        : <ColorSelect detail={detail} setDetails={setSaleDetails} details={saleDetails} />
                    }

                    <Input type="number"
                      label="Giá"
                      defaultValue={detail.price}
                      aria-label="Giá"
                      min={0}
                      max={999999999}
                      onValueChange={(value) => setSaleDetails(handleDetailChange(saleDetails, detail.id, { price: parseInt(value) }))}
                    />
                    <div className="flex text-center items-center">
                      <Button onClick={() => {
                        setSaleDetails([...saleDetails, { id: v4(), type: "TEXT", saleDetailId: detail.id, productId: product.id }])
                      }}>
                        Thêm chi tiết
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-3 pl-3">
                  <div className="text-lg text-danger cursor-pointer active:opacity-50 pl-5 float-right">
                    <Trash2 onClick={() => removeDetail(detail.id)} />
                  </div>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-1">
                <SecondarySaleDetails
                  saleDetail={detail}
                  saleDetails={saleDetails}
                  setSaleDetails={setSaleDetails} />
              </div>
            </div>
          })
        }
        <div className="pl-3 pt-1">
          <Button color="primary" onClick={onSave} className="w-24 float-right">Lưu</Button>
        </div>
      </div>
    </>
  )
}

export default SaleDetails
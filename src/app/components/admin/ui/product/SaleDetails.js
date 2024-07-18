import { Button, Input, Select, SelectItem } from "@nextui-org/react"
import { Trash2 } from "lucide-react"
import { v4 } from "uuid"

const ColorSelect = ({ detail, handleDetailChange }) => {
  return (<>
    <Select
      label="Màu"
      placeholder="Chọn màu cho sản phẩm"
      defaultSelectedKeys={new Set([detail.value])}
      onSelectionChange={(value) => handleDetailChange(detail.id, { value: value.values().next().value })}
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

const SecondarySaleDetails = ({ saleDetails, setSaleDetails, saleDetail }) => {
  const removeDetail = (id) => {

    saleDetails.forEach(detail => {
      if (detail.id === saleDetail.id) {
        detail.secondarySaleDetails = detail.secondarySaleDetails.filter(detail => detail.id !== id)
      }
    })

    setSaleDetails([...saleDetails])
  }

  const handleDetailChange = (id, value) => {
    saleDetails.forEach(detail => {
      if (detail.id === saleDetail.id) {

        detail.secondarySaleDetails.forEach(sDetail => {
          if (sDetail.id === id) {
            sDetail = Object.assign(sDetail, value)
          }
        })
      }
    })

    setSaleDetails([...saleDetails])
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {
          saleDetail.secondarySaleDetails.map(detail => {
            return <div className="flex" key={detail.id}>
              <div className="w-11/12">
                <div className="flex gap-2">
                  <Select
                    label="Loại"
                    defaultSelectedKeys={new Set([detail.type])}
                    onSelectionChange={(value) => handleDetailChange(detail.id, { type: value.values().next().value })}
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
                        onValueChange={value => handleDetailChange(detail.id, { value: value })}
                        isRequired
                      />
                      : <ColorSelect detail={detail} handleDetailChange={handleDetailChange} />
                  }

                  <Input type="number"
                    label="Giá"
                    defaultValue={detail.price}
                    aria-label="Giá"
                    min={0}
                    max={999999999}
                    onValueChange={(value) => { handleDetailChange(detail.id, { price: parseInt(value) }) }}
                  />
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
      </div>
    </>
  )

}

const SaleDetails = ({ saleDetails, setSaleDetails, productId }) => {
  const addEmptySaleDetail = () => {
    setSaleDetails([...saleDetails, { id: v4(), productId: productId, type: "TEXT", secondarySaleDetails: [] }])
  }

  const removeDetail = (id) => {
    setSaleDetails(saleDetails.filter(detail => detail.id !== id))
  }

  const handleDetailChange = (id, value) => {
    let updateDetails = saleDetails
    updateDetails.forEach(detail => {
      if (detail.id === id) {
        detail = Object.assign(detail, value)
      }
    })
    setSaleDetails([...updateDetails])
  }

  return (
    <>
      <div className="p-2">
        <Button color="default" variant="ghost" size="sm" className="float-right" onPress={addEmptySaleDetail}>Thêm thông số</Button>
      </div>
      <div className="flex flex-col gap-2">
        {
          saleDetails.map(detail => {
            return <div key={detail.id}>
              <div className="flex" >
                <div className="w-11/12">
                  <div className="flex gap-2">
                    <Select
                      label="Loại"
                      defaultSelectedKeys={new Set([detail.type])}
                      onSelectionChange={(value) => handleDetailChange(detail.id, { type: value.values().next().value })}
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
                          onValueChange={value => handleDetailChange(detail.id, { value: value })}
                          isRequired
                        />
                        : <ColorSelect detail={detail} handleDetailChange={handleDetailChange} />
                    }

                    <Input type="number"
                      label="Giá"
                      defaultValue={detail.price}
                      aria-label="Giá"
                      min={0}
                      max={999999999}
                      onValueChange={(value) => { handleDetailChange(detail.id, { price: parseInt(value) }) }}
                    />
                    <div className="flex text-center items-center">
                      <Button onClick={() => {
                        saleDetails.forEach(d => {
                          if (d.id === detail.id) {
                            d.secondarySaleDetails = [...d.secondarySaleDetails, { id: v4(), type: "TEXT", saleDetailId: detail.id }]
                          }
                        })

                        setSaleDetails([...saleDetails])
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
      </div>
    </>
  )
}

export default SaleDetails
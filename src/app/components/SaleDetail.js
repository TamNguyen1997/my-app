import { Button, Input } from "@nextui-org/react"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"

const COLOR_VARIANT = {
  "#ffffff": "bg-[#ffffff]",
  "#4b5563": "bg-[#4b5563]",
  "#1e3a8a": "bg-[#1e3a8a]",
  "#facc15": "bg-[#facc15]",
  "#dc2626": "bg-[#dc2626]",
  "#000000": "bg-[#000000]",
}

const SaleDetail = ({ saleDetails, product }) => {
  const [selectedDetail, setSelectedDetail] = useState(saleDetails[0])

  const onPrimarySelect = (e) => {
    const buttonValue = e.target.getAttribute("value")
    setSelectedDetail(saleDetails.find(detail => detail.id === buttonValue))
  }

  const onColorSelect = (id) => {
    setSelectedDetail(saleDetails.find(detail => detail.id === id))
  }

  const getVariant = (id, selected) => {
    if (id === selected) return "solid"
    return "ghost"
  }

  const getColor = (detail, selected) => {
    const className = `rounded-full ${COLOR_VARIANT[detail.value]} w-7 h-7 border-[#e3e3e3] border hover:opacity-50 hover:border-4 hover:border-blue-500`
    if (detail.id === selected) return `${className} border-4 border-blue-500`
    return className
  }

  return (<>
    <div className="">
      <p className="text-[30px] font-extrabold m-[10px_0_18px]">{product.name}</p>
      <p className="text-[32px] font-medium text-[#b61a2d] mb-2.5">{selectedDetail?.price}</p>
      <p className="text-sm mb-[30px]">Đã bao gồm VAT, chưa bao gồm phí giao hàng</p>
      <p className="text-sm mb-2.5">Giao hàng trong vòng 1-3 ngày</p>

      <div className="flex flex-col gap-3">
        <div className="flex gap-2 flex-wrap">
          {
            saleDetails.filter(detail => detail.type === "COLOR").map(detail => {
              return <div key={detail.id}>
                {
                  <div className={getColor(detail, selectedDetail.id)} onClick={() => onColorSelect(detail.id)}></div>
                }
              </div>
            })
          }

        </div>
        {
          saleDetails.filter(detail => detail.type === "TEXT").map(detail => {
            return <div key={detail.id}>
              <Button color="default"
                variant={getVariant(detail.id, selectedDetail.id)}
                onPress={onPrimarySelect}
                value={detail.id}>{detail.value}</Button>
            </div>
          })
        }

        <Input type="number" label="Số lượng"
          aria-label="Số lượng" defaultValue={0}
          min={0} max={999}></Input>
        <div className="flex lg:flex-nowrap flex-wrap">
          <div className="pr-3 pb-3">
            <Button color="primary" fullWidth isDisabled={!selectedDetail?.price}>Mua ngay <ShoppingCart /></Button>
          </div>
          <div className="pb-3">
            <Button color="primary" fullWidth isDisabled={!selectedDetail?.price}>Thêm vào giỏ hàng</Button>
          </div>
        </div>
      </div>
    </div>

  </>)
}

export default SaleDetail
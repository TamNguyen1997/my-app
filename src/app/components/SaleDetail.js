import { Button } from "@nextui-org/react"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"

const SaleDetail = ({ saleDetails }) => {
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
    const className = `rounded-full bg-[${detail.value}] w-8 h-8 border-[#e3e3e3] border hover:opacity-50 hover:border-4 hover:border-blue-500`
    if (detail.id === selected) return `${className} border-4 border-blue-500`
    return className
  }

  return (<>
    <p className="text-[32px] font-medium text-[#b61a2d] mb-2.5">{selectedDetail?.price}</p>
    <p className="text-sm mb-[30px]">Đã bao gồm VAT, chưa bao gồm phí giao hàng</p>
    <p className="text-sm mb-2.5">Giao hàng trong vòng 1-3 ngày</p>

    <div className="flex flex-col gap-3">
      <div className="flex gap-2 flex-wrap">
        {
          saleDetails.map(detail => {
            return <div key={detail.id}>
              {
                detail.type === "COLOR" ?
                  <>
                    <div className={getColor(detail, selectedDetail.id)} onClick={() => onColorSelect(detail.id)}></div>
                  </>
                  : <Button color="default"
                    variant={getVariant(detail.id, selectedDetail.id)}
                    onPress={onPrimarySelect}
                    value={detail.id}>{detail.value}</Button>
              }

            </div>
          })
        }
      </div>

      <div className="flex pb-3">
        <div className="pr-3">
          <Button color="primary" fullWidth isDisabled={!selectedDetail?.price}>Mua ngay <ShoppingCart /></Button>
        </div>
        <div className="pr-3">
          <Button color="primary" fullWidth isDisabled={!selectedDetail?.price}>Thêm vào giỏ hàng</Button>
        </div>
      </div>
    </div>

  </>)
}

export default SaleDetail
import { Button, Input } from "@nextui-org/react"
import { ShoppingCart } from "lucide-react"
import { useContext, useState } from "react"
import { CartContext } from "@/context/CartProvider";

const COLOR_VARIANT = {
  "#ffffff": "bg-[#ffffff]",
  "#4b5563": "bg-[#4b5563]",
  "#1e3a8a": "bg-[#1e3a8a]",
  "#facc15": "bg-[#facc15]",
  "#dc2626": "bg-[#dc2626]",
  "#000000": "bg-[#000000]",
}

const SaleDetail = ({ saleDetails, product }) => {
  const [selectedDetail, setSelectedDetail] = useState(saleDetails[0] || {})
  const [selectedSecondaryDetail, setSelectedSecondaryDetail] = useState({})
  const [quantity, setQuantity] = useState(1)

  const { addItemToCart } = useContext(CartContext)

  const onPrimarySelect = (key) => {
    setSelectedDetail(saleDetails.find(detail => detail.id === key))
  }

  const onSecondarySelect = (key) => {
    setSelectedSecondaryDetail(selectedDetail.secondarySaleDetails.find(detail => detail.id === key))
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

  const getPrice = () => {
    if (selectedSecondaryDetail.price) return selectedSecondaryDetail.price.toLocaleString()
    if (!selectedSecondaryDetail.price && selectedDetail.price) return selectedDetail.price.toLocaleString()

    return ""
  }

  return (<>
    <div className="">
      <p className="text-[30px] font-extrabold m-[10px_0_18px]">{product.name}</p>
      <p className="text-[32px] font-medium text-[#b61a2d] mb-2.5">{getPrice() ? `${getPrice()} đ` : ""}</p>
      <p className="text-sm mb-[30px]">Đã bao gồm VAT, chưa bao gồm phí giao hàng</p>
      <p className="text-sm mb-2.5">Giao hàng trong vòng 1-3 ngày</p>

      <div className="flex flex-col gap-3">
        <div className="flex gap-2 flex-wrap">
          {
            saleDetails.filter(item => !item.saleDetailId).map(detail => {
              return <div key={detail.id} className="flex flex-col gap-1">
                {
                  detail.type === "COLOR" ?
                    <div className={getColor(detail, selectedDetail.id)} onClick={() => onPrimarySelect(detail.id)}></div> :
                    <Button color="default"
                      variant={getVariant(detail.id, selectedDetail.id)}
                      onPress={() => onPrimarySelect(detail.id)}
                      value={detail.id}>{detail.value}</Button>
                }
                <div>
                  {
                    saleDetails.filter(item => item.saleDetailId && item.saleDetailId === selectedDetail.id).map(sDetail => {
                      if (sDetail.type === "COLOR") {
                        return <div className={getColor(sDetail, selectedSecondaryDetail.id)} onClick={() => onSecondarySelect(sDetail.id)} key={sDetail.id}></div>
                      }
                      return <Button color="default"
                        key={sDetail.id}
                        variant={getVariant(sDetail.id, selectedSecondaryDetail.id)}
                        onPress={() => onSecondarySelect(detail.id)}
                        value={sDetail.id}>{sDetail.value}</Button>
                    })
                  }
                </div>
              </div>
            })
          }

        </div>

        <Input type="number" label="Số lượng"
          aria-label="Số lượng" defaultValue={quantity}
          onValueChange={setQuantity}
          min={1} max={999} />
        <div className="flex lg:flex-nowrap flex-wrap">
          <div className="pr-3 pb-3">
            <Button color="primary" fullWidth isDisabled={!getPrice()} onClick={() => {
              addItemToCart({
                quantity: quantity,
                product: product,
                saleDetail: selectedDetail,
                secondarySaleDetail: selectedSecondaryDetail
              })
              window.location.replace("/gio-hang")
            }}>Mua ngay <ShoppingCart /></Button>
          </div>
          <div className="pb-3">
            <Button color="primary" fullWidth
              isDisabled={!getPrice()}
              onClick={() => {
                addItemToCart({
                  quantity: quantity,
                  product: product,
                  saleDetail: selectedDetail,
                  secondarySaleDetail: selectedSecondaryDetail
                })
              }}>Thêm vào giỏ hàng</Button>
          </div>
        </div>
      </div>
    </div>

  </>)
}

export default SaleDetail
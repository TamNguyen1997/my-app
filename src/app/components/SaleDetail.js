import { Button } from "@nextui-org/react"
import { ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"

const SaleDetail = ({ productId }) => {
  const [detail, setDetail] = useState({})

  const [primarySaleDetails, setPrimarySaleDetails] = useState([])
  const [secondarySaleDetails, setSecondarySaleDetails] = useState([])

  const [selectedPrimary, setSelectedPrimary] = useState({})
  const [selectedSecondary, setSelectedSecondary] = useState({})

  useEffect(() => {
    fetch(`/api/products/${productId}/sale-details/`).then(res => res.json())
    .then(json => {
      setDetail(Object.groupBy(json, ({id}) => id))
      setPrimarySaleDetails(json)
    })
  }, [])

  const onPrimarySelect = (e) => {
    const buttonValue = e.target.getAttribute("value")
    setSelectedPrimary(detail[buttonValue][0])
    setSelectedSecondary({})
    const secondaryDetails = detail[buttonValue][0].secondary_sale_detail ? detail[buttonValue][0].secondary_sale_detail : []
    setSecondarySaleDetails(secondaryDetails)
  }

  const onSecondarySelect = (e) => {
    const buttonValue = e.target.getAttribute("value")
    setSelectedSecondary(selectedPrimary.secondary_sale_detail.find(detail => detail.id === buttonValue))
  }

  const getVariant = (id, selected) => {
    if (id === selected) return "solid"
    return "ghost"
  }

  const getPrice = () => {
    if (selectedPrimary.price && !selectedPrimary.secondary_sale_detail?.length) return selectedPrimary.price.toLocaleString()
    if (selectedSecondary.price) return selectedSecondary.price.toLocaleString()
  }

  return (<>
    <div className="flex">
      {
        primarySaleDetails.map(detail => {
          return <div className="pl-4" key={detail.id}>
            <Button color="default" variant={getVariant(detail.id, selectedPrimary.id)} onPress={onPrimarySelect} value={detail.id}>{detail.value}</Button>
          </div>
        })
      }
    </div>

    <div className="flex pt-3 pb-6">
      {
        secondarySaleDetails.map(detail => {
          return <div className="pl-4" key={detail.id}>
            <Button color="default" variant={getVariant(detail.id, selectedSecondary.id)}  onPress={onSecondarySelect} value={detail.id}>{detail.value}</Button>
          </div>
        })
      }
    </div>

    <p className="inline-block mb-8 text-4xl font-bold text-gray-700  ">
      <span>{getPrice()}</span>
    </p>

    <div className="flex pb-3">
      <div className="pr-3 w-1/3">
        <Button color="primary" fullWidth radius="full" isDisabled={!getPrice()}>Mua ngay <ShoppingCart /></Button>
      </div>
      <div className="pr-3 w-1/3">
        <Button color="primary" fullWidth radius="full" isDisabled={!getPrice()}>Thêm vào giỏ hàng</Button>
      </div>
      <div className="w-1/3">
        <Button color="default" fullWidth variant="faded" radius="full">Liên hệ</Button>
      </div>
    </div>

  </>)
}

export default SaleDetail
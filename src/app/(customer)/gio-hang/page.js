"use client"
import ProductCard from "@/app/components/product/ProductCard";
import { CartContext } from "@/context/CartProvider";
import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Textarea, useDisclosure } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const COLOR_VARIANT = {
  "#ffffff": "bg-[#ffffff]",
  "#4b5563": "bg-[#4b5563]",
  "#1e3a8a": "bg-[#1e3a8a]",
  "#facc15": "bg-[#facc15]",
  "#dc2626": "bg-[#dc2626]",
  "#000000": "bg-[#000000]",
}

const Cart = () => {
  const { cartdetails, removeItemFromCart, updateItemQuantityInCart, getTotal, removeAllItems } = useContext(CartContext)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selected, setSelected] = useState("COD");

  const [cities, setCities] = useState([])
  const [wards, setWards] = useState([])
  const [districts, setDistricts] = useState([])
  const [qr, setQr] = useState({})
  const [shippingCost, setShippingCost] = useState(0)

  useEffect(() => {
    if (cartdetails.length) {
      fetch(`/api/products/${cartdetails[0].product.id}/related?active=true`).then(res => res.json()).then(setRelatedProducts)
    }
    fetch(`/api/courier/get-cities`).then(res => res.json()).then(data => setCities(data.data))
  }, [cartdetails.length])

  const getPrice = (saleDetail, secondarySaleDetail) => {
    if (!secondarySaleDetail && !saleDetail) return 0
    if (!secondarySaleDetail.price && saleDetail.price) return saleDetail.price
    if (secondarySaleDetail.price) return secondarySaleDetail.price

    return 0
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm()

  const onSubmit = async (data) => {
    const createdOrder = await createOrder(data)
    if (selected === "VIETQR") {
      const res = await fetch("/api/pay", {
        method: "POST", body: JSON.stringify({
          price_list: [getTotal()],
          shipping_costs: [shippingCost],
          order_code: "ASD",
          orderId: createdOrder.orderId
        })
      })
      if (res.ok) {
        setQr(await res.json())
        onOpenChange()
        removeAllItems()
      } else {
        console.log(res)
      }
    } else {
      removeAllItems()
    }
  }

  const createOrder = async (data) => {
    const body = getBody(data)

    const res = await fetch("/api/order/", {
      method: "POST", body: JSON.stringify(body)
    })
    if (res.ok) {
      toast.success("Đã đặt hàng")
      return (await res.json()).order
    } else {
      toast.error("Không thể đặt hàng")
    }
  }

  const getBody = (data) => {
    return {
      order: { ...data, total: getTotal(), paymentMethod: selected, shippingFee: getTotal() > 2000000 ? 0 : shippingCost },
      products: cartdetails.map(detail => {
        return {
          productId: detail.product.id,
          quantity: detail.quantity,
          saleDetailId: detail.secondarySaleDetail?.id || detail.saleDetail?.id
        }
      })
    }
  }

  return (<>
    <ToastContainer />
    <div>
      <Modal
        scrollBehavior="inside"
        isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Mã QR</ModalHeader>
              <ModalBody>
                <img src={qr.qr}>
                </img>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" type="submit" onPress={onClose}>
                  Xác nhận chuyển khoản thành công
                </Button>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>

      </Modal>
    </div>
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16 flex mx-auto lg:max-w-2xl xl:max-w-4xl flex-col sm:p-2">
      <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Giỏ hàng</h2>
      <div className="mt-6 sm:mt-8 md:gap-6 lg:items-start xl:gap-8">
        <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl border p-4 border-gray-200 bg-white shadow-sm sm:p-6 rounded-lg">
          <div className="space-y-6">
            {
              cartdetails?.map((detail, i) =>
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6" key={i}>
                  <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                    <a href={`/${detail.product.subCate ? detail.product.subCate.slug : "san-pham"}/${detail.product.slug}`} className="shrink-0 md:order-1">
                      <img className="h-20 w-20 dark:block" src={`${process.env.NEXT_PUBLIC_FILE_PATH + detail.product.image?.path}`} alt="imac image" />
                    </a>
                    <div className="flex items-center justify-between md:order-3 md:justify-end">
                      <div className="flex items-center w-32">
                        <Input type="number" label="Số lượng"
                          aria-label="Số lượng" defaultValue={detail.quantity || 0}
                          onValueChange={(value) => {
                            updateItemQuantityInCart(detail, value)
                          }}
                          min={1} max={999} />
                      </div>
                      <div className="text-end md:order-4 md:w-32">
                        <p className="text-base font-bold text-gray-900 dark:text-white">
                          {(getPrice(detail.saleDetail, detail.secondarySaleDetail) * detail.quantity).toLocaleString()} đ
                        </p>
                      </div>
                    </div>

                    <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                      <div>
                        <a href={`/${detail.product.subCate ? detail.product.subCate.slug : "san-pham"}/${detail.product.slug}`} className="text-base font-medium text-gray-900 hover:underline dark:text-white">{detail.product.name}</a>
                        <p className="text-lg font-bold leading-tight text-red-600 dark:text-red-500">
                          {getPrice(detail.saleDetail, detail.secondarySaleDetail).toLocaleString()} đ</p>
                        <div className="text-[16px] flex opacity-80 pt-1">
                          <div className="pr-3">
                            {
                              detail.saleDetail ? detail.saleDetail.type === "COLOR" ?
                                <div className={`rounded-full ${COLOR_VARIANT[detail.saleDetail.value]} w-5 h-5 border-[#e3e3e3] border`}></div> :
                                detail.saleDetail.value : ""
                            }
                          </div>
                          {
                            !detail.secondarySaleDetail?.value ? "" :
                              <div className="border-l-2 pl-3">
                                {
                                  detail.secondarySaleDetail.type === "COLOR" ?
                                    <div className={`rounded-full ${COLOR_VARIANT[detail.secondarySaleDetail.value]} w-5 h-5 border-[#e3e3e3] border`}></div> :
                                    detail.secondarySaleDetail.value
                                }
                              </div>
                          }
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button type="button"
                          className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                          onClick={() => removeItemFromCart(detail)}>
                          <svg className="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                          </svg>
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }

          </div>
          <div className="space-y-4 mt-8 px-2">
            <div className="space-y-2">
              <dl className="flex items-center justify-between gap-4">
                <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Tạm tính</dt>
                <dd className="text-base font-medium text-gray-900 dark:text-white">{getTotal().toLocaleString()} đ</dd>
              </dl>
            </div>
          </div>
        </div>
        <form className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="space-y-2">
              <Input
                label="Tên"
                aria-label="Tên"
                {...register("name", { required: true })}
                isRequired
              />
              {errors.name && <span className="text-red-600 text-small">Bạn phải điền tên</span>}
              <Input
                label="Số điện thoại"
                aria-label="Số điện thoại"
                {...register("phone", { required: true })}
                isRequired
              />
              {errors.phone && <span className="text-red-600 text-small">Bạn phải điền số điện thoại</span>}
              <Input
                label="Email"
                aria-label="Email"
                {...register("email", { required: true })}
                isRequired
              />
              {errors.email && <span className="text-red-600 text-small">Bạn phải điền email</span>}
              <Input
                label="Địa chỉ"
                aria-label="Địa chỉ"
                {...register("address", { required: true })}
                isRequired
              />
              <div className="flex gap-2">
                <Select label="Tỉnh/thành" placeholder="Chọn tỉnh/thành" isRequired onSelectionChange={(value) => {
                  const provinceId = value.values().next().value
                  register('provinceId', { value: provinceId })
                  fetch(`/api/courier/get-districts?provinceId=${provinceId}`).then(res => res.json()).then(data => setDistricts(data.data))
                }}>
                  {
                    cities.map(item => <SelectItem key={item.PROVINCE_ID}>
                      {item.PROVINCE_NAME}
                    </SelectItem>
                    )
                  }
                </Select>

                <Select label="Quận/huyện" placeholder="Chọn quận/huyện" className="capitalize" isRequired onSelectionChange={value => {
                  const districtId = value.values().next().value
                  register('districtId', { value: districtId })
                  fetch(`/api/courier/get-wards?districtId=${districtId}`).then(res => res.json()).then(data => setWards(data.data))
                }}>
                  {
                    districts.map(item => <SelectItem key={item.DISTRICT_ID} className="capitalize">
                      {item.DISTRICT_NAME.toLowerCase()}
                    </SelectItem>
                    )
                  }
                </Select>
                <Select label="Phường/xã" placeholder="Chọn phường/xã" className="capitalize" isRequired onSelectionChange={async value => {
                  const wardId = value.values().next().value
                  register('wardId', { value: wardId })
                  fetch(`/api/courier/shipping-price`, { method: "POST", body: JSON.stringify(getBody(getValues())) })
                    .then(res => res.json())
                    .then(json => setShippingCost(json.MONEY_TOTAL))
                }}>
                  {
                    wards.map(item => <SelectItem key={item.WARDS_ID} className="capitalize">
                      {item.WARDS_NAME.toLowerCase()}
                    </SelectItem>
                    )
                  }
                </Select>
              </div>
              <Textarea
                label="Ghi chú"
                aria-label="Ghi chú"
                {...register("note")}
              />

              <div className="flex flex-wrap gap-5">
                <Checkbox radius="full" value="COD" isSelected={selected === "COD"} onValueChange={() => setSelected("COD")}>Thanh toán khi giao hàng (COD)</Checkbox>
                <Checkbox radius="full" value="VIETQR" isSelected={selected === "VIETQR"} onValueChange={() => setSelected("VIETQR")}>Chuyển khoản VietQR</Checkbox>
              </div>
            </div>
            {
              getTotal() > 2000000 ? <>
                <div>
                  <p className="opacity-65 line-through">Phí vận chuyển: {shippingCost.toLocaleString()} đ</p>
                  <p className="text-xs opacity-65">Miễn phí vận chuyển với đơn trên 2,000,000đ</p>
                </div>
                <p>Tổng: {(getTotal()).toLocaleString()} đ</p>
              </> :
                <>
                  <div>
                    <p className="opacity-65">Phí vận chuyển: {shippingCost.toLocaleString()} đ</p>
                    <p className="text-xs opacity-65">Miễn phí vận chuyển với đơn trên 2,000,000đ</p>
                  </div>
                  <p>Tổng: {(shippingCost + getTotal()).toLocaleString()} đ</p>
                </>
            }

            <Button className=" w-full items-center justify-center" color="primary" type="submit" isDisabled={!cartdetails || !cartdetails.length}>
              Checkout
            </Button>

            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> hoặc </span>
              <a href="/" title="" className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">
                Tiếp tục mua hàng
                <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                </svg>
              </a>
            </div>
          </div>
        </form>

        <div className="xl:mt-8 xl:block sm:mt-8">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Sản phẩm tương tự</h3>
          <div className="mt-6 grid md:grid-cols-3 gap-4 sm:mt-8 grid-cols-2">
            {
              relatedProducts?.map((product, i) => {
                return <div
                  key={i}
                  className="space-y-3 overflow-hidden rounded-lg border border-gray-200 bg-white p-3 
                  shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <ProductCard product={product} width={200} height={200} />
                </div>
              })
            }

          </div>
        </div>
      </div>
    </section>
  </>)
}

export default Cart
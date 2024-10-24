"use client"

import { CartContext } from "@/context/CartProvider";
import { Button, Checkbox, Input, Link, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Payment = () => {
  const { cartdetails, getTotal, removeAllItems } = useContext(CartContext)
  const [selected, setSelected] = useState("COD");
  const [isVATActive, setIsVATActive] = useState(false);

  const [cities, setCities] = useState([])
  const [wards, setWards] = useState([])
  const [districts, setDistricts] = useState([])
  const [shippingCost, setShippingCost] = useState(0)

  useEffect(() => {
    fetch(`/api/courier/get-cities`).then(res => res.json()).then(data => setCities(data.data))
  }, [cartdetails.length])

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm()

  const createOrder = async (data) => {
    const body = getBody(data)

    const res = await fetch("/api/order/", {
      method: "POST", body: JSON.stringify(body)
    })
    if (res.ok) {
      return (await res.json()).order
    } else {
      toast.error("Không thể đặt hàng")
    }
  }

  const onSubmit = async (data) => {
    const createdOrder = await createOrder(data)
    if (selected === "VIETQR") {
      const res = await fetch("/api/pay/vnpay", {
        method: "POST", body: JSON.stringify({
          price_list: [getTotal()],
          shipping_costs: [shippingCost],
          order_code: "ASD",
          orderId: createdOrder.orderId
        })
      })
      if (res.status == 200) {
        const { vnpUrl } = await res.json()
        console.log(vnpUrl)
        window.location.replace(vnpUrl)
      } else {
        console.log(res)
      }
    } else {
      removeAllItems()
      window.location.replace("/dat-hang/thanh-cong")
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

  return (<div>
    <ToastContainer />

    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16 flex mx-auto lg:max-w-2xl xl:max-w-4xl flex-col p-2">
      <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Thanh toán</h2>
      <div className="mt-6 sm:mt-8 md:gap-6 lg:items-start xl:gap-8">
        <form className="mx-auto max-w-4xl flex-1 space-y-6 lg:w-full" onSubmit={handleSubmit(onSubmit)}>
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
              <div className="grid sm:grid-cols-3 gap-2">
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

              <div className="!my-3">
                <Checkbox isSelected={isVATActive} onValueChange={setIsVATActive}>Xuất hoá đơn khách hàng doanh nghiệp</Checkbox>
                {
                  isVATActive && <div className="space-y-2 !mt-3 !mb-6">
                    <p className="text-gray-500">
                      <span className="font-bold">THÔNG TIN BẮT BUỘC:</span><br /><br />
                      Vui lòng liên hệ với chúng tôi qua emai: <Link href="mailto:info@saovietco.vn">info@saovietco.vn</Link><br /><br />
                      hoặc điện thoại: <Link href="tel:0903802979">090 380 2979</Link> nếu quý khách đã thanh toán tiền hàng và chưa nhận được hóa đơn trong vòng 3 ngày kể
                      từ ngày thanh toán.<br /><br />
                    </p>
                    <Input
                      label="Tên Công ty"
                      aria-label="Tên Công ty"
                      {...register("companyName", { required: isVATActive })}
                      isRequired={isVATActive}
                    />
                    {errors.companyName && <span className="text-red-600 text-small">Bạn phải điền tên Công ty</span>}
                    <Input
                      label="Mã số thuế"
                      aria-label="Mã số thuế"
                      {...register("companyTaxCode", { required: isVATActive })}
                      isRequired={isVATActive}
                    />
                    {errors.companyTaxCode && <span className="text-red-600 text-small">Bạn phải điền mã số thuế</span>}
                    <Input
                      label="Email nhận hóa đơn"
                      aria-label="Email nhận hóa đơn"
                      {...register("companyEmail", { required: true })}
                      isRequired
                    />
                    {errors.companyEmail && <span className="text-red-600 text-small">Bạn phải điền email nhận hóa đơn</span>}
                    <Input
                      label="Địa chỉ công ty"
                      aria-label="Địa chỉ công ty"
                      {...register("companyAddress", { required: true })}
                      isRequired
                    />
                    {errors.companyEmail && <span className="text-red-600 text-small">Bạn phải điền địa chỉ công ty</span>}
                  </div>
                }
              </div>

              <div className="flex flex-wrap gap-5">
                <Checkbox name="payment-method" radius="full" value="COD" isSelected={selected === "COD"} onValueChange={() => setSelected("COD")}>Thanh toán khi giao hàng (COD)</Checkbox>
                <Checkbox name="payment-method" radius="full" value="VIETQR" isSelected={selected === "VIETQR"} onValueChange={() => setSelected("VIETQR")}>Chuyển khoản</Checkbox>
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

            <Button className="items-center justify-center flex m-auto" color="primary" type="submit" isDisabled={!cartdetails || !cartdetails.length}>
              Thanh toán
            </Button>


            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> hoặc </span>
              <Link isExternal href="/" title="" className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">
                Tiếp tục mua hàng
                <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                </svg>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  </div>)
}

export default Payment;
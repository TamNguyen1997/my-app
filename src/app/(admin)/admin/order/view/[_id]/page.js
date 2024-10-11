"use client"

import { Button, DatePicker, Input, Select, SelectItem, Spinner, Textarea } from "@nextui-org/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { PROVINCES } from "@/lib/courier"
import { parseDate } from "@internationalized/date";

const COLOR_VARIANT = {
  "#ffffff": "bg-[#ffffff]",
  "#4b5563": "bg-[#4b5563]",
  "#1e3a8a": "bg-[#1e3a8a]",
  "#facc15": "bg-[#facc15]",
  "#dc2626": "bg-[#dc2626]",
  "#000000": "bg-[#000000]",
}

const Order = () => {
  const [order, setOrder] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [province, setProvince] = useState("")
  const [district, setDistrict] = useState("")
  const [ward, setWard] = useState("")
  const { _id } = useParams();

  useEffect(() => {
    setIsLoading(true)
    getOrder()
    setIsLoading(false)
  }, [])

  const getOrder = async () => {

    const res = await fetch(`/api/order/${_id}`)
    const json = await res.json()
    setOrder(json)

    if (json.provinceId) {
      setProvince(PROVINCES.find(item => parseInt(json.provinceId) === item.PROVINCE_ID).PROVINCE_NAME)
    }
    if (json.provinceId && json.districtId) {
      fetch(`/api/courier/get-districts?provinceId=${json.provinceId}`)
        .then(res => res.json())
        .then(data => setDistrict(data.data.find(item => item.DISTRICT_ID === parseInt(json.districtId))?.DISTRICT_NAME))
    }
    if (json.districtId && json.wardId) {
      fetch(`/api/courier/get-wards?districtId=${json.districtId}`)
        .then(res => res.json())
        .then(data => setWard(data.data.find(item => item.WARDS_ID === parseInt(json.wardId))?.WARDS_NAME))
    }
  }

  if (isLoading) return <Spinner className="flex m-auto pt-10 w-full h-full" />

  const orderShipping = async () => {
    const res = await fetch(`/api/courier/create-order`, { method: "POST", body: JSON.stringify({ orderId: _id }) })
    if (res.ok) {
      toast.success("Đã tạo đơn Viettel Post")
      quickUpdate({ shippingOrderCreated: true, shippingMethod: "VIETTEL_POST" })
      getOrder()
    } else {
      toast.error("Không thể tạo đơn Viettel Post")
    }
  }

  const quickUpdate = async (value) => {
    const res = await fetch(`/api/order/${order.id}`, {
      method: "PUT",
      body: JSON.stringify(value)
    })
    if (res.ok) {
      setOrder(await res.json())
      toast.success("Đã cập nhật")
    } else {
      toast.error("Không thể cập nhật")
    }
  }

  const getShippingStatusColor = (order) => {
    if (order.shippingStatus === "SHIPPING") {
      return "warning"
    }
    if (order.shippingStatus === "SHIPPED") {
      return "success"
    }
    return "danger"
  }

  const getPaymentStatus = (order) => {
    if (order.shippingStatus === "SHIPPING") {
      return "warning"
    }
    if (order.shippingStatus === "SHIPPED") {
      return "success"
    }
    return "danger"
  }
  return (
    <>
      <ToastContainer />
      <div className="flex py-3 gap-3">
        <Button onClick={orderShipping} isDisabled={order.shippingId} color="primary">Tạo đơn vận chuyển Viettel Post</Button>
        <Button isDisabled={order.shippingId} color="primary">Tạo đơn vận chuyển 24/7</Button>
      </div>
      <form >
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div class="flex items-center">
            <hr class="flex-grow border-t border-gray-300" />
            <span class="px-3 text-gray-500">
              Đơn hàng
            </span>
            <hr class="flex-grow border-t border-gray-300" />
          </div>
          <div className="space-y-2">
            <Input
              label="Tên khách hàng"
              aria-label="Tên khách hàng"
              value={order.name}
              readOnly
            />
            <Input
              label="Số điện thoại"
              aria-label="Số điện thoại"
              type="phone"
              value={order.phone}
              readOnly
            />

            <Input
              label="Email"
              aria-label="Email"
              value={order.email}
              type="email"
              readOnly
            />
            <Input
              label="Địa chỉ"
              aria-label="Địa chỉ"
              value={order.address}
              readOnly
            />
            <div className="flex gap-2">
              <Input label="Tỉnh/thành" value={province} readOnly />
              <Input label="Quận/huyện" value={district} readOnly />
              <Input label="Phường/xã" value={ward} readOnly />
            </div>
            <Textarea
              label="Ghi chú"
              aria-label="Ghi chú"
              value={order.note}
              readOnly
            />
            <div class="flex items-center pt-5">
              <hr class="flex-grow border-t border-gray-300" />
              <span class="px-3 text-gray-500">
                Thông tin công ty
              </span>
              <hr class="flex-grow border-t border-gray-300" />
            </div>
            <div className="flex gap-3">
              <Input label="Tên Công ty"
                value={order.companyName}
                readOnly />
              <Input label="Mã số thuế"
                value={order.companyTaxCode}
                readOnly />
              <Input label="Email nhận hóa đơn"
                value={order.companyEmail}
                readOnly />
            </div>
            <div>
              <Input label="Địa chỉ công ty"
                value={order.companyAddress}
                readOnly />
            </div>
            <div class="flex items-center pt-5">
              <hr class="flex-grow border-t border-gray-300" />
              <span class="px-3 text-gray-500">
                Thông tin vận chuyển
              </span>
              <hr class="flex-grow border-t border-gray-300" />
            </div>
            <div className="flex gap-3">
              <Input label="Mã đơn hàng"
                value={order.orderId}
                readOnly />
              <Input label="Phương thức thanh toán"
                value={order.paymentMethod}
                readOnly />
              <Input label="Trạng thái thanh toán"
                color={order.status === "PAID" ? "success" : "warning"}
                value={order.status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                readOnly />
              <Input label="Số tiền chuyển khoản"
                value={order.customerPayment}
                type="number"
                readOnly />
              <Input label="Tổng tiền"
                value={order.total}
                type="number"
                readOnly />
            </div>

            <div className="flex gap-3">
              <Input label="Phí vận chuyển"
                value={order.shippingFee}
                disabled />
              <Input label="Phương thức vận chuyển"
                value={order.shippingMethod}
                disabled />
              <Input label="Mã vận chuyển"
                value={order.shippingId}
                disabled />
              <Select label="Trạng thái đơn hàng"
                color={getShippingStatusColor(order)}
                disallowEmptySelection
                defaultSelectedKeys={new Set([order.shippingStatus || "WAITING"])}
                onSelectionChange={(value) => quickUpdate({ shippingStatus: value.values().next().value })}>
                <SelectItem key="WAITING">
                  Đang đợi giao hàng
                </SelectItem>
                <SelectItem key="SHIPPING">
                  Đang giao hàng
                </SelectItem>
                <SelectItem key="SHIPPED">
                  Đã giao hàng
                </SelectItem>
              </Select>
              <Select label="Đã tạo đơn vận chuyển"
                disallowEmptySelection
                color={order.shippingOrderCreated && "success"}
                selectedKeys={new Set([order.shippingOrderCreated ? "true" : "false"])}
                onSelectionChange={(value) => quickUpdate({ shippingOrderCreated: value.values().next().value === "true" })}>
                <SelectItem key="true">
                  Đã tạo đơn vận chuyển
                </SelectItem>
                <SelectItem key="false">
                  Chưa tạo đơn vận chuyển
                </SelectItem>
              </Select>
            </div>
            <div className="flex gap-3 w-1/4">
              {
                order.createdAt ? <DatePicker
                  label="Ngày tạo đơn"
                  value={order.createdAt ? getDateString(order.createdAt) : ""}
                  aria-label="Date"
                  disabled
                /> : ""
              }

            </div>
          </div>

          <div>
            {
              order.product_on_order?.map((item, i) =>
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6" key={i}>
                  <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                    <span className="shrink-0 md:order-1">
                      <img className="h-20 w-20 dark:block" src={`${process.env.NEXT_PUBLIC_FILE_PATH + item.saleDetail?.product.image?.path}`} alt="image" />
                    </span>
                    <div className="flex items-center justify-between md:order-3 md:justify-end">
                      <div className="flex items-center w-32">
                        <Input type="number" label="Số lượng"
                          aria-label="Số lượng" value={item.quantity}
                          disabled
                          min={1} max={999} />
                      </div>
                      <div className="text-end md:order-4 md:w-32">
                        <p className="text-base font-bold text-gray-900 dark:text-white">
                          {(parseInt(item.saleDetail?.price || "0") * item.quantity).toLocaleString()} đ
                        </p>
                      </div>
                    </div>

                    <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                      <div>
                        <p className="text-base font-medium text-gray-900 hover:underline dark:text-white">{item.saleDetail.product.name}</p>
                        <p className="text-lg font-bold leading-tight text-red-600 dark:text-red-500">
                          {item.saleDetail?.price.toLocaleString()} đ</p>
                        <div className="text-[16px] flex opacity-80 pt-1">
                          <div className="pr-3">
                            {
                              item.saleDetail ? item.saleDetail.type === "COLOR" ?
                                <div className={`rounded-full ${COLOR_VARIANT[item.saleDetail.value]} w-5 h-5 border-[#e3e3e3] border`}></div> :
                                item.saleDetail.value : ""
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>)
            }
          </div>
        </div>
      </form>
    </>
  )
}

const getDateString = (isoDate) => {
  return parseDate(isoDate.split('T')[0])
}

export default Order
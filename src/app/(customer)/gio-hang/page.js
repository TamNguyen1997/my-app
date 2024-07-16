"use client"
import { CartContext } from "@/context/CartProvider";
import { Button, Input } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form"

const COLOR_VARIANT = {
  "#ffffff": "bg-[#ffffff]",
  "#4b5563": "bg-[#4b5563]",
  "#1e3a8a": "bg-[#1e3a8a]",
  "#facc15": "bg-[#facc15]",
  "#dc2626": "bg-[#dc2626]",
  "#000000": "bg-[#000000]",
}

const Cart = () => {
  const { cartdetails, addItemToCart, removeItemFromCart, updateItemQuantityInCart, getTotal } = useContext(CartContext)

  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    if (cartdetails.length) {
      fetch(`/api/products/${cartdetails[0].product.id}/related?active=true`).then(res => res.json()).then(setRelatedProducts)
    }
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
    formState: { errors }
  } = useForm()

  const onSubmit = (data) => {

    const body = {
      order: { ...data, total: getTotal() },
      products: cartdetails.map(detail => {
        return {
          productId: detail.product.id,
          quantity: detail.quantity
        }
      })
    }

    fetch("/api/order", {
      method: "POST", body: JSON.stringify(body)
    }).then(value => console.log(value))
  }

  return (<>
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Giỏ hàng</h2>

        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              {
                cartdetails?.map((detail, i) =>
                  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6" key={i}>
                    <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                      <a href={`/san-pham/${detail.product.slug}`} className="shrink-0 md:order-1">
                        <img className="h-20 w-20 dark:block" src={`${process.env.NEXT_PUBLIC_FILE_PATH + detail.product.image?.path}`} alt="imac image" />
                      </a>

                      <label htmlFor="counter-input" className="sr-only">Số lượng:</label>
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
                          <a href={`/san-pham/${detail.product.slug}`} className="text-base font-medium text-gray-900 hover:underline dark:text-white">{detail.product.name}</a>
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
            <div className="xl:mt-8 xl:block sm:mt-8">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Sản phẩm tương tự</h3>
              <div className="mt-6 grid grid-cols-3 gap-4 sm:mt-8">
                {
                  relatedProducts?.map((product, i) => {
                    return <div
                      key={i}
                      className="space-y-6 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <a href={`/san-pham/${product.slug}`} className="overflow-hidden rounded">
                        <img className="mx-auto h-44 w-44 dark:hidden" src={`${process.env.NEXT_PUBLIC_FILE_PATH + product.image?.path}`} alt="imac image" />
                      </a>
                      <div className="mt-6 flex items-center">
                        <Button className="w-full items-center justify-center font-medium" color="primary"
                          onClick={() => addItemToCart({
                            quantity: 1,
                            product: product,
                            saleDetail: {},
                            secondarySaleDetail: {}
                          })}>
                          <svg className="-ms-2 me-2 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4" />
                          </svg>
                          Thêm vào giỏ hàng
                        </Button>
                      </div>
                    </div>
                  })
                }

              </div>
            </div>
          </div>
          <form className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
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
                {errors.address && <span className="text-red-600 text-small">Bạn phải điền địa chỉ</span>}
              </div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">Nội dung mua hàng</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Giá tiền</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">{getTotal().toLocaleString()} đ</dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Phí ship</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">$99</dd>
                  </dl>
                </div>

                <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <dt className="text-base font-bold text-gray-900 dark:text-white">Tổng</dt>
                  <dd className="text-base font-bold text-gray-900 dark:text-white"></dd>
                </dl>
              </div>

              <Button className=" w-full items-center justify-center" color="primary" type="submit">
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
        </div>
      </div>
    </section>
  </>)
}

export default Cart
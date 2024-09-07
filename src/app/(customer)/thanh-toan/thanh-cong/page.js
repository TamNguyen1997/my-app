'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const SuccessPayment = () => {
  const searchParams = useSearchParams().toString()

  console.log(searchParams)

  useEffect(() => {
    fetch(`/api/webhook/vnpay?${searchParams}`)
  }, [searchParams])

  return (<>
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-2xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mb-2">Cảm ơn quý khách!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 md:mb-8">
          Đơn hàn của quý khách đã được đặt</p>

      </div>
    </section>
  </>)
}

export default SuccessPayment;
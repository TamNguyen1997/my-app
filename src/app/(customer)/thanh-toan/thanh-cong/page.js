'use client'

import { Link } from '@nextui-org/react'
import { CircleCheckBig } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const SuccessPayment = () => {
  const searchParams = useSearchParams()

  console.log(searchParams)

  useEffect(() => {
    fetch(`/api/webhook/vnpay?${searchParams.toString()}`)
  }, [searchParams])

  return (<>
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <CircleCheckBig size={64} className='opacity-35 m-auto' />
      <div className="mx-auto max-w-2xl px-4 2xl:px-0 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mb-2">Cảm ơn quý khách!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 md:mb-8">
          Mã đơn hàng của quý khách là: <a href="#" className="font-medium text-gray-900 dark:text-white hover:underline">{searchParams.get("vnp_OrderInfo")}</a></p>
        <div class="items-center space-x-4">
          <Link isExternal href="/" title="" className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">
            Tiếp tục mua hàng
            <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
            </svg>
          </Link>

        </div>
      </div>
    </section>
  </>)
}

export default SuccessPayment;
import Payment from "@/components/Payment"

export const metadata = {
  title: 'Thanh toán',
  description: 'Thanh toán',
  openGraph: {
    title: 'Thanh toán',
    description: 'Thanh toán',
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/brand/sao-viet-fanpage.jpg`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/brand/sao-viet-fanpage.jpg`,
        alt: 'Thanh toán',
      }
    ]
  }
}

export default function Page() {
  return (<Payment />)
}
import Contact from "@/components/contact/Contact"

export const metadata = {
  title: 'Liên hệ',
  description: 'Liên hệ',
  openGraph: {
    title: 'Liên hệ',
    description: 'Liên hệ',
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/brand/sao-viet-fanpage.jpg`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/brand/sao-viet-fanpage.jpg`,
        alt: 'Liên hệ',
      }
    ]
  }
}

export default function ContactPage() {
  return <Contact />
}
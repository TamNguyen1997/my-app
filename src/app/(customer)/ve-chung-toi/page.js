import AboutUs from "@/components/AboutUs";

export const metadata = {
  title: 'Về chúng tôi',
  description: 'Về chúng tôi',
}

export default function Page() {
  return (<>
    <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/ve-chung-toi`} />
    <AboutUs />
  </>)
}
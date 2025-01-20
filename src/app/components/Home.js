import HeroBanner from "@/components/HeroBanner";
import PopularItems from "@/components/PopularItems";
import PopularBlogs from "@/components/PopularBlogs";
import Customer from "@/components/Customer";
import Introduction from "@/components/Introduction";
import Head from "next/head";
import { Link } from "@nextui-org/react";

const Home = () => {
  return (
    <div>
      <Head>
        <title></title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content="My page title" key="title" />
        <meta
          name="description"
          content="Dụng cụ vệ sinh Sao Việt"
        />
      </Head>
      <link rel="canonical" href={process.env.NEXT_PUBLIC_DOMAIN} />

      <HeroBanner />
      <PopularItems />
      <Introduction />
      <PopularBlogs />
      <div className="bg-[#FFD400] rounded-tr-[50px] rounded-bl-[50px] flex items-center w-2/3 md:w-1/3 min-w-[300px] h-[50px] m-auto shadow-md">
        <Link href="/" className="m-auto text-black font-bold md:text-xl">KHÁCH HÀNG SAO VIỆT</Link>
      </div>
      <Customer />
    </div>
  );
}

export default Home
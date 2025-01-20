import HeroBanner from "@/components/HeroBanner";
import PopularItems from "@/components/PopularItems";
import PopularBlogs from "@/components/PopularBlogs";
import Customer from "@/components/Customer";
import Introduction from "@/components/Introduction";
import Head from "next/head";

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
      <div className="m-auto sm:w-3/4">
        <HeroBanner />
        <PopularItems />
        <Introduction />
        <PopularBlogs />
        <Customer />
      </div>
    </div>
  );
}

export default Home
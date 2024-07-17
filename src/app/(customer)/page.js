"use client";

import HeroBanner from "@/components/HeroBanner";
import PopularItems from "@/components/PopularItems";
import PopularBlogs from "@/components/PopularBlogs";
import Customer from "@/components/Customer";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="font-open_san">
      <link rel="canonical" href={process.env.NEXT_PUBLIC_DOMAIN} />
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
        className="mx-auto w-3/4 ">
        <HeroBanner />
      </motion.div>
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
        className="pb-[60px] pt-4 mx-auto w-3/4 ">
        <PopularItems />
      </motion.div>
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
        className="pb-[60px] items-center">
        <Introduction />
      </motion.div>
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
        className="pb-[60px] m-auto w-3/4">
        <PopularBlogs />
      </motion.div>
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
        className="m-auto w-3/4">
        <Customer />
      </motion.div>
    </div>
  );
}

const Introduction = () => {
  return (
    <div className="bg-introduction bg-center w-full bg-cover bg-no-repeat mb-8 md:h-[700px] sm:h-[600px]" style={{
      backgroundSize: "100% 100%"
    }}>
      <div className="flex gap-5 max-w-[1200px] px-4 mx-auto w-full flex-col pt-[120px]">
        <div className="text-xl font-medium pb-[76px] text-justify w-1/3">
          Một trong những công ty dẫn đầu cung cấp các giải pháp làm vệ sinh chuyên nghiệp là đối tác tin cậy của các nhà đầu tư.
          <br />
          <br />
          Các sản phẩm được Sao Việt chứng nhận chất lượng theo tiêu chuẩn quốc tế mang lại sự hài lòng cho người tiêu dùng.
        </div>

        <div className="flex gap-5">
          <img src="/brand/partner-10.png" alt="Rubbermaid"></img>
          <img src="/brand/partner-20.png" alt="Ghibli"></img>
          <img src="/brand/partner-30.png" alt="Moerman"></img>
          <img src="/brand/partner-40.png" alt="Mapa"></img>
        </div>
      </div>
    </div>)
}
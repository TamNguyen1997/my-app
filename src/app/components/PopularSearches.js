"use client";
import { Link } from "@nextui-org/react";
import { motion } from "framer-motion";


const PopularSearches = ({ popularSearches = [] }) => {
  return (
    <motion.div
      initial={{ x: 200, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      viewport={{ once: true }}
      className="pb-[60px] pt-4 mx-auto sm:w-3/4 flex flex-col gap-5 shadow-xl p-5 rounded-xl">
      <h2 className="font-bold text-xl">Mọi người cũng tìm kiếm</h2>
      <div className="flex flex-wrap gap-2">
        {
          [{ keyword: "1" }, { keyword: "2" }].map((item, index) => (
            <Link href={`/${item.url || item.category?.slug}`} key={index} className="bg-gray-100 text-gray-800
                me-2 px-2.5 py-0.5 rounded-3xl dark:bg-gray-700 dark:text-gray-300 flex">
              {item.keyword || item.category.name}
            </Link>
          ))
        }
      </div>
    </motion.div>
  );
}

export default PopularSearches
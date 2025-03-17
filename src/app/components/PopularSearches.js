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
      <div className="flex flex-wrap">
        {
          popularSearches.map((item, index) => (
            <Link href={`/${item.category.slug}`} key={index}>
              <span className="bg-gray-100 text-gray-800 text-xs font-medium 
                me-2 px-2.5 py-0.5 rounded-3xl dark:bg-gray-700 dark:text-gray-300 flex">
                {item.category.name}
              </span>
            </Link>
          ))
        }
      </div>
    </motion.div>
  );
}

export default PopularSearches
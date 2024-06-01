"use client";

import HeroBanner from "@/components/HeroBanner";
import PopularItems from "@/components/PopularItems";
import PopularBlogs from "@/components/PopularBlogs";
import Customer from "@/components/Customer";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="w-3/4 m-auto">
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}>
        <HeroBanner />
      </motion.div>
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
        className="pb-12 pt-3">
        <PopularItems />
      </motion.div>
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
        className="pb-12 pt-3">
        <PopularBlogs />
      </motion.div>
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
        className="pb-12 pt-3">
        <Customer />
      </motion.div>
    </div>
  );
}

"use client"
import { Image } from "@heroui/react"
import "react-multi-carousel/lib/styles.css"
import { motion } from "framer-motion";
import React from "react";

const Introduction = React.memo(() => {
  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      viewport={{ once: true }}
      className="pb-[60px] mx-auto lg:w-3/4 w-full"
    >
      <Image
        src="introduction.avif"
        alt="Dụng cụ vệ sinh Sao Việt"
        layout="responsive"
        width="auto"
        height="auto"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw"
      />
    </motion.div>
  )
});

export default Introduction
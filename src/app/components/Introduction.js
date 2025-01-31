"use client"
import { Image } from "@nextui-org/react"
import "react-multi-carousel/lib/styles.css"
import { motion } from "framer-motion";

const Introduction = () => {
  return (
    <motion.div
      initial={{ x: 200, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      viewport={{ once: true }}
      className="pb-[60px] mx-auto w-3/4 ">
      <Image src="introduction.avif" alt="introduction" width={1440} />
    </motion.div>
  )
}

export default Introduction
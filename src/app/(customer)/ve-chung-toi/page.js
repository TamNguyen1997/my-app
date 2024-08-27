"use client";

import AboutUsBanner from "@/components/about-us/AboutUsBanner";
import AboutUsArticle from "@/components/about-us/AboutUsArticle";
import AboutUsMilestone from "@/components/about-us/AboutUsMilestone";
import AboutUsNumbers from "@/components/about-us/AboutUsNumbers";
import AboutUsCustomer from "@/components/about-us/AboutUsCustomer";
import AboutUsPartner from "@/components/about-us/AboutUsPartner";
import Contact from "@/components/contact/Contact";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <div>
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <AboutUsBanner />
      </motion.div>

      <motion.div
        initial={{ x: -200, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
        className="container"
      >
        <img
          src="/about-us/intro.png"
          width="1280"
          height="720"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div
        initial={{ y: 200, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <AboutUsMilestone />
      </motion.div>

      <motion.div
        initial={{ x: -200, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
        className="container pb-20 border-b border-black"
      >
        <img
          src="/about-us/mission.png"
          width="1280"
          height="720"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      <AboutUsArticle />

      <motion.div
        initial={{ x: -200, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <AboutUsNumbers />
      </motion.div>

      {/* <motion.div
        initial={{ y: -200, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
        className="mb-6"
      >
        <AboutUsPartner />
      </motion.div> */}

      <motion.div
        initial={{ y: -200, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <AboutUsCustomer />
      </motion.div>

      <motion.div
        initial={{ y: 200, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <Contact />
      </motion.div>
    </div>
  )
}
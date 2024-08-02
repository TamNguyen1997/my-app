"use client";

import AboutUsBanner from "@/components/about-us/AboutUsBanner";
import AboutUsArticle from "@/components/about-us/AboutUsArticle";
import AboutUsMilestone from "@/components/about-us/AboutUsMilestone";
import AboutUsNumbers from "@/components/about-us/AboutUsNumbers";
import AboutUsPartner from "@/components/about-us/AboutUsPartner";
import Contact from "@/components/contact/Contact";
import { motion } from "framer-motion";

export default function AboutUs() {
    return (
        <div className="font-open_san">
            <motion.div
                initial={{ x: -200, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                viewport={{ once: true }}
            >
                <AboutUsBanner />
            </motion.div>

            <AboutUsArticle />

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
            >
                <AboutUsNumbers />
            </motion.div>

            <motion.div
                initial={{ y: -200, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                viewport={{ once: true }}
            >
                <AboutUsPartner />
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
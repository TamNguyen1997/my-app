"use client"
import Image from "next/image"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import { motion } from "framer-motion";
import React from "react";

const logo = [
  "/icon/client/BW.webp",
  "/icon/client/Fusion.webp",
  "/icon/client/Hilton.webp",
  "/icon/client/Hoiana.webp",
  "/icon/client/Hyatt.webp",
  "/icon/client/Inter.webp",
  "/icon/client/JW.webp",
  "/icon/client/Melia.webp",
  "/icon/client/Movenpick.webp",
  "/icon/client/Novotel.webp",
  "/icon/client/Pullman.webp",
  "/icon/client/Regent.webp",
  "/icon/client/Novotel.webp",
  "/icon/client/Sheraton.webp",
  "/icon/client/TheGrand.webp",
  "/icon/client/Wyndham.webp",
  "/icon/client/Caravelle.webp",
  "/icon/client/El-Gaucho.webp",
  "/icon/client/Gallery.webp",
  "/icon/client/Jollibee.webp",
  "/icon/client/Starbucks.webp",
]

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
    slidesToSlide: 4
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
    slidesToSlide: 3
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    slidesToSlide: 2
  }
}

const Customer = React.memo(() => {
  const getLogoAlt = (logoPath) => {
    const fileName = logoPath.split("/").pop() || "client-logo"
    return fileName.replace(".webp", "")
  }

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      viewport={{ once: true }}
      className="m-auto sm:w-3/4">
      <Carousel infinite responsive={responsive} className="w-full items-center mb-6" autoPlaySpeed={3000} autoPlay arrows={false} centerMode >
        {
          logo.map((l, i) =>
            <Image
              key={`${l}-${i}`}
              className="p-3 w-full h-full m-auto items-center text-center content-center group-hover:opacity-50 hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15)]"
              width={200}
              height={100}
              src={l}
              alt={getLogoAlt(l)}
              priority={i < 4}
              loading={i < 4 ? "eager" : "lazy"}
              sizes="(max-width: 464px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={80}
            />)
        }
      </Carousel>
    </motion.div>
  )
})

export default Customer

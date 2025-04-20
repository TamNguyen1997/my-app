"use client"
import { Image } from '@nextui-org/react';
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import { motion } from "framer-motion";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 1
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
}

const HeroBanner = ({ banners }) => {
  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      viewport={{ once: true }}
      className="mx-auto sm:w-3/4 ">
      <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={5000}>
        {
          banners.reverse().map((banner, i) => {
            return <Image
              key={i} width="1280"
              height="720"
              className="w-full h-full max-h-[500px]"
              src={banner?.imageUrl || "/default-featured-image.webp"}
              alt={banner?.alt || "Dụng cụ vệ sinh Sao Việt"}
              srcSet={`${banner?.imageUrl} 1280w, ${banner?.imageUrl.replace('1280', '640')} 640w`}
              sizes="(max-width: 640px) 640px, 1280px"
            />
          })
        }
      </Carousel>
    </motion.div>
  );
};

export default HeroBanner;

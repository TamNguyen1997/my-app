import { Image } from '@nextui-org/react';
import { useState } from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

const AboutUsNumbers = () => {
  const [images] = useState([
    "/about-us/outstanding-1.jpg",
    "/about-us/outstanding-2.jpg",
    "/about-us/outstanding-3.jpg",
    "/about-us/outstanding-4.jpg"
  ]);

  return (
    <div className="bg-[url(/about-us/banner-bg.png)] pt-10 md:px-7 pb-4">
      <div className="relative container">
        <div className="max-w-full overflow-hidden">
          <h2 className="text-3xl font-semibold text-white text-center mb-8">Nổi bật</h2>

          <Carousel
            responsive={responsive}
            infinite
            autoPlay
            autoPlaySpeed={5000}
            showDots
            renderDotsOutside
            arrows={false}
            className="
                            [&_li]:aspect-[1/1]
                            [&_li]:px-4
                            -mx-4 mb-6
                        "
            dotListClass={`
                            [&_button]:!w-[10px]
                            [&_button]:!h-[10px]
                            [&_button]:!border-none
                            [&_button]:!mx-1
                            [&_button]:!bg-[#dcdcdc]
                            [&>.react-multi-carousel-dot--active>button]:!bg-[#478dff]
                            -translate-y-3
                        `}
          >
            {
              images.map((image, i) => {
                return <div key={i} className="w-full h-[calc(100%_-_32px)] rounded-[20px] p-[1px] bg-[linear-gradient(111.39deg,#38c8f9_-11.16%,#ffbe4c_100%)] overflow-hidden">
                  <img
                    src={image}
                    width="1280"
                    height="720"
                    alt=""
                    className="w-full h-full object-cover rounded-[20px]"
                  />
                </div>
              })
            }
          </Carousel>
        </div>
      </div>
    </div>
  )
};

export default AboutUsNumbers;
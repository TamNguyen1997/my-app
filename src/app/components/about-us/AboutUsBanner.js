import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

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
};

const ButtonGroup = ({ next, previous, goToSlide, ...rest }) => {
  const { carouselState: { currentSlide } } = rest;
  return (
    <div className="absolute top-1/2 -translate-y-1/2 w-[calc(100%_-_20px)] flex justify-between px-5">
      <button
        className={`
                    ${currentSlide === 0 ? 'disable' : ''}
                    w-[38px] h-[38px] rounded-full bg-white shadow-[0_0_0_6px_rgba(255,255,255,.1)]
                `}
        onClick={() => previous()}
      >
        <ArrowLeft size="24" className="mx-auto" />
      </button>
      <button
        className="w-[38px] h-[38px] rounded-full bg-white shadow-[0_0_0_6px_rgba(255,255,255,.1)]"
        onClick={() => next()}
      >
        <ArrowRight size="24" className="mx-auto" />
      </button>
    </div>
  );
};

const AboutUsBanner = () => {
  const [banners] = useState([
    "/about-us/Cong-ty-Sao-Viet.png",
    "/about-us/Cong-ty-Sao-Viet_02.png"
  ]);

  return (
    <div className="bg-[url(/about-us/banner-bg.png)] bg-cover">
      <h2 className="text-3xl font-semibold text-white text-center py-8">VỀ SAO VIỆT</h2>
      <div className="pb-[100px] hidden md:block">
        <div className="relative w-full max-w-[1240px] mx-auto px-2">
          <Carousel
            responsive={responsive}
            infinite
            autoPlay
            autoPlaySpeed={5000}
            arrows={false}
            showDots={false}
            renderButtonGroupOutside={true}
            customButtonGroup={<ButtonGroup />}
            className="container px-0"
            dotListClass="!hidden"
          >
            {
              banners.map((banner, i) => {
                return <img
                  key={i}
                  src={banner}
                  width="1280"
                  height="720"
                  alt=""
                  className="w-full h-full max-h-[600px] object-cover"
                />
              })
            }
          </Carousel>
        </div>
      </div>
      <div className="grid gap-5 w-[500px] max-w-full mx-auto px-2 pb-6 md:hidden">
        {
          banners.map((banner, i) => {
            return <img
              key={i}
              src={banner}
              width="1280"
              height="720"
              alt=""
              className={`
                                ${i == 1 ? 'col-start-1 col-end-3 h-[200px]' : i == 2 ? 'col-start-3 col-end-4 h-[200px]' : 'col-start-1 col-end-4 h-[300px]'}
                                object-cover
                            `}
            />
          })
        }
      </div>
    </div>
  )
};

export default AboutUsBanner;
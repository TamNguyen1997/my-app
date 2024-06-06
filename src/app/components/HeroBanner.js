import Image from 'next/image';
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"

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

const images = [
  "/gallery/banner/5c29faad-d59f-4f24-a487-7f8c8f03e8da.jpg",
  "/gallery/banner/1147b9ec-bdbb-4387-96f6-82b6462bcdb7.jpg",
  "/gallery/banner/1147b9ec-bdbb-4387-96f6-82b6462bcdb7.jpg",
  "/gallery/banner/1147b9ec-bdbb-4387-96f6-82b6462bcdb7.jpg",
  "/gallery/banner/1147b9ec-bdbb-4387-96f6-82b6462bcdb7.jpg",
]

const HeroBanner = () => {
  return (
    <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={5000}>
      {
        images.map((s, i) => {
          return <Image key={i} width="1280" height="720" className="w-full h-full" src={s} alt={s}/>
        })
      }
    </Carousel>
  );
};

export default HeroBanner;

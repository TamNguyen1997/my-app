import { useEffect, useState } from 'react';
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

const HeroBanner = () => {
  const [banners, setBanners] = useState([])

  useEffect(() => {
    fetch("/api/images/banner/display").then(res => res.json()).then(body => {
      const scheduledBanners = body.scheduledBanners ? Object.groupBy(body.scheduledBanners, ({ order }) => order) : {}
      const defaultBanners = body.defaultBanners ? Object.groupBy(body.defaultBanners, ({ order }) => order) : {}

      let images = []
      for (let i = 0; i < 5; i++) {
        if (scheduledBanners[i]) {
          images.push(scheduledBanners[i][0].image)
        } else if (defaultBanners[i]) {
          images.push(defaultBanners[i][0].image)
        }
      }

      setBanners(images)
    })
  }, [])
  return (
    <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={5000}>
      {
        banners.map((banner, i) => {
          return <img key={i} width="1280" height="720" className="w-full h-full" src={process.env.NEXT_PUBLIC_FILE_PATH + banner?.path} alt={banner?.alt} />
        })
      }
    </Carousel>
  );
};

export default HeroBanner;

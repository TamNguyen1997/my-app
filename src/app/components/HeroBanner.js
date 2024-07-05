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

const imageUrl = "/api/images/banner"

const HeroBanner = () => {
  const [banners, setBanners] = useState([])

  useEffect(() => {
    const getData = async () => {
      const dBanners = await fetch(`${imageUrl}?type=DEFAULT`).then(res => res.json())
      const sBanners = await fetch(`${imageUrl}?type=SCHEDULED&inrange=true`).then(res => res.json())

      const scheduledBanners = sBanners ? Object.groupBy(sBanners, ({ order }) => order) : {}
      const defaultBanners = dBanners ? Object.groupBy(dBanners, ({ order }) => order) : {}

      let images = []
      for (let i = 0; i < 5; i++) {
        if (scheduledBanners[i] && scheduledBanners[i][0].image && scheduledBanners[i][0].active) {
          images.push(scheduledBanners[i][0].image)
        } else if (defaultBanners[i] && defaultBanners[i][0]?.image) {
          images.push(defaultBanners[i][0].image)
        }
      }

      setBanners(images)
    }
    getData()
  }, [])

  return (
    <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={5000}>
      {
        banners.reverse().map((banner, i) => {
          return <img key={i} width="1280" height="720" className="w-full h-full max-h-[500px]" src={process.env.NEXT_PUBLIC_FILE_PATH + banner?.path} alt={banner?.alt} />
        })
      }
    </Carousel>
  );
};

export default HeroBanner;

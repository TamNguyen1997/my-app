"use client"
import { Image } from "@nextui-org/react"
import Link from "next/link"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"

const logo = [
  "/icon/client/BW.png",
  "/icon/client/Fusion.png",
  "/icon/client/Hilton.png",
  "/icon/client/Hoiana.png",
  "/icon/client/Hyatt.png",
  "/icon/client/Inter.png",
  "/icon/client/JW.png",
  "/icon/client/Melia.png",
  "/icon/client/Movenpick.png",
  "/icon/client/Novotel.png",
  "/icon/client/Pullman.png",
  "/icon/client/Regent.png",
  "/icon/client/Novotel.png",
  "/icon/client/Sheraton.png",
  "/icon/client/TheGrand.png",
  "/icon/client/Wyndham.png",
  "/icon/client/Caravelle.png",
  "/icon/client/El-Gaucho.png",
  "/icon/client/Gallery.png",
  "/icon/client/Jollibee.png",
  "/icon/client/Starbucks.png",
]

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 4
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2
  }
}

const Customer = () => {

  return (
    <>
      <Carousel infinite responsive={responsive} className="w-full items-center mb-6" autoPlaySpeed={3000} autoPlay arrows={false} showDots centerMode >
        {
          logo.splice(0, logo.l).map((l, i) => <div className="p-3 w-full h-full m-auto items-center text-center content-center" key={i}>
            <Image
              className="group-hover:opacity-50
              hover:-translate-y-2.5 hover:scale-[1.02]
              hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15)]"
              width={200}
              height={100}
              src={l}
              alt={l}
            />
          </div>)
        }
      </Carousel>
      <Carousel infinite responsive={responsive} className="w-full items-center mb-6" autoPlaySpeed={3000} autoPlay arrows={false} showDots centerMode >
        {
          logo.map((l, i) => <div className="p-3 w-full h-full m-auto items-center text-center content-center" key={i}>
            <Image
              className="group-hover:opacity-50
              hover:-translate-y-2.5 hover:scale-[1.02]
              hover:shadow-[0px_10px_10px_rgba(0,0,0,0.15)]"
              width={200}
              height={100}
              src={l}
              alt={l}
            />
          </div>)
        }
      </Carousel>
    </>
  )
}

export default Customer

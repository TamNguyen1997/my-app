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

  return (<>

    <div className="bg-[#ffd300] rounded-tr-[50px] rounded-bl-[50px] flex items-center w-1/3 h-[50px] m-auto shadow-md">
      <Link href="/" className="m-auto text-black font-bold text-xl">KHÁCH HÀNG SAO VIỆT</Link>
    </div>

    <Carousel infinite responsive={responsive} className="w-full items-center" autoPlaySpeed={5000} autoPlay arrows={false} showDots centerMode>
      {
        logo.map((l, i) => <div className="p-3 w-full h-full m-auto items-center text-center content-center" key={i}>
          <img
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

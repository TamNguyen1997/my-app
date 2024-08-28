import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"

const logo = [
  "/brand/Rubbermaid.png",
  "/brand/Logo-Mapa.png",
  "/brand/KLEEN-TEX.png",
  "/brand/Logo-Moerman.png",
  "/brand/Logo-Kimberly-Clark.png",
  "/brand/Logo-Ghibli.png"
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

const Partner = () => {

  return (<>
    <Carousel infinite responsive={responsive} className="w-full items-center" autoPlaySpeed={3000} autoPlay arrows={false} showDots centerMode>
      {
        logo.map((l, i) => <div className="p-3 w-full h-full m-auto items-center text-center content-center" key={i}>
          <img
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

export default Partner

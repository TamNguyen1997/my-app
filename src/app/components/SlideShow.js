import { useEffect, useState } from "react"
import { BsFillArrowRightCircleFill, BsFillArrowLeftCircleFill } from "react-icons/bs"

export default function Carousel({ timeout, slides }) {

  const [current, setCurrent] = useState(0)
  
  const previous = () => {
    if (current === 0) setCurrent(slides.length - 1)
    else setCurrent(current - 1)
  }

  const next = () => {
    if (current === slides.length - 1) setCurrent(0)
    else setCurrent(current + 1)
  }

  useEffect(() => {
    const interval = setInterval(next, timeout);
    return () => clearInterval(interval);
  }, [])

  return (
    <div className="overflow-hidden relative">
      <div className={`flex transition ease-out duration-400`} style={{
        transform: `translateX(-${current * 100}%)`
      }}>
        {
          slides.map((s, i) => {
            return <img
              key={i}
              src={s}
              alt=""
            />
          })
        }
      </div>
      <div className="absolute top-0 h-full w-full justify-between items-center flex text-white px-10 text-3xl">
        <button onClick={previous}>
          <BsFillArrowLeftCircleFill />
        </button>
        <button onClick={next}>
          <BsFillArrowRightCircleFill />
        </button>
      </div>

      <div className="absolute bottom-0 py-4 flex justify-center gap-3 w-full">
        {
          slides.map((s, i) => {
            return <div key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full w-5 h-5 cursor-pointer ${i == current ? "bg-white" : "bg-gray-500"}`}></div>
          })
        }
      </div>
    </div>
  )
}
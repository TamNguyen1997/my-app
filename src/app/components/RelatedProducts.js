"use client"
import { useEffect, useState } from "react"
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProductCard from "./product/ProductCard";

const RelatedProducts = ({ query }) => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch(`/api/products/${query}`).then(res => res.json()).then(json => setProducts(json.result))
  }, [query])

  return (<>
    <div className="relative">
      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        centerMode={false}
        className=""
        containerClass={`
          [&>button]:invert [&>button]:rounded-none pb-10
          [&_li]:pr-2
          sm:[&_li]:pr-[30px]
        `}
        dotListClass={`
          [&_li]:px-0.5
          [&_li]:flex
          [&_li]:items-center
          [&_button]:w-3
          [&_button]:h-3
          [&_button]:min-w-3
          [&_button]:min-h-3  
          [&_button]:!border-black
          [&_button]:!border-[1px]
          [&>.react-multi-carousel-dot--active>button]:w-4
          [&>.react-multi-carousel-dot--active>button]:h-4
          [&>.react-multi-carousel-dot--active>button]:min-w-4
          [&>.react-multi-carousel-dot--active>button]:min-h-4
          transition
        `}
        draggable={false}
        focusOnSelect={false}
        infinite={false}
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={{
          desktop: {
            breakpoint: {
              max: 3000,
              min: 1024
            },
            items: 4,
            partialVisibilityGutter: 40
          },
          mobile: {
            breakpoint: {
              max: 464,
              min: 0
            },
            items: 1,
            partialVisibilityGutter: 30
          },
          tablet: {
            breakpoint: {
              max: 1024,
              min: 464
            },
            items: 2,
            partialVisibilityGutter: 30
          }
        }}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        {
          products.map((product) => <ProductCard product={product} key={product.id} />)
        }
      </Carousel>
    </div>
  </>)
}

export default RelatedProducts

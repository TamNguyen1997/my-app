"use client"

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Children } from "react";
import { Heart, Search } from "lucide-react";

const responsive = {
	desktop: {
		breakpoint: {
			max: 3000,
			min: 1024
		},
		items: 1
	},
	mobile: {
		breakpoint: {
			max: 464,
			min: 0
		},
		items: 1
	},
	tablet: {
		breakpoint: {
			max: 1024,
			min: 464
		},
		items: 1
	}
};

const images = [...Array(6)].map((_, index) => `/gallery/${index % 2 ? "free-images" : "3"}.jpg`);

const CustomDot = ({
	index,
	onClick,
	active,
	carouselState: { currentSlide }
}) => {
	return (
		<button
			onClick={e => {
				onClick();
				e.preventDefault();
			}}
			className={("custom-dot", {
				"custom-dot--active": active
			})}
		>
			<img src={Children.toArray(images)[index]} alt="" />
		</button>
	);
};

export default ({ items }) => {
	return (
		<>
			<Carousel
				responsive={responsive}
				arrows
				autoPlay={false}
				autoPlaySpeed={2000}
				className=""
				containerClass="[&>button]:invert [&>button]:rounded-none pb-2.5"
				dotListClass={`
					!static
					sm:!grid
					!hidden
					gap-2
					!px-2
					grid-cols-[repeat(auto-fit,minmax(100px,1fr))]
					!justify-start
					[&_button]:!rounded-none 
					[&_button]:!bg-white
					[&_button]:!h-[85px]
					[&_button]:border
					[&_button]:!border-[#e3e3e3]
					[&_button]:p-1
					[&_button_img]:object-cover
					[&>.react-multi-carousel-dot--active>button]:!bg-[#ffd300]
				`}
				draggable={false}
				swipeable
				focusOnSelect={false}
				infinite
				itemClass=""
				keyBoardControl
				pauseOnHover={false}
				renderArrowsWhenDisabled={false}
				renderButtonGroupOutside={false}
				renderDotsOutside
				rewind={false}
				rewindWithAnimation={false}
				rtl={false}
				shouldResetAutoplay
				showDots
				sliderClass=""
				slidesToSlide={1}
				customDot={<CustomDot />}
			>
				{
					images.map((img, index) => {
						return (
							<div className="relative" key={index}>
								<img src={img} alt="" className="w-full" />
								<Heart size="24" className="absolute top-9 left-9" />
								<Search size="24" className="absolute bottom-5 right-2" />
							</div>
						)
					})
				}
			</Carousel>
		</>
	)
}

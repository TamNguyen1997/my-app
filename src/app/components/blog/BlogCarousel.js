"use client"

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import BlogItem from "@/components/blog/BlogItem";

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

export default ({ items }) => {
	return (
		<Carousel
			responsive={responsive}
			arrows={false}
			autoPlay
			autoPlaySpeed={2000}
			className=""
			containerClass="pb-8"
			dotListClass={`
                !justify-start
                [&_button]:!w-[43px]
                [&_button]:!h-[3px]
                [&_button]:!border-none
                [&_button]:!rounded-none 
                [&_button]:!bg-[#bdbdbd]
                [&>.react-multi-carousel-dot--active>button]:!bg-[#ffd300]
            `}
			draggable={false}
			swipeable={false}
			focusOnSelect={false}
			infinite
			itemClass=""
			keyBoardControl
			pauseOnHover
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
		>
			{
				items.map(item => {
					return (
						<div key={item.id} className="px-0.5">
							<BlogItem
								item={item}
								containerClass=""
								noBorder
								textClass={`
														[&>.blog-category]:text-[15px]
														[&>.blog-category]:leading-normal
														[&>.blog-title]:text-[22px]
														[&>.blog-description]:text-base
													`}
							/>
						</div>
					)
				})
			}
		</Carousel>
	)
}

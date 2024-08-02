import { Image } from '@nextui-org/react';
import { useState } from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

const AboutUsMilestone = () => {
    const [images] = useState([
        "https://id.elsaspeak.com/wp-content/themes/elsawebsite/pages/about-us/images/banner/img-slider01.jpg",
        "https://id.elsaspeak.com/wp-content/themes/elsawebsite/pages/about-us/images/banner/img-slider02.jpg",
        "https://cdn.theatlantic.com/thumbor/viW9N1IQLbCrJ0HMtPRvXPXShkU=/0x131:2555x1568/976x549/media/img/mt/2017/06/shutterstock_319985324/original.jpg",
        "https://id.elsaspeak.com/wp-content/themes/elsawebsite/pages/about-us/images/banner/img-slider04.jpg",
    ]);

    return (
        <div className="container pt-10">
            <div className="max-w-full overflow-hidden">
                <h2
                    className="text-3xl font-semibold bg-[linear-gradient(291.66deg,#713ff4_25.14%,#cd55ff_104.99%)] bg-clip-text mb-8"
                    style={{ WebkitTextFillColor: 'rgba(0,0,0,0)' }}
                >
                    Lịch sử hình thành
                </h2>

                {/* <Carousel
                    responsive={responsive}
                    infinite
                    autoPlay
                    autoPlaySpeed={5000}
                    className="[&_li]:aspect-[1/1] [&_li]:px-4 -mx-4 mb-6"
                >
                    {
                        images.map((image, i) => {
                            return <img
                                key={i}
                                src={image}
                                width="1280"
                                height="720"
                                alt=""
                                className="w-full h-[calc(100%_-_32px)] object-cover"
                            />
                        })
                    }
                </Carousel> */}

                <Image
                    width={800}
                    height={600}
                    src='/about-us/image.png'
                />
            </div>
        </div>
    )
}

export default AboutUsMilestone;
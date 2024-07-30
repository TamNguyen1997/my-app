import { useState } from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 10
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 7
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 7
    }
};

const AboutUsPartner = () => {
    const [partners] = useState([
        "https://id.elsaspeak.com/wp-content/themes/elsawebsite/pages/about-us/images/partner/logo1.png",
        "https://id.elsaspeak.com/wp-content/themes/elsawebsite/pages/about-us/images/partner/logo2.png",
        "https://id.elsaspeak.com/wp-content/themes/elsawebsite/pages/about-us/images/partner/logo3.png",
        "https://id.elsaspeak.com/wp-content/themes/elsawebsite/pages/about-us/images/partner/logo4.png",
        "https://id.elsaspeak.com/wp-content/themes/elsawebsite/pages/about-us/images/partner/logo5.png",
        "https://id.elsaspeak.com/wp-content/themes/elsawebsite/pages/about-us/images/partner/logo6.png",
        "https://id.elsaspeak.com/wp-content/themes/elsawebsite/pages/about-us/images/partner/logo7.png",
        "https://id.elsaspeak.com/wp-content/themes/elsawebsite/pages/about-us/images/partner/logo8.png",
        "https://id.elsaspeak.com/wp-content/themes/elsawebsite/pages/about-us/images/partner/logo9.png",
        "https://id.elsaspeak.com/wp-content/themes/elsawebsite/pages/about-us/images/partner/logo10.png",
        "https://id.elsaspeak.com/wp-content/themes/elsawebsite/pages/about-us/images/partner/logo11.png",
    ]);

    return (
        <div className="bg-[#eff2f8]">
            <div className="container pt-[60px] pb-10">
                <div className="max-w-full overflow-hidden">
                    <h2 className="text-3xl font-semibold text-center mb-8">
                        Kami didukung oleh
                    </h2>

                    <Carousel
                        responsive={responsive}
                        infinite
                        autoPlay
                        autoPlaySpeed={5000}
                        showDots={false}
                        renderDotsOutside
                        arrows={false}
                        className="
                            [&_li]:px-1
                            -mx-1 mb-6
                        "
                        dotListClass={`
                            [&_button]:!w-[10px]
                            [&_button]:!h-[10px]
                            [&_button]:!border-none
                            [&_button]:!mx-1
                            [&_button]:!bg-[#dcdcdc]
                            [&>.react-multi-carousel-dot--active>button]:!bg-[#478dff]
                            -translate-y-3
                        `}
                    >
                        {
                            partners.map((partner, i) => {
                                return <img
                                    key={i}
                                    src={partner}
                                    width="1280" 
                                    height="720" 
                                    alt=""
                                    className="w-full h-full max-w-[80px] object-contain"
                                />
                            })
                        }
                    </Carousel>
                </div>
            </div>
        </div>
    )
};

export default AboutUsPartner;
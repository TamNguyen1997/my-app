import Carousel from "./SlideShow";

const HeroBanner = () => {
  const images = [
    "/gallery/banner/5c29faad-d59f-4f24-a487-7f8c8f03e8da.jpg",
    "/gallery/banner/1147b9ec-bdbb-4387-96f6-82b6462bcdb7.jpg"
  ]
  return (
    <div className="w-[75%] m-auto">
      <Carousel slides={images}></Carousel>
    </div>
  );
};

export default HeroBanner;

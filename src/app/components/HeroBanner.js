import Carousel from "./SlideShow";

const HeroBanner = () => {
  const images = [
    "https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg",
    "https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg",
    "https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg",
  ]
  return (
    <div className="w-[60%] m-auto">
      <Carousel timeout={10000} slides={images}></Carousel>
    </div>
  );
};

export default HeroBanner;

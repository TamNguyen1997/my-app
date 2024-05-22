import Carousel from "./SlideShow";

const HeroBanner = () => {
  const images = [
    "https://dungcuvesinhsaoviet.com/wp-content/uploads/2021/11/Banner-dung-cu-ve-sinh-Rubbermaid-Commercial-01.jpg",
    "https://dungcuvesinhsaoviet.com/wp-content/uploads/2021/11/Banner-gang-tay-bao-ho-MAPA-01.jpg",
    "https://dungcuvesinhsaoviet.com/wp-content/uploads/2021/11/Banner-dung-cu-ve-sinh-kinh-Moerman-03.jpg",
  ]
  return (
    <div className="w-[75%] m-auto">
      <Carousel timeout={10000} slides={images}></Carousel>
    </div>
  );
};

export default HeroBanner;

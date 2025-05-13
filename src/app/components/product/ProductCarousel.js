
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProductCard from "@/components/product/ProductCard";

const defaultResponsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1279 },
    items: 10,
  },
  largeDesktop: {
    breakpoint: { max: 3000, min: 1279 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 1279, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 750 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 750, min: 0 },
    items: 2,
  },
};

const ProductCarousel = ({ products, responsive = defaultResponsive }) => {
  return (
    <>
      <Carousel
        responsive={responsive}
        infinite
        className="[&_.react-multi-carousel-track]"
      >
        {products.map((product) => {
          return (
            <div key={product.id} className="h-full hover:opacity-75 [&>div]:mx-auto">
              <ProductCard product={product} />
            </div>
          );
        })}
      </Carousel>
    </>
  );
};

export default ProductCarousel
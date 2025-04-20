"use client";

import { Button, Link } from "@nextui-org/react";
import { useCallback, useState } from "react";
import "react-multi-carousel/lib/styles.css";
import ProductCarousel from "@/components/product/ProductCarousel";
import PopularBrandCard from "@/components/product/PopularBrandCard";
import { motion } from "framer-motion";

const PopularItems = ({
  highlightProducts = [],
  highlightCatesWithProducts = [],
  brandToProducts = {}
}) => {
  const [selectedBrand, setSelectedBrand] = useState("RUBBERMAID");

  const getProducts = useCallback(() => {
    return brandToProducts[selectedBrand] || []
  }, [selectedBrand])

  const getSelectedColor = (value) => {
    return selectedBrand === value ? "bg-slate-700" : "bg-black";
  };

  return (
    <motion.div
      initial={{ x: 200, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      viewport={{ once: true }}
      className="pb-[60px] pt-4 mx-auto sm:w-3/4 flex flex-col gap-11"
    >
      <ProductCards name="SẢN PHẨM NỔI BẬT" products={highlightProducts} />
      <div>
        <div className="bg-black grid lg:grid-cols-6 sm:grid-cols-3">
          {["RUBBERMAID", "GHIBLI", "MOERMAN", "MAPA", "KLEEN-TEX", "KIMBERLY-CLARK"].map(brand => (
            <Button
              key={brand}
              radius="none"
              onClick={() => setSelectedBrand(brand)}
              className={`${getSelectedColor(brand)} text-white text-medium font-bold hover:bg-slate-800 border-r border-white`}
            >
              {brand}
            </Button>
          ))}
        </div>

        <PopularBrandCard
          products={getProducts()}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
        />
      </div>

      {highlightCatesWithProducts
        .filter(item => item.product.length)
        .map((cate, i) => (
          <div key={i}>
            <ProductCards banner={cate.imageUrl} products={cate.product} name={cate.name} />
            <Link
              isExternal
              href={`/${cate.slug}`}
              className="flex justify-center items-center text-black font-semibold w-[181px] bg-white h-[43px] rounded-[30px] border border-black hover:bg-[#FFD400] transition mx-auto"
            >
              Xem thêm
            </Link>
          </div>
        ))}
    </motion.div>

  );
}

const ProductCards = ({ name, products, redirect, banner }) => {
  const CategoryDisplay = () => (
    <div className="bg-[#FFD400] rounded-tr-[50px] rounded-bl-[50px] flex items-center sm:w-2/3 md:w-1/3 min-w-[240px] h-[50px] m-auto shadow-md">
      <div className="m-auto text-black font-bold md:text-xl">
        {name}
      </div>
      {redirect ? (
        <Link
          isExternal
          href={redirect}
          className="flex justify-center items-center font-semibold w-[181px] text-black
              h-[43px] rounded-[30px] border border-black hover:bg-[#FFD400] transition mx-auto"
        >
          Xem thêm
        </Link>
      ) : (
        ""
      )}
    </div>
  );

  const BannerDisplay = () => (
    <div className="w-full">
      <img
        style={{ maxWidth: "100%", width: "100%" }}
        src={`${banner}`}
        alt="Banner"
      />
    </div>
  );
  return (
    <section className="rounded-tr-[50px] rounded-tl-[50px] pb-3">
      <div className="p-3 pt-0 rounded-md">
        <div className="py-3">
          {banner ? <BannerDisplay /> : <CategoryDisplay />}
        </div>
        <div className="mx-auto lg:max-w-full [&_.react-multi-carousel-track]:pt-3 -mt-3">
          <ProductCarousel
            products={products}
          />
        </div>
      </div>
    </section>
  );
};

export default PopularItems
"use client";

import { Button, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";
import "react-multi-carousel/lib/styles.css";
import ProductCarousel from "@/components/product/ProductCarousel";
import PopularBrandCard from "@/components/product/PopularBrandCard";
import { motion } from "framer-motion";

const brandKeyToSlug = {
  "RUBBERMAID": "thuong-hieu-rubbermaid",
  "MOERMAN": "thuong-hieu-moerman",
  "MAPA": "thuong-hieu-mapa",
  "GHIBLI": "thuong-hieu-ghibli",
  "KIMBERLY-CLARK PROFESSIONAL": "thuong-hieu-kimberly-clark",
  "KLEEN-TEX": "thuong-hieu-kleen-tex",
}

const PopularItems = ({ highlightProducts = [], highlightCatesWithProducts = [] }) => {
  const [selectedBrand, setSelectedBrand] = useState("RUBBERMAID");

  const [brandProducts, setBrandProducts] = useState([]);

  useEffect(() => {
    fetch(`/api/brands/${brandKeyToSlug[selectedBrand]}/products/?active=true&size=7`)
      .then((res) => res.json())
      .then((json) => setBrandProducts(json.products))
  }, [selectedBrand]);

  const getSelectedColor = (value) => {
    return selectedBrand === value ? "bg-slate-700" : "bg-black";
  };

  return (
    <motion.div
      initial={{ x: 200, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      viewport={{ once: true }}
      className="pb-[60px] pt-4 mx-auto sm:w-3/4 ">
      <div className="flex flex-col gap-11">
        <div>
          <ProductCards name="SẢN PHẨM NỔI BẬT" products={highlightProducts} />
        </div>

        <div>
          <div className="bg-black grid lg:grid-cols-6 sm:grid-cols-3">
            <Button
              radius="none"
              onClick={() => {
                setSelectedBrand("RUBBERMAID");
              }}
              className={`${getSelectedColor(
                "RUBBERMAID"
              )} text-white text-medium font-bold hover:bg-slate-800 border-r border-white`}
            >
              RUBBERMAID
            </Button>
            <Button
              radius="none"
              onClick={() => {
                setSelectedBrand("GHIBLI");
              }}
              className={`${getSelectedColor(
                "GHIBLI"
              )} text-white text-medium font-bold border-r hover:bg-slate-800`}
            >
              GHIBLI
            </Button>
            <Button
              radius="none"
              onClick={() => {
                setSelectedBrand("MOERMAN");
              }}
              className={`${getSelectedColor(
                "MOERMAN"
              )} text-white text-medium font-bold hover:bg-slate-800 border-r border-white`}
            >
              MOERMAN
            </Button>
            <Button
              radius="none"
              onClick={() => {
                setSelectedBrand("MAPA");
              }}
              className={`${getSelectedColor(
                "MAPA"
              )} text-white text-medium font-bold hover:bg-slate-800 border-r border-white`}
            >
              MAPA
            </Button>
            <Button
              radius="none"
              onClick={() => {
                setSelectedBrand("KLEEN-TEX");
              }}
              className={`${getSelectedColor(
                "KLEEN-TEX"
              )} text-white text-medium font-bold hover:bg-slate-800 border-r border-white`}
            >
              KLEEN-TEX
            </Button>
            <Button
              radius="none"
              onClick={() => {
                setSelectedBrand("KIMBERLY-CLARK PROFESSIONAL");
              }}
              className={`${getSelectedColor(
                "KIMBERLY-CLARK PROFESSIONAL"
              )} text-white text-medium font-bold hover:bg-slate-800 border-r border-white`}
            >
              KIMBERLY-CLARK
            </Button>
          </div>

          <PopularBrandCard
            products={brandProducts}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
          />
        </div>

        {
          highlightCatesWithProducts.filter(item => item.product.length).map((cate, i) => {
            return <div key={i} className="">
              <ProductCards banner={cate.image?.path} products={cate.product} name={cate.name} />
              <Link isExternal
                href={`/${cate.slug}`}
                className="flex justify-center items-center text-black font-semibold w-[181px] bg-white
              h-[43px] rounded-[30px] border border-black hover:bg-[#FFD400] transition mx-auto"
              >
                Xem thêm
              </Link>
            </div>
          }
          )
        }

      </div>
    </motion.div>
  );
}

const ProductCards = ({ name, products, redirect, banner }) => {
  const CategoryDisplay = () => (
    <>
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
    </>
  );

  const BannerDisplay = () => (
    <div className="w-full">
      <img
        style={{ maxWidth: "100%", width: "100%" }}
        src={`${process.env.NEXT_PUBLIC_FILE_PATH + banner}`}
        alt="Banner"
      />
    </div>
  );
  return (
    <div>
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
    </div>
  );
};

export default PopularItems
"use client";

import HeroBanner from "@/components/HeroBanner";
import PopularItems from "@/components/PopularItems";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <div className="flex flex-col">
        <div className="text-2xl font-bold text-center mt-10 mb-10">
          Sản phẩm bán chạy
        </div>
        <div className="pb-12">
          <PopularItems />
        </div>
      </div>
    </div>
  );
}

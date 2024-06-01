"use client";

import HeroBanner from "@/components/HeroBanner";
import PopularItems from "@/components/PopularItems";
import PopularBlogs from "@/components/PopularBlogs";
import Customer from "@/components/Customer";

export default function Home() {
  return (
    <div className="w-3/4 m-auto">
      <div>
        <HeroBanner />
      </div>
      <div className="pb-12 pt-3">
        <PopularItems />
      </div>
      <div className="pb-12 pt-3">
        <PopularBlogs />
      </div>
      <div className="pb-12 pt-3">
        <Customer />
      </div>
    </div>
  );
}

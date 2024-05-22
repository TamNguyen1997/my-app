"use client";

import HeroBanner from "@/components/HeroBanner";
import PopularItems from "@/components/PopularItems";
import PopularBlogs from "@/components/PopularBlogs";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <div className="flex flex-col">
        <div className="pb-12">
          <PopularItems />
        </div>
      </div>
      <PopularBlogs />
    </div>
  );
}

"use client";

import BlogOverview from "@/components/blog/BlogOverview"

export default () => {
  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay/tu-van-chon-mua`} />
      <BlogOverview activeCategory="INFORMATION" activeTag="tu-van-chon-mua" />
    </>
  )
};

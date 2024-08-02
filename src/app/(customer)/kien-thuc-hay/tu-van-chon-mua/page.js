"use client";

import BlogOverview from "@/components/blog/BlogOverview"

const News = () => {
  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay/tu-van-chon-mua`} />
      <BlogOverview activeCategory="INFORMATION" activeTag="ADVISORY" />
    </>
  )
};

export default News;

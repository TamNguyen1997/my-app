"use client";

import BlogOverview from "@/components/blog/BlogOverview"

const News = () => {
  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay/tu-dien-thuat-ngu`} />
      <BlogOverview activeCategory="INFORMATION" activeTag="tu-dien-thuat-ngu" />
    </>
  )
};

export default News;

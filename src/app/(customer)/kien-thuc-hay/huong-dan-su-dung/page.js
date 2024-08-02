"use client";

import BlogOverview from "@/components/blog/BlogOverview"

const News = () => {
  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay/huong-dan-su-dung`} />
      <BlogOverview activeCategory="INFORMATION" activeTag="MANUAL" />
    </>
  )
};

export default News;

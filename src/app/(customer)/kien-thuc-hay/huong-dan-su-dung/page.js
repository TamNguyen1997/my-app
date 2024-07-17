"use client";

import BlogOverview from "@/components/BlogOverview"

const News = () => {
  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay/huong-dan-su-dung`} />
      <BlogOverview activeCategory="INFORMATION" activeTag="huong-dan-su-dung" />
    </>
  )
};

export default News;

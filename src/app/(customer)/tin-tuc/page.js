"use client";

import BlogOverview from "@/components/BlogOverview"

const News = () => {
  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/tin-tuc`} />
      <BlogOverview activeCategory="NEWS" activeTag="" />
    </>
  )
};

export default News;

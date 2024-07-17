"use client";

import BlogOverview from "@/components/BlogOverview"

const Information = () => {
  return (<>
    <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay`} />
    <BlogOverview activeCategory="INFORMATION" activeTag="" />
  </>)
};

export default Information;

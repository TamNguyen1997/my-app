"use client";

import { BlogDetail } from "@/components/blog/BlogDetail"
import { useParams } from "next/navigation";

const News = () => {
  const { _id } = useParams()
  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/tin-tuc/${_id}`} />
      <BlogDetail slug={_id.toString()} category="NEWS" />
    </>
  )
};

export default News;

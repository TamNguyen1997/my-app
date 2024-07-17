"use client";

import BlogDetail from "@/components/BlogDetail"
import { useParams } from "next/navigation";

const Information = () => {
  const { _id } = useParams()
  return (
    <>
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/kien-thuc-hay/${_id}`} />
      <BlogDetail slug={_id.toString()} category="INFORMATION" />
    </>
  )
};

export default Information;

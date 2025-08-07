"use client"

import { Link } from "@heroui/react";
import { useParams } from "next/navigation";
import { BlogDetail } from "@/components/blog/BlogDetail"

const BlogPreview = () => {
  const { _id } = useParams()
  return (<>
    <Link href="/admin/blog">
      Trở về
    </Link>

    {
      <BlogDetail slug={_id.toString()} />
    }
  </>)
}
export default BlogPreview
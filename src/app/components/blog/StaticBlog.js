"use client"
import { BlogContent } from "@/components/blog/BlogDetail"
import { Spinner } from "@heroui/react"
import { useEffect, useState } from "react"

const StaticBlog = ({ slug }) => {
  const [blog, setBlog] = useState({ content: "" })

  useEffect(() => {
    fetch(`/api/blogs/${slug}`).then(res => res.json()).then(setBlog)
  }, [])
  if (!blog.id) return <Spinner className="flex m-auto pt-10 w-full h-full" />

  return (<>
    <div className="container pt-5 pb-20">
      <BlogContent blog={blog} />
    </div>
  </>)
}

export default StaticBlog